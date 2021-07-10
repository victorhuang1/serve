const User = require("../models/User")
// 断言慎用
const assert = require('http-assert');
const auth = require('./auth');

const jwt = require('jsonwebtoken');

const  {joinGroup, joinGroupByUser} = require('../biz/IGroup');

module.exports = async (router) => {
    // 登录方法
    router.post('/login', async (req, resp) => {
        const user = await User.findOne(req.body);
        if (!user) {
            resp.send({
                flag: false,
                msg: '账号或密码错误'
            });
            return
        }
        const token = jwt.sign({id: user._id}, req.app.get('jwtKey'));
        resp.send({
            flag: true,
            data: {
                token
            }
        });
    });


    // 注册
    router.post('/register', async (req, resp) => {
        let form = req.body;
        // 账号查重
        let flag = await User.findOne({account: form.account});
        if (flag) {
            resp.send({
                flag: false,
                msg: '账号已存在！'
            });
            return;
        }

        // 手动自增Id
        const lastUser = await User.findOne({}).sort({id: -1});
        if (lastUser) {
            form.id = lastUser.id + 1;
        }
        const user = await User.create(form)
        // 公共群
        await joinGroupByUser(user,0);
        resp.send({
            flag: true
        });
    });

// 页面重新加载
    router.get('/load', auth, async (req, resp) => {
        // assert(!req.user.online, 403, '该用户在别处已登录！重新登录！');
        let {user} = req;
        let userVO = {
            id: user._id,
            username: user.name,
            avatar: user.avatar,
            status: "online",
            account:user.account,
        };

        resp.send({
            flag: true,
            data: userVO,
        });

    })
};






