# 28. Router란? – 기능별 라우터 분리 기초 (with `express.Router()`)

---

## 🧠 Router란 무엇인가요?

Express에서 **라우터(router)**는  
웹 브라우저의 요청(GET, POST 등)에 따라 **서버가 어떤 동작을 해야 하는지 결정하는 분기 처리 시스템**입니다.

---

### 📍 간단한 라우팅 예시

```js
app.get("/", (req, res) => {
  res.send("홈페이지입니다");
});
```

위 코드는 사용자가 `/` 주소로 GET 요청을 보냈을 때,  
"홈페이지입니다"라는 텍스트를 응답해주는 구조입니다.

---

## ❓ 그런데 왜 router를 따로 분리하나요?

작은 규모의 프로젝트라면 `app.js` 하나에 모든 라우트를 작성해도 괜찮습니다.  
그러나 실제 운영 환경처럼 규모가 커질수록 기능별로 URL이 다양해지고 분리되어야 합니다:

- `/users` → 사용자 관리
- `/products` → 상품 관리
- `/admin` → 관리자 기능

이러한 모든 요청을 하나의 `app.js` 파일에 작성하면 다음과 같이 됩니다:

```js
app.get("/users", ...)
app.post("/users", ...)
app.get("/products", ...)
app.put("/products/:id", ...)
app.get("/admin/dashboard", ...)
```

이처럼 코드가 복잡해지면 유지보수가 매우 어렵고 오류 가능성도 커집니다.

따라서 Express는 이러한 문제를 해결하기 위해  
**`express.Router()`** 라는 기능을 제공합니다.

---

## 🎯 `express.Router()`란?

`Router()`는 Express가 제공하는 내장 도구로서,  
기능별로 라우트를 **작은 단위로 나누어 관리**할 수 있도록 해줍니다.  
이 라우터는 **작은 Express 앱처럼 동작**하며, 해당 기능과 관련된 경로들만 담당하게 됩니다.

---

### 🔧 비유로 설명하면?

> 🏢 전체 애플리케이션(app) = 건물 전체  
> 🪪 각 router = 해당 건물의 부서 사무실  
>  
> 예를 들어 `usersRouter`는 사용자 관련 요청만 처리하는 부서이며,  
> `app`은 그 부서를 `/users`라는 입구에 연결해주는 관리자 역할을 합니다.

---

## ✅ `express.Router()` 기본 문법(Syntax)

```js
// ① express 불러오기
const express = require("express");

// ② router 객체 생성
const router = express.Router();

// ③ 요청 처리 등록
router.get("/", (req, res) => {
  res.send("GET 요청 처리");
});

router.post("/", (req, res) => {
  res.send("POST 요청 처리");
});

// ④ 외부에서 사용할 수 있도록 router 내보내기
module.exports = router;
```

---

## 📦 실습 폴더 구조 예시

```js
📦 router-app
 ┣ 📄 app.js               ← 메인 서버 파일
 ┣ 📂routes
 ┃ ┗ 📄 users.js           ← /users 관련 라우터 정의
```

---

## 1️⃣ 📄 routes/users.js – 사용자 기능 전담 라우터

```js
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

```

---

## 2️⃣ 📄 app.js – 라우터 등록

```js
const express = require("express");
const app = express();

// 🔽 users 라우터 불러오기
const usersRouter = require("./routes/users");
```

### ✅ ✨ 핵심 문장: `app.use("/users", usersRouter)`의 의미

```js
app.use("/users", usersRouter);
```

위 코드는 다음과 같은 의미를 가집니다:

| 부분 | 의미 |
|------|------|
| `app.use(...)` | 미들웨어 또는 라우터를 등록하는 메서드입니다. |
| `"/users"` | `/users`로 시작하는 모든 요청에 대해 아래 라우터를 적용하겠다는 의미입니다. |
| `usersRouter` | `routes/users.js` 파일에서 정의한 라우터 객체입니다. 이 객체는 실제 경로와 처리 방식을 포함합니다. |

---

### 🧠 실제 요청 처리 흐름 예시

```js
[브라우저 요청] GET /users
    ↓
[app] /users 경로인지 확인
    ↓
[usersRouter] 내부에서 처리
    ↓
→ router.get("/") 실행됨
```

---

## 🔧 app.js 전체 코드 정리

```js
// express 모듈을 불러옵니다.
const express = require("express");

// express 애플리케이션 객체를 생성합니다.
const app = express();

// 외부에 정의된 users 라우터 모듈을 불러옵니다.
// './routes/users' 경로의 파일에서 router 객체를 가져옵니다.
const usersRouter = require("./routes/users");

// app.use(경로, 라우터객체)
// "/users"로 시작하는 모든 요청을 usersRouter에게 위임합니다.
// 예: "/users", "/users/123" 등은 모두 usersRouter에서 처리됩니다.
app.use("/users", usersRouter);

// 루트 경로("/")에 대한 GET 요청을 처리합니다.
// 브라우저에서 http://localhost:3000/ 로 접속하면 "Hello"라는 응답을 반환합니다.
app.get("/", (req, res) => {
  res.send("Hello");
});

// 서버를 3000번 포트에서 실행합니다.
// 브라우저에서 http://localhost:3000 으로 접속 가능하게 됩니다.
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

---

## 🔄 테스트 동작 흐름

| 요청 URL | 실제 처리 위치 |
|----------|----------------|
| `GET /` | app.js의 `app.get("/")`에서 처리 |
| `GET /users` | users.js의 `router.get("/")`에서 처리 |
| `GET /users/abc123` | users.js의 `router.get("/:userId")`에서 처리 |
| `POST /users` | users.js의 `router.post("/")`에서 처리 |

---

## 📊 핵심 요약 정리

| 개념 | 설명 |
|------|------|
| `express.Router()` | Express에서 라우터를 파일 단위로 분리해주는 내장 도구입니다. |
| `router.get()` 등 | 특정 경로 요청에 대해 동작을 지정합니다. |
| `module.exports = router` | 작성한 라우터를 외부에서 사용할 수 있게 내보냅니다. |
| `app.use("/경로", router)` | 해당 경로로 시작하는 요청은 특정 라우터가 처리하도록 연결합니다. |
| `req.params` | URL 경로 내의 파라미터(`:id` 등)를 추출하는 데 사용합니다. |

---

## ✅ 마무리 정리

`express.Router()`는  
대규모 서버에서 **기능별 파일 구조로 코드를 나누고**,  
**유지보수와 확장성을 높이는 데 핵심적인 설계 방식**입니다.

이제 여러분은 단일 파일 구조가 아닌,  
- 기능별 모듈형 라우터 구조  
- 라우터 객체를 생성하고 연결하는 흐름  
- 경로 별 분리 설계
를 모두 이해하셨습니다!
