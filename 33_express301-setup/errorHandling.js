// path 모듈을 불러옵니다. (디렉토리 경로를 쉽게 관리하기 위해 사용)
const path = require("path");
// express 모듈을 불러옵니다. (웹 서버를 구축하기 위한 라이브러리)
const express = require("express");
// Express 애플리케이션 인스턴스를 생성합니다.
const app = express();

// 1. 뷰 엔진 설정 (EJS 사용)
// EJS는 서버에서 동적으로 HTML을 생성할 수 있는 템플릿 엔진입니다.
// 앱에서 사용할 뷰 엔진을 EJS로 설정합니다.
app.set("view engine", "ejs");

// 2. views 디렉토리 설정
// Express는 기본적으로 'views' 폴더를 템플릿 파일을 찾는 디렉토리로 사용합니다.
// path.join(__dirname, "views")는 현재 파일이 위치한 디렉토리에서 'views' 디렉토리로 경로를 설정합니다.
app.set("views", path.join(__dirname, "views"));

// 3. 기본 라우트 설정 (홈페이지)
// 사용자가 홈페이지로 요청을 보내면, 이 라우트가 응답을 처리합니다.
app.get("/", (req, res) => {
  // GET / 요청에 대해 'Homepage'라는 메시지를 클라이언트에 응답합니다.
  res.send("[GET /] Homepage");
});

// 4. 사용자 페이지 라우트 설정
// '/users' 경로로 요청이 오면 이 라우트가 실행됩니다.
app.get("/users", (req, res) => {
  // GET /users 요청에 대해 'Userpage'라는 메시지를 클라이언트에 응답합니다.
  res.send("[GET /users] Userpage");
});

// 5. 그 외의 모든 요청에 대해 404 페이지 처리
// 위에서 정의된 라우트 이외의 요청에 대해 404 오류 페이지를 보여줍니다.
// 모든 라우트는 이 미들웨어 이후에 정의되어야 합니다.
app.use((req, res, next) => {
  // '404.ejs' 파일을 렌더링하며, 요청된 URL을 `url` 변수로 전달합니다.
  // 이를 통해 잘못된 URL에 대한 정보도 사용자에게 제공할 수 있습니다.
  res.status(404).render("404", { url: req.url });
});

// 6. 서버 실행
// 3000번 포트에서 Express 서버를 실행합니다.
// 서버가 실행되면 콘솔에 "Listening on port 3000"이 출력됩니다.
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
