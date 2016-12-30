module.exports = (url)=>{
  let rules = [{
    source: /[\/]?imgotv\-pub.image.(.+)/i,
    target: '/image/imgotv-pub/$1'
  }];
  for(let i = 0, length = rules.length; i <  length; i++){
    let rule = rules[i];
    if(rule.source.test(url)){
      url = url.replace(rule.source, rule.target)
      break
    }
  }
  return url
}