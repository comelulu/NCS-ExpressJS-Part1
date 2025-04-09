# 19. QueryStrings

---

## 🌐 Part 1. Query String 이란?

### 🔍 정의  
**Query String**은 웹 주소(URL)의 끝에 붙는 `?key=value` 형태의 문자열로,  
**추가적인 정보를 서버에 전달**하는 역할을 합니다.

### 📌 기본 형식
```js
/search?q=express
       ▲     ▲
       |     └─ value (검색할 단어)
       └────── key (서버가 해석할 키워드 이름)
```

### ✅ 특징
| 특징 | 설명 |
|------|------|
| 위치 | URL 끝에 `?`로 시작 |
| 여러 개 전달 | `&`로 구분 (예: `?q=express&page=2`) |
| 서버에서 접근 | Express에서는 `req.query` 객체로 접근 가능 |

---

## 💡 실무 예: 검색, 필터, 정렬 등에서 매우 자주 사용됨

예:
- `/search?q=express&page=2`
- `/products?category=book&sort=price_asc`
- `/posts?tag=node&tag=express`

---

## 🧩 Part 2. 기본 코드 설명 (사용자 요청에 따라 검색, 필터링 구현)

```js
const express = require("express");
const app = express();

// 1. 단일 검색어를 받는 검색 라우트
app.get("/search", (req, res) => {
  const searchQuery = req.query.q;
  // 사용자가 입력한 검색어를 추출 (예: /search?q=express → "express")

  // (가상의 예시) 데이터베이스 검색 흉내
  const results = [
    "Express 기본",
    "Node.js 입문",
    "Express 라우팅",
    "React Express 연동",
  ].filter((item) =>
    item.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  res.send({
    query: searchQuery,
    results: results.length ? results : "검색 결과 없음",
  });
});

// 2. 복수 개의 검색 파라미터 사용 예시
app.get("/example/info/a", (req, res) => {
  console.log(req.query); // 전체 쿼리 로그 확인

  const keyword = req.query.keyword; // 예: ?keyword=express
  const category = req.query.category; // 예: ?category=tutorial
  const page = req.query.page; // 예: ?page=1

  res.send({
    keyword,
    category,
    page,
    message: `${keyword}를 ${category}에서 찾고 페이지 ${page}를 보고 있습니다.`,
  });
});

// 3. 같은 키(tags)를 여러 번 사용하는 쿼리 문자열 예시
app.get("/example/info/b", (req, res) => {
  console.log(req.query); // 예: { tags: ['node', 'express', 'javascript'] }

  const tags = req.query.tags;

  res.send({
    tags,
    message: `선택한 태그: ${Array.isArray(tags) ? tags.join(", ") : tags}`,
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
```

---

## 🧭 실제 요청 흐름 시각화

### ✅ 요청 예시 1: `/search?q=express`

```js
브라우저 요청 → GET /search?q=express
↓
서버 코드 실행:
  - req.query → { q: 'express' }
  - searchQuery = 'express'
  - 결과 필터링 → ["Express 기본", "Express 라우팅", "React Express 연동"]
↓
응답:
{
  query: "express",
  results: [ ... ]
}
```

---

### ✅ 요청 예시 2: `/example/info/a?keyword=express&category=tutorial&page=2`

```js
req.query →
{
  keyword: 'express',
  category: 'tutorial',
  page: '2'
}

응답:
{
  keyword: 'express',
  category: 'tutorial',
  page: '2',
  message: 'express를 tutorial에서 찾고 페이지 2를 보고 있습니다.'
}
```

---

### ✅ 요청 예시 3: `/example/info/b?tags=node&tags=express&tags=javascript`

```js
req.query →
{
  tags: ['node', 'express', 'javascript']
}

응답:
{
  tags: ['node', 'express', 'javascript'],
  message: '선택한 태그: node, express, javascript'
}
```

---

## 🛠 확장 가능한 기능 (실무에서 이렇게 발전시킵니다)

### 1. ✅ 정렬 기능 추가
```js
// /products?sort=price_asc
const sort = req.query.sort; // "price_asc"
```

### 2. ✅ 기본값 설정
```js
const page = req.query.page || 1; // 값이 없으면 기본 1페이지
```

### 3. ✅ 값 타입 변환
```js
const limit = parseInt(req.query.limit); // 문자열 → 숫자로 변환
```

### 4. ✅ 필수 파라미터 누락 처리
```js
if (!req.query.q) {
  return res.status(400).send("검색어가 필요합니다.");
}
```

---

## 📘 요약 정리

| 구분 | 설명 |
|------|------|
| `req.query` | 쿼리 문자열을 객체 형태로 가져옵니다. |
| 단일값 | `?q=express` → `{ q: "express" }` |
| 다중값 | `?tags=a&tags=b` → `{ tags: ["a", "b"] }` |
| 타입 | 항상 문자열(String) 또는 문자열 배열 형태로 전달됨 |
| 사용 용도 | 검색, 필터링, 정렬, 페이지네이션 등 |

---

## ✅ 테스트 주소 요약

| 주소 | 기능 |
|------|------|
| `http://localhost:3000/search?q=node` | `q` 값으로 검색 수행 |
| `http://localhost:3000/example/info/a?keyword=api&category=docs&page=2` | 필터링 조건 적용 |
| `http://localhost:3000/example/info/b?tags=js&tags=express` | 태그 목록 필터링 |

