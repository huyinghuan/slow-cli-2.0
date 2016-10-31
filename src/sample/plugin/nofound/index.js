exports.registerPlugin = function(cli){
  cli.registerHook('route:notFound', function(req, resp, cb){
    if(/(\.html)$/.test(req.path)){
      resp.status(404);
      resp.send('This test 404 page');
      cb(true)
    }else{
      cb(false)
    }
  })
}