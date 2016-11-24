## 内部默认hooks
 
  该程序内部默认存在一些hook，这些hooks不可配置，不可禁用。但是可以通过hook机制来跳过这些hook

### route

#### route:noFound

Desc: 单某些资源没有被用户hook 捕获处理时， 将它作为静态文件夹响应给客户端. 

[noFound.ts](../src/pluign/default-plugin/route/noFound.ts)

#### route:didRequest

Desc: 将基本的已存在的静态资源【js, css, html】读取到hook流程中，交给 可能需要的内容处理插件使用

[responseHTML_JS_CSS.ts](../src/pluign/default-plugin/route/noFouresponseHTML_JS_CSSnd.ts)

### build

#### build:doNothing

Desc: 单某些资源没有被用户hook 捕获处理时， 将它copy到build相应目录.

[doNothing.ts](../src/pluign/default-plugin/build/doNothing.ts)

### build:doCompile

Desc: 将基本的已存在的静态资源【js, css, html】读取到hook流程中，交给 可能需要的内容处理插件使用
[parseHTML_JS_CSS.ts](src/pluign/default-plugin/build/parseHTML_JS_CSS.ts)