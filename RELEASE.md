## 更新历史
v2.6.4-preview-4
    1. 修复preview 进程预览模式的bug

v2.6.7-preview-2
    1. 修复 sr preview forward hook bug
    
v2.6.7-preview-2
    1. 增加 sr preview forward
v2.6.7-preview
    1. 增加 sr start forward
v2.6.6-preview
    1.增加 sr preview命令
v2.6.5
    1. 增加开发环境参数

v2.6.4
    1. sr install时检查 npm版本， 提示更新npm到5.x版本

v2.6.3
    1. 增加命令 `sr list` ，列出插件版本信息
    
v2.6.2

    1. 增加https命令 `sr https` 其他参数和`sr start` 一致

v2.6.1

    1. 增加 卸载插件 命令  `sr remove xxx`
    2. 修改 `sr install`到提示信息

v2.6.0
    1. 修复上个版本带来的bug：安装插件配置文件丢失问题
    2. 增加可读性
    3. 增加获取环境文件时，注入项目数据功能

v2.5.9
    1. 安装插件时如果没有指定版本后，强制指定最后一个版本

v2.5.8
    1. 忽略 v2.5.7
    2. bug修复。 在安装指定插件失败后，插件配置依旧会添加到package.json里面的错误

v2.5.6
   开发模式下，在浏览器输出错误信息

v2.5.5
   修复 start 纯净模式启动错误
v2.5.4
  支持灰度开发
  
v2.5.3 
  fix bug. 错误引用`git-head-hash`包
  
v2.5.2
  在`sr start`后，修改配置【包括sr install】后无需重启

v2.5.1
    更新获取git commit  hash方式
v2.5.0
    修复sr install 重复安装bug 

v2.4.9
  增加`-i`参数为单个文件进行编译，记得指定 -o 参数，否则会清空默认编译文件夹
v2.4.8
  bug 修复
v2.4.7
  bug 修复

v2.4.6
  1. 增加 build include 选项

v2.4.5
  bug修复

v2.4.4
  修复一个插件安装提示错误

v2.4.2
  1. 增加版本检查
  2. 增加版本上报

v2.4.1
  1. 增加响应文件大小显示，便于优化体积

v2.3.6
  1. 上传配置bug

v2.3.5
  1. 增加上传配置，可以包含所有文件

v2.3.3
  1. 增加安装存储逻辑，所有公共库保存到正式依赖
v2.3.0
  1. 增加 安装插件时，展示安装进度信息

v2.2.8
  1. 修复linux下报错

v2.2.7
  1. 支持build server 模式下 配置，插件 重新加载，避免重启

v2.2.6
  1. `getRuntimeEnvFile`提示信息不完整

v2.2.5
  1. 修复开发组件时，开发配置转正式环境配置插件配置丢失情况。涉及命令`silky dev`

v2.2.4
  1. 调用`getRuntimeEnvFile`时，当文件不存在时，由 错误抛出处理 改为 警告提示
  2. 修复在未指明 自定义组件目录时，无法正确获默认组件目录bug
  3. 修复开发组件时，同时引用了 开发中组件和正式组件 无法正确获取正式组件目录的bug

v2.2.1
  1. 修复 build成功 退出码不正确的bug

v2.2.0 
  1. 修复 在windows 下不能正确忽略 文件等bug

v2.1.8
  1. 增加一些插件工具函数

v2.1.7
  无

v2.1.6
  1. 新增公共组件库支持。
  2. 修复读取 package.json 开发依赖错误

v2.1.5
  windows安装成功，但无法使用错误

v2.1.4
  安装插件时，默认安装到`dev-dependencies`

v2.1.3
  修复升级插件时，已有插件配置被清空bug

v2.1.2
  修复依赖检查忽略了dev依赖的bug

v2.1.1
  修复 环境变量读取继承bug

v2.1.0
  修复 config sync 问题

v2.0.5 支持文件夹文件显示