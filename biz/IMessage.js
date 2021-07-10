const {groupUsers} = require("./IGroup");

const {strEquals, valueEquals} = require('../utils/util')

/**
 *  把消息推送给群组
 * @param groupId
 * @param message
 * @param channel
 * @returns {Promise<void>}
 */
async function pushMessageToGroup(groupId, message, channel) {
    let {socket, findSocketById} = channel;
    let list = await groupUsers(groupId);

    for (const item of list) {
        // 过滤掉自己
        if (strEquals(item, socket._id)){
            continue;
        }
        const toSocket = findSocketById(item);

        if (toSocket) {
            toSocket.emit("receive", message);
        }
    }
}


/**
 *  把消息发送给用户，俗称私聊
 * @param id
 * @param message
 * @param channel
 * @returns {Promise<void>}
 */
function pushMessageToUser(id, message, channel) {
    let {findSocketByUId,socket} = channel;
    const toSocket = findSocketByUId(id);
    if (toSocket) {
        toSocket.emit("receive", message);
    }
}


module.exports = {
    pushMessageToGroup,
    pushMessageToUser,
}