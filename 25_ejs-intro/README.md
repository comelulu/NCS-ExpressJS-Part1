# 25. 🎓 강의: EJS란? Express에서 EJS 템플릿을 사용하는 방법 (ejs-intro)

---

## 🧠 EJS란?

> EJS (Embedded JavaScript)는 HTML 안에서 자바스크립트 문법을 사용할 수 있게 해주는 템플릿 엔진입니다.

- 서버에서 HTML을 동적으로 만들어서 사용자에게 전달할 때 사용합니다.
- SSR(Server Side Rendering)을 구현할 때 매우 유용합니다.
- HTML 안에서 `<%= %>` 같은 태그로 **자바스크립트 데이터를 삽입**할 수 있습니다.

---

## 💬 현실 비유로 쉽게 이해하기

### 🍱 도시락 가게 비유

> EJS는 마치 **반찬 자리(HTML 틀)에 데이터를 자동으로 채워주는 도시락 포장 기계**와 같습니다.

- 도시락 틀(HTML)은 미리 정해져 있고,
- 그 안에 들어갈 반찬(데이터)을 자바스크립트가 자동으로 넣어줍니다.

즉, `title`이라는 데이터가 `"Hello, EJS!"`라면,  
HTML 안의 `<%= title %>` 자리에 그 값이 **자동으로 들어갑니다.**

---

## 🗂 파일 구성 예시 (실습 코드 기준)

```
📁 views/
   └── index.ejs        👉 EJS 템플릿 파일 (HTML + JS 섞여 있음)

📄 template.js           👉 Express 서버 코드
```

---

## ✨ 실습 코드 예제

### 📄 `template.js`

```js
const express = require("express");
const app = express();

// ① 사용할 템플릿 엔진을 'ejs'로 설정합니다
app.set("view engine", "ejs");

/*
  🔍 view engine이란?
  - "Express야, 나는 화면을 만들 때 ejs라는 템플릿 도구를 쓸 거야" 하고 알려주는 설정입니다.
  - 'ejs' 말고도 pug, handlebars 등 다양한 템플릿 엔진을 사용할 수 있습니다.
*/

// ② EJS 파일이 저장된 폴더 경로를 지정합니다
app.set("views", "./views");

/*
  🔍 views란?
  - "ejs 파일들이 어디 폴더에 있는지"를 알려주는 설정입니다.
  - 기본값은 "./views"지만, 명시적으로 적어주는 게 좋습니다.
  - 즉, 'res.render("index")'라고 했을 때, 실제로는 './views/index.ejs' 파일을 찾게 됩니다.
*/

// ③ 루트 경로로 요청이 오면 index.ejs 파일을 렌더링합니다
app.get("/", (req, res) => {
  // index.ejs 파일을 불러오고, title 값을 전달합니다
  res.render("index", { title: "Hello, EJS!" });

  /*
    🔍 res.render(뷰 파일 이름, 데이터 객체)
    - 첫 번째 인자: 렌더링할 ejs 파일 이름입니다 (확장자 없이)
    - 두 번째 인자: HTML 안에서 사용할 데이터를 객체로 넘깁니다
    - 예: index.ejs 안에서 <%= title %>로 "Hello, EJS!"가 들어갑니다
  */
});

// ④ 서버 실행
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

### 📄 `views/index.ejs`

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- 템플릿 엔진을 사용해 title을 HTML <title>에 삽입합니다 -->
  <title><%= title %></title>
</head>
<body>
  <!-- 똑같이 title을 h1 제목에도 삽입합니다 -->
  <h1><%= title %></h1>
</body>
</html>
```

---

## 🔍 핵심 코드 흐름 쉽게 설명하기

### 🧩 1단계: 서버가 시작됩니다

- `view engine`을 `ejs`로 설정합니다.
- `views`라는 폴더 안에 `.ejs` 파일을 두기로 약속합니다.

### ⚙️ 2단계: 사용자가 브라우저에서 `/`로 접속합니다

- 브라우저가 `http://localhost:3000`에 요청을 보냅니다.
- 서버는 해당 요청을 받으면 `res.render()`를 실행합니다.

### 🧱 3단계: 서버가 HTML을 만듭니다

```js
res.render("index", { title: "Hello, EJS!" });
```

- 서버는 `index.ejs` 파일을 열고,
- 그 안의 `<%= title %>` 부분에 `"Hello, EJS!"`라는 값을 넣고,
- 완성된 HTML을 만들어 브라우저에 전달합니다.

---

## 🛍️ 전체 흐름 요약 (시각화)

```
[1] 사용자가 / 주소로 요청
     ↓
[2] 서버가 index.ejs 파일을 찾음
     ↓
[3] title: "Hello, EJS!" 데이터를 삽입
     ↓
[4] 완성된 HTML을 브라우저에 전달
     ↓
[5] 브라우저가 렌더링하여 사용자에게 표시
```

👉 이 과정은 모두 서버에서 이루어지므로 **SSR(서버 측 렌더링)**입니다.

---

## 🧠 헷갈릴 수 있는 핵심 용어 요약

| 개념           | 설명                                                      |
| -------------- | --------------------------------------------------------- |
| `view engine`  | "템플릿 엔진으로 ejs를 쓸게요" 라고 express에 알려주는 것 |
| `views`        | ejs 파일들이 들어 있는 폴더의 경로                        |
| `res.render()` | 템플릿 파일을 HTML로 바꿔서 사용자에게 보내는 함수        |
| `<%= %>`       | 데이터를 HTML에 출력하는 ejs 문법                         |

---

## 📊 EJS 템플릿의 장점 요약

| 장점                        | 설명                                          |
| --------------------------- | --------------------------------------------- |
| HTML 안에서 JS를 섞기 쉬움  | `<%= %>`로 간단하게 변수 삽입 가능            |
| Express와 자연스럽게 통합됨 | `res.render()`와 바로 연결됨                  |
| 뷰와 데이터 분리 가능       | 유지보수가 쉬워짐                             |
| SSR 구조에 최적             | HTML을 서버에서 완성해서 사용자에게 전달 가능 |

---

## 💭 최종 한 줄 요약

```
EJS는 HTML 안에 자바스크립트를 삽입할 수 있게 해주며,
Express에서는 view engine과 views 설정으로 쉽게 SSR을 구현할 수 있습니다.
```
