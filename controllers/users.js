const userModel = require("../schemas/users");
const healthModel = require("../schemas/health");
const queueModel = require("../schemas/queue");
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
// const getAllUser = async (req, res) => { // ฟังก์ชันที่ใช้ดึงข้อมูลผู้ใช้ทั้งหมดพร้อมข้อมูลสุขภาพล่าสุดและคิวของผู้ใช้
//   try { // เริ่มต้นการใช้งาน try-catch เพื่อจัดการข้อผิดพลาดที่เป็นไปได้
//     const users = await userModel.find().sort({ updatedAt: "desc" }); // ดึงข้อมูลผู้ใช้ทั้งหมดจาก MongoDB และเรียงลำดับตามวันที่แก้ไขล่าสุด

//     const usersWithHealthAndQueue = await Promise.all(users.map(async (user) => { // สร้าง Promise สำหรับแต่ละผู้ใช้เพื่อดึงข้อมูลสุขภาพและคิว
//       const healthData = await healthModel.aggregate([ // ค้นหาข้อมูลสุขภาพล่าสุดของผู้ใช้ด้วย aggregate pipeline
//         { $match: { userId: user._id } }, // เลือกข้อมูลที่ตรงกับ userId ของผู้ใช้นั้น
//         { $sort: { createdAt: -1 } }, // เรียงลำดับข้อมูลตามวันที่สร้างล่าสุด
//         { $limit: 1 } // จำกัดข้อมูลให้เหลือแค่หนึ่งรายการ (ข้อมูลล่าสุด)
//       ]);
//       const queueData = await queueModel.find({ userId: user._id }).sort({ updatedAt: "desc" }); // ดึงข้อมูลคิวของผู้ใช้โดยเรียงลำดับตามวันที่แก้ไขล่าสุด
//       return { ...user._doc, health: healthData[0], queue: queueData }; // ส่งคืนข้อมูลผู้ใช้พร้อมข้อมูลสุขภาพล่าสุดและคิวของผู้ใช้นั้น
//     }));

//     return res.status(200).json(usersWithHealthAndQueue); // ส่งข้อมูลผู้ใช้ที่มีข้อมูลสุขภาพและคิวกลับไปในรูปแบบ JSON
//   } catch (error) { // จัดการข้อผิดพลาดเมื่อเกิดข้อผิดพลาดในการดึงข้อมูล
//     return res.status(400).json(error); // ส่งข้อผิดพลาดกลับไปในรูปแบบ JSON พร้อมรหัสสถานะ 400
//   }
// };

const getAllUser = async (req, res) => {
  try {
    const user = await userModel.aggregate([
      {
        $lookup: {
          from: "queues",
          localField: "_id",
          foreignField: "userId",
          as: "queues",
        },
      },
      {
        $lookup: {
          from: "health",
          localField: "_id",
          foreignField: "userId",
          as: "health",
          pipeline: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $addFields: {
          health: {
            $arrayElemAt: ["$health", 0],
          },
        },
      },
      {
        $addFields: {
          health: {
            $ifNull: ["$health", null],
          },
        },
      },
    ]);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const UsersId = req.params._id;
    const existUsers = await userModel.findByIdAndDelete(UsersId);
    if (!existUsers) {
      return res.status(400).json({ message: "ไม่พบคิวที่ต้องการลบ" });
    }
    return res.status(200).json({ message: "ลบผู้ใช้งานสำเร็จ" }).end();
  } catch (error) {
    return res.status(500).json(error);
  }
};
const searchUser = async (req, res) => {
  try {
    const { Search } = req.query;
    var regex = new RegExp(Search, "i");
    // console.log(Search);
    const search_data = await userModel.find({
      $or: [
        { firstname: regex },
        { lastname: regex },
        { _id: regex },
        { email: regex },
        { phoneNo: regex },
        { idCard: regex },
      ],
    });
    // console.log(search_data);
    return res
      .status(200)
      .json({ message: "ค้นหาสำเร็จ", Search: search_data });
  } catch (error) {
    return res.status(400).json({ message: "ค้นหาไม่สำเร็จ", error: error });
  }
};

module.exports = {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  getAllUser,
  deleteUser,
  searchUser,
};
