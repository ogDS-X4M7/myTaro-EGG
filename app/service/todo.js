const Service = require('egg').Service;

// 约定的service命名规范如下，首字母大写，驼峰形式
class TodoService extends Service {
    /**
     * this.ctx得到的是请求的上下文，在里面可以直接访问到了Todo modal
     * 调用mongoose的save方法创建一条新的记录，并且返回了一个Promise
     *
     * @param {*} data
     * @returns {Promise}
     * @memberof TodoService
     */
    async createTodo(data) {
        return this.ctx.model.Todo({...data}).save();
    }
}

module.exports = TodoService;
