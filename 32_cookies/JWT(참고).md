# 🔐 JWT를 이용한 세션 관리 – Express에서 토큰 기반 로그인 시스템 구현

---

## 📦 JWT란?

### 💡 `JWT (JSON Web Token)`는 **토큰 기반 인증 시스템**입니다.  
전통적인 **세션 기반 인증** 방식은 서버가 **세션 정보**를 유지하는 방식인데, **JWT**는 **서버가 세션 정보를 저장하지 않고, 클라이언트가 **토큰**을 저장**하게 합니다.  
즉, **JWT는 서버에서 세션을 유지하는 대신, 클라이언트에 토큰을 전달하고 그 토큰을 통해 인증을 관리**합니다.

- **세션 기반 인증**에서는 사용자가 로그인할 때, **서버에서 세션을 생성하고 그 세션 ID를 클라이언트에게 전달**합니다.
- **JWT 기반 인증**에서는 **서버에서 세션 정보를 저장하지 않고**, 사용자가 로그인할 때 **서버에서 JWT 토큰을 발급**하고 이를 클라이언트에게 전달합니다. 클라이언트는 이 토큰을 **로컬스토리지 또는 쿠키**에 저장하여 인증을 유지합니다.

---

## 🧠 JWT를 왜 사용하나요?

- **서버 부담 감소**: 세션 기반 인증은 **서버**가 **세션 데이터를 유지**해야 하므로, 서버의 **메모리 사용**이 많아집니다. 반면, **JWT는 클라이언트에 토큰을 저장**하므로, 서버의 부담이 적어집니다.
  
- **확장성**: JWT는 **분산 시스템**에서 유용합니다. 여러 서버 간에 **토큰을 공유**할 수 있어, **서버가 여러 대일 경우**에도 사용자의 인증 정보를 쉽게 **확인**할 수 있습니다.

- **보안성**: JWT는 **서명된 토큰**을 사용하므로, **토큰이 변조되었는지 확인**할 수 있습니다. 또한 **토큰에 만료 시간**을 설정하여, 토큰을 유효 기간이 지나면 **자동으로 만료**시키는 보안 기능을 제공합니다.

---

## 🔍 JWT의 구조

**JWT는 세 부분으로 나눠집니다:**

1. **헤더(Header)**  
   JWT는 **알고리즘**(예: `HS256`)과 **타입**(JWT) 정보를 포함합니다.
   - 예시: `{"alg": "HS256", "typ": "JWT"}`

2. **페이로드(Payload)**  
   페이로드는 **토큰의 본문**으로, 사용자의 정보(예: 사용자 ID, 이메일 등)를 포함합니다. 페이로드는 **암호화되지 않고** Base64Url로 **인코딩**되어 있습니다.
   - 예시: `{"user_id": 123, "username": "JohnDoe"}`

3. **서명(Signature)**  
   서명은 **헤더와 페이로드**를 **비밀 키**로 **서명**한 것입니다. 이를 통해 토큰이 **변조되지 않았는지 확인**할 수 있습니다.
   - 서명 생성 방식: `HMACSHA256(
       base64UrlEncode(header) + "." + base64UrlEncode(payload),
       secret)`
   - 예시: `signature`

이 세 가지 부분을 결합한 것이 바로 **JWT 토큰**입니다.

---

## 👀 JWT 작동 원리 시각화

```js
🧍 사용자: /login 요청 → 아이디와 비밀번호 입력
──────────────────────────────────────
↓
📦 서버:
  - 사용자의 아이디와 비밀번호 검증
  - JWT 토큰 생성 후 사용자에게 전송

🧍 사용자: /profile 페이지 접속 → JWT 토큰 포함된 요청 전송
──────────────────────────────────────
↓
📦 서버:
  - 요청에서 JWT 토큰을 확인
  - 서명 검증 후 유효성 체크
  - 사용자 정보 반환
```

---

## 🛠️ JWT를 이용한 세션 관리 구현

이제 **JWT를 이용한 로그인 시스템**을 어떻게 구현할 수 있는지 살펴보겠습니다. Express에서는 **`jsonwebtoken`** 라이브러리를 사용하여 **JWT 토큰을 쉽게 생성하고 검증**할 수 있습니다.

---

## 📦 실습 구조 예시

```js
📦 express-jwt-demo
 ┣ 📄 app.js                ← JWT 로그인 시스템 예제
 ┣ 📄 package.json          ← jsonwebtoken, express 포함
```

---

## 1️⃣ 설치하기

```bash
npm install express jsonwebtoken
```

---

## 2️⃣ 📄 app.js – JWT 기반 로그인 시스템 예제

