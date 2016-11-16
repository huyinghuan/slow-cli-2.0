
let log:any = function(...args:any[]){
  console.log.apply(null, args)
}

log.warn = (...args:any[])=>{
  console.log.apply(null, args)
}

log.error = (...args:any[])=>{
  console.log.apply(null, args)
} 

log.info = (...args:any[])=>{
  console.log.apply(null, args)
}

log.success = (...args:any[])=>{
  console.log.apply(null, args)
}

log.fail =  (...args:any[])=>{
  console.log.apply(null, args)
}

export default log;