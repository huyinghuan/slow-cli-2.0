## command config

同步或上传项目配置文件 e.g.

```shell
 #上传项目配置文件
 silky config up
 #上传项目配置文件到某个版本
 silky config up -v 1.0.0
 #上传项目配置文件到某个名称下面(未指定版本时，读取package.json的version版本)
 silky config up -n test
 #上传项目配置文件到某个名称下面的摸个版本
 silky config up -n test -v 1.0.0

 #下载本项目配置（读取package.json的name和version）
 silky config sync
 #下载本项目某个版本配置
 silky config sync -v 1.0.0
 #下载某个项目的某个配置的某个版本
 silky config sync -n test -v 1.0.0
```

### 可选选项参数：

```shell

-u --url 配置服务器地址
-w --workspace #指定工作目录
```
