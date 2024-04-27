const userModel = require("../schemas/users");
const healthModel = require("../schemas/health");
const queueModel = require("../schemas/queue");
const { passwordHashing, passwordCompare } = require("../configs/hash");
const { createJWT } = require("../configs/jsonwebtoken");
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
    const userId = req.params._id;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "ไม่พบข้อมูลผู้ใช้งานที่ต้องการลบ" });
    }
    return res
      .status(200)
      .json({ message: "ลบผู้ใช้งานสำเร็จ", user: deletedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "พบข้อผิดพลาดในการลบผู้ใช้งาน", error: error.message });
  }
};

const searchUser = async (req, res) => {
  try {
    // รับค่า parameter "Search" จาก query string
    const { Search } = req.query;

    // สร้าง regular expression สำหรับการค้นหาที่ไม่ต้องการตรงตัว
    var regex = new RegExp(Search, "i");

    // ทำการค้นหาข้อมูลผู้ใช้ที่ตรงกับเงื่อนไขด้านล่าง
    const search_data = await userModel.aggregate([
      {
        // ใช้ match เพื่อกรองข้อมูลที่ตรงกับเงื่อนไข
        $match: {
          $or: [
            { firstname: regex },
            { lastname: regex },
            { _id: regex },
            { email: regex },
            { phoneNo: regex },
            { idCard: regex },
          ],
        },
      },
      {
        // ใช้ lookup เพื่อดึงข้อมูลจาก collection "queues"
        $lookup: {
          from: "queues",
          localField: "_id",
          foreignField: "userId",
          as: "queues",
        },
      },
      {
        // ใช้ lookup เพื่อดึงข้อมูลจาก collection "health" และทำการจัดเรียงข้อมูล
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
        // ใช้ addFields เพื่อเพิ่ม field "health" และทำการดึงค่าจาก array
        $addFields: {
          health: {
            $arrayElemAt: ["$health", 0],
          },
        },
      },
      {
        // ใช้ addFields เพื่อเพิ่ม field "health" และกำหนดค่าเริ่มต้นในกรณีที่ไม่มีข้อมูล
        $addFields: {
          health: {
            $ifNull: ["$health", null],
          },
        },
      },
    ]);

    // ส่งข้อมูลผลลัพธ์กลับในรูปแบบ JSON
    return res.status(200).json({ message: "ค้นหาสำเร็จ", Search: search_data });
  } catch (error) {
    // กรณีเกิดข้อผิดพลาดในการค้นหา
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
