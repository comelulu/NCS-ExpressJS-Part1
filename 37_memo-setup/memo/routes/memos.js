const express = require("express");  // Express 모듈
const router = express.Router();  // 라우터 객체 생성
const fs = require("fs");  // 파일 시스템 모듈
const path = require("path");  // 경로 모듈
const { v4: uuidv4 } = require("uuid");  // UUID 생성 모듈
const ensureDataFileExists = require("../middlewares/ensureDataFileExists");  // 데이터 파일 존재 여부 확인 미들웨어
const authenticateUser = require("../middlewares/authenticateUser");  // 사용자 인증 미들웨어

const DATA_FILE = path.join(__dirname, "..", "data", "memos.json");  // 메모 데이터 파일 경로

// 메모 데이터 파일이 존재하는지 확인하는 미들웨어
router.use(ensureDataFileExists("data/memos.json"));  // 데이터 파일이 존재하는지 확인

// 메모 목록을 가져오는 라우트
router.get("/", (req, res) => {
  const memos = JSON.parse(fs.readFileSync(DATA_FILE));  // 메모 데이터 파일 읽기
  const searchQuery = req.query.search;  // 검색어

  let filteredMemos = memos;  // 기본적으로 모든 메모를 출력

  // 검색어가 있다면 제목이나 내용에서 검색어가 포함된 메모만 필터링
  if (searchQuery) {
    filteredMemos = memos.filter(
      (memo) =>
        memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const authError = req.query.authError === "true";  // 인증 오류 여부 체크

  // 메모 목록 페이지를 렌더링
  res.render("memos/index", {
    memos: filteredMemos,  // 필터링된 메모
    authError: authError,  // 인증 오류 여부
  });
});

// 메모 추가 페이지로 이동하는 라우트
router.get("/add", (req, res) => {
  res.render("memos/add");  // 메모 추가 페이지 렌더링
});

// 메모 추가 처리 라우트
router.post("/add", authenticateUser, (req, res) => {
  const { title, content } = req.body;  // 요청 본문에서 제목과 내용 가져오기
  const userId = req.userId;  // 요청 객체에서 사용자 ID 가져오기
  const memos = JSON.parse(fs.readFileSync(DATA_FILE));  // 기존 메모 데이터 읽기

  // 요청한 사용자가 로그인한 사용자임을 확인
  if (userId) {
    // 새로운 메모 추가
    memos.push({ id: uuidv4(), title, content, userId });
    fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));  // 데이터 파일에 저장
    res.redirect("/memos");  // 메모 목록 페이지로 리다이렉트
  } else {
    return res.status(403).render("unauthorized");  // 인증되지 않은 사용자는 접근할 수 없음
  }
});

// 메모 수정 페이지로 이동하는 라우트
router.get("/edit/:id", (req, res) => {
  const memos = JSON.parse(fs.readFileSync(DATA_FILE));  // 메모 데이터 읽기
  const memoIndex = memos.findIndex((m) => m.id === req.params.id);  // 수정할 메모 찾기
  if (memoIndex !== -1 && memos[memoIndex].userId === req.userId) {
    res.render("memos/edit", { memo: memos[memoIndex] });  // 메모 수정 페이지 렌더링
  } else {
    if (memoIndex >= 0) {
      res.redirect("/memos?authError=true");  // 수정 권한이 없는 경우 인증 오류 페이지로 리다이렉트
    } else {
      return res.status(403).render("notfound");  // 메모를 찾을 수 없는 경우 "Not Found" 페이지 렌더링
    }
  }
});

// 메모 수정 처리 라우트
router.post("/edit/:id", authenticateUser, (req, res) => {
  const { title, content } = req.body;  // 수정할 제목과 내용
  const userId = req.userId;  // 요청 객체에서 사용자 ID
  let memos = JSON.parse(fs.readFileSync(DATA_FILE));  // 메모 데이터 읽기

  // 수정하려는 메모의 작성자가 요청한 사용자인지 확인
  const index = memos.findIndex(
    (m) => m.id === req.params.id && m.userId === userId
  );

  if (index !== -1) {
    // 메모 수정
    memos[index] = { ...memos[index], title, content };
    fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));  // 수정된 메모를 파일에 저장
    res.redirect("/memos");  // 메모 목록 페이지로 리다이렉트
  } else {
    res.redirect("/memos?authError=true");  // 수정 권한이 없으면 인증 오류 페이지로 리다이렉트
  }
});

// 메모 삭제 처리 라우트
router.post("/delete/:id", authenticateUser, (req, res) => {
  let memos = JSON.parse(fs.readFileSync(DATA_FILE));  // 메모 데이터 읽기
  const memoIndex = memos.findIndex((m) => m.id === req.params.id);  // 삭제할 메모 찾기
  if (memoIndex !== -1 && memos[memoIndex].userId === req.userId) {
    // 메모 삭제
    memos.splice(memoIndex, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2));  // 삭제된 메모 반영하여 파일에 저장
    res.redirect("/memos");  // 메모 목록 페이지로 리다이렉트
  } else {
    res.redirect("/memos?authError=true");  // 삭제 권한이 없으면 인증 오류 페이지로 리다이렉트
  }
});

module.exports = router;  // 라우터 객체를 다른 곳에서 사용할 수 있게 export
