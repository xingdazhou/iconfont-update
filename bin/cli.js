#!/usr/bin/env node
const program = require("commander");

// 对上面代码的解释   https://www.cnblogs.com/ZheOneAndOnly/p/15912495.html
// 到项目文件路径下面执行 npx link 创建一个软连接
// 查看说有软连接 npm ls --global --depth 0
// 或者直接执行 node ./bin/cli.js init phone password

// 修改iconfont init 为用户交互
// https://blog.csdn.net/qq_34086980/article/details/113624914

// The fs.promises API is experimental  装了最新包，但是node不是最高版本，单独运行对应js文件找到报错的是导入那个模块引起的

// 初始化用户信息
program
    .command("init")
    .alias("i")
    .description("初始化配置文件")
    .action(() => {
        require("../directiveFun/init.js")();
    });

// 查看参与项目图标库列表
program
    .command("ls")
    .alias("l")
    .description("查看正在参与项目所用到的图标库")
    .action(() => {
        require("../directiveFun/showStoreList")();
    });

// 更新图标库
program
    .command("update")
    .alias("u")
    .description("更新图标库")
    .arguments("<projectId>")
    .action((projectId) => {
        require("../lib/index")(projectId);
    });

// 预览本地图标库
program
    .command("preview")
    .alias("p")
    .description("查看图标库的预览页面")
    .arguments("<projectId>")
    .action((projectId) => {
        require("../lib/preview")(projectId);
    });

// 本地图标库与远程图标库对比
program
    .command("compare")
    .alias("c")
    .description("本地与远程对比预览")
    .arguments("<projectId>")
    .action((projectId) => {
        require("../lib/preview")(projectId);
    });

program.parse(process.argv);
