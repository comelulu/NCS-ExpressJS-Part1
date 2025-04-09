# 11. Express Static Middleware

---

```js
// 1. Express 모듈을 불러와 앱 인스턴스를 생성합니다.
//    이 앱 객체는 라우팅 설정, 미들웨어 연결 등 서버 전체 설정의 중심이 됩니다.
const express = require("express");
const app = express();

// 2. express.static() 미들웨어를 사용하여 정적 파일 제공을 설정합니다.
//    'public' 디렉토리 안의 파일들을 웹에서 직접 접근 가능하도록 만들어줍니다.
//    즉, 이 폴더는 '웹 루트 폴더'처럼 동작하게 됩니다.
app.use(express.static("public"));

/*
✅ 정적 파일(Static File)이란?
- 서버에서 특별한 처리 없이 그대로 클라이언트에게 전달되는 파일입니다.
- 예: 이미지(.jpg, .png), 스타일시트(.css), 자바스크립트 파일(.js), 폰트 파일 등

✅ express.static("디렉토리명")이 하는 일:
- 사용자가 브라우저에서 특정 파일을 요청하면, Express가 해당 파일을 찾아 자동으로 응답해 줍니다.
- 예: 'public/image.png' 파일 → http://localhost:3000/image.png 로 접근 가능

✅ 장점:
- 파일을 직접 읽고 MIME 타입을 설정하고 응답하는 번거로운 과정을 자동화해줍니다.
- 성능 최적화 및 보안 관련 기본 설정이 포함되어 있어 안정적으로 작동합니다.
- 프론트엔드 리소스를 제공하는 데 매우 적합합니다.
*/

app.get("/", (req, res) => {
  // 기본 라우트: 사용자가 브라우저에서 '/' 주소로 접근했을 때 실행됩니다.
  // 이 응답은 HTML 텍스트를 그대로 브라우저에 전달합니다.
  res.send("<h1>Homepage</h1>");
});

// 3. 서버를 3000번 포트에서 실행합니다.
//    브라우저에서 http://localhost:3000 으로 접속하면 이 서버에 연결됩니다.
app.listen(3000, () => {
  console.log("✅ 서버가 3000번 포트에서 실행 중입니다.");
});
```

---

### 📂 폴더 구조 예시

```bash
📁 프로젝트 폴더
├── app.js
└── public
    ├── image.png
    ├── style.css
    └── script.js
```

### 📌 접속 예시

| 파일 경로                 | 접속 URL                                   |
|--------------------------|--------------------------------------------|
| `public/image.png`       | http://localhost:3000/image.png            |
| `public/style.css`       | http://localhost:3000/style.css            |
| `public/script.js`       | http://localhost:3000/script.js            |

---

### 🔍 왜 static 미들웨어가 중요한가요?

Node.js 기본 HTTP 모듈로 정적 파일을 제공하려면 아래와 같은 일들을 **직접 처리해야 합니다**:

1. 요청 URL에서 파일 경로 파싱  
2. 해당 경로에 파일이 존재하는지 확인  
3. 파일을 `fs.readFile()`로 읽음  
4. 파일 확장자에 맞는 Content-Type(MIME 타입) 설정  
5. 파일 내용을 응답으로 전송  

이런 모든 과정은 **express.static() 미들웨어가 자동으로 처리**해줍니다.  
→ 그래서 훨씬 **간단하고 효율적이며 안정적**입니다!