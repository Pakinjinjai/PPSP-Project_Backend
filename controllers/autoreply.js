const { replys } = require('../schemas/reply')

const HealthCareprefig = async(client, Replytoken, Keywords)=>{
    try {
        const healthServices = await replys.find({ keys: { $in: Keywords } });
        let result = "";
        healthServices.forEach((service, index) => {
            result += `วิธีปฐมพยาบาลแบบที่ ${index + 1}: ${service.text}\n`;
        });
        await client.replyMessage({
            replyToken: Replytoken,
            messages: [{
                type: 'text',
                text: result.trim(), // Trim to remove any extra whitespace
            }],
        });
    } catch (error) {
        console.error('Error fetching and formatting health services:', error);
    }
}
module.exports = { HealthCareprefig };
