# 前言
这是一个基于小程序的网易云音乐，后台数据暂时采用的是@Binaryify所提供的api接口，大神已经把网易云的接口爬取下来了 [api地址](https://github.com/Binaryify/NeteaseCloudMusicApi)，把他项目拉取下来run一下就可以跑起来  
暂时使用localhost做模拟机调试（18/09/13）等到以后有时间了架设一个服务器自己搭一个node环境，配置ssl满足小程序的需求。

# 功能
主要有以下部分
##### 登陆页面
    暂只支持手机号登陆(接口支持邮箱，但是我没用163邮箱注册过哈哈)
##### 播放页面
    暂停，播放，上一首下一首，播放歌单，滚动歌词，拖动播放。
    从歌单删除当前（09/14）
    中英文歌词同步（09/14）
##### 后台播放功能
    播放器采用了小程序内置的createInnerAudioContext方法，在页面销毁时不会销毁实例，以这个为基础实现了后台播放  
    播放歌单功能（性能方面需要优化，定时器以及变量用的过多，可能导致页面性能降低），从上级页面跳入将判断当前播放歌曲与当前选中歌曲。
##### 评论页面
    查看评论
    查看热门评论
    为评论点赞（需要登陆）（09/21）
    发表评论（09/24）
##### 主页
-----
##### 主页->私人FM
    随机播放你可能喜欢的歌曲，可以为歌曲点赞
    //todo
    点赞有请求成功，但是没有回显，后续完善
##### 主页->热门歌单
    歌单页面可以收藏歌单，播放歌单，单个播放等，收藏的歌单在我的里面可以看见
##### 主页->热门搜索与搜索
    利用已有的api做了一个简单的热门词条效果，点击词条将会跳转到详细歌曲页  
    在输入框中输入字段将触发事件搜索
##### 我的歌单
    我的歌单展示了我创建的歌单以及我收藏的歌单
   
    从我的页面 跳转到歌单页面
##### 用户信息页面
    当前用户信息只展示了头像以及签到
# 环境要求
---
需要使用微信小程序开发  
后台需要使用NodeJs 6.0+运行

# 环境安装
------
  微信小程序从小马哥那里下载就好   
  后台环境按照  [api地址](https://github.com/Binaryify/NeteaseCloudMusicApi) 大神的指示搭建  
  小程序模拟机调试时需要在设置-》项目设置里关闭（不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书）选项，当然，后续将使用https搭建服务器

# 不足与优化
-----
当前最大的问题是代码的优化与整理，后续将从以下几点出发修正，当然等这个项目完结才行  
1.公有代码的抽取  

    将api请求抽取出来成为模块化管理  
  
2.冗余变量的清除与代码优化  

    对一些性能消耗过大的代码优化，处理  
  
3.项目完善与更新  
4.bug tofix (拖动滚动条如果当前歌曲加载不到那个位置将会停止滚动条的移动)
# TODO
-----
<del>评论</del>

# 项目截图
### 主页
![主页](/littleProgram/screenshot/index.png)
### 主页->播放器&私人FM
![播放器&私人FM](/littleProgram/screenshot/fm.png)
### 主页->登陆
![主页->登陆](/littleProgram/screenshot/isLogin.png)
### 主页->歌单
![主页->歌单](/littleProgram/screenshot/playList.png)
### 主页->歌单2
![主页->歌单](/littleProgram/screenshot/playList2.png)
### 歌词&滚动
![歌词&滚动](/littleProgram/screenshot/lrc.png)
### 歌曲->评论
![歌曲->评论](/littleProgram/screenshot/comment.png)
### 歌曲->我的评论
![歌曲->评论](/littleProgram/screenshot/myComment.png)
### 用户信息
![用户信息](/littleProgram/screenshot/user.png)
### 我的歌单
![我的歌单](/littleProgram/screenshot/myPlayList.png)
