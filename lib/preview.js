const { exec } = require("child_process");
const { getPreviewInput } = require("../utils/getUserInput");
const preview = async () => {
    const previewLocalPath = await getPreviewInput();
    console.log(previewLocalPath);
    exec("start " + previewLocalPath);
};
module.exports = preview;
