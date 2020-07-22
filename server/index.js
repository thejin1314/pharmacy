//  *** 一、后端服务器部分 ***  //

// 引入express（node的框架）
const express = require('express');
// 定义express
const app = express();
// 安装允许跨域
app.use(require('cors')());

// 中间件传输数据，通过json
app.use(express.json());
// 生产token
const jwt = require('jsonwebtoken');

// // 定义地址
// const path = require('path');
// //服务开启后访问指定编译好的dist文件下的数据（build打包后的文件）
// app.use(express.static(path.resolve(__dirname,'../dist')))

//  *** 二、db数据库部分 ***  //

// 定义数据库模板
var mongoose = require('mongoose');
// 连接mongodb数据库
mongoose.connect('mongodb://localhost:27017/pharmacy', {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

////  定义数据库“模型 6个”和返回“状态码”  ////

//1、模型名为 Login  对应数据库文档名为 logins 
const Login = mongoose.model('Login', new mongoose.Schema({
  // _id:{},
  username: {
    type: String
  }, //用户名
  password: {
    type: String
  }, //密码
  role: {
    type: String
  }, //角色
  email: {
    type: String
  }, //邮箱
  phoneNumber: {
    type: String
  }, //电话
  jobNum: {
    type: String
  }, //工号
  position: {
    type: String
  }, //职务
  department: {
    type: String
  }, //部门
  officePhone: {
    type: String
  }, //办公电话
  permissionLevel: {
    type: String
  }, //权限级别
}))
//2、模型名为 Drug  对应数据库文档名为 drugs
const Drug = mongoose.model('Drug', new mongoose.Schema({
  picture: {
    type: String
  }, //图片
  drugsName: {
    type: String
  }, //药品名
  specification: {
    type: String
  }, //规格
  price: {
    type: String
  }, //价格
  classify: {
    type: String
  }, //分类
  effect: {
    type: String
  }, //作用
  operation: {
    type: String
  }, //操作
}))
//3、模型名为 Order  对应数据库文档名为 orders
const Order = mongoose.model('Order', new mongoose.Schema({
  orderNumber: {
    type: String
  }, //订单编号
  orderTime: {
    type: String
  }, //下单时间
  orderPrice: {
    type: String
  }, //订单价格
  payment: {
    type: String
  }, //是否付款
  shipments: {
    type: String
  }, //是否发货
  notes: {
    type: String
  }, //备注
  operation: {
    type: String
  }, //操作
}))
//4、模型名为 Permission  对应数据库文档名为 permissions
const Permission = mongoose.model('Permission', new mongoose.Schema({
  permissionName: {
    type: String
  }, //权限名称
  path: {
    type: String
  }, //路径
  role: {
    type: String
  }, //角色
  permissionLevel: {
    type: String
  }, //权限等级
}))
//5、模型名为 Role  对应数据库文档名为 roles
const Role = mongoose.model('Role', new mongoose.Schema({
  roleName: {
    type: String
  }, //角色名
  owner: {
    type: Array
  }, //拥有者
  position: {
    type: String
  }, //职务
}))
//6、模型名为 User  对应数据库文档名为 users 
const User = mongoose.model('User', new mongoose.Schema({
  userName: {
    type: String
  }, //用户名
  passWord: {
    type: String
  }, //密码
  role: {
    type: String
  }, //角色
  email: {
    type: String
  }, //邮箱
  phoneNumber: {
    type: String
  }, //电话
  mgState: {
    type: Boolean
  }, //状态（开关）
}))
//6、菜单模型名为 Menu  对应数据库文档名为 menus
const Menu = mongoose.model('Menu', new mongoose.Schema({
  id: {
    type: String
  }, //id
  oneMenuName: {
    type: String
  }, //一级菜单名
  path: {
    type: String
  }, //地址名
  children: {
    type: Array
  }, //二级菜id、名、地址名
}))


//  *** 三、api接口部分 ***  //

// 注释左侧为api接口名   中间为为模型名   右侧为数据库集合名//

//// 使用在  /login页面
// ** 获取当前登录的用户是否授权，匹配数据库roles的owner(用户名)，依赖于/role_permission_management界面的操作
//1**  authorization   Role  roles
app.get('/api/authorization', async (req, res) => {
  // console.log(req.query.username)
  var username = req.query.username
  const roles = await Role.find()
  //  console.log(roles)
  var a;
  roles.forEach(element => {
    // console.log(element.owner)
    var owner = element.owner; {
      owner.forEach(element => {
        // console.log(element)
        if (element == username) {
          a = true;
        }
      });
    }
  });
  // console.log(a)
  if (a == true) {
    res.send({
      meta: {
        status: 200,
        msg: '该用户已授权',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '该用户未授权'
      }
    })
  }

})
//2**登录验证  匹配用户名和密码  logins   Login  logins
app.post('/api/logins', (req, res) => {
  // console.log(req.body)
  Login.findOne(req.body, function (err, tank) {
    if (err) return handleError(err);
    // console.log(req.body)
    // console.log(tank)
    // console.log(tank._id)
    // 判断 tank 的长度
    if (tank == null) {
      res.send({
        meta: {
          status: 400,
          msg: '登录失败！'
        }
      })
    } else {
      var token = jwt.sign({
          data: 'foobar',
        }, 'secret',
        // {
        // token失效时间
        // expiresIn: '24h'
        // }
      );
      // console.log(token)
      if (!token) {
        res.send({
          meta: {
            status: 303,
            msg: 'token配置失败'
          }
        })
      } else {
        res.send({
          data: {
            // 将id以字符串的形式输出
            _id: tank._id,
            token: token,
            username: tank.username,
            position: tank.position,
            role: tank.role,
            jobNum: tank.jobNum,
          },
          meta: {
            status: 200,
            msg: '登陆成功！'
          }
        })
      }
    }
  });
})

// 使用在 /home页面
// ** 获取头部区域欢迎标语前的当前登录的用户名
//3**  username   Login  logins
app.get('/api/username', async (req, res) => {
  // 将获取到的id（string）转换成对象类型给数据库的_id（Object）匹配
  var myId = JSON.parse(req.query.id)
  const username = await Login.findById(
    // 获取前端的 id  查找判断数据库是否有相同的
    myId
  )
  // console.log(req.query.id)
  // 设置 infos 返回数据判断条件以及返回状态码
  if (username.length != 0) {
    // console.log(username.username)
    res.send({
      username: username.username, //输出当前登录的用户名
      meta: {
        status: 200,
        msg: '获取用户名成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取用户名失败！'
      }
    })
  }
})
// ** 根据前台发来的角色匹配数据库
//4**获取左侧菜单  menus   Menu  menus
app.get('/api/menus', async (req, res) => {
  // 管理员返回全部菜单
  // 药品管理员返回 药品管理、个人中心、权限列表菜单 
  // 订单管理员返回 订单管理、个人中心、权限列表菜单
  // 用户管理员返回 用户列表、个人中心、权限列表菜单
  // all：allPermission 为权限列表（新建的菜单，只含有一个二级菜单）的关键词
  // all：allUser 为用户列表（新建的菜单，只含有一个二级菜单）的关键词
  // id：500 为个人中心关键词
  // id：200 为订单管理关键词
  // id：100 为药品管理关键词
  // console.log(req.query.role)
  var role = req.query.role
  if (role == '系统管理员') {
    const tank = await Menu.find({
      // 取反
      $nor: [{
        all: 'allPermission'
      }, {
        all: 'allUser'
      }]
    })
    // console.log(tank)
    res.send({
      menus: tank, //具体数据node
      meta: {
        status: 200,
        msg: '获取 系统管理员 菜单成功！',
      }
    })
  } else {
    if (role == '药品管理员') {
      const drug = await Menu.find({
        $or: [{
          id: '100' //药品管理
        }, {
          all: 'allPermission' //权限列表
        }, {
          id: '500' //个人中心
        }]
      })
      // console.log(drug)
      res.send({
        menus: drug, //具体数据node
        meta: {
          status: 200,
          msg: '获取 药品管理员 菜单成功！',
        }
      })
    }
    if (role == '订单管理员') {
      const order = await Menu.find({
        $or: [{
          id: '200' //订单管理
        }, {
          all: 'allPermission' //权限列表
        }, {
          id: '500' //个人中心
        }]
      })
      // console.log(order)
      res.send({
        menus: order, //具体数据node
        meta: {
          status: 200,
          msg: '获取 订单管理员 菜单成功！',
        }
      })
    }
    if (role == '用户管理员') {
      const user = await Menu.find({
        $or: [{
          all: 'allUser' //用户列表
        }, {
          id: '500' //个人中心
        }, {
          all: 'allPermission' //权限列表
        }, ]
      })
      // console.log(user)
      res.send({
        menus: user, //具体数据node
        meta: {
          status: 200,
          msg: '获取 用户管理员 菜单成功！',
        }
      })
    }
  }
})

//// 使用在 /drugs_list页面
//5**获取药品列表数据.分页区域数据  drugs  Drug    drugs
app.get('/api/drugs', async (req, res) => {
  // console.log(req.query)
  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query[1]).pageSize)
  // console.log(typeof(pageSize) )
  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query[2]).pageNum)
  // console.log(typeof(pageNum) )
  // 跳过的数据
  var skipNum = Math.abs((pageNum - 1) * pageSize)
  // console.log(typeof(pageNum) )
  const drug = await Drug.find({})
  const drugs = await Drug.find().skip(skipNum).limit(pageSize)
  // console.log(drug)
  // console.log(skipNum.length)
  // console.log(drugs.length)
  // console.log(pageSize)
  // console.log(pageNum)
  // 设置 drugs 返回数据判断条件以及返回状态码
  if (drugs.length > 0) {
    res.send({
      data: {
        total: drug.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        drugs: drugs,
      },
      meta: {
        status: 200,
        msg: '获取药品列表成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取药品列表失败'
      }
    })
  }
})
//6**搜索药品  searchDrugs  Drug    drugs
app.get('/api/searchDrugs', async (req, res) => {
  var searchInput = req.query.searchDrugsForm //发来搜索表单
  // console.log(req.query)
  // console.log(JSON.parse(req.query.parameter[1]).pageSize)
  // console.log(JSON.parse(req.query.parameter[2]).pageNum)
  // console.log(parseInt(JSON.parse(req.query.parameter[2]).pageNum))
  // console.log(typeof(parseInt(JSON.parse(req.query.parameter[2]).pageNum)))
  //  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query.parameter[1]).pageSize)
  //  console.log(typeof(pageSize) )
  // // //  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query.parameter[2]).pageNum)
  //  console.log(typeof(pageNum) )
  //  // 跳过的数据
  var skipNum = (pageNum - 1) * pageSize
  //  console.log(typeof(skipNum) )
  const searchDrugs = await Drug.find({
    $or: [ //多条件模糊搜索，数组    
      { //药品名
        drugsName: {
          $regex: searchInput
        }
      },
      { //价格   准确搜索
        price: {
          $regex: searchInput
        }
      },
      { //分类
        classify: {
          $regex: searchInput
        }
      },
      { //作用
        effect: {
          $regex: searchInput
        }
      },
    ]
  })
  const searchDrug = await Drug.find({
    $or: [ //多条件模糊搜索，数组    
      { //药品名
        drugsName: {
          $regex: searchInput
        }
      },
      { //价格   准确搜索
        price: {
          $regex: searchInput
        }
      },
      { //分类
        classify: {
          $regex: searchInput
        }
      },
      { //作用
        effect: {
          $regex: searchInput
        }
      },
    ]
  }).skip(skipNum).limit(pageSize)
  // console.log(searchDrugs)
  // 设置 searchDrugs 返回数据判断条件以及返回状态码
  if (searchDrugs.length > 0) {
    res.send({
      data: {
        total: searchDrugs.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        searchDrugs: searchDrugs, //全部查找数据
        searchDrug: searchDrug, //按分页要求查找返回的数据
      },
      meta: {
        status: 200,
        msg: '搜索成功',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '搜索失败'
      }
    })
  }
})
//7**添加药品  addDrug  Drug    drugs
app.post('/api/addDrug', async (req, res) => {
  // var file = req.body.params.fileList
  // var body = req.body.params.addDrugForm
  // console.log(file)
  // console.log(body)
  // console.log(req.query)
  // const addDrug = await Drug.find({
  //   // 查找判断数据库是否有相同的
  //   "drugsName": req.body.drugsName,
  // })
  // console.log(addDrug.length)
  // if (addDrug.length == 0) {
  //   const addDrugInsert = await Drug.create(req.body)
  //   console.log(addDrugInsert)
  //   res.send({
  //     data: {
  //       total: addDrugInsert.length, //总数
  //       addDrugInsert: addDrugInsert, //具体数据
  //     },
  //     meta: {
  //       status: 200,
  //       msg: '添加药品成功！',
  //     }
  //   })
  // } else {
  //   res.send({
  //     meta: {
  //       status: 403,
  //       msg: '药品已存在！'
  //     }
  //   })
  // }
})
//8**修改药品信息  editDrug  Drug    drugs
app.post('/api/editDrug', async (req, res) => {
  const editDrug = await Drug.find({
    // 根据id查找判断数据库是否有相同的
    "_id": req.body._id,
  })
  if (editDrug.length > 0) {
    const editDrugUpdata = await Drug.update({
      '_id': req.body._id
    }, {
      // 把前端发来的所有数据一起修改
      $set: req.body
    })
    res.send({
      meta: {
        status: 200,
        msg: '药品信息修改成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '药品信息修改失败！'
      }
    })
  }
})
//9**删除药品  deleteDrug  Drug    drugs
app.post('/api/deleteDrug', async (req, res) => {
  const deleteDrug = await Drug.find({
    // 根据id查找判断数据库是否有相同的
    "_id": req.body._id,
  })
  if (deleteDrug.length > 0) {
    // 执行删除操作
    const deleteDrugUpdata = await Drug.deleteOne({
      '_id': req.body._id
    })
    res.send({
      // data: {
      //   total: deleteDrugUpdata.length,//总数
      //   deleteDrugUpdata: deleteDrugUpdata,//具体数据
      // },
      meta: {
        status: 200,
        msg: '删除药品成功！',
      }
    })
    res.send({
      meta: {
        status: 400,
        msg: '删除药品失败！',
      }
    })
  }
})

