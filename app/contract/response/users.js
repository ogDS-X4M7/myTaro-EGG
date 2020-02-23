module.exports = {
  findUserResponse: {
    code: { type: 'number', example: 200, required: true },
    data: { type: 'array', itemType: 'user' },
    success: { type: 'boolean', required: true },
    msg: { type: 'string', required: true },
  },
  queryUserResponse: {
    users: { type: 'array', itemType: 'user' },
    pageNo: { type: 'integer' },
    pageSize: { type: 'integer' },
    totalCount: { type: 'integer' },
    hasNextPage: { type: 'boolean' },
  },
  getUserResponse: {
    id: { type: 'string', description: 'id 唯一键' },
    userName: { type: 'string', description: '用户姓名' },
    sexy: { type: 'string', description: '用户性别' },
    age: { type: 'integer', description: '年龄' },
    group: { type: 'integer', description: '组别' },
    isLeader: { type: 'boolean', description: '是否小组负责人' },
    email: { type: 'string', description: '邮箱' },
    phoneNumber: { type: 'string', description: '电话' },
  },
  uploadResponse: {
    id: { type: 'string', description: 'id 唯一键' },
    userName: { type: 'string', description: '用户姓名' },
    sexy: { type: 'string', description: '用户性别' },
    age: { type: 'integer', description: '年龄' },
    group: { type: 'integer', description: '组别' },
    isLeader: { type: 'boolean', description: '是否小组负责人' },
    email: { type: 'string', description: '邮箱' },
    phoneNumber: { type: 'string', description: '电话' },
    imageUrl: { type: 'string', description: '图片地址' },
  },

  loginResponse: {
    code: { type: 'number', example: 200, required: true },
    data: { type: 'object', example: {
      user: {
        openId: ""
      },
      token: ''
    }, required: true },
    success: { type: 'boolean', required: true },
    msg: { type: 'string', required: true },
  },
};
