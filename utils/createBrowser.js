/*
 * @Descripttion:
 * @version:
 * @Author: zhouxd
 * @Date: 2023-03-03 09:59:17
 * @LastEditors: zhouxd
 * @LastEditTime: 2023-03-04 02:43:12
 */
const puppeteer = require("puppeteer");
const ora = require("ora");

const createBrowser = async () => {
    const spinner = ora({
        spinner: {
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        },
    });
    const timeout = 30000;
    const browser = await puppeteer.launch({
        headless: true,
        timeout,
        defaultViewport: null,
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
        ],
    }); //去除自动化测试的提醒
    const page = await browser.newPage();
    return { spinner, browser, page };
};
module.exports = createBrowser;
