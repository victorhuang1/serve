/**
 *  用户米线
 * @type {module:mongoose}
 */
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    id: { type: Number, default: 1, unique: true },
    name: { type: String, required: true },
    password: { type: String, require: true, select: false },
    avatar: { type: String, },
    // 签名
    sign:{type:String},
    online: { type: Boolean, default: false },
    account:{type: String,required: true},
    // 全部对话
    groups: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Group' }],
    // 好友  不给增加分组
    friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
});
const model = mongoose.model('User', schema);
module.exports = model;
