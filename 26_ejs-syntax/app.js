// 실행 방법 요약
// 1. mkdir my-board-app && cd my-board-app
// 2. npm init -y
// 3. npm install express ejs
// 4. node app.js


// Express 모듈 불러오기
const express = require("express");
// 앱 생성
const app = express();
// 포트 설정
const PORT = 3000;

// EJS를 템플릿 엔진으로 설정
app.set("view engine", "ejs");
// EJS 뷰 파일들이 들어있는 폴더 위치 설정
app.set("views", __dirname + "/views");

// 정적(static) 파일을 제공할 폴더 (이미지, CSS 등)
app.use(express.static("public"));

/**
 * ✅ 통합 예시: 변수 출력 + 조건문 + 반복문 한 번에 보여주는 메인 페이지
 */
app.get("/", (req, res) => {
  const users = [
    { name: "홍길동", age: 30 },
    { name: "김철수", age: 25 }
  ];

  // EJS 템플릿으로 데이터 전달
  res.render("pages/index", {
    title: "홈페이지",             // <%= title %>
    description: "메인 페이지",    // <%= description %>
    users: users,                 // 반복문용 데이터
    user: { name: "관리자" }       // 조건문용 데이터
  });
});

/**
 * ✅ 단순한 변수 출력 예제
 */
app.get("/simple", (req, res) => {
  res.render("pages/index", {
    title: "EJS 연습",                // 제목 출력용
    description: "템플릿 엔진 연습 페이지", // 설명 출력용
    users: [],                        // 반복문 미사용
    user: null                        // 로그인 X 상태
  });
});

/**
 * ✅ HTML 태그를 그대로 출력하는 예시 (주의: XSS 위험)
 */
app.get("/raw", (req, res) => {
  const notice = "<strong>서버 점검 안내:</strong> 4월 12일 2시~4시";

  // HTML 태그를 포함한 문자열을 <%- %>로 출력하기 위해 전달
  res.render("pages/raw", {
    noticeHtml: notice
  });
});

/**
 * ✅ 조건문(if) 예시
 */
app.get("/if", (req, res) => {
  const isLoggedIn = true;

  // 로그인 상태에 따라 user 객체를 전달하거나 null
  res.render("pages/if", {
    user: isLoggedIn ? { name: "홍길동" } : null
  });
});

/**
 * ✅ 반복문(forEach) 예시
 */
app.get("/list", (req, res) => {
  const users = [
    { name: "이영희", age: 22 },
    { name: "박철수", age: 35 },
    { name: "김민수", age: 28 }
  ];

  // 사용자 목록 전달
  res.render("pages/list", { users });
});

/**
 * ✅ 파셜 포함(include) 예시
 */
app.get("/partial", (req, res) => {
  // 헤더 파셜을 포함한 페이지 렌더링
  res.render("pages/with-partial");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
