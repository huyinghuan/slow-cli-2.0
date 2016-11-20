import * as _mime from 'mime';

_mime.define({
  'text/html': ['hbs', 'ejs', 'jade'],
  'text/css': ['less', 'sass']
})

export default function(path){
  return _mime.lookup(path)
}