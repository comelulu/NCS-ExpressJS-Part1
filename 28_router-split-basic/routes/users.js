// express 모듈을 불러옵니다.
const express = require("express");

// router 객체를 생성합니다.
// 이 router는 "미니 Express 앱"처럼 동작하며, 이 안에 라우트를 정의할 수 있습니다.
const router = express.Router();

// [GET] /users
// 클라이언트가 "/users"로 GET 요청을 보냈을 때 실행됩니다.
// 예: 브라우저에서 http://localhost:3000/users 요청 시 응답 반환
router.get("/", (req, res) => {
  res.send("User list"); // 사용자 목록을 응답
});

// [POST] /users
// 클라이언트가 "/users"로 POST 요청을 보냈을 때 실행됩니다.
// 예: Postman이나 HTML form에서 사용자 추가 요청을 보낼 때 사용
router.post("/", (req, res) => {
  res.send("Create a user"); // 사용자 생성 응답
});

// [GET] /users/:userId
// :userId는 URL 파라미터입니다.
// 예: "/users/123"으로 요청이 들어오면 userId는 "123"이 됩니다.
router.get("/:userId", (req, res) => {
  // req.params.userId를 통해 해당 사용자 ID를 가져올 수 있습니다.
  res.send(`Get user with ID ${req.params.userId}`);
});

// router 객체를 외부에서 사용할 수 있도록 내보냅니다.
// app.js에서 이 router를 가져와서 사용할 수 있게 됩니다.
module.exports = router;
