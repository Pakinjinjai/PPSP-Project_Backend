const line = require('@line/bot-sdk');
const { HealthCareprefig } = require('./autoreply'); 
const userModel = require('../schemas/users');
const confirmuserModel = require('../schemas/confirmuser');
const queueModel = require("../schemas/queue");
const dayjs = require('dayjs');
const config = {
    channelAccessToken: 'EdavZh2sNcMKX6J8IH8oIugmyH6m+jyvJaGEdy1lU7K6b8tpmi7p0x0STMCIrTVvDlRj6paGbDfbmiMreRocuDOB8jr16E61DFVb2IZrq8kdoo5r1neQNdw/OhHQDJm9hKAt+yLDyoZkJlGsbKDJQAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '99942febe4d537fc0f2cc4c5b028270d'
  };
    const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: config.channelAccessToken,
  });
async function handleEvent(event) {
  const accoutId = event.source.userId
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    if (event.message.text.includes("ยืนยันสถานะ")){
      console.log(event.message.text.split(' ')[1]);
      let _id = event.message.text.split(' ')[1]
      const existuser = await confirmuserModel.findOne({accoutId:accoutId})
      if (existuser){
        client.replyMessage({
          replyToken:event.replyToken,
          messages: [{
            type: 'text',
            text: "คุณได้ทำการยืนยันสมาชิกเรียบร้อยแล้วค่ะ"
          }],
        });return
      }
      userModel.findById(_id).then((v)=>{
        if (v != null){
          confirmuserModel.create({userId:_id,accoutId:accoutId})
          client.replyMessage({
            replyToken:event.replyToken,
            messages: [
              {
              type: 'text',
              text: "ยืนยันผู้ใช้งานในระบบ"
              },
              {
                type: 'text',
                text: `ยินดีต้อนรับสู่ HealthCare พิมพ์คำสั่งได้ ดังนี้
                1. ช็อก, หมดสติ
                2. งูกัด, สัตว์มีพิษ
                3. เป็นลมหมดสติ, ชีพจรยังเต้นอยู่
                4. หายใจไม่สะดวก, เวียนหัว, คลื่นไส้รุนแรง
                5. เจ็บหน้าอกอย่างรุนแรง, เจ็บหน้าอก
                6. ปวดท้อง, ปวดท้องรุนแรง
                7. ปวดศีรษะรุนแรง, ปวดหัวรุนแรง
                8. อุบัติเหตุทางท้องถนน, เคสฉุกเฉิน`
              },
              {
                type: 'text',
                text: `ผู้ใช้งานสามารถพิมพ์คำสังเพื่อสอบถามรายการยาแต่ละประเภท ดังนี้
                1.ไข้ น้ำมูก หรือภูมิแพ้: ยาแก้หวัด, ยาลดน้ำมูก, ยาภูมิแพ้
                2.ความดันโลหิตสูง: ยาลดความดันโลหิตสูง
                3.ปวดหัว มีไข้: ยาแก้ปวดหัว, ยาลดไข้
                4.อาการไอ มีเสมหะ เจ็บคอ: ยาลดเสมหะ, ยาแก้อาการไอ
                5.อาการปวดกล้ามเนื้อ: ยาแก้ปวดกล้ามเนื้อ, ยาคลายกล้ามเนื้อ
                6.อาการคลื่นไส้และอาเจียน: ยาลดอาการคลื่นไส้, ยาลดอาการอาเจียน
                7.อาการจุกเสียด หรือแน่นท้องและแสบร้อนกลางอก: ยาลดอาการจุกเสียด, ยาลดอาการแสบร้อนกลางอก
                8.อาการท้องเสีย: ยาลดอาการท้องเสีย, ยาบรรเทาอาการท้องเสีย`
              },
              {
                type: 'text',
                text: `หากผู้ใช้งานเคยได้ทำการนัดคิวบนเว็บไซต์ จะสามารถพิมพ์ "ตรวจสอบคิว" เพื่อทำการดูข้อมูลคิวทีได้ทำการนัดไว้`
              },
              {
                type: 'text',
                text: `คำสั่งเหล่านี้ผู้ใช้งานสามารถดูเพิ่มเติมได้ที่ประกาศเพิ่มเติม โดยทำการกดที่รูปโปรไฟล์ของทางเราค่ะ`
              },
          ],
          });
        }
        else{
          client.replyMessage({
            replyToken:event.replyToken,
            messages: [
            {
              type: 'text',
              text: "ขออภัยไม่พบหมายเลขผู่ป่วย กรุณาระบุใหม่อีกครั้งค่ะ"
            },
            {
              type: 'text',
              text: `กรุณาพิมพิมพ์ "ยืนยันสถานะ HN(ตามด้วยHNของท่านที่ได้ทำการสมัครบนเว็บไซต์)"`
            },
          ],
          });
        }
      })
      return; 
  }
    else {
      const existuser = await confirmuserModel.findOne({accoutId:accoutId})
      if (!existuser){
        client.replyMessage({
          replyToken:event.replyToken, 
          messages: [
          {
            type: 'text',
            text: "กรุณายืนยันสถานะก่อนทำการใช้งานค่ะ"
          },
          {
            type: 'text',
            text: `กรุณาพิมพิมพ์ "ยืนยันสถานะ HN(ตามด้วยHNของท่านที่ได้ทำการสมัครบนเว็บไซต์)"`
          },
        ],
        });
        return;
      }
      if (event.message.text.includes("ตรวจสอบคิว")){
        const queues = await queueModel.find({ userId: existuser.userId, status: false });
        if (queues.length === 0) {
          client.replyMessage({
            replyToken:event.replyToken,
            messages: [{
              type: 'text',
              text: "คุณยังไม่ได้ทำการจองคิวผ่านเว็บไซต์ค่ะ"
            },
            {
              type: 'text',
              text: "คุณสามารถเพิ่มคิวได้โดยทำการเข้าไปที่หน้าเว็บไซต์เพื่อให้บริการและอำนวยความสะดวกแก่ผู้ป่วย หลังจากนั้นทำการเพิ่มคิวเข้าสู่ระบบค่ะ่"
            }],
          });
        }
        else {
          const queue = queues[0]
          client.replyMessage({
            replyToken:event.replyToken,
            messages: [{
              type: 'text',
              text: `สถานะคิวของท่าน\nมีรายละเอียด ดังนี้\nรายการนัดตรวจ:${queue.topic}\nคำแนะนำ:${queue.note}\nวันที่่นัดตรวจ:${dayjs(queue.startDate).format('DD/MM/YYYY HH:mm:ss')}\nรูปแบบการตรวจ:${queue.locations == true?'นัดรักษาออนไลน์':"นัดพบแพทย์ที่โรงพยาบาล"}`
            }],
          });
        }
      }
        else{
          const accoutId = event.source.userId
          await HealthCareprefig(client,event.replyToken,event.message.text)
        } 
      }
  }

  module.exports = {
    config,
    handleEvent,
  }