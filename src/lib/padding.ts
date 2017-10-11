export default  function(str, length){
  if(str.length >= length){
    return str
  }
  return str + (new Array(length - str.length)).join(" ")
}