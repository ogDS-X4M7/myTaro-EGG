# 使用指南

这个项目是myTaro-TaroUI的后台，参考了https://gitee.com/yu-qian/egg-start.git 的模版，进行修改完善供我个人小程序项目使用。
下载后安装依赖，复制config.example.js为config.js，补充好个人数据库信息，APP_ID和APP_SECRET即可使用npm run dev运行。

## 1、egg-start

### 1.1、简介

egg-start 项目，是使用阿里 Egg.js 框架搭建的快速开始项目。

Egg.js 遵循约定大于配置，需要写的 controller 、service 等只要按照约定的目录和结构编写即可。具体参考 [Egg.js文档]( https://eggjs.org/zh-cn/intro/quickstart.html) 和 [快速入门](https://eggjs.org/zh-cn/intro/quickstart.html)，找到对应的功能查看。

### 1.2、使用

首先下载本项目：

```shell
# 使用git下载项目
$ git clone https://gitee.com/yu-qian/egg-start.git

# 安装依赖
$ npm install
```
拷贝项目根目录的 config.example.js 并重命名为 config.js，并且同样放在项目根目录，并且填入项目的配置：

```js
exports.config = {
    // 服务
    SERVER: {
        PORT: 7001,// 服务启动的端口（默认7001）
        HOST_NAME: '127.0.0.1', // 服务启动的IP（本机）
    },
    // MongoDB数据库
    MONGO_DB: {
        DB_USER: '', // 用户
        DB_PASSWORD: '',  //数据库密码
        DB_IP: '', // IP
        DB_PORT: '', // 端口
        DB_NAME: '' // 数据库名称
    },
    // 七牛存储
    QINIU: {
        AK: '', // Access Key
        SK: '', // Secret Key
        ZONE: '', // Zone_z0 华东, Zone_z1 华北, Zone_z2 华南, Zone_na0 北美
        BUCKET: '',
        BASE_URL: '', // 用于拼接已上传文件的完整地址
    },
    // REDIS服务端缓存
    REDIS: {
        PASSWORD: '', // 密码
        IP: '', // IP
        PORT: 6379 // 端口（默认端口6379）
    },
    // jsonwebtoken配置，请自行修改
    JWT: {
        SECRET: 'egg-start', // token的密钥（默认egg-start）
        EXPIRES_IN: '8h' // token过期时间 (默认8h)
    }
}
```

启动项目：

```shell
# 启动dev
$ npm run dev

# 启动部署
$ npm start

# 停止
$ npm stop
```

## 2、目录结构

项目的目录结构按照 Egg.js 约定，[查看详情](https://eggjs.org/zh-cn/basics/structure.html) 。

```
egg-project
├── package.json
├── app.js (可选)
├── agent.js (可选)
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service (可选)
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── response_time.js
│   ├── schedule (可选)
│   |   └── my_task.js
│   ├── public (可选)
│   |   └── reset.css
│   ├── view (可选)
│   |   └── home.tpl
│   └── extend (可选)
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.test.js (可选)
|   ├── config.local.js (可选)
|   └── config.unittest.js (可选)
└── test
    ├── middleware
    |   └── response_time.test.js
    └── controller
        └── home.test.js
```

## 3、要点指南

### 3.1、使用数据库插件

准备：

- 在服务器上面新增一个 mongo 数据库，创建了用户名和密码。
- 在本项目安装 `egg-mongoose` 插件
- 在 plugin.js 里面启用插件

安装：

```shell
$ npm install --save egg-mongoose
```

启用插件：

```js
// config/plugin.js

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
```

### 3.2、如何连接数据库

插件配置好之后到 `config.default.js` 对插件进行设置

```js
// config/config.default.js

exports.mongoose = {
    client: {
        url: 'mongodb://数据库用户:数据库密码@数据库IP:数据库端口/数据库名?authSource=数据库名',
        options: {
            useFindAndModify: false // 使用findOneAndUpdate等方法消除警告
        },
    },
};
```

由于以上的方式会将数据库信息暴露，因此我们需要改为在 config.js 里面配置，并且我们不把 config.js 提交到 git 仓库，修改代码为：

```js
// config.js
exports.config = {
    MONGO_DB: {
        DB_USER: '数据库用户',
        DB_PASSWORD: '数据库密码',
        DB_IP: '数据库IP',
        DB_PORT: '数据库端口',
        DB_NAME: '数据库名'
    }
}


// config/config.default.js

const { config } = require('../config.js')
const { MONGO_DB } = config;

// ...

exports.mongoose = {
    client: {
        url: `mongodb://${MONGO_DB.DB_USER}:${MONGO_DB.DB_PASSWORD}@${MONGO_DB.DB_IP}:${MONGO_DB.DB_PORT}/${MONGO_DB.DB_NAME}?authSource=${MONGO_DB.DB_NAME}`,
        options: {
            useFindAndModify: false // 使用findOneAndUpdate等方法消除警告
        },
    },
};
```

### 3.3、使用 egg-dotenv （本项目暂无）

为了将数据库用户名、密码等信息存在本地而不提交到仓库，使用 `egg-dotenv` 

```shell
$ npm install egg-dotenv --save
```

配置插件：

```js
// config/plugin.js

