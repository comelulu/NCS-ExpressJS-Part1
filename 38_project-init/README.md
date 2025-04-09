# 38. Memos Project 프로젝트 기본 설정 - 폴더 구조와 패키지 설치

### 1. 프로젝트 폴더 구조 설정

```bash
memos-project/
├── node_modules/                # 설치된 npm 패키지들
├── views/                       # EJS 템플릿 파일
│   ├── index.ejs                # 메모 목록 페이지
│   ├── add.ejs                  # 메모 추가 페이지
│   └── edit.ejs                 # 메모 수정 페이지
├── data/                        # 데이터 파일 (메모, 사용자 정보 등)
│   ├── memos.json               # 메모 데이터
│   └── users.json               # 사용자 데이터
├── routes/                      # 라우트 처리
│   ├── users.js                 # 사용자 관련 라우트
│   └── memos.js                 # 메모 관련 라우트
├── middlewares/                 # 미들웨어 파일
│   ├── ensureDataFileExists.js  # 데이터 파일 존재 여부 체크 미들웨어
│   └── authenticateUser.js      # 사용자 인증 미들웨어
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

#### 2. 패키지 설치

이 프로젝트에서는 기본적인 Express.js 애플리케이션을 설정하고, 데이터 저장을 위해 `fs` 모듈을 사용할 것입니다. 또한, 사용자 인증을 위해 `jsonwebtoken`, `bcrypt`와 같은 패키지를 사용할 예정입니다. 각 패키지 설치 방법을 설명하겠습니다.

```bash
# 프로젝트 폴더로 이동한 후, 아래 명령어를 실행하여 프로젝트 초기화
npm init -y

# Express, EJS, JSON Web Token, bcrypt, 기타 필수 패키지 설치
npm install express ejs jsonwebtoken bcrypt cookie-parser body-parser dotenv

# 개발 환경에서 오류 추적을 위한 morgan 설치
npm install morgan --save-dev
```

#### 3. `.env` 파일 설정

프로젝트에서 사용하는 환경 변수들을 `.env` 파일에 설정합니다. 예를 들어, JWT 비밀 키를 `.env` 파일에 저장하여 보안성을 높일 수 있습니다.

```bash
# .env 파일 예시

JWT_SECRET=your-secret-key
PORT=3000
```

#### 4. `index.js` 기본 설정

프로젝트의 엔트리 포인트인 `index.js`를 설정하여 서버를 실행합니다.

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");

// 라우터 모듈
const usersRouter = require("./routes/users");
const memosRouter = require("./routes/memos");

// .env 파일을 로드하여 환경 변수 사용
dotenv.config();

// Express 애플리케이션을 생성합니다.
const app = express();

// ---------------------------------------------------------------------------
// 기본 미들웨어 설정
app.use(bodyParser.json());  // JSON 형식의 요청 본문 파싱
app.use(bodyParser.urlencoded({ extended: true }));  // URL 인코딩된 형식 파싱
app.use(cookieParser());  // 쿠키 파싱
app.use(morgan("dev"));  // 요청 로그를 출력

// EJS를 템플릿 엔진으로 사용 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  // views 폴더 설정

// 정적 파일(CSS, JS 등) 서빙
app.use(express.static(path.join(__dirname, "public")));

// 라우트 설정
app.use("/users", usersRouter);
app.use("/memos", memosRouter);

// 기본 경로 설정
app.get("/", (req, res) => {
  res.redirect("/memos");  // 기본 페이지는 메모 목록으로 리다이렉트
});

// 404 오류 처리
app.use((req, res) => {
  res.status(404).render("notfound");  // 존재하지 않는 페이지는 'notfound' 템플릿으로 처리
});

// 서버 실행
const port = process.env.PORT || 3000;  // .env 파일에서 포트 설정, 없으면 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);  // 서버 실행 메시지
});
```

### 5. 설명

#### 폴더 구조

- **node_modules/**: 설치된 npm 패키지들이 저장되는 디렉토리입니다.
- **public/**: CSS, JavaScript, 이미지 등과 같은 정적 파일들을 저장하는 폴더입니다.
- **views/**: EJS 템플릿 파일들이 저장되는 폴더로, 사용자에게 동적으로 데이터를 보여주는 HTML 템플릿이 위치합니다.
- **data/**: 프로젝트에서 사용하는 데이터 파일들 (예: `users.json`, `memos.json`)이 저장됩니다.
- **routes/**: 애플리케이션의 라우트를 정의하는 폴더입니다. 예를 들어, 사용자는 `/users` 경로로, 메모는 `/memos` 경로로 접근합니다.
- **middlewares/**: 인증이나 데이터 파일 체크 등과 같은 공통 미들웨어 파일들이 저장됩니다.
- **.env**: 환경 변수 파일로, 비밀 키나 서버 포트 등을 설정할 수 있습니다.
- **package.json**: 프로젝트의 패키지 관리 파일로, 의존성 및 프로젝트 정보를 담고 있습니다.
- **index.js**: 서버를 설정하고, 라우팅을 정의하며, Express 애플리케이션의 엔트리 포인트 역할을 합니다.

#### 패키지 설치

- **express**: Express.js를 사용하여 서버를 구축하는 데 사용됩니다.
- **ejs**: 템플릿 엔진으로 EJS를 사용하여 동적으로 HTML을 생성합니다.
- **jsonwebtoken**: JWT를 이용한 사용자 인증을 처리합니다.
- **bcrypt**: 사용자의 비밀번호를 해시화하여 저장합니다.
- **cookie-parser**: 쿠키를 파싱하여 JWT 토큰을 쉽게 처리할 수 있게 합니다.
- **body-parser**: HTTP 요청 본문을 파싱하여 JSON 또는 URL 인코딩 형식으로 전달받을 수 있게 합니다.
- **dotenv**: 환경 변수를 로드하여 비밀 키와 같은 중요한 설정을 관리합니다.
- **morgan**: 요청 로그를 개발 환경에서 확인할 수 있도록 도와줍니다.
