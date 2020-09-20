# Google Apps Script Development 💯

# Google sheet stock with app script (ระบบอัพเดตสต็อคสินค้า)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

ระบบเบิกและจัดสต็อคอุปกรณ์ในคลังบนแพทฟอร์ม google sheet และ app script โดยมีฟังก์ชันการใช้งานตามนี้ Version 1.0.0

  - ระบบสามารถเก็บและระบุบุคคลที่ได้ทำการแก้ไขข้อมูลล่าสุดได้
  - สามารถแสดงหน้าต่างการใช้งานเมื่อเปิดเข้าไฟล์ได้
  - สร้างฟังก์ชัน SumIf ด้วย google app acript เนื่องจากหัวหน้า ไม่ต้องการใช้คำสั่งจาก formura functions
  - แชทบอทสำหรับสั่งเรียกใช้งานฟังก์ชันภายใน google app script มีคำสั่งดังนี้

รูปแบบคำสั่ง | คำอธิบาย
------------ | -------------
terra | หากในบทสนทนามีคำนี้ประกอบด้วย จะเป็นการเรียกบอทซึ่งตัวบอทเองจะตอบกลับ Quick reply รูปแบบคำสั่งกลับมาให้
terra update | เป็นคำสั่งสำหรับเรียกใช้งานฟังก์ชัน สำหรับอัพเดตสต็อค
terra critical | เป็นคำสั่งสำหรับขอรายชื่อสินค้าที่มีจำนวนคงเหลืออยู่ในขั้นวิกฤต 


### Overall
ตัวอย่างภาพหน้าจอการใช้งานระบบงาน ตัวอย่างข้อมูล
![Main Panel UI](https://github.com/ggafiled/googlesheet_appscript_stock_update/blob/master/img/googlesheet_html_appscript_project_check_stock.PNG)
![Main Panel UI](https://github.com/ggafiled/googlesheet_appscript_stock_update/blob/master/img/googlesheet_html_appscript_project_check_stock02.PNG)

ตัวอย่างหน้าจอการใช้งานคำสั่ง Chatbot การใช้งานคำสั่ง `terra update`
![Terra Bot](https://github.com/ggafiled/googlesheet_appscript_stock_update/blob/master/img/terra-bot-01.jpg)
ตัวอย่างหน้าจอการใช้งานคำสั่ง Chatbot การใช้งานคำสั่ง `terra critical`
![Terra Bot](https://github.com/ggafiled/googlesheet_appscript_stock_update/blob/master/img/terra-bot-02.jpg)
ตัวอย่างหน้าจอการใช้งานคำสั่ง Chatbot การเอ่ยถึงแชทบอทที่มีคำว่า > terra ประกอบอยู่ด้วยจะแสดง quick reply กลับมา
![Terra Bot](https://github.com/ggafiled/googlesheet_appscript_stock_update/blob/master/img/terra-bot-03.jpg)

### License
GNU