module.exports = app => {
  const {
    router,
    controller
  } = app;

  router.get('/', controller.home.index);

  // 自定义API
  router.post('/api/v1/login', controller.users.login); // 定义一个用户登录的post接口
  router.post('/api/v1/wxLogin', controller.users.wxLogin) // 微信登录
  router.post('/api/v1/updateUser', controller.users.userInfo) // 更新用户信息-头像昵称
  router.post('/api/v1/autoLogin', controller.users.autoLogin) // 近期登录过的用户自动登录
  router.get('/api/v1/hots', controller.hots.index) // 热点接口
  router.get('/api/v1/study', controller.study.index) // 学习页面接口
  router.post('/api/v1/updateHistory', controller.users.updateHistory) // 更新浏览历史接口
  router.post('/api/v1/getHistory', controller.users.getHistory) // 获取浏览历史接口
  router.post('/api/v1/clearHistory', controller.users.clearHistory) // 清空浏览历史接口
  router.post('/api/v1/updateLikes', controller.users.updateLikes) // 更新点赞接口
  router.post('/api/v1/getLikes', controller.users.getLikes) // 获取点赞接口
  router.post('/api/v1/updateCollections', controller.users.updateCollections) // 更新收藏接口
  router.post('/api/v1/getCollections', controller.users.getCollections) // 获取收藏接口
  // 这样写接口在jwt判定里发现不是api/v1的话，就会报错重定向，并且不给相应报文;
  // 在上面写自定义api的好处是，我们可以看到下面的router.resources是对应到文件的：
  // router.resources('users', '/api/v1/users', controller.users); 用户接口对应到controller.users
  // router.resources('hots', '/api/v1/hots', controller.hots); 热点接口对应到controller.hots
  // 但事实上像用户文件里还有很多api，比如这里上面的微信登录，更新信息，自动登录，都得用自定义api来实现


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

  router.resources('users', '/api/v1/users', controller.users); // 用户接口
  router.resources('todos', '/api/v1/todos', controller.todos); // todo接口
  router.resources('roles', '/api/v1/roles', controller.roles); // 角色
  router.resources('policies', '/api/v1/policies', controller.policies); // 策略
  // router.resources('hots', '/api/v1/hots', controller.hots); // 热点接口
  // router.resources('study', '/api/v1/study', controller.study) // 学习页面接口
};
