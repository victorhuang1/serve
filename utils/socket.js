/**
 *   socket.io 服务端封装
 * @param app 应用服务
 * @param event 事件通知器
 */
module.exports = (serve, event) => {
    const io = require('socket.io')(serve);
    io.on('connection', socket => {
        event.emit("socketOpen", io, socket);
    });
};

