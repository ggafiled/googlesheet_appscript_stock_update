const { replyMessage } = require('../functions/LineBot');

function cmdTerraUpdate() {
  global.calSummary();
}

async function findCriticalProducts() {
  let productList = '';
  const store = SpreadsheetApp.getActive().getSheetByName('Summary');
  const document = store.getRange(`B4:Q${store.getLastRow()}`).getValues();

  await document.forEach((row) => {
    if (Number(row[8]) < Number(row[4]) && String(row[0]).trim() !== '') {
      productList = `${productList + row[0]}\n`;
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
    `*ตอบกลับ:* terra 🍟 ทำการเช็คจำนวนคงเหลือที่คลังแล้วค่ะ \n รายการอุปกรณ์ที่กำลังวิกฤต มีดังต่อไปนี้. \n${productList}`
  );
}

const doPost = (e) => {
  Logger.log('[doPost()] : starting function.');
  const data = JSON.parse(e.postData.contents);
  Logger.log(`[doPost()] after starting function: ${JSON.stringify(data)}`);

  let lineTextdata = data.events[0].message.text;
  Logger.log(`[doPost()] extract body data: ${lineTextdata}`);

  lineTextdata = lineTextdata.trim().split(' ');

  if (lineTextdata[0].toLowerCase() === 'terra') {
    Logger.log('[doPost()] : it in terra command. ');
    switch (lineTextdata[1].toLowerCase()) {
      case 'update':
        Logger.log('[doPost()] : switch case [update] it working.');
        replyMessage(data.events[0].replyToken, '*ตอบกลับ:* terra 🍤 กำลังทำการอัพเดตสต็อคให้ค่ะ.');
        cmdTerraUpdate();
        break;
      case 'critical':
        Logger.log('[doPost()] : switch case [critical] it working.');
        cmdTerraCritical(data.events[0].replyToken);
        break;
      default:
        Logger.log('[doPost()] : switch case [default] it working.');
        break;
    }
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'ok',
      })
    ).setMimeType(ContentService.JSON);
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
