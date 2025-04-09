# 21. Express 201 Setup: 백화점 부서 라우팅 시스템

## 🏬 프로젝트 개요

이 프로젝트는 Express.js를 활용하여 하나의 백화점 내에 여러 개의 부서를 구성하고, 각 부서별로 라우팅을 분리하여 관리하는 방식으로 설계되어 있습니다. 실생활의 **백화점 부서 시스템**을 비유로 사용하여 라우터의 개념을 쉽게 이해할 수 있도록 구성되어 있습니다.

---

## 📁 전체 폴더 구조 시각화

```
📁 routes/
   ├── index.js           👉 백화점 메인 입구
   ├── clothing.js        👉 의류 부서
   ├── electronics.js     👉 전자제품 부서
   └── food.js            👉 식품 부서
📄 app.js                 👉 백화점 전체 서버의 입구
```

---

## 1. 📄 `app.js` – 백화점 본관 입구

```js
const express = require("express");
const app = express();

// 요청 바디 파싱을 위한 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

위 코드는 Express 애플리케이션을 생성한 뒤, 클라이언트로부터 들어오는 JSON 및 URL 인코딩된 데이터를 파싱하기 위한 미들웨어를 설정하는 부분입니다. 예를 들어, 고객이 상품 주문서를 제출했을 때, 이를 서버가 읽을 수 있도록 도와주는 기능입니다.

```js
// 부서별 라우터 모듈 불러오기
const indexRouter = require("./routes/index");
const clothingRouter = require("./routes/clothing");
const electronicsRouter = require("./routes/electronics");
const foodRouter = require("./routes/food");
```

이 부분에서는 각 부서에 해당하는 라우터를 불러오고 있습니다. 각 라우터는 독립적인 mini-app처럼 작동하여 해당 부서의 요청만 처리하게 됩니다.

```js
// 라우터 사용 설정
app.use("/", indexRouter);
app.use("/clothing", clothingRouter);
app.use("/electronics", electronicsRouter);
app.use("/food", foodRouter);
```

라우터를 실제 경로에 연결하는 구간입니다. 예를 들어 `/clothing` 경로로 요청이 들어오면, `clothing.js` 라우터가 동작하게 됩니다.

```js
app.listen(3000, () => {
  console.log("Department store app listening at http://localhost:3000");
});
```

서버는 포트 3000번에서 실행되며, 브라우저에서 해당 주소로 접근할 수 있습니다.

---

## 2. 🏠 `routes/index.js` – 백화점 메인 입구

```js
router.use((req, res, next) => {
  console.log("백화점 홈페이지입니다...");
  next();
});

router.get("/", (req, res) => {
  res.send("Welcome to the Department Store!");
});
```

이 모듈은 루트 경로(`/`)에 대한 요청을 처리합니다. 모든 요청에 대해 먼저 인사 메시지를 출력하고, 이후 클라이언트에게 환영 메시지를 응답으로 전달합니다.

---

## 3. 🧥 `routes/clothing.js` – 의류 부서

```js
router.use((req, res, next) => {
  console.log("의류 부서 라우터입니다...");
  next();
});
```

이 라우터는 `/clothing`으로 시작하는 모든 요청에 대해 먼저 "의류 부서입니다..."라는 로그를 출력합니다.

```js
router.get("/", (req, res) => {
  res.send("의류 부서: 옷 목록");
});

router.post("/add", (req, res) => {
  res.send("의류 부서: 새 옷 추가");
});

router.put("/update/:id", (req, res) => {
  res.send(`의류 부서: ID ${req.params.id}의 옷 정보 수정`);
});

router.delete("/delete/:id", (req, res) => {
  res.send(`의류 부서: ID ${req.params.id}의 옷 삭제`);
});
```

- GET `/clothing` → 옷 목록을 조회합니다.  
- POST `/clothing/add` → 새 옷을 추가합니다.  
- PUT `/clothing/update/:id` → 특정 ID의 옷 정보를 수정합니다.  
- DELETE `/clothing/delete/:id` → 특정 ID의 옷을 삭제합니다.

---

## 4. 📺 `routes/electronics.js` – 전자제품 부서

전자 부서 라우터도 위와 동일한 구조를 가지고 있으며, 전자제품과 관련된 요청을 처리합니다.

- `/electronics` → 전자제품 목록  
- `/electronics/add` → 새 전자제품 추가  
- `/electronics/update/:id` → 정보 수정  
- `/electronics/delete/:id` → 제품 삭제  

각 요청 시 `"전자제품 부서 라우터입니다..."`라는 로그가 출력됩니다.

---

## 5. 🍎 `routes/food.js` – 식품 부서

식품 부서 라우터도 동일한 구조로 동작합니다.

- `/food` → 식품 목록 조회  
- `/food/add` → 새 식품 추가  
- `/food/update/:id` → 식품 정보 수정  
- `/food/delete/:id` → 식품 삭제  

각 요청 시 `"식품 부서 라우터입니다..."` 로그가 출력됩니다.

---

## 🧠 라우팅 흐름 시각화 예시

고객이 다음과 같이 요청했다고 가정합니다:

```
[요청] PUT http://localhost:3000/clothing/update/3
```

### 흐름 구조

```js
클라이언트
   ↓
app.js
   ↓ app.use("/clothing", clothingRouter)
routes/clothing.js
   ↓ router.use → "의류 부서 라우터입니다..." 로그
   ↓ router.put("/update/:id") 실행
   ↓ 응답: "의류 부서: ID 3의 옷 정보 수정"
```

---

## 📌 핵심 학습 정리

| 개념 | 설명 | 비유 |
|------|------|------|
| `express.Router()` | 부서별로 요청을 관리하는 독립적인 라우터 생성 | 각 부서 사무실 |
| `app.use()` | 메인 앱에 라우터 연결 | 부서를 백화점 출입구에 배치 |
| `router.use()` | 부서에 공통 적용되는 작업 | 부서 입장 시 인사 |
| `req.params` | URL에서 ID와 같은 값을 추출 | 고객의 상품 ID |
| `req.body` | POST/PUT 요청 시 클라이언트가 보낸 본문 | 고객이 작성한 신청서 |
