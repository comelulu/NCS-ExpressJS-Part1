// Node.js의 http 모듈을 불러옵니다.
// 이 모듈을 이용하면 웹 브라우저의 요청을 직접 처리할 수 있는 웹 서버를 만들 수 있습니다.
const http = require("http");

// 파일을 읽고 쓸 수 있는 fs(File System) 모듈을 불러옵니다.
// HTML, 이미지, CSS 파일 등을 읽어서 클라이언트(브라우저)에게 보내줄 때 사용됩니다.
const fs = require("fs");

// path 모듈을 불러옵니다.
// 이 모듈은 운영체제에 따라 자동으로 경로 구분자(/ 또는 \)를 처리해주며,
// 파일 경로를 안전하게 연결할 수 있도록 도와줍니다.
const path = require("path");

// ----------------------------------------------------------
// [1] 정적 파일을 클라이언트에게 제공하는 함수입니다.
// 예를 들어 사용자가 /style.css나 /img/logo.png 같은 경로를 요청하면,
// public 폴더에서 해당 파일을 찾아서 보내주는 역할을 합니다.
function serveStatic(rootDirectory, req, res) {
  // 사용자가 요청한 URL을 기반으로 실제 파일 경로를 생성합니다.
  // 예: req.url이 "/style.css"이면 → public/style.css 경로로 연결됩니다.
  const filePath = path.join(rootDirectory, req.url);

  // 해당 경로의 파일을 비동기적으로 읽습니다.
  // 에러가 발생할 수 있으므로 콜백을 통해 처리합니다.
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 파일을 찾을 수 없는 경우 (예: 경로가 잘못되었거나 존재하지 않음)
      if (err.code === "ENOENT") {
        // 404 Not Found 상태 코드로 응답합니다.
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
      } else {
        // 그 외의 오류는 서버 내부 문제로 판단하고 500 응답을 보냅니다.
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 Internal Server Error</h1>");
      }
    } else {
      // 파일을 정상적으로 읽은 경우입니다.

      // 확장자(.html, .css 등)를 추출합니다.
      const extname = path.extname(filePath);

      // 확장자에 맞는 MIME 타입을 구합니다.
      // MIME 타입은 브라우저가 이 파일을 어떻게 해석할지를 알려주는 역할을 합니다.
      const contentType = getContentType(extname);

      // 정상 상태 코드(200 OK)와 함께 Content-Type 헤더를 설정합니다.
      res.writeHead(200, { "Content-Type": contentType });

      // 파일의 내용을 응답 본문으로 보냅니다.
      res.end(data);
    }
  });
}

// ----------------------------------------------------------
// [2] 확장자에 따라서 적절한 MIME 타입을 반환하는 함수입니다.
// 브라우저는 Content-Type을 보고 어떤 방식으로 파일을 해석할지 결정합니다.
function getContentType(ext) {
  switch (ext) {
    case ".html":
      return "text/html"; // HTML 문서
    case ".css":
      return "text/css"; // CSS 스타일시트
    case ".png":
      return "image/png"; // PNG 이미지
    default:
      // 그 외의 확장자는 일반 바이너리 파일로 처리합니다.
      // 브라우저에서 다운로드 창이 뜰 수 있습니다.
      return "application/octet-stream";
  }
}

// ----------------------------------------------------------
// [3] 웹 서버를 생성합니다.
// 사용자의 요청(req)을 받을 때마다 콜백 함수가 실행되며,
// 어떤 URL이 요청되었는지에 따라 적절한 응답(res)을 보냅니다.
const server = http.createServer((req, res) => {
  // 어떤 경로가 요청되었는지 콘솔에 출력합니다.
  console.log("req.url: ", req.url);

  // 사용자가 루트 경로("/")를 요청한 경우
  // 홈페이지로 사용할 HTML 파일을 읽어서 보여줍니다.
  if (req.url === "/") {
    // public 폴더에 있는 homepage.html 파일을 읽습니다.
    const homepage = fs.readFileSync("./public/homepage.html", "utf-8");

    // HTML 형식으로 응답을 보냅니다.
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(homepage);
  }

  // 사용자가 "/hello" 경로를 요청한 경우
  // 간단한 텍스트를 HTML로 응답합니다.
  else if (req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Hello Page!</h1>");
  }

  // 위에 해당되지 않는 다른 모든 경로는 정적 파일 처리기로 넘깁니다.
  else {
    serveStatic("public", req, res); // public 폴더 안에서 요청된 파일을 찾아 응답합니다.
  }
});

// ----------------------------------------------------------
// [4] 서버를 3000번 포트에서 실행합니다.
// 이제 http://localhost:3000 으로 접속하면 이 서버가 응답하게 됩니다.
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