//////// 药品类别 获取药品数据
//// 使用在 /cat_fever界面
//10**感冒发烧  catFever  Drug    drugs
app.get('/api/catFever', async (req, res) => {
  // let params = req.query //获取请求参数
  const catFever = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // console.log(req.query)
  // 设置 catFever 返回数据判断条件以及返回状态码
  if (catFever.length > 0) {
    res.send({
      catFever: catFever, //具体数据
      meta: {
        status: 200,
        msg: '成功获取感冒发烧类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到感冒发烧类别的数据！'
      }
    })
  }
})
//// 使用在 /male_drugs界面
//11**男科用药  maleDrugs  Drug    drugs
app.get('/api/maleDrugs', async (req, res) => {
  // let params = req.query //获取请求参数
  const maleDrugs = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // 设置 maleDrugs 返回数据判断条件以及返回状态码
  if (maleDrugs.length > 0) {
    res.send({
      maleDrugs: maleDrugs, //具体数据
      meta: {
        status: 200,
        msg: '成功获取男科用药类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到男科用药类别的数据！'
      }
    })
  }
})
//// 使用在 /gynecological_drugs界面
//12**妇科用药  gynecologicalDrugs  Drug    drugs
app.get('/api/gynecologicalDrugs', async (req, res) => {
  // let params = req.query //获取请求参数
  const gynecologicalDrugs = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // 设置 catFever 返回数据判断条件以及返回状态码
  if (gynecologicalDrugs.length > 0) {
    res.send({
      gynecologicalDrugs: gynecologicalDrugs, //具体数据
      meta: {
        status: 200,
        msg: '成功获取妇科用药类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到妇科用药类别的数据！'
      }
    })
  }
})
//// 使用在 /bothsexes_supplies界面
//13**两性用品  bothSexesSupplies  Drug    drugs
app.get('/api/bothSexesSupplies', async (req, res) => {
  // let params = req.query //获取请求参数
  const bothSexesSupplies = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // 设置 catFever 返回数据判断条件以及返回状态码
  if (bothSexesSupplies.length > 0) {
    res.send({
      bothSexesSupplies: bothSexesSupplies, //具体数据
      meta: {
        status: 200,
        msg: '成功获取两性用品类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到两性用品类别的数据！'
      }
    })
  }
})
//// 使用在 /cardiac_cerebral_vessels界面
//14**心脑血管 garDioCerebralVessels  Drug    drugs
app.get('/api/garDioCerebralVessels', async (req, res) => {
  const gardiocerebralVessels = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // 设置 gardiocerebralVessels 返回数据判断条件以及返回状态码
  if (gardiocerebralVessels.length > 0) {
    res.send({
      gardiocerebralVessels: gardiocerebralVessels, //具体数据
      meta: {
        status: 200,
        msg: '成功获取心脑血管烧类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到心脑血管类别的数据！'
      }
    })
  }
})
//// 使用在 /pediatrics_drugs界面
//15**儿科用药  pediatricsDrugs  Drug    drugs
app.get('/api/pediatricsDrugs', async (req, res) => {
  const pediatricsDrugs = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // 设置 pediatricsDrugs 返回数据判断条件以及返回状态码
  if (pediatricsDrugs.length > 0) {
    res.send({
      pediatricsDrugs: pediatricsDrugs, //具体数据
      meta: {
        status: 200,
        msg: '成功获取儿科用药类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到儿科用药类别的数据！'
      }
    })
  }
})
//// 使用在/oldman_drug界面
//16**老人用药  oldManDrugs  Drug    drugs
app.get('/api/oldManDrugs', async (req, res) => {
  const oldManDrugs = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // 设置 oldManDrugs 返回数据判断条件以及返回状态码
  if (oldManDrugs.length > 0) {
    res.send({
      oldManDrugs: oldManDrugs, //具体数据
      meta: {
        status: 200,
        msg: '成功获取老人用药类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到老人用药类别的数据！'
      }
    })
  }
})
//// 使用在 /nutrition_healthcare界面
//17**营养保健  nutritionHealthcare  Drug    drugs
app.get('/api/nutritionHealthcare', async (req, res) => {
  const nutritionHealthcare = await Drug.find(
    // 获取前端的params具体参数 查找判断数据库是否有相同的
    req.query
  )
  // 设置 nutritionHealthcare 返回数据判断条件以及返回状态码
  if (nutritionHealthcare.length > 0) {
    res.send({
      nutritionHealthcare: nutritionHealthcare, //具体数据
      meta: {
        status: 200,
        msg: '成功获取营养保健类别的数据！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '没有找到营养保健类别的数据！'
      }
    })
  }
})

