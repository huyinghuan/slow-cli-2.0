import * as _allDefined from '../all';
import _triggerHttpCompilerHook from './triggerHttpCompilerHook';
import _triggerRouterHook from './triggerRouterHook';
import {scanPlugins} from './scanPlugins';


export function triggerHook(hookName:string, req, callback:_allDefined.CallBack){}

export {_triggerHttpCompilerHook as triggerHttpCompilerHook} 
export {_triggerRouterHook as triggerRouterHook}
export {scanPlugins as scanPlugins}