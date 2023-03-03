/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-03-03 13:34:52
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-03 22:34:25
 */
const homedir = require("os").homedir(); //这里放的在的是全局当前用户的主目录，如c:/user/hspcadmin/.iconfontrc
const path = require("path");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");
const readConfig = () => {
    console.log(process.cwd())
    const spinner = ora({
        spinner: {
            frames: [],
        },
    });
    const file = path.join(homedir, ".iconfontrc");
    const config = "";
    try {
        config = fs.readFileSync(file, "utf8");
    } catch {
        spinner.fail(
            `读取${chalk.blue(".iconfontrc")}文件失败，请先执行${chalk.blue(
                " iconfont init"
            )}`
        );
        throw Error('获取.iconfontrc文件失败')
    }
    return config;
};
module.exports = readConfig;
