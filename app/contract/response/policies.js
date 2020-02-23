module.exports = {
    getPoliciesResponse: {
        code: { type: 'number', example: 200, required: true },
        data: {
            type: 'array', itemType: 'string', example: [[
                "角色",
                "接口地址",
                "方法"
            ]], required: true
        },
        success: { type: 'boolean', required: true },
        msg: { type: 'string', required: true },
    },
};
