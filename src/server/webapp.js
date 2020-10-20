const { render } = require('../functions/utils');
const { replyMessage, MESSAGE_TYPE } = require('../functions/LineBot');

const Route = {};
Route.path = function(routeName, callback) {
    Route[routeName] = callback;
};

function loadUi() {
    return render('index', {
        title: '- 🕵️‍♀️ Project List -',
    });
}

function cmdTerraUpdate(replyToken) {
    Logger.log('[cmdfmstockUpdate()] : starting function.');
    replyMessage(replyToken, 'กำลังทำการอัพเดตสต็อคให้ค่ะ.', MESSAGE_TYPE.NORMAL);
    global.calSummary();
}

async function findCriticalProducts() {
    let productList = '';
    const store = SpreadsheetApp.getActive().getSheetByName('Summary');
    const document = store.getRange(`B4:Q${store.getLastRow()}`).getValues();

    await document.forEach((row, index) => {
        if (Number(row[8]) < Number(row[4]) && String(row[0]).trim() !== '') {
            if (index !== document.length - 1) productList += '\n';
            productList += row[0];
        }
    });

    return productList;
}

async function cmdTerraCritical(replyToken) {
    Logger.log('[cmdTerraCritical()] : starting function.');
    const productList = await findCriticalProducts();
    Logger.log(`[cmdTerraCritical()] : Model ${JSON.stringify(productList)}`);
    replyMessage(
        replyToken,
        ` botStock กำลังทำการเช็คจำนวนคงเหลือที่คลังแล้วค่ะ \n รายการอุปกรณ์ที่กำลังวิกฤต มีดังต่อไปนี้. ${productList}`,
        MESSAGE_TYPE.NORMAL
    );
}

function introduceBot(replyToken) {
    const items = [{
            type: 'action', // ③
            imageUrl: 'https://drive.google.com/u/0/uc?id=1Esh6B3nTrV6l_tX0M5FzVRg8qXfRYIfp&export=download',
            action: {
                type: 'message',
                label: 'อัพเดตสต็อค',
                text: 'fmstock update',
            },
        },
        {
            type: 'action',
            imageUrl: 'https://drive.google.com/u/0/uc?id=13IybdWJ7aKNxKMbDZX2Kbt7O6hnuxAXT&export=download',
            action: {
                type: 'message',
                label: 'ดูสินค้าที่มีจำนวนวิกฤต',
                text: 'fmstock critical',
            },
        },
    ];
    replyMessage(
        replyToken,
        '🙇‍♀️👩‍💻 ต้องการให้ botStock ช่วยเหลืองานไหนเลือกคำสั่งด้านล่างได้เลยค่ะ .',
        MESSAGE_TYPE.QUICKREPLY,
        items
    );
}

const doPost = (e) => {
    const fmCommandRegex = new RegExp(
        /^(\bFM Stock\b)[\s]*([ก-๏a-zA-Z 0-9$&+,:;=?@#|'<>.^*()%!-/\\/]+)/i
    );
    Logger.log('[doPost()] : starting function.');
    const data = JSON.parse(e.postData.contents);
    Logger.log(`[doPost()] after starting function: ${JSON.stringify(data)}`);

    const lineTextdatas = data.events[0].message.text;
    Logger.log(`[doPost()] extract body data: ${lineTextdatas}`);

    const messages = data.events[0].message.text;
    Logger.log(`[doPost()] messages: ${messages}`);

    if (fmCommandRegex.test(messages.trim())) {
        Logger.log(`[doPost()] fmCommandRegex.text : ${fmCommandRegex.test(messages.trim())}`);
        Logger.log(`[doPost()] fmCommandRegex ${messages.trim().match(fmCommandRegex)}`);
        switch (messages.trim().match(fmCommandRegex)[2].toLowerCase()) {
            case 'search':
                Logger.log(`[doPost()] List:`);
                replyMessage(
                    data.events[0].replyToken,
                    'https://script.google.com/macros/s/AKfycbyqT1HcTwymPi9yfjzAe8ZaPG_rHdoum8rNYw_M6i9wGH3B_jDd/exec?v=project-list',
                    MESSAGE_TYPE.NORMAL
                );
                break;
            case 'update':
                Logger.log('[doPost()] : switch case [update] it working.');
                cmdTerraUpdate(data.events[0].replyToken);
                break;
            case 'critical':
                Logger.log('[doPost()] : switch case [critical] it working.');
                cmdTerraCritical(data.events[0].replyToken);
                break;
            default:
                Logger.log('[doPost()] : switch case [default] it working.');
                break;
        }
    } else if (lineTextdatas.toLowerCase().indexOf('fmstock') !== -1) {
        Logger.log('[doPost()] : indexOf terra word it working.');
        introduceBot(data.events[0].replyToken);
    }

    return ContentService.createTextOutput(
        JSON.stringify({
            status: 'ok',
        })
    ).setMimeType(ContentService.JSON);
};

const doGet = (e) => {
    Route.path('project-list', loadUi);
    if (Route[e.parameters.v]) {
        return Route[e.parameters.v]();
    }
    return render('404');
};

module.exports = {
    doGet,
    doPost,
};