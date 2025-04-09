# 29. Router 백화점 만들기 – 기능 단위 모듈화

---

## 🧠 기능별 모듈화란?

Express 서버가 커질수록 라우터를 분리하는 것만으로는 부족합니다.  
이제는 `기능 단위(부서별)`로 완전히 독립적인 라우터를 만들고,  
모든 요청 흐름을 **백화점 구조처럼 체계적으로 관리**해야 합니다.

---

## 🧩 실습 구조 (백화점 부서 예시)

```
📦 router-department-store
 ┣ 📄 app.js                ← 전체 백화점 입구
 ┣ 📂routes
 ┃ ┣ 📄 index.js           ← 백화점 메인 안내 데스크
 ┃ ┣ 📄 clothing.js        ← 의류 부서
 ┃ ┣ 📄 electronics.js     ← 전자제품 부서
 ┃ ┗ 📄 food.js            ← 식품 부서
```

---

## 1️⃣ 📄 app.js – 전체 백화점 입구

```js
// 1. Express 모듈을 불러옵니다.
const express = require("express");

// 2. Express 애플리케이션 객체(app)를 생성합니다.
//    → 이 객체는 웹 서버 역할을 하며,
//      우리가 만든 라우터들을 '입구'에서 연결해주는 역할을 합니다.
const app = express();

// 3. 요청 본문에 JSON 데이터가 들어오는 경우,
//    이를 JS 객체로 자동 변환해주는 미들웨어를 등록합니다.
app.use(express.json());

// 4. 폼 데이터 전송 시 (application/x-www-form-urlencoded)의 본문도 파싱할 수 있도록 설정합니다.
app.use(express.urlencoded({ extended: true }));

// 5. 기능(부서)별 라우터 파일을 불러옵니다.
//    → 각각의 부서가 맡고 있는 요청을 처리하는 '담당 부서'라고 보면 됩니다.
const indexRouter = require("./routes/index"); // 메인 홈페이지 담당 라우터
const clothingRouter = require("./routes/clothing"); // 의류 부서 라우터
const electronicsRouter = require("./routes/electronics"); // 전자제품 부서 라우터
const foodRouter = require("./routes/food"); // 식품 부서 라우터

// 6. app.use()로 경로별 라우터를 연결합니다.
//    → 어떤 URL로 요청이 들어오느냐에 따라, 해당 부서로 요청을 '분기'시킵니다.
app.use("/", indexRouter); // "/"로 들어오는 요청은 홈페이지 안내 데스크로 전달
app.use("/clothing", clothingRouter); // "/clothing"은 의류 부서에서 처리
app.use("/electronics", electronicsRouter); // "/electronics"는 전자제품 부서에서 처리
app.use("/food", foodRouter); // "/food"는 식품 부서에서 처리

// 7. 3000번 포트에서 서버를 시작합니다.
app.listen(3000, () => {
  console.log("Department store app listening at http://localhost:3000");
});
```

---

## 2️⃣ 📄 routes/index.js – 메인 안내 데스크

```js
// 1. Express 모듈을 불러옵니다.
const express = require("express");

// 2. Router 객체를 생성합니다.
//    → Router는 미니 앱(mini express app)처럼 동작합니다.
//      - 라우팅: URL 경로에 따라 요청을 처리할 수 있고
//      - 미들웨어 등록도 가능하며
//      - 최종적으로 app.js에 연결되어 작동합니다.
const router = express.Router();

// 3. 홈페이지 요청이 들어올 때 공통으로 작동하는 미들웨어를 설정합니다.
router.use((req, res, next) => {
  console.log("백화점 홈페이지입니다..."); // 콘솔 로그 출력
  next(); // 다음 핸들러 또는 라우터로 요청을 넘깁니다.
});

// 4. [GET] / 요청이 들어오면 홈페이지 메시지를 응답합니다.
router.get("/", (req, res) => {
  res.send("Welcome to the Department Store!");
});

// 5. 이 라우터 객체를 외부로 내보냅니다.
//    → app.js에서 require로 불러올 수 있게 됩니다.
module.exports = router;
```

---

## 3️⃣ 📄 routes/clothing.js – 의류 부서 라우터

```js
const express = require("express");
const router = express.Router();

// 모든 의류 관련 요청 전에 실행되는 공통 미들웨어입니다.
router.use((req, res, next) => {
  console.log("의류 부서 라우터입니다...");
  next();
});

// [GET] /clothing
// → 옷 목록을 보여주는 요청
router.get("/", (req, res) => {
  res.send("의류 부서: 옷 목록");
});

// [POST] /clothing/add
// → 새 옷을 추가하는 요청
router.post("/add", (req, res) => {
  // 실제로는 req.body를 통해 받아온 데이터를 DB에 저장하는 로직이 들어갈 수 있습니다.
  res.send("의류 부서: 새 옷 추가");
});

// [PUT] /clothing/update/:id
// → 특정 ID의 옷 정보를 수정하는 요청
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  res.send(`의류 부서: ID ${id}의 옷 정보 수정`);
});

// [DELETE] /clothing/delete/:id
// → 특정 ID의 옷을 삭제하는 요청
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  res.send(`의류 부서: ID ${id}의 옷 삭제`);
});

module.exports = router;
```

---

## 4️⃣ 📄 routes/electronics.js – 전자제품 부서 라우터

