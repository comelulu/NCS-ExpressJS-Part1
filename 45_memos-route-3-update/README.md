# 45. Memos Route - 메모 수정 기능 구현

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

#### 2. `routes/memos.js` - 메모 수정 기능 구현

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// 파일 시스템 모듈을 사용하여 데이터를 저장합니다.
const fs = require("fs");
// 경로 관련 모듈을 불러옵니다.
const path = require("path");

// 메모 데이터 파일 경로 설정
const DATA_FILE = path.join(__dirname, "..", "data", "memos.json");

// 메모 라우터를 생성합니다.
const router = express.Router();

// 메모 수정 API (PUT 요청)
router.put("/:id", (req, res) => {
  const { id } = req.params;  // 수정할 메모의 ID를 URL에서 가져옵니다.
  const { title, content } = req.body;  // 요청 본문에서 수정할 메모의 제목과 내용을 가져옵니다.

  // 메모 데이터 파일을 읽습니다.
  const memos = JSON.parse(fs.readFileSync(DATA_FILE));

  // 수정할 메모를 찾습니다.
  const memoIndex = memos.findIndex((memo) => memo.id === id);

  if (memoIndex === -1) {
    // 메모가 존재하지 않으면 404 에러를 반환합니다.
    return res.status(404).send("Memo not found");
  }

  // 메모를 수정합니다.
  memos[memoIndex].title = title;
  memos[memoIndex].content = content;

  // 수정된 메모 정보를 파일에 저장합니다.
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));

  // 수정된 메모를 응답으로 반환합니다.
  res.json(memos[memoIndex]);  // 수정된 메모를 JSON 형식으로 응답합니다.
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

##### 메모 수정 API 흐름

1. 사용자가 `/memos/:id` 경로로 `PUT` 요청을 보내면, 해당 ID의 메모를 수정할 수 있습니다.
2. `routes/memos.js`에서 `PUT /memos/:id` 경로로 요청을 처리하고, 해당 메모의 제목과 내용을 수정하여 `memos.json` 파일에 저장합니다.
3. 수정된 메모를 `200 OK` 상태 코드와 함께 JSON 형식으로 반환합니다.

##### `PUT /memos/:id` API 예시

```bash
$ curl -X PUT http://localhost:3000/memos/1 \
-H "Content-Type: application/json" \
-d '{"title": "Updated Memo", "content": "This is the updated memo content"}'
```

응답 예시:

```json
{
  "id": "1",
  "title": "Updated Memo",
  "content": "This is the updated memo content",
  "userId": "f4fa6932-0f2f-4d03-92d9-1c147586f458"
}
```

---

### 최종 정리

1. **폴더 구조**:
   - `routes/memos.js`: 메모 수정 기능을 처리하는 라우트.
   - `data/memos.json`: 메모 데이터 저장 파일.
   - `index.js`: Express 서버와 라우터 설정.

2. **메모 수정 기능**:
   - `/memos/:id`: `PUT` 요청을 통해 해당 ID의 메모를 수정하고, 수정된 메모를 JSON 형식으로 응답합니다.
   - 수정된 메모는 `memos.json` 파일에 저장됩니다.

3. **응답 예시**:
   - `PUT /memos/:id` 요청에 대해 수정된 메모가 `200 OK` 상태 코드와 함께 JSON 형식으로 반환됩니다.

이로써 메모 수정 기능을 구현했습니다. 사용자는 `/memos/:id` 경로로 `PUT` 요청을 보내면, 지정된 메모를 수정하고 응답을 받을 수 있습니다.