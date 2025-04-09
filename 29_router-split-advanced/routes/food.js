const express = require("express");
const router = express.Router();

// 식품 부서 요청 전 공통 미들웨어
router.use((req, res, next) => {
  console.log("식품 부서 라우터입니다...");
  next();
});

// [GET] /food
router.get("/", (req, res) => {
  res.send("식품 부서: 식품 목록");
});

// [POST] /food/add
router.post("/add", (req, res) => {
  res.send("식품 부서: 새 식품 추가");
});

// [PUT] /food/update/:id
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  res.send(`식품 부서: ID ${id}의 식품 정보 수정`);
});

// [DELETE] /food/delete/:id
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  res.send(`식품 부서: ID ${id}의 식품 삭제`);
});

module.exports = router;
