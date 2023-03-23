/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-02-27 13:22:59
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-23 09:34:37
 */
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const compressing = require("compressing");
const createBrowser = require("../utils/createBrowser");
const readConfig = require("../utils/readConfig");
const { getUpdateInput } = require("../utils/getUserInput");
module.exports = async () => {
    const { spinner, browser, page } = await createBrowser();
    const updateId = await getUpdateInput();
    const config = JSON.parse(readConfig());
    const list = config.list;
    let phoneNumber, password, updatePath;
    list.forEach((item) => {
        if (+item.id === +updateId) {
            phoneNumber = item.phoneNumber;
            password = item.password;
            updatePath = item.updatePath;
        }
    });
    const pathArr = updatePath.split("/");
    const dirName = pathArr.pop();
    updatePath = pathArr.join("/") + "/";
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

    spinner.start(chalk.blue("登录"));
    await page.waitForNavigation(); //等待登录跳转，直到导航完成  *******这里必须等待
    spinner.succeed(chalk.green("登录"));

    // 图标库地址
    const libUrl =
        "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=";
    // 图标库ID
    spinner.succeed(chalk.green("跳转图标库"));
    // 登录完成跳转图标库ID对应的图标库
    spinner.start(chalk.blue(`打开ID ${updateId} 图标库`));

    await page.goto(libUrl + updateId, {
        waitUntil: "networkidle0",
    });
    spinner.succeed(chalk.green(`打开ID ${updateId} 图标库`));

    const client = await page.target().createCDPSession();
    await client.send("Page.setDownloadBehavior", {
        behavior: "allow", //允许下载请求
        downloadPath: path.join(process.cwd(), updatePath), //设置下载路径，必须为绝对路径，不然报错
    });
    spinner.start(chalk.blue("下载图标库"));
    await page.click(
        ".project-manage-bar .bar-text.btn.btn-normal.btn-group-item"
    );
    await page.click(
        ".project-manage-bar .bar-text.btn.btn-normal.btn-group-item"
    );
    // 轮询查找文件是否下载成功
    const startDate = Date.now();
    const zipPath = path.join(process.cwd(), updatePath + "download.zip");
    while (!fs.existsSync(zipPath)) {
        await page.waitFor(1000);
        if (Date.now() - startDate >= 30000) {
            spinner.fail(chalk.red("图标库下载失败！"));
            throw new Error("下载超时");
        }
    }
    spinner.succeed(chalk.green("下载图标库"));
    // 开始解压
    spinner.start(chalk.blue("解压zip"));
    await compressing.zip.uncompress(
        path.join(process.cwd(), updatePath + "download.zip"),
        path.join(process.cwd(), updatePath)
    );
    spinner.succeed(chalk.green("解压zip"));
    spinner.start(chalk.blue("删除download.zip"));
    const isExistZip = fs.existsSync(
        path.join(process.cwd(), updatePath + "download.zip")
    );
    if (isExistZip) {
        fs.unlinkSync(path.join(process.cwd(), updatePath + "download.zip"));
        spinner.succeed(chalk.green("删除download.zip"));
    }
    const isexist = fs.existsSync(
        path.join(process.cwd(), updatePath + dirName)
    );
    if (!isexist) {
        fs.mkdirSync(path.join(process.cwd(), updatePath + dirName));
    }
    spinner.start(chalk.blue(`删除旧的 ${chalk.red(dirName)} 文件夹`));
    const files = fs.readdirSync(
        path.join(process.cwd(), updatePath + dirName)
    );
    files.forEach((file) => {
        fs.unlinkSync(path.join(process.cwd(), updatePath + dirName, file));
    });
    fs.rmdirSync(path.join(process.cwd(), updatePath + dirName));
    spinner.succeed(chalk.green(`删除旧的 ${chalk.red(dirName)} 文件夹`));

    spinner.start(chalk.blue("重命名文件夹"));
    const dir = fs.readdirSync(path.join(process.cwd(), updatePath));
    dir.forEach((dir) => {
        if (dir.startsWith("font_")) {
            fs.renameSync(
                path.join(process.cwd(), updatePath, dir),
                path.join(process.cwd(), updatePath, dirName)
            );
        }
    });
    if (updateId == "1475975") {
        let fileText = fs.readFileSync(
            path.join(process.cwd(), updatePath, dirName + "/iconfont.css"),
            "utf8"
        );
        const reg = /font-size: (16)px/g;
        if (reg.test(fileText)) {
            fileText = fileText.replace(reg, ($0, $1) => {
                return $0.replace($1, 20);
            });
        }
        fs.writeFileSync(
            path.join(process.cwd(), updatePath, dirName + "/iconfont.css"),
            fileText
        );
    }
    let demo_html = fs.readFileSync(
        path.join(process.cwd(), updatePath, dirName + "/demo_index.html"),
        "utf8"
    );
    const reg1 = /(\<\/style\>)/g;
    if (reg1.test(demo_html)) {
        demo_html = demo_html.replace(reg1, ($0, $1) => {
            return $0.replace(
                $1,
                $0 +
                    `\n  <style>
                    .code-name {
                      user-select: all;
                      transition: .3s;
                    }
                
                    .code-name:hover {
                      font-size: 18px;
                    }
                  </style>
                  <script>
                    document.addEventListener('click', function (e) {
                      if (e.target.className == 'code-name') {
                        var value = document.execCommand('copy')
                      }
                    })
                    document.addEventListener('copy', async (e) => {
                      e.preventDefault();
                      if (e.target.className == 'code-name') {
                        var reg = /^(.)/g
                        e.clipboardData.setData('text/plain', e.target.innerText.replace(reg, ''))
                      }
                    });
                  </script>`
            );
        });
    }
    fs.writeFileSync(
        path.join(process.cwd(), updatePath, dirName + "/demo_index.html"),
        demo_html
    );
    spinner.succeed(chalk.green("重命名文件夹"));
    spinner.start(chalk.blue("关闭浏览器"));
    await page.close();
    await browser.close();
    spinner.succeed(chalk.green("关闭浏览器"));
    spinner.succeed(chalk.bold("图标库更新完成🚀🚀🚀"));
};
