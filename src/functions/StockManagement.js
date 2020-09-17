var path = require('path');
const {
    getDataFromRange,
    setDataToStore,
    isEmpty
} = require("./utils.js");
const {
    sendLineNotify
} = require("./LineBot.js");

/*- ประกาศชื่อชีทด้วยฟอร์แมต คีย์:แวลู่ เพื่อเก็บชื่อสเปรตชีทที่จะใช้ทำงานให้มีรูปแบบเป็นทางการ ตั้งชื่อตัวแปรว่า DOCUMENTS ปัจจุบันมีค่าในตัวแปรอยู่ 2 ค่าคือ QUINTUS กับ CHANGWATTANA -*/
const DOCUMENTS = {
    QUINTUS: 'Quintus',
    CHANGWATTANA: 'Changwattana'
};

/*- ฟังก์ชัน calSummary เป็นฟังก์ชันที่ไม่รับ พารามิเตอร์ ใดๆเข้ามา ฟังก์ชันนสร้างขึ้นเพื่อใช้คำนวณหาผลรวมของยอดคงเหลือในแต่ละรายการสินค้า -*/
const calSummary = () => {
    Logger.log("[calSummary()] : starting function.");
    var howManyTimeUseToUpdate = 0;
    var time = new Date();
    var timeStamp = time.getTime();
    var currentRow = 4;
    var store = SpreadsheetApp.getActive().getSheetByName("Summary");

    // ดึงชีท Summary ช่องที่ B4:C แถวสุดท้ายมาเก็บไว้ก่อนส่งไปลูป
    var document = store.getRange("B4:Q" + store.getLastRow()).getValues();

    // ดึงชีท Quintus (DOCUMENTS.QUINTUS) ช่องที่ B4:C แถวสุดท้ายมาเก็บไว้ก่อนส่งไปลูป
    var storeQuintus = SpreadsheetApp.getActive().getSheetByName(DOCUMENTS.QUINTUS);
    var documentQuintus = storeQuintus.getRange("B4:C" + storeQuintus.getLastRow()).getValues();

    // ดึงชีท Changwattana (DOCUMENTS.CHANGWATTANA) ช่องที่ B4:C แถวสุดท้ายมาเก็บไว้ก่อนส่งไปลูป
    var storeChangwattana = SpreadsheetApp.getActive().getSheetByName(DOCUMENTS.CHANGWATTANA);
    var documentChangwattana = storeChangwattana.getRange("B4:C" + storeChangwattana.getLastRow()).getValues();

    // ลูปค่าที่เก็บมาจากชีท Summary 
    document.forEach((row) => {
        // บวกค่าของแต่ละแถวจากคอลัมน์ G และ H จากนั้นนำค่าไปเก็บไว้ที่ตัวแปร total
        var total = row[5] + row[6];
        // นำค่าจากตัวแปร total ไปใส่ใน คอลัมน์ที่ 6 ของแต่ละแถว
        store.getRange(currentRow, 6).setValue(total);

        /*- ไปหาค้นหาชื่อสินค้า แล้ว sum ของ Changwattana จำนวน 
            sumProductInventoryByName(documentChangwattana, String(row[0]).trim()) เป็นการส่งค่าไปให้ฟังก์ชันคำนวณหาค่าผลรวมของยอดคงเหลือสินค้า
            documentChangwattana : เป็นอาร์เรยที่จัดเก็บค่าของชีท Changwattana 
            row[0] : เป็นการเข้าถึงข้อมูลในอาร์เรย์ตำแหน่งที่ 0 ซึ่งก็คือชื่อสินค้าที่ได้มาจากสเปรตชีท Summary
            String() : เป็นการ Convert ค่าในตัวแปร row[0] ให้เป็นชนิดข้อความเพื่อจะเรียกใช้ฟังก์ชัน trim() เพื่อตัวช่องว่างหัวและท้ายของประโยคออก เหตุผลที่ต้องตัดเพราะเวลาลูปค่าถ้าสายตาคนมองคนเหมือนกันคืออันเดียวกัน
                       แต่ในมองมุมคอมพิวเตอร์ หากประโยคเดียวกันแต่มีช่องว่างต่อท้ายประโยค ก็จะถูกคิดว่าเป็นคนละประโยคกัน.
        -*/
        store.getRange(currentRow, 11).setValue(sumProductInventoryByName(documentChangwattana, String(row[0]).trim()));

        /*- ไปหาค้นหาชื่อสินค้า แล้ว sum ของ Quintus จำนวน 
            sumProductInventoryByName(documentQuintus, String(row[0]).trim()) เป็นการส่งค่าไปให้ฟังก์ชันคำนวณหาค่าผลรวมของยอดคงเหลือสินค้า
            documentChangwattana : เป็นอาร์เรยที่จัดเก็บค่าของชีท Changwattana 
            row[0] : เป็นการเข้าถึงข้อมูลในอาร์เรย์ตำแหน่งที่ 0 ซึ่งก็คือชื่อสินค้าที่ได้มาจากสเปรตชีท Summary
            String() : เป็นการ Convert ค่าในตัวแปร row[0] ให้เป็นชนิดข้อความเพื่อจะเรียกใช้ฟังก์ชัน trim() เพื่อตัวช่องว่างหัวและท้ายของประโยคออก เหตุผลที่ต้องตัดเพราะเวลาลูปค่าถ้าสายตาคนมองคนเหมือนกันคืออันเดียวกัน
                       แต่ในมองมุมคอมพิวเตอร์ หากประโยคเดียวกันแต่มีช่องว่างต่อท้ายประโยค ก็จะถูกคิดว่าเป็นคนละประโยคกัน.
        -*/
        store.getRange(currentRow, 12).setValue(sumProductInventoryByName(documentQuintus, String(row[0]).trim()));

        // *** เอา // ออกถ้าจะให้คำนวณแถว J เอง โดยไม่ใช้สูตร แต่จะทำให้ใช้เวลา เป็นนาทีในการรัน
        //store.getRange(currentRow, 10).setValue(Number(store.getRange(currentRow, 11).getValue()) + Number(store.getRange(currentRow, 12).getValue()));
        currentRow++;
    });

    var finishtime = new Date();
    howManyTimeUseToUpdate = Math.round((finishtime - time) / 1000);
    setDataToStore("B4", howManyTimeUseToUpdate); // บันทึกระยะเวลาที่ใช้อัพเดตข้อมูล
    Logger.log("[calSummary()] : set active user handle btnUpdate button by " + Session.getEffectiveUser().getEmail() + " .");
    setDataToStore("B1", Session.getEffectiveUser().getEmail()); // บุคคลที่ทำการอัพเดตข้อมูลล่าสุด
    setDataToStore("B2", new Date(timeStamp).toLocaleDateString("th-TH", "d/M/Y")); // วันที่ที่อัพเดตข้อมูลล่าสุด
    setDataToStore("B3", new Date(timeStamp).toLocaleTimeString("th-TH", "HH:MM:ss")); // เวลาที่อัพเดตข้อมูลล่าสุด
    var store = SpreadsheetApp.getActive().getSheetByName("StoreData");
    var storeLastRow = store.getLastRow();
    sendLineNotify();
    store.getRange(storeLastRow + 1, 1, 1, 2).setValue([Session.getEffectiveUser().getEmail(), new Date(timeStamp).toLocaleDateString("th-TH", "d/M/Y HH:MM:ss")]);
}

