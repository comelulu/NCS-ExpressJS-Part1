# 40. Users Route 만들기 Part 1 - 기본 설정

#### 1. 프로젝트 폴더 구조 설정

```bash
memos-project/
├── node_modules/                # 설치된 npm 패키지들
├── public/                      # 정적 파일(CSS, JS, 이미지 등)
├── views/                       # EJS 템플릿 파일
│   ├── users/                   # 사용자 관련 EJS 템플릿
│   │   ├── login.ejs            # 로그인 페이지
│   │   ├── register.ejs         # 회원가입 페이지
├── routes/                      # 라우트 처리
│   ├── users.js                 # 사용자 관련 라우트
├── middlewares/                 # 미들웨어 파일
├── data/                        # 데이터 파일 (메모, 사용자 정보 등)
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

#### 2. `routes/users.js` - 사용자 라우트 기본 설정

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// 라우터를 생성합니다.
const router = express.Router();

// 사용자 로그인 페이지 라우트
router.get("/login", (req, res) => {
  // 로그인 페이지를 렌더링
  res.render("users/login");
});

// 사용자 회원가입 페이지 라우트
router.get("/register", (req, res) => {
  // 회원가입 페이지를 렌더링
  res.render("users/register");
});

// 사용자 로그인 처리 라우트 (POST 방식)
router.post("/login", (req, res) => {
  // 로그인 요청 처리
  const { username, password } = req.body;
  
  // 실제로는 데이터베이스에서 확인해야 하지만, 예시로 간단히 처리
  if (username === "test" && password === "password") {
    res.send("로그인 성공");
  } else {
    res.send("로그인 실패");
  }
});

// 사용자 회원가입 처리 라우트 (POST 방식)
router.post("/register", (req, res) => {
  // 회원가입 요청 처리
  const { username, password } = req.body;

  // 실제로는 데이터베이스에 사용자 정보를 저장해야 하지만, 예시로 간단히 처리
  res.send(`회원가입 성공! 사용자 이름: ${username}`);
});

// 사용자 라우터를 다른 곳에서 사용하려면 이 라우터를 export 해야 합니다.
module.exports = router;
```

#### 3. `index.js` - 서버 설정 및 사용자 라우터 연결

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// 경로 관련 모듈을 불러옵니다.
const path = require("path");
// 사용자 라우터를 불러옵니다.
const usersRouter = require("./routes/users");

// Express 애플리케이션을 생성합니다.
const app = express();

// EJS를 템플릿 엔진으로 사용 설정
app.set("view engine", "ejs");
// views 폴더 경로 설정
app.set("views", path.join(__dirname, "views"));

// 요청 본문을 파싱하기 위한 미들웨어 설정 (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// 사용자 라우터를 '/users' 경로로 설정
app.use("/users", usersRouter);

// 기본 경로 설정
app.get("/", (req, res) => {
  res.send("Memos Project is running!");  // 기본적인 응답
});

// 서버 실행
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);  // 서버 실행 메시지
});
```

#### 4. `views/users/login.ejs` - 사용자 로그인 페이지

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>  <!-- 로그인 페이지 제목 -->
  </head>
  <body>
    <h1>Login</h1>  <!-- 페이지 제목 -->

    <!-- 로그인 폼 -->
    <form action="/users/login" method="post">  <!-- 로그인 요청을 처리하는 POST 폼 -->
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required />  <!-- 사용자 이름 입력 필드 -->
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />  <!-- 비밀번호 입력 필드 -->
      <button type="submit">Login</button>  <!-- 로그인 버튼 -->
    </form>
  </body>
</html>
```

#### 5. `views/users/register.ejs` - 사용자 회원가입 페이지

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Register</title>  <!-- 회원가입 페이지 제목 -->
  </head>
  <body>
    <h1>Register</h1>  <!-- 페이지 제목 -->

    <!-- 회원가입 폼 -->
    <form action="/users/register" method="post">  <!-- 회원가입 요청을 처리하는 POST 폼 -->
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required />  <!-- 사용자 이름 입력 필드 -->
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />  <!-- 비밀번호 입력 필드 -->
      <button type="submit">Register</button>  <!-- 회원가입 버튼 -->
    </form>
  </body>
</html>
```

#### 6. 시각화

##### 프로젝트 폴더 구조

```bash
memos-project/
├── node_modules/                # 설치된 npm 패키지들
├── public/                      # 정적 파일(CSS, JS, 이미지 등)
├── views/                       # EJS 템플릿 파일
│   ├── users/                   # 사용자 관련 EJS 템플릿
│   │   ├── login.ejs            # 로그인 페이지
│   │   ├── register.ejs         # 회원가입 페이지
├── routes/                      # 라우트 처리
│   ├── users.js                 # 사용자 관련 라우트
├── middlewares/                 # 미들웨어 파일
├── data/                        # 데이터 파일 (메모, 사용자 정보 등)
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

##### 사용자의 로그인 및 회원가입 흐름

1. 사용자가 `/users/login` 경로에 접속하면 로그인 폼이 표시됩니다.
2. 로그인 폼에서 사용자는 `username`과 `password`를 입력하고 제출합니다.
3. 제출된 정보는 `/users/login` 경로에서 처리되며, 로그인 성공 또는 실패 메시지가 사용자에게 표시됩니다.
4. 사용자가 `/users/register` 경로에 접속하면 회원가입 폼이 표시됩니다.
5. 회원가입 폼에서 사용자 정보가 제출되면 `/users/register` 경로에서 처리되어 새 사용자가 등록됩니다.

---

### 최종 정리

1. **폴더 구조**:
   - `routes/users.js`: 사용자 관련 라우트 설정 (로그인, 회원가입 등).
   - `views/users/`: 로그인 및 회원가입을 위한 EJS 템플릿 파일들을 저장.
   - `index.js`: Express 서버와 라우터 설정.
  
2. **라우트 기능**:
   - `/users/login`: 로그인 폼을 표시하고 로그인 처리.
   - `/users/register`: 회원가입 폼을 표시하고 회원가입 처리.

이렇게 기본적인 사용자 라우트를 설정하고, 로그인 및 회원가입 처리를 구현했습니다.