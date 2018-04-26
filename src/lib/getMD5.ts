
import * as _crypto from 'crypto';
import * as _fs from 'fs';

export default function(filename){
  return new Promise((resolve, reject)=>{
    let hash = _crypto.createHash('md5');
    let input = _fs.createReadStream(filename);
    input.on('data', (data) => {
      hash.update(data);
    });
    input.on('end', ()=>{
      resolve(hash.digest('hex'))
    })
    input.on('error', (error)=>{
      reject(error)
    })
  })
}

