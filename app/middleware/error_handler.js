module.exports = () => {
  // 导出一个方法
  return async function errorHandler(ctx, next) {
    try {
      // 由于是错误处理中间件，这里不做任何逻辑，直接跳到下一个中间件
      await next();
    } catch (err) {
      // 下级的中间件执行报错之后，在这里将错误捕获出来
      ctx.app.emit('error', err, ctx); // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志

      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let error = status === 500 && ctx.app.config.env === 'prod' ?
        'Internal Server Error' :
        err.message;

      if (status === 413) {
        error = '请求数据过大'
      }
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: status,
        data: null,
        success: false,
        msg: error
      };
      if (status === 422) {
        ctx.body.data = err.errors;
        ctx.body.msg = err.errors.map(error => `${error.field} ${error.message}`).join(' & ')
      }
      ctx.status = status;
    }
  };
};