/*- ฟังก์ชั่นนี้จะทำการลูปเช็คแต่ละบรรทัดว่ามีค่าเท่ากับ ชื่อสินค้าที่จะให้ sum ไหม ถ้าชื่ออันเดียวกันให้บวกรวมไปเรื่อยๆ จนถึงบรรทัดสุดท้าย และ ส่งค่า sum กลับออกไป -*/
const sumProductInventoryByName = (document, keyword) => {
    let sum = 0;

    document.forEach((row) => {
        if (String(row[0]).trim() == keyword) {
            sum = sum + Number(row[1]);
        }
    });

    return sum;
}

/*- showUpdateForm: This function non-argument requried. It's will return GUI for Command dialog.-*/
const showUpdateForm = () => {
    Logger.log("[showUpdateForm()] : starting function.");
    var template = HtmlService.createTemplateFromFile("UpdateStock.html");

    // บันทึกระยะเวลาที่ใช้อัพเดตข้อมูล
    if (!isEmpty(getDataFromRange("StoreData", "B1"))) {
        template.userEmail = getDataFromRange("StoreData", "B1");
    } else {
        template.userEmail = "ยังไม่มีผู้คนอัพเดตข้อมูล";
    }

    // ดึงวันที่ที่อัพเดตข้อมูลล่าสุด
    if (!isEmpty(getDataFromRange("StoreData", "B2"))) {
        template.lastDateUpdate = Utilities.formatDate(getDataFromRange("StoreData", "B2"), "GMT+7", "d MMMM Y");
    } else {
        template.lastDateUpdate = "ไม่พบการอัพเดตข้อมูล"
    }

    // เวลาที่อัพเดตข้อมูลล่าสุด
    if (!isEmpty(getDataFromRange("StoreData", "B3"))) {
        template.lastTimeUpdate = new Date(getDataFromRange("StoreData", "B3")).toLocaleTimeString("th-TH", "HH:MM:ss");
    } else {
        template.lastTimeUpdate = "ไม่พบการอัพเดตข้อมูล"
    }

    // บันทึกระยะเวลาที่ใช้อัพเดตข้อมูล
    if (!isEmpty(getDataFromRange("StoreData", "B4"))) {
        template.howManyTimeUseToUpdate = getDataFromRange("StoreData", "B4");
    } else {
        template.howManyTimeUseToUpdate = 0;
    }

    var html = template.evaluate();
    html.setTitle("หน้าจอพื้นที่กลุ่มคำสั่ง");
    Logger.log("[showUpdateForm()] : shown dialogbox.");
    SpreadsheetApp.getUi().showModelessDialog(html, "หน้าจอพื้นที่กลุ่มคำสั่ง");
    Logger.log("[showUpdateForm()] : load template finished.");
}

export {
    calSummary,
    showUpdateForm
};