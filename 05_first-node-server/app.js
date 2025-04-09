// http 모듈은 NodeJS에 기본 내장되어 있습니다. 이는 별도로 다운로드없이 바로 사용하시면 됩니다.
const http = require("http");

// http 모듈에는 createServer 메서드가 있습니다.
// 1개의 인자를 사용합니다:
//    - 콜백 함수. 콜백 함수에는 2개의 인자(req, res)가 있습니다.
const server = http.createServer((req, res) => {
  // res = 요청자에게 응답하는 방법

  // http 메시지
  // 1. 시작 라인 - 확인됨
  // 2. 헤더
  // 3. 본문

  // writeHead는 2개의 인자를 사용합니다:
  // 1. 상태 코드
  // 2. MIME 유형을 위한 객체
  res.writeHead(200, { "content-type": "text/html" });

  // res.write는 클라이언트로 데이터를 보낼 때 사용됩니다.
  // 1개의 인자: 데이터
  res.write("<h1>Hello World</h1>");

  // res.end 메서드를 호출하여 응답을 완료합니다.
  res.end();
});

// createServer는 listen 메서드가 있는 객체를 반환합니다.
// listen은 2개의 인자를 사용합니다:
// 1. 포트 번호
// 2. 수신이 시작될 경우 호출되는 콜백함수
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
