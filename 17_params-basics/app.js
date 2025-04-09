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
  const users = { 42: { name: "Alice" }, 99: { name: "Bob" } };
  return users[id];
}

function getBookById(id) {
  const books = {
    777: { title: "Learn Express" },
    888: { title: "JS Deep Dive" },
  };
  return books[id];
}

function getProductById(id) {
  const products = {
    10: { name: "Laptop", price: 1500 },
    11: { name: "Keyboard", price: 100 },
  };
  return products[id];
}

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
