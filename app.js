const express = require('express');
//  初始化服务
const app = express();
// http 服务器
const httpPort = 8080;
// 视图页面存放位置
const view = '/view/IChat';
const uploads = 'uploads';
// 初始页面路径
app.use('/',express.static(__dirname + view+"indexhtml"));

/**
 *  以下是 服务器配置
 */

// cors 跨域问题
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "*");
    next();
});


const bodyParser = require('body-parser');
// express 中间件 bodyParser
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// express 启用 gzip
const compression = require('compression');
app.use(compression());

// 文件系统
app.use('/uploads', express.static(__dirname + uploads));
app.use(express.static(__dirname + view));

const serve = require('http').createServer(app);

// 监听服务端口
serve.listen(httpPort, function () {
    console.log('Http serve is running at port:',httpPort )
});

/**
 *   观察者
 * @type {module:events.EventEmitter}
 */
const EventEmitter = require('events');
const observe = new EventEmitter();
// 加载 socket module
const socket = require('./utils/socket');
// 挂载 Websocket 服务
socket(serve,observe);

// 注册处理器
const handler =  require('./handler/index');
handler(observe);

// 加载 数据库连接池
require('./db/mongodb');

// 注册路由
const router = require('./router');
app.use(router);

// jwt key
app.set('jwtKey', 'meteor');