//// 使用在 /order_list界面
//18**获取订单列表数据.分区区域数据 orders  Order    orders
app.get('/api/orders', async (req, res) => {
  // console.log(req.query)
  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query[1]).pageSize)
  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query[2]).pageNum)
  // 跳过的数据
  var skipNum = parseInt((pageNum - 1) * pageSize)
  const ord = await Order.find({})
  const orders = await Order.find().skip(skipNum).limit(pageSize)
  // console.log(ord)
  // console.log(skipNum.length)
  // console.log(orders.length)
  // console.log(pageSize)
  // console.log(pageNum)
  // 设置 orders 返回数据判断条件以及返回状态码
  if (orders.length > 0) {
    res.send({
      data: {
        total: ord.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        orders: orders,
      },
      meta: {
        status: 200,
        msg: '获取订单列表成功',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取订单列表失败'
      }
    })
  }
})
//19**搜索订单 searchOrders  Order    orders
app.get('/api/searchOrders', async (req, res) => {
  var searchInput = req.query.searchOrdersForm //发来的参数
  // console.log(req.query)
  //  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query.parameter[1]).pageSize)
  // console.log(typeof(pageSize) )
  // // //  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query.parameter[2]).pageNum)
  // console.log(typeof(pageNum) )
  //  // 跳过的数据
  var skipNum = (pageNum - 1) * pageSize
  // console.log(typeof(skipNum) )
  const searchOrders = await Order.find({
    $or: [ //多条件模糊搜索，数组 
      { //订单编号
        orderNumber: {
          $regex: searchInput
        }
      },
      { //价格   准确搜索
        orderPrice: searchInput
      },
      { //是否付款
        payment: {
          $regex: searchInput
        }
      },
      { //发货状态
        shipments: {
          $regex: searchInput
        }
      },

    ]
  })
  const searchOrder = await Order.find({
    $or: [ //多条件模糊搜索，数组 
      { //订单编号
        orderNumber: {
          $regex: searchInput
        }
      },
      { //价格   准确搜索
        orderPrice: searchInput
      },
      { //是否付款
        payment: {
          $regex: searchInput
        }
      },
      { //发货状态
        shipments: {
          $regex: searchInput
        }
      },

    ]
  }).skip(skipNum).limit(pageSize)
  // console.log(searchOrders)
  // console.log(searchOrders.length)
  // 设置 searchOrders 返回数据判断条件以及返回状态码
  if (searchOrders.length > 0) {
    res.send({
      data: {
        total: searchOrders.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        searchOrders: searchOrders, //全部查找数据
        searchOrder: searchOrder, //按分页要求查找返回的数据
      },
      meta: {
        status: 200,
        msg: '查找订单成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '查找订单失败！'
      }
    })
  }
})
//20**修改订单信息  editOrder  Order    orders
app.post('/api/editOrder', async (req, res) => {
  const editOrder = await Order.find({
    // 根据id查找判断数据库是否有相同的
    "_id": req.body._id,
  })
  if (editOrder.length > 0) {
    const editOrderUpdata = await Order.updateOne({
      '_id': req.body._id
    }, {
      // 把前端发来的所有数据一起修改
      $set: req.body
    })
    res.send({
      meta: {
        status: 200,
        msg: '订单列表修改成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '订单列表修改失败！'
      }
    })
  }
})
//21**删除订单  deleteOrder  Order    orders
app.post('/api/deleteOrder', async (req, res) => {
  // console.log(req.body)
  var _id = req.body.params._id
  // // console.log(req.body.params._id)
  Order.deleteOne({
    '_id': _id
  }, {
    new: true
  }, function (err, result) {
    if (err) {
      return handleError(err);
    }
    if (result.deletedCount == 1) {
      res.send({
        meta: {
          status: 200,
          msg: '删除订单成功！',
        }
      })
    }
    if (result.deletedCount == 0) {
      res.send({
        meta: {
          status: 400,
          msg: '删除订单失败！',
        }
      })
    }
  });
})

