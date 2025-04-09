# Memo 프로젝트 설계

---

#### 1. **프로젝트 개요**

**Memo 프로젝트**는 **사용자 인증** 및 **메모 CRUD(Create, Read, Update, Delete)** 기능을 제공하는 **웹 애플리케이션**입니다. 사용자는 **로그인**하여 **메모를 작성, 조회, 수정, 삭제**할 수 있습니다. 이 프로젝트는 **Express.js** 프레임워크를 사용하고, **JWT**를 사용한 인증 시스템을 구현합니다. 메모 데이터는 **JSON 파일**에 저장됩니다.

---

#### 2. **전체 시스템 흐름도**

```js
[사용자 요청] --> [Express 서버] --> [미들웨어] --> [메모 관련 라우트] --> [메모 데이터 처리]
          |                |                |                       |
   [회원가입] <---- [POST] /users/register   [JWT 인증 미들웨어]     [메모 CRUD]
          |                |                |                       |
   [로그인]  <---- [POST] /users/login      [데이터 파일 유효성 검사]  [메모 생성, 수정, 삭제]
          |                |                |                       |
    [JWT 발급]  <---- [POST] /users/login    [JWT 토큰 발급]           [DB 또는 JSON 파일에 저장]
          |                |                |                       |
 [메모 조회, 수정, 삭제] <----- [GET/POST] /memos
```

---

#### 3. **파일 구조**

```js
/memo
  ├── /public
  │     ├── homepage.html       # 홈 페이지
  │     ├── style.css           # 스타일 파일
  │     └── ...
  ├── /data
  │     ├── users.json          # 사용자 정보 저장
  │     └── memos.json          # 메모 데이터 저장
  ├── /routes
  │     ├── users.js            # 사용자 라우트
  │     ├── memos.js            # 메모 라우트
  ├── /middlewares
  │     ├── ensureDataFileExists.js  # 데이터 파일 유효성 검사 미들웨어
  │     └── authenticateUser.js      # JWT 인증 미들웨어
  ├── app.js                    # 서버 실행 코드
  └── package.json               # 의존성 파일
```

---

#### 4. **라우팅 설계**

##### 사용자 라우트 (Users Route)

```js
POST /users/register
  - 입력: username, password
  - 동작: 새로운 사용자 등록
  - 출력: 성공/실패 메시지

POST /users/login
  - 입력: username, password
  - 동작: 로그인, JWT 발급
  - 출력: JWT 토큰 (쿠키에 저장)

GET /users/logout
  - 입력: 없음
  - 동작: JWT 삭제 (로그아웃 처리)
  - 출력: 로그인 페이지로 리다이렉트
```

##### 메모 라우트 (Memos Route)

```js
GET /memos
  - 입력: 검색 쿼리 (선택적)
  - 동작: 사용자가 작성한 메모 목록 조회
  - 출력: 메모 리스트 (타이틀, 내용)

POST /memos/add
  - 입력: title, content (로그인된 사용자만 가능)
  - 동작: 새로운 메모 생성
  - 출력: 메모 목록 페이지로 리다이렉트

GET /memos/edit/:id
  - 입력: 메모 ID
  - 동작: 메모 수정 페이지 제공
  - 출력: 수정할 메모 정보

POST /memos/edit/:id
  - 입력: title, content, 메모 ID
  - 동작: 해당 메모 수정
  - 출력: 메모 목록 페이지로 리다이렉트

POST /memos/delete/:id
  - 입력: 메모 ID
  - 동작: 해당 메모 삭제
  - 출력: 메모 목록 페이지로 리다이렉트
```

---

#### 5. **서버 및 미들웨어 설계**

- **Express 서버 설정**:
  - 서버는 기본적으로 **3000번 포트**에서 실행됩니다.
  - **JWT 인증 미들웨어**: 사용자가 로그인한 상태에서만 메모 생성/수정/삭제가 가능하도록 인증합니다.
  - **파일 유효성 검사 미들웨어**: 메모 데이터를 저장할 **JSON 파일**이 없으면 자동으로 생성합니다.

