/**
 * @Controller 用户
 */
const Controller = require('egg').Controller;
const { USER_TICKET, TICKET_USER_ID, TOKEN_USER_ID, USER_TOKEN, USER_DATA, EXE_USER_TOKEN } = require('../constant/redis');
const uuidv1 = require('uuid/v1');
// 定义删除接口的请求参数规则
const deleteRule = {
    id: 'string',
};

const exeLoginRule = {
    ticket: 'string'
}

const pwdLoginRule = {
    password: 'string',
    openId: 'string'
}

class UsersController extends Controller {

    async handleUser(user, refresh = false) {
        const ctx = this.ctx;
        let powers = [];
        // 使用默认角色
        let role = ctx.app.constant.DEFAULT_ROLE;
        // 如果用户分配了角色
        if (user.role) {
            role = user.role.name;
            powers = user.role.power.map(pow => pow.value)
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

            await ctx.service.cache.set([TOKEN_USER_ID, token], user._id, ctx.app.constant.TOKEN_EX * 60 * 60);
            ticket = uuidv1();
            await ctx.service.cache.set([TICKET_USER_ID, ticket], user._id, ctx.app.constant.TOKEN_EX * 60 * 60);
            await ctx.service.cache.set([USER_DATA, user._id], user, ctx.app.constant.TOKEN_EX * 60 * 60);
            await ctx.service.cache.set([USER_TOKEN, user._id], token, ctx.app.constant.TOKEN_EX * 60 * 60);
            await ctx.service.cache.set([USER_TICKET, user._id], ticket, ctx.app.constant.TOKEN_EX * 60 * 60);
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
                role,
                powers
            },
            success: true,
            msg: ``
        };
    }

    /**
     * @Router GET /api/v1/users
     * @Response 200 findUserResponse 响应
     * @Summary 查询用户列表（管理员）
     */
    async index() {
        const ctx = this.ctx;
        try {
            const user = await ctx.service.user.findUser({});
            ctx.body = {
                code: 200,
                data: user,
                success: true,
                msg: ``
            };
        } catch (err) {
            throw err;
        }
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
     * @Router PUT /api/v1/users
     * @Summary 修改用户（管理员）
     * @Deprecated
     */
    async update() {
        const ctx = this.ctx;
        ctx.validate(deleteRule, ctx.params);
        const result = await this.ctx.service.user.updateOneUser({
            _id: ctx.params.id
        }, ctx.request.body);
        if (result.ok) {
            ctx.body = {
                code: 200,
                data: {},
                success: true,
                msg: `修改成功`
            }
        }
    }

    /**
     * @Router DELETE /api/v1/users
     * @Summary 删除用户（管理员）
     * @Deprecated
     */
    async destroy() {
        const ctx = this.ctx;
        ctx.validate(deleteRule, ctx.params);
        const result = await this.ctx.service.user.deleteUser(ctx.params.id);
        if (result.ok) {
            ctx.body = {
                code: 200,
                data: {},
                success: true,
                msg: `删除成功`
            }
        }
    }

    // 用户名密码登录
    async login() {
        const ctx = this.ctx;
        ctx.validate(pwdLoginRule, ctx.request.body);
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
}
module.exports = UsersController;