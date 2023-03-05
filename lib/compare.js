/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-03-05 14:44:32
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-05 22:55:44
 */
const http = require("http");
const fs = require("fs");
const open = require("open");
// const { exec } = require('child_process')
const { getCompareInput } = require("../utils/getUserInput");
const compare = async () => {
    const comparePathObj = await getCompareInput();
    http.createServer((req, res) => {
        if (req.url.match(/\/comparePage\.html/g)) {
            console.log(111);
            fs.readFile("./pages/comparePage.html", "utf-8", (err, data) => {
                if (err) {
                    throw err;
                } else {
                    res.setHeader("X-Frame-Options", "AllowAll");
                    res.end(data);
                }
            });
        }
    }).listen(9000, () => {
        console.log("启动成功");
    });
    const url =
        "localhost:9000/comparePage.html?local=" +
        comparePathObj.local +
        "&remote=" +
        comparePathObj.remote;
    console.log(url);
    await open(url, { app: "chrome" });
    // exec('start localhost:9000' + "/comparePage.html?local=" + comparePathObj.local + '&remote=' + comparePathObj);
};
module.exports = compare;
