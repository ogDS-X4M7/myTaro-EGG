const { config } = require('../config.js')
const { MONGO_DB, QINIU, REDIS, JWT, SERVER } = config;

exports.keys = 'egg-start'; // <此处改为你自己的 Cookie 安全字符串>

exports.mongoose = {
    client: {
        url: `mongodb://${MONGO_DB.DB_USER}:${MONGO_DB.DB_PASSWORD}@${MONGO_DB.DB_IP}:${MONGO_DB.DB_PORT}/${MONGO_DB.DB_NAME}?authSource=${MONGO_DB.DB_NAME}`,
        options: {
            useFindAndModify: false // 使用findOneAndUpdate等方法消除警告
        },
    },
};

exports.security = {
    csrf: {
        enable: false,
    }
};

exports.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};

// exports.multipart = {
//     mode: 'file',
// };


// 加载 errorHandler 中间件, 加载 jwtHandler 中间件，加载 jwt 中间件， 加载 authz
// exports.middleware = ['errorHandler', 'getToken', 'jwtHandler', 'jwt', 'authz'];
exports.middleware = ['rateLimit', 'errorHandler', 'jwtHandler', 'jwt'];

// jwt中间件配置
exports.jwt = {
    secret: JWT.SECRET,
    expiresIn: JWT.EXPIRES_IN,
    ignore(ctx) {
        // ignore是egg中间件的配置
        // 配置忽略的路径，符合规则的return true则请求将不经过jwt中间件
        const reg = /swagger|\/public/g;
        if (ctx.request.url === '/') {
            return true
        }
        if (reg.test(ctx.request.url)) {
            return true
        }
        return reg.test(ctx.request.url);
    },
    // 获取token的方式 从 header 、 query 、 cookies
    getToken: function fromHeaderOrQuerystring(ctx) {
        if (ctx.headers.authorization && ctx.headers.authorization.split(" ")[0] === "Bearer") {
            return ctx.headers.authorization.split(" ")[1];
        } else if (ctx.query && ctx.query.token) {
            return ctx.query.token;
        } else if (ctx.cookies.get('token')) {
            return ctx.cookies.get('token');
        } else {
            return null;
        }
    },
    // 这里的配置将在jwt中间件中获取，由koa-jwt2进行过滤。
    unless: { path: ["/login", "/api/v1/login"] }
};

exports.authz = {
    enable: true,
    ignore(ctx) {
        const reg = /\/login|swagger|\/public/g;
        // console.log(ctx.request.url);
        // console.log(reg.test(ctx.request.url));
        if (ctx.request.url === '/') {
            return true
        }
        if (reg.test(ctx.request.url)) {
            return true
        }
        return reg.test(ctx.request.url);
    }
};

exports.swaggerdoc = {
    dirScanner: './app/controller',
    // basePath: '127.0.0.1:7002',
    apiInfo: {
        title: '接口文档',
        description: 'api接口文档',
        version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        Authorization: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
        },
    },
    enableSecurity: true,
    enableValidate: true,
    enable: true,
    routerMap: true,
}

exports.cluster = {
    listen: {
        port: SERVER.PORT,
        hostname: SERVER.HOST_NAME,
        // path: '/var/run/egg.sock',
    }
}

exports.fullQiniu = {
    default: {
        ak: QINIU.AK, // Access Key
        sk: QINIU.SK, // Secret Key
        useCdnDomain: true,
        isLog: true,
    },
    app: true,
    agent: false,

    // 单实例
    // 通过 app.fullQiniu 直接使用实例
    client: {
        zone: QINIU.ZONE, // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
        bucket: QINIU.BUCKET,
        baseUrl: QINIU.BASE_URL, // 用于拼接已上传文件的完整地址
    }

    // 多实例
    // clients: {
    //     // 可以通过 app.fullQiniu.get('myImage'), app.fullQiniu.get('myText') 获取实例
    //     myImage: {
    //         zone: '', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
    //         bucket: '',
    //     baseUrl: null, // 用于拼接已上传文件的完整地址
    //     },
    //     myText: {
    //         zone: '', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
    //         bucket: '',
    //     baseUrl: null, // 用于拼接已上传文件的完整地址
    //     },
    // },
}

exports.redis = {
    client: {
        port: REDIS.PORT, // Redis port 
        host: REDIS.IP, // Redis host 
        password: REDIS.PASSWORD,
        db: 0,
    },
}
