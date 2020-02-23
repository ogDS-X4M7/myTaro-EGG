
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
        // 取得自己需要的字段 name role
        return this.ctx.model.User.findOne(params, 'name role').lean();
    }

    async updateOneUser(condition = {}, doc) {
        return this.ctx.model.User.updateOne(condition, doc).lean();
    }
    async deleteUser(id) {

        return this.ctx.model.User.remove({ _id: id }).lean();
    }
}

module.exports = UserService;
