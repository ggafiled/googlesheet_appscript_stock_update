import { doPost, doGet } from './server/webapp';
import { calSummary, showUpdateForm } from './functions/StockManagement';
import { filterByValue } from './functions/utils';

// eslint-disable-next-line no-global-assign
Logger = BetterLog.useSpreadsheet(
  PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEET_ID').toString()
);
Tamotsu.initialize();

global.doPost = doPost;
global.doGet = doGet;

global.calSummary = calSummary;
global.showUpdateForm = showUpdateForm;
global.filterByValue = filterByValue;

/* - createCustomUi: This function non-argument requried . It's will show custom menu on ribbon.-*/
global.createCustomUi = () => {
  // โค้ดสร้างปุ่มในแถบ Ribbon
  const ui = SpreadsheetApp.getUi(); // เรียกตัวสร้างออกมา
  const menu = ui.createMenu('กลุ่มคำสั่งอัพเดตสต็อค'); // ตั้งชื่อปุ่ม
  const item = menu.addItem('เรียกหน้าจออัพเดต', 'showUpdateForm'); // ตั้งชื่อฟังก์ชั่น และใส่ชื่อฟังก์ชั่นที่พอกดแล้วจะให้ทำงาน showUpdateForm <-- นี่คือฟังก์ชั่นที่โชว์ Pop up ขึ้นมา
  item.addToUi(); // เพิ่มลง Ui
  const item2 = menu.addItem('อัพเดตข้อมูล', 'calSummary'); // ตั้งชื่อฟังก์ชั่น และใส่ชื่อฟังก์ชั่นที่พอกดแล้วจะให้ทำงาน showUpdateForm <-- นี่คือฟังก์ชั่นที่โชว์ Pop up ขึ้นมา
  item2.addToUi(); // เพิ่มลง Ui
};
