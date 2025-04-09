# 30. 다양한 응답 방법 총정리 – `send`, `json`, `status` 등

---

## 🧠 Express에서 클라이언트에게 응답하는 다양한 방법

Express에서는 사용자의 요청에 대해 다양한 방식으로 응답할 수 있습니다.  
우리가 보낼 수 있는 것은 단순한 문자열부터 JSON, 파일, 상태 코드, 뷰 렌더링 등 아주 다양합니다.

---

## 📦 실습 폴더 구조 (예시)

```
📦 express-response-summary
 ┣ 📄 index.js           ← 다양한 응답 예제를 담은 메인 파일
 ┣ 📄 sendFile.js        ← 파일을 브라우저에 직접 보여주는 예제
 ┣ 📄 download.js        ← 파일을 다운로드하도록 응답하는 예제
 ┣ 📂views
 ┃ ┣ 📄 index.ejs        ← sendFile 예제에 사용될 EJS 템플릿
 ┃ ┗ 📄 download.ejs     ← 다운로드 페이지를 보여주는 템플릿
 ┣ 📂public
 ┃ ┗ 📄 hello.png        ← 전송할 이미지 파일
```

---

## 1️⃣ 📄 index.js – 다양한 응답 메서드 실습 예제

```js
// 내장 모듈 'path'는 파일 경로를 안전하게 조작할 수 있게 도와줍니다.
const path = require("path");

// Express 서버 프레임워크를 불러옵니다.
const express = require("express");

// Express 애플리케이션을 생성합니다.
const app = express();

/* -------------------------------------------------------------------
  1. res.send()
     - 문자열, HTML, JSON 객체 등 다양한 데이터를 클라이언트에게 전송할 수 있는 범용 메서드입니다.
     - 자동으로 Content-Type을 설정합니다.
------------------------------------------------------------------- */
app.get("/send", (req, res) => {
  res.send("Hello World"); // 문자열 응답 (Content-Type: text/html)
  // res.send("<h1>Hello World</h1>"); // HTML 형식도 가능
  // res.send({ name: "hello", age: 15 }); // 객체 → JSON으로 자동 변환됨
});

/* -------------------------------------------------------------------
  2. res.json()
     - JSON 형식으로 명확하게 응답을 보낼 때 사용합니다.
     - res.send()보다 의도를 분명히 전달할 수 있습니다.
     - 자동으로 Content-Type: application/json을 설정합니다.
------------------------------------------------------------------- */
app.get("/json", (req, res) => {
  res.json({ name: "hello", age: 15 }); // JSON 응답
});

/* -------------------------------------------------------------------
  3. res.status()
     - HTTP 상태 코드를 명시적으로 설정할 수 있습니다.
     - 보통 res.send(), res.json()과 함께 사용됩니다.
------------------------------------------------------------------- */
app.get("/unauthorized", (req, res) => {
  res.status(401).send("접근 권한이 없습니다."); // 401 Unauthorized 응답
});

app.get("/not-found", (req, res) => {
  res.status(404).json({ error: "페이지를 찾을 수 없습니다." }); // 404 Not Found
});

/* -------------------------------------------------------------------
  4. res.redirect()
     - 클라이언트를 다른 경로로 강제로 이동시킬 때 사용합니다.
     - 301(영구 이동), 302(임시 이동) 등의 상태 코드를 함께 설정할 수 있습니다.
------------------------------------------------------------------- */
app.get("/old-page", (req, res) => {
  res.redirect(301, "/new-page"); // /old-page 요청이 들어오면 /new-page로 영구 리다이렉트
});

app.get("/new-page", (req, res) => {
  res.send("이 페이지는 새로운 주소입니다."); // 리다이렉트된 페이지의 응답
});

/* -------------------------------------------------------------------
  5. res.render()
     - EJS 같은 템플릿 엔진을 통해 HTML을 서버에서 동적으로 렌더링합니다.
     - 템플릿에 데이터를 주입할 수 있어 다양한 화면 생성에 유용합니다.
------------------------------------------------------------------- */

// 템플릿 엔진을 EJS로 설정합니다.
app.set("view engine", "ejs");

// 뷰 파일들이 위치한 폴더 경로를 설정합니다.
app.set("views", path.join(__dirname, "views"));

// [GET] /home 요청 → index.ejs를 렌더링합니다.
app.get("/home", (req, res) => {
  res.render("index", { title: "Express 응답 요약 예제" }); // {title}은 EJS에서 사용할 변수
});

// 서버를 3000번 포트에서 실행합니다.
app.listen(3000, () => {
  console.log("app listening at http://localhost:3000");
});
```

