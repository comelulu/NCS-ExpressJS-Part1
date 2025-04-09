// express 모듈을 불러옵니다.
const express = require("express");
// Express 애플리케이션을 생성합니다.
const app = express();

// ---------------------------------------------------------------------------
// 첫 번째 라우트와 오류 처리
app.get("/", (req, res) => {
  // '/' 경로로 요청이 들어오면 강제로 오류를 발생시킵니다.
  // throw new Error("/")를 통해 오류가 발생하고, Express는 이를 처리하기 위해
  // 자동으로 오류 처리 미들웨어로 넘어갑니다.
  throw new Error("/");
});

// 오류 처리 미들웨어
// 첫 번째 라우트에서 발생한 오류를 처리하는 미들웨어입니다.
app.use((err, req, res, next) => {
  // 발생한 오류를 콘솔에 출력합니다. (에러 스택을 확인할 수 있습니다)
  console.error("General error:", err);
  // 500 상태 코드를 응답하고, 사용자에게 에러 메시지를 전달합니다.
  res.status(500).send("[GET /] - Internal Server Error");
});

// 두 번째 라우트와 오류 처리
app.get("/users", (req, res) => {
  // '/users' 경로로 요청이 들어오면 강제로 오류를 발생시킵니다.
  // 오류가 발생하면, Express는 이를 처리하기 위해 해당 라우트에 대해
  // 등록된 오류 처리 미들웨어로 넘어갑니다.
  throw new Error("/users");
});

// 오류 처리 미들웨어
// '/users' 경로에서 발생한 오류를 처리하는 미들웨어입니다.
app.use((err, req, res, next) => {
  // 발생한 오류를 로그로 출력합니다.
  console.error("General error:", err);
  // 500 상태 코드를 응답하고, 사용자에게 에러 메시지를 전달합니다.
  res.status(500).send("[GET /users] - Internal Server Error");
});

// ---------------------------------------------------------------------------
// Case 1. 오류 처리 미들웨어가 하나인 경우
// 여러 라우트에서 발생한 오류를 하나의 미들웨어로 처리하는 경우
app.get("/", (req, res) => {
  // '/' 경로에서 오류를 강제로 발생시킵니다.
  throw new Error("Error occurred"); // 오류 발생
});
app.get("/users", (req, res) => {
  // '/users' 경로에서 오류를 강제로 발생시킵니다.
  throw new Error("Error occurred"); // 오류 발생
});
app.get("/products", (req, res) => {
  // '/products' 경로에서 오류를 강제로 발생시킵니다.
  throw new Error("Error occurred"); // 오류 발생
});

// 모든 라우트에서 발생한 오류를 하나의 미들웨어로 처리합니다.
// 모든 오류는 이 미들웨어로 전달됩니다.
app.use((err, req, res, next) => {
  console.log("Executing error handling middleware");
  // 모든 오류에 대해 500 상태 코드와 JSON 형식으로 에러 메시지 전달
  res.status(500).json({ error: "Internal Server Error" });
}); // 모든 오류는 여기서 처리됩니다.

// ---------------------------------------------------------------------------
// Case 2. 오류 처리 미들웨어가 여러 개인 경우
// 오류 유형에 따라 다른 처리 미들웨어 사용
// 일반 미들웨어 정의 생략...

// 첫 번째 오류 처리 미들웨어 (데이터베이스 오류 처리)
app.use((err, req, res, next) => {
  // 오류 타입이 'database'인 경우 데이터베이스 오류로 처리
  if (err.type === "database") {
    // 데이터베이스 관련 오류가 발생한 경우, 해당 오류를 콘솔에 출력합니다.
    console.error("Database error:", err);
    // 500 상태 코드와 함께 데이터베이스 오류 메시지 전송
    res.status(500).json({ error: "Database error occurred" });
  } else {
    // 이 오류를 처리할 수 없으면, 다음 미들웨어로 넘깁니다.
    next(err);
  }
});

// 두 번째 오류 처리 미들웨어 (일반적인 오류 처리)
app.use((err, req, res, next) => {
  // 모든 일반적인 오류를 처리합니다. 오류 로그를 콘솔에 출력합니다.
  console.error("General error:", err);
  // 500 상태 코드와 함께 일반적인 오류 메시지를 전송합니다.
  res.status(500).json({ error: "An error occurred" });
});

// ---------------------------------------------------------------------------
// Case 3. Express에서 초기 미들웨어와 후속 라우터/미들웨어 오류 처리 분리하기
// 특정 라우트 정의

// '/special-route' 경로에서 오류를 발생시키는 예시
app.get("/special-route", (req, res, next) => {
  // 라우트 처리 중 오류 발생을 시뮬레이션
  const error = new Error("Error in special-route");
  error.status = 400; // 오류 상태 코드 설정 (400번 오류로 지정)
  next(error); // 오류를 오류 처리 미들웨어로 전달
});

// 다른 라우트 정의
app.get("/another-route", (req, res, next) => {
  res.send(
    "This is another route, errors here are not handled by the special handler."
  );
});

// '/special-route' 이후의 오류 처리 미들웨어
app.use("/special-route", (err, req, res, next) => {
  // 오류 상태 코드가 설정되어 있는지 확인
  if (err.status === 400) {
    // 400 상태 코드에 맞는 특수 처리 오류 메시지 응답
    res.status(400).send(`Special error handler: ${err.message}`);
  } else {
    // 다른 오류에 대해서는 다음 오류 처리 미들웨어로 전달
    next(err);
  }
});

// 전역 오류 처리 미들웨어 (모든 오류에 대해 처리)
app.use((err, req, res, next) => {
  // 처리할 수 없는 모든 오류를 여기서 처리합니다.
  console.error(err);
  // 전역적으로 처리할 수 없는 오류는 500 상태 코드와 함께 사용자에게 전송
  res.status(500).send("An unexpected error occurred");
});

// 서버 실행
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
