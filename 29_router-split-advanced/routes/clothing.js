const express = require("express");
const router = express.Router();

// 모든 의류 관련 요청 전에 실행되는 공통 미들웨어입니다.
router.use((req, res, next) => {
  console.log("의류 부서 라우터입니다...");
  next();
});

// [GET] /clothing
// → 옷 목록을 보여주는 요청
router.get("/", (req, res) => {
  res.send("의류 부서: 옷 목록");
});

// [POST] /clothing/add
// → 새 옷을 추가하는 요청
router.post("/add", (req, res) => {
  // 실제로는 req.body를 통해 받아온 데이터를 DB에 저장하는 로직이 들어갈 수 있습니다.
  res.send("의류 부서: 새 옷 추가");
});

// [PUT] /clothing/update/:id
// → 특정 ID의 옷 정보를 수정하는 요청
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  res.send(`의류 부서: ID ${id}의 옷 정보 수정`);
});

// [DELETE] /clothing/delete/:id
// → 특정 ID의 옷을 삭제하는 요청
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  res.send(`의류 부서: ID ${id}의 옷 삭제`);
});

module.exports = router;
