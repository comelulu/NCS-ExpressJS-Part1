# 42. Users Route 만들기 Part 3 - 로그인과 로그아웃 처리

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
│   ├── ensureDataFileExists.js  # 데이터 파일 존재 여부 체크 미들웨어
├── data/                        # 데이터 파일 (메모, 사용자 정보 등)
│   └── users.json               # 사용자 데이터 저장 파일
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

#### 2. `routes/users.js` - 로그인과 로그아웃 처리

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// bcrypt 모듈을 사용하여 비밀번호를 해시 처리합니다.
const bcrypt = require("bcrypt");
// JWT 모듈을 사용하여 인증 토큰을 처리합니다.
const jwt = require("jsonwebtoken");
// 파일 시스템 모듈을 사용하여 데이터를 저장합니다.
const fs = require("fs");
// 경로 관련 모듈을 불러옵니다.
const path = require("path");

// 사용자 데이터 파일 경로 설정
const DATA_FILE = path.join(__dirname, "..", "data", "users.json");

// 사용자 라우터를 생성합니다.
const router = express.Router();

// 로그인 페이지 라우트
router.get("/login", (req, res) => {
  // 로그인 페이지를 렌더링
  res.render("users/login");
});

// 로그인 처리 라우트
router.post("/login", (req, res) => {
  const { username, password } = req.body;  // 요청 본문에서 사용자 이름과 비밀번호 가져오기

  // 사용자 데이터 파일을 읽습니다.
  const users = JSON.parse(fs.readFileSync(DATA_FILE));

  // 사용자 이름에 해당하는 사용자 찾기
  const user = users.find((u) => u.username === username);

  if (!user) {
    // 사용자 이름이 없으면 로그인 실패
    return res.status(400).send("Invalid username or password");
  }

  // 비밀번호가 일치하는지 확인
  if (bcrypt.compareSync(password, user.password)) {
    // 비밀번호가 맞으면 JWT 토큰 생성
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });  // 클라이언트에 JWT 토큰을 쿠키로 저장
    res.send("Login successful");
  } else {
    // 비밀번호가 일치하지 않으면 로그인 실패
    return res.status(400).send("Invalid username or password");
  }
});

// 로그아웃 처리 라우트
router.post("/logout", (req, res) => {
  // 쿠키에서 JWT 토큰을 삭제
  res.clearCookie("token");
  res.send("Logout successful");
});

