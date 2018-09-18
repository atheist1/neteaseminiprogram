const app = getApp()
const deleteMusicFm  = function (id) {  
  if(app.globalData.isFm){
    app.get('/fm_trash',{
      id:id
    })
  }
}
module.exports = {
  deleteMusicFm
}