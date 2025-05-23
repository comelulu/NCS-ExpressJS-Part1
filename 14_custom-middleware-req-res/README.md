# 14. Custom Middleware: Req <==> Res

## 🧾 전체 코드 (설명 포함)

```js
// 1. Express 모듈 불러오기
const express = require("express");
const app = express();

/*
==========================================================
🛡️ [1단계] 사용자 인증 미들웨어
==========================================================
- 이 미들웨어는 요청이 들어올 때마다 사용자 정보를 인증된 것처럼 설정해주는 역할을 합니다.
- 실제 서비스에서는 여기에 JWT 토큰 검증, 세션 검사 등 로직이 들어갑니다.
- 여기서는 예시로, 모든 요청에 대해 `req.user` 객체를 추가합니다.
*/
app.use((req, res, next) => {
  // 인증이 완료되었다고 가정하고 사용자 정보 주입
  req.user = { id: "123", name: "John Doe", role: "Admin" };
  next(); // 다음 미들웨어로 넘어감
});

/*
==========================================================
📦 [2단계] 커스텀 응답 메서드 미들웨어
==========================================================
- 응답 객체(res)에 새로운 메서드(res.success, res.error)를 추가합니다.
- 이 메서드를 통해 JSON 형식의 일관된 응답을 쉽게 보낼 수 있습니다.
*/
app.use((req, res, next) => {
  // 성공 응답용 메서드 정의
  res.success = (data) => {
    res.status(200).json({ status: "success", data: data });
  };

  // 에러 응답용 메서드 정의
  res.error = (message) => {
    res.status(400).json({ status: "error", message: message });
  };

  next(); // 다음 미들웨어 또는 라우터로 이동
});

/*
==========================================================
📄 [라우트 1] /profile
- 사용자 정보를 응답으로 보내는 라우트입니다.
- 첫 번째 미들웨어에서 설정한 `req.user`에 접근합니다.
==========================================================
*/
app.get("/profile", (req, res) => {
  // 사용자 이름과 역할을 텍스트로 응답
  res.send(`User Profile: ${req.user.name}, Role: ${req.user.role}`);
});

/*
==========================================================
✅ [라우트 2] /success
- 커스텀 성공 응답(res.success)을 테스트합니다.
==========================================================
*/
app.get("/success", (req, res) => {
  res.success({ message: "This is a successful response!" });
});

/*
==========================================================
❌ [라우트 3] /error
- 커스텀 에러 응답(res.error)을 테스트합니다.
==========================================================
*/
app.get("/error", (req, res) => {
  res.error("This is an error response.");
});

/*
==========================================================
🚀 [서버 실행]
==========================================================
- 3000번 포트에서 서버를 시작합니다.
- http://localhost:3000 경로에서 라우트들을 테스트할 수 있습니다.
*/
app.listen(3000, () => {
  console.log("✅ 서버가 3000번 포트에서 실행 중입니다.");
});
```

---

## 🧭 전체 요청 흐름 시각화

브라우저 또는 API 클라이언트(Postman 등)로 `http://localhost:3000/profile` 요청 시:

```js
💻 클라이언트 요청 → GET /profile

┌────────────────────────────────────────────┐
│ [1단계] 사용자 인증 미들웨어                   │
│ → req.user = { id: "123", name: "John", ...│
└────────────┬───────────────────────────────┘
             ▼
┌────────────────────────────────────────────┐
│ [2단계] 커스텀 응답 메서드 미들웨어            │
│ → res.success(), res.error() 메서드 추가    │
└────────────┬───────────────────────────────┘
             ▼
┌────────────────────────────────────────────┐
│ [라우트] GET /profile                       │
│ → req.user.name → "John Doe"               │
│ → res.send("User Profile: John Doe...")    │
└────────────────────────────────────────────┘
```

---

## 📘 요약: 주요 개념 정리

| 개념                 | 설명                                                  |
| -------------------- | ----------------------------------------------------- |
| `req.user`           | 사용자 인증 후, 인증된 사용자 정보를 담는 공간        |
| `res.success(data)`  | 일관된 형식의 성공 응답을 보내는 사용자 정의 메서드   |
| `res.error(message)` | 에러 메시지를 JSON 형식으로 보내는 사용자 정의 메서드 |
| `app.use()`          | 모든 요청에 적용되는 공통 미들웨어 등록 시 사용       |
| `next()`             | 다음 미들웨어 또는 라우터로 요청 흐름 전달            |

---

## 💡 실무 확장 포인트

- `req.user`는 보통 **JWT 토큰 해석 결과**, 또는 **세션 정보**에서 추출됩니다.
- `res.success`, `res.error` 같은 커스텀 응답은 API 개발 시 **일관된 응답 포맷 유지**에 매우 유용합니다.
- 이 구조는 실제로 Express 기반 RESTful API의 **기초 설계 패턴**에 자주 사용됩니다.

---

## ✅ 테스트 예시

| 경로       | 응답 내용                                               |
| ---------- | ------------------------------------------------------- |
| `/profile` | `User Profile: John Doe, Role: Admin`                   |
| `/success` | `{ "status": "success", "data": { "message": "..." } }` |
| `/error`   | `{ "status": "error", "message": "..." }`               |
