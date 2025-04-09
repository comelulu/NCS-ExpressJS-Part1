const express = require("express");
const app = express();

/*
==========================================================
🔧 express.urlencoded({ extended: true })
----------------------------------------------------------
- HTML form에서 전송된 데이터를 해석(parsing)하여 req.body에 저장합니다.
- 기본적으로 form은 'application/x-www-form-urlencoded' 타입으로 데이터를 보냅니다.
- extended: true → 객체 안에 배열이나 중첩된 객체까지 파싱 가능 (권장)
*/
app.use(express.urlencoded({ extended: true }));

/*
==========================================================
📨 POST /login
----------------------------------------------------------
- 사용자가 로그인 폼을 제출하면 이 라우트가 실행됩니다.
- 입력한 username과 password가 req.body에 저장됩니다.
*/
app.post("/login", (req, res) => {
  console.log(req.body); // 예: { username: 'Alice', password: '1234' }

  // 이후 로그인 검증 로직이 이곳에 들어갈 수 있습니다.

  res.send("Data received");
});

/*
==========================================================
🚀 서버 실행
==========================================================
*/
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
