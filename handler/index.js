const {strEquals, valueEquals} = require('../utils/util');
/**
 *   处理器封装
 * @param handler
 */
module.exports = (handler) => {

    //客户端连接数量
    let onlineUserCount = 0;
    //统计客户端登录用户
    let onlineUsers = {};

    /**
     *  serve： 总线
     *  socket： 当前连接
     */
    handler.on("socketOpen", (serve, socket) => {

        function findSocketById(id) {
            for (const item in onlineUsers) {
                let temp = onlineUsers[item]
                if (strEquals(temp._id, id)) {
                    return serve.sockets.sockets[temp.sid];
                }
            }
        }
        // 从在线用户中查找 用户链接
        function findSocketByUId(UId) {
            // 判断下是否存在
            if (onlineUsers.hasOwnProperty(UId)) {
                let temp = onlineUsers[UId];
                return serve.sockets.sockets[temp.sid];
            }
        }

        // 封装 线程模型
        let model = {
            serve,
            onlineUserCount,
            onlineUsers,
            socket,
            findSocketById,
            findSocketByUId,

        };
        // 事件分发
        let EventEmitter = require('events');
        const event = new EventEmitter();
        // 处理器注册
        // const demo =  require("./DemoHandler");
        // demo(model,event);

        const base =  require("./baseHandler");
        const group =  require("./groupHandler");
        const message =  require("./messageHandler");
        base(model,event);
        group(model,event);
        message(model,event);

        let events = event._events;
        for (let key in events) {
            socket.on(key, events[key]);
        }
    });
};