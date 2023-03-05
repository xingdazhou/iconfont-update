const { exec } = require("child_process");
const { getPreviewInput } = require("../utils/getUserInput");
const preview = async () => {
    const previewLocalPath = await getPreviewInput();
    console.log(previewLocalPath);
    // Windows
    exec("start " + previewLocalPath);
    // // Mac
    // exec('open https://www.google.com')
    // // Otherwise: https://portland.freedesktop.org/doc/xdg-open.html
    // exec('xdg-open https://www.google.com')
};
module.exports = preview;
