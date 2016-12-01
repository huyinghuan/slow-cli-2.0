module.exports = {
  urlMap: {
    server: "http://localhost:3000/"
  },
  //提供http head头，用于一些接口校验
  headers:{
    "private": "123456"
  },
  queryParams:{
    abc: 123
  }
}