```js
const express = require("express");
const router = express.Router();

// 전자제품 부서에 들어오는 모든 요청 전 실행되는 공통 미들웨어
router.use((req, res, next) => {
  console.log("전자제품 부서 라우터입니다...");
  next();
});

// [GET] /electronics
router.get("/", (req, res) => {
  res.send("전자제품 부서: 전자제품 목록");
});

// [POST] /electronics/add
router.post("/add", (req, res) => {
  res.send("전자제품 부서: 새 전자제품 추가");
});

// [PUT] /electronics/update/:id
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  res.send(`전자제품 부서: ID ${id}의 전자제품 정보 수정`);
});

// [DELETE] /electronics/delete/:id
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  res.send(`전자제품 부서: ID ${id}의 전자제품 삭제`);
});

module.exports = router;
```

---

## 5️⃣ 📄 routes/food.js – 식품 부서 라우터

```js
const express = require("express");
const router = express.Router();

// 식품 부서 요청 전 공통 미들웨어
router.use((req, res, next) => {
  console.log("식품 부서 라우터입니다...");
  next();
});

// [GET] /food
router.get("/", (req, res) => {
  res.send("식품 부서: 식품 목록");
});

// [POST] /food/add
router.post("/add", (req, res) => {
  res.send("식품 부서: 새 식품 추가");
});

// [PUT] /food/update/:id
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  res.send(`식품 부서: ID ${id}의 식품 정보 수정`);
});

// [DELETE] /food/delete/:id
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  res.send(`식품 부서: ID ${id}의 식품 삭제`);
});

module.exports = router;
```

---

## 🧠 router는 어떤 역할을 하나요?

- `express.Router()`는 **미니 앱 객체**입니다.
- 하나의 독립된 URL 집합(=부서)에서 필요한 모든 처리를 담아둘 수 있습니다.
- 이 router는 `app.js`에 연결되기 전까지는 외부 요청을 직접 처리하지 않고, **서브 경로에 대한 책임만 맡습니다.**
- 이렇게 기능별로 라우터를 나누면 유지보수와 관리가 훨씬 쉬워집니다.

---

## 🔄 전체 흐름 시각화 – 실제 백화점 상황을 상상해봅시다!

### 🛍️ 상황 시나리오:

어느 날 고객이 백화점 웹사이트에 방문합니다.  
그 고객은 홈페이지에 들렀다가, 전자제품 코너에 가서 냉장고를 보고,  
옷 코너에 가서 셔츠를 추가하고, 마지막으로 식품 코너에서 과일을 삭제합니다.

이때 Express 앱 내부에서는 다음과 같은 흐름이 일어납니다:

---

### 📡 전체 흐름 다이어그램

```
 👤 사용자가 브라우저에서 여러 경로로 요청을 보냅니다
─────────────────────────────────────────────────────────
          1️⃣ GET /
          2️⃣ GET /electronics
          3️⃣ POST /clothing/add
          4️⃣ DELETE /food/delete/9
─────────────────────────────────────────────────────────
↓
↓
↓
📦 app.js (백화점 정문) ← 모든 요청이 여기로 먼저 들어옵니다
─────────────────────────────────────────────────────────
          ↓ 요청 경로 판별
          ├── "/"             → routes/index.js (홈 안내)
          ├── "/clothing"     → routes/clothing.js (의류 부서)
          ├── "/electronics"  → routes/electronics.js (전자 부서)
          └── "/food"         → routes/food.js (식품 부서)
─────────────────────────────────────────────────────────

🎯 분기 후 흐름 (요청별 시각화)
─────────────────────────────────────────────────────────

[GET /] →
  🏬 app.js
      → indexRouter 연결
          → index.js:
              - "백화점 홈페이지입니다..." 로그 출력
              - Welcome 메시지 응답

─────────────────────────────────────────────────────────

[GET /electronics] →
  🏬 app.js
      → electronicsRouter 연결
          → electronics.js:
              - "전자제품 부서 라우터입니다..." 로그 출력
              - 전자제품 목록 응답

─────────────────────────────────────────────────────────

[POST /clothing/add] →
  🏬 app.js
      → clothingRouter 연결
          → clothing.js:
              - "의류 부서 라우터입니다..." 로그 출력
              - 옷 추가 완료 응답

─────────────────────────────────────────────────────────

[DELETE /food/delete/9] →
  🏬 app.js
      → foodRouter 연결
          → food.js:
              - "식품 부서 라우터입니다..." 로그 출력
              - ID 9번 식품 삭제 완료 응답
```

---

### 🎯 시각적 정리 요약

```
┌─────────────────────────────────────┐
│           💻 브라우저 요청           │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         app.js (요청 진입점)         │
└─────────────────────────────────────┘
              │
      ┌───────┼────────┬────────┬────────┐
      ▼       ▼        ▼        ▼
  index.js  clothing.js electronics.js food.js
   ("/")     ("/clothing")   ("/electronics")   ("/food")
      ▼         ▼              ▼              ▼
 응답: 홈페이지 응답: 의류 응답 응답: 전자 응답: 식품
```

---

## 🧠 마무리 정리

| 개념           | 설명                                                            |
| -------------- | --------------------------------------------------------------- |
| 모듈별 라우터  | 기능별로 파일을 완전히 분리함 (예: `/clothing`, `/electronics`) |
| `router.use()` | 요청 전 공통 처리 가능 (예: 로그 남기기)                        |
| CRUD 구성      | 각 부서별로 [GET, POST, PUT, DELETE] 라우터 완비                |
| 전체 흐름      | app.js → 부서별 라우터 연결 → 경로 분기 처리                    |





