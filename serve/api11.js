let express=require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let db=require('./db');

//登陆
router.post('/api/login', (req, res) => {
  console.log(req.body);
  
  db.User.find({acc:req.body.acc, psw: req.body.pwd}, (err, docs) => {
      if (err) {
          res.send(err);
          return
      }
      if (docs.length > 0) {
              res.send({ 'status': 1, 'msg': '登陆成功'})
          // })
      } else {
          res.send({ 'status': 0, 'msg': '登录失败' ,'detail':docs});
      }
  })
})

//课程信息
router.get('/api/getCourse',(req,res)=>{
  db.Course.find({},(err,doc)=>{
    if(!err){
      res.send(doc);
    }else{
     throw(err);
    }
  })
})
router.get('/api/getSelCourse',(req,res)=>{
  db.myCourse.find({},(err,doc)=>{
    if(!err){
     res.send(doc);
    }else{
     throw(err);
    }
  })
})
module.exports = router;
