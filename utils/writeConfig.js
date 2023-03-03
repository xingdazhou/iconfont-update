/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-03-03 13:35:01
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-04 02:58:30
 */
const homedir = require("os").homedir(); //这里放的在的是全局当前用户的主目录，如c:/user/hspcadmin/.iconfontrc
const path = require("path");
const fs = require("fs");
const writeConfig = (jsonData) => {
    const file = path.join(homedir, ".iconfontrc");
    try {
        fs.writeFileSync(file, jsonData);
    } catch {
        throw Error("创建并写入.iconfontrc文件报错");
    }
};
module.exports = writeConfig;
