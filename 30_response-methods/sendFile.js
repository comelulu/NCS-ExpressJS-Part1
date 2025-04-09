const express = require("express"); // Express 불러오기
const path = require("path");       // 경로 조작을 위한 path 모듈
const app = express();              // Express 앱 생성

// 1. EJS 뷰 엔진 설정
app.set("view engine", "ejs");                            // EJS를 템플릿 엔진으로 사용
app.set("views", path.join(__dirname, "views"));         // 뷰 파일들의 위치 지정

// 2. 정적 파일 제공 설정 (public 폴더에 있는 파일을 클라이언트가 직접 접근 가능)
app.use(express.static("public"));

// 3. 루트 경로 요청 처리 – index.ejs 렌더링
app.get("/", (req, res) => {
  res.render("index", { title: "EJS with sendFile" });   // 뷰에 title 변수 전달
});

// 4. /file 요청 처리 – 이미지 파일을 클라이언트에게 직접 전송
app.get("/file", (req, res) => {
  const filePath = path.join(__dirname, "public", "hello.png"); // 파일 경로 설정
  res.sendFile(filePath);                                        // 이미지 직접 응답
});
