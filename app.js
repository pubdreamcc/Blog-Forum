const express = require('express')
const path = require('path')
const app = express()
// 开放静态资源
app.use('/public', express.static(path.join(__dirname, './public')))
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')))
// 配置模板引擎
app.engine('html', require('express-art-template'))
app.get('/', (req, res) => {
  res.render('index.html', {
    arr: [1, 2, 3, 4, 5, 6, 7, ,7, 8]
  })
})

// 绑定端口号，启动服务
app.listen(5000, () => {
  console.log('app is running port 5000')
})