const Service = require('egg').Service;

class RoleService extends Service {
    // 创建角色
    async createRole(data) {
        return this.ctx.model.Role({ ...data }).save();
    }

    // 查询角色
    // 使用分页，默认一页20条数据，默认从第1页开始
    async findRole(params = {}) {
        const pageSize = params && parseInt(params.pageSize) || 20;
        const page = params && parseInt(params.page) || 1;
        delete params.pageSize;
        delete params.page;
        return this.ctx.model.Role.find(params).limit(pageSize).skip(pageSize * (page - 1)).sort('-createDate').lean()
    }

    // 查询单个角色
    async findOneRole(params = {}) {
        return this.ctx.model.Role.findOne(params).lean()
    }

    // 更新单个角色以及权限
    async updateOneRole(condition = {}, doc) {
        // .update(condition,doc,[options],[callback]);
        return this.ctx.model.Role.updateOne(condition, { ...doc }).lean()
    }

    // 删除角色
    async removeRole(id) {
        return this.ctx.model.Role.remove({ _id: id }).lean();
    }
}

module.exports = RoleService;