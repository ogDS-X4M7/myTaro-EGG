module.exports = {

    // 定义的规则 一级名称_二级名称_三级名称（这里有的也只有一级和二级），二级名称指获取缓存内容所需的字段，三级名称一般指存储内容
    // 结合redis可以看到USER_TOKEN: 'user:${userId}:token',
    // 存储在redis中就是，有user文件夹是一级目录，二级目录就是userId的值
    // 其下第三级也就是存储文件，文件名为一级名：二级名：三级名，也就是（user:684e7c4343476d6790eb1fc1:token）
    // 它们也管这叫key，value，这里key是user:684e7c4343476d6790eb1fc1:token；value就是token的值了

    USER_DATA: 'user:${userId}', // user(json)
    USER_PROPERTY: 'user:${userId}:${property}', // value
    USER_TICKET: 'user:${userId}:ticket', // ticket
    USER_TOKEN: 'user:${userId}:token', // token
    USER_SESSIONKEY: 'user:${userId}:sessionkey', // sessionkey
    USER_OPENID: 'user:${userId}:openid', // openid

    TICKET_USER_ID: 'ticket:${ticket}', // userId

    TOKEN_USER: 'token:${token}', // user(json)
    TOKEN_USER_ID: 'token:${token}:userId', // userId
    TOKEN_USER_AVATARURL: 'token:${token}:avatarUrl', // avatarUrl
    TOKEN_USER_USERNAME: 'token:${token}:userName' // userName
}