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