// ...

exports.dotenv = {
    enable: true,
    package: 'egg-dotenv'
};
```

### 3.4、创建 schema/modal

#### 3.4.1、使用modal操作MongoDB

以todo为例，在约定的目录 app/model 下建立todo.js，按照注释里面的规范编写schema/modal：
```js
// app/model/todo.js

module.exports = app => {
    // 因为配置了mongoose插件，所以在app上可以直接获得mongoose
    const mongoose = app.mongoose;
    // 使用mongoose创建Schema
    const Schema = mongoose.Schema;
    // 定义TodoSchema，注意命名规范
    const TodoSchema = new Schema(
        {
            text: String, // 待办事项名称
            creatorId: String, // 创建者ID
        },
        {
            timestamps: {
                createdAt: 'createDate',
                updatedAt: 'updateDate'
            }
        }
    );
    // 注意此处定义的model名称是首字母大写的Todo
    return mongoose.model('Todo', TodoSchema);
};
```

### 3.5、service使用

#### 3.5.1、使用service调用modal实现业务逻辑

以todo为例，来实现一个创建，在约定的目录 app/service 下建立todo.js，按照注释里面的规范编写service：

```js
// app/service/todo.js

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
```

### 3.6、controller使用

#### 3.6.1、使用controller将处理逻辑指向service的方法上

以todo为例，来实现一个创建的post请求，在约定的目录 app/controller 下建立todos.js，按照注释里面的规范编写controller：

```js

// app/controller/todos.js

const Controller = require('egg').Controller;

// 注意这里的文件名加了s, 我们用这个来表示RESTful API的Controller，因此导出的class命名如下：
class TodosController extends Controller {

    async index() {
        // 这个index方法用来实现列表获取  注意：这是约定 这是GET请求
    }

    async create() {
        // 这个create方法用来实现数据插入  注意：这是约定 这是POST请求
        const ctx = this.ctx;
        try {
            // 按照约定，在这里就直接从ctx.service上获取到了todo这个service
            // 我们从请求体获取到要插入的数据，并且调用todo service的createTodo方法插入数据
            const newTodo = await ctx.service.todo.createTodo(ctx.request.body);
            // 注意下面的响应格式是我们系统的约定
            ctx.body = {
                code: 200,
                data: newTodo,
                success: true,
                msg: ``
            };
        }
        catch (err) {
            throw err;
        }

    }


    async update() {
        // 这个update方法用来实现数据更新  注意：这是约定 这是PUT请求
    }

    async destroy() {
        // 这个destroy方法用来实现数据删除  注意：这是约定 这是DELETE请求
    }
}
module.exports = TodosController;

```

### 3.7、router使用

```js
// app/router.js

module.exports = app => {
  const {
      router,
      controller
  } = app;

  router.get('/', controller.home.index);

  // RESTful api

  // 按照约定：配置resources指向todos，并且指定api地址，最后指向对应的controller
  // 我们通过这个配置，就可以获得下面的几个接口了
  // GET	/posts	posts	app.controllers.posts.index
  // GET	/posts/new	new_post	app.controllers.posts.new
  // GET	/posts/:id	post	app.controllers.posts.show
  // GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
  // POST	/posts	posts	app.controllers.posts.create
  // PUT	/posts/:id	post	app.controllers.posts.update
  // DELETE	/posts/:id	post	app.controllers.posts.destroy
  // 具体就可以参考controller的方法

  // exports.index = async () => {};

  // exports.new = async () => {};

  // exports.create = async () => {};

  // exports.show = async () => {};

  // exports.edit = async () => {};

  // exports.update = async () => {};

  // exports.destroy = async () => {};

  // 如果我们不需要其中的某几个方法，可以不用在 posts.js 里面实现，这样对应 URL 路径也不会注册到 Router。
  
  router.resources('todos', '/api/v1/todos', controller.todos); // todo接口

};

