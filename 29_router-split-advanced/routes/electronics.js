const express = require("express");
const router = express.Router();

// 전자제품 부서에 들어오는 모든 요청 전 실행되는 공통 미들웨어
router.use((req, res, next) => {
  console.log("전자제품 부서 라우터입니다...");
  next();
});

// [GET] /electronics
router.get("/", (req, res) => {
  res.send("전자제품 부서: 전자제품 목록");
});

// [POST] /electronics/add
router.post("/add", (req, res) => {
  res.send("전자제품 부서: 새 전자제품 추가");
});

// [PUT] /electronics/update/:id
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  res.send(`전자제품 부서: ID ${id}의 전자제품 정보 수정`);
});

// [DELETE] /electronics/delete/:id
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  res.send(`전자제품 부서: ID ${id}의 전자제품 삭제`);
});

module.exports = router;
