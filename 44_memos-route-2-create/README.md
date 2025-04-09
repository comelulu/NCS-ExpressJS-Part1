# 44. Memos Route - 새 메모 작성 API 만들기

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

#### 2. `routes/memos.js` - 새 메모 작성 API 만들기

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// UUID 생성 모듈을 불러옵니다. 새로운 메모 ID를 생성하기 위해 사용합니다.
const { v4: uuidv4 } = require("uuid");
// 파일 시스템 모듈을 사용하여 데이터를 저장합니다.
const fs = require("fs");
// 경로 관련 모듈을 불러옵니다.
const path = require("path");

// 메모 데이터 파일 경로 설정
const DATA_FILE = path.join(__dirname, "..", "data", "memos.json");

// 메모 라우터를 생성합니다.
const router = express.Router();

// 새 메모 작성 API (POST 요청)
router.post("/", (req, res) => {
  // 요청 본문에서 메모 제목과 내용을 가져옵니다.
  const { title, content, userId } = req.body;

  // 메모 데이터 파일을 읽습니다.
  const memos = JSON.parse(fs.readFileSync(DATA_FILE));

  // 새로운 메모 객체를 생성합니다.
  const newMemo = {
    id: uuidv4(),  // 새로운 UUID를 생성하여 메모 ID로 사용
    title,
    content,
    userId,
  };

  // 새 메모 정보를 메모 데이터 배열에 추가합니다.
  memos.push(newMemo);

  // 업데이트된 메모 정보를 파일에 저장합니다.
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));

  // 새 메모가 성공적으로 생성되었음을 알려줍니다.
  res.status(201).json(newMemo);  // 201 상태 코드와 함께 새 메모를 JSON 형식으로 응답
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

##### 새 메모 작성 API 흐름

1. 사용자가 `/memos` 경로로 `POST` 요청을 보내면, 새 메모를 작성할 수 있습니다.
2. `routes/memos.js`에서 메모 제목, 내용, 사용자 ID를 받아서 새 메모를 생성하고, 이를 `memos.json` 파일에 저장합니다.
3. 새 메모가 성공적으로 작성되면, 작성된 메모의 정보를 `201 Created` 상태 코드와 함께 JSON 형식으로 응답합니다.

##### `POST /memos` API 예시

```bash
$ curl -X POST http://localhost:3000/memos \
-H "Content-Type: application/json" \
-d '{"title": "New Memo", "content": "This is a new memo", "userId": "f4fa6932-0f2f-4d03-92d9-1c147586f458"}'
```

응답 예시:

```json
{
  "id": "3",
  "title": "New Memo",
  "content": "This is a new memo",
  "userId": "f4fa6932-0f2f-4d03-92d9-1c147586f458"
}
```

---

### 최종 정리

1. **폴더 구조**:
   - `routes/memos.js`: 새 메모 작성 API를 처리하는 라우트.
   - `data/memos.json`: 메모 데이터 저장 파일.
   - `index.js`: Express 서버와 라우터 설정.

2. **새 메모 작성 API**:
   - `/memos`: `POST` 요청을 통해 새 메모를 작성하고, `memos.json` 파일에 저장합니다.
   - 작성된 메모의 정보는 `201 Created` 상태 코드와 함께 JSON 형식으로 반환됩니다.

3. **응답 예시**:
   - `POST /memos` 요청에 대해 새 메모가 성공적으로 작성되면, 작성된 메모가 JSON 형식으로 응답됩니다.

이로써 새 메모 작성 API를 구현했습니다. 사용자는 `/memos` 경로로 `POST` 요청을 보내면, 새 메모를 작성하고 응답을 받을 수 있습니다.