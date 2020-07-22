// 引入mongoose
const mongoose = require('mongoose');
// 连接数据库
mongoose.connect('mongodb://localhost:27017/pharmacy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// user
const userSchem= new mongoose.Schema({
    username:String,//用户名
    password:String,//密码
    role_name:String,//角色
    email:String,//邮箱
    mobile:String,//手机
  },{ versionKey: false })

