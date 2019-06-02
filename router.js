const express = require('express')
const md5 = require('blueimp-md5')
const User = require('./models/user')
const router = express.Router()

// 挂载路由

router.get('/', (req, res) => {
  res.render('index.html', {
    arr: [1, 2, 3, 4, 5, 6, 7, 8]
  })
})

router.get('/login', (req, res) => {
  res.render('login.html')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
  res.render('register.html')
})

router.post('/register', (req, res) => {
  // 处理表单post提交的数据
  // 操作数据库
  // 发送响应
  let body = req.body
  // 判断用户的昵称或者邮箱是否重复
  User.findOne({
    $or: [
      {email: body.email},
      {nickname: body.nickname}
    ]
  }).then(ret => {
    if (ret) {
      // 邮箱或者昵称已经存在
      return res.status(200).json({
        error_code: 1,
        message: 'email or nickname already exists'
      })
    }
    // 可以注册
    body.password = md5(md5(body.password))
    new User(body).save().then(user => {
      return res.status(200).json({
        error_code: 0,
        message: 'ok'
      })
    }).catch(err => {
      return res.status(500).json({
        error_code: 500,
        message: 'server error...'
      })
    })
  }).catch(err => {
    return res.status(500).json({
      error_code: 500,
      message: 'server error...'
    })
  })
})

module.exports = router