//// 使用在 /permission_list界面
//22**获取权限列表数据  permissions   Permission  permissions
app.get('/api/permissions', async (req, res) => {
  const permissions = await Permission.find(req.body)
  // res.send(permissions)
  // 设置permissions返回数据判断条件以及返回状态码
  if (permissions.length > 0) {
    res.send({
      data: {
        total: permissions.length, //总数
        permissions: permissions, //具体数据
      },
      meta: {
        status: 200,
        msg: '获取权限列表成功',
      }

    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取权限列表失败'
      }
    })
  }
})

//// 使用在 /role_permission_management界面
//23**获取角色权限管理数据  roles   Role  roles
app.get('/api/roles', async (req, res) => {
  const roles = await Role.find(req.body)
  //   res.send(roles)
  // console.log(roles)
  // 设置roles返回数据判断条件以及返回状态码
  if (roles.length > 0) {
    res.send({
      data: {
        total: roles.length,
        roles: roles,
      },
      meta: {
        status: 200,
        msg: '获取角色列表成功',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取角色列表失败'
      }
    })
  }
})
//24**删除拥有者  deleteOwner   Role  roles
app.post('/api/deleteOwner', async (req, res) => {
  // console.log(req.body)
  // console.log(req.body._id)
  // console.log(req.body.owner)
  var id = req.body._id
  // // console.log(id)
  var owner = req.body.item
  Role.updateOne({
    _id: id,
  }, {
    $pull: {
      owner: owner
    }
  }, function (err, tank) {
    if (err) return Error(err);
    // console.log(tank)
    if (tank.nModified == 1) {
      res.send({
        meta: {
          status: 200,
          msg: '删除拥有者成功',
        }
      })
    } else {
      res.send({
        meta: {
          status: 400,
          msg: '删除拥有者失败'
        }
      })
    }
  })
})
//25**修改职务（roles数据库）  editRolesPosition   Role  roles
app.post('/api/editRolesPosition', (req, res) => {
  // console.log(req.body) 
  var id = req.body.id
  // console.log(req.body.id) 
  var position = req.body.position
  // console.log(req.body.position) 
  Role.findByIdAndUpdate(id, {
    $set: {
      position: position
    }
  }, {
    new: true
  }, function (err, data) {
    if (err) return handleError(err);
    // console.log(data)
    if (data.position == position) {
      res.send({
        data: {
          position: position, //修改的数据
        },
        meta: {
          status: 200,
          msg: '修改职务成功！',
        }
      })
    } else {
      res.send({
        meta: {
          status: 400,
          msg: '修改职务失败！'
        }
      })
    }
  })
})
//26**同步修改职务（logins数据库）  editLoginsPosition   Role  roles
// /admin_list获取到的数据中也有职务，依赖于logins数据库
app.post('/api/editLoginsPosition', (req, res) => {
  // console.log(req.body)
  // console.log(req.body.role)
  var position = req.body.position
  var role = req.body.role
  Login.updateMany({
    role: role
  }, {
    $set: {
      position: position
    }
  }, {
    new: true
  }, function (err, tank) {
    if (err) return handleError(err);
    // console.log(tank)
    // console.log(tank.nModified)
    if (tank.nModified != 0 || tank.n != 0) {
      res.send({
        meta: {
          status: 200,
          msg: '修改管理员的职务成功！',
        }
      })
    } else {
      res.send({
        meta: {
          status: 400,
          msg: '修改管理员的职务失败！'
        }
      })
    }
  });
})
//27**添加新拥有者前获取选择器内容  ownerSelect   Role  roles
// 获取logins数据库的所有用户名，即选择器的内容
app.get('/api/ownerSelect', async (req, res) => {
  // console.log(req.query)
  // console.log(req.query.role)
  // 角色名
  var role = req.query.role
  // 在logins数据库匹配相同的角色的用户名（拥有者）
  const ownerUserName = await Login.find({
    role: role
  })
  // console.log(ownerUserName)
  // // 遍历数组，拿到用户名（拥有者）
  var owner = ownerUserName.map(function (item, index, ownerUserName) {
    return item.username
  })
  // console.log( owner )
  // console.log(owner.length)
  if (owner.length > 0) {
    res.send({
      data: {
        total: owner.length,
        owner: owner,
      },
      meta: {
        status: 200,
        msg: '添加拥有者成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '添加拥有者失败！'
      }
    })
  }
})
//28**添加新拥有者  addOwner   Role  roles
app.post('/api/addOwner', async (req, res) => {
  // console.log(req.body)
  // console.log(req.body.owner)
  // 存在的拥有者
  var role = req.body.role
  // console.log(owners)
  var id = req.body._id
  // // console.log(id)
  // 要添加的拥有者
  var owner = req.body.owner
  // console.log(owner)
  Role.updateOne({
    _id: id,
  }, {
    $push: {
      owner: owner
    }
  }, function (err, tank) {
    if (err) return Error(err);
    if (tank.nModified == 1) {
      res.send({
        data: {
          owner: owner,
          role: role
        },
        meta: {
          status: 200,
          msg: '添加拥有者成功',
        }
      })
    } else {
      res.send({
        meta: {
          status: 400,
          msg: '添加拥有者失败'
        }
      })
    }
  })
})

