import regeneratorRuntime from '../../utils/runtime-module.js'
async function getMusicDetail() {
  let isCheck,music; 
  isCheck = await app.get('/check/music',{id:option.id})
  if(isCheck.success){
    music = await app.get('/music/url',{id:option.id})
    if(music.url){
      
    }else{
      console.log('##购买占位##')
    }
  }else{
    console.log('##版权占位##')
  }
  
  _this.rotate();
}
export default {
  getMusicDetail
}