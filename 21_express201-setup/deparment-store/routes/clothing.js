const express = require("express");
const router = express.Router(); // 라우터 인스턴스를 생성합니다

// 모든 의류 부서 요청에 대해 로그를 남기는 미들웨어입니다
router.use((req, res, next) => {
  console.log("의류 부서 라우터입니다...");
  next(); // 다음 라우터 핸들러로 이동합니다
});

// GET /clothing → 의류 목록을 조회합니다
router.get("/", (req, res) => {
  res.send("의류 부서: 옷 목록");
});

// POST /clothing/add → 새로운 옷을 추가합니다
router.post("/add", (req, res) => {
  res.send("의류 부서: 새 옷 추가");
});

// PUT /clothing/update/:id → 특정 ID의 옷 정보를 수정합니다
router.put("/update/:id", (req, res) => {
  res.send(`의류 부서: ID ${req.params.id}의 옷 정보 수정`);
});

// DELETE /clothing/delete/:id → 특정 ID의 옷을 삭제합니다
router.delete("/delete/:id", (req, res) => {
  res.send(`의류 부서: ID ${req.params.id}의 옷 삭제`);
});

module.exports = router; // 라우터를 외부에서 사용할 수 있도록 내보냅니다
