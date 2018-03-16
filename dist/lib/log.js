"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * 日志记录器。
 * TODO 可以继续完善
 */
class Log {
    constructor() {
        this.level = 0;
    }
    /**
     * default 0: show all
     *  1: show error, fail
     *  2: show error, fail, warn
     */
    setLevel(value) { this.level = ~~value; }
    warn(...args) {
        if (_.indexOf([0, 2], this.level) != -1)
            console.log.apply(null, args);
    }
    error(...args) {
        if (_.indexOf([0, 1, 2], this.level) != -1)
            console.log.apply(null, args);
    }
    fail(...args) { if (_.indexOf([0, 1, 2], this.level) != -1)
        console.log.apply(null, args); }
    info(...args) { if (_.indexOf([0], this.level) != -1)
        console.log.apply(null, args); }
    success(...args) { if (_.indexOf([0], this.level) != -1)
        console.log.apply(null, args); }
}
exports.default = new Log();