- **미들웨어**:
  - **`authenticateUser`**: JWT 인증을 통해 사용자가 로그인했는지 확인하는 미들웨어입니다.
  - **`ensureDataFileExists`**: 필요한 **JSON 데이터 파일**이 존재하는지 확인하고, 없으면 파일을 생성하는 미들웨어입니다.

---

#### 6. **미들웨어 시각화**

```js
[클라이언트 요청]
     |
[Express 서버]
     |
[미들웨어 처리]
     |
     +--> [JWT 인증 미들웨어]
     |         |
     |     [토큰 유효성 검사] --> [로그인 확인] --> [로그인 상태 유지] --> [메모 생성/수정/삭제]
     |
     +--> [데이터 파일 유효성 검사 미들웨어]
               |
         [파일 확인] --> [파일 없음] --> [파일 생성] --> [파일 저장/수정]
```

- **JWT 인증 미들웨어**:
  - 클라이언트가 **로그인 상태**인지 확인하기 위해 **JWT 토큰**을 검증합니다.
  - 만약 유효하지 않거나 로그인하지 않은 상태라면, **403 Forbidden** 상태로 처리합니다.
  - 로그인된 사용자는 **메모 생성/수정/삭제**를 진행할 수 있습니다.

- **데이터 파일 유효성 검사 미들웨어**:
  - 서버에서 메모 데이터를 **JSON 파일**로 처리하는데, 만약 데이터 파일이 없다면 **자동으로 파일을 생성**합니다.
  - 이는 **`users.json`**과 **`memos.json`**에 대해 모두 적용됩니다.

---

#### 7. **전체 시스템 흐름 시각화**

```js
[사용자 요청] --> [Express 서버] --> [미들웨어] --> [메모 관련 라우트] --> [메모 데이터 처리]
          |                |                |                       |
   [회원가입] <---- [POST] /users/register   [JWT 인증 미들웨어]     [메모 CRUD]
          |                |                |                       |
   [로그인]  <---- [POST] /users/login      [데이터 파일 유효성 검사]  [메모 생성, 수정, 삭제]
          |                |                |                       |
    [JWT 발급]  <---- [POST] /users/login    [JWT 토큰 발급]           [DB 또는 JSON 파일에 저장]
          |                |                |                       |
 [메모 조회, 수정, 삭제] <----- [GET/POST] /memos
```

---

#### 8. **데이터 흐름 및 파일 처리**

1. **사용자 라우트**:
   - 사용자가 **회원가입** 또는 **로그인**하면, 서버는 입력된 정보를 `users.json` 파일에서 확인하거나 새로 추가합니다. 로그인 시에는 **JWT 토큰**이 발급되어 클라이언트에게 전달됩니다.

2. **메모 라우트**:
   - 사용자는 **메모를 추가, 수정, 삭제**할 수 있습니다. 메모 정보는 `memos.json` 파일에 저장되며, 수정된 내용은 **파일 업데이트**를 통해 반영됩니다.

3. **미들웨어**:
   - 사용자가 **로그인하지 않았을 때** 메모 생성/수정/삭제를 시도하면, **`authenticateUser` 미들웨어**가 이를 막고 로그인 페이지로 리다이렉트합니다.
   - **`ensureDataFileExists` 미들웨어**는 데이터를 읽거나 쓸 때, 필요한 JSON 파일(`users.json`, `memos.json`)이 없다면 이를 자동으로 생성합니다.

---

#### 9. **시각화 - 요청 흐름도**

**1. 사용자가 요청을 보냅니다.**

- 예를 들어, 사용자가 `/style.css` 파일을 요청하면:

```plaintext
GET /style.css HTTP/1.1
Host: localhost:3000
```

**2. 서버는 `serveStatic` 함수를 호출하여 파일을 찾습니다.**

- 서버는 `public/style.css` 경로를 생성합니다.

```javascript
const filePath = path.join("public", "/style.css");
```

**3. 파일을 읽고 응답을 준비합니다.**

