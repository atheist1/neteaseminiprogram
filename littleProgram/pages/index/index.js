//index.js
import regeneratorRuntime from '../../utils/runtime-module.js'
import {getRecommend} from './api.js'
//获取应用实例
const app = getApp()
Page({
  data:{
    hotSearch:[],
    inputValue:'',
    searchFocus:true,
    panelShow:false,
    searchPanelShow:false,
    multimatch:[],
    searchData:[],
    currentSearch:{
      offset:0,
      keywords:''
    }, 
    searchCount:0,
    searchHistory:[],
    banner:[],
    iconList:[{
      value:"../../assets/image/cm2_btm_icn_radio_prs.png",
      name:'私人FM',
      ev:'getFm'
    },{
      value:"../../assets/image/calendar.png",
      name:"每日推荐",
      ev:'getRecommend'
    },{
      value:"../../assets/image/cm2_btm_icn_discovery_prs.png",
      name:"歌单"
    },{
      value:"../../assets/image/rank.png",
      name:"排行榜"
    }],
    recommend:[]
  }, 
  getHot:function(){
    var _this = this;
    this.setData({
      searchPanelShow:true
    }) 
      
    wx.request({
        url:'http://localhost:3000/search/hot',
        method:'get',
        success(res){ 
          if(res.data&&res.data.code && res.data.code === 200){
            if(res.data.result.hots){
              _this.setData({hotSearch:res.data.result.hots});
              
            }
            
          }
        }
    });
  },
  
  searchKeyWord:function(r){
    var _this = this;
    let name = r.currentTarget.dataset.item;
    let searchHistory = wx.getStorageSync('searchHistory');
    wx.showLoading({
      title: '加载中',
    });
    //将搜索记录存入本地存储
    if(!~searchHistory.indexOf(name) && name){
      searchHistory.push(name);
      wx.setStorageSync(
        'searchHistory',searchHistory
      )
    }   
    this.setData(
      {
        'inputValue':name,
        "searchFocus":true,
        'searchPanelShow':false,
        'currentSearch.keywords':name,
        'currentSearch.offset':0,
        'searchHistory':wx.getStorageSync('searchHistory')
    });
   
    wx.request({
      url:'http://localhost:3000/search/multimatch',
      method:'get',
      data:{
        keywords:name
      },
      success(res){
        let i ;
        if(res&&res.data && res.data.code === 200) {
          _this.setData({
            'multimatch':res.data.result
          }) 
        }
      }
    });
    wx.request({
      url:'http://localhost:3000/search',
      method:'get',
      data:{
        keywords:name,
        offset:0
      },
      success(res){ 
        wx.hideLoading();
        if(res.data &&res.data.result &&res.data.result.songs && res.data.result.songs.length){
          _this.setData({
            searchData:res.data.result.songs,
            searchCount:res.data.result.songCount
          });
        }
      }
    });

  },
  inputs:function(r){
    this.searchKeyWord({
      currentTarget:{
        dataset:{
          item:r.detail.value
        }
      }
    })
    
  },
  getBanner :function(){
    let _this = this
    if(wx.getStorageSync('banner')){
      _this.setData({
        banner:wx.getStorageSync('banner')
      })
    }else{
      app.get('/banner')
      .then((res)=>{
        if(res.code === 200){
          _this.setData({
            banner:res.banners
          })
          //将banner缓存，减少请求
          wx.setStorageSync('banner', res.banners);
        }
      })
    }
    
  },
  getRecommend:function(){
    let _this = this
    //缓存一次请求
    if(wx.getStorageSync('recommend')){
      _this.setData({
        recommend:wx.getStorageSync('recommend')
      })
    }else{
      app.get('/recommend/resource')
      .then((res)=>{
        if(res.recommend && res.recommend.length){
          _this.setData({
            recommend:res.recommend 
          })
          wx.setStorageSync('recommend', res.recommend);
        }
      })
    }
    
  },
  deleteHistory:function(r){
    let _this = this;
 
    _this.data.searchHistory.splice(r.target.dataset.index,1)
    this.setData({
      'searchHistory': _this.data.searchHistory
    });
    wx.setStorageSync(
      'searchHistory', _this.data.searchHistory
    );
  },
  getComment:function(r){
    //加载评论并跳转
      let id,aid
      if(r){
        id = r.currentTarget.dataset.id 
        aid = r.currentTarget.dataset.aid 
      }else{
        if(app.globalData.currentPlayList.currentPlay){
          id =  app.globalData.currentPlayList.currentPlay.id
          aid =  app.globalData.currentPlayList.currentPlay.album.id
        }else{
          
        }
        
      }
      
      wx.navigateTo({
        url:'../songs/index?id='+id+'&album='+aid,
      });
       
   
  },
  //为自定义组件绑定事件
  taps:function(r){
    if(r.detail && r.detail.targetEv){
      if(r.detail.targetEv === 'getFm'){
        this.getFm()
      
        app.globalData.isFm = true;
       
      }else if(r.detail.targetEv === 'getRecommend'){
        this.getDailyRecommend()
      }
    }
  },
  getFm:function(){
    let _this = this
    app.get('/personal_fm')
      .then((res)=>{

        let playListId = [],listArr = []
        if(res.data){
          for(let i = 0 ; i < res.data.length ; i++) {
            res.data[i].index = i;
            listArr.push(res.data[i])
            playListId.push(res.data[i].id)
          }
          //清空当前播放列表
          if(app.globalData.currentPlayList.backPlayInfo){
            if(app.globalData.currentPlayList.backPlayInfo.context){
              app.globalData.currentPlayList.backPlayInfo.context.destroy()
            }
          }
          
          app.globalData.currentPlayList = {
            listArr:listArr,
            currentPlay:listArr[0],
            //记录后台播放状态
            backPlayInfo:{},
            listId:playListId
          }
          _this.getComment()
        }
        
      })
  },
  getDailyRecommend:function(){
    wx.navigateTo({
      url: '../recommend/index'
     
    })
  },
  seeSongs:function(r){
    app.globalData.currentPlayList.currentPlay = r.currentTarget.dataset.currentsong
    app.globalData.currentPlayList.currentPlay.index = app.globalData.currentPlayList.listArr.length 
    
    //如果前面不是私人fm，则清空歌单
    if(app.globalData.isFm ){
      app.globalData.isFm =false
      app.globalData.currentPlayList.listId = []
      app.globalData.currentPlayList.listArr = []
    }
    if(!~app.globalData.currentPlayList.listId.indexOf(r.currentTarget.dataset.id)){
     
      app.globalData.currentPlayList.listId.push(app.globalData.currentPlayList.currentPlay.id)
      app.globalData.currentPlayList.listArr.push(app.globalData.currentPlayList.currentPlay)
    }
    this.getComment(r)
    
    
  },
  //input事件
  showInput: function () {
    this.getHot()
    this.setData({
        inputShowed: true,
        searchFocus:true,
        panelShow:true
    });
  },
  hideInput: function () {
    this.setData({
        inputValue: "",
        inputShowed: false,
        panelShow:false,
        searchPanelShow:true
    });
   
  },
  clearInput: function () {
      this.setData({
        inputValue: ""
      });
  },
  onReachBottom:function(e){
    let _this = this;
    if(this.data.searchCount >= this.data.currentSearch.offset+30 && !this.data.searchPanelShow){
      this.setData({
        'currentSearch.offset':(_this.data.currentSearch.offset+30),
      });
      wx.showLoading({
        title: '加载更多',
      })
      wx.request({
        url:'http://localhost:3000/search',
        method:'get',
        data:{
          keywords:_this.data.currentSearch.keywords,
          offset:_this.data.currentSearch.offset
        },
        success(res){ 
          wx.hideLoading();
          if(res.data &&res.data.result &&res.data.result.songs && res.data.result.songs.length){
            _this.setData({
              searchData:_this.data.searchData.concat(res.data.result.songs)
            });
          }
        }
      });
    }
    
    
  },
  //跳转到当前后台播放音频
  navgateInto:function(){
    this.getComment()
  },
  //跳转到歌单
  redirectPlayList:function(r){
   
    let pid = r.currentTarget.dataset.id
    wx.navigateTo({
      url: '../playList/index?pid='+pid
    });

  },
  onLoad:function(){
    let nowdate = new Date().getTime()
    const overTime = 1000*60*60*2
    //首次加载判断cookie是否过期 2小时
    if(nowdate - wx.getStorageSync('overtime') >= overTime){
      wx.clearStorageSync()
    }
   // 展示本地存储能力
   if(!wx.getStorageSync('cookie')){
    wx.showModal({
      title: '登录',
      content: '您还没有登陆网易云账号，是否登陆',
      confirmText: "去登陆",
      cancelText: "随便看看",
      success: function (res) {
          
          if (res.confirm) {
             wx.switchTab({
               url: '../login/index',
               success: (result)=>{
                 
               },
               fail: ()=>{},
               complete: ()=>{}
             });
          }else{
              
          }
      }
  });
  }
    this.getBanner()
    this.getRecommend()
    
    if(wx.getStorageSync('searchHistory')&&wx.getStorageSync('searchHistory').length){
      this.setData({
        searchHistory:wx.getStorageSync('searchHistory')
      }) 
    }else{
    
      wx.setStorage({
        key: 'searchHistory',
        data: []
      });
    }
   
  },
})
