const { verifyJWT } = require('../configs/jsonwebtoken');

const authorized = (req,res,next)=> {
    const authorizations = req.headers.authorization;
    
    if (authorizations == undefined) {
        return res.status(400).json({"message": "เกิดข้อผิดพลาดกรุณาลองภายหลัง"});
    }

    const type = authorizations.split(" ")[0]; //Bearer
    const token = authorizations.split(" ")[1]; //Bearer0

    if (type != "Bearer" || token == undefined ){
        return res.status(401).json({ "message":"กรุณาเข้าระบบก่อนใช้งาน" });
    }

    const decodedToken = verifyJWT(token);

    if (decodedToken == undefined) {
        return res.status(403).json({ "message":"ท่านไม่ได้รับอนุญาติให้เข้าถึงข้อมูล" });
    }

    req.principal = decodedToken.principal;

    next();
};

const isAdmin = (req,res,next)=> {
    const authorizations = req.headers.authorization;
    
    if (authorizations == undefined) {
        return res.status(400).json({"message": "เกิดข้อผิดพลาดกรุณาลองภายหลัง"});
    }

    const type = authorizations.split(" ")[0]; //Bearer
    const token = authorizations.split(" ")[1]; //Bearer0

    if (type != "Bearer" || token == undefined ){
        return res.status(401).json({ "message":"กรุณาเข้าระบบก่อนใช้งาน" });
    }

    const decodedToken = verifyJWT(token);

    if (decodedToken == undefined) {
        return res.status(403).json({ "message":"ท่านไม่ได้รับอนุญาติให้เข้าถึงข้อมูล" });
    }

    if (decodedToken.role != 9001) {
        return res.status(403).json({ "message":"ท่านไม่ได้รับอนุญาติให้เข้าถึงข้อมูล", 'actual' : {"message" : "เฉพาะเจ้าหน้าที่"} });
    }

    req.principal = decodedToken.principal;

    next();
};

module.exports = {
    authorized,
    isAdmin
}