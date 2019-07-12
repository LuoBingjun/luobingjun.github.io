# 使用Node.js+Express快速搭建后端

JavaScript在前端的位置可以说是一骑绝尘，但实际上在后端搭配上Node.js和后端框架进行服务器的搭建也是越来越普遍的操作。Express就是一个基于 Node.js 平台，快速、开放、极简的 Web 开发框架，通过几行代码就可以快速搭建起一个简易的后端服务。

## 安装Express框架

在Debian/Ubuntu下直接输入

```bash
$ sudo apt install nodejs
$ npm install express multer body-parser --save
```

就可以在项目目录下安装好Express框架和一些附带模块。

## 搭建服务器监听

首先引入express模块并新建实例

```js
var express = require('express')
var app = express()
```

通过调用app.listen(port, callback)就可以开启对所选端口的监听并返回一个server对象。

## 实现HTTP请求

app.get、app.post、app.delete分别对应了GET、POST、DELETE三种HTTP请求，以GET为例，调用app.get(path, handler)方法，其中path对应请求的路径，handler则是处理请求的方法。在处理*multipart/form-data*格式的POST请求时，需要使用multer模块作为中间件来解析请求的内容。