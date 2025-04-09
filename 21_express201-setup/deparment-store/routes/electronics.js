const express = require("express");
const router = express.Router(); // 라우터 인스턴스를 생성합니다

// 전자 부서 공통 로그 미들웨어입니다
router.use((req, res, next) => {
  console.log("전자제품 부서 라우터입니다...");
  next(); // 다음 라우터로 진행합니다
});

// GET /electronics → 전자제품 목록을 조회합니다
router.get("/", (req, res) => {
  res.send("전자제품 부서: 전자제품 목록");
});

// POST /electronics/add → 새로운 전자제품을 추가합니다
router.post("/add", (req, res) => {
  res.send("전자제품 부서: 새 전자제품 추가");
});

// PUT /electronics/update/:id → 특정 전자제품 정보 수정
router.put("/update/:id", (req, res) => {
  res.send(`전자제품 부서: ID ${req.params.id}의 전자제품 정보 수정`);
});

// DELETE /electronics/delete/:id → 특정 전자제품 삭제
router.delete("/delete/:id", (req, res) => {
  res.send(`전자제품 부서: ID ${req.params.id}의 전자제품 삭제`);
});

module.exports = router; // 외부에서 사용할 수 있도록 라우터를 내보냅니다
