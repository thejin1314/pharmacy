// 后端服务器
const api=require('./api');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
// const cors = require('cors');//跨域
const express = require('express');
const app = express();

//跨域
// app.use(cors());

// app.use(express.json({limit:'5mb'}));

//当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//服务开启后访问指定编译好的dist文件下的数据
app.use(express.static(path.resolve(__dirname,'../dist')))

app.get('/favico.ico', (req, res) => {
  res.sendStatus(204);
});
//后端api路由
app.use(api);

//监听端口
app.listen(8080);
// console.log('success listen at port:8080......');
console.log('MongoDB数据库连接成功~~')