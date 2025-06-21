/**
 * @Controller 用户
 */
const Controller = require('egg').Controller;
const { USER_TICKET, TICKET_USER_ID, TOKEN_USER_ID, USER_TOKEN, USER_DATA, USER_SESSIONKEY, USER_OPENID, TOKEN_USER_AVATARURL, TOKEN_USER_USERNAME } = require('../constant/redis');
const uuidv1 = require('uuid/v1');

const loginRule = {
    password: 'string',
    openId: 'string'
}

class UsersController extends Controller {

    async handleUser(user) {
        const ctx = this.ctx;
        // 使用默认角色
        let role = ctx.app.constant.DEFAULT_ROLE;
        // 如果用户分配了角色
        if (user.role) {
            role = user.role.name;
        }
        let ticket = await ctx.service.cache.get([USER_TICKET, user._id]);
        let token = await ctx.service.cache.get([USER_TOKEN, user._id]);
        if (!token || false) {
            // 使用config里面的secret签发一个Token，包含了用户的ID和角色，并且设置了有效时间
            token = ctx.app.jwt.sign({
                id: user._id,
                role
            }, ctx.app.config.jwt.secret, {
                expiresIn: ctx.app.config.jwt.expiresIn
            }
            );

            await ctx.service.cache.set([TOKEN_USER_ID, token], user._id, ctx.app.constant.TOKEN_EX);
            ticket = uuidv1();
            await ctx.service.cache.set([TICKET_USER_ID, ticket], user._id, ctx.app.constant.TOKEN_EX);
            await ctx.service.cache.set([USER_DATA, user._id], user, ctx.app.constant.TOKEN_EX);
            await ctx.service.cache.set([USER_TOKEN, user._id], token, ctx.app.constant.TOKEN_EX);
            await ctx.service.cache.set([USER_TICKET, user._id], ticket, ctx.app.constant.TOKEN_EX);
        }
        ctx.body = {
            code: 200,
            data: {
                user: {
                    _id: user._id,
                    userType: user.userType,
                    avatarUrl: user.avatarUrl,
                    name: user.name,
                },
                token: ticket,
                role
            },
            success: true,
            msg: ``
        };
    }

    /**
     * @Router POST /api/v1/users
     * @Request body createUserRequest createUserRequest 用户登录
     * @Response 200 baseResponse 响应
     * @Summary 创建用户（管理员）
     */
    async create() {
        const ctx = this.ctx;
        // 既然我们已经使用了swagger的contract，我们可以用它生产的rule来验证路由，一举两得。
        ctx.validate(ctx.rule.createUserRequest, ctx.body);
        try {
            const user = await ctx.service.user.findOneUser({
                name: ctx.request.body.name
            });
            if (user) {
                throw new Error('该用户名已经注册过');
            }
            const newUser = await ctx.service.user.createUser(ctx.request.body);
            ctx.body = {
                code: 200,
                data: {},
                success: true,
                msg: ``
            };
        } catch (err) {
            throw err;
        }

    };

    /**
     * @Router POST /api/v1/login
     * @Request body loginRequest * 用户名密码登录
     * @Response 200 loginResponse 响应
     */
    async login() {
        const ctx = this.ctx;
        ctx.validate(ctx.rule.createUserRequest, ctx.request.body);
        try {
            // 查询数据库
            const user = await ctx.service.user.findOneUser(ctx.request.body);
            if (user) {
                await this.handleUser(user);
            } else {
                throw new Error('验证code出错');
            }
        } catch (err) {
            throw err;
        }
    }

