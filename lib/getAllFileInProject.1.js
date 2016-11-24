"use strict";
/* 获取项目目录下的所有文件，除编译目录外*/
const getAllFilePatg = () => {
    return _getAllFileInDir(process.cwd(), [], '.', shouldInclude);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllFileInProject;
