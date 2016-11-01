import * as _mime from 'mime';

_mime.define({
  'text/html': ['hbs'],
  'text/css': ['less']
})

export default function(path){
  return _mime.lookup(path)
}