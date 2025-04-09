# 31. HTTP 헤더 이해하기 – 브라우저와 서버의 약속

---

## 🧠 HTTP 메시지의 정체는?

브라우저와 서버는 단순히 "주소만 요청해서 화면을 받아오는 게 아닙니다."  
**HTTP 메시지라는 포맷**으로 대화를 주고받고 있어요.

---

### 📬 실제 HTTP 메시지 예시

#### ✅ 클라이언트 → 서버 (Request)

```js
GET /json HTTP/1.1
Host: localhost:3000
User-Agent: Chrome/122.0
Accept: application/json
```

#### ✅ 서버 → 클라이언트 (Response)

```js
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache
Content-Length: 34

{ "message": "Hello, World!" }
```

---

## 🔍 HTTP 헤더는 왜 중요할까?

HTTP 메시지에는 본문(body) 외에도, 위와 같이 `헤더(header)`라는 정보가 함께 담깁니다.  
이 헤더는 마치 서로 간의 "대화 전 약속" 같은 역할을 하며 다음을 포함합니다:

| 헤더 이름         | 설명 |
|------------------|------|
| Content-Type     | 이 응답이 어떤 타입의 데이터인지? (JSON, HTML 등) |
| Cache-Control    | 이 응답을 캐시해도 되는지? 얼마나 오래? |
| Content-Length   | 응답 본문의 크기 |
| Set-Cookie       | 브라우저에 저장할 쿠키 정보 |
| Authorization    | 사용자가 로그인 되어 있는지? 토큰은 무엇인지? |

---

## 📦 실습 구조 예시

```
📦 express-header-demo
 ┣ 📄 app.js           ← 다양한 헤더를 다루는 메인 서버 파일
```

---

## 1️⃣ 📄 app.js – 다양한 HTTP 헤더 설정 예제

```js
const express = require("express"); // Express 불러오기
const app = express();              // Express 앱 생성

/* -------------------------------------------------------------------
  [1] Content-Type 설정 – 응답 데이터의 형식을 알려주는 헤더입니다.
------------------------------------------------------------------- */
app.get("/json", (req, res) => {
  res.set("Content-Type", "application/json"); // 명시적으로 Content-Type 설정
  res.send(JSON.stringify({ message: "Hello, World!" })); // JSON 문자열 응답
});

/* -------------------------------------------------------------------
  [2] Cache-Control 설정 – 브라우저가 응답을 저장(캐시)할 수 있는지 설정합니다.
------------------------------------------------------------------- */

// (1) 캐시 금지
app.get("/no-cache", (req, res) => {
  res.set("Cache-Control", "no-cache"); // 항상 서버에서 새로 요청해야 함
  res.send("This response is not cached.");
});

// (2) 1시간 캐시 허용
app.get("/cache", (req, res) => {
  res.set("Cache-Control", "max-age=3600"); // 1시간 동안 브라우저에 저장 가능
  res.send("This response is cached for 1 hour.");
});

/* -------------------------------------------------------------------
  [3] res.type() – Content-Type을 더 간편하게 설정할 수 있는 메서드입니다.
------------------------------------------------------------------- */
app.get("/text", (req, res) => {
  res.type("text"); // Content-Type: text/plain
  res.send("이건 일반 텍스트입니다.");
});

app.get("/html", (req, res) => {
  res.type("html"); // Content-Type: text/html
  res.send("<h1>HTML 페이지입니다</h1>");
});

/* -------------------------------------------------------------------
  [4] res.status() – 응답 상태 코드를 지정할 수 있습니다.
------------------------------------------------------------------- */
app.get("/unauthorized", (req, res) => {
  res.status(401).send("접근 권한이 없습니다."); // 401 Unauthorized
});

app.get("/not-found", (req, res) => {
  res.status(404).send("요청하신 페이지를 찾을 수 없습니다."); // 404 Not Found
});

// 서버 시작
app.listen(3000, () => {
  console.log("app listening at http://localhost:3000");
});
```

---

## 📡 요청–응답 흐름 시각화

```
🧍‍♂️ 사용자 요청: GET /json
─────────────────────────────
↓ 브라우저에서 요청 보냄
↓
📦 서버 응답:
  - Status: 200 OK
  - Content-Type: application/json
  - Body: { "message": "Hello, World!" }
↓
🧠 브라우저가 JSON으로 파싱해서 처리
```

```
🧍‍♀️ 사용자 요청: GET /cache
─────────────────────────────
↓
📦 서버 응답:
  - Cache-Control: max-age=3600
↓
🧠 브라우저가 응답을 1시간 동안 저장(재요청 없이 사용)
```

---

## ✅ Express에서 헤더를 다루는 메서드 요약

| 메서드 | 설명 | 예시 |
|--------|------|------|
| `res.set(name, value)` | 특정 헤더 수동 설정 | `res.set("Cache-Control", "no-cache")` |
| `res.type(type)` | Content-Type을 간편하게 설정 | `res.type("json")` → `application/json` |
| `res.status(code)` | 상태 코드 지정 | `res.status(404)` |

---

## ✅ 마무리 정리

| 개념 | 설명 |
|------|------|
| HTTP 메시지 | 요청과 응답은 헤더 + 바디로 구성됨 |
| 헤더 | 메타 정보 전달 (데이터 형식, 캐시, 인증 등) |
| Express 설정 | `res.set`, `res.type`, `res.status`로 헤더 제어 |
| 실전 활용 | JSON API, 캐시 제어, 인증 응답 등에서 매우 중요 |

---

📘 **TIP**  
브라우저에서 개발자 도구(F12) → [Network 탭] → [Headers]를 열어보면  
모든 HTTP 헤더가 실제로 어떻게 오가는지 직접 확인할 수 있습니다!

---