```js
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

// POST 요청 처리를 위한 body-parser 내장 미들웨어
app.use(express.urlencoded({ extended: true }));

// 가상의 데이터베이스 (사용자 정보 저장)
const usersDB = [
  { id: 1, username: "JohnDoe", password: "password123" }
];

// 비밀 키 (실제로는 안전하게 관리해야 합니다)
const secretKey = "secret-key-1234";

/* -------------------------------------------------------------------
  [1] 로그인 폼 (GET 요청)
------------------------------------------------------------------- */
app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input name="username" placeholder="아이디 입력" />
      <input type="password" name="password" placeholder="비밀번호 입력" />
      <button type="submit">로그인</button>
    </form>
  `);
});

/* -------------------------------------------------------------------
  [2] 로그인 처리 (POST 요청)
  로그인하면 JWT 토큰을 발급
------------------------------------------------------------------- */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 사용자 확인 (가상의 데이터베이스에서 찾기)
  const user = usersDB.find((u) => u.username === username && u.password === password);

  if (user) {
    // JWT 토큰 생성
    const token = jwt.sign({ user_id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

    // 토큰을 클라이언트에 전송
    res.json({ message: "로그인 성공", token: token });
  } else {
    res.send("❌ 아이디나 비밀번호가 틀렸습니다.");
  }
});

/* -------------------------------------------------------------------
  [3] 사용자 상태 확인 (JWT 검증)
------------------------------------------------------------------- */
app.get("/profile", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.send("❌ 토큰이 없습니다.");
  }

  // JWT 검증
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.send("❌ 토큰이 유효하지 않습니다.");
    }

    // 유효한 토큰 → 사용자 정보 제공
    res.json({ message: `🙋 ${decoded.username}님, 환영합니다!` });
  });
});

// 서버 실행
app.listen(3000, () => {
  console.log("🔐 JWT Login demo server running at http://localhost:3000");
});
```

---

## 📊 JWT 로그인 시스템 흐름 요약 시각화

```js
[1] GET /login
────────────────────────
HTML 로그인 폼 응답

[2] POST /login
────────────────────────
- req.body.username, req.body.password 추출
- 데이터베이스에서 사용자 확인
- JWT 토큰 생성 후 클라이언트에 전달

[3] GET /profile
────────────────────────
- 클라이언트가 JWT 토큰을 Authorization 헤더에 포함해 요청
- 서버는 JWT 토큰을 검증하고, 유효한 경우 사용자 정보 응답
```

---

## 🧪 실제 JWT 요청 확인 (브라우저 개발자 도구)

```http
GET /profile HTTP/1.1
Host: localhost:3000
Authorization: Bearer <JWT_TOKEN>
```

> JWT 토큰을 **Authorization** 헤더에 포함시켜 서버에 요청하고, 서버는 이 토큰을 검증하여 사용자 정보를 반환합니다.

---

## 🔐 보안 팁 – JWT 안전하게 사용하기

| 설정 | 설명 | 추천 여부 |
|------|------|-----------|
| `secretKey` | JWT 서명에 사용할 비밀 키입니다. 이 키는 외부에 공개되지 않도록 안전하게 관리해야 합니다. | ✅ 절대 외부에 공개하지 않음 |
| `expiresIn` | JWT 토큰의 만료 시간을 설정합니다. 만료 시간이 지나면, 토큰은 더 이상 유효하지 않습니다. | ✅ 적절한 만료 시간 설정 (`1h`, `24h` 등) |
| `httpOnly` | 토큰을 **쿠키**에 저장할 때 사용합니다. 클라이언트 측에서 **자바스크립트**로 쿠키에 접근할 수 없도록 설정할 수 있습니다. | ✅ 필수 사용 |

---

## ✅ Express에서 JWT 관련 메서드 정리

| 속성/메서드 | 설명 | 예시 |
|-------------|------|------|
| `jwt.sign()` | JWT 토큰 생성 | `jwt.sign(payload, secretKey, { expiresIn: '1h' })` |
| `jwt.verify()` | JWT 토큰 검증 | `jwt.verify(token, secretKey)` |

---

## 🔚 마무리 요약

| 개념 | 설명 |
|------|------|
| JWT란? | 서버가 세션 정보를 저장하는 대신, 클라이언트가 **토큰**을 통해 인증을 관리하는 시스템 |
| JWT의 구조 | 헤더, 페이로드, 서명으로 구성되며, 클라이언트와 서버 간에 인증 정보를 안전하게 전달 |
| JWT의 장점 | 서버 부담 감소, 확장성, 보안성 강화 |
| Express 구현 | `jsonwebtoken`을 사용하여 JWT 토큰 생성 및 검증 |
| 보안 관리 | `secretKey`, `expiresIn` 등의 설정을 통해 보안성 강화 |
