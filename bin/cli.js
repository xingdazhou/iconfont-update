#!/usr/bin/env node
const program = require("commander");
program
  .version(`iconfont ${require('../package').version}`)
  .usage('<command> [options]')

program
    .command("init")
    .alias("i")
    .description("初始化配置文件")
    .action(() => {
        require("../lib/init.js")();
    });

program
    .command("ls")
    .alias("l")
    .description("查看正在参与项目所用到的图标库")
    .action(() => {
        require("../lib/ls")();
    });

program
    .command("update")
    .alias("u")
    .description("更新图标库")
    .action(() => {
        require("../lib/update")();
    });

program
    .command("preview")
    .alias("p")
    .description("查看图标库的预览页面")
    .action(() => {
        require("../lib/preview")();
    });

program
    .command("compare")
    .alias("c")
    .description("本地与远程对比预览")
    .action(() => {
        require("../lib/compare")();
    });

program.parse(process.argv);
