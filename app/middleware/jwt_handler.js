module.exports = option => {
    return async function auth(ctx, next) {
        try {
            // 默认跳转到下级中间件
            await next();
        } catch (err) {
            const pathname = ctx.request.url;
            if(err.status === 401) { // 如果 koa-jwt2 中间件验证不通过，会得到一个401
                if(/api\/v1/g.test(pathname)) { // 判断如果是调用Api请求的话，返回用户验证失败的响应
                    ctx.status = 401;
                    ctx.body = {
                        code: 401,
                        data: {},
                        success: false,
                        msg: `用户登录信息已失效，请尝试登录`
                    };
                } else { // 如果不是调api请求数据，则重定向到登录页
                    console.log('验证登录失败，跳转至首页登录');
                    ctx.redirect('/login');
                }
            } else { // 如果不是401状态，则把错误抛出，这个错误会被错误处理中间件获取
                throw err
            }
        }
    };
};