---

## 2️⃣ 📄 sendFile.js – 파일 직접 보여주기 (브라우저에서 보기)

```js
const express = require("express"); // Express 불러오기
const path = require("path"); // 경로 조작을 위한 path 모듈
const app = express(); // Express 앱 생성

// 1. EJS 뷰 엔진 설정
app.set("view engine", "ejs"); // EJS를 템플릿 엔진으로 사용
app.set("views", path.join(__dirname, "views")); // 뷰 파일들의 위치 지정

// 2. 정적 파일 제공 설정 (public 폴더에 있는 파일을 클라이언트가 직접 접근 가능)
app.use(express.static("public"));

// 3. 루트 경로 요청 처리 – index.ejs 렌더링
app.get("/", (req, res) => {
  res.render("index", { title: "EJS with sendFile" }); // 뷰에 title 변수 전달
});

// 4. /file 요청 처리 – 이미지 파일을 클라이언트에게 직접 전송
app.get("/file", (req, res) => {
  const filePath = path.join(__dirname, "public", "hello.png"); // 파일 경로 설정
  res.sendFile(filePath); // 이미지 직접 응답
});
```

### ✅ `res.sendFile()`이란?

- 파일 경로를 전달하면, 해당 파일이 브라우저에 **그대로 출력됩니다.**
- 이미지, PDF, HTML, ZIP 등 모든 파일 가능
- 사용자의 다운로드 없이 **파일을 열람**만 할 때 유용

---

## 3️⃣ 📄 download.js – 파일 다운로드 응답

```js
const path = require("path"); // 경로 조작용 모듈
const express = require("express"); // Express 불러오기
const app = express(); // Express 앱 생성

// 1. EJS 뷰 엔진 설정
app.set("view engine", "ejs"); // EJS 템플릿 사용 설정
app.set("views", path.join(__dirname, "views")); // 뷰 디렉토리 설정

// 2. /download-page 요청 – 다운로드 링크가 포함된 EJS 페이지 렌더링
app.get("/download-page", (req, res) => {
  res.render("download"); // download.ejs 템플릿 렌더링
});

// 3. /download-file 요청 – 이미지 파일을 다운로드 형식으로 전송
app.get("/download-file", (req, res) => {
  const filePath = path.join(__dirname, "public", "hello.png"); // 대상 파일 경로
  res.download(filePath); // 파일을 다운로드 형태로 응답
});

// 4. 서버 실행
app.listen(3000, () => {
  console.log(`app listening at http://localhost:3000`);
});
```

### ✅ `res.download()`이란?

- 사용자의 브라우저에서 **파일 다운로드 창을 띄우는 응답**입니다.
- PDF, 이미지, ZIP 등 다운로드 가능한 모든 형식 사용 가능
- 내부적으로는 `Content-Disposition: attachment` 헤더가 설정됨

---

## 4️⃣ 📄 views/index.ejs – sendFile 예제에서 사용

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title><%= title %></title> <!-- 서버에서 전달한 title 변수 사용 -->
  </head>
  <body>
    <h1>Welcome to <%= title %>!</h1> <!-- 동적으로 페이지 타이틀 표시 -->
    <p><a href="/file">View hello.png</a></p> <!-- 이미지 파일 열기 링크 -->
  </body>
</html>
```

---

## 5️⃣ 📄 views/download.ejs – 다운로드 페이지 예제

```ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Download Example</title>
  </head>
  <body>
    <h1>Download your file</h1>
    <a href="/download-file">Download hello.png</a> <!-- 파일 다운로드 링크 -->
  </body>
</html>
```

---

## 🧠 마무리 정리

| 메서드           | 설명                                   | 예시                                  |
| ---------------- | -------------------------------------- | ------------------------------------- |
| `res.send()`     | 문자열, HTML, 객체 등 다양한 응답 전송 | `res.send("Hello")`                   |
| `res.json()`     | JSON 응답 전송                         | `res.json({ name: "hi" })`            |
| `res.status()`   | 상태 코드 설정                         | `res.status(404).send("Not found")`   |
| `res.redirect()` | 다른 주소로 이동                       | `res.redirect(301, "/new")`           |
| `res.render()`   | EJS 등 템플릿 렌더링                   | `res.render("home", { title: "홈" })` |
| `res.sendFile()` | 파일을 브라우저에 직접 보여줌          | `res.sendFile("path")`                |
| `res.download()` | 파일을 다운로드하도록 응답             | `res.download("path")`                |
