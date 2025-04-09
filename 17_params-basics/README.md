# 17. Params-Basics

## 🚀 개요: URL Params (경로 매개변수)

```js
GET /users/:id
GET /users/:userId/books/:bookId
GET /products/:id
```

각각의 `:id`, `:userId`, `:bookId`는 **URL 경로에서 동적으로 바뀌는 값**을 의미하며,  
이 값은 `req.params` 객체를 통해 접근할 수 있습니다.

---

## ✅ 전체 코드 + 상세 설명

```js
const express = require("express");
const app = express();

/*
==========================================================
👤 [1] /users/:id
----------------------------------------------------------
- 클라이언트가 /users/123 같은 URL로 접근하면,
  :id 부분에 해당하는 값이 req.params.id로 전달됩니다.
*/
app.get("/users/:id", (req, res) => {
  console.log(req.params); // { id: "123" }
  res.send(`User ID: ${req.params.id}`);
});

/*
==========================================================
📚 [2] /users/:userId/books/:bookId
----------------------------------------------------------
- 다중 경로 매개변수 사용 예제
- 예: /users/42/books/777
- :userId 와 :bookId 는 각각 req.params.userId, req.params.bookId 로 추출됩니다.
*/
app.get("/users/:userId/books/:bookId", (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  // 데이터베이스에서 해당 리소스를 찾는다고 가정
  const user = getUserById(userId);
  const book = getBookById(bookId);

  if (!user || !book) {
    return res.status(404).send("User or book not found");
  }

  res.send({ user, book });
});

/*
==========================================================
🛍️ [3] /products/:id
----------------------------------------------------------
- 단일 동적 파라미터 사용
- 예: /products/10
- :id → req.params.id
*/
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = getProductById(productId);

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.send(product);
});

// 가상의 데이터 조회 함수들
function getUserById(id) {
  const users = { "42": { name: "Alice" }, "99": { name: "Bob" } };
  return users[id];
}

function getBookById(id) {
  const books = { "777": { title: "Learn Express" }, "888": { title: "JS Deep Dive" } };
  return books[id];
}

function getProductById(id) {
  const products = {
    "10": { name: "Laptop", price: 1500 },
    "11": { name: "Keyboard", price: 100 },
  };
  return products[id];
}

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
```

---

## 📊 실제 요청 흐름 시각화 예시

### 🔍 요청 1: `/users/42`

```js
1. 클라이언트 → GET /users/42
2. 매칭된 라우트 → /users/:id
3. req.params = { id: "42" }
4. 콘솔 출력 → { id: '42' }
5. 응답 → "User ID: 42"
```

---

### 🔍 요청 2: `/users/42/books/777`

```js
1. 클라이언트 → GET /users/42/books/777
2. 매칭된 라우트 → /users/:userId/books/:bookId
3. req.params = { userId: "42", bookId: "777" }

   getUserById("42") → { name: "Alice" }
   getBookById("777") → { title: "Learn Express" }

4. 응답:
{
  user: { name: "Alice" },
  book: { title: "Learn Express" }
}
```

---

### 🔍 요청 3: `/products/10`

```js
1. 클라이언트 → GET /products/10
2. 매칭된 라우트 → /products/:id
3. req.params = { id: "10" }

   getProductById("10") → { name: "Laptop", price: 1500 }

4. 응답:
{
  name: "Laptop",
  price: 1500
}
```

---

## 🧠 실무 비유

| 라우트 | 비유 |
|--------|------|
| `/users/:id` | 고객센터에서 “고객 번호 123”을 조회하는 것 |
| `/users/:userId/books/:bookId` | “고객 42가 대여한 책 777” 기록을 찾는 것 |
| `/products/:id` | 쇼핑몰에서 “상품 번호 10”의 상세 정보를 가져오는 것 |

---

## 📘 개념 요약

| 개념 | 설명 |
|------|------|
| `:param` | Express 라우터에서 URL 경로의 동적 부분 지정 |
| `req.params` | 동적 경로에서 추출한 값을 담은 객체 |
| `req.params.id` | `/users/:id` → `id`의 값 접근 |
| 와일드카드 사용 | 복수 개의 파라미터도 자유롭게 조합 가능 (`/users/:userId/books/:bookId`) |

---

## ✅ 직접 테스트해보기

### 🔗 주소창이나 API 도구(Postman)에 입력해보세요:

| 요청 | 결과 |
|------|------|
| `GET http://localhost:3000/users/42` | `"User ID: 42"` |
| `GET http://localhost:3000/users/42/books/777` | `{ user: ..., book: ... }` |
| `GET http://localhost:3000/products/10` | `{ name: "Laptop", price: 1500 }` |
| `GET http://localhost:3000/products/999` | `404 Product not found` |

---