```

### 3.8、关闭scrf

POST请求 http://127.0.0.1:7001/api/v1/todos 会报错： "missing csrf token" ，因此需要关闭scrf。

```js
// config/config.default.js

// ...

exports.security = {
    csrf: {
        enable: false,
    }
}
```

### 3.9、允许跨域

使用 `egg-cors` 设置允许跨域访问：

```shell
$ npm install --save egg-cors
```

配置：

```js
// config/config.default.js

// ...
exports.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};
```

### 3.10、使用postman调试

使用POST请求调用 http://127.0.0.1:7001/api/v1/todos 接口，可以看得已经获得响应：

```json
{
    "code": 200,
    "data": {
        "_id": "5e4cdb863b8e883dfcc81436",
        "createDate": "2020-02-19T06:53:58.524Z",
        "updateDate": "2020-02-19T06:53:58.524Z",
        "__v": 0
    },
    "success": true,
    "msg": ""
}
```

### 3.11、使用 Robo 3T 可视化查看数据库

下载安装 robo ，启动之后，点击创建连接，输入数据库地址、端口、密码验证、数据库名称等信息之后连接，可以查看刚刚插入的数据。

### 3.12、egg-validate 校验路由传参

通过上面的请求实例可以看出，我们没有传递任何参数给接口，却能够插入数据文档，这是不合理的，我们使用 `egg-validate` 插件来验证请求是否传递了符合的参数或符合的请求体。

```shell
$ npm install egg-validate --save
```

安装好之后，配置插件：

```js
// config/plugin.js

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};

exports.validate = {
    enable: true,
    package: 'egg-validate',
};
```

以todos为例，参考注释，去到todos的controller，定义创建文档的参数规则：

```js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
    text: 'string',
    creatorId: 'string',
};

class TodosController extends Controller {
    
	// ...

    async create() {
        const ctx = this.ctx;
        // 由于是POST请求，对请求的body进行参数规则校验
        ctx.validate(createRule, ctx.request.body);
        try {
            const newTodo = await ctx.service.todo.createTodo(ctx.request.body); 
            ctx.body = {
                code: 200,
                data: newTodo,
                success: true,
                msg: ``
            };
        }
        catch (err) {
            throw err;
        }

    }

	// ...
}
module.exports = TodosController;
```

重新启动，使用postman发送同样的请求，可以看到接口会报出错误，如下，证明我们的参数验证已经生效：

```shell
message: "Validation Failed"
code: "invalid_param"
errors: [{"message":"required","field":"text","code":"missing_field"},{"message":"required","field":"creatorId","code":"missing_field"}]
```

为了成功调用，需要传递text和creatorId两个参数才行。

**对GET、PUT、DELETE来说，请求需要验证的参数对象如下**

| GET       | PUT        | POST             | DELETE     |
| --------- | ---------- | ---------------- | ---------- |
| ctx.query | ctx.params | ctx.request.body | ctx.params |

### 3.13、中间件——错误处理

以上面的请求为例，我们希望能够把报错的信息经过处理传递到前端，这个时候就需要用到中间件了。

**什么是中间件？**

中间件是对请求和响应执行一些逻辑的function。

**写一个错误处理中间件**

```js
// app/middleware/error_handler.js

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
```

**使用中间件**

```js
// config/config.default.js

// ...

// 加载 errorHandler 中间件
exports.middleware = ['errorHandler'];
```

重新启动后台再来试试看请求不传参时的响应是什么：

```json
{
    "code": 422,
    "data": [
        {
            "message": "required",
            "field": "text",
            "code": "missing_field"
        },
        {
            "message": "required",
            "field": "creatorId",
            "code": "missing_field"
        }
    ],
    "success": false,
    "msg": "text required & creatorId required"
}
```

## 4、用户、角色、JWT和权限

### 4.1、创建角色管理

先来创建角色的schema：

```js
// app/model/role.js

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const RoleSchema = new Schema({
        name: {
            type: String,
            required: true
        }, // 角色
        system: {
            type: Boolean,
            default: false
        }, // 是否是系统预置角色
    }, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });
    return mongoose.model('Role', RoleSchema);
};
```

首先实现角色的service，包括增删查改：

```js
// app/service/role.js

const Service = require('egg').Service;

class RoleService extends Service {
    // 创建角色
    async createRole(data) {
        return this.ctx.model.Role({ ...data }).save();
    }

    // 查询角色
    // 使用分页，默认一页20条数据，默认从第1页开始
    async findRole(params = {}) {
        const pageSize = params && parseInt(params.pageSize) || 20;
        const page = params && parseInt(params.page) || 1;
        delete params.pageSize;
        delete params.page;
        return this.ctx.model.Role.find(params).limit(pageSize).skip(pageSize * (page - 1)).sort('-createDate').lean()
    }

