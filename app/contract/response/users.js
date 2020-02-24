module.exports = {
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
