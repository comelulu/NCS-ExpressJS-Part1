const express = require("express");
const router = express.Router(); // 라우터 인스턴스를 생성합니다

// 모든 요청에 대해 먼저 로그를 출력하는 미들웨어입니다
router.use((req, res, next) => {
  console.log("백화점 홈페이지입니다...");
  next(); // 다음 미들웨어 또는 라우터로 진행합니다
});

// 홈페이지 루트 ('/') 경로에 대한 GET 요청을 처리합니다
router.get("/", (req, res) => {
  res.send("Welcome to the Department Store!"); // 환영 메시지를 반환합니다
});

module.exports = router; // 라우터를 외부에서 사용할 수 있도록 내보냅니다
