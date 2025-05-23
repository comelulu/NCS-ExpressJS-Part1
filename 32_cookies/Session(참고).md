# 🔐 세션(Session)과 로그인 상태 유지 – Express에서 사용자 기억하기

---

## 📦 세션(Session)이란?

세션은 **서버가 사용자의 상태를 기억**하는 방식입니다.  
쿠키는 정보를 **브라우저가 저장**하는 반면,  
세션은 정보를 **서버가 저장**하고, 클라이언트는 **"세션 키"만 들고 다닙니다.**

---

## 🧠 세션을 왜 쓰나요?

앞에서 배운 쿠키는 브라우저에 데이터를 저장하기 때문에:

- 사용자가 쿠키를 **수정하거나 위조**할 수 있음
- `민감한 정보(예: 로그인 정보)`를 저장하기에는 **보안에 취약**

➡ **세션은 민감한 정보를 서버 쪽에만 저장하기 때문에 더 안전합니다.**

---

## 🔍 `req.session`과 `connect.sid`란 무엇일까요?

### 💡 세션 ID와 세션 저장소

- **`req.session`**: **서버에서 사용자의 상태**를 저장하는 객체입니다.  
  이 객체는 사용자가 요청할 때마다 **서버에서 사용자를 구별하기 위한 정보를** 담고 있어요.

- **`connect.sid`**: **세션 ID**가 저장된 쿠키입니다.  
  서버는 이 **세션 ID**를 통해 사용자와 관련된 세션 데이터를 찾아요.

### 🧾 세션 데이터 예시

세션은 **서버 메모리**에 다음과 같이 저장됩니다:

```js
세션 ID: abc123
세션 데이터:
  {
    user: "John Doe",
    isLoggedIn: true,
    lastVisit: "2023-04-01T12:00:00"
  }
```

### 🧪 실제 HTTP 요청에선 어떻게 보일까요?

세션이 설정되면, 브라우저는 아래와 같은 쿠키를 자동으로 서버에 보냅니다:

```js
GET /profile HTTP/1.1
Host: localhost:3000
Cookie: connect.sid=s%3A4FuY...zJm.Q7dN...
```

> ✅ `connect.sid=...` 이 부분이 브라우저가 들고 다니는 **세션 ID 쿠키**입니다.  
> 이 ID를 바탕으로 서버는 해당 사용자의 상태(예: 로그인 여부, 이름 등)를 찾아냅니다.

---

## 👀 세션 작동 방식 시각화

```js
🧍 사용자: 처음으로 /login 요청 → 로그인 성공
──────────────────────────────────────
↓
📦 서버:
  - 세션 저장소에 사용자 정보 저장 (예: req.session.user)
  - 브라우저에 세션ID 쿠키(connect.sid) 발급

🧍 사용자: /profile 페이지 접속
──────────────────────────────────────
↓
🌐 브라우저:
  - 자동으로 connect.sid 쿠키 포함해 요청 전송
↓
📦 서버:
  - 세션ID로 사용자 정보 조회
  - 로그인 상태로 인식 후 응답
```

---

## 🍪 세션 vs 쿠키 – 핵심 비교

| 항목 | 쿠키 (Cookie) | 세션 (Session) |
|------|----------------|----------------|
| 저장 위치 | 클라이언트(브라우저) | 서버 |
| 민감 정보 저장 | ❌ 위험함 | ✅ 안전함 |
| 전송 방식 | 모든 요청에 자동 전송 | 쿠키 통해 ID만 전송 |
| 상태 유지 | 사용자가 직접 보관 | 서버가 기억 |
| 보안성 | 비교적 낮음 | 상대적으로 높음 |

---

## 🛠️ Express에서 세션 사용하기

Express에서는 **`express-session`** 미들웨어를 사용하여 세션을 매우 간편하게 관리할 수 있습니다.

---

## 📦 실습 구조 예시

```js
📦 express-session-demo
 ┣ 📄 app.js                 ← 로그인 세션 예제
 ┣ 📄 package.json           ← express-session 포함
```

---

## 1️⃣ 설치하기

```bash
npm install express-session
```

---

## 2️⃣ 📄 app.js – 세션 기반 로그인 상태 예제

