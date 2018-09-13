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
    if(!~item.indexOf(':')){

    }else if(item ==='00:00.00'){
      return 0.001
    }else{
      temp = item.split(':')
   
      tempstamp = temp[1].split('.');

      return Number(temp[0])*60 + Number(tempstamp[0]) +  Number(tempstamp[1])/1000
    } 
    
  })
  return timeArr
}
module.exports = {
  trans: trans,
  random: random,
  transTime: transTime
}
