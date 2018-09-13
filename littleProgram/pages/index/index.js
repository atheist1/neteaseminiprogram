//index.js
//获取应用实例
const app = getApp()
Page({
  data:{
    hotSearch:[],
    inputValue:'',
    searchFocus:true,
    panelShow:true,
    multimatch:[],
    searchData:[],
    currentSearch:{
      offset:0,
      keywords:''
    }, 
    searchCount:0,
    searchHistory:[]
  }, 
  getHot:function(){
    var _this = this;
    this.setData({
      panelShow:true 
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
        'panelShow':false,
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
    
    wx.navigateTo({
      url:'../songs/index?id='+r.currentTarget.dataset.id+'&album='+r.currentTarget.dataset.aid,
    }); 
  },
  
  onReachBottom:function(e){
    let _this = this;
    if(this.data.searchCount >= this.data.currentSearch.offset+30 && !this.data.panelShow){
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
    this.getHot()
  },
})
