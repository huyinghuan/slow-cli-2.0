## hooks里面的data 参数说明

```js
  inputFilePath: realPath, //输入文件的绝对路径
  outputFilePath: _path.join(buildConfig.outdir, filepath), //真实输出路径
  outdir: buildConfig.outdir, //输出文件夹（绝对路径）
  outRelativeDir: buildConfig.outRelativeDir, //输出文件夹（相对路径）
  inputFileRelativePath:  filepath,//输入文件的相对路径
  outputFileRelativePath: _path.join(buildConfig.outRelativeDir, filepath),//输出文件的相对路径
  fileName: fileName,   //文件名
  appendFile: false, //是否将该文件输出到文件末尾
  ignore: false,//是否忽略该文件等生成

```