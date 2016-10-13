import * as _express from 'express';
import * as _http from 'http';

const _app = _express()

const _server = _http.createServer(_app)

_server.listen(_app.listen(3000));