    // 查询单个角色
    async findOneRole(params = {}) {
        return this.ctx.model.Role.findOne(params).lean()
    }

    // 更新单个角色以及权限
    async updateOneRole(condition = {}, doc) {
        // .update(condition,doc,[options],[callback]);
        return this.ctx.model.Role.updateOne(condition, { ...doc }).lean()
    }

    // 删除角色
    async removeRole(id) {
        return this.ctx.model.Role.remove({ _id: id }).lean();
    }
}

module.exports = RoleService;
```

然后实现角色的controller：

```js
// app/controller/roles.js

const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
    name: 'string'
};

// 定义删除接口的请求参数规则
const deleteRule = {
    id: 'string',
};

class RolesController extends Controller {

    // 查询角色列表
    async index() {
        const ctx = this.ctx;
        try {
            // const roleList = await ctx.service.role.findRole(ctx.query);
            const roleList = await ctx.service.role.findRole();
            ctx.body = {
                code: 200,
                data: roleList,
                success: true,
                msg: ``
            };
        }
        catch (err) {
            throw err;
        }
    }

    // 创建角色
    async create() {
        const ctx = this.ctx;
        ctx.validate(createRule, ctx.request.body);
        try {
            const role = await ctx.service.role.findOneRole(ctx.request.body);
            if(role) {
               throw new Error('角色已经存在')
            }
            const newRole = await ctx.service.role.createRole(ctx.request.body);
            ctx.body = {
                code: 200,
                data: newRole,
                success: true,
                msg: ``
            };
        }
        catch (err) {
            throw err;
        }

    };

    // 更新角色
    async update() {
        const ctx = this.ctx;
        ctx.validate(deleteRule, ctx.params);
        const result = await this.ctx.service.role.updateOneRole({_id: ctx.params.id}, ctx.request.body);
        if(result.ok) {
            ctx.body = {
                code: 200,
                data: {},
                success: true,
                msg: `修改成功`
            }
        }
    }

    // 删除角色
    async destroy() {
        const ctx = this.ctx;
        ctx.validate(deleteRule, ctx.params);
        const result = await this.ctx.service.role.deleteRole(ctx.params.id);
        if(result.ok) {
            ctx.body = {
                code: 200,
                data: {},
                success: true,
                msg: `删除成功`
            }
        }
    }
}
module.exports = RolesController;
```

配置角色的路由：

```diff
// app/router.js

module.exports = app => {
  const {
      router,
      controller
  } = app;

  router.get('/', controller.home.index);
  router.resources('todos', '/api/v1/todos', controller.todos); // todo接口
+  router.resources('roles', '/api/v1/roles', controller.roles); // 角色
};

```

目前可以通过调用Api创建角色。

###4.2、创建用户管理

定义用户schema：

```js
// app/constant/index.js
module.exports = {
    // ...
    DEFAULT_PASSWORD: '123456',
    // ...
}

// app/model/user.js

