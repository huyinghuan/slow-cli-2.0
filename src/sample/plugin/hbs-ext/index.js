
exports.registerPluginExt = function(cli, options){
  cli.registerExt('hbs:import', function(handlebars){
    handlebars.registerHelper('import', (a, b)=>{
      return a + b
    })
  })
}