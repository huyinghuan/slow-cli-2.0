'use strict';
const _path = require("path")
const projectName = process.cwd().split(_path.sep).pop();
module.exports = {
  __img: `//img.hunantv.com/${projectName}/`,
  __css: `//css.hunantv.com/${projectName}/`,
  __js: `//js.hunantv.com/${projectName}/`,
}