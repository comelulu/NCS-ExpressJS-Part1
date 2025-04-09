# 39. 파일 없으면 자동 생성! `ensureDataFileExists` 미들웨어 만들기

#### 1. 미들웨어 파일 구조

```bash
memos-project/
├── middlewares/                 # 미들웨어 파일
│   └── ensureDataFileExists.js  # 데이터 파일 존재 여부 체크 미들웨어
```

#### 2. `ensureDataFileExists.js` 미들웨어 코드 작성

```javascript
// fs 모듈을 사용하여 파일 시스템 작업을 처리
const fs = require("fs");
// path 모듈을 사용하여 경로 관련 작업을 처리
const path = require("path");

// 데이터 파일이 존재하는지 확인하고, 없으면 자동으로 빈 배열을 담은 파일을 생성하는 미들웨어
const ensureDataFileExists = (relativePath) => (req, res, next) => {
  // 현재 파일의 절대 경로를 얻기 위해 path.join 사용
  const fullPath = path.join(__dirname, "..", relativePath);

  // 파일이 존재하지 않으면 빈 배열을 담은 파일을 생성
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify([]), "utf8");  // 빈 배열을 담은 JSON 파일 생성
    console.log(`${relativePath} 파일이 없어서 새로 생성했습니다.`);  // 콘솔에 파일 생성 메시지 출력
  }

  // 파일이 존재하거나, 생성 후에는 다음 미들웨어로 넘어갑니다.
  next();
};

// 다른 라우트나 미들웨어에서 이 기능을 사용하기 위해 export
module.exports = ensureDataFileExists;
```

#### 3. `ensureDataFileExists.js` 미들웨어 설명

- **목적**: 주어진 경로에 파일이 존재하는지 확인하고, 만약 존재하지 않으면 자동으로 빈 배열(`[]`)을 담은 JSON 파일을 생성합니다.
- **동작 방식**:
  - `path.join(__dirname, "..", relativePath)`를 사용하여 상대 경로를 절대 경로로 변환하고, 해당 파일이 존재하는지 확인합니다.
  - 파일이 존재하지 않으면 `fs.writeFileSync()`를 이용해 빈 배열을 담은 JSON 파일을 생성합니다.
  - 파일을 생성하거나 파일이 존재하는 경우, `next()`를 호출하여 다음 미들웨어나 라우터로 넘어갑니다.

#### 4. `index.js`에서 미들웨어 사용하기

이제 `ensureDataFileExists` 미들웨어를 라우터에서 사용할 수 있도록 설정하겠습니다.

```javascript
// express 모듈을 불러옵니다.
const express = require("express");
// 경로와 파일 시스템 관련 모듈
const path = require("path");
// 미들웨어 모듈을 불러옵니다.
const ensureDataFileExists = require("./middlewares/ensureDataFileExists");

// Express 애플리케이션을 생성합니다.
const app = express();

// 데이터 파일 존재 여부를 확인하는 미들웨어 사용
app.use(ensureDataFileExists("data/memos.json"));  // "data/memos.json" 파일 존재 여부 체크
app.use(ensureDataFileExists("data/users.json"));  // "data/users.json" 파일 존재 여부 체크

// 예시 라우트
app.get("/", (req, res) => {
  res.send("Memos Project is running!");  // 기본적인 응답
});

// 서버 실행
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);  // 서버 실행 메시지
});
```

#### 5. 시각화

##### 파일이 존재하는 경우

1. `data/memos.json` 파일이 이미 존재하는 경우, 미들웨어는 아무 작업도 하지 않고, 요청을 정상적으로 처리합니다.

##### 파일이 존재하지 않는 경우

2. `data/memos.json` 파일이 존재하지 않으면, 미들웨어는 자동으로 빈 배열을 담은 `memos.json` 파일을 생성합니다.

```json
// 생성된 데이터 파일 예시 (memos.json)
[]
```

#### 6. 설명

1. **미들웨어 기능**:
   - `ensureDataFileExists`는 데이터 파일이 없으면 자동으로 생성합니다. 이 미들웨어를 사용하면 파일을 미리 준비해 놓지 않아도, 애플리케이션이 실행되는 중에 필요한 파일을 자동으로 생성할 수 있습니다.

2. **미들웨어 사용법**:
   - 이 미들웨어는 라우트가 처리되기 전에 실행되므로, 라우트에서 파일을 읽거나 쓰기 전에 해당 파일이 반드시 존재하도록 보장합니다.

---

### 최종 정리

- **폴더 구조**: `middlewares/ensureDataFileExists.js`에서 파일 존재 여부를 확인하고, 없으면 빈 배열을 담은 파일을 생성하는 미들웨어를 추가했습니다.
- **미들웨어 사용**: `index.js`에서 `ensureDataFileExists` 미들웨어를 사용하여 `data/memos.json`과 `data/users.json` 파일이 존재하는지 확인하고, 없으면 자동으로 생성합니다.

이렇게 하면, 데이터 파일이 없을 경우 자동으로 생성되므로, 애플리케이션에서 파일을 다룰 때 발생할 수 있는 예외를 사전에 방지할 수 있습니다!