    async wxLogin() {
        // ctx 就是上下文，这里ctx.app.config就能拿到文件app/config/config.default.js
        const ctx = this.ctx;
        // console.log(ctx)
        // console.log(ctx.app.config)
        const { code } = ctx.request.body;
        const wxData = await ctx.service.user.getWxOpenId(code)
        // 前面getWxOpenId有做抛出错误，中间件error_handler会接手处理，所以如果有问题不会继续执行
        const { session_key, openid } = wxData;
        // createWxUser有则返回用户，无则新建用户
        const user = await ctx.service.user.createWxUser({
            // 需要的参数都看设定的模版——这里对应model/user
            openId: openid,
            platform: 0,//考虑不同平台，默认1系统，这里就得传0表示微信
        })
        // 获取token、头像、昵称
        let token = await ctx.service.cache.get([USER_TOKEN, user._id]);
        let avatarUrl = user.avatarUrl || 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
        let userName = user.name || '微信用户'
        // console.log(token);
        // 如果获取不到token，也就是redis中(缓存中)没有token，可能失效或者未注册用户，总之需要生成token，并且redis缓存token和用户信息
        if (!token) {
            console.log('生成token')
            token = ctx.app.jwt.sign({
                id: user._id
            }, ctx.app.config.jwt.secret, {
                expiresIn: ctx.app.config.jwt.expiresIn
            }
            );
            // 使用cache，也就是redis缓存token和用户信息
            await ctx.service.cache.set([USER_TOKEN, user._id], token, ctx.app.constant.TOKEN_EX)
            await ctx.service.cache.set([USER_DATA, user._id], user, ctx.app.constant.TOKEN_EX)
            // 缓存sessionkey、openid，缓存可以使用token获取的用户id、头像、昵称；
            await ctx.service.cache.set([USER_SESSIONKEY, user._id], session_key, ctx.app.constant.TOKEN_EX)
            await ctx.service.cache.set([USER_OPENID, user._id], openid, ctx.app.constant.TOKEN_EX)
            await ctx.service.cache.set([TOKEN_USER_ID, token], user._id, ctx.app.constant.TOKEN_EX)
            await ctx.service.cache.set([TOKEN_USER_AVATARURL, token], avatarUrl, ctx.app.constant.TOKEN_EX)
            await ctx.service.cache.set([TOKEN_USER_USERNAME, token], userName, ctx.app.constant.TOKEN_EX)
        }
        ctx.body = {
            code: 200,
            data: { token, avatarUrl, userName },
            success: true,
            msg: ''
        }
    }

    // 远程更新用户昵称与头像
    async userInfo() {
        const ctx = this.ctx;
        const { token, avatarUrl, userName } = ctx.request.body; // , avatarUrl, userName
        // console.log(token)
        // console.log(avatarUrl);
        // console.log(userName);
        let userid = await ctx.service.cache.get([TOKEN_USER_ID, token]);
        // console.log(userid);
        const updateRes = await ctx.service.user.updateUser({ userid: userid, avatarUrl: avatarUrl, userName: userName });
        // console.log(updateRes);
        // 更新头像昵称也需要缓存进redis
        await ctx.service.cache.set([TOKEN_USER_AVATARURL, token], avatarUrl, ctx.app.constant.TOKEN_EX)
        await ctx.service.cache.set([TOKEN_USER_USERNAME, token], userName, ctx.app.constant.TOKEN_EX)
        ctx.body = {
            code: 200,
            data: { updateRes },
            success: true,
            msg: '更新成功'
        }
    }

    // 自动登录功能接口
    async autoLogin() {
        const ctx = this.ctx;
        const { token } = ctx.request.body;
        // console.log(token)
        // 正是上面设置了可以通过token获取的id、头像、昵称，因此这里可以从redis里由token拿到头像昵称，实现快速自动登录效果
        let userAvatarUrl = await ctx.service.cache.get([TOKEN_USER_AVATARURL, token]);
        let userName = await ctx.service.cache.get([TOKEN_USER_USERNAME, token]);
        ctx.body = {
            code: 200,
            data: { userAvatarUrl, userName },
            success: true,
            msg: '自动登录成功'
        }
    }

    // 更新浏览历史接口
    async updateHistory() {
        const ctx = this.ctx;
        const { token, history } = ctx.request.body;
        // 利用token在redis里拿到userid
        let userid = await ctx.service.cache.get([TOKEN_USER_ID, token]);
        // 再把id和history操作进数据库数组字段
        let res = await ctx.service.user.updateHistory({ userid, history })
        ctx.body = {
            code: 200,
            data: { res },
            success: true,
            msg: '记录浏览历史成功'
        }
    }

    // 获取浏览历史接口
    async getHistory() {
        const ctx = this.ctx;
        // 利用token在redis里拿到userid
        const { token } = ctx.request.body;
        let userid = await ctx.service.cache.get([TOKEN_USER_ID, token]);
        let res = await ctx.service.user.getHistory({ userid })
        ctx.body = {
            code: 200,
            data: { res },
            success: true,
            msg: '获取浏览历史成功'
        }
    }

    // 清空浏览历史接口
    async clearHistory(){
        const ctx = this.ctx;
        // 利用token在redis里拿到userid
        const { token } = ctx.request.body;
        let userid = await ctx.service.cache.get([TOKEN_USER_ID, token]);
        let res = await ctx.service.user.clearHistory({ userid });
        ctx.body = {
            code: 200,
            data: { res },
            success: true,
            msg: '清空浏览历史成功'
        }
    }

    // 更新点赞接口-包括增加和取消，传参token，url，signal信号-1表示点赞，0表示取消
    // 获取点赞接口
    // 更新收藏接口-包括增加和取消，传参token，url，signal信号-1表示点赞，0表示取消
    // 获取收藏接口
}
module.exports = UsersController;