# 41. Users Route 만들기 Part 2 - 회원가입 기능 구현

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

#### 2. `routes/users.js` - 회원가입 기능 구현

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// bcrypt 모듈을 사용하여 비밀번호를 해시 처리합니다.
const bcrypt = require("bcrypt");
// UUID 생성 모듈을 불러옵니다. 새로운 사용자 ID를 생성하기 위해 사용합니다.
const { v4: uuidv4 } = require("uuid");
// 파일 시스템 모듈을 사용하여 데이터를 저장합니다.
const fs = require("fs");
// 경로 관련 모듈을 불러옵니다.
const path = require("path");

// 사용자 데이터 파일 경로 설정
const DATA_FILE = path.join(__dirname, "..", "data", "users.json");

// 사용자 라우터를 생성합니다.
const router = express.Router();

// 회원가입 처리 라우트
router.post("/register", (req, res) => {
  // 요청 본문에서 사용자 이름과 비밀번호를 가져옵니다.
  const { username, password } = req.body;

  // 사용자 데이터 파일을 읽습니다.
  const users = JSON.parse(fs.readFileSync(DATA_FILE));

  // 이미 존재하는 사용자 이름이 있는지 확인합니다.
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    // 이미 사용자가 존재하면 에러 메시지를 반환합니다.
    return res.status(400).send("User already exists");
  }

  // 비밀번호를 해시화합니다.
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 새로운 사용자 객체를 생성합니다.
  const newUser = {
    id: uuidv4(),  // 새로운 UUID를 생성하여 사용자 ID로 사용
    username,
    password: hashedPassword,  // 해시화된 비밀번호를 저장
  };

  // 새 사용자 정보를 사용자 데이터 배열에 추가합니다.
  users.push(newUser);

  // 업데이트된 사용자 정보를 파일에 저장합니다.
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  // 회원가입 성공 메시지를 반환합니다.
  res.send("User registered successfully!");
});

module.exports = router;
```

#### 3. `views/users/register.ejs` - 회원가입 페이지

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

#### 5. `data/users.json` - 사용자 데이터 저장 파일

```json
// 초기 사용자 데이터 파일 (없으면 빈 배열로 시작)
[]
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
│   └── users.json               # 사용자 데이터 저장 파일
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

##### 회원가입 흐름

1. 사용자가 `/users/register` 경로로 이동하면, 회원가입 페이지(`register.ejs`)가 표시됩니다.
2. 사용자는 `username`과 `password`를 입력하고 제출합니다.
3. 제출된 데이터는 `/users/register` 경로에서 처리되어, 사용자가 이미 존재하는지 확인하고, 비밀번호를 해시화하여 `users.json` 파일에 저장합니다.
4. 성공적으로 등록된 경우 "User registered successfully!" 메시지가 반환됩니다.

---

### 최종 정리

1. **폴더 구조**:
   - `routes/users.js`: 회원가입 기능을 포함한 사용자 라우트.
   - `views/users/register.ejs`: 회원가입 페이지의 EJS 템플릿.
   - `data/users.json`: 사용자 데이터 저장 파일.
   - `index.js`: Express 서버와 라우터 설정.

2. **회원가입 기능 구현**:
   - `/users/register`: 사용자가 회원가입 폼을 제출하면 새로운 사용자가 생성되어 `users.json` 파일에 저장됩니다.
   - 비밀번호는 `bcrypt`를 사용하여 해시화됩니다.
   - 이미 존재하는 사용자 이름은 등록할 수 없도록 처리됩니다.

이로써 사용자 회원가입 기능을 구현하였고, 이를 통해 사용자는 새로운 계정을 만들 수 있게 됩니다.