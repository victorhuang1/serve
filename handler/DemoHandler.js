/**
 *  消息处理器
 * @param model 线程模型
 * @param event 事件器
 */
module.exports = (model, event) => {
    // 解构出 socket 对象
    const { socket } = model;

    //加入频道
    event.on("joinRoom", function (data, fn) {
        socket.join(data.channelName); // join(频道名)加入频道
        fn({ "code": 0, "msg": "加入频道成功", "channelName": data.channelName });
    });

    //退出 离开频道
    event.on("leaveRoom", function (data, fn) {
        socket.leave(data.channelName);//leave(频道名) 离开频道
        fn({ "code": 0, "msg": "已退出频道", "channelName": data.channelName });
    });
    //监听客户端发送的 sendMsg 事件
    event.on("sendMsg", function (data) {
        // data 为客户端发送的消息，可以是 字符串，json对象或buffer
        // 使用 emit 发送消息，broadcast 表示 除自己以外的所有已连接的socket客户端。
        // to(频道名)表示给除自己以外的同一频道内的socket用户推送消息.
        console.log(data);
        socket.broadcast.to(data.channelName).emit("receiveMsg", data);
    })
};
