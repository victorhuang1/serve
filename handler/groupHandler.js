const User = require("../models/User");
const Group = require("../models/Group");
const {pushGroups} = require("../biz/IGroup");

/*
*  处理群组相关
 */
module.exports = (channel, event) => {

    let {onlineUserCount, serve, onlineUsers, socket} = channel;
    // client 拉取对话变化
    event.on("pull_group", async () => {
        if (!socket._id) {
            return
        }
        const user = await User.findById(socket._id);
        // 查询更新群组
        let groupList = await Group.find({
            _id: {
                $in: user.groups
            }
        }).populate("userList");
        pushGroups(groupList, socket);
    });

    // 离开群组
    event.on("leave_group", async (data)=>{
        if (!socket._id) {
            return
        }


    });
};





