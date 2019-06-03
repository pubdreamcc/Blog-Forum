const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const router = require('./router')
const app = express()
// 开放静态资源
app.use('/public', express.static(path.join(__dirname, './public')))
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')))
// 配置模板引擎
app.engine('html', require('express-art-template'))
// 配置body-parser
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// 配置session
app.use(session({
  secret: 'cnode',
  resave: false,
  saveUninitialized: false
}))
// 把路由容器挂载到 app 中
app.use(router)
// 配置一个处理 404 的中间件
app.use((req, res) => {
  res.render('404.html')
})
// 配置一个全局错误处理中间件
app.use((err, req, res, next) => {
  res.status(500).json({
    error_code: 500,
    message: err.message
  })
})
// 绑定端口号，启动服务
app.listen(5000, () => {
  console.log('app is running port 5000')
})