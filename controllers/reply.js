const replyModel = require("../schemas/reply");

const addReply = async (req, res) => {
    try {
      const saveReply = await replyModel.create(req.body);
      return res.status(201).json({message:"เพิ่มคำแนะนำสำเร็จ",saveReply:saveReply});
    } catch (error) {
      return res.status(400).json({message:"Error creating reply",error:error});
    }
  };
const getallReply = async (req, res) => {
    try {
      const viewReply = await replyModel.find();
      return res.status(201).json({message:"Success find reply",viewReply:viewReply})
    } catch (error) {
      return res.status(400).json({message:"Error creating reply",error:error});
    }
}
  
module.exports = {
    addReply,
    getallReply
};
