const express = require("express"); // Express 불러오기
const app = express(); // Express 앱 생성

/* -------------------------------------------------------------------
  [1] Content-Type 설정 – 응답 데이터의 형식을 알려주는 헤더입니다.
------------------------------------------------------------------- */
app.get("/json", (req, res) => {
  res.set("Content-Type", "application/json"); // 명시적으로 Content-Type 설정
  res.send(JSON.stringify({ message: "Hello, World!" })); // JSON 문자열 응답
});

/* -------------------------------------------------------------------
  [2] Cache-Control 설정 – 브라우저가 응답을 저장(캐시)할 수 있는지 설정합니다.
------------------------------------------------------------------- */

// (1) 캐시 금지
app.get("/no-cache", (req, res) => {
  res.set("Cache-Control", "no-cache"); // 항상 서버에서 새로 요청해야 함
  res.send("This response is not cached.");
});

// (2) 1시간 캐시 허용
app.get("/cache", (req, res) => {
  res.set("Cache-Control", "max-age=3600"); // 1시간 동안 브라우저에 저장 가능
  res.send("This response is cached for 1 hour.");
});

/* -------------------------------------------------------------------
  [3] res.type() – Content-Type을 더 간편하게 설정할 수 있는 메서드입니다.
------------------------------------------------------------------- */
app.get("/text", (req, res) => {
  res.type("text"); // Content-Type: text/plain
  res.send("이건 일반 텍스트입니다.");
});

app.get("/html", (req, res) => {
  res.type("html"); // Content-Type: text/html
  res.send("<h1>HTML 페이지입니다</h1>");
});

/* -------------------------------------------------------------------
  [4] res.status() – 응답 상태 코드를 지정할 수 있습니다.
------------------------------------------------------------------- */
app.get("/unauthorized", (req, res) => {
  res.status(401).send("접근 권한이 없습니다."); // 401 Unauthorized
});

app.get("/not-found", (req, res) => {
  res.status(404).send("요청하신 페이지를 찾을 수 없습니다."); // 404 Not Found
});

// 서버 시작
app.listen(3000, () => {
  console.log("app listening at http://localhost:3000");
});
