// 내장 모듈 'path'는 파일 경로를 안전하게 조작할 수 있게 도와줍니다.
const path = require("path");

// Express 서버 프레임워크를 불러옵니다.
const express = require("express");

// Express 애플리케이션을 생성합니다.
const app = express();

/* -------------------------------------------------------------------
  1. res.send()
     - 문자열, HTML, JSON 객체 등 다양한 데이터를 클라이언트에게 전송할 수 있는 범용 메서드입니다.
     - 자동으로 Content-Type을 설정합니다.
------------------------------------------------------------------- */
app.get("/send", (req, res) => {
  res.send("Hello World"); // 문자열 응답 (Content-Type: text/html)
  // res.send("<h1>Hello World</h1>"); // HTML 형식도 가능
  // res.send({ name: "hello", age: 15 }); // 객체 → JSON으로 자동 변환됨
});

/* -------------------------------------------------------------------
  2. res.json()
     - JSON 형식으로 명확하게 응답을 보낼 때 사용합니다.
     - res.send()보다 의도를 분명히 전달할 수 있습니다.
     - 자동으로 Content-Type: application/json을 설정합니다.
------------------------------------------------------------------- */
app.get("/json", (req, res) => {
  res.json({ name: "hello", age: 15 }); // JSON 응답
});

/* -------------------------------------------------------------------
  3. res.status()
     - HTTP 상태 코드를 명시적으로 설정할 수 있습니다.
     - 보통 res.send(), res.json()과 함께 사용됩니다.
------------------------------------------------------------------- */
app.get("/unauthorized", (req, res) => {
  res.status(401).send("접근 권한이 없습니다."); // 401 Unauthorized 응답
});

app.get("/not-found", (req, res) => {
  res.status(404).json({ error: "페이지를 찾을 수 없습니다." }); // 404 Not Found
});

/* -------------------------------------------------------------------
  4. res.redirect()
     - 클라이언트를 다른 경로로 강제로 이동시킬 때 사용합니다.
     - 301(영구 이동), 302(임시 이동) 등의 상태 코드를 함께 설정할 수 있습니다.
------------------------------------------------------------------- */
app.get("/old-page", (req, res) => {
  res.redirect(301, "/new-page"); // /old-page 요청이 들어오면 /new-page로 영구 리다이렉트
});

app.get("/new-page", (req, res) => {
  res.send("이 페이지는 새로운 주소입니다."); // 리다이렉트된 페이지의 응답
});

/* -------------------------------------------------------------------
  5. res.render()
     - EJS 같은 템플릿 엔진을 통해 HTML을 서버에서 동적으로 렌더링합니다.
     - 템플릿에 데이터를 주입할 수 있어 다양한 화면 생성에 유용합니다.
------------------------------------------------------------------- */

// 템플릿 엔진을 EJS로 설정합니다.
app.set("view engine", "ejs");

// 뷰 파일들이 위치한 폴더 경로를 설정합니다.
app.set("views", path.join(__dirname, "views"));

// [GET] /home 요청 → index.ejs를 렌더링합니다.
app.get("/home", (req, res) => {
  res.render("index", { title: "Express 응답 요약 예제" }); // {title}은 EJS에서 사용할 변수
});

// 서버를 3000번 포트에서 실행합니다.
app.listen(3000, () => {
  console.log("app listening at http://localhost:3000");
});
