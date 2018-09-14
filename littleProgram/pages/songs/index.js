import regeneratorRuntime from '../../utils/runtime-module.js'
import {trans,random,transConcat } from '../../utils/util.js'
const app = getApp();
Page({
  data:{
    BackgroundImg:'',
    songImage:'',
    showLrc:false,
    audio:{
      startTime:'00:00',
      endTime:'00:00',
      progress:0,
      progressMenu:{
        isDrag:false
      },
      pauseOrPlayImg:'../../assets/image/stop.png',
      end:0,
      innerAudioContext:{},
      songInfo:{},
      isPause:false,
      //next round random
      playType:'next', 
      url:'',
      lrc:{
        listArr:[],
        timeArr:[],
        index:0,
        viewId:'id_0'
      }
    },
    pageShow:false,
    netWork:{},
    rotate:0
  },
  //旋转
  rotate:function(stop){
   
    var rotate = 0;
    //暂停旋转，将当前滚动度数存入
    if(stop){
      clearInterval(this.interval)
      this.interval = null
      
      this.setData({
        rotate:this.data.rotate
      })      
      return;
    }
    //如果是暂停状态，从当前rotate开始
    if(this.data.audio.isPause){
      rotate = this.data.rotate
    } 
    this.interval = setInterval(()=>{
      
      if(rotate>=360){
        rotate = rotate%360;
      }else{
        rotate+=0.36
      }
      this.setData({
        rotate:rotate
      })
    },10)
    
  },
  isShowLrc:function(){
   
    this.setData({
      showLrc:!this.data.showLrc
    })
  },
  //进度条
  changeProgress:function(e){
    this.setData({
      ['audio.progressMenu.isDrag']:true,
      ['audio.startTime']:trans(e.detail.value)
    })
    
  },
  change:function(e){ 
    this.setData({
      ['audio.progressMenu.isDrag']:false,
    }) 
    //直接跳转到当前位置

    for(let i = 1 ; i < this.data.audio.lrc.timeArr.length; i++){
      if(e.detail.value ===0){
        this.setData({
          ['audio.lrc.index']:0,
          ['audio.lrc.viewId']:'lrc_'+0,
        })
        break;
      }
      if((this.data.audio.lrc.timeArr[i-1] < e.detail.value && this.data.audio.lrc.timeArr[i] >= e.detail.value )||!this.data.audio.lrc.timeArr[i-1]){
        this.seekLrc(i)
        
        break;
      }else{
        
      }
    }
    
    this.data.audio.innerAudioContext.seek(e.detail.value)
  },
  //播放与暂停
  pauseOrPlay:function(e){
    
    if(e.currentTarget.dataset.btn==='btn'){
      if(this.data.audio.isPause){
        this.data.audio.innerAudioContext.play()
        if(this.data.audio.isPause){
          this.rotate()
          this.setData({
            ['audio.isPause']:false,
            ['audio.pauseOrPlayImg']:'../../assets/image/stop.png',
  
          })
         
        }
      }else{
        this.data.audio.innerAudioContext.pause()
        this.rotate(true)
        this.setData({
          ['audio.isPause']:true,
          ['audio.pauseOrPlayImg']:'../../assets/image/play.png',
  
        })
        
      }
    }  
  },
  //下一首
  next:function(){
    
    let nextIndex
    let currentPlay,option
   
    switch (this.data.audio.playType) {
      case 'next':
     
        nextIndex = (app.globalData.currentPlayList.currentPlay.index+1)%app.globalData.currentPlayList.listArr.length;
        break;
      case 'random':
      nextIndex = random(app.globalData.currentPlayList.listArr.length)
      break;
      default:
        break;
    }
    currentPlay = app.globalData.currentPlayList.currentPlay = app.globalData.currentPlayList.listArr[nextIndex];
    option = {
      id:currentPlay.id,
      album:currentPlay.album.id
    }
    this.getMusic(option)
  },
  //删除当前歌曲
  deleteMusic:function(){
  
    const index = app.globalData.currentPlayList.currentPlay.index
    
    if(app.globalData.currentPlayList.listArr.length > 1){
      //后面一个数组需要把index改变
     
      app.globalData.currentPlayList.listArr.splice(index,1)
      app.globalData.currentPlayList.listId.splice(index,1)
      app.globalData.currentPlayList.listArr.forEach((item,index) =>{
        item.index = index;
      })
      app.globalData.currentPlayList.backPlayInfo = {}
    }
   
    this.next()
  },
  prev:function(){
    
    let prevIndex = (app.globalData.currentPlayList.currentPlay.index-1)
    let currentPlay,option
    prevIndex < 0 ? prevIndex = app.globalData.currentPlayList.listArr.length-1 : true

    currentPlay = app.globalData.currentPlayList.currentPlay = app.globalData.currentPlayList.listArr[prevIndex];
    option = {
      id:currentPlay.id,
      album:currentPlay.album.id
    }
    this.getMusic(option)
  },
  //初始化操作（初始化与当前不一样的歌曲）
  getMusic:function(option){
    let _this = this;
    //加载图片资料
    app.get('/album',{id:option.album})
    .then((res)=>{
      _this.setData({
        BackgroundImg:res.album.blurPicUrl,
        songImage:res.album.picUrl,
        showLrc:false
      });
    });
    //加载音乐详情
    async function getMusicDetail() {
      let isCheck,music,innerAudioContext ;
      const timeDelay = {
        'wifi':20,
        '4g':40,
        '3g':200,
        '2g':1000 
      }
      wx.showLoading({
        title: '正在加载页面',
      })
      isCheck = await app.get('/check/music',{id:option.id})
     
      if(isCheck.success){
        music = await app.get('/music/url',{id:option.id})
        
        if(music.data[0].url){
          
          innerAudioContext = wx.createInnerAudioContext()
          innerAudioContext.autoplay = true
          innerAudioContext.src = music.data[0].url
 
          //在音频初始化后判断是从其他地方跳转还是直接点击
          if(_this.data.audio.innerAudioContext && _this.data.audio.innerAudioContext.destroy){
            //重置所有
            _this.data.audio.innerAudioContext.destroy() 
            _this.setData({
              ['audio.isPause']:false,
              ['audio.pauseOrPlayImg']:'../../assets/image/stop.png',
              rotate:0
            })
            _this.rotate(true)
            _this.rotate()
          }
          

          innerAudioContext.onCanplay(()=>{
            
            innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
            setTimeout(function () {
              if(!_this.data.pageShow){
                _this.rotate()
              }
            //在这里就可以获取时长
              _this.setData({
                ['audio.endTime']:trans(innerAudioContext.duration),
                pageShow:true,
                ['audio.innerAudioContext']:innerAudioContext,
                ['audio.end']:innerAudioContext.duration,
                ['audio.songInfo']:app.globalData.currentPlayList.currentPlay,
                ['audio.url']:music.data[0].url
              })
              wx.hideLoading()
            }, timeDelay[_this.data.netWork.networkType])  //这里根据网络状态获取
          })
          //播放中事件
          innerAudioContext.onTimeUpdate(()=>{
            let lrc = _this.data.audio.lrc,index = lrc.index,viewIndex
            if(!_this.data.audio.progressMenu.isDrag && !_this.data.audio.isPause){
              _this.setData({
                ['audio.startTime']:trans(innerAudioContext.currentTime),
                ['audio.progress']:(innerAudioContext.currentTime)
              })
              _this.seekLrc();
            }
            
          })
          innerAudioContext.onPlay(()=>{})
          innerAudioContext.onEnded(()=>{
            _this.setData({
              ['audio.lrc.index']:0,
              ['audio.lrc.viewId']:'lrc_0',
              showLrc:false
            })
            _this.next()
          })
        }else{
          console.log('##购买占位##')
        }
      }else{
        console.log('##版权占位##')
      }
    }
    getMusicDetail()
    this.showLrcs(option.id)
  },
  reloadMusic:function(option,backPlay){
    let _this = this
    
    if(backPlay.id === option.id){//第二次进入当前播放歌曲
      //设置初始值
      this.setData({
        ['audio.innerAudioContext']:backPlay.context,
        ['audio.endTime']:backPlay.endTime,
        ['audio.isPause']:backPlay.isPause,
        ['audio.startTime']:trans(backPlay.context.currentTime),
        ['audio.progress']:(backPlay.context.currentTime),
        ['audio.end']:backPlay.end,
        ['audio.pauseOrPlayImg']:'../../assets/image/'+(backPlay.isPause?'play':'stop')+'.png',
        ['audio.songInfo']:backPlay.songInfo,
        ['audio.lrc']:backPlay.lrc,
        BackgroundImg:backPlay.BackgroundImg, 
        songImage:backPlay.songImage, 
        pageShow:true,
        showLrc:false
      })
      this.showLrcs(option.id)
      
      if(backPlay.isPause){
        this.rotate(true)
      }else{
        this.rotate()
      }
      backPlay.context.onTimeUpdate(()=>{ 
    
        if(!_this.data.audio.progressMenu.isDrag){
          _this.setData({
            ['audio.startTime']:trans(backPlay.context.currentTime),
            ['audio.progress']:(backPlay.context.currentTime),
            ['audio.end']:backPlay.end
          })
          _this.seekLrc()
        }
      })
      backPlay.context.onPlay(()=>{})
      
    }else{//第二次进入不同歌曲
      if(backPlay.context && backPlay.context.destroy){
        backPlay.context.destroy()
        backPlay = {}
        this.getMusic(option)
      }
    }
  },
  showLrc:false,
  //展示歌词并转换
  showLrcs:function(id){
    let _this = this,timeArr = [],lrcArr = []
   
    app.get('/lyric',{id:id})
      .then((res)=>{
        
        if(res.code===200){
          /**中英文歌词合并 */
            if(res.lrc){
              timeArr = transConcat(res).timeArr
              lrcArr = transConcat(res).lrcArr
            }
          
          _this.setData({
            ['audio.lrc.timeArr']:timeArr,
            ['audio.lrc.lrcArr']:lrcArr,
            ['audio.lrc.index']:0,
            ['audio.lrc.viewId']:'lrc_0'
          })
        }
      })
      
  },
  //跳转歌词位置
  seekLrc:function(time){
    let lrc = this.data.audio.lrc, index = lrc.index,innerAudioContext = this.data.audio.innerAudioContext||app.globalData.backPlayInfo.context,viewIndex
    //手动跳转
   
    if(time){
      
      let viewTime = time;
      if(time <= 5){
        viewTime = 0;

      }else if(time>=lrc.timeArr.length-5){//直接跳到倒数第五句话
        viewIndex = lrc.timeArr.length-1
      }else{
        viewTime -=3
      }
      this.setData({
        ['audio.lrc.index']:time,
        ['audio.lrc.viewId']:'lrc_'+viewTime,
      })
      return
    }
    else{
      //逐帧跳转
     
      if(lrc.timeArr[lrc.index] && lrc.timeArr[lrc.index] <= innerAudioContext.currentTime){
        
        viewIndex = index++
        if(viewIndex <= 5){
          viewIndex = 0
        }else if(viewIndex>=lrc.timeArr.length-5){
          viewIndex = lrc.timeArr.length-1
        }else{
          viewIndex -=3
        }
        this.setData({
          ['audio.lrc.index']:index,
          ['audio.lrc.viewId']:'lrc_'+viewIndex,
        })
      }
    }
    
  },
  onLoad:function(option){
    let _this = this,backPlay =  app.globalData.currentPlayList.backPlayInfo
    /*
    *onLoad函数进入将会进入三条线
    *第一条是首次打开某个音乐，新进入小程序，小程序本地存储仅仅存储了搜索记录，重新进入将重新初始化歌单，后续可能改进
    *第二条是进入与当前播放音乐不同的歌
    *第三条进入的是当前播放音乐，第三条线将会使用app.global数据，减少渲染
    * 
    */
    wx.getNetworkType({
      success: (result)=>{
        _this.setData({
          netWork:result,
          id:option.id
        }) 
      },
    });
    wx.hideTabBar()
    //拦截请求，不同地方跳转不同
    
    //如果不是首次进去
    if(backPlay && backPlay.id ){
      
      this.reloadMusic(option,backPlay)
    }else{//首次进入
      this.getMusic(option)
    }

    
  },
  onUnload(){
    /*当页面销毁时，小程序将dom销毁了，但是当前创建的audio还存在，
    * 实现了后台播放音乐的一半，另一半需要手动保存当前播放时间，背景，music url,页面进入时自动跳转
    * 此处本来准备用状态机制，但是小程序使用redux稍微麻烦了点，待后续改善
    */
   //手动删除interval防止内存调用过大
   clearInterval(this.interval)
   this.interval = null
   app.globalData.currentPlayList.backPlayInfo = {
     url:this.data.audio.url,
     context:this.data.audio.innerAudioContext,
     isPause:this.data.audio.isPause,
     rotate:this.data.audio.rotate,
     progress:this.data.audio.progress,
     BackgroundImg:this.data.BackgroundImg,
     songImage:this.data.songImage,
     id:this.data.audio.songInfo.id,
     endTime:this.data.audio.endTime,
     end:this.data.audio.end,
     songInfo:this.data.audio.songInfo,
     lrc:this.data.audio.lrc
   }
  }
  
})