## 注意点

在build-user/config.js 进行用户内容修改 包括 mock 项目地址



## 修改



修改dev 不能使用host的问题
dev.conf.js  
devServer 增加 disableHostCheck: true 去除host安全限制 
package dev 增加 --host 0.0.0.0 外部可访问


增加vux


页面图片引用
使用 import 引入图片 使用图片转换插件 输出相关地址

css图片
使用相对路径

