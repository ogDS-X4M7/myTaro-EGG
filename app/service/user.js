
const Service = require('egg').Service;

class UserService extends Service {
    async createUser(data) {
        return this.ctx.model.User({ ...data }).save();
    }

    async findUser(params = {}) {
        // 取得自己需要的字段 name role avatarUrl
        return this.ctx.model.User.find(params, 'name role avatarUrl').sort('-createDate').lean();
    }

    async findOneUser(params = {}) {
        // 取得自己需要的字段 name role，这里为了展示都有些什么，就把它们去掉
        // return this.ctx.model.User.findOne(params, 'name role').lean();
        return this.ctx.model.User.findOne(params).lean();
    }

    async updateOneUser(condition = {}, doc) {
        return this.ctx.model.User.updateOne(condition, doc).lean();
    }
    async deleteUser(id) {

        return this.ctx.model.User.remove({ _id: id }).lean();
    }

    async getWxOpenId(JSCODE) {
        const { ctx } = this;
        const { appId, appSecret } = ctx.app.config.wx;
        const result = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${JSCODE}&grant_type=authorization_code`, {
            dataType: 'json',
            timeout: 5000,
            method: 'GET',
            contentType: "application/json",
            data: JSON.stringify({})
        })
        const data = result.res.data;
        // console.log(data)
        if (!data.errcode) {
            console.log(data)
        } else if (data.errcode === 41008) {
            throw new Error('缺少 code')
        } else if (data.errcode === 40163) {
            throw new Error('code已经被使用')
        } else if (data.errcode === 40029) {
            throw new Error('code 无效')
        } else if (data.errcode === 45011) {
            throw new Error('操作太频繁，请稍候再试')
        } else if (data.errcode === -1) {
            throw new Error('系统繁忙，请稍候再试')
        }
        return data;
    }

    async createWxUser(data) {
        const ctx = this.ctx;
        // 查询是否已有用户，有的话就直接返回用户，没有再新建
        const user = await this.findOneUser({
            openId: data.openId
        })
        if (user) return user;
        const newUser = await ctx.model.User(data).save();
        console.log('创建新用户')
        return newUser;
    }

    async updateUser(data) {
        // const ctx = this.ctx;
        const updateRes = await this.updateOneUser({ _id: data.userid }, { $set: { avatarUrl: data.avatarUrl, name: data.userName } })
        return updateRes;
    }
}

module.exports = UserService;