const { DEFAULT_PASSWORD } = require('../constant/index');
const md5 = require('md5');
const md5SignValue = md5(DEFAULT_PASSWORD);

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const UserSchema = new Schema({
        name: String, // 姓名
        sex: {
            type: Number,
            default: 0
        }, // 性别 0未设置 1男 2女
        password: {
            type: String,
            default: md5SignValue

        }, // 密码
        avatarUrl: String,
        role: { type: Schema.Types.ObjectId, ref: 'Role' }, // 角色
        uuid: String,
        openId: String, // 微信 openId
        userStatus: {
            type: Number,
            default: 0
        }, // 0 访客 1 正式用户
        platform: {
            type: Number,
            default: 1
        }, // 0 微信 1 系统
    }, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });
    UserSchema.pre('find', function () {
        this.populate('role', 'name');
    });
    UserSchema.pre('findOne', function () {
        this.populate('role', 'name');
    });
    return mongoose.model('User', UserSchema);
};
```

编写service、controller，配置router，不作介绍，参考上面role的例子和代码

### 4.3、中间件——JWT

为了实现跨域的用户验证，我们使用JWT：

```shell
$ npm install jsonwebtoken --save
$ npm install koa-jwt2 --save
```

**将jsonwebtoken挂到app上方便使用**

```js
// app.js
// 引入jwt
const jwt = require('jsonwebtoken');

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    async configWillLoad() {
        // 此时 config 文件已经被读取并合并，但是还并未生效
        // 这是应用层修改配置的最后时机
        // 注意：此函数只支持同步调用

        // 例如：参数中的密码是加密的，在此处进行解密
        // this.app.config.mysql.password = decrypt(this.app.config.mysql.password);
        // 例如：插入一个中间件到框架的 coreMiddleware 之间
        // const statusIdx = app.config.coreMiddleware.indexOf('status');
        // app.config.coreMiddleware.splice(statusIdx + 1, 0, 'limit');



        this.app.jwt = jwt; // 将jsonwebtoken挂到app
    }

    async didLoad() {
        // 所有的配置已经加载完毕
        // 可以用来加载应用自定义的文件，启动自定义的服务

        // 例如：创建自定义应用的示例
        // this.app.queue = new Queue(this.app.config.queue);
        // await this.app.queue.init();

        // 例如：加载自定义的目录
        // app.loader.loadToContext(path.join(__dirname, 'app/tasks'), 'tasks', {
        //     fieldClass: 'tasksClasses',
        // });
    }

    async willReady() {
        // 所有的插件都已启动完毕，但是应用整体还未 ready
        // 可以做一些数据初始化等操作，这些操作成功才会启动应用

        // 例如：从数据库加载数据到内存缓存
        // this.app.cacheData = await app.model.query(QUERY_CACHE_SQL);
    }

    async didReady() {
        // 应用已经启动完毕

        // const ctx = await this.app.createAnonymousContext();
        // await ctx.service.Biz.request();
    }

    async serverDidReady() {
        // http / https server 已启动，开始接受外部请求
        // 此时可以从 app.server 拿到 server 的实例

        // app.server.on('timeout', socket => {
        //     // handle socket timeout
        // });
    }
}

module.exports = AppBootHook;
```

**编写中间件处理jwtHandler**

```js
// app/middleware/jwt_handler.js

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
```

**使用jwtHandler中间件**

```js
// config/config.default.js

// ...


// 加载 errorHandler 中间件, 加载 jwtHandler 中间件
exports.middleware = ['errorHandler', 'jwtHandler'];

```

上面使用的是我们自己的中间件jwtHandler处理jwtj验证失败的响应格式，接下来是使用 koa-jwt2 中间件，以本项目为例，我们再写一个中间件来使用 koa-jwt2。

**建立jwt中间件来使用koa-jwt2**

```js
// app/middleware/jwt.js
// 这里使用koa-jwt2中间件，调用jwt的方法过滤中间件配置传过来的unless路径，因此在使用该中间件的时候会配置unless

const jwt = require("koa-jwt2");
module.exports = options => {
    return jwt(options).unless(options.unless);
};

```

**使用jwt中间件**

```js
// config/config.default.js

// ...

// 加载 errorHandler 中间件, 加载 jwtHandler 中间件，加载 jwt 中间件
exports.middleware = ['errorHandler', 'jwtHandler', 'jwt'];

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
```

**设置好中间件之后，访问接口需要token信息了**

如果不附带token信息，访问时会得到下面的结果：

```json
{
    "code": 401,
    "data": {},
    "success": false,
    "msg": "用户登录信息已失效，请尝试登录"
}
```

### 4.4、登录和Token

首先在UsersController写一个登录的方法：

```js
// app/controller/users.js
// ...

class UsersController extends Controller {

   // ...

    async login() {
        const ctx = this.ctx;
        let {name, password} = ctx.request.body;
        try {
            // 查询数据库
            const user = await ctx.service.user.findOneUser({password, name});
            if(user) {
                // TODO 关键的字符串可以抽出到一个映射
                let role = 'user';
                // 如果用户分配了角色
                if(user.role) {
                    role = user.role.name;
                }
                // 使用config里面的secret签发一个Token，包含了用户的ID和角色，并且设置了有效时间
                const token = ctx.app.jwt.sign({ id: user._id, role: role }, ctx.app.config.jwt.secret, {
                    expiresIn: ctx.app.config.jwt.expiresIn
                });
                // 可以将token设置到cookies
                ctx.cookies.set('token', token);
                ctx.body = {
                    code: 200,
                    data: {
                        user, token
                    },
                    success: true,
                    msg: ``
                };
            } else {
                throw new Error('用户或者密码不正确');
            }
        }
        catch (err) {
            throw err;
        }
    };
}
module.exports = UsersController;

```

**添加用户登录的路由**

```diff
// app/router.js