- 서버는 `fs.readFile(filePath, callback)`로 파일을 비동기적으로 읽습니다.
- 파일이 존재하면 MIME 타입을 설정하고 데이터를 반환합니다.

```javascript
res.writeHead(200, { "Content-Type": "text/css" });
res.end(data); // style.css 파일 데이터
```

**4. 파일을 찾을 수 없으면 404 응답을 보냅니다.**

```javascript
res.writeHead(404, { "Content-Type": "text/html" });
res.end("<h1>404 Not Found</h1>");
```

---

#### 10. **전체 동작 예시**

1. **회원가입**:
   - 사용자가 **`/users/register`** 경로에서 정보를 입력하고 제출하면, 서버는 `users.json`에 새로운 사용자 정보를 추가합니다. 이후 **로그인 페이지**로 리다이렉트됩니다.

2. **로그인**:
   - **`/users/login`**에서 사용자가 입력한 정보가 유효한 경우, 서버는 **JWT 토큰**을 발급하여 클라이언트에게 전달합니다.

3. **메모 CRUD**:
   - **메모 생성**: 로그인된 사용자는 **`/memos/add`** 경로로 메모를 추가할 수 있습니다. 이 메모는 `memos.json`에 저장됩니다.
   - **메모 수정**: **`/memos/edit/:id`** 경로에서 요청된 메모를 수정할 수 있습니다.
   - **메모 삭제**: **`/memos/delete/:id`** 경로에서 요청된 메모를 삭제할 수 있습니다.

---

#### 11. **API 요청 및 응답 시나리오**

**회원가입**:
```json
POST /users/register
{
  "username": "newuser",
  "password": "password123"
}
```
응답:
```json
{
  "status": "success",
  "message": "User registered successfully."
}
```

**로그인**:
```json
POST /users/login
{
  "username": "newuser",
  "password": "password123"
}
```
응답:
```json
{
  "status": "success",
  "message": "Login successful.",
  "token": "JWT_TOKEN"
}
```

**메모 생성**:
```json
POST /memos/add
{
  "title": "First Memo",
  "content": "This is the content of the first memo."
}
```
응답:
```json
{
  "status": "success",
  "message": "Memo added successfully."
}
```

**메모 수정**:
```json
POST /memos/edit/:id
{
  "title": "Updated Memo",
  "content": "This is the updated content."
}
```
응답:
```json
{
  "status": "success",
  "message": "Memo updated successfully."
}
```

**메모 삭제**:
```json
POST /memos/delete/:id
```
응답:
```json
{
  "status": "success",
  "message": "Memo deleted successfully."
}
```

---

#### 12. **최종 설계 요약**

- **Express.js 서버**에서 **회원가입**과 **로그인** 기능을 구현하여 **JWT 토큰**을 사용한 인증 시스템을 설정했습니다.
- **메모 CRUD** 기능을 통해 사용자가 메모를 작성하고 수정하며 삭제할 수 있도록 했습니다.
- **JSON 파일**을 사용하여 데이터 저장을 처리하며, **파일 유효성 검사 미들웨어**를 통해 필요한 데이터 파일이 없으면 자동으로 생성합니다.
- **미들웨어**를 통해 사용자가 로그인한 상태에서만 메모를 생성하거나 수정, 삭제할 수 있도록 보안을 강화했습니다.

이제 **Memo 프로젝트**는 전체적으로 사용자의 로그인 상태를 확인하고, 메모 데이터를 안전하게 관리하며, 클라이언트에게 적절한 응답을 제공할 수 있는 **완성된 시스템**입니다.

--- 

### 13. **최종 시각화**

```js
[클라이언트 요청]
     |
[Express 서버]
     |
[미들웨어 처리]
     |
     +--> [JWT 인증 미들웨어]
     |         |
     |     [토큰 유효성 검사] --> [로그인 확인] --> [로그인 상태 유지] --> [메모 생성/수정/삭제]
     |
     +--> [데이터 파일 유효성 검사 미들웨어]
               |
         [파일 확인] --> [파일 없음] --> [파일 생성] --> [파일 저장/수정]
```
