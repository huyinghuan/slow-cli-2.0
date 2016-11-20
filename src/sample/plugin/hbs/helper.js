'use strict';
module.exports = (Handlebars, helperReigerterQueue)=>{
  helperReigerterQueue = helperReigerterQueue || []
  helperReigerterQueue.forEach(function(element) {
    element(Handlebars)
  });
}