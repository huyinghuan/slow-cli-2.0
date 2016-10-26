import * as _hooks from './hooks/index'

/**传递给插件使用对象 */
export default {
  __CLI: (global as any).__CLI,
  registerHook: _hooks.registerHook
}