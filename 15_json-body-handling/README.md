# 15. JSON-Body-Handling

## ✅ 전체 구조 요약: 사용자 생성 API

- **요청 URL**: `POST /api/users`
- **요청 본문**: 사용자 정보(JSON 형식)
- **응답 결과**: 생성된 사용자 정보를 JSON으로 반환

---

## 🔁 실제 동작 흐름 예시 + 시각화

### 🧪 예시 요청

클라이언트(예: Postman, 브라우저, 프론트엔드 앱)에서 다음과 같은 요청을 보낸다고 가정해볼게요:

```js
POST /api/users
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

---

### 🧭 서버 내부 동작 흐름 시각화

```js
📦 요청 도착 → POST /api/users

1. app.use(express.json())
   └─ 요청 본문(JSON)을 파싱하여 자바스크립트 객체로 변환
   └─ req.body = { name: "Alice", email: "alice@example.com" }

2. app.post("/api/users", ...) 실행
   └─ console.log(req.body)
        → 콘솔 출력: { name: "Alice", email: "alice@example.com" }

   └─ newUser = req.body

   └─ res.status(201).json({
        message: "User created successfully",
        user: newUser
      })

3. 응답 전송

   ┌────────────────────────────────────────┐
   │ 📤 응답                                │
   │ Status: 201 Created                    │
   │ Content-Type: application/json         │
   │                                        │
   │ {                                      │
   │   "message": "User created successfully", │
   │   "user": {                            │
   │     "name": "Alice",                   │
   │     "email": "alice@example.com"       │
   │   }                                    │
   │ }                                      │
   └────────────────────────────────────────┘
```

---

## ✅ 전체 코드 복습 (동작 흐름과 함께 다시 보기)

```js
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
```

---

## 🧪 Postman / curl 테스트

### Postman 설정
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/users`
- **Body** → `raw` → `JSON`

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

### 응답 확인
```json
{
  "message": "User created successfully",
  "user": {
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

---

## 💡 이렇게 활용하세요

- 사용자 정보를 DB에 저장하고 싶다면 `newUser`를 DB에 저장하는 코드 추가
- `name`, `email`이 없을 때는 400 Bad Request 응답을 주도록 확장
- API 명세서로 문서화하면 팀 협업에서도 훨씬 편리합니다
