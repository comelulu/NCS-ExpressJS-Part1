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
