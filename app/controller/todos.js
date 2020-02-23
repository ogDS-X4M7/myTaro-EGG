const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
    text: 'string',
    creatorId: 'string',
};

// 注意这里的文件名加了s, 我们用这个来表示RESTful API的Controller，因此导出的class命名如下：
class TodosController extends Controller {

    async index() {
        // 这个index方法用来实现列表获取  注意：这是约定 这是GET请求
    }

    async create() {
        // 这个create方法用来实现数据插入  注意：这是约定 这是POST请求
        const ctx = this.ctx;
        // 由于是POST请求，对请求的body进行参数规则校验
        ctx.validate(createRule, ctx.request.body);
        try {
            // 按照约定，在这里就直接从ctx.service上获取到了todo这个service
            // 我们从请求体获取到要插入的数据，并且调用todo service的createTodo方法插入数据
            const newTodo = await ctx.service.todo.createTodo(ctx.request.body);
            // 注意下面的响应格式是我们系统的约定
            ctx.body = {
                code: 200,
                data: newTodo,
                success: true,
                msg: ``
            };
        }
        catch (err) {
            throw err;
        }

    }


    async update() {
        // 这个update方法用来实现数据更新  注意：这是约定 这是PUT请求
    }

    async destroy() {
        // 这个destroy方法用来实现数据删除  注意：这是约定 这是DELETE请求
    }
}
module.exports = TodosController;