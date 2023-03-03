/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-02-27 13:22:59
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-03 14:14:20
 */
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const compressing = require("compressing");
const createBrowser = require("../utils/createBrowser");
const readConfig = require("../utils/readConfig");
module.exports = async (projectId) => {
    const { spinner, browser, page } = await createBrowser();
    const config = JSON.parse(readConfig());
    const list = config.list;
    let phoneNumber,password;
    list.forEach((item) => {
        if (+item.id === +projectId) {
            phoneNumber = item.phoneNumber;
            password = item.password
        }
    });
    spinner.succeed(chalk.green("打开浏览器"));
    spinner.start(chalk.blue("进入登录页"));

    const iconfontLoginUrl = "https://www.iconfont.cn/login";
    await page.goto(iconfontLoginUrl, {
        waitUntil: "networkidle0",
    });
    spinner.succeed(chalk.green("进入登录页"));
    spinner.start(chalk.blue("输入账号"));

    await page.type("#userid", phoneNumber, {
        delay: 50,
    });
    spinner.succeed(chalk.green("输入账号"));
    spinner.start(chalk.blue("输入密码"));

    await page.type("#password", password, {
        delay: 50,
    });
    spinner.succeed(chalk.green("输入密码"));
    await page.click(".mx-btn-submit");
    // await page.keyboard.press('Enter');// 回车也可以

    spinner.start(chalk.blue("登录"));
    await page.waitForNavigation(); //等待登录跳转，直到导航完成  *******这里必须等待
    spinner.succeed(chalk.green("登录"));

    // 图标库地址
    const libUrl =
        "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=";
    // 图标库ID
    spinner.succeed(chalk.green("跳转图标库"));
    // 登录完成跳转图标库ID对应的图标库
    spinner.start(chalk.blue(`打开ID ${projectId} 图标库`));

    await page.goto(libUrl + projectId, {
        waitUntil: "networkidle0",
    });
    spinner.succeed(chalk.green(`打开ID ${projectId} 图标库`));

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
        behavior: "allow", //允许下载请求
        downloadPath: path.join(__dirname, "/public/static"), //设置下载路径，必须为绝对路径，不然报错
    });
    spinner.start(chalk.blue("下载图标库"));
    // 这里不知为啥必须要点两次下载，我猜是页面有些弹窗提示，点击第一次只是触发弹窗关闭，第二次才是下载操作
    await page.click(
        ".project-manage-bar .bar-text.btn.btn-normal.btn-group-item"
    );
    await page.click(
        ".project-manage-bar .bar-text.btn.btn-normal.btn-group-item"
    );
    // 轮询查找文件是否下载成功
    const startDate = Date.now();
    const zipPath = path.join(__dirname, "/public/static/download.zip");
    while (!fs.existsSync(zipPath)) {
        // 等一秒钟
        await page.waitForTimeout(1000);
        // 循环过程如果当前时间减去开始时间大于30000 ，30秒，就提示超时
        if (Date.now() - startDate >= 30000) {
            spinner.fail(chalk.red("图标库下载失败！"));
            throw new Error("下载超时");
        }
    }
    spinner.succeed(chalk.green("下载图标库"));
    // 开始解压
    spinner.start(chalk.blue("解压zip"));
    await compressing.zip.uncompress(
        path.join(__dirname, "/public/static/download.zip"),
        path.join(__dirname, "/public/static/")
    );
    spinner.succeed(chalk.green("解压zip"));

    spinner.start(chalk.blue("删除download.zip"));
    // 删除ZIP
    const isExistZip = fs.existsSync(
        path.join(__dirname, "/public/static/download.zip")
    );
    if (isExistZip) {
        //删除zip文件
        fs.unlinkSync(path.join(__dirname, "/public/static/download.zip"));
        spinner.succeed(chalk.green("删除download.zip"));
    }
    // 先判断是否存在，不存在就先新建
    const isexist = fs.existsSync(
        path.join(__dirname, "/public/static/newFont")
    );
    if (!isexist) {
        fs.mkdirSync(path.join(__dirname, "/public/static/newFont"));
    }
    spinner.start(chalk.blue("删除旧的newFont文件夹"));
    // 删除旧的newFont，直接删会报错，得先删内部文件
    const files = fs.readdirSync(
        path.join(__dirname, "/public/static/newFont")
    );
    files.forEach((file) => {
        fs.unlinkSync(path.join(__dirname, "/public/static/newFont", file));
    });
    fs.rmdirSync(path.join(__dirname, "/public/static/newFont"));
    spinner.succeed(chalk.green("删除旧的newFont文件夹"));

    spinner.start(chalk.blue("重命名文件夹"));
    const dir = fs.readdirSync(path.join(__dirname, "/public/static/"));
    dir.forEach((dir) => {
        if (dir.startsWith("font_")) {
            fs.renameSync(
                path.join(__dirname, "/public/static/", dir),
                path.join(__dirname, "/public/static/", "newFont")
            );
        }
    });
    spinner.succeed(chalk.green("重命名文件夹"));
    spinner.start(chalk.blue("关闭浏览器"));
    await page.close();
    await browser.close();
    spinner.succeed(chalk.green("关闭浏览器"));
    spinner.succeed(chalk.bold("图标库更新完成🚀🚀🚀"));
};