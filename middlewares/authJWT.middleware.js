// นำเข้า library jsonwebtoken เพื่อใช้สำหรับการตรวจสอบ (verify) และถอดรหัส token
const jwt = require("jsonwebtoken");

// นำเข้าและตั้งค่า dotenv เพื่อให้สามารถอ่านค่าจากไฟล์ .env ได้ (เช่นพวก Secret Key)
require("dotenv").config();

// ดึงค่า SECRET key จากไฟล์ .env มาเก็บไว้ในตัวแปร เพื่อใช้เป็น "กุญแจ" ในการตรวจสอบความถูกต้องของ token
const secret = process.env.SECRET;

// สร้างฟังก์ชัน Middleware ชื่อ verifyToken เพื่อใช้ตรวจสอบความถูกต้องของ Token ก่อนเข้าถึง Route
const verifyToken = (req, res, next) => {
  
  // ดึงค่า token จาก Header ของ HTTP request ที่ส่งมาในชื่อ "x-access-token"
  const token = req.headers["x-access-token"];
  
  // พิมพ์ค่า token ออกมาทาง console เพื่อดูว่าส่งมาถูกต้องหรือไม่ (ใช้ตอน debug)
  console.log(token);

  // ตรวจสอบว่ามี token ส่งมาหรือไม่ ถ้าไม่มี (!token) ให้หยุดการทำงานทันที
  if (!token) {
    // ส่ง HTTP Status 401 (Unauthorized) กลับไปบอก Client ว่า "ไม่พบ Token"
    return res.status(401).send({ message: "Token is missing" });
  }

  // ใช้ jwt.verify เพื่อตรวจสอบว่า token ถูกต้องไหม โดยใช้กุญแจ (secret) ที่เรามี
  jwt.verify(token, secret, (err, decoded) => {
    
    // ถ้าตรวจแล้วพบว่า token ปลอม, หมดอายุ หรือไม่ถูกต้อง (err จะมีค่า)
    if (err) {
      // ส่ง HTTP Status 403 (Forbidden) กลับไปบอกว่า "ไม่มีสิทธิ์เข้าถึง"
      return res.status(403).send({ message: "Access Forbidden" });
    }

    // ถ้า token ถูกต้อง 'decoded' จะเก็บข้อมูลที่ฝังไว้ใน token (Payload)
    // นำชื่อผู้ใช้ (username) จาก token มาเก็บไว้ใน Object ของ Request (req) เพื่อให้ Route ถัดไปใช้งานได้
    req.username = decoded.username;
    
    // นำ ID ของผู้เขียน (id) จาก token มาเก็บไว้ใน req.authorId
    req.authorId = decoded.id;

    // เมื่อตรวจสอบผ่านทุกอย่างแล้ว ให้เรียกฟังก์ชัน next() เพื่อส่งงานต่อให้ Controller หรือ Middleware ตัวถัดไป
    next();
  });
};

// รวบรวมฟังก์ชัน verifyToken ไว้ใน Object ชื่อ authJwt เพื่อให้ง่ายต่อการเรียกใช้
const authJwt = {
  verifyToken,
};

// ส่งออก (Export) Object authJwt เพื่อให้ไฟล์อื่นๆ ในโปรเจกต์สามารถเรียกใช้งานได้ผ่าน require()
module.exports = authJwt;