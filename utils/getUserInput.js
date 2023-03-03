const inquirer = require("inquirer");
let phoneNumber = "";
let password = "";
let updatePath = "";
async function getAllInput() {
    phoneNumber = await inquirer.prompt([
        {
            name: "input",
            type: "input",
            message: "请输入手机号：",
        },
    ]);
    password = await inquirer.prompt([
        {
            name: "input",
            type: "input",
            message: "请输入密码：",
        },
    ]);
    updatePath = await inquirer.prompt([
        {
            name: "input",
            type: "input",
            message: "请输入本地图标库更新路径：",
            default: "/public/static/newFont",
        },
    ]);
    return {
        phoneNumber : phoneNumber.input,
        password : password.input,
        updatePath: updatePath.input
    }
}
module.exports = getAllInput
