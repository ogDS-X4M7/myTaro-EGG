module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const RoleSchema = new Schema({
        name: {
            type: String,
            required: true
        }, // 角色
        system: {
            type: Boolean,
            default: false
        }, // 是否是系统预置角色
    }, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });
    return mongoose.model('Role', RoleSchema);
};