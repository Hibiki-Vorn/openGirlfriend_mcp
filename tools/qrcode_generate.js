import QRCode from "qrcode";

export default (content) => QRCode.toDataURL(content).then((url) => url)