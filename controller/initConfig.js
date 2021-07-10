const Group = require("../models/Group")

const User = require("../models/User")
const {createGroup} = require("../biz/IGroup")

module.exports = (router) => {
    // 初始化数据库
    initSystem();
}


async function initSystem() {

    let admin = await  User.findOne({account: 'admin'});
    if (admin) {
        return
    }
    let userModel = {
        account: 'admin',
        password: 'admin',
        avatar:'https://portrait.gitee.com/uploads/avatars/user/477/1431998_y747718944_1578951332.png!avatar200',
        name: '七月',
        id: 0,
    }
    const lastUser = await  User.findOne({}).sort({id: -1});

    if (lastUser) {
        userModel.id = lastUser.id + 1;
    }
    admin =  await User.create(userModel)

    let group = await  Group.findOne({id: 0});
    if (group) {
        return
    }
    let chatForm = {
        id: 0,
        avatar: 'https://tva2.sinaimg.cn/crop.0.0.199.199.180/005Zseqhjw1eplix1brxxj305k05kjrf.jpg',
        name: '共同进步',
        desc: 'VUE-MChat群聊',
        master: admin._id,
        userList: [],
    }

    await createGroup(admin,chatForm)
}