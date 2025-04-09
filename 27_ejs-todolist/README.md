
# 27. 🎓 EJS Todolist 만들기 – 폼 처리, 반복 출력, 파셜 분리

---

## 📁 폴더 구조

```
📦 ejs-todolist
 ┣ 📄 app.js
 ┣ 📄 package.json
 ┣ 📂public
 ┃ ┣ 📄 styles.css       ← CSS 스타일 정의
 ┃ ┣ 📄 app.js           ← 브라우저에서 실행되는 JS (줄긋기 기능)
 ┃ ┗ 📄 hello.html       ← 정적 HTML 예시 파일
 ┣ 📂views
 ┃ ┣ 📂partials
 ┃ ┃ ┗ 📄 head.ejs       ← head 태그 구성 파셜
 ┃ ┗ 📄 index.ejs        ← Todolist 메인 페이지
```

---

## 1️⃣ 📄 app.js (서버 전체 코드 – 주석 포함)

```js
const path = require("path");
const express = require("express");

const app = express();

// 할 일 목록을 저장할 배열 (서버 메모리 내 저장)
const todos = [];

// POST 요청에서 폼 데이터를 해석할 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public 폴더를 정적(static) 경로로 설정 (CSS, JS, 이미지 등 제공)
app.use(express.static("public"));

// EJS 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// GET 요청: Todolist 메인 페이지 렌더링
app.get("/", (req, res) => {
  res.render("index.ejs", {
    name: "Hello World", // 현재는 사용하지 않지만 예시용으로 전달
    todos: todos          // 현재까지의 todo 목록을 전달
  });
});

// POST 요청: 폼에서 새로운 todo를 추가
app.post("/", (req, res) => {
  todos.push(req.body);   // form에서 입력한 데이터를 배열에 저장
  res.redirect("/");      // 다시 홈으로 리다이렉트
});

// 서버 실행
app.listen(3000, () => {
  console.log("Server is Listening on port 3000");
});
```

---

## 2️⃣ 📄 public/app.js (브라우저에서 실행되는 JS – 줄긋기 기능)

```js
// 모든 .todo 요소를 찾아서 클릭 이벤트를 걸어줌
const todos = document.querySelectorAll(".todo");

for (todo of todos) {
  todo.addEventListener("click", () => {
    // 클릭한 항목에 줄 긋기 스타일 적용
    todo.style.textDecoration = "line-through";
  });
}
```

---

## 3️⃣ 📄 public/styles.css (기본 스타일 정의)

```css
h1 {
  color: red; /* 제목을 빨간색으로 표시 */
}
```

---

## 4️⃣ 📄 public/hello.html (정적 HTML 페이지 예시)

```html
<!-- public 폴더에 있으므로 /hello.html로 접근 가능 -->
<h1>First Element</h1>
```

📌 `http://localhost:3000/hello.html` 로 접속 시 이 파일이 열립니다.

---

## 5️⃣ 📄 views/partials/head.ejs (공통 head 구성 파셜)

```ejs
<head>
  <title>Todo list</title>
  <!-- 외부 CSS 연결 -->
  <link rel="stylesheet" href="/styles.css" />
  <!-- 외부 JS 연결 (defer로 페이지 로딩 후 실행) -->
  <script src="/app.js" defer></script>
</head>
```

---

## 6️⃣ 📄 views/index.ejs (Todolist 메인 템플릿)

```ejs
<!DOCTYPE html>
<html lang="ko">
  <%- include("partials/head.ejs") %>

  <body>
    <h1>Todolist</h1>

    <h3>Add a new todo</h3>

    <!-- 새로운 todo 추가 폼 -->
    <form action="/" method="post">
      <input type="text" name="text" />
      <input type="submit" />
    </form>

    <ul>
      <!-- todos 배열을 순회하며 출력 -->
      <% for (todo of todos) { %>
        <li class="todo"><%= todo.text %></li>
      <% } %>
    </ul>
  </body>
</html>
```

📌 설명:
- `<%- include() %>` 를 이용해 head 파셜을 삽입  
- `for` 반복문으로 할 일 목록을 출력  
- `.todo` 클래스는 `public/app.js`에서 클릭 시 줄 긋기 처리됨

---

## ✅ 실행 방법 요약

1. 프로젝트 폴더 생성 및 이동  
   ```bash
   mkdir ejs-todolist && cd ejs-todolist
   ```

2. 필요한 패키지 설치  
   ```bash
   npm init -y
   npm install express ejs
   ```

3. 위 파일들을 폴더 구조에 맞게 저장

4. 서버 실행  
   ```bash
   node app.js
   ```

5. 브라우저 접속  
   - Todolist 페이지: [http://localhost:3000/](http://localhost:3000/)  
   - 정적 HTML 테스트: [http://localhost:3000/hello.html](http://localhost:3000/hello.html)

---

## 📌 주요 포인트 요약

| 항목 | 설명 |
|------|------|
| **폼 처리** | `<form>` → POST → 서버에서 배열에 저장 |
| **템플릿 렌더링** | `res.render("index.ejs", { todos })` |
| **반복 출력** | `<% for (...) { %>` 구문으로 리스트 출력 |
| **JS 동작** | 클릭 시 줄긋기 (`public/app.js`) |
| **파셜 구조** | `head.ejs` 포함으로 중복 제거 |
| **정적 파일 제공** | `public/` 폴더에서 HTML, CSS, JS 제공 |
