//app.js
var baseUrl = 'http://localhost:3000';

App({
  onLaunch: function () {
    
  },
  //全局变量
  globalData: {
    userInfo: null,
    currentPlayList:{
      listArr:[],
      currentPlay:{},
      //记录后台播放状态
      backPlayInfo:{},
      listId:[],
     
    },
    isFm:false
  },
  //封装wx.request
  post:function(url,data){
    let promise = new Promise(function(resolve,reject){
      let _this = this;
      let postData = data;
      
      wx.request({
        url:baseUrl+url,
        data:postData,
        'method':'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success:function(res){
          if(res.data.code === 200){
            resolve(res.data.data);
          }else{
            reject(res)
          }
        }
      });
    });
    return promise;
  },
  get:function(url,data){
    let cookie = wx.getStorageSync('cookie')
    
    let promise = new Promise(function(resolve,reject){
      let _this = this;
      if(data){
        data.csrf_token = ""
      }
    
      wx.request({
        url:baseUrl+url,  
        'method':'get',
        success:function(res){
         
          if(res.statusCode === 200){
            resolve(res.data);
          }else{
            reject(res.errMsg)
          }
        },
        header:{
          xhrFields: JSON.stringify({
            withCredentials: true
          }),
          cookie:cookie||'',
          
        },
        
        data:data
      });
    });
    return promise;
  },
  
})