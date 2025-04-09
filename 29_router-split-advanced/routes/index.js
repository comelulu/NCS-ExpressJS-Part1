// 1. Express 모듈을 불러옵니다.
const express = require("express");

// 2. Router 객체를 생성합니다.
//    → Router는 미니 앱(mini express app)처럼 동작합니다.
//      - 라우팅: URL 경로에 따라 요청을 처리할 수 있고
//      - 미들웨어 등록도 가능하며
//      - 최종적으로 app.js에 연결되어 작동합니다.
const router = express.Router();

// 3. 홈페이지 요청이 들어올 때 공통으로 작동하는 미들웨어를 설정합니다.
router.use((req, res, next) => {
  console.log("백화점 홈페이지입니다..."); // 콘솔 로그 출력
  next(); // 다음 핸들러 또는 라우터로 요청을 넘깁니다.
});

// 4. [GET] / 요청이 들어오면 홈페이지 메시지를 응답합니다.
router.get("/", (req, res) => {
  res.send("Welcome to the Department Store!");
});

// 5. 이 라우터 객체를 외부로 내보냅니다.
//    → app.js에서 require로 불러올 수 있게 됩니다.
module.exports = router;
