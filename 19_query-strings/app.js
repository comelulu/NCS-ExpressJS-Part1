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
  ].filter((item) => item.toLowerCase().includes(searchQuery?.toLowerCase()));

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
