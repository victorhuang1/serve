const User = require("../models/User");
const Group = require("../models/Group");
const {pushGroups} = require("../biz/IGroup");
const {userChangeNotify} = require("../biz/INotify");


/*
* 处理连接事件相关处理器
 */
module.exports = (channel, event) => {
    let {onlineUserCount, serve, onlineUsers, socket} = channel;
    
    event.on("online", async data => {
        const user = await User.findOne(data).populate("friends");
        // 备份需要的数据
        socket.uid = user.id;
        socket._id = user._id;
        socket.name = user.name;
        socket.avatar = user.avatar;
        // 注册
        if (!onlineUsers.hasOwnProperty(socket.uid)) {
            onlineUserCount++;
            onlineUsers[socket.uid] = {
                uid: socket.uid,
                _id: socket._id,
                sid: socket.id,
            };
        }
        await User.findByIdAndUpdate(user._id, {
            $set: {
                online: true,
            }
        }, {new: true});

        // 查询更新群组
        let groupList = await Group.find({
            _id: {
                $in: user.groups
            }
        }).populate("userList");

        const friends = user.friends;
        pushGroups(groupList, socket);
        userChangeNotify(friends, groupList, channel);
        console.log(' connection,当前在线人数:' + onlineUserCount);
    });


    event.on("disconnect", async data => {
        if (!socket._id) {
            return false;
        }
        const user = await User.findByIdAndUpdate(socket._id, {
            $set: {
                online: false,
            }
        }, {new: true});

        // 回话又要通知一遍。。。
        // 查询更新群组
        let groupList = await Group.find({
            _id: {
                $in: user.groups
            }
        }).populate("userList");
        userChangeNotify(user.friends, groupList, channel);
        if (onlineUsers.hasOwnProperty(socket.uid)) {
            onlineUserCount--;
            delete onlineUsers[socket.uid];
        }
        console.log(' disconnect,当前在线人数:'+onlineUserCount);
    })


};