//// 使用在 /admin_list界面
//29**获取管理员列表数据.分区区域数据  admins   Login  logins
app.get('/api/admins', async (req, res) => {
  // console.log(req.query)
  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query[1]).pageSize)
  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query[2]).pageNum)
  // 跳过的数据
  var skipNum = parseInt((pageNum - 1) * pageSize)
  const admin = await Login.find({})
  const admins = await Login.find().skip(skipNum).limit(pageSize)
  // console.log(admin)
  // console.log(skipNum.length)
  // console.log(admins.length)
  // console.log(pageSize)
  // console.log(pageNum)
  // 设置 admins 返回数据判断条件以及返回状态码
  if (admins.length > 0) {
    res.send({
      data: {
        total: admin.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        admins: admins,
      },
      meta: {
        status: 200,
        msg: '获取管理员列表成功!',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取管理员列表失败!'
      }
    })
  }
})
//30**搜索管理员  searchAdmins   Login  logins
app.get('/api/searchAdmins', async (req, res) => {
  var searchInput = req.query.searchAdminsForm //发来的参数
  // console.log(req.query)
  //  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query.parameter[1]).pageSize)
  // console.log(pageSize)
  // // //  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query.parameter[2]).pageNum)
  // console.log(pageNum)
  //  // 跳过的数据
  var skipNum = (pageNum - 1) * pageSize
  // console.log( skipNum)
  const searchAdmins = await Login.find({
    $or: [ //多条件模糊搜索，数组 
      { //1.用户名
        username: {
          $regex: searchInput
        }
      },
      { //2.角色
        role: {
          $regex: searchInput
        }
      },
      { //5.工号
        jobNum: {
          $regex: searchInput
        }
      },
      { //7.部门
        department: {
          $regex: searchInput
        }
      },
    ]
  })
  const searchAdmin = await Login.find({
    $or: [ //多条件模糊搜索，数组 
      { //1.用户名
        username: {
          $regex: searchInput
        }
      },
      { //2.角色
        role: {
          $regex: searchInput
        }
      },
      { //3.邮箱
        email: {
          $regex: searchInput
        }
      },
      { //4.电话
        phoneNumber: {
          $regex: searchInput
        }
      },
      { //5.工号
        jobNum: {
          $regex: searchInput
        }
      },
      { //6.职务
        position: {
          $regex: searchInput
        }
      },
      { //7.部门
        department: {
          $regex: searchInput
        }
      },
      { //8.办公电话
        officePhone: {
          $regex: searchInput
        }
      },
      { //9.级别权限
        permission: {
          $regex: searchInput
        }
      }
    ]
  }).skip(skipNum).limit(pageSize)
  // console.log(searchAdmins)
  // 设置 searchAdmins 返回数据判断条件以及返回状态码
  if (searchAdmins.length > 0) {
    res.send({
      data: {
        total: searchAdmins.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        searchAdmins: searchAdmins, //全部查找数据
        searchAdmin: searchAdmin, //按分页要求查找返回的数据
      },
      meta: {
        status: 200,
        msg: '查找用户成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '查找用户失败！'
      }
    })
  }
})
//31**获取管理员职务  position   Role  roles
// 获取roles数据库匹配相应要新加的管理员中所选择的角色对应的职务，依赖于该数据库
app.get('/api/position', async (req, res) => {
  // console.log(req.query)
  var system = req.query.system
  var drug = req.query.drug
  var order = req.query.order
  var user = req.query.user
  const systems = await Role.find({
    role: system
  })
  // console.log(systems[0].position)
  var systemPosition = systems[0].position
  const drugs = await Role.find({
    role: drug
  })
  // console.log(drugs[0].position)
  var drugPosition = drugs[0].position
  const orders = await Role.find({
    role: order
  })
  // console.log(orders[0].position)
  var orderPosition = orders[0].position
  const users = await Role.find({
    role: user
  })
  // console.log(users[0].position)
  var userPosition = users[0].position
  if (systemPosition != "") {
    res.send({
      data: {
        systemPosition: systemPosition,
        drugPosition: drugPosition,
        orderPosition: orderPosition,
        userPosition: userPosition,
      },
      meta: {
        status: 200,
        msg: '获取成功!',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取失败!'
      }
    })
  }
});
//32**添加管理员  addAdmin   Login  logins
app.post('/api/addAdmin', async (req, res) => {
  // console.log(req.body)
  var body = req.body
  var username = req.body.username
  var email = req.body.email
  var phoneNumber = req.body.phoneNumber
  var jobNum = req.body.jobNum
  await Login.find(
    // 查找判断数据库是否有相同的
    {
      $or: [ //多条件查询，数组 
        { //1.用户名
          username: username
        },
        { //2.邮箱
          email: email
        },
        { //3.手机号码
          phoneNumber: phoneNumber
        },
        { //4.工号
          jobNum: jobNum
        },
      ]
    },
    function (err, tank) {
      if (err) return handleError(err);
      // res.send(tank);
      // console.log(tank)
      // console.log(typeof(tank))
      // console.log(tank.length)
      if (tank.length == 0) {
        Login.create(req.body, function (err, addAdmin) {
          if (err) return Error(err);
          // console.log(addAdmin)
          res.send({
            data: {
              total: addAdmin.length, //总数
              addAdmin: addAdmin, //具体数据
            },
            meta: {
              status: 200,
              msg: '添加管理员成功！',
            }
          })
        });
      } else {
        res.send({
          data: {
            total: tank.length, //总数
            tank: tank, //数据库中相同的具体数据
            body: body
          },
          meta: {
            status: 400,
            msg: '添加管理员失败！',
          }
        })
      }
    });
})
//33**修改管理员信息（工号）  editAdmin   Login  logins
app.post('/api/editAdmin', async (req, res) => {
  // console.log(req.body)
  var id = req.body._id
  // console.log(req.body._id)
  var jobNum = req.body.jobNum
  // console.log(req.body.jobNum)
  Login.findOne({
    jobNum: jobNum
  }, function (err, tank) {
    if (err) return handleError(err);
    // console.log(tank)
    if (tank != null) {
      return res.send({
        meta: {
          status: 400,
          msg: '工号已存在',
        }
      })
    } else {
      Login.findByIdAndUpdate(id, {
        $set: {
          jobNum: jobNum
        }
      }, function (err, data) {
        if (err) return handleError(err)
        // console.log(data)
        var oldJobNum = data.jobNum
        var username = data.username
        res.send({
          data: {
            username: username,
            oldJobNum: oldJobNum,
            newJobNum: jobNum
          },
          meta: {
            status: 200,
            msg: '工号修改成功！',
          }
        })
      })
    }
  })
})
//34**删除管理员  deleteAdmin   Login  logins
app.post('/api/deleteAdmin', async (req, res) => {
  // console.log(req.body.params)
  var _id = req.body.params.id
  Login.findByIdAndRemove(_id, {
    new: true
  }, function (err, tank) {
    if (err) return handleError(err);
    // console.log(tank);
    if (tank != {}) {
      res.send({
        data: {
          deleteAdmin: tank, //具体数据
        },
        meta: {
          status: 200,
          msg: '删除管理员成功！',
        }
      })
    } else {
      res.send({
        meta: {
          status: 400,
          msg: '删除管理员失败！',
        }
      })
    }
  });
})

