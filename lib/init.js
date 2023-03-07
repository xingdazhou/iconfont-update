/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-03-02 09:24:03
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-06 12:08:00
 */
const chalk = require("chalk");
const path = require("path");
const createBrowser = require("../utils/createBrowser");
const writeConfig = require("../utils/writeConfig");
const { getInitInput, getInitPathInput } = require("../utils/getUserInput");
module.exports = async () => {
    const { phoneNumber, password } = await getInitInput();
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
            let obj = {
                id,
                name,
            };
            projectArr.push(obj);
        }
        return projectArr;
    });
    spinner.succeed(chalk.green("您参与项目开发的图标库信息如下："));
    let showTableArr = projectIdList;
    showTableArr = showTableArr.map((item) => {
        return {
            仓库名: item.name,
            仓库ID: item.id,
        };
    });
    console.log();
    console.table(showTableArr);
    const list = [];
    for (let item of projectIdList) {
        let updatePath = await getInitPathInput(item);
        list.push({
            id: item.id,
            name: item.name,
            phoneNumber,
            password,
            updatePath: updatePath,
            fileAbsolutePath: path.join(process.cwd(), updatePath),
            previewLocalPath: path.join(
                process.cwd(),
                updatePath + "/demo_index.html"
            ),
            previewRemotePath:
                "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=" +
                item.id,
        });
    }
    const jsonData = JSON.stringify({ list });
    writeConfig(jsonData);
    console.log()
    console.log(
        chalk.yellowBright(
            `${chalk.bgBlue("初始化完毕")} 使用${chalk.bgBlue(
                "iconfont ls"
            )}查看你的所有项目`
        )
    );
    await page.close();
    await browser.close();
};