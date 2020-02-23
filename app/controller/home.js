const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    this.ctx.body = 'Hello world';
  }
}

module.exports = HomeController;