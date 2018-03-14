import * as _allDefined from '../../all';
import * as _ from 'lodash';
import * as _hookMap from '../map';
import * as _async from 'async';
import * as _hanlebars from 'handlebars'
const htmlTemplate =
  `
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
  `
const template = _hanlebars.compile(htmlTemplate);

function getHtml(path, fileArray){
  if(fileArray.length < 2){
    return null
  }
  return template({
    dirpath: path,
    fileArray: fileArray
  });
}

export default async function(path, callback){
  let queue = _hookMap.HookQueue['route:dir'] || [];
  let content = null;
  let data = {fileArray:[], ignore: []}
  
  for(let i = 0, len =  queue.length; i < len; i++){
    await (queue[i] as any).fn(path, data)
  }
  return getHtml(path, data.fileArray)
}
