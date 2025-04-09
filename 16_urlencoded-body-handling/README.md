# 16. URLEncoded-Body-Handling

## 💻 `login.html` – HTML 로그인 폼

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Login</title>
  </head>
  <body>
    <h2>Login Form</h2>

    <!-- 사용자가 로그인 정보를 입력하고 제출하면 -->
    <!-- http://localhost:3000/login 주소로 POST 요청이 전송됩니다 -->
    <form action="http://localhost:3000/login" method="POST">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required />
      </div>
      <button type="submit">Login</button>
    </form>
  </body>
</html>
```

---

## 🛠️ `app.js` – Express 서버

```js
const express = require("express");
const app = express();

/*
==========================================================
🔧 express.urlencoded({ extended: true })
----------------------------------------------------------
- HTML form에서 전송된 데이터를 해석(parsing)하여 req.body에 저장합니다.
- 기본적으로 form은 'application/x-www-form-urlencoded' 타입으로 데이터를 보냅니다.
- extended: true → 객체 안에 배열이나 중첩된 객체까지 파싱 가능 (권장)
*/
app.use(express.urlencoded({ extended: true }));

/*
==========================================================
📨 POST /login
----------------------------------------------------------
- 사용자가 로그인 폼을 제출하면 이 라우트가 실행됩니다.
- 입력한 username과 password가 req.body에 저장됩니다.
*/
app.post("/login", (req, res) => {
  console.log(req.body); // 예: { username: 'Alice', password: '1234' }

  // 이후 로그인 검증 로직이 이곳에 들어갈 수 있습니다.

  res.send("Data received");
});

/*
==========================================================
🚀 서버 실행
==========================================================
*/
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
```

---

## 🎯 실제 요청 예시 흐름

### 사용자가 HTML 페이지에서 로그인 폼을 작성합니다:

```js
👩‍💻 브라우저에서 로그인 폼 작성:
  Username: Alice
  Password: 1234

🖱️ Login 버튼 클릭 → 폼 제출 (form POST)
```

---

## 🧭 서버 동작 흐름 시각화

```js
클라이언트 브라우저에서 POST /login 요청 발생
│
├─ [1단계] express.urlencoded 미들웨어 실행
│    └─ HTML form 데이터 파싱:
│         req.body = { username: "Alice", password: "1234" }
│
├─ [2단계] app.post("/login") 실행
│    └─ console.log(req.body) → 출력됨
│    └─ res.send("Data received") 응답 전송
│
└─ 클라이언트 화면에 "Data received" 메시지 표시됨
```

---

## 🖨️ 콘솔 출력 결과

```bash
{ username: 'Alice', password: '1234' }
```

---

## 📬 응답 화면

브라우저에 다음과 같은 텍스트가 표시됩니다:

```js
Data received
```

---

## 🧠 실무 비유

- `express.urlencoded()`는 마치 종이 폼(form)을 사람이 읽을 수 있게 번역해주는 번역기 같아요.
- 사용자가 웹에서 입력한 데이터를 서버가 이해할 수 있도록 변환해주는 역할을 합니다.
- `req.body`는 사용자 입력 내용을 담은 객체(주문서)입니다.

---

## 📘 개념 요약

| 항목 | 설명 |
|------|------|
| `form` 태그 + `POST` | 브라우저가 HTML 형식으로 데이터를 서버에 전송 |
| `express.urlencoded()` | form 데이터를 해석하여 `req.body`에 저장 |
| `req.body` | 전송된 폼 데이터가 담긴 객체 |
| `res.send()` | 서버가 응답을 보낼 때 사용 (여기선 단순 텍스트) |

---

## 🧪 실전 테스트 방법

1. 서버 실행  
   ```bash
   node app.js
   ```

2. `login.html` 열기 (브라우저에서 열면 됨, 또는 Live Server 사용)

3. 이름과 비밀번호 입력 후 `Login` 버튼 클릭

4. 서버 터미널 출력 확인:

   ```
   { username: 'Alice', password: '1234' }
   ```

5. 브라우저에 `"Data received"` 응답 표시됨

---
