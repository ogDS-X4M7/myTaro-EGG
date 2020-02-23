module.exports = app => {
    // 因为配置了mongoose插件，所以在app上可以直接获得mongoose
    const mongoose = app.mongoose;
    // 使用mongoose创建Schema
    const Schema = mongoose.Schema;
    // 定义TodoSchema，注意命名规范
    const TodoSchema = new Schema(
        {
            text: String, // 待办事项名称
            creatorId: String, // 创建者ID
        },
        {
            timestamps: {
                createdAt: 'createDate',
                updatedAt: 'updateDate'
            }
        }
    );
    // 注意此处定义的model名称是首字母大写的Todo
    return mongoose.model('Todo', TodoSchema);
};
