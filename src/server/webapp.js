const { replyMessage, MESSAGE_TYPE } = require('../functions/LineBot');

function cmdTerraUpdate(replyToken) {
  Logger.log('[cmdTerraUpdate()] : starting function.');
  replyMessage(replyToken, '*ตอบกลับ:* terra 🍤 กำลังทำการอัพเดตสต็อคให้ค่ะ.', MESSAGE_TYPE.NORMAL);
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
    `*ตอบกลับ:* terra 🍟 ทำการเช็คจำนวนคงเหลือที่คลังแล้วค่ะ \n รายการอุปกรณ์ที่กำลังวิกฤต มีดังต่อไปนี้. ${productList}`,
    MESSAGE_TYPE.NORMAL
  );
}

function introduceBot(replyToken) {
  const items = [
    {
      type: 'action', // ③
      imageUrl:
        'https://drive.google.com/u/0/uc?id=1Esh6B3nTrV6l_tX0M5FzVRg8qXfRYIfp&export=download',
      action: {
        type: 'message',
        label: 'อัพเดตสต็อค',
        text: 'terra update',
      },
    },
    {
      type: 'action',
      imageUrl:
        'https://drive.google.com/u/0/uc?id=13IybdWJ7aKNxKMbDZX2Kbt7O6hnuxAXT&export=download',
      action: {
        type: 'message',
        label: 'ดูสินค้าที่มีจำนวนวิกฤต',
        text: 'terra critical',
      },
    },
  ];
  replyMessage(
    replyToken,
    '🙇‍♀️👩‍💻 ต้องการให้ terra ช่วยเหลืองานไหนเลือกคำสั่งด้านล่างได้เลยค่ะ .',
    MESSAGE_TYPE.QUICKREPLY,
    items
  );
}

const doPost = (e) => {
  Logger.log('[doPost()] : starting function.');
  const data = JSON.parse(e.postData.contents);
  Logger.log(`[doPost()] after starting function: ${JSON.stringify(data)}`);

  const lineTextdatas = data.events[0].message.text;
  Logger.log(`[doPost()] extract body data: ${lineTextdatas}`);

  const lineTextdata = lineTextdatas.trim().split(' ');

  if (lineTextdata.length - 1 >= 1 && lineTextdata[0].toLowerCase() === 'terra') {
    Logger.log(`[doPost()] : it in terra command. ${lineTextdata.length}`);
    if (lineTextdata[1] !== null || lineTextdata[1] !== '') {
      switch (lineTextdata[1].toLowerCase()) {
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
    } else {
      Logger.log('[doPost()] : indexOf terra word it working.');
      introduceBot(data.events[0].replyToken);
    }
  } else if (lineTextdatas.toLowerCase().indexOf('terra') !== -1) {
    Logger.log('[doPost()] : indexOf terra word it working.');
    introduceBot(data.events[0].replyToken);
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'ok',
    })
  ).setMimeType(ContentService.JSON);
};

module.exports = {
  doPost,
};
