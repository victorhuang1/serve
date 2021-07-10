const mongoose = require('mongoose');
// 实验室环境 需要使用 sudo service mongodb start 启动 mongodb 服务
const address = "localhost:27017/chat";
mongoose.connect(`mongodb://${address}`, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);