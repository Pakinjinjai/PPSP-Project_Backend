const replys = require('../schemas/reply')
const confirmuserModel = require('../schemas/confirmuser');
const { text } = require('express');

const HealthCareprefig = async(client, Replytoken, Keywords)=>{
        try {
            const healthServices = await replys.find({ keys: {'$regex': Keywords,'$options' : 'i'} });
            var messages =[]
            // console.log(healthServices)
            if (healthServices.length > 0){
                healthServices.forEach((service, index) => {
                    messages.push(
                        {
                            type:'text',
                            text:`วิธีปฐมพยาบาลที่${index+1}\n${service.text}`
                        }
                    )
                });
                client.replyMessage({
                    replyToken: Replytoken,
                    messages: messages
                });
            }
            else {
                client.replyMessage({
                    replyToken: Replytoken,
                    messages: [
                        {
                        type: 'text',
                        text: "ไม่พบคีย์เวิร์ดที่ท่านค้นหา กรุณาพิมพ์ใหม่อีกครั้งค่ะ"
                        },
                        {
                            type: 'text',
                            text: "สามารถดูคำสั่งการใช้งานได้ที่ประกาศของทางเราค่ะ โดยทำการกดที่รูปโปรไฟล์ของทางเราเพื่อดูประกาศค่ะ"
                        }
                    ],
                });
            }
        } catch (error) {
            console.error('Error fetching and formatting health services:', error);
        }
      }
module.exports = { HealthCareprefig };
