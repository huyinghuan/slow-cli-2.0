export default function(value){
  if(!value){
    return {}
  }
  if(/(\,|\=)/.test(value)){
    return {extra: value}
  }
  let arr = value.split(',')
  let params:any = {}
  arr.forEach((item)=>{
    let keyValue = item.split('=');
    if(!keyValue[0] || !keyValue[1]){
      return
    }
    params[keyValue[0]] = keyValue[1]
  })
  return params
}