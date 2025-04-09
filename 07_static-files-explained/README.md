# 07. 정적 파일이란? - HTML, CSS, JS 직접 서빙하기

#### 1. **정적 파일이란?**

**정적 파일**은 서버에서 **동적으로 처리되지 않는** 파일들을 말합니다. 이런 파일들은 **그대로 클라이언트에게 전달**됩니다. 즉, 서버는 파일을 **변경하거나 생성하지 않고** 그대로 클라이언트에 서빙합니다.

**정적 파일의 예시**:
- **HTML 파일**: 웹 페이지의 구조를 정의하는 파일
- **CSS 파일**: 웹 페이지의 스타일을 정의하는 파일
- **JS 파일**: 웹 페이지의 동작을 정의하는 파일
- **이미지 파일**: 웹 페이지에 표시되는 이미지들 (예: PNG, JPG, GIF 등)

이번 예제에서는 **Node.js `http` 모듈**을 사용하여 **HTML 파일**과 **이미지 파일**을 클라이언트에게 서빙하는 방법을 배웁니다.

---

#### 2. **MIME-TYPE이란?**

**MIME-TYPE** (Multipurpose Internet Mail Extensions Type)은 웹 서버가 **전송하는 파일의 종류**를 명시하는 문자열입니다. 클라이언트(웹 브라우저)는 이 MIME-TYPE을 사용하여 **받은 파일을 어떻게 처리할지** 결정합니다. 예를 들어, HTML 파일은 `text/html`, 이미지 파일은 `image/png`와 같은 MIME-TYPE이 사용됩니다.

**MIME-TYPE의 예시**:
- **HTML**: `text/html`
- **CSS**: `text/css`
- **JavaScript**: `application/javascript`
- **PNG 이미지**: `image/png`
- **JPG 이미지**: `image/jpeg`
- **JSON 데이터**: `application/json`

MIME-TYPE을 정확하게 설정하는 것은 클라이언트가 서버에서 전송된 데이터를 **올바르게 처리**하도록 도와줍니다.

---

#### 3. **서버에서 정적 파일 서빙하기**

이번에는 **Node.js `http` 모듈**을 사용하여 **HTML 파일**과 **이미지 파일**을 클라이언트에게 서빙하는 간단한 서버를 만들어보겠습니다.

```javascript
// app.js
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log("요청 url: ", req.url);  // 요청된 URL 출력

  // '/hello' 경로로 요청이 들어오면 HTML 파일을 반환
  if (req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/html" });  // 응답 상태 코드와 MIME 타입 설정
    const helloHTML = fs.readFileSync("hello.html", "utf-8");  // hello.html 파일 읽기
    res.write(helloHTML);  // 읽은 HTML 파일 내용 응답으로 보내기
    res.end();  // 응답 종료
  } else if (req.url === "/first.png") {
    // '/first.png' 경로로 요청이 들어오면 PNG 이미지 파일을 반환
    res.writeHead(200, { "Content-Type": "image/png" });  // 응답 상태 코드와 MIME 타입 설정
    const image = fs.readFileSync("first.png");  // first.png 파일 읽기
    res.write(image);  // 읽은 이미지 파일 내용 응답으로 보내기
    res.end();  // 응답 종료
  } else {
    // 그 외의 경로는 404 에러 페이지 반환
    res.writeHead(404, { "Content-Type": "text/plain" });  // 404 상태 코드 설정
    res.end("404 Not Found");  // 에러 메시지 전송
  }
});

server.listen(3000, () => {
  console.log("서버가 http://localhost:3000 에서 실행 중입니다!");  // 서버 실행 메시지
});
```

#### 4. **코드 설명**

1. **`http.createServer`**:
   - `http.createServer()`는 웹 서버를 만들고, 요청이 들어오면 **콜백 함수**를 실행하여 응답을 처리합니다.
   
2. **`req.url`**:
   - `req.url`은 **클라이언트가 요청한 경로**입니다. 예를 들어, `http://localhost:3000/hello`에 접속하면 `req.url`은 `"/hello"`가 됩니다.

3. **`fs.readFileSync`**:
   - **`fs.readFileSync`**는 파일을 동기적으로 읽는 함수입니다. 요청에 맞는 파일(HTML, 이미지)을 읽어서 클라이언트에게 전달합니다.

