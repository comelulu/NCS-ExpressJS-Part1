# 26. 🎓 EJS 기본 문법 정복하기 – if, forEach, include

---

## 🧠 EJS 문법 전체 정리

EJS는 Express와 함께 자주 사용하는 템플릿 엔진입니다.  
정적인 HTML에 동적인 데이터를 넣거나 조건에 따라 화면을 다르게 보여줘야 할 때 매우 유용합니다.  
특히 **변수 출력, 조건문, 반복문, 파셜(부분 템플릿) 포함** 기능은 EJS에서 가장 자주 쓰이며,  
이 강의에서는 이 기능들을 **직관적인 설명, 실제 코드, 연습용 예제와 주석까지 함께** 학습합니다.

---

## ✅ EJS로 HTML을 어떻게 더 동적으로 만들까?

HTML은 본래 한 번 만들어 놓으면 항상 같은 내용을 보여주는 **정적(Static)** 구조입니다.  
하지만 웹사이트에서는 사용자 로그인 여부에 따라 메뉴가 바뀌거나, 상품 목록처럼 반복되는 내용을 출력하는 등  
**조건 처리와 반복 출력이 필수**입니다.

EJS를 사용하면 HTML 안에서 **자바스크립트 문법**을 함께 사용할 수 있기 때문에,  
**동적인 웹페이지를 쉽게 만들 수 있습니다.**

---

## 🧩 EJS 문법 요약 & 상세 예시

---

### 1. 📌 변수 출력

📁 **views/pages/index.ejs**

```ejs
<!DOCTYPE html>
<html>
  <body>
    <!-- 변수 출력: <%= 변수명 %> -->
    <!-- title 값이 "EJS 연습"이라면 <h1>EJS 연습</h1> 으로 표시됨 -->
    <h1><%= title %></h1>

    <!-- description 값 출력 -->
    <p>이 페이지는 <%= description %> 입니다.</p>
  </body>
</html>
```

📄 **app.js (라우터 설정)**

```js
app.get("/", (req, res) => {
  // EJS 템플릿에 전달할 데이터
  res.render("pages/index", {
    title: "EJS 연습",               // <%= title %>
    description: "템플릿 엔진 연습 페이지"  // <%= description %>
  });
});
```

---

### 2. 📌 HTML 코드 그대로 출력 (주의 필요)

📁 **views/pages/raw.ejs**

```ejs
<!DOCTYPE html>
<html>
  <body>
    <h1>공지사항</h1>

    <!-- <%- %>는 HTML을 '그대로' 출력 -->
    <!-- noticeHtml 값이 "<strong>공지</strong>" 라면 실제로 굵은 글씨로 표시됨 -->
    <div><%- noticeHtml %></div>
  </body>
</html>
```

📄 **app.js**

```js
app.get("/raw", (req, res) => {
  const notice = "<strong>서버 점검 안내:</strong> 4월 12일 2시~4시";

  // HTML 태그가 포함된 문자열을 그대로 출력하려면 <%- %> 사용
  res.render("pages/raw", {
    noticeHtml: notice
  });
});
```

🛑 **주의:** `<%- %>`는 HTML 이스케이프를 하지 않으므로  
사용자 입력을 직접 출력하면 보안상 위험합니다 (XSS 공격 가능성).

---

### 3. 📌 조건문 (if)

📁 **views/pages/if.ejs**

```ejs
<!DOCTYPE html>
<html>
  <body>
    <% if (user) { %>
      <!-- user 객체가 존재할 때만 출력됨 -->
      <p><%= user.name %>님, 반갑습니다!</p>
    <% } else { %>
      <!-- user가 없을 때 출력됨 -->
      <p>로그인 해주세요.</p>
    <% } %>
  </body>
</html>
```

📄 **app.js**

```js
app.get("/if", (req, res) => {
  const isLoggedIn = true;

  // 로그인 여부에 따라 user 객체를 전달
  res.render("pages/if", {
    user: isLoggedIn ? { name: "홍길동" } : null
  });
});
```

