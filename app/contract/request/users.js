module.exports = {
  loginRequest: {
    code: { type: 'string', required: true, example: '', description: '用户在微信登录获取到的code' },
    userInfo: { type: 'object', description: '从小程序获取到的userInfo' },
    // sexy: { type: 'string', required: true, enum: ['male', 'female'], description: '用户性别' },
    // email: { type: 'string', required: false, example: '952766532@qq.com', format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, description: '邮箱' },
    // phoneNumber: { type: 'string', required: false, example: '18801731528', format: /^1[34578]\d{9}$/, description: '电话' },
  },

  findUserRequest: {

  },

  createUserRequest: {
    name: { type: 'string', required: true, example: 'yu', description: '用户名' },
    password: { type: 'string', required: true, example: '123456', description: '密码' },
  },

  updateUserRequest: {
    avatarUrl: { type: 'string', required: true, example: '', description: '头像' },
    sex: { type: 'number', required: true, example: '', description: '性别' },
    name: { type: 'string', required: true, example: '', description: '昵称' }
  },
};
