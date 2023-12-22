const userModel = require("../schemas/users");
const { passwordHashing, passwordCompare } = require("../configs/hash");
const { createJWT } = require("../configs/jsonwebtoken");

const createProfile = async (id) => {
  try {
    await patientModel.create({ userId: id });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body; //email,password

  const existUser = await userModel.findOne({ email: email });

  if (!existUser) {
    return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
  }

  const correctPassword = await passwordCompare(password, existUser.password);

  if (!correctPassword) {
    return res.status(401).json({ message: "อีเมล์หรือรหัสผ่านไม่ถูกต้อง" });
  }

  const accessPayload = {
    principal: existUser._id, //64654sadawd213sad+-
    role: existUser.role, //2001
    kind: "access",
  };

  const accessToken = createJWT(accessPayload);

  return res
    .status(200)
    .json({ message: "เข้าสู่ระบบสำเร็จ", accessToken: accessToken });
};
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role != undefined) {
      return res.status(400).json({ message: "เกิดข้อผิดพลาด" });
    }

    const existsUser = await userModel.findOne({ email: email });

    if (existsUser) {
      return res.status(400).json({ message: "มีผู้ใช้งานอยู่ในระบบ" });
    }

    const passwordHash = await passwordHashing(password);
    req.body.password = passwordHash;

    const user = await userModel.create(req.body);
    await createProfile(user._id);
    return res.status(201).json({ message: "สร้างรหัสผ่านสำเร็จ", user: user });
  } catch (err) {
    return res.status(400).json(err);
  }
};
const getUserProfile = async (req, res) => {
  const id = req.principal;

  const existPatient = await userModel.findById(id);

  if (!existPatient) {
    return res
      .status(404)
      .json({ message: `ไม่พบโปรไฟล์ของเจ้าของไอดี ${id}` });
  }
  res.status(200).json({ message: "ค้นหาสำเร็จ", user: existPatient });
};
const updateUserProfile = async (req, res) => {
  const id = req.principal;
  const existPatient = await userModel.findOneAndUpdate(
    { _id: id }, // ใช้ _id แทน userId ใน query
    { $set: req.body }, // ใช้ $set เพื่ออัพเดทเฉพาะข้อมูลที่ถูกส่งมา
    { returnDocument: "after" }
  );

  if (!existPatient) {
    req.body.userId = id;
    const saveUser = await userModel.create(req.body);
    return res
      .status(200)
      .json({ message: "อัพเดทโปรไฟล์สำเร็จ", user: saveUser });
  }

  return res
    .status(201)
    .json({ message: "อัพเดทโปรไฟล์สำเร็จ", user: existPatient });
};

module.exports = {
  login,
  register,
  getUserProfile,
  updateUserProfile,
};
