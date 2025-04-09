// Express 모듈을 불러옵니다
const express = require("express");
const app = express(); // Express 앱을 생성합니다

// JSON 형식의 요청 본문을 파싱할 수 있도록 설정합니다
app.use(express.json());

// 폼 데이터 (x-www-form-urlencoded) 형식도 파싱할 수 있도록 설정합니다
app.use(express.urlencoded({ extended: true }));

// 각 부서 라우터 모듈을 불러옵니다
const indexRouter = require("./routes/index");
const clothingRouter = require("./routes/clothing");
const electronicsRouter = require("./routes/electronics");
const foodRouter = require("./routes/food");

// 홈페이지 루트에 index 라우터를 연결합니다
app.use("/", indexRouter);

// '/clothing' 경로로 들어오는 요청은 의류 라우터로 연결합니다
app.use("/clothing", clothingRouter);

// '/electronics' 경로는 전자제품 라우터로 연결합니다
app.use("/electronics", electronicsRouter);

// '/food' 경로는 식품 라우터로 연결합니다
app.use("/food", foodRouter);

// 서버를 3000번 포트에서 실행합니다
app.listen(3000, () => {
  console.log("Department store app listening at http://localhost:3000");
});