📌 설명  
- `<% if () { %> ... <% } %>` 는 자바스크립트의 조건문과 동일하게 동작합니다.  
- `<%= %>` 는 실제 화면에 출력을 하고, `<% %>` 는 실행만 합니다.

---

### 4. 📌 반복문 (forEach)

📁 **views/pages/list.ejs**

```ejs
<!DOCTYPE html>
<html>
  <body>
    <h2>회원 목록</h2>

    <ul>
      <!-- users 배열을 반복하면서 각 user 출력 -->
      <% users.forEach(user => { %>
        <li><%= user.name %> - <%= user.age %>세</li>
      <% }); %>
    </ul>
  </body>
</html>
```

📄 **app.js**

```js
app.get("/list", (req, res) => {
  const users = [
    { name: "이영희", age: 22 },
    { name: "박철수", age: 35 },
    { name: "김민수", age: 28 }
  ];

  // users 배열을 템플릿으로 전달
  res.render("pages/list", { users });
});
```

📌 설명  
- `forEach`를 사용해 배열을 반복하면서 `<li>` 요소를 동적으로 생성합니다.  
- `<%= user.name %>` 은 각 사용자 이름을 출력합니다.

---

### 5. 📌 파셜 포함 (include)

📁 **views/partials/header.ejs**

```ejs
<!-- 헤더 파셜 파일 -->
<header>
  <h1>My 웹사이트</h1>
  <hr>
</header>
```

📁 **views/pages/with-partial.ejs**

```ejs
<!DOCTYPE html>
<html>
  <body>
    <!-- include 문법으로 다른 EJS 파일을 불러옴 -->
    <!-- header 파셜 삽입 -->
    <%- include('../partials/header') %>

    <p>이 페이지는 파셜을 포함한 예시입니다.</p>
  </body>
</html>
```

📄 **app.js**

```js
app.get("/partial", (req, res) => {
  // 헤더 파셜이 포함된 페이지 렌더링
  res.render("pages/with-partial");
});
```

📌 설명  
- `include()`는 반복되는 HTML 구조를 재사용할 수 있도록 도와줍니다.  
- `<%- include('경로') %>` 형식으로 작성하며, **views 폴더 기준 상대 경로**를 사용합니다.

---

## 🔁 실제 데이터 전달 예시 (통합 예시)

📄 **app.js**

```js
app.get("/", (req, res) => {
  const users = [
    { name: "홍길동", age: 30 },
    { name: "김철수", age: 25 }
  ];

  res.render("pages/index", {
    title: "홈페이지",        // <%= title %>
    users: users,             // 반복 출력용 데이터
    user: { name: "관리자" }  // 조건문에서 사용할 데이터
  });
});
```

📌 설명  
- `res.render("파일경로", { 데이터 })` 를 사용하면 해당 데이터를 템플릿에서 사용할 수 있습니다.  
- 템플릿 내부에서는 전달된 데이터를 `<%= 변수명 %>`으로 출력하거나 `<% %>`로 제어합니다.

---

## 💭 최종 요약

EJS는 HTML 안에 자바스크립트 문법을 사용할 수 있도록 도와주는 매우 직관적인 템플릿 엔진입니다.  
조건문, 반복문, 파셜 같은 기능을 통해 **동적인 페이지 구성**이 가능하며,  
**Express와 함께 사용하면 매우 효율적인 서버 렌더링 웹페이지**를 만들 수 있습니다.

---

## 📊 문법 정리표

| 문법 | 설명 |
|------|------|
| `<%= %>` | 값을 HTML에 출력 (보안 처리됨) |
| `<%- %>` | HTML을 그대로 출력 (주의 필요) |
| `<% %>`  | JS 코드 실행만 (출력 안 함) |
| `if` / `else` | 조건에 따라 HTML 분기 처리 |
| `forEach` | 배열 반복 출력 |
| `include()` | 파셜 삽입으로 코드 재사용 |
