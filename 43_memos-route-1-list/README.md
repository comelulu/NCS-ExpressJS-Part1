# 43. Memos Route - 메모 목록 조회 API 만들기

#### 1. 프로젝트 폴더 구조 설정

```bash
memos-project/
├── node_modules/                # 설치된 npm 패키지들
├── public/                      # 정적 파일(CSS, JS, 이미지 등)
├── views/                       # EJS 템플릿 파일
├── routes/                      # 라우트 처리
│   ├── memos.js                 # 메모 관련 라우트
├── middlewares/                 # 미들웨어 파일
│   ├── ensureDataFileExists.js  # 데이터 파일 존재 여부 체크 미들웨어
├── data/                        # 데이터 파일 (메모, 사용자 정보 등)
│   └── memos.json               # 메모 데이터 저장 파일
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

#### 2. `routes/memos.js` - 메모 목록 조회 API 만들기

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// 파일 시스템 모듈을 불러옵니다.
const fs = require("fs");
// 경로 관련 모듈을 불러옵니다.
const path = require("path");

// 메모 데이터 파일 경로 설정
const DATA_FILE = path.join(__dirname, "..", "data", "memos.json");

// 메모 라우터를 생성합니다.
const router = express.Router();

// 메모 목록 조회 API (GET 요청)
router.get("/", (req, res) => {
  // 메모 데이터 파일을 읽습니다.
  const memos = JSON.parse(fs.readFileSync(DATA_FILE));

  // 메모 목록을 JSON 형식으로 응답합니다.
  res.json(memos);  // 메모 목록을 응답으로 보냅니다.
});

module.exports = router;
```

#### 3. `index.js` - 서버 설정 및 메모 라우터 연결

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// 경로 관련 모듈을 불러옵니다.
const path = require("path");
// 메모 라우터를 불러옵니다.
const memosRouter = require("./routes/memos");

// Express 애플리케이션을 생성합니다.
const app = express();

// JSON 형식의 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());

// 메모 라우터를 '/memos' 경로로 설정
app.use("/memos", memosRouter);

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

#### 4. `data/memos.json` - 메모 데이터 저장 파일

```json
[
  {
    "id": "1",
    "title": "First Memo",
    "content": "This is the first memo content",
    "userId": "f4fa6932-0f2f-4d03-92d9-1c147586f458"
  },
  {
    "id": "2",
    "title": "Second Memo",
    "content": "This is the second memo content",
    "userId": "66d739e9-2bc7-4ea3-bf49-11ed85219be8"
  }
]
```

#### 5. 시각화

##### 프로젝트 폴더 구조

```bash
memos-project/
├── node_modules/                # 설치된 npm 패키지들
├── public/                      # 정적 파일(CSS, JS, 이미지 등)
├── views/                       # EJS 템플릿 파일
├── routes/                      # 라우트 처리
│   ├── memos.js                 # 메모 관련 라우트
├── middlewares/                 # 미들웨어 파일
│   ├── ensureDataFileExists.js  # 데이터 파일 존재 여부 체크 미들웨어
├── data/                        # 데이터 파일 (메모, 사용자 정보 등)
│   └── memos.json               # 메모 데이터 저장 파일
├── .env                         # 환경 변수 파일
├── package.json                 # 프로젝트 메타데이터와 패키지 관리
└── index.js                     # Express 서버 설정 파일
```

##### 메모 목록 조회 API 흐름

1. 사용자가 `/memos` 경로로 `GET` 요청을 보내면, 메모 목록을 조회할 수 있습니다.
2. `routes/memos.js`에서 메모 목록을 담고 있는 `memos.json` 파일을 읽고, 이를 JSON 형식으로 응답합니다.
3. 메모 목록을 반환하는 API가 성공적으로 응답하면, 사용자는 등록된 모든 메모를 조회할 수 있습니다.

##### `GET /memos` API 예시

```bash
$ curl http://localhost:3000/memos
```

응답 예시:

```json
[
  {
    "id": "1",
    "title": "First Memo",
    "content": "This is the first memo content",
    "userId": "f4fa6932-0f2f-4d03-92d9-1c147586f458"
  },
  {
    "id": "2",
    "title": "Second Memo",
    "content": "This is the second memo content",
    "userId": "66d739e9-2bc7-4ea3-bf49-11ed85219be8"
  }
]
```

---

### 최종 정리

1. **폴더 구조**:
   - `routes/memos.js`: 메모 목록 조회 API를 처리하는 라우트.
   - `data/memos.json`: 메모 데이터 저장 파일.
   - `index.js`: Express 서버와 라우터 설정.

2. **메모 목록 조회 API**:
   - `/memos`: `GET` 요청을 통해 `memos.json` 파일에 저장된 모든 메모 목록을 조회합니다. 응답은 JSON 형식으로 반환됩니다.

3. **응답 예시**:
   - `GET /memos` 요청에 대해 모든 메모가 JSON 배열 형태로 응답됩니다.

이로써 메모 목록 조회 API를 구현했습니다. 사용자는 `/memos` 경로로 요청을 보내면, 저장된 모든 메모 목록을 조회할 수 있습니다.