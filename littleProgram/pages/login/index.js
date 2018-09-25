// pages/login/index.js
import {normalizeUserCookie} from  '../../utils/util'
import regeneratorRuntime from '../../utils/runtime-module'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    password:'',
    isChecked:false,
    showPanel:false,
    userInfo:'', 
    top:{}
  },
  getUserInfo:function(){
    let userInfo,_this = this
    if(wx.getStorageSync('userId') && !this.data.userInfo){
      async function getUser(){
        userInfo = await app.get('/user/detail',{uid:wx.getStorageSync('userId')})
        userInfo.profile.defaultAvatar ? userInfo.profile.avatarUrl='../../assets/image/defaultAva.png':userInfo.profile.avatarUrl
        _this.setData({
          userInfo:userInfo,
        })
      }
      getUser()
    }
   
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
          wx.setStorageSync('userId',res.data.account.id)
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '../index/index',
            success(e){
              //手动刷新一次获取数据
              var page = getCurrentPages().pop()
              page.onLoad()
            }
          });
          wx.setStorageSync('overtime',new Date().getTime())
         
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
  //签到
  sign:function(){
    if(!this.data.userInfo.mobileSign){
      app.get('/daily_signin')
        .then((res)=>{
          if(res.code === 200){
            wx.showToast({
              title:'签到成功积分+3',
              icon:'success'
            })
          }
        })
    }
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
    if(!wx.getStorageSync('cookie')){
      this.setData({
        userInfo:''
      })
    }
    if(!this.data.userInfo){
      this.getUserInfo()
    }
    
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