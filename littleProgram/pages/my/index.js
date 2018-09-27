// pages/my/index.js
import regeneratorRuntime from '../../utils/runtime-module'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myList:[],
    otherList:[]
  },
  redirectPlayList:function(r){
    let pid = r.currentTarget.dataset.id
    wx.navigateTo({
      url: '../playList/index?pid='+pid
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uid,_this = this
    if(wx.getStorageSync('userId')){
      uid = wx.getStorageSync('userId')
      async function getPlayList(){
        let res,myList = [],otherList = []
        res = await app.get('/user/playlist',{uid})
        res.playlist.forEach((item)=>{
          if(item.creator.userId===uid){
            myList.push(item)
          }else{
            otherList.push(item)
          }
        })
        _this.setData({
          myList,
          otherList
        })
      }
      getPlayList()
    }else{
      wx.showModal({
        title: '登录',
        content: '您还没有登陆网易云账号，是否登陆',
        confirmText: "去登陆",
        cancelText: "随便看看",
        success: function (res) {
            
          if (res.confirm) {
              wx.switchTab({
                url: '../login/index'
              })
          }
        }
      })
    }
    
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