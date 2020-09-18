const {
    getDataFromRange,
    setDataToStore,
    isEmpty
} = require("./utils.js");

const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify';
const LINE_MESSAGE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply';
const LINE_NOTIFY_TOKEN = getDataFromRange("StoreData", "B5");
const LINE_CHANEL_ACCESS_TOKEN = 'nauWk1Gl7j1ciytz48ceFtcyNqPkp99Yr004Xg/qmiHVvuiUE4hBAbUH87Mi6hwyvcIVDvTovduIGO84+9/tU/fbruxmjoFozEtOkqT7JyDAlgvQM3+0fZZfhFWvsDgY43zsyAcq790EBAPlsU02EwdB04t89/1O/w1cDnyilFU=';

function sendLineNotify() {

    if (String(LINE_NOTIFY_TOKEN).trim() == "") {
        Logger.log("[sendLineNotify()] : empty line token.");
        return;
    }

    Logger.log("[sendLineNotify()] : starting function.");
    var formData = {
        "message": "ทำการอัพเดตสต็อคสินค้าเรียบร้อยแล้ว\n" +
            "เริ่มต้นเมื่อ: " + Utilities.formatDate(getDataFromRange("StoreData", "B2"), "GMT+7", "d MMMM Y") + " " + new Date(getDataFromRange("StoreData", "B3")).toLocaleTimeString("th-TH", "HH:MM:ss") + "\n" +
            "ใช้เวลา " + getDataFromRange("StoreData", "B4") + " วินาที\n" +
            "บุคคลกระทำการ: " + getDataFromRange("StoreData", "B1")
    };
    var options = {
        'method': 'post',
        'contentType': 'application/x-www-form-urlencoded',
        "headers": {
            "Authorization": "Bearer " + LINE_NOTIFY_TOKEN,
        },
        'payload': formData
    };

    let response = UrlFetchApp.fetch(LINE_NOTIFY_URL, options);
    Logger.log("[sendLineNotify()] : response: " + response);
}

function replyMessage(replytoken, replyText) {
    var lineHeader = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + LINE_CHANEL_ACCESS_TOKEN
    };

    var postData = {
        "replyToken": replytoken,
        "messages": [{
            "type": "text",
            "text": replyText
        }]
    };

    var options = {
        "method": "POST",
        "headers": lineHeader,
        "payload": JSON.stringify(postData)
    };

    try {
        var response = UrlFetchApp.fetch(LINE_MESSAGE_REPLY_URL, options);
    } catch (error) {
        Logger.log(error.name + "：" + error.message);
        return;
    }

    if (response.getResponseCode() === 200) {
        Logger.log("Sending message completed.");
    }
}



export {
    sendLineNotify,
    replyMessage
};