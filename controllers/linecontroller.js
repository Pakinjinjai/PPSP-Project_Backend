const line = require('@line/bot-sdk')
const { HealthCareprefig } = require('./autoreply')
const { userModel }=require('../schemas/users')
const config = {
    channelAccessToken: 'EdavZh2sNcMKX6J8IH8oIugmyH6m+jyvJaGEdy1lU7K6b8tpmi7p0x0STMCIrTVvDlRj6paGbDfbmiMreRocuDOB8jr16E61DFVb2IZrq8kdoo5r1neQNdw/OhHQDJm9hKAt+yLDyoZkJlGsbKDJQAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '99942febe4d537fc0f2cc4c5b028270d'
  };
    const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: config.channelAccessToken,
  });
  function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    if (event.message.text.includes("นัดคิว")){
        console.log("มีการนัดคิว");
    }
    else if (event.message.text.includes("จองคิว")){
        console.log("มีการจองคิว");
    }
    else if (event.message.text.includes("ยืนยันสถานะ")){
      console.log(event.message.text.split(' ')[1]);
      let _id = event.message.text.split(' ')[1]
      userModel.findById(_id).then((v)=>{
        if (v != null){
          client.replyMessage({
            replyToken:event.replyToken,
            messages: [{
              type: 'text',
              text: "ยืนยันผู้ใช้งานในระบบ"
            }],
          });
        }
        else{
          client.replyMessage({
            replyToken:event.replyToken,
            messages: [{
              type: 'text',
              text: "ขออภัยไม่พบหมายเลขผู่ป่วย กรุณาระบุใหม่อีกครั้งค่ะ"
            }],
          });
        }
      })
  }
    else{HealthCareprefig(client,event.replyToken,event.message.text)} 

  }

  module.exports = {
    config,
    handleEvent,
  }