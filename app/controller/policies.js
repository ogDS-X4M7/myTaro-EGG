/**
 * @Controller 权限协议（超级管理员）
 */
const Controller = require('egg').Controller;
const createRule = {
    role: 'string',
    url: 'string',
    method: 'array'
};
const deleteRule = {
    id: 'string',
};
class PoliciesController extends Controller {
    /**
     * @Router GET /api/v1/policies
     * @Response 200 getPoliciesResponse 响应
     * @Summary 查询系统里面使用的权限协议
     */
    async index() {
        const ctx = this.ctx;
        try {
            ctx.body = {
                code: 200,
                data: ctx.app.enforcer.getPolicy(),
                success: true,
                msg: ``
            };
        }
        catch (err) {
            throw err;
        }
    }
    /**
     * @Router POST /api/v1/policies
     * @Request body createPoliciesRequest createPoliciesRequest 创建权限协议
     * @Response 200 baseResponse 响应
     * @Summary 创建权限协议
     */
    async create() {
        const ctx = this.ctx;
        ctx.validate(createRule, ctx.request.body);
        const { role, url, method } = ctx.request.body;
        const methodString = method.map( item => `(${item})`).join('|')
        try {
            const newPolicy = await ctx.app.enforcer.addPolicy(role, url, methodString);
            if(newPolicy) {
                ctx.body = {
                    code: 200,
                    data: {},
                    success: true,
                    msg: ``
                };
            } else {
                throw new Error('协议已经存在或者格式不对');
            }
        }
        catch (err) {
            throw err;
        }

    };

    
    /**
     * @Router DELETE /api/v1/policies
     * @Summary 删除协议
     * @Deprecated
     */
    async destroy() {
        const ctx = this.ctx;
        ctx.validate(deleteRule, ctx.params);
        const policy = ctx.params.id.replace(/\{1\}/g,'/').replace(/\{2\}/g,'*').replace(/\{3\}/g,'?').split('00000');
        const result = await ctx.app.enforcer.removePolicy(...policy);
        if(result) {
            ctx.body = {
                code: 200,
                data: {},
                success: true,
                msg: `删除成功`
            }
        }
    }
}
module.exports = PoliciesController;
