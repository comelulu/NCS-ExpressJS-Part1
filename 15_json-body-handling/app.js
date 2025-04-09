const express = require("express");
const app = express();

// 1단계: JSON 본문 파싱 미들웨어
// 요청 본문이 JSON일 경우 자동으로 자바스크립트 객체로 변환하여 req.body에 저장합니다.
app.use(express.json());

// 2단계: 사용자 생성 라우트
app.post("/api/users", (req, res) => {
  // 받은 데이터 확인
  console.log(req.body); // { name: "Alice", email: "alice@example.com" }

  // 사용자 정보 저장 (여기서는 메모리에 저장하는 예시)
  const newUser = req.body;

  // 응답 보내기
  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

// 3단계: 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
