const path = require("path");         // 경로 조작용 모듈
const express = require("express");   // Express 불러오기
const app = express();                // Express 앱 생성

// 1. EJS 뷰 엔진 설정
app.set("view engine", "ejs");                            // EJS 템플릿 사용 설정
app.set("views", path.join(__dirname, "views"));         // 뷰 디렉토리 설정

// 2. /download-page 요청 – 다운로드 링크가 포함된 EJS 페이지 렌더링
app.get("/download-page", (req, res) => {
  res.render("download"); // download.ejs 템플릿 렌더링
});

// 3. /download-file 요청 – 이미지 파일을 다운로드 형식으로 전송
app.get("/download-file", (req, res) => {
  const filePath = path.join(__dirname, "public", "hello.png"); // 대상 파일 경로
  res.download(filePath);                                       // 파일을 다운로드 형태로 응답
});

// 4. 서버 실행
app.listen(3000, () => {
  console.log(`app listening at http://localhost:3000`);
});
