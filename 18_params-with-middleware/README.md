# 18. Params with Middleware

## ✅ 개요: `app.param()`이란?

- 특정 `:param`이 URL에 포함되어 있을 때, **자동으로 실행되는 미들웨어**를 정의합니다.
- 해당 param 값을 사용하여 DB 조회, 권한 검증 등의 전처리 작업을 수행할 수 있습니다.
- 결과를 `req` 객체에 담아 후속 라우트에서 쉽게 사용할 수 있게 합니다.

---

## 🛠 전체 코드

```js
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
    "1": { id: 1, name: "Alice", role: "Admin" },
    "2": { id: 2, name: "Bob", role: "User" },
  };
  return users[id];
}

// ✅ 서버 실행
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
```

---

## 🧭 실제 동작 흐름 시각화

### 🎯 요청: `GET /users/1`

```js
클라이언트 요청: GET /users/1
│
├─ app.param("userId", ...)
│   └─ id = "1"
│   └─ getUserById("1") → { id: 1, name: "Alice", role: "Admin" }
│   └─ req.user = { id: 1, name: "Alice", ... }
│   └─ next()
│
├─ app.get("/users/:userId")
│   └─ res.send(req.user)
│
└─ 응답:
{
  "id": 1,
  "name": "Alice",
  "role": "Admin"
}
```

---

### 🎯 요청: `GET /blogs/2`

```js
클라이언트 요청: GET /blogs/2
│
├─ app.param("userId", ...)
│   └─ id = "2"
│   └─ getUserById("2") → { id: 2, name: "Bob", role: "User" }
│   └─ req.user = { id: 2, name: "Bob", ... }
│   └─ next()
│
├─ app.get("/blogs/:userId")
│   └─ res.send({
│         message: "Bob님의 블로그입니다.",
│         user: req.user
│       })
│
└─ 응답:
{
  "message": "Bob님의 블로그입니다.",
  "user": {
    "id": 2,
    "name": "Bob",
    "role": "User"
  }
}
```

---

### 🔥 요청: `GET /users/999` → 사용자 없음

```js
클라이언트 요청: GET /users/999
│
├─ app.param("userId", ...)
│   └─ getUserById("999") → undefined
│   └─ return res.status(404).send("User not found")
│
└─ 요청 종료됨 (라우트 실행되지 않음)
```

---

## 🧠 실무 개념 비유

| 구조 | 비유 |
|------|------|
| `app.param("userId", fn)` | 모든 경로에 공통 적용되는 **미리 사용자 정보 조회 시스템** |
| `req.user` | 사용자의 정보 카드: 이후 로직에서 언제든 꺼내 쓸 수 있음 |
| 재사용성 | 한 번 정의한 파라미터 처리 미들웨어를 다양한 라우트에서 **중복 없이 재사용** 가능 |

---

## 📘 주요 개념 요약

| 용어 | 설명 |
|------|------|
| `:userId` | 라우트 경로의 동적 파라미터 |
| `app.param()` | 해당 파라미터가 포함된 요청마다 자동 실행되는 전처리 미들웨어 |
| `req.params.userId` | URL에서 추출한 실제 파라미터 값 |
| `req.user` | 전처리된 사용자 정보 저장소 |
| 재사용성 | 모든 라우트에서 `:userId`가 들어오면 같은 미들웨어가 실행됨 |

---

## ✅ 직접 테스트 주소

| 요청 URL | 설명 |
|----------|------|
| `http://localhost:3000/users/1` | 사용자 Alice 정보 |
| `http://localhost:3000/blogs/2` | 사용자 Bob의 블로그 |
| `http://localhost:3000/users/999` | 존재하지 않는 사용자 (404 응답) |

---

## 🔧 확장 아이디어

- `app.param()`으로 사용자 인증 미들웨어 구현하기
- `req.user.role === "Admin"`을 활용한 관리자 전용 라우트 분기
- 블로그 외에도 댓글, 장바구니, 주문 등으로 재사용 가능


