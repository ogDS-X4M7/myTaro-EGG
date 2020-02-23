
module.exports = {
    ceratePowersRequest: {
        name: { type: 'string', required: true, example: '删除权限', description: '权限的名称' },
        value: { type: 'string', required: true, example: 'remove_power', description: '权限的值' },
        router: { type: 'string', required: true, example: '/api/v1/powers', description: '权限的路由' },
        method: { type: 'string', required: true, example: '(GET)|(POST)|(PUT)|(DELETE)', description: '权限的方法' },
    }
};