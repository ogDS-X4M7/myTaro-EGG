// 这里使用koa-jwt2中间件，调用jwt的方法过滤中间件配置传过来的unless路径，因此在使用该中间件的时候会配置unless

const jwt = require("koa-jwt2");
module.exports = options => {
    return jwt(options).unless(options.unless);
};
