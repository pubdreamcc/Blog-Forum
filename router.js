const express = require('express')
const md5 = require('blueimp-md5')
const User = require('./models/user')
const router = express.Router()

// 挂载路由

router.get('/', (req, res) => {
  res.render('index.html', {
    arr: [1, 2, 3, 4, 5, 6, 7, 8],
    user: req.session.user
  })
})

router.get('/login', (req, res) => {
  res.render('login.html')
})

router.post('/login', (req, res, next) => {
  // 获取表单提交的数据
  // 判断用户提交的信息是否正确
  // 决定登陆是否成功
  let body = req.body
  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }).then(ret => {
    if (!ret) {
      // 邮箱或者密码输入有误
      return res.status(200).json({
        error_code: 1,
        message: 'Emial or password is invalid.'
      })
    }
    // 密码和邮箱输入都正确，保存登陆的状态
    req.session.user = ret
    return res.status(200).json({
      error_code: 0,
      message: 'ok'
    })
  }).catch(err => {
    return next(err)
  })
})

router.get('/register', (req, res) => {
  res.render('register.html')
})

router.post('/register', (req, res, next) => {
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
      req.session.user = user
      return res.status(200).json({
        error_code: 0,
        message: 'ok'
      })
    }).catch(err => {
      return next(err)
    })
  }).catch(err => {
    return next(err)
  })
})

router.get('/logout', (req, res) => {
  // 清除登陆状态
  req.session.user = null
  // 重定向到登陆页面
  res.redirect('/login')
})

router.get('/topics/new', (req, res) => {
  res.render('topic/new.html')
})
router.get('/topics/123', (req, res) => {
  res.render('topic/show.html')
})
router.get('/settings/profile', (req, res) => {
  res.render('settings/profile.html')
})

router.get('/settings/admin', (req, res) => {
  res.render('settings/admin.html')
})
module.exports = router