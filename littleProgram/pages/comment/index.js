import regeneratorRuntime from '../../utils/runtime-module.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songImage:'',
    id:'',
    artists:'',
    songName:'',
    comment:[],
    hotComment:[],
    offset:0,
    total:20,
    hotOffset:0,
    sendComment:''
  },
  getComment:function(type){
    let _this = this

    if(this.data.offset>this.data.total){
      return
    }
    wx.showToast({
      title: '正在加载评论',
      icon: 'loading',
      duration: 1500,
    });
    async function getCommentAccount(){
      let res,data
      res = await app.get('/comment/music?id='+app.globalData.currentPlayList.currentPlay.id+'&limit=20&offset='+_this.data.offset)
      wx.hideToast()
      if(type==='add'){
        data = res.comments
      }else{
        data = _this.data.comment.concat(res.comments)
      }
      _this.setData({
        comment:data,
        total:res.total,
        offset:_this.data.offset+20,
        
      })
    }

    getCommentAccount()
  
  },
  getHotComments:function(){
    let _this = this
    async function getHotComment(){
      let json,res
      json = {
        type:0,
        id:app.globalData.currentPlayList.currentPlay.id
      }
    
      res = await app.get('/hot/comment',json)
      wx.hideToast()
      _this.setData({
        hotComment:_this.data.hotComment.concat(res.hotComments),
       
        hotOffset:_this.data.hotOffset+20,
      })
    }

    getHotComment()
  },
  //点赞
  likeOrDislike:function(r){
    let id = r.currentTarget.dataset.commentid,
    index = r.currentTarget.dataset.index,
    islike = r.currentTarget.dataset.islike,
    isHot = r.currentTarget.dataset.ishot,
    json = {
      cid:id,
      id:this.data.id,
      type:0,
      t:1
    }
    if(islike){//取消点赞
      json.t = 0
    }else{//点赞
      json.t = 1
    }
    app.get('/comment/like',json)
      .then((res)=>{
        let data
        data =  isHot ?JSON.parse(JSON.stringify(this.data.hotComment)) :JSON.parse(JSON.stringify(this.data.comment))
        data[index].liked = !islike
        data[index].likedCount += islike?-1:1
        if(isHot){
          this.setData({
            hotComment:data
          })
        }else{
          this.setData({
            comment:data
          })
        }
        
      })
  },
  //发送评论
  doSendComment:function(){
    let json = {
      action:1,
      type:0,
      id:this.data.id,
      content:this.data.sendComment
    },_this = this
    app.get('/comment',json)
      .then((res)=>{
        if(res.code === 200){
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1500,
            mask: false
          })
          _this.setData({
            offset:0,
            total:20
          })
          setTimeout(function(){
            _this.getComment('add')
          },200)
          
        }
      })
  },
  //监听输入
  changeInput:function(r){
    if(r.detail.value){
      this.setData({
        sendComment:r.detail.value
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.setNavigationBarTitle({
      title: '评论('+options.total+')',
    });
    this.getComment()
    this.getHotComments()
    this.setData({
      songImage:wx.getStorageSync('currentImage'),
      artists:options.songArtists,
      id:options.id,
      songName:options.songName
    })
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
    this.getComment()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})