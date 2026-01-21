import QRCode from "qrcode";
import os from "os";
import path from "path";

import shell_tool from "./shell_tool.js";

export default async function generateQRCode(content) {

    const fileDir = path.join(os.homedir(), "Downloads", "Pictures", "QRcodes");
    await shell_tool(`mkdir -p ${fileDir}`);

    const filePath = path.join(fileDir, `qrcode_${Date.now()}.png`);

    await QRCode.toFile(filePath, content, {
        type: "png",
        width: 300,
        margin: 2,
    });

    return filePath;
}
