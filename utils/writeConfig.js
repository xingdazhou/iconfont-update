/*
 * @Descripttion: 
 * @version: 
 * @Author: zhouxd
 * @Date: 2023-03-03 13:35:01
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-03 23:12:19
 */
const homedir = require("os").homedir(); //这里放的在的是全局当前用户的主目录，如c:/user/hspcadmin/.iconfontrc
const path = require("path");
const fs = require("fs");
const writeConfig =  (jsonData) => {
    // console.log(path.join(__dirname, '/public/newFont'));
    const file = path.join(homedir, ".iconfontrc");
    fs.writeFileSync(file, jsonData);
};
module.exports = writeConfig;
