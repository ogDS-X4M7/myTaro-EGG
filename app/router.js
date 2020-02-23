module.exports = app => {
  const {
    router,
    controller
  } = app;

  router.get('/', controller.home.index);

  // 自定义API
  router.post('/api/v1/login', controller.users.login); // 定义一个用户登录的post接口

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
};
