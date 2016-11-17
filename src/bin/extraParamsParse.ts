export default function(value){
  if(!value){
    return {}
  }
  let arr = value.split(',')
  let params = {}
  arr.forEach((item)=>{
    let keyValue = item.split('=');
    if(!keyValue[0] || !keyValue[1]){
      return
    }
    params[keyValue[0]] = keyValue[1]
  })
  return params
}