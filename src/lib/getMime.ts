import * as _mime from 'mime';

_mime.define({
  'text/html': ['hbs']
})

export default function(path){
  return _mime.lookup(path)
}