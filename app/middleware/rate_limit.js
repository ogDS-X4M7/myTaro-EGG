
const ratelimit = require("koa-ratelimit");
const db = new Map();

// 文档地址 https://github.com/koajs/ratelimit
module.exports = options => {
    return ratelimit({
        driver: 'memory', // 储存的方式，可以是内存和Redis，内存："memory"，redis: "redis"
        db: db, // 内存方式使用一个Map"，redis方式需要传入redis的链接实例
        duration: 3000, // 限制时间，在这段时间之内限制访问次数 单位是：milliseconds
        errorMessage: '访问过于频繁，请稍后重试！', // 自定义错误的信息
        id: (ctx) => ctx.ip, // 用于比较的标识，这里使用IP
        headers: { // 自定义响应头
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 10, // 在 duration 时间内可以访问的次数
        disableHeader: false, // 设置是否需要发送响应头remaining, reset, total
        whitelist: (ctx) => {
            // some logic that returns a boolean
            // 白名单，如果返回true则不限制
        },
        blacklist: (ctx) => {
            // some logic that returns a boolean
            // 黑名单，如果返回true，将抛出403错误
        }
    })
};
