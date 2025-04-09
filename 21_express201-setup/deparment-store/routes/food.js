const express = require("express");
const router = express.Router(); // 라우터 인스턴스를 생성합니다

// 식품 부서 공통 미들웨어로, 모든 요청에 로그를 출력합니다
router.use((req, res, next) => {
  console.log("식품 부서 라우터입니다...");
  next(); // 다음 라우터 핸들러로 이동합니다
});

// GET /food → 식품 목록을 조회합니다
router.get("/", (req, res) => {
  res.send("식품 부서: 식품 목록");
});

// POST /food/add → 새로운 식품 항목을 추가합니다
router.post("/add", (req, res) => {
  res.send("식품 부서: 새 식품 추가");
});

// PUT /food/update/:id → 특정 식품 정보 수정
router.put("/update/:id", (req, res) => {
  res.send(`식품 부서: ID ${req.params.id}의 식품 정보 수정`);
});

// DELETE /food/delete/:id → 특정 식품 삭제
router.delete("/delete/:id", (req, res) => {
  res.send(`식품 부서: ID ${req.params.id}의 식품 삭제`);
});

module.exports = router; // 라우터를 외부에 내보냅니다
