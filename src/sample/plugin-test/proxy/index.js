'use strict';
const _http_proxy = require('http-proxy').createProxyServer({});

exports.registerPlugin = (cli, options)=>{
  const getProxySetting = (path)=>{
    let setting = [].concat(options.setting)
    for(let i = 0, len = setting.length; i < len; i++){
      let proxyPathArray = [].concat(setting[i].from);
      let regExpAttr = setting[i].attribute;
      for(let j = 0, jlength = proxyPathArray.length; j < jlength; j++){
        let reg = new RegExp(proxyPathArray[j], regExpAttr)
        if(reg.test(path)){
          if(setting[i].to){
            return { forward: setting[i].to}
          }else{
            return setting[i].options
          }
        }
      }
    }
    return null;
  }

  cli.registerHook('route:initial', (router, cb)=>{
    router.get('/', function(req, res, next){
      let setting = getProxySetting(req.path)
      if(!setting){
        return next()
      }
      console.log(`proxy ${req.url} -> ${setting.forward || setting.target}`.green)
      _http_proxy.web(req, res, setting)
    });
    cb(null, false)
  })
}