4. **응답 헤더 설정 (`res.writeHead`)**:
   - **`res.writeHead(statusCode, headers)`**는 응답 상태 코드와 헤더를 설정합니다.
     - **`200 OK`**: 요청이 정상적으로 처리되었음을 의미합니다.
     - **`"Content-Type": "text/html"`**: 응답의 콘텐츠 타입을 **HTML**로 설정합니다.
     - **`"Content-Type": "image/png"`**: 응답의 콘텐츠 타입을 **PNG 이미지**로 설정합니다.

5. **응답 내용 보내기 (`res.write`)**:
   - **`res.write(data)`**는 클라이언트에게 데이터를 보내는 함수입니다. HTML 파일이나 이미지를 읽어서 클라이언트에 전달합니다.

6. **응답 종료 (`res.end`)**:
   - **`res.end()`**는 응답을 종료하는 함수입니다. 서버는 데이터를 다 보낸 후 응답을 종료합니다.

---

#### 5. **`hello.html` 파일**

서버가 클라이언트에 제공할 HTML 파일인 `hello.html`을 작성합니다. 이 HTML 파일은 **"Hello Page"**라는 제목과 이미지를 포함합니다.

```html
<!-- hello.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello Page</h1>
    <img src="./first.png" alt="first" />
  </body>
</html>
```

- **HTML 구조**:
  - `<h1>Hello Page</h1>`: 페이지 제목을 표시하는 태그입니다.
  - `<img src="./first.png" alt="first" />`: `first.png` 이미지를 페이지에 표시하는 태그입니다.

---

#### 6. **서버 실행 및 테스트**

1. **서버 실행**:
   - 터미널에서 `node app.js` 명령어를 실행하여 서버를 시작합니다.
   - 서버는 `http://localhost:3000`에서 요청을 기다립니다.

2. **웹 브라우저에서 테스트**:
   - 브라우저에서 `http://localhost:3000/hello`를 입력하면 **"Hello Page"**와 함께 **이미지**가 표시됩니다.
   - `http://localhost:3000/first.png`를 입력하면 **이미지** 파일이 브라우저에 표시됩니다.
   - `http://localhost:3000/anythingelse`와 같은 잘못된 경로로 요청을 보내면 **404 에러** 페이지가 표시됩니다.

---

#### 7. **서버 실행 흐름 시각화**

서버의 실행 흐름을 다음과 같이 시각화할 수 있습니다:

1. **서버 실행**:

```bash
$ node app.js
서버가 http://localhost:3000 에서 실행 중입니다!
```

2. **클라이언트 요청**:
   - 클라이언트가 **브라우저**를 통해 `http://localhost:3000/hello`에 접속하면:

```js
요청 URL: /hello
```

3. **서버 응답**:
   - 서버는 `hello.html` 파일을 읽어서 **200 OK** 상태와 함께 클라이언트에 전달합니다.

```js
응답: 200 OK
응답 내용: <h1>Hello Page</h1><img src="./first.png" alt="first" />
```

4. **이미지 파일 요청**:
   - 클라이언트가 `http://localhost:3000/first.png`로 요청하면, 서버는 `first.png` 이미지를 클라이언트에 전송합니다.

```js
응답: 200 OK
응답 내용: (이미지 데이터)
```

5. **404 처리**:
   - 잘못된 경로로 요청을 보내면, 서버는 `404` 상태 코드와 **"404 Not Found"** 메시지를 응답합니다.

```js
응답: 404 Not Found
응답 내용: 404 Not Found
```

---

#### 8. **최종 정리**

- **정적 파일 서빙**:
  - 이번 예제에서는 **HTML 파일**과 **이미지 파일**을 클라이언트에게 서빙하는 방법을 배웠습니다.
  - **MIME-TYPE**을 사용하여 클라이언트가 받은 파일의 형식을 올바르게 처리하도록 도왔습니다.

- **라우팅 처리**:
  - 요청된 경로에 따라 **정적 파일을 반환**하고, 잘못된 경로에 대해서는 **404 에러**를 반환하는 방식으로 서버를 구현했습니다.

- **서버와 클라이언트**:
  - 서버는 클라이언트의 요청에 맞는 파일을 반환하며, 클라이언트는 이 파일을 웹 페이지로 렌더링하거나 표시합니다.