//// 使用在 /users_list界面
//35**获取用户列表数据.分区区域数据  users   User  users
app.get('/api/users', async (req, res) => {
  // console.log(req.query)
  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query[1]).pageSize)
  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query[2]).pageNum)
  // 跳过的数据
  var skipNum = parseInt((pageNum - 1) * pageSize)
  const user = await User.find({})
  const users = await User.find().skip(skipNum).limit(pageSize)
  // console.log(user)
  // console.log(skipNum.length)
  // console.log(users.length)
  // console.log(pageSize)
  // console.log(pageNum)
  // 设置 users 返回数据判断条件以及返回状态码
  if (users.length > 0) {
    res.send({
      data: {
        total: user.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        users: users,
      },
      meta: {
        status: 200,
        msg: '获取用户列表成功!',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取用户列表失败!'
      }
    })
  }
})
//36**搜索用户  searchUsers   User  users
app.get('/api/searchUsers', async (req, res) => {
  var searchInput = req.query.searchUsersForm //发来的参数
  // console.log( req.query)
  //  //当前每页显示多少条数据
  var pageSize = parseInt(JSON.parse(req.query.parameter[1]).pageSize)
  // console.log(pageSize)
  // // //  // 当前页码
  var pageNum = parseInt(JSON.parse(req.query.parameter[2]).pageNum)
  // console.log(pageNum)
  //  // 跳过的数据
  var skipNum = (pageNum - 1) * pageSize
  // console.log( skipNum)
  const searchUsers = await User.find({
    $or: [ //多条件模糊（$regex）搜索，数组 
      { //用户名
        userName: {
          $regex: searchInput
        }
      },
      { //邮箱
        email: {
          $regex: searchInput
        }
      },
      { //手机号码
        phoneNumber: {
          $regex: searchInput
        }
      },
    ]
  })
  const searchUser = await User.find({
    $or: [ //多条件模糊搜索，数组 
      { //用户名
        userName: {
          $regex: searchInput
        }
      },
      { //角色
        role: {
          $regex: searchInput
        }
      },
      { //邮箱
        email: {
          $regex: searchInput
        }
      },
      { //电话
        phoneNumber: {
          $regex: searchInput
        }
      },
    ]
  }).skip(skipNum).limit(pageSize)
  // console.log(searchUsers)
  // 设置 searchUsers 返回数据判断条件以及返回状态码
  if (searchUsers.length > 0) {
    res.send({
      data: {
        total: searchUsers.length, //总数
        pageSize: pageSize, //当前每页显示多少条数据
        pageNum: pageNum, // 当前页码
        searchUsers: searchUsers, //全部查找数据
        searchUser: searchUser, //按分页要求查找返回的数据
      },
      meta: {
        status: 200,
        msg: '查找用户成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '查找用户失败！'
      }
    })
  }
})
//37**添加新用户  addUser   User  users
app.post('/api/addUser', async (req, res) => {
  // console.log(req.body)
  const addUser = await User.find({
    // 查找判断数据库是否有相同的
    "userName": req.body.userName,
  })
  // console.log(addUser)
  if (addUser.length == 0) {
    const addUserInsert = await User.create(req.body)
    res.send({
      data: {
        total: addUserInsert.length, //总数
        addUserInsert: addUserInsert, //具体数据
      },
      meta: {
        status: 200,
        msg: '添加用户成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '添加失败！'
      }
    })
  }
})
//38**修改用户状态  userState   User  users
app.post('/api/userState', async (req, res) => {
  // console.log(req.body)
  // console.log(typeof(req.body.mgState))
  var id = req.body.id
  var mgState = req.body.mgState
  User.findByIdAndUpdate(id, {
    $set: {
      mgState: mgState
    }
  }, {
    new: true
  }, function (err, tank) {
    if (err) return handleError(err);
    // console.log(tank)
    if (tank != null) {
      res.send({
        data: {
          userStateUpdata: tank, //具体数据
        },
        meta: {
          status: 200,
          msg: '状态修改成功！',
        }
      })
    } else {
      res.send({
        meta: {
          status: 400,
          msg: '状态修改失败！',
        }
      })
    }

  })
})
//39**修改用户信息  editUser   User  users
app.post('/api/editUser', async (req, res) => {
  const editUser = await User.find({
    // 根据id查找判断数据库是否有相同的
    "_id": req.body._id,
  })
  if (editUser.length > 0) {
    const userNameUpdata = await User.updateOne({
      '_id': req.body._id
    }, {
      // 把前端发来的所有数据一起修改
      $set: req.body
    })
    res.send({
      meta: {
        status: 200,
        msg: '用户名修改成功！',
      }
    })
  }
})
//40**删除用户  deleteUser   User  users
app.post('/api/deleteUser', async (req, res) => {
  const deleteUser = await User.find({
    // 根据id查找判断数据库是否有相同的
    "_id": req.body._id,
  })
  if (deleteUser.length > 0) {
    // 执行删除操作
    const deleteUserUpdata = await User.deleteOne({
      '_id': req.body._id
    })
    res.send({
      data: {
        total: deleteUserUpdata.length, //总数
        deleteUserUpdata: deleteUserUpdata, //具体数据
      },
      meta: {
        status: 200,
        msg: '删除用户成功！',
      }
    })
    res.send({
      meta: {
        status: 400,
        msg: '删除用户失败！',
      }
    })
  }
})

