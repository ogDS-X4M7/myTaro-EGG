const { DEFAULT_PASSWORD } = require('../constant/index');
const md5 = require('md5');
const md5SignValue = md5(DEFAULT_PASSWORD);

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const UserSchema = new Schema({
        name: String, // 姓名
        sex: {
            type: Number,
            default: 0
        }, // 性别 0未设置 1男 2女
        password: {
            type: String,
            default: md5SignValue

        }, // 密码
        avatarUrl: String,
        role: { type: Schema.Types.ObjectId, ref: 'Role' }, // 角色
        uuid: String,
        openId: String, // 微信 openId
        userStatus: {
            type: Number,
            default: 0
        }, // 0 访客 1 正式用户
        platform: {
            type: Number,
            default: 1
        }, // 0 微信 1 系统
        history: [String], // 浏览历史，数组形式
        likes: [String], // 我点赞的，数组形式
        collections:[String], // 我的收藏，数组形式
    }, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });
    UserSchema.pre('find', function () {
        this.populate('role', 'name');
    });
    UserSchema.pre('findOne', function () {
        this.populate('role', 'name');
    });
    return mongoose.model('User', UserSchema);
};