module.exports = app => {
  const {
      router,
      controller
  } = app;

  router.get('/', controller.home.index);

  // 自定义API
+  router.post('/api/v1/login', controller.users.login); // 定义一个用户登录的post接口
  
  router.resources('users', '/api/v1/users', controller.users); // 用户接口
  router.resources('todos', '/api/v1/todos', controller.todos); // todo接口
  router.resources('roles', '/api/v1/roles', controller.roles); // 角色

};

```

### 4.5 用户接口权限casbin

安装casbin和 casbin的 mongoose 驱动：

```shell
$ npm install casbin --save
$ npm install @elastic.io/casbin-mongoose-adapter --save
```

待补充…





## 5、生成接口文档

应用于eggjs的plugin,可自动生成SwaggerUI。应用启动后访问/swaagger-ui.html可以浏览页面，访问/swagger-doc，获取swaggerjson。

```shell
$ npm install egg-swagger-doc --save
```

```js
// {app_root}/config/plugin.js
// ...
exports.swaggerdoc = {
  enable: true,
  package: 'egg-swagger-doc',
};
```


```js
// {app_root}/config/config.default.js
// ...

// jwt中间件配置
exports.jwt = {
	// ...
    // 配置忽略的路径
    ignore(ctx) {
        // todo 目前先排除正在自动化使用到的接口
        const reg = /\/api\/v1\/colors|\/autopack|swagger/g;
        if (ctx.request.url === '/') {
            return true
        }
        if (reg.test(ctx.request.url)) {
            return true
        }
        return reg.test(ctx.request.url);
    },
	// ...
};

// ...

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
```

#### 使用

```js
// app/controller/users.js

/**
 * @Controller
 */
const Controller = require('egg').Controller;
// ...
class UsersController extends Controller {

    // ...
    
    /**
     * @Router POST /api/v1/login
     * @Request body loginRequest * 用户登录
     * @Response 200 loginResponse 响应
     */
    async login() {
        const ctx = this.ctx;
        // 既然我们已经使用了swagger的contract，我们可以用它生产的rule来验证路由，一举两得。
        ctx.validate(ctx.rule.loginRequest, ctx.body);
        // ...
    };
}
module.exports = UsersController;

```

##### @Controller

格式：@Controller {ControllerName}

```
a.如果文件第一个注释块中存在标签@Controller，应用会扫描当前文件下的所有注释块，否则扫描将会跳过该文件。
b.如果不标示ControllerName，程序会将当前文件的文件名作为ControllerName。
```

例：

```
/**
 * @Controller user
 */
class UserController extends Controller {
  //some method
}
```

##### @Router

格式：@Router {Mothod} {Path}

```
a.Mothod,请求的方法(post/get/put/delete等)，不区分大小写。
b.Path,请求的路由。
```

##### @Request

格式：@Request {Position} {Type} {Name} {Description}

```
a.position.参数的位置,该值可以是body/path/query/header/formData.
b.Type.参数类型，body之外位置目前只支持基础类型,integer/string/boolean/number，及基础类型构成的数组，body中则支持contract中定义的类型。如果position是formData还将支持 file 类型
c.Name.参数名称.如果参数名称以*开头则表示必要，否则非必要。
d.Description.参数描述
c.如果你想给query或者path的参数设置example，你可以在Description前添加以'eg:'开头的参数，实例如下
@Request query string contactId eg:200032234567 顾问ID
```

##### @Response

格式：@Response {HttpStatus} {Type} {Description}

```
a.HttpStatus.Http状态码。
b.Type.同Request中body位置的参数类型。
d.Description.响应描述。
```

##### @Deprecated

```
如果注释块中包含此标识，则表示该注释块注明的接口，未完成或不启用。
```

##### @Description

格式：@Description {Description}

```
接口具体描述
```

##### @Summary

格式：@Summary {Summary}

```
接口信息小标题
```

例：

```
/**
 * @Controller user
 */
class HomeController extends Controller {
  /**
   * @Router POST /user
   * @Request body createUser name description-createUser
   * @Request header string access_token
   * @Response 200 baseResponse ok
   */
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.swagger.name;
  }
