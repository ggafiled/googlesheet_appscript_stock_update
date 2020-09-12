const DOCUMENTS = {
    QUINTUS: 'Quintus',
    CHANGWATTANA: 'Changwattana'
};

function calSummary() {
    var howManyTimeUseToUpdate = 0;
    var time = new Date();
    var timeStamp = time.getTime();
    var currentRow = 4;
    var store = SpreadsheetApp.getActive().getSheetByName("Summary");
    var document = store.getRange("B4:Q" + store.getLastRow()).getValues();

    // ดึงชีท Quintus ช่องที่ B4:C แถวสุดท้ายมาเก็บไว้ก่อนส่งไปลูป
    var storeQuintus = SpreadsheetApp.getActive().getSheetByName(DOCUMENTS.QUINTUS);
    var documentQuintus = storeQuintus.getRange("B4:C" + storeQuintus.getLastRow()).getValues();

    // ดึงชีท Changwattana ช่องที่ B4:C แถวสุดท้ายมาเก็บไว้ก่อนส่งไปลูป
    var storeChangwattana = SpreadsheetApp.getActive().getSheetByName(DOCUMENTS.CHANGWATTANA);
    var documentChangwattana = storeChangwattana.getRange("B4:C" + storeChangwattana.getLastRow()).getValues();

    document.forEach((row) => {
        var total = row[5] + row[6];
        store.getRange(currentRow, 6).setValue(total);

        // ไปหาค้นหาชื่อสินค้า แล้ว sum ของ Changwattana จำนวน 
        Logger.log("[sumProductInventoryByName()] : Changwattana Case.");
        store.getRange(currentRow, 11).setValue(sumProductInventoryByName(documentChangwattana, String(row[0]).trim()));

        // ไปหาค้นหาชื่อสินค้า แล้ว sum ของ Quintus จำนวน 
        Logger.log("[sumProductInventoryByName()] : Quintus Case.");
        store.getRange(currentRow, 12).setValue(sumProductInventoryByName(documentQuintus, String(row[0]).trim()));

        // เอา // ออกถ้าจะให้คำนวณแถว J เอง โดยไม่ใช้สูตร แต่จะทำให้ใช้เวลา เป็นนาทีในการรัน
        //store.getRange(currentRow, 10).setValue(Number(store.getRange(currentRow, 11).getValue()) + Number(store.getRange(currentRow, 12).getValue()));

        Logger.log("[calSummary()] : " + total);
        currentRow++;
    });
    var finishtime = new Date();
    howManyTimeUseToUpdate = Math.round((finishtime - time) / 1000);
    setDataToStore("B4", howManyTimeUseToUpdate); // บันทึกระยะเวลาที่ใช้อัพเดตข้อมูล
    Logger.log("[calSummary()] : starting function.");
    Logger.log("[calSummary()] : set active user handle btnUpdate button by " + Session.getEffectiveUser().getEmail() + " .");
    setDataToStore("B1", Session.getEffectiveUser().getEmail()); // บุคคลที่ทำการอัพเดตข้อมูลล่าสุด
    setDataToStore("B2", new Date(timeStamp).toLocaleDateString("th-TH", "d/M/Y")); // วันที่ที่อัพเดตข้อมูลล่าสุด
    setDataToStore("B3", new Date(timeStamp).toLocaleTimeString("th-TH", "HH:MM:ss")); // เวลาที่อัพเดตข้อมูลล่าสุด
}

/*- ฟังก์ชั่นนี้จะทำการลูปเช็คแต่ละบรรทัดว่ามีค่าเท่ากับ ชื่อสินค้าที่จะให้ sum ไหม ถ้าชื่ออันเดียวกันให้บวกรวมไปเรื่อยๆ จนถึงบรรทัดสุดท้าย และ ส่งค่า sum กลับออกไป -*/
function sumProductInventoryByName(document, keyword) {
    let sum = 0;

    document.forEach((row) => {
        if (String(row[0]).trim() == keyword) {
            sum = sum + Number(row[1]);
        }
    });

    return sum;
}

/*- createCustomUi: This function non-argument requried . It's will show custom menu on ribbon.-*/
function createCustomUi() { // โค้ดสร้างปุ่มในแถบ Ribbon
    var ui = SpreadsheetApp.getUi(); // เรียกตัวสร้างออกมา
    var menu = ui.createMenu("กลุ่มคำสั่งอัพเดตสต็อค"); // ตั้งชื่อปุ่ม
    var item = menu.addItem("เรียกหน้าจออัพเดต", "showUpdateForm"); // ตั้งชื่อฟังก์ชั่น และใส่ชื่อฟังก์ชั่นที่พอกดแล้วจะให้ทำงาน showUpdateForm <-- นี่คือฟังก์ชั่นที่โชว์ Pop up ขึ้นมา
    item.addToUi(); // เพิ่มลง Ui
    var item2 = menu.addItem("อัพเดตข้อมูล", "calSummary"); // ตั้งชื่อฟังก์ชั่น และใส่ชื่อฟังก์ชั่นที่พอกดแล้วจะให้ทำงาน showUpdateForm <-- นี่คือฟังก์ชั่นที่โชว์ Pop up ขึ้นมา
    item2.addToUi(); // เพิ่มลง Ui
}

/*- showUpdateForm: This function non-argument requried. It's will return GUI for Command dialog.-*/
function showUpdateForm() {
    Logger.log("[showUpdateForm()] : starting function.");
    var template = HtmlService.createTemplateFromFile("UpdateStock");

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

    html = template.evaluate();
    html.setTitle("หน้าจอพื้นที่กลุ่มคำสั่ง");
    Logger.log("[showUpdateForm()] : shown dialogbox.");
    SpreadsheetApp.getUi().showModelessDialog(html, "หน้าจอพื้นที่กลุ่มคำสั่ง");
    Logger.log("[showUpdateForm()] : load template finished.");
}

/*- getDataFromRange: This function 3 argument requried (sheet : sheet name, range : range data in sheet wanna store data, 
value : the value you wanna to store in sheet). It's not return.-*/
function setDataToStore(range, value) {
    SpreadsheetApp.getActive().getSheetByName("StoreData").getRange(range).setValue(value);
}

/*- getDataFromRange: This function 2 argument requried (sheet : sheet name, range : range data in sheet wanna get it). It's will return range data.-*/
function getDataFromRange(sheetname, range) {
    return SpreadsheetApp.getActive().getSheetByName(sheetname).getRange(range).getValue();
}

/*- isEmpty: This function 1 argument requried (text : that wanna check is emtry or null). It's will return True or False.-*/
function isEmpty(text) {
    return text === '' ? true : false;
}