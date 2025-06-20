const Controller = require('egg').Controller;

const res = 'https://ogds-x4m7.github.io/InternshipGain/'

class StudyController extends Controller {
    index() {
        const ctx = this.ctx;
        ctx.body = {
            code: 200,
            data: { res },
            success: true,
            msg: '获取学习页面成功'
        }
    };
}

module.exports = StudyController;