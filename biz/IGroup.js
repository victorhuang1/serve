const User = require("../models/User");
const Group = require("../models/Group");
const {strEquals, valueEquals} = require('../utils/util');


// 创建群聊
async function createGroup(user, form) {
    form.master = user._id;
    form.userList.push(user._id);

    const group = await Group.create(form);
    const groups = user.groups;
    groups.push(group._id);
    await User.findByIdAndUpdate(form.master, {
        $set: {
            groups
        }
    }, {new: true});
}


/**
 *  添加会话
 * @param uId 用户id
 * @param sId
 * @returns {Promise<void>}
 */
async function joinGroup(uId, gId) {
    const user = await User.findOne({id: uId});
    if (user) {
        await joinGroupByUser(user, gId);
    }
}


async function joinGroupByUser(user, id) {
    const group = await Group.findOne({id});
    const {groups} = user;
    groups.push(group._id);
    const {userList} = group;
    userList.push(user._id);
    await User.findByIdAndUpdate(user._id, {
        $set: {
            groups
        }
    }, {new: true});
    const temp = await Group.findByIdAndUpdate(group._id, {
        $set: {
            userList
        }
    }, {new: true})
}


/**
 *   推群组信息变更
 * @param groups
 * @param socket
 */
function pushGroups(groups = [], socket) {
    let groupList = [];
    for (const group of groups) {
        let {userList, master} = group;
        // 数组排序整理
        let user = [];
        for (let item of userList) {
            let temp = {
                id: item.id,
                _id: item._id,
                name: item.name,
                online: item.online,
                avatar: item.avatar,
                role: undefined
            };
            if (strEquals(item._id, master)) {
                temp.role = 'master';
                user.unshift(temp)
            } else {
                user.push(temp);
            }
        }

        let model = {
            id: group.id,
            name: group.name,
            userList: user,
            avatar: group.avatar,
            desc: group.desc,
        };
        groupList.push(model)
    }
    socket.emit("push_groups", groupList)
}


async function groupUsers(groupId) {
    const group = await Group.findOne({id: groupId});
    return group.userList;
}


module.exports = {
    joinGroup,
    joinGroupByUser,
    createGroup,
    pushGroups,
    groupUsers,
}