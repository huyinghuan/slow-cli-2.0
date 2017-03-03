"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
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
    let queue = _hookMap.HookQueue[_hookMap.route.isDir] || [];
    let content = null;
    let data = { fileArray: [], ignore: [] };
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(path, data, (error) => {
            next(error, null);
        });
    }, (error) => {
        if (error) {
            callback(error);
        }
        else {
            callback(null, getHtml(path, data.fileArray));
        }
    });
}
exports.default = default_1;
