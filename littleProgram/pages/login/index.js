// pages/login/index.js
import {normalizeUserCookie} from  '../../utils/util'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    password:'',
    isChecked:false,
    showPanel:false
  },
  showPanels:function(){
    this.setData({
      showPanel:true
    })
  },
  login:function(){
    let json = {
      phone:this.data.tel,
      password:this.data.password,
      timeStap:new Date().getTime()
    }

    wx.request({
      url:'http://localhost:3000/login/cellphone',
      'method':'get',
      success:function(res){
        if( res.header["Set-Cookie"]){
          wx.setStorageSync('cookie',  normalizeUserCookie(res.header["Set-Cookie"]));
        }

        if(res.data.code === 200){
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '../index/index'
          });
        }
      },
      header:{
        xhrFields: JSON.stringify({
          withCredentials: true
        }),
        cookie:wx.getStorageSync('cookie')||''
      },
      
      data:json
    });
  },
  checkCanLogin:function(){
    
    if(this.data.tel && this.data.password){
      this.setData({
        isChecked:true
      })
      
    }else{
      this.setData({
        isChecked:false
      })
    }
  },
  inputsTel:function(e){

    this.setData({
      tel:e.detail.value
    })
  },
  inputsPas:function(e){
    this.setData({
      password:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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