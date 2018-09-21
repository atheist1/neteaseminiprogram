const app = getApp()
import regeneratorRuntime from '../../utils/runtime-module'
const deleteMusicFm  = function (id) {  
  if(app.globalData.isFm){
    app.get('/fm_trash',{
      id:id
    })
  }
}

module.exports = {
  deleteMusicFm,
  
}