const app = getApp()
import regeneratorRuntime from '../../utils/runtime-module'
const deleteMusicFm  = function (id) {  
  if(app.globalData.isFm){
    app.get('/fm_trash',{
      id:id
    })
  }
}
// async function a(){
//   await app.get('/album',{id:12341})
// }
module.exports = {
  deleteMusicFm,
  // a
}