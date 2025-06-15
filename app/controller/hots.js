const Controller = require('egg').Controller;

const res = require("../constant/hotResponse.json")

class HotsController extends Controller {
    index() {
        const ctx = this.ctx;
        ctx.body = {
            code: 200,
            data: res,
            success: true,
            msg: ``
        };
    };
}

module.exports = HotsController;