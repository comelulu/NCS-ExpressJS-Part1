// http 모듈은 NodeJS에 기본 내장되어 있습니다. 이는 별도로 다운로드 없이 바로 사용하시면 됩니다.
const http = require("http");

// http 모듈에는 createServer 메서드가 있습니다.
// 1개의 인자를 사용합니다:
//    - 콜백 함수. 콜백 함수에는 2개의 인자(req, res)가 있습니다.
const server = http.createServer((req, res) => {
  // 요청 URL이 '/hello'인 경우
  if (req.url === "/hello") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<h1>Hello World!</h1>");
    res.end();
  } else {
    // '/hello'가 아닌 다른 경로에 대한 요청
    res.writeHead(404, { "content-type": "text/html" });
    res.write("<h1>Sorry, Page Not Found</h1>");
    res.end();
  }
});

// createServer는 listen 메서드가 있는 객체를 반환합니다.
// listen은 2개의 인자를 사용합니다:
// 1. 포트 번호
// 2. 수신이 시작될 경우 호출되는 콜백함수
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
