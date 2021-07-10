/**
 *  群组变化通知
 * @param groupList
 * @param channel
 */
function groupChangeNotify(groupList, channel) {
    if (!groupList) return;
    let {onlineUserCount, serve, onlineUsers, socket, findSocketByUId} = channel;
    let notifyList = {};
    for (let group of groupList) {
        const {userList} = group
        // 加入房间
        for (let tempUser of userList) {
            notifyList[tempUser.id] = tempUser.id;
        }
    }
    // 不通知自己
    delete notifyList[socket.uid];
    for (let uid in notifyList) {
        const toSocket = findSocketByUId(uid);
        if (toSocket) {
            toSocket.emit("change_status_group")
        }
    }
}


function notifyUserByUid(uid, event,data, channel) {
    let { findSocketById,findSocketByUId} = channel;
        // 发送事件给上线的
        const toSocket =  findSocketByUId(uid) ;
        if (toSocket) {
            toSocket.emit(event)
        }
}

/**
 *  用户属性变化推送
 * @param friends
 * @param groups
 * @param channel
 */
function userChangeNotify(friends, groups, channel) {
    groupChangeNotify(groups, channel);
}

module.exports = {
    userChangeNotify,
    groupChangeNotify,
    notifyUserByUid,
};
