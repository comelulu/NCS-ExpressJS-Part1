// 1. Express 모듈을 불러와 애플리케이션 인스턴스를 생성합니다.
const express = require("express");
const app = express();

// 2. app.all() 메서드를 사용하여 '/hello' 경로에 대한 모든 HTTP 요청을 처리합니다.
app.all("/hello", (req, res, next) => {
  // 클라이언트에게 HTML 형식의 응답을 전송합니다.
  res.send("<h1>Hello World!</h1>");
});

/*
📌 설명:
- app.all(path, callback)
  → 지정한 경로로 들어오는 모든 HTTP 메서드(GET, POST 등)의 요청을 처리합니다.
  → '/hello' 경로에 도착하는 모든 요청은 이 콜백 함수로 처리됩니다.

- req (Request 객체)
  → 요청 관련 정보 (URL, 헤더, 바디 등)를 담고 있습니다.

- res (Response 객체)
  → 응답을 구성하고 클라이언트에게 전송하는 데 사용됩니다.

- res.send(data)
  → 데이터를 클라이언트에 전송합니다.
    • 문자열 → text/html 또는 text/plain
    • 객체 또는 배열 → application/json
  → 자동으로 적절한 Content-Type을 설정해주기 때문에 매우 간편합니다.
*/

// 3. 3000번 포트에서 서버를 실행합니다.
app.listen(3000, () => {
  console.log("✅ 서버가 3000번 포트에서 실행 중입니다.");
});
