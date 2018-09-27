// pages/playList/index.js
import regeneratorRuntime from '../../utils/runtime-module'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    detail:null,
    modalShow:false,
    isSubScribed:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  loadPlayList:function(pid){
    let _this = this
    async function getPlayList(){
      let res
      wx.showToast({
        title: '正在加载数据',
        icon: 'loading',
        duration: 1500,
        mask: false,
      })
      res = await app.get('/playlist/detail',{id:pid})
     
      _this.setData({
        id:pid,
        detail:res.playlist,
        modalShow:true,
        isSubScribed:res.playlist.subscribed,
        isPlayAll:false
      })
    }
    getPlayList()
  },
  //收藏歌单
  subscribe:function(){
    let t = 1,_this = this,id = this.data.id
    this.data.isSubScribed?(t=2):t=1
 
    app.get('/playlist/subscribe',{
      t,
      id
    })
      .then((res)=>{
        
        if(res.code===200){
          let obj =  _this.data.detail
          if(this.data.isSubScribed){
            obj.subscribedCount--
          }else{
            obj.subscribedCount++
          }
          
          _this.setData({
            isSubScribed:!this.data.isSubScribed,
            detail:obj
          })
        }
      })
  },
  //跳转到歌曲
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
        } 
      }    
      wx.navigateTo({
        url:'../songs/index?id='+id+'&album='+aid,
      });
       
  },
  seeSongs:function(r){
    let obj
    //如果前面是私人fm，则清空歌单
    if(app.globalData.isFm ){
      app.globalData.isFm =false
      app.globalData.currentPlayList.listId = []
      app.globalData.currentPlayList.listArr = []
    }
    
    if(this.data.isPlayAll){
      
      app.globalData.currentPlayList.listId = []
      app.globalData.currentPlayList.listArr = []
      if(this.data.detail){
        this.data.detail.tracks.forEach((item,index) => {
          item.artists = item.ar
          item.album = item.al
          item.album = item.al
          item.index = index
          app.globalData.currentPlayList.listArr.push(item)
          app.globalData.currentPlayList.listId.push(item.id)
          if( index===0 ){
            obj = item
            r = {
              currentTarget:{ 
                dataset:{
                  currentsong: item,
                  id: item.id,
                  aid: item.album.id
                }
              }
            }
          }
        })
      }
    }else{
      obj = this.transAdapter(JSON.parse(JSON.stringify(r.currentTarget.dataset.currentsong))) 
    }
    app.globalData.currentPlayList.currentPlay = obj
    
    if(!~app.globalData.currentPlayList.listId.indexOf(r.currentTarget.dataset.id)){
      app.globalData.currentPlayList.listId.push(app.globalData.currentPlayList.currentPlay.id)
      app.globalData.currentPlayList.listArr.push(app.globalData.currentPlayList.currentPlay)
      app.globalData.currentPlayList.currentPlay.index = app.globalData.currentPlayList.listArr.length 
    }
    //如果是点击单个的,手动设置一下index防止被推入歌单的最后一个
    if(!this.data.isPlayAll){
      app.globalData.currentPlayList.currentPlay.index = r.currentTarget.dataset.indexs
    }
   
    this.getComment(r)
  },
  playSingle:function(r){
    this.setData({
      isPlayAll:false
    })
    this.seeSongs(r)
  },
  playAll:function(){
    this.setData({
      isPlayAll:true
    })
    this.seeSongs()
  },
  //适配器
  transAdapter:function(obj){
    app.globalData.isFm = false
    obj.artists = obj.ar
    obj.album = obj.al
    return obj
  },
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title:'歌单'
    })
    wx.showTabBar({
      animation: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    this.loadPlayList(options.pid)
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})