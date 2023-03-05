/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-03-02 09:24:03
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-03 13:58:17
 */
const readConfig = require("../utils/readConfig");
module.exports = async () => {
    const config = JSON.parse(readConfig());
    const list = config.list;
    const projectArr = list.map((item) => {
        return {
            '仓库名': item.name,
            '仓库ID': item.id,
        };
    });
    console.table([...projectArr], ["仓库名", "仓库ID"]);
};
