'use strict';
const _path = require("path")
module.exports = (url)=>{
  let projectName = process.cwd().split(_path.sep).pop()
  let rules = [
    {source: /[\/]?imgotv\-pub.image.(.+)/i, target: `//img.hunantv.com/${projectName}/imgotv-pub/$1`},
    {source: /^imgotv\-pub.css.component.(.+)/i, target: `//css.hunantv.com/${projectName}/imgotv-pub/component/$1`},
    {source: /^imgotv\-pub.js.component.(.+)/i, target: `//js.hunantv.com/${projectName}/imgotv-pub/component/$1`},
    {source: /^css\/(.+)/i, target: `//css.hunantv.com/${projectName}/imgotv-pub/component/$1`},
    {source: /^js\/(.+)/i, target: `//js.hunantv.com/${projectName}/imgotv-pub/component/$1`},
    {source: /^image\/(.+)/i, target: `//img.hunantv.com/${projectName}/imgotv-pub/component/$1`}
  ];
  for(let i = 0, length = rules.length; i <  length; i++){
    let rule = rules[i];
    if(rule.source.test(url)){
      url = url.replace(rule.source, rule.target)
      break
    }
  }
  return url
}