
const Service = require('egg').Service;
const mongoose = require('mongoose');
class UserService extends Service {
    async createUser(data) {
        return this.ctx.model.User({ ...data }).save();
    }

    async findUser(params = {}) {
        // 取得自己需要的字段 name role avatarUrl
        return this.ctx.model.User.find(params, 'name role avatarUrl').sort('-createDate').lean();
    }

    async findOneUser(params = {}) {
        // 取得自己需要的字段 name role，这里为了展示都有些什么，就把它们去掉
        // return this.ctx.model.User.findOne(params, 'name role').lean();
        return this.ctx.model.User.findOne(params).lean();
    }

    async updateOneUser(condition = {}, doc) {
        return this.ctx.model.User.updateOne(condition, doc).lean();
    }
    async deleteUser(id) {
        return this.ctx.model.User.remove({ _id: id }).lean();
    }

    // 添加push操作数据库数组类型字段的方法
    async addToArrayField(userId, fieldName, item) {
        return this.ctx.model.User.updateOne(
            { _id: userId },
            { $push: { [fieldName]: item } }
        ).lean();
    }

    // 通过code获取用户openid作为唯一标识
    async getWxOpenId(JSCODE) {
        const { ctx } = this;
        const { appId, appSecret } = ctx.app.config.wx;
        const result = await ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${JSCODE}&grant_type=authorization_code`, {
            dataType: 'json',
            timeout: 5000,
            method: 'GET',
            contentType: "application/json",
            data: JSON.stringify({})
        })
        const data = result.res.data;
        // console.log(data)
        if (!data.errcode) {
            console.log(data)
        } else if (data.errcode === 41008) {
            throw new Error('缺少 code')
        } else if (data.errcode === 40163) {
            throw new Error('code已经被使用')
        } else if (data.errcode === 40029) {
            throw new Error('code 无效')
        } else if (data.errcode === 45011) {
            throw new Error('操作太频繁，请稍候再试')
        } else if (data.errcode === -1) {
            throw new Error('系统繁忙，请稍候再试')
        }
        return data;
    }

    // 创建用户，若已有用户则直接返回
    async createWxUser(data) {
        const ctx = this.ctx;
        // 查询是否已有用户，有的话就直接返回用户，没有再新建
        const user = await this.findOneUser({
            openId: data.openId
        })
        if (user) return user;
        const newUser = await ctx.model.User(data).save();
        console.log('创建新用户')
        return newUser;
    }

    // 更新用户头像昵称信息
    async updateUser(data) {
        // const ctx = this.ctx;
        const updateRes = await this.updateOneUser({ _id: data.userid }, { $set: { avatarUrl: data.avatarUrl, name: data.userName } })
        return updateRes;
    }

    // 更新浏览历史记录，注意要做去重
    async updateHistory(data) {
        // 注意查询用户使用的userid是ObjectId类型，因此要先转换才能查到
        const userid = mongoose.Types.ObjectId(data.userid);
        // 先查询用户
        const user = await this.findOneUser({ _id: userid });
        // 移除旧记录（如果存在）
        if (user.history) {
            let newHistory = user.history.filter(item => item !== data.history);
            // 长度没变说明没有移除，不重复，那么直接添加进数组
            if (newHistory.length === user.history.length) {
                return this.addToArrayField(data.userid, 'history', data.history)
            } else {
                // 长度变了说明有重复，有移除，那么就需要整个数组更新
                newHistory.push(data.history);
                // 更新回数据库
                return this.updateOneUser(
                    { _id: data.userid },
                    { $set: { history: newHistory } }
                );
            }
        } else {
            // 没有记录的话直接存放
            return this.addToArrayField(data.userid, 'history', data.history)
        }

    }

    // 获取历史记录接口
    async getHistory(data) {
        // 注意查询用户使用的userid是ObjectId类型，因此要先转换才能查到
        const userid = mongoose.Types.ObjectId(data.userid);
        // 先查询用户
        const user = await this.findOneUser({ _id: userid });
        return user.history;
    }

    // 清空浏览历史接口
    async clearHistory(data) {
        // // 注意查询用户使用的userid是ObjectId类型，因此要先转换才能查到
        // const userid = mongoose.Types.ObjectId(data.userid);
        // // 先查询用户
        // const user = await this.findOneUser({ _id: userid });
        return this.updateOneUser(
            { _id: data.userid },
            { $set: { history: [] } }
        );
    }

    // 更新点赞接口-包括增加和取消，传参token，url，signal信号-1表示点赞，0表示取消
    async updateLikes(data) {
        const userid = mongoose.Types.ObjectId(data.userid);
        const user = await this.findOneUser({ _id: userid });
        if (user.likes) {
            // 点赞同样检测重复，同时根据信号判断是点赞还是取消
            let newLikes = user.likes.filter(item => item !== data.like);
            let repeat = false; // 重复信号
            if (newLikes.length === user.likes.length) repeat = true;
            // 长度没变说明无重复，点赞就直接进，取消那就是乱来了
            if (repeat) {
                if (data.signal) {
                    return this.addToArrayField(data.userid, 'likes', data.like)
                } else {
                    return '错误，并未点赞'
                }
            } else {
                // 重复,取消就把new放进去，点赞也是有问题，反馈点过了
                if (data.signal) {
                    return '错误，已经点过'
                } else {
                    return this.updateOneUser(
                        { _id: data.userid },
                        { $set: { likes: newLikes } }
                    );
                }
            }
        } else {
            return this.addToArrayField(data.userid, 'likes', data.like)
        }
    }
    // 获取点赞接口
    // 更新收藏接口-包括增加和取消，传参token，url，signal信号-1表示点赞，0表示取消
    // 获取收藏接口
}

module.exports = UserService;
