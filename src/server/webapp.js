const { replyMessage } = require('../functions/LineBot');

function cmdTerraUpdate() {
  global.calSummary();
}

function cmdTerraCritical(replyToken, productname) {
  Logger.log('[cmdTerraCritical()] : starting function.');
  const product = productname.trim().split('p:');
  Logger.log(`[cmdTerraCritical()] : product name ${product[1]}`);
  if (product.length > 0) {
    const Quintus = Tamotsu.Table.define({
      sheetName: 'Quintus',
      rowShift: 2,
      columnShift: 0,
    });

    let sum = 0;

    const productAmount = Quintus.where({
      products: product[1],
    })
      .all()
      .forEach((doc) => {
        sum += Number(doc.amount);
      });
    Logger.log(`[cmdTerraCritical()] : Model ${JSON.stringify(productAmount)}`);
    replyMessage(
      replyToken,
      `*ตอบกลับ:* terra 🍟 ทำการเช็คจำนวนที่คลัง Quintus แล้วค่ะ \n รายการอุปกรณ์  [${product[1]}]  มีจำนวนคงเหลือ คือ ${sum} ชิ้น.`
    );
  }
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
        cmdTerraCritical(data.events[0].replyToken, data.events[0].message.text);
        break;
      default:
        Logger.log('[doPost()] : switch case [default] it working.');
        break;
    }
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'ok',
      })
    );
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'ok',
    })
  );
};

module.exports = {
  doPost,
};
