import * as _express from 'express';
import * as _http from 'http';
import * as _colors from 'colors';
const _app = _express();


_app.use('/', (request, response) => {

})


const _server = _http.createServer(_app)

_server.on('error', (error) => {
  console.log(error)
})




_server.listen(_app.listen(3000));