```

如果在config中开启并定义了securityDefinitions,默认enableSecurity为false.则可在注释块中加入@apikey，加入安全验证。也可定义成其他名字，只需@定义好的字段名就好。关于securityDefinitions的定义可以自行搜索。

```
exports.swaggerdoc = {
  securityDefinitions: {
    apikey: {
      type: 'apiKey',
      name: 'clientkey',
      in: 'header',
    },
    // oauth2: {
    //   type: 'oauth2',
    //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
    //   flow: 'password',
    //   scopes: {
    //     'write:access_token': 'write access_token',
    //     'read:access_token': 'read access_token',
    //   },
    // },
  },
  enableSecurity: true,
};
```

#### contract定义

关于Contract的定义其实在测试代码里面，已经把支持的所有情况都定义出来了。详见[here](https://github.com/Ysj291823/egg-swagger-doc/blob/HEAD/test/fixtures/apps/swagger-doc-test/app/contract/request/resource.js),这里我简单说明一下，以下是测试代码中的部分contract。

```
module.exports = {
  createResource: {
    resourceId: { type: 'string', required: true, example: '1' },
    resourceNametrue: { type: 'string', required: true },
    resourceType: { type: 'string', required: true, enum: ['video', 'game', 'image'] },
    resourceTag: { type: 'array', itemType: 'string' },
    owner: { type: 'User', required: true },
    owners: { type: 'array', itemType: 'User' }
  },
};
```

@基础类型

```
module.exports = {
  Model名称:{
    字段名称: { type: 字段类型，required: 字段必要性, example: 示例}
  }
}
```

注：type可以是array之外的类型，包括自定义的类型，目前自定义类型不支持example

------

@ENUM

```
module.exports = {
  Model名称:{
    字段名称: { type: 字段类型，required: 字段必要性, enum:[]}
  }
}
```

注: type只能是string或number，enum为具体的数值组成的集合

------

@ARRAY

```
module.exports = {
  Model名称:{
    字段名称: { type: "array"，required: 字段必要性, itemType:数组元素类型}
  }
}
```

type为array,itemType为具体的数组元素类型，支持自定义类型。

------

@自定义类型

关于自定义类型，必须定义在contract目录下，在contract下的其他类型中使用时，直接使用Model名称引入。

------

因为contract的定义和validate-rule的定义具有极大的相似性，所以目前的版本中定义contract的同时会简单的生成相应的validate-rule.具体的使用'ctx.rule.'加Model名称直接引入。

上面的model，在做验证的时候就可以使用如下的方式(需使用egg-validate)

```
ctx.validate(ctx.rule.createResource, ctx.request.body);
```


## 6、Redis使用

### 6.1、下载安装 redis（Windows）

首先访问 [下载地址](https://github.com/MicrosoftArchive/redis/releases) ，选择自己需要的版本进行下载安装（展开Assets，选择下载msi后缀的文件）。

打开安装目录，双击运行里面的 redis-cli.exe 即可连接到redis。

### 6.2、配置redis密码（Windows）

可以参考公众号文章 [【前端开发日常 - 4】Windows安装Redis及简单使用](https://mp.weixin.qq.com/s?__biz=MzU3NzcyNzk4Ng==&mid=2247483694&idx=1&sn=2455a4500f9b97342190ebb3b23153a4&chksm=fd017db3ca76f4a5829dd19aa84b6e4e74d870c3001ca3febcae3fee511fc0bfd992e5e9dbdb&scene=126&sessionid=1582681237&key=47671e6fec042c4a588719437dba9e394ddf6988803540c3b5879c18f2b24d1d3a2fe0c5131b7094bb9e687d6e26a6409e24c74b0b06a75da9a064ab8b8a196a5d31c5df1520ef681a14b2a43e6255f9&ascene=1&uin=MTY3MjM1NzA4MQ%3D%3D&devicetype=Windows+7&version=62080079&lang=zh_CN&exportkey=A5dLC798w2N2nlYQd0Gu2s0%3D&pass_ticket=E%2Bfl8tsgulRsmRhyidh7wX74m1QZQWpFJm66YqIoIiykO%2FJPt%2FxoY52PL4VM7BZ1) 。

### 6.3、使用 egg-redis 插件

#### 6.3.1、安装egg-redis

```shell
 $ npm i egg-redis --save
```

#### 6.3.2、启用插件，并且配置插件

```js
// config/plugin.js
exports.redis = { 
    enable: true, 
    package: 'egg-redis', 
}; 


// config.js
exports.config = {
    // ...
    REDIS: {
        PASSWORD: '密码',
        IP: 'IP',
        PORT: 6379
    }
    // ...
}


// config/config.default.js
const { config } = require('../config.js')
const { REDIS } = config;

// ...
exports.redis = {
    client: {
        port: REDIS.PORT, // Redis port 
        host: REDIS.IP, // Redis host 
        password: REDIS.PASSWORD,
        db: 0,
    },
}
```

#### 6.3.3、创建一个 service 使用 redis

```js
// app/service/cache.js

const Service = require('egg').Service;

class CacheService extends Service {
    getKey(array) {
        let key = array.splice(0, 1)[0];
        array.forEach(element => {
            if (element && key) {
                key = key.replace(/\${\w*}/, element)
            }
        });
        return key
    }

