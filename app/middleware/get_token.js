const { TICKET_USER_ID, USER_TOKEN } = require('../constant/redis');

module.exports = options => {
    return async (ctx, next) => {
        try {
            let ticket;
            if (ctx.headers.token) {
                ticket = ctx.headers.token;
            } else if (ctx.query && ctx.query.token) {
                ticket = ctx.query.token;
            } else if (ctx.cookies.get('token')) {
                ticket = ctx.cookies.get('token');
            } else {
                ticket = null;
            }
            
            const uid = await ctx.service.cache.get([TICKET_USER_ID, ticket]);
            const token = await ctx.service.cache.get([USER_TOKEN, uid]);
            if(token) {
                ctx.headers.authorization = `Bearer ${token}`
            }
            await next()
        } catch (e) {
            throw e
        }
    }
};