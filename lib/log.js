"use strict";
let log = function (...args) {
    console.log.apply(null, args);
};
log.warn = (...args) => {
    console.log.apply(null, args);
};
log.error = (...args) => {
    console.log.apply(null, args);
};
log.info = (...args) => {
    console.log.apply(null, args);
};
log.success = (...args) => {
    console.log.apply(null, args);
};
log.fail = (...args) => {
    console.log.apply(null, args);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = log;
