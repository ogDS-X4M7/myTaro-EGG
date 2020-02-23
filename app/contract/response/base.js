module.exports = {
  baseResponse: {
    code: { type: 'number', example: 200, required: true },
    data: { type: 'object', example: {}, required: true },
    success: { type: 'boolean', required: true },
    msg: { type: 'string', required: true },
  },
};
