const userModel = require("../schemas/users");
const { passwordHashing, passwordCompare } = require("../configs/hash");
const { createJWT } = require("../configs/jsonwebtoken");
const { response } = require("express");
const dayjs = require("dayjs");

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
    req.body._id = "HN" + dayjs().unix();

    const user = await userModel.create(req.body);
    return res.status(201).json({ message: "สร้างรหัสผ่านสำเร็จ", user: user });
  } catch (err) {
    return res.status(400).json(err);
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
const getUserProfile = async (req, res) => {
  const id = req.principal;

  const existUsers = await userModel.findById(id);

  if (!existUsers) {
    return res
      .status(404)
      .json({ message: `ไม่พบโปรไฟล์ของเจ้าของไอดี ${id}` });
  }
  res.status(200).json({ message: "ค้นหาสำเร็จ", user: existUsers });
};
const updateUserProfile = async (req, res) => {
  const id = req.principal;
  const existUsers = await userModel.findOneAndUpdate(
    { _id: id }, // ใช้ _id แทน userId ใน query
    { $set: req.body }, // ใช้ $set เพื่ออัพเดทเฉพาะข้อมูลที่ถูกส่งมา
    { returnDocument: "after" }
  );

  if (!existUsers) {
    req.body.userId = id;
    const saveUser = await userModel.create(req.body);
    return res
      .status(200)
      .json({ message: "อัพเดทโปรไฟล์สำเร็จ", user: saveUser });
  }

  return res
    .status(201)
    .json({ message: "อัพเดทโปรไฟล์สำเร็จ", user: existUsers });
};
// const updateProfileBy_Id = async (req, res) => {
//   try {
//     const UsersId = req.params.UsersId;
//     const existUsers = await userModel.findByIdAndUpdate(UsersId, req.body, {
//       returnDocument: "after",
//     });
//     if (!existUsers) {
//       return res.status(404).json({ message: "ไม่พบผู้ใช้งานที่ต้องการแก้ไข" });
//     }
//     return res
//       .status(200)
//       .json({ message: "อัพเดทผู้ใช้งานสำเร็จ" }, existUsers);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find().sort({ updatedAt: "desc" });
    return res.status(201).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const UsersId = req.params.UsersId;
    const existUsers = await userModel.findByIdAndDelete(UsersId);
    if (!existUsers) {
      return res.status(400).json({ message: "ไม่พบคิวที่ต้องการลบ" });
    }
    return res.status(200).json({ message: "ลบผู้ใช้งานสำเร็จ" }).end();
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  getAllUser,
  deleteUser,
};
