// app.js
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log("요청 url: ", req.url); // 요청된 URL 출력

  // '/hello' 경로로 요청이 들어오면 HTML 파일을 반환
  if (req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/html" }); // 응답 상태 코드와 MIME 타입 설정
    const helloHTML = fs.readFileSync("hello.html", "utf-8"); // hello.html 파일 읽기
    res.write(helloHTML); // 읽은 HTML 파일 내용 응답으로 보내기
    res.end(); // 응답 종료
  } else if (req.url === "/first.png") {
    // '/first.png' 경로로 요청이 들어오면 PNG 이미지 파일을 반환
    res.writeHead(200, { "Content-Type": "image/png" }); // 응답 상태 코드와 MIME 타입 설정
    const image = fs.readFileSync("first.png"); // first.png 파일 읽기
    res.write(image); // 읽은 이미지 파일 내용 응답으로 보내기
    res.end(); // 응답 종료
  } else {
    // 그 외의 경로는 404 에러 페이지 반환
    res.writeHead(404, { "Content-Type": "text/plain" }); // 404 상태 코드 설정
    res.end("404 Not Found"); // 에러 메시지 전송
  }
});

server.listen(3000, () => {
  console.log("서버가 http://localhost:3000 에서 실행 중입니다!"); // 서버 실행 메시지
});
