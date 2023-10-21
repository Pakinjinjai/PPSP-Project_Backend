const { request } = require("express");
const patientModel = require("../schemas/patient");

const getProfile = async (req, res) => {
  const id = req.principal;

  const existPatient = await patientModel.findOne({ userId: id });

  if (!existPatient) {
    return res
      .status(404)
      .json({ message: `ไม่พบโปรไฟล์ของเจ้าของไอดี ${id}` });
  }
  res.status(200).json({ message: "ค้นหาสำเร็จ", user: existPatient });
};

const getProfileById = async (req, res) => {
  // const id = req.principal;
  const id = req.params.userId;

  const existPatient = await patientModel.findOne({ userId: id });

  if (!existPatient) {
    return res
      .status(404)
      .json({ message: `ไม่พบโปรไฟล์ของหมายเลขไอดี ${id}` });
  }
  res.status(200).json({ message: "ค้นหาสำเร็จ", user: existPatient });
};

const createProfile = async (id) => {
  try {
    await patientModel.create({ userId: id });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};

const updateProfile = async (req, res) => {
  const id = req.principal;
  const existPatient = await patientModel.findOneAndUpdate(
    { userId: id },
    req.body,
    { returnDocument: "after" }
  );

  if (!existPatient) {
    req.body.userId = id;
    const saveUser = await patientModel.create(req.body);
    return res
      .status(200)
      .json({ message: "อัพเดทโปรไฟล์สำเร็จ", user: saveUser });
  }

  return res
    .status(201)
    .json({ message: "อัพเดทโปรไฟล์สำเร็จ", user: existPatient });
};

const deleteProfile = async (req, res) => {
  const id = req.principal;
  const existPatient = await patientModel.findOneAndDelete({ userId: id });
  if (!existPatient) {
    return res.status(404).json({ message: "ไม่พบโปรไฟล์ในระบบ" });
  }
  return res.status(204).end();
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileById,
};
