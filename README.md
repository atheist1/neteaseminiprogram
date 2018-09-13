# 前言
这是一个基于小程序的网易云音乐，后台数据暂时采用的是@Binaryify所提供的api接口，大神已经把网易云的接口爬取下来了 [api地址](https://github.com/Binaryify/NeteaseCloudMusicApi)，把他项目拉取下来run一下就可以跑起来  
暂时使用localhost做模拟机调试（18/09/13）等到以后有时间了架设一个服务器自己搭一个node环境，配置ssl满足小程序的需求。

# 功能
暂时实现的功能不多，主要有以下部分
## 播放器
------
作为音乐软件最主要的是播放功能，播放器提供播放暂停上一首下一首功能，实现播放器拖动进度条跳转播放，歌词随之滚动效果，实现歌词滚动效果
### 后台播放功能
播放器采用了小程序内置的createInnerAudioContext方法，在页面销毁时不会销毁实例，以这个为基础实现了后台播放，播放歌单功能（性能方面需要优化，定时器以及变量用的过多，可能导致页面性能降低），从上级页面跳入将判断当前播放歌曲与当前选中歌曲。

## 热门搜索与搜索
------
利用已有的api做了一个简单的热门词条效果，点击词条将会跳转到详细歌曲页  
在输入框中输入字段将触发事件搜索

# 环境要求
---
需要使用微信小程序开发  
后台需要使用NodeJs 6.0+运行

# 环境安装
  微信小程序从小马哥那里下载就好   
  后台环境按照  [api地址](https://github.com/Binaryify/NeteaseCloudMusicApi) 大神的指示搭建  
  小程序模拟机调试时需要在设置-》项目设置里关闭（不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书）选项，当然，后续将使用https搭建服务器

# 不足与优化
当前最大的问题是代码的优化与整理，后续将从以下几点出发修正，当然等这个项目完结才行  
1.公有代码的抽取  

    将api请求抽取出来成为模块化管理  
  
2.冗余变量的清除与代码优化  

    对一些性能消耗过大的代码优化，处理  
  
3.项目完善与更新  
