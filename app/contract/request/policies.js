module.exports = {
    createPoliciesRequest: {
        policy: {
            type: 'string', required: true, example: [
                "user",
                "/api/v1/**",
                "(GET)|(POST)|(PUT)|(DELETE)"
            ], description: '协议[角色, 接口, 调用方法]'
        },
    },
    rolePowerRequest: {
        roleId: {
            type: 'string', required: true, example: '5cdfbc77120aab78c0479500', description: '角色ID'
        },
        powerId: {
            type: 'string', required: true, example: '5cdfbc77120aab78c0479500', description: '权限ID'
        },
    },
};
