/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-03-02 09:24:03
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-03 13:35:50
 */
const chalk = require("chalk");
const createBrowser = require("../utils/createBrowser");
const writeConfig = require('../utils/writeConfig')
module.exports = async (phoneNumber, password) => {
    const { spinner, browser, page } = await createBrowser();
    spinner.start(chalk.blue("查询参与项目的图标库信息"));

    const iconfontLoginUrl = "https://www.iconfont.cn/login";
    await page.goto(iconfontLoginUrl, {
        waitUntil: "networkidle0",
    });
    await page.type("#userid", phoneNumber, {
        delay: 50,
    });
    await page.type("#password", password, {
        delay: 50,
    });
    await page.click(".mx-btn-submit");
    // await page.keyboard.press('Enter');// 回车也可以
    await page.waitForNavigation(); //等待登录跳转，直到导航完成  *******这里必须等待
    const myProjectUrl =
        "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects";
    await page.goto(myProjectUrl, {
        waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(".J_scorll_project_corp");

    const projectIdList = await page.evaluate(() => {
        const projectList = document.querySelector(
            ".J_scorll_project_corp"
        ).children;
        let projectArr = [];
        for (let div of projectList) {
            const reg = /\((.*)\)/g;
            const funStr = div.getAttribute("mx-click");
            reg.test(funStr);
            const name = div.querySelector("span").innerText;
            const id = RegExp.$1;
            // obj[name] = id
            let obj = {
                id,
                name,
            };
            projectArr.push(obj);
        }
        return projectArr;
    });
    const list = projectIdList.map((item) => {
        return {
            id: item.id,
            name: item.name,
            phoneNumber,
            password,
            fileAbsolutePath: "",
            previewLocalPath: "",
            previewRemotePath: "",
        };
    });
    spinner.succeed(chalk.green("查询参与项目的图标库信息"));
    const jsonData = JSON.stringify({ list })
    writeConfig(jsonData)
    console.log(chalk.yellowBright(`${chalk.bgBlue('初始化完毕')}\n使用${chalk.green("iconfont ls")}查看你的所有项目.\n${chalk.red("*")}更新前请在根目录下${chalk.blue(".iconfontrc")}配置好图标库下载路径\n(eg:fileAbsolutePath:"c:/users/download").`))
    await page.close();
    await browser.close();
};



// 参考的例子
// const page = await browser.newPage()
// await page.goto("https://www.baidu.com")
// await page.waitForSelector("title")
// const titleDomText = await page.evaluate(()=>{
//     const dom = document.querySelector('title')
//     return dom.innerText
// })
// console.log(titleDomText)