//// 使用在 /users_list界面
//41**获取个人基本信息和岗位详细信息列表  info   Login  logins
app.get('/api/info', async (req, res) => {
  // 将获取到的id（string）转换成对象类型给数据库的_id（Object）匹配
  var myId = JSON.parse(req.query.id)
  const infos = await Login.findById(
    // 获取前端的 id  查找判断数据库是否有相同的
    myId
  )
  // console.log(infos)
  // 设置 infos 返回数据判断条件以及返回状态码
  if (infos.length != 0) {
    res.send({
      infos: infos, //具体数据node
      meta: {
        status: 200,
        msg: '获取信息列表成功！',
      }
    })
  } else {
    res.send({
      meta: {
        status: 400,
        msg: '获取信息列表失败！'
      }
    })
  }
})
//42**修改密码  changePassword   Login  logins
app.post('/api/changePassword', (req, res) => {
  var myId = JSON.parse(req.body._id);
  // console.log(myId)
  // console.log(req.body._id)
  var originalPassword = req.body.originalPassword;
  var newPassword = req.body.newPassword
  // console.log(req.body.newPassword)
  Login.updateOne({ // 设定查询两个条件
    _id: myId,
    password: originalPassword
  }, {
    $set: {
      'password': newPassword
    }
  }, {
    new: true
  }, function (err, updateData) {
    if (err) return handleError(err);
    // 通过updateOne
    //返回格式为{ n: 1, nModified: 0, ok: 1 }  
    // n 文档匹配的数量  nModified 修改的条数  ok  1 为成功 0为失败
    // console.log(updateData)
    // console.log(updateData.nModified)
    if (updateData.n == 0 && updateData.nModified == 0) {
      res.send({
        meta: {
          status: 400,
          msg: '原密码错误！'
        }
      });
    }
    if (updateData.n == 1 && updateData.nModified == 0) {
      res.send({
        meta: {
          status: 300,
          msg: ' 新密码和原来密码一样！'
        }
      });
    }
    if (updateData.n == 1 && updateData.nModified == 1) {
      res.send({
        data: {
          originalPassword: originalPassword,
          newPassword: newPassword
        },
        meta: {
          status: 200,
          msg: '密码修改成功！'
        }
      });
    }
  });
});
//43**修改信息  changeInfo   Login  logins
app.post('/api/changeInfo', async (req, res) => {
  var myId = JSON.parse(req.body.params.id); // 输出为对象
  var Form = req.body.params.Form; //表单（新用户名、新邮箱、新手机号码，不为空的时候前端才会发过来）
  // 如果用户名存在需要判断是否数据库中有相同的
  var username = req.body.params.Form.username
  if (username != undefined) {
    // 获取logins数据库全部数据
    const tan = await Login.find()
    // console.log(tan)
    // 匹配用户名是否相同（存在）
    var tankArray = tan
    var a;
    tankArray.forEach(element => {
      if (element.username == username) {
        a = true;
      }
    });
    // console.log(a)
    if (a == true) {
      res.send({
        meta: {
          status: 440,
          msg: '用户名已存在',
        }
      })
    } else {
      Login.findByIdAndUpdate(myId, {
        $set: Form
      }, function (err, newInfo) {
        if (err) return Error(err);
        // console.log(newInfo)
        res.send({
          newInfo: newInfo,
          meta: {
            status: 200,
            msg: '修改信息成功！',
          }
        })
      });
    }
  } else {
    Login.findByIdAndUpdate(myId, {
      $set: Form
    }, function (err, newInfo) {
      if (err) return Error(err);
      // console.log(newInfo)
      if (newInfo != null) {
        res.send({
          newInfo: newInfo,
          meta: {
            status: 200,
            msg: '修改信息成功！',
          }
        })
      } else {
        res.send({
          meta: {
            status: 400,
            msg: '修改信息失败！',
          }
        })
      }

    });
  }
})



// 设定默认端口页面的内容（测试）
app.get('/', async (req, res) => {
  res.send('网上药店管理系统（测试）')
})
//监听端口
app.listen(3001, () => {
  console.log('http://localhost:3001/')
  console.log('MongoDB数据库连接成功~~')
})
