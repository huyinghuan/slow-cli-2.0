"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("../map");
const _hanlebars = require("handlebars");
const htmlTemplate = `
    <html>
      <meta charset="utf-8">
      <head>
        <title>{{dirpath}}</title>
      </head>
      <body>
        <table>
          <thead>
            <tr><th>Type</th> <th>File Name</th><th>File Size</th> <th>Create Time</th><th>Modifie Time</th></tr>
          </thead>
          <tbody>
            {{#each fileArray}}
            <tr>
              <td>{{#if isDir}}D{{else}}F{{/if}}</td>
              <td><a href="{{href}}">{{filename}}</a></td>
              <td>{{size}}</td>
              <td>{{birthtime}}</td>
              <td>{{mtime}}</td>
            </tr>
            {{/each}}
          </tbody>
        </table>
      </body>
    </html>
  `;
const template = _hanlebars.compile(htmlTemplate);
function getHtml(path, fileArray) {
    if (fileArray.length < 2) {
        return null;
    }
    return template({
        dirpath: path,
        fileArray: fileArray
    });
}
function default_1(path, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue['route:dir'] || [];
        let content = null;
        let data = { fileArray: [], ignore: [] };
        for (let i = 0, len = queue.length; i < len; i++) {
            yield queue[i].fn(path, data);
        }
        return getHtml(path, data.fileArray);
    });
}
exports.default = default_1;
