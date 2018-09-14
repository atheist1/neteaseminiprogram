//index.js
import regeneratorRuntime from '../../utils/runtime-module.js'
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
    banner:[]
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
    app.get('/banner')
      .then((res)=>{
        if(res.code === 200){
          _this.setData({
            banner:res.banners
          })
        }
      })
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
  seeSongs:function(r){
    app.globalData.currentPlayList.currentPlay = r.currentTarget.dataset.currentsong
    app.globalData.currentPlayList.currentPlay.index = app.globalData.currentPlayList.listArr.length 
    if(!~app.globalData.currentPlayList.listId.indexOf(r.currentTarget.dataset.id)){
     
      app.globalData.currentPlayList.listId.push(app.globalData.currentPlayList.currentPlay.id)
      app.globalData.currentPlayList.listArr.push(app.globalData.currentPlayList.currentPlay)
    }
    //加载评论
    async function getCommentAccount(){
      let res = await app.get('/comment/music?id='+app.globalData.currentPlayList.currentPlay.id+'&limit=1')
      console.log(res)
      if(res.code===200){
        wx.navigateTo({
          url:'../songs/index?id='+r.currentTarget.dataset.id+'&album='+r.currentTarget.dataset.aid+'&commentAccount='+res.total,
        });
      }     
    }
    getCommentAccount()
    
    
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
        panelShow:false
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
  
  onLoad:function(){
    this.getBanner()
    if(wx.getStorageSync('searchHistory')&&wx.getStorageSync('searchHistory').length){
      this.setData({
        searchHistory:wx.getStorageSync('searchHistory')
      }) 
    }else{
      wx.clearStorageSync('searchHistory')
      wx.setStorage({
        key: 'searchHistory',
        data: []
      });
    }
   
  },
})
