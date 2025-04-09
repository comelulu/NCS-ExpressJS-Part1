# 08. 정적 파일 서빙을 위한 Node.js 서버 구현

---

### 1. 🧱 Node.js 기본 모듈 불러오기

```javascript
const http = require("http");
const fs = require("fs");
const path = require("path");
```

- `http`: 웹 서버를 직접 만들고 요청과 응답을 처리할 수 있습니다.
- `fs`: HTML, CSS, 이미지 파일 등을 읽어 클라이언트에게 보낼 수 있습니다.
- `path`: 파일 경로를 안전하게 연결해주는 도구입니다.

---

### 2. 📂 정적 파일 제공 함수 (`serveStatic`)

```javascript
function serveStatic(rootDirectory, req, res) {
  const filePath = path.join(rootDirectory, req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>");
      } else {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 Internal Server Error</h1>");
      }
    } else {
      const extname = path.extname(filePath);
      const contentType = getContentType(extname);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}
```

---

### 🔍 시각화: `serveStatic` 함수의 내부 흐름

```
[사용자 요청] ──▶ "/style.css"
                   │
                   ▼
    path.join("public", "/style.css")
                   │
                   ▼
          fs.readFile("public/style.css")
                   │
        ┌──────────┴───────────┐
        ▼                      ▼
  [파일 있음]             [에러 발생]
        │                      │
        ▼                      ▼
[MIME 타입 결정]     ┌────────────┐
        │           │ENOENT (404)│
        ▼           └────┬───────┘
[res.writeHead(200)]     ▼
[res.end(data)]      res.writeHead(404 or 500)
                         res.end("<h1>에러</h1>")
```

---

### 3. 📄 MIME 타입 결정 함수 (`getContentType`)

```javascript
function getContentType(ext) {
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
}
```

- 브라우저가 파일을 어떻게 처리할지를 결정하는 `Content-Type` 값을 정해주는 함수입니다.

---

### 4. 🌐 웹 서버 생성 및 요청 처리

```javascript
const server = http.createServer((req, res) => {
  console.log("req.url: ", req.url);

  if (req.url === "/") {
    const homepage = fs.readFileSync("./public/homepage.html", "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(homepage);
  } else if (req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Hello Page!</h1>");
  } else {
    serveStatic("public", req, res);
  }
});
```

---

### 📊 시각화: 서버 요청 흐름

```
[브라우저 요청] → http://localhost:3000/something
        │
        ▼
[req.url 분석]
        │
   ┌────┴────┐
   ▼         ▼
 "/"       "/hello"
  │           │
  ▼           ▼
homepage.html  "Hello Page!"
  │           │
  ▼           ▼
res.end(...)  res.end(...)
        │
        ▼
[그 외 경로] → serveStatic("public", req, res)
```

---

### 5. 🚀 서버 실행

```javascript
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

- 이제 `http://localhost:3000` 주소로 접속하면 이 Node.js 서버가 요청을 받아 처리합니다.

---

### 6. 🧠 정리

| 개념 | 설명 |
|------|------|
| 정적 파일 서빙 | HTML, CSS, 이미지 등 고정된 리소스를 클라이언트에게 전달 |
| `fs.readFile()` | 파일을 읽는 Node.js의 비동기 함수 |
| MIME 타입 | 브라우저가 파일을 올바르게 해석하기 위한 힌트 |
| 404 / 500 처리 | 요청한 파일이 없거나 서버 오류일 때 적절한 응답 제공 |

---

### 📦 실전 폴더 구조 예시

```
project-folder/
├── public/
│   ├── homepage.html
│   ├── style.css
│   └── img/
│       └── logo.png
└── server.js
```

---

이제 여러분은 Node.js만으로도 **정적 파일 서버를 직접 구현**할 수 있습니다!  
이 구조는 추후 Express.js로 넘어가서도 **기본 개념 그대로 유지**되므로, 미리 익혀두면 아주 큰 도움이 됩니다. 😊
