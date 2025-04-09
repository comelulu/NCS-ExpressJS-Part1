# 20. Bonus

## 📚 Part 1. 소개: Query String을 이용한 검색/필터 시스템이란?

### 🔍 Query String이란?

**Query String(쿼리 문자열)** 은 URL 뒤에 붙는 `?key=value` 형태의 데이터입니다.  
웹에서 사용자가 선택한 **검색어, 필터 옵션, 정렬 방식, 페이지 번호** 등을 서버에 전달할 때 사용됩니다.

예시:
```
http://localhost:3000/products?q=node&category=book&sort=price_asc&page=2
```

| 부분             | 의미                                |
|------------------|--------------------------------------|
| `?q=node`        | "node"라는 검색어를 요청             |
| `&category=book` | "book" 카테고리만 필터링             |
| `&sort=price_asc`| 가격 오름차순 정렬 요청              |
| `&page=2`        | 결과 목록 중 2페이지 요청            |

---

### 📦 서버에서는 어떻게 처리할까?

Express에서는 클라이언트가 보낸 쿼리 문자열을 `req.query`를 통해 받아옵니다.  
그 후, 이 값을 기반으로 데이터를 검색하거나 정렬하거나 필요한 만큼 잘라서 보여줍니다.

---

## 🛠 Part 2. 전체 코드 – 검색, 필터, 정렬, 페이지네이션 구현

```js
const express = require("express");
const app = express();

/*
==========================================================
🧾 [샘플 데이터베이스] 가상의 상품 데이터 배열
- 실제로는 DB에서 가져오겠지만, 여기서는 테스트용으로 직접 정의
- 각 상품은 id, 이름(name), 카테고리(category), 가격(price)을 가짐
==========================================================
*/
const products = [
  { id: 1, name: "Node.js 책", category: "book", price: 20000 },
  { id: 2, name: "Express 책", category: "book", price: 18000 },
  { id: 3, name: "노트북", category: "electronics", price: 1500000 },
  { id: 4, name: "키보드", category: "electronics", price: 50000 },
  { id: 5, name: "React 책", category: "book", price: 22000 },
  { id: 6, name: "마우스", category: "electronics", price: 35000 },
];

/*
==========================================================
📨 [GET /products]
- 검색, 필터, 정렬, 페이지네이션을 함께 처리하는 API
- 클라이언트는 다음 쿼리 파라미터를 전달할 수 있음:
    • q: 검색어 (상품 이름에서 검색)
    • category: 필터링 조건 (예: 'book')
    • sort: 정렬 기준 (price_asc, price_desc)
    • page: 페이지 번호 (기본값 1)
    • limit: 한 페이지당 아이템 수 (기본값 2)
==========================================================
*/
app.get("/products", (req, res) => {
  // 🔍 쿼리 파라미터 추출
  let { q, category, sort, page = 1, limit = 2 } = req.query;

  // 💡 page와 limit는 문자열로 전달되므로 숫자로 변환
  page = parseInt(page);
  limit = parseInt(limit);

  // 📋 결과 배열 복사본 생성 (원본 훼손 방지)
  let result = [...products];

  // 1. 🔍 검색어 필터링 (이름에 포함된 경우)
  if (q) {
    result = result.filter((product) =>
      product.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  // 2. 🗂️ 카테고리 필터링
  if (category) {
    result = result.filter((product) => product.category === category);
  }

  // 3. 🔢 가격 정렬
  if (sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  }

  // 4. 📑 페이지네이션 처리
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedResult = result.slice(start, end);

  // ✅ 응답: 필터링된 결과와 총 개수
  res.send({
    total: result.length,      // 전체 결과 수
    page,
    perPage: limit,
    results: paginatedResult,  // 잘라낸 결과
  });
});

// 🚀 서버 실행
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
```

---

## 🧭 Part 3. 요청 흐름 시각화

### 📌 요청 예시:

```
GET /products?q=책&category=book&sort=price_desc&page=1&limit=2
```

---

### 🧩 흐름 시각화

```js
[1] 클라이언트 요청 → /products?q=책&category=book&sort=price_desc&page=1&limit=2

[2] req.query = {
  q: '책',
  category: 'book',
  sort: 'price_desc',
  page: '1',
  limit: '2'
}

[3] 검색어 필터 → "책" 포함하는 상품 필터링
→ ["Node.js 책", "Express 책", "React 책"]

[4] 카테고리 필터 → category === 'book'
→ ["Node.js 책", "Express 책", "React 책"]

[5] 가격 내림차순 정렬
→ ["React 책", "Node.js 책", "Express 책"]

[6] 페이지네이션 (page=1, limit=2)
→ 0~2번 인덱스 추출
→ ["React 책", "Node.js 책"]

[7] 응답 전송:
{
  total: 3,
  page: 1,
  perPage: 2,
  results: [...]
}
```

---

## ✅ 테스트용 URL 예시

| 목적 | 요청 URL |
|------|----------|
| 전체 상품 목록 보기 | `http://localhost:3000/products` |
| "책" 검색 | `http://localhost:3000/products?q=책` |
| 카테고리 필터링 | `http://localhost:3000/products?category=book` |
| 정렬 (가격 높은 순) | `http://localhost:3000/products?sort=price_desc` |
| 페이지 2 요청 | `http://localhost:3000/products?page=2&limit=2` |
| 검색 + 필터 + 정렬 + 페이지네이션 | `http://localhost:3000/products?q=책&category=book&sort=price_asc&page=1&limit=2` |

---

## 📘 개념 요약

| 파라미터 | 기능 |
|----------|------|
| `q` | 검색어 필터링 |
| `category` | 카테고리 필터 |
| `sort` | 가격 정렬 방식 (`price_asc`, `price_desc`) |
| `page` | 현재 페이지 번호 |
| `limit` | 한 페이지당 결과 개수 |

---

## 📈 확장 가능 예시

- ✅ `minPrice`, `maxPrice` 추가로 가격 범위 필터링
- ✅ `brand`, `rating` 등 추가 조건 처리
- ✅ 유효하지 않은 파라미터에 대한 에러 처리 추가




