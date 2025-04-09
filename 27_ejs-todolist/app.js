const path = require("path");
const express = require("express");

const app = express();

// 할 일 목록을 저장할 배열 (서버 메모리 내 저장)
const todos = [];

// POST 요청에서 폼 데이터를 해석할 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public 폴더를 정적(static) 경로로 설정 (CSS, JS, 이미지 등 제공)
app.use(express.static("public"));

// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// GET 요청: Todolist 메인 페이지 렌더링
app.get("/", (req, res) => {
  res.render("index.ejs", {
    name: "Hello World", // 현재는 사용하지 않지만 예시용으로 전달
    todos: todos          // 현재까지의 todo 목록을 전달
  });
});

// POST 요청: 폼에서 새로운 todo를 추가
app.post("/", (req, res) => {
  todos.push(req.body);   // form에서 입력한 데이터를 배열에 저장
  res.redirect("/");      // 다시 홈으로 리다이렉트
});

// 서버 실행
app.listen(3000, () => {
  console.log("Server is Listening on port 3000");
});
