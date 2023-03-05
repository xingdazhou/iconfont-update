const inquirer = require("inquirer");
const readConfig = require("../utils/readConfig");
let phoneNumber = "";
let password = "";
let updatePath = "";

let updateId = ''
let previewPath = "";
let comparePath = {};
async function getInitInput() {
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
        phoneNumber: phoneNumber.input,
        password: password.input,
        updatePath: updatePath.input,
    };
}
async function getUpdateInput() {
    const list = JSON.parse(readConfig()).list;
    const checkBoxList = list.map((item) => {
        return {
            name: item.name,
            value: item.id,
        };
    });
    updateId = await inquirer.prompt([
        {
            type: "checkbox",
            name: "checkbox",
            message: "请选择下列图标库进行预览",
            choices: checkBoxList,
        },
    ]);
    return updateId.checkbox[0];
}
async function getPreviewInput() {
    const list = JSON.parse(readConfig()).list;
    const checkBoxList = list.map((item) => {
        return {
            name: item.name,
            value: item.previewLocalPath,
        };
    });
    previewPath = await inquirer.prompt([
        {
            type: "checkbox",
            name: "checkbox",
            message: "请选择下列图标库进行更新",
            choices: checkBoxList,
        },
    ]);
    return previewPath.checkbox[0];
}
async function getCompareInput() {
    const list = JSON.parse(readConfig()).list;
    const checkBoxList = list.map((item) => {
        return {
            name: item.name,
            value: {
                local: item.previewLocalPath,
                remote: item.previewRemotePath,
            },
        };
    });
    comparePath = await inquirer.prompt([
        {
            type: "checkbox",
            name: "checkbox",
            message: "请选择下列图标库与远程进行对比",
            choices: checkBoxList,
        },
    ]);
    return comparePath.checkbox[0];
}
module.exports = {
    getInitInput,
    getUpdateInput,
    getPreviewInput,
    getCompareInput,
};
