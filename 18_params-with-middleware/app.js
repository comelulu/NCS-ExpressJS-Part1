const express = require("express");
const app = express();

/*
==========================================================
🧩 app.param("userId", callback)
----------------------------------------------------------
- 라우트 경로에 :userId가 사용될 때마다 이 미들웨어가 자동 실행됩니다.
- 주로 DB에서 사용자 정보를 미리 조회하거나 유효성 검사를 할 때 사용합니다.
*/
app.param("userId", (req, res, next, id) => {
  // "userId"는 경로 파라미터 (:userId)의 실제 값
  const user = getUserById(id); // 가상의 DB 조회 함수

  // 사용자가 존재하지 않으면 404 에러 응답
  if (!user) {
    return res.status(404).send("User not found");
  }

  // req.user에 사용자 정보를 저장하여 이후 라우트에서 사용
  req.user = user;

  next(); // 다음 미들웨어 또는 라우터로 진행
});

/*
==========================================================
📄 GET /users/:userId
----------------------------------------------------------
- :userId가 URL에 포함되어 있으므로, 위의 app.param이 자동 실행됩니다.
- req.user에는 사용자 정보가 이미 들어있는 상태입니다.
*/
app.get("/users/:userId", (req, res) => {
  res.send(req.user); // 사용자 정보 응답
});

/*
==========================================================
📄 GET /blogs/:userId
----------------------------------------------------------
- 다른 경로에서도 :userId가 포함되어 있으면 app.param이 동일하게 실행됩니다.
- 즉, 중복 없이 사용자 전처리 로직을 재사용할 수 있습니다.
*/
app.get("/blogs/:userId", (req, res) => {
  res.send({
    message: `${req.user.name}님의 블로그입니다.`,
    user: req.user,
  });
});

/*
==========================================================
📦 가상의 데이터 조회 함수 (실제 DB 대신 하드코딩)
*/
function getUserById(id) {
  const users = {
    1: { id: 1, name: "Alice", role: "Admin" },
    2: { id: 2, name: "Bob", role: "User" },
  };
  return users[id];
}

// ✅ 서버 실행
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
