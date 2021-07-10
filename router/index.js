const express = require('express');
const router = express.Router();

// 注册控制器
const login = require("../controller/login");
login(router);

const initConfig = require("../controller/initConfig");
initConfig(router);

router.use((err, req, resp, next) => {
    resp.status(err.statusCode || 500).send(err);
});


module.exports = router;