    getScanKey(str) {
        return str.replace(/\${\w*}/, '*');
    }

    async set(key, value, seconds) {
        value = JSON.stringify(value);
        if (this.app.redis) {
            if (!seconds) {
                return await this.app.redis.set(this.getKey(key), value);
            } else {
                return await this.app.redis.set(this.getKey(key), value, 'EX', seconds)
            }
        }
    }

    async get(key) {
        if (this.app.redis) {
            const data = await this.app.redis.get(this.getKey(key));
            if (!data) return;
            return JSON.parse(data)
        }
    }

    async del(key) {
        if (this.app.redis) {
            const data = await this.app.redis.del(this.getKey(key));
            return data
        }
    }

    async incr(key) {
        if (this.app.redis) {
            const data = await this.app.redis.incr(this.getKey(key));
            if (!data) return;
            return JSON.parse(data)
        }
    }

    async sadd(key, value, seconds) {
        value = JSON.stringify(value);
        if (this.app.redis) {
            if (!seconds) {
                await this.app.redis.sadd(this.getKey(key), value);
            } else {
                await this.app.redis.sadd(this.getKey(key), value, 'EX', seconds)
            }
        }
    }

    async sismember(key, value) {
        value = JSON.stringify(value);
        if (this.app.redis) {
            const data = await this.app.redis.sismember(this.getKey(key), value);
            if (!data) return;
            return JSON.parse(data)
        }
    }

    async scard(key) {
        if (this.app.redis) {
            const data = await this.app.redis.scard(this.getKey(key));
            if (!data) return;
            return data
        }
    }
    
    async scanAll(key) {
        let allKey = []
        const _scan = async (index, match, key) => {
            const data = await this.app.redis.scan(index, match, key)
            if(data[1].length) {
                allKey = allKey.concat(data[1])
            }
            if(data[0] !== '0') {
                const value = parseInt(data[0])
                await _scan(value, match, key)
            }
        }
        await _scan(0, "match", this.getScanKey(key))
        return allKey
    }
}

module.exports = CacheService;
```

#### 6.3.4、Redis key的定义规则和使用

**定义**

```js
// app/constant/redis.js

module.exports = {

    // 定义的规则 KEY需要的ID_存储的内容_存储的内容字段名

    USER_DATA: 'user:${userId}', // user(json)
    USER_PROPERTY: 'user:${userId}:${property}', // value
    USER_TICKET: 'user:${userId}:ticket', // ticket
    USER_TOKEN: 'user:${userId}:token', // token

    TICKET_USER_ID: 'ticket:${ticket}', // userId

    TOKEN_USER: 'token:${token}', // user(json)
    TOKEN_USER_ID: 'token:${token}', // userId
}
```

**使用**

以储存用户token和基本信息为例：

```js
async handleUser(user) {
    const ctx = this.ctx;
    
    // ...
    // 获取redis的值
    let ticket = await ctx.service.cache.get([USER_TICKET, user._id]);
    let token = await ctx.service.cache.get([USER_TOKEN, user._id]);
    
    // ...
    // 设置redis的值
    await ctx.service.cache.set([TOKEN_USER_ID, token], user._id, ctx.app.constant.TOKEN_EX * 60 * 60);
    await ctx.service.cache.set([TICKET_USER_ID, ticket], user._id, ctx.app.constant.TOKEN_EX * 60 * 60);
    await ctx.service.cache.set([USER_DATA, user._id], user, ctx.app.constant.TOKEN_EX * 60 * 60);
    await ctx.service.cache.set([USER_TOKEN, user._id], token, ctx.app.constant.TOKEN_EX * 60 * 60);
    await ctx.service.cache.set([USER_TICKET, user._id], ticket, ctx.app.constant.TOKEN_EX * 60 * 60);
    // ...
}
```

### 7、限流

使用 koa 的中间件 [koa-ratelimit](https://github.com/koajs/ratelimit) 来限流，下载安装：

```shell
$ npm install koa-ratelimit
```

然后我们来为项目创建一个中间件：

```js
// app/middleware/rate_limit.js

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

```

使用中间件：

```diff
// config/config.default.js

- exports.middleware = ['errorHandler', 'getToken', 'jwtHandler', 'jwt', 'authz'];
+ exports.middleware = ['rateLimit', 'errorHandler', 'getToken', 'jwtHandler', 'jwt', 'authz'];
```

接下来我们可以频繁调用接口查看返回数据，如果太过频繁，后台会返回错误信息。

