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