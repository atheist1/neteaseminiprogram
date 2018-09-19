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
    comment:[]
  },
  getComment:function(){
    let _this = this
    async function getCommentAccount(){
      let res = await app.get('/comment/music?id='+app.globalData.currentPlayList.currentPlay.id+'&limit=20')
      
      _this.setData({
        comment:res.comments
      })
    }

    getCommentAccount()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1)
    wx.setNavigationBarTitle({
      title: '评论('+options.total+')',
    });
    this.getComment()
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})