module.exports = router;
```

#### **상세 설명:**

1. **로그인 페이지 라우트 (`/login`)**:
   - `GET /users/login`: 로그인 페이지를 렌더링합니다. 사용자가 이 경로로 접근하면 `views/users/login.ejs` 템플릿이 렌더링되어 로그인 폼을 보여줍니다.

2. **로그인 처리 라우트 (`/login`)**:
   - `POST /users/login`: 사용자가 로그인 폼을 제출하면 이 라우트가 실행됩니다.
   - **비밀번호 확인**:
     - `bcrypt.compareSync(password, user.password)`: 사용자가 입력한 비밀번호와 데이터베이스에 저장된 해시된 비밀번호를 비교합니다. `bcrypt.compareSync()`는 동기적으로 비밀번호를 비교합니다.
   - **JWT 토큰 생성**:
     - 로그인에 성공하면 `jwt.sign()`를 사용하여 JWT 토큰을 생성합니다. 이 토큰은 사용자의 ID를 포함하며, `process.env.JWT_SECRET`로 서명됩니다.
   - **쿠키에 JWT 저장**:
     - `res.cookie("token", token, { httpOnly: true })`: 생성된 JWT 토큰을 HTTP-only 쿠키로 클라이언트에 저장하여 이후 인증된 요청에 사용할 수 있게 합니다.

3. **로그아웃 처리 라우트 (`/logout`)**:
   - `POST /users/logout`: 사용자가 로그아웃 버튼을 클릭하면 이 라우트가 실행됩니다.
   - **쿠키 삭제**:
     - `res.clearCookie("token")`: 클라이언트의 쿠키에서 JWT 토큰을 삭제하여 사용자가 로그아웃된 상태로 만듭니다.

---

#### 3. `views/users/login.ejs` - 로그인 페이지

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

#### **상세 설명:**

- **로그인 폼**:
  - 사용자가 `username`과 `password`를 입력할 수 있는 폼을 제공합니다.
  - 폼이 제출되면 `POST /users/login` 경로로 데이터를 전송하고, 서버에서 로그인 처리가 이루어집니다.

---

#### 4. `index.js` - 서버 설정 및 사용자 라우터 연결

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

#### **상세 설명:**

- **`express.urlencoded({ extended: true })`**:
  - 이 미들웨어는 요청 본문에서 URL 인코딩된 데이터를 파싱하여 `req.body` 객체로 전달합니다. 회원가입 및 로그인 폼 데이터를 처리할 때 사용됩니다.
  
- **사용자 라우터 설정**:
  - `app.use("/users", usersRouter)`: `/users` 경로로 들어오는 요청을 `usersRouter`로 처리합니다. 이 라우터는 로그인, 회원가입, 로그아웃을 처리합니다.

- **서버 실행**:
  - `app.listen(port, () => {...})`: 서버를 `3000`번 포트에서 실행하며, 서버가 정상적으로 실행되었음을 콘솔에 출력합니다.

---

#### 5. `data/users.json` - 사용자 데이터 저장 파일

```json
[
  {
    "id": "1",
    "username": "test",
    "password": "$2b$10$4q9DwppGced7oSdt0mYRJe76.T4jlEyq4U49dRk3HAX6CER8k8CoW"  // bcrypt로 해시된 비밀번호
  }
]
```

#### **상세 설명:**

- `users.json` 파일에는 사용자의 `id`, `username`, `password` (해시화된 비밀번호)가 저장됩니다.
- **비밀번호**는 `bcrypt`를 사용하여 해시화되며, 실제로 데이터베이스를 사용할 때는 이 방식으로 비밀번호를 저장하는 것이 안전합니다.

---

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
│   ├── ensureDataFileExists.js  # 데이터 파일 존재 여부 체크 미들웨어
├── data/                        # 데이터 파일 (메모, 사용자 정보 등)
│   └── users.json               # 사용자 데이터 저장 파일
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

##### 로그인과 로그아웃 흐름

1. 사용자가 `/users/login` 경로로 이동하면 로그인 폼이 표시됩니다.
2. 사용자는 `username`과 `password`를 입력하고 제출합니다.
3. 제출된 데이터는 `/users/login` 경로에서 처리되어:
   - 사용자 이름이 존재하고, 비밀번호가 일치하면 JWT 토큰을 생성하여 클라이언트의 쿠키에 저장합니다.
   - 로그인 성공 메시지가 반환됩니다.
4. 로그아웃은 `/users/logout` 경로에서 POST 방식으로 처리되며, 쿠키에서 JWT 토큰을 삭제하고 로그아웃 성공 메시지가 반환됩니다.

---

### 최종 정리

1. **폴더 구조**:
   - `routes/users.js`: 로그인과 로그아웃 기능을 포함한 사용자 라우트.
   - `views/users/login.ejs`: 로그인 페이지의 EJS 템플릿.
   - `data/users.json`: 사용자 데이터 저장 파일.
   - `index.js`: Express 서버와 라우터 설정.

2. **로그인과 로그아웃 처리**:
   - `/users/login`: 사용자가 입력한 `username`과 `password`를 확인하고, 로그인 성공 시 JWT 토큰을 생성하여 쿠키에 저장합니다.
   - `/users/logout`: 사용자가 로그아웃을 요청하면, 쿠키에서 JWT 토큰을 삭제하고 로그아웃 처리합니다.

이로써 로그인과 로그아웃 기능을 구현하였고, 이를 통해 사용자는 로그인 후 JWT 토큰을 이용하여 인증된 상태로 서비스를 사용할 수 있습니다.