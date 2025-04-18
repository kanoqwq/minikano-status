## 关于中兴F50的短信收发功能

>如果想做单独的短信收发功能，请使用`demopage/sms-send.html` 并配置好后端服务
>
>问：如何让f50通过外部服务器连接？ 答：在f50内安装frp软件并设为开机自启
>启用ADB安装软件教程：https://www.coolapk.com/feed/62323332?shareKey=NTJlYmQ0ODI0NDg1NjdkYWIxYmI~&shareUid=807133&shareFrom=com.coolapk.market_15.1.1

![](./img/1.png)

![](./img/2.png)

## 功能

>查看本人所使用的设备的当前所处状态

## 灵感

> 看见友站有这玩意，遂写

## 安装

### 服务端

#### 为什么需要服务端？

> 本项目初衷就是想编写一个稳定且长期状态页，所以需要一个简洁的访问接口

> 服务端需要设置token，请在根目录下的.env文件中设置复杂度高的token值

```javascript
pnpm i
pnpm i -g pm2
pnpm build
pnpm start
```

.env文件配置：

```javascript
TOKEN=xxxxx
HOST_ADDR=xxx
F50_PASSWORD=xxx
```

### 中兴F50相关

> 没事折腾了一下这个随身WiFi，做状态页顺便做的，稳定性看上去还不错，长期稳定性有待观察。

**短信接口功能：**

```javascript
//获取短信
get('/sms')
//发送短信
post('/sms',{content,number})
//删除短信
delete('/sms/:id')
```

### 安卓脚本

> 不知道，让AI帮忙写的，自行点开文件看看，不保证所有机型兼容
> 运行方法：定时任务，或者时候用xposed edge pro 按场景调用脚本
> 如有问题欢迎提issue

### 油猴脚本

> 在文件中设置token和设备名，拖入浏览器油猴页面安装即可