```js
const express = require("express");
const session = require("express-session");

const app = express();

// POST 요청 처리를 위한 body-parser 내장 미들웨어
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------------------------------
  [1] 세션 미들웨어 설정
------------------------------------------------------------------- */
app.use(
  session({
    secret: "secret-key-1234",  // 🔐 세션 암호화용 키 (절대 공개 X)
    resave: false,              // 매 요청마다 세션을 저장할지 여부
    saveUninitialized: true,   // 로그인 하지 않아도 세션 생성할지 여부
    cookie: {
      httpOnly: true,          // JS에서 접근 불가 (보안)
      maxAge: 1000 * 60 * 10,  // 세션 유지 시간: 10분
    },
  })
);

/* -------------------------------------------------------------------
  [2] 로그인 폼 (GET 요청)
------------------------------------------------------------------- */
app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input name="username" placeholder="이름 입력" />
      <button type="submit">로그인</button>
    </form>
  `);
});

/* -------------------------------------------------------------------
  [3] 로그인 처리 (POST 요청)
  로그인하면 세션에 사용자 정보 저장
------------------------------------------------------------------- */
app.post("/login", (req, res) => {
  const username = req.body.username;

  // 사용자의 이름을 세션에 저장
  req.session.user = username;

  res.send(`✅ 로그인 성공! <a href="/profile">프로필 보기</a>`);
});

/* -------------------------------------------------------------------
  [4] 사용자 상태 확인 (세션 확인)
------------------------------------------------------------------- */
app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.send(`🙋 ${req.session.user}님, 환영합니다! <a href="/logout">로그아웃</a>`);
  } else {
    res.send("❌ 로그인되지 않았습니다. <a href='/login'>로그인</a>");
  }
});

/* -------------------------------------------------------------------
  [5] 로그아웃 처리 – 세션 제거
------------------------------------------------------------------- */
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("👋 로그아웃 되었습니다. <a href='/login'>다시 로그인</a>");
  });
});

// 서버 실행
app.listen(3000, () => {
  console.log("🔐 Session demo server running at http://localhost:3000");
});
```

---

## 📊 세션 흐름 요약 시각화

```js
[1] GET /login
────────────────────────
HTML 폼 응답

[2] POST /login
────────────────────────
- req.body.username 추출
- req.session.user = username 저장
- connect.sid 쿠키 생성됨

[3] GET /profile
────────────────────────
- 쿠키에 저장된 세션ID → 서버가 세션 정보 조회
- 사용자 인식 성공 → 환영 메시지 응답

[4] GET /logout
────────────────────────
- 세션 삭제 → connect.sid 무효화
```

---

## 🧪 실제 세션 요청 확인 (브라우저 개발자 도구)

```http
GET /profile HTTP/1.1
Host: localhost:3000
Cookie: connect.sid=s%3A4FuY...zJm.Q7dN...
```

> 이처럼 `connect.sid=...`가 쿠키로 전송되고,  
> 서버는 세션 ID를 이용해 해당 사용자의 상태를 조회합니다.

---

## 🔐 보안 팁 – 세션 안전하게 쓰기

| 설정 | 설명 | 추천 여부 |
|------|------|-----------|
| `secret` | 세션 데이터의 서명(암호화)을 위한 키. 절대 깃헙에 올리지 마세요. | ✅ 항상 사용 |
| `httpOnly` | JavaScript에서 쿠키 접근 차단. XSS 공격 방지용 필수. | ✅ 항상 true |
| `secure` | HTTPS에서만 쿠키 전송 (배포 시 필수). | ✅ 운영 환경에서 필수 |
| `sameSite` | 다른 사이트에서 자동 요청 차단 (CSRF 방지) | ✅ `Lax` 또는 `Strict` 권장 |
| `maxAge` | 세션 만료 시간 설정 (짧게 유지할수록 보안상 유리). | ✅ 필수 사용 |

---

## ✅ Express에서 세션 관련 메서드 정리

| 속성/메서드 | 설명 | 예시 |
|-------------|------|------|
| `req.session` | 세션 저장소 | `req.session.user = "Tom"` |
| `req.session.user` | 사용자 정보 저장/조회 | 로그인 여부 확인에 사용 |
| `req.session.destroy()` | 세션 제거 | 로그아웃 시 사용 |

---

## 🔚 마무리 요약

| 개념 | 설명 |
|------|------|
| 세션이란? | 서버가 사용자의 상태를 기억하는 저장소 |
| 동작 방식 | 서버에 사용자 상태 저장 + 브라우저는 ID만 쿠키로 전송 |
| 쿠키와 차이 | 쿠키는 브라우저 저장, 세션은 서버 저장 |
| Express 구현 | `express-session`으로 세션 쉽게 관리 |
| 보안 관리 | secret, httpOnly, secure, maxAge 등 필수 설정 필요 |

---

📌 **다음 주제로 이어질 수 있어요:**
- 🛡️ **세션을 활용한 로그인 시스템 구현**
- 🔒 **비밀번호 암호화와 세션 연동**

계속 진행할까요? 😄