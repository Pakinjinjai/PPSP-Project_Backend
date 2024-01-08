const queueModel = require("../schemas/queue");

const getAllQueue = async (req, res) => {
  try {
    const queues = await queueModel.find().sort({ updatedAt: "desc" });
    return res.status(201).json(queues);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getQueuesByUser = async (req, res) => {
  try {
    const userId = req.principal;
    const queues = await queueModel.find({ userId: userId });
    return res.status(200).json(queues);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const addQueue = async (req, res) => {
  try {
    const saveQueue = await queueModel.create(req.body);
    return res.status(201).json(saveQueue);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateQueue = async (req, res) => {
  try {
    const queueId = req.params.queueId;
    const existQueue = await queueModel.findByIdAndUpdate(queueId, req.body, {
      returnDocument: "after",
    });
    if (!existQueue) {
      return res.status(404).json({ message: "ไม่พบคิวที่ต้องการแก้ไข" });
    }
    return res.status(200).json(existQueue);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteQueue = async (req, res) => {
  try {
    const queueId = req.params.queueId;
    const existQueue = await queueModel.findByIdAndDelete(queueId);
    if (!existQueue) {
      return res.status(400).json({ message: "ไม่พบคิวที่ต้องการลบ" });
    }
    return res.status(200).json({ message: "ลบคิวสำเร็จ", existQueue }).end();
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  addQueue,
  updateQueue,
  deleteQueue,
  getAllQueue,
  getQueuesByUser,
};
