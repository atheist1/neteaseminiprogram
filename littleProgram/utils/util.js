const trans = (duration)=>{
  let time = Math.floor(duration),
      minutes = Math.floor(time/60),
      second = time%60
  minutes<10?(minutes = '0' + minutes):true
  second <10?(second = '0' + second):true
  return minutes + ':' + second
}
//获取一个从0到num的随机数
const random = (num) => {
  return Math.floor(Math.random()*num)
}
//废弃
const transTime = (time) => {
  let transLrcTime,timeArr = [] ,temp,tempstamp,lrcArr = []
  transLrcTime = (lrc) => { 
    // let match = lrc.match(/\[(\d{2}:\d{2}.\d{3})]/)
    let match = lrc.match(/\[(.*?)\]/)
    if(match && match.length){
      timeArr.push(match[1])
      
      transLrcTime(lrc.replace(match[0],''))
    }
    return 
  } 
  transLrcTime(time)

  timeArr = timeArr.map((item)=>{
    let m ,s,ms 
    if(!~item.indexOf(':')){

    }else if(item ==='00:00.00'){
      return 0.00001
    }else{
      temp = item.split(':')
      m = Number(temp[0])*60
      tempstamp = temp[1].split('.');
      s = Number(tempstamp[0])
      ms = Number(tempstamp[1])/1000
      //防止开始是作者
      if(!Number.isNaN(m)&&!Number.isNaN(m)&&!Number.isNaN(ms)){
        return m + s +  ms
      }else{
        return 0.00001
      }
      
    } 
    
  })
  return timeArr
}
//中英文合并版本
const transConcat = (res) => {
  let lrcArr = [],timeArr =[ ],transLrcArr=[]//翻译过后的歌词
  ,transObj = {},lrcObj = {}
  if(res.tlyric && res.tlyric.lyric){
    transLrcArr = res.tlyric.lyric.split('\n').map((item)=>{
      let match
      match = item.match(/\[(.*?)\](.*)/)
      if(match){
        transObj[match[1]] = match[2]
      }
      
      return item.replace(/\[.*?\]/g,'')
    })
  }else{
    transLrcArr = []
  } 

  res.lrc.lyric.split('\n').forEach((item)=>{
      let match;
      match = item.match(/\[(.*?)\](.*)/)
      if(match){
        lrcObj[match[1]] = match[2]
      }
     
  })
  for(let item in lrcObj){
    let m = item.split(':')[0],m2s = item.split(':')[1],s = m2s.split('.')[0],ms = m2s.split('.')[1],trueTime = Number(m)*60+Number(s) + Number((ms/1000))||0.00001
    if(transObj[item]){
      lrcObj[item] +=  '\n'+transObj[item]
      
    }
    
    timeArr.push(trueTime)
    
  }
  
  lrcArr = Object.values(lrcObj).filter((item)=>{
    return item;
  })
  return {
    timeArr,
    lrcArr
  }

}
//格式化cookie
const normalizeUserCookie = (cookies = '') => {
  let __cookies = [];
  (cookies.match(/([\w\-.]*)=([^\s=]+);/g) || []).forEach((str) => {
    if (str !== 'Path=/;' && str.indexOf('csrfToken=') !== 0) {
      __cookies.push(str);
    }
  });
 return  __cookies.join(' ');
};
module.exports = {
  trans,
  random,
  transTime,
  transConcat,
  normalizeUserCookie
}
