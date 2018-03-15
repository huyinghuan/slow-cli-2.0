import * as _hookMap from './map';
import * as _async from 'async';
import _responseDir from './route/responseDir'
import * as _allDefined from '../all'

async function forward(req, data){}


export default async function(hookType:string, ...options){
  switch(hookType){
    case "forward":
      return forward.apply(null, options)
  }
}