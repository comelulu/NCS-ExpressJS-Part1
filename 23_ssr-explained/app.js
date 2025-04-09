const http = require("http");
const fs = require("fs");

// 간단한 서버 생성
const server = http.createServer((req, res) => {
  // 데이터를 서버 측에서 준비 (실제 환경에서는 데이터베이스 조회 등이 이루어질 수 있음)
  const data = [{ title: "Item 1" }, { title: "Item 2" }];

  // 서버에서 HTML 문자열 생성
  const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>SSR Example</title>
        </head>
        <body>
            <h1>Server-Side Rendered Page</h1>
            ${data.map((item) => `<p>${item.title}</p>`).join("")}
        </body>
        </html>
    `;

  // 생성된 HTML을 클라이언트에 전송
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
