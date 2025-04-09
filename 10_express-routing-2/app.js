// 1. Express 모듈을 불러와 애플리케이션 인스턴스를 생성합니다.
//    Express는 Node.js에서 서버를 간단하게 만들 수 있도록 도와주는 웹 프레임워크입니다.
const express = require("express");
const app = express();

// 2. HTTP 메서드별 라우팅 처리 -------------------------------------

/*
✅ app.get(경로, 콜백함수)
- HTTP GET 요청을 처리합니다.
- 클라이언트가 서버에게 "정보를 달라"고 요청할 때 사용합니다.
- 예: 홈페이지 보기, 게시글 목록 요청, 특정 게시글 조회 등

💡 실무 예시:
  사용자가 웹사이트 주소에 접속하면, 브라우저는 서버에 GET 요청을 보냅니다.
  서버는 요청에 따라 HTML 페이지나 데이터를 응답합니다.
*/
app.get("/", (req, res) => {
  // 클라이언트에게 HTML 형식의 응답을 전송합니다.
  res.send("<h1>Homepage</h1>");
});

/*
✅ app.post(경로, 콜백함수)
- HTTP POST 요청을 처리합니다.
- 클라이언트가 서버로 데이터를 "제출"하거나 "생성"하고 싶을 때 사용합니다.
- 예: 회원가입, 로그인, 폼 제출, 파일 업로드 등

💡 실무 예시:
  사용자가 회원가입 양식을 작성하고 제출할 때, 브라우저는 서버로 POST 요청을 보냅니다.
  서버는 이 데이터를 받아서 데이터베이스에 저장하거나 처리합니다.
*/
app.post("/submit-form", (req, res) => {
  // 실제로는 사용자의 입력 데이터를 받아 저장하는 로직이 들어갑니다.
  res.send("<h1>Form Submitted</h1>");
});

/*
✅ app.put(경로, 콜백함수)
- HTTP PUT 요청을 처리합니다.
- 클라이언트가 서버에 있는 기존 데이터를 "전체 교체" 또는 "업데이트"할 때 사용합니다.
- 일부 서버에서는 존재하지 않으면 새로 생성하는 데 사용되기도 합니다.
- 예: 프로필 정보 전체 수정, 게시글 덮어쓰기 등

💡 실무 예시:
  사용자가 자신의 프로필 정보를 모두 바꾸고 저장할 때, PUT 요청이 서버로 전송됩니다.
  서버는 기존 정보를 새 정보로 교체합니다.
*/
app.put("/update-profile", (req, res) => {
  res.send("Profile updated.");
});

/*
✅ app.delete(경로, 콜백함수)
- HTTP DELETE 요청을 처리합니다.
- 클라이언트가 서버에 저장된 특정 데이터를 "삭제"해 달라고 요청할 때 사용합니다.
- 예: 계정 삭제, 게시글 삭제, 파일 삭제 등

💡 실무 예시:
  사용자가 "탈퇴하기" 버튼을 누르면, 서버에 DELETE 요청이 전송되어 계정이 삭제됩니다.
*/
app.delete("/delete-account", (req, res) => {
  res.send("Account deleted.");
});

/*
✅ app.patch(경로, 콜백함수)
- HTTP PATCH 요청을 처리합니다.
- 기존 리소스의 "일부만 수정"할 때 사용합니다.
- PUT과 비슷하지만, 전체가 아닌 일부 속성만 업데이트할 때 적합합니다.
- 예: 이메일만 변경, 닉네임만 변경 등

💡 실무 예시:
  사용자가 프로필 사진만 변경하거나 이메일 주소만 수정하는 경우, PATCH 요청을 사용합니다.
*/
app.patch("/update-profile-info", (req, res) => {
  res.send("Profile info partially updated.");
});

// 3. 서버를 실행하여 클라이언트의 요청을 수신 대기합니다.
//    3000번 포트에서 서버가 작동하고, 브라우저를 통해 http://localhost:3000 에 접속할 수 있습니다.
app.listen(3000, () => {
  console.log("✅ 서버가 3000번 포트에서 실행 중입니다.");
});
