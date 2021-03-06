const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    id: {type: Number, default: 1, unique: true},
    // 群组头像
    avatar: {type: String, },
    // 群组名称
    name: {type: String, required: true},
    // 成员
    userList: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
    // 群主
    master: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    // 描述
    desc: {type: String},
});


const model = mongoose.model('Group', schema);
module.exports = model;