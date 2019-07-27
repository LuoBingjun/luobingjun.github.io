# 使用https和ws模块搭建wss服务器

## 介绍

HTTPS是安全HTTP协议，WebSocket协议是建立在TCP协议上的一种网络通信协议，具有数据轻便、双向通信等特点，适合对实时性和可靠性要求比较高的连接。将HTTPS和WebSocket结合起来就可以实现一种安全的WebSocket协议，即wss协议。

在Node.js中，利用https和ws模块就可以简单搭建wss服务器。

## 搭建环境

安装https模块：

```sh
$ npm install https --save
```

安装ws模块：

```sh
$ npm install ws --save
```

## 配置服务器

首先使用https模块搭建HTTPS服务器监听，其中options中包括了SSL协议所需要的证书信息，app是处理一般HTTPS请求的函数：

```javascript
var options = {
  key: fs.readFileSync(keypath),
  cert: fs.readFileSync(certpath)
}
var httpsServer = https.createServer(options, app).listen(port)
```

然后将这个服务器绑定到ws模块的WebSocket服务器上：

```javascript
var wssServer = new ws.Server({ server: this.httpsServer })
```

这样就搭建好了wss服务器。

## 部署监听

wss服务器在监听到建立连接的请求时，会触发connection事件，并传入该连接所对应的WebSocket，可以通过绑定该事件来监听

```javascript
wssServer.on('connection', wssHandler)
```

至此，我们就完成了wss服务器搭建的基本过程，通过填充wssHandler函数就可以和普通WebSocket一样操作新建的WebSocket连接了。