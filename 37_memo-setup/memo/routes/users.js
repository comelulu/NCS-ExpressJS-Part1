const express = require("express"); // Express 모듈
const router = express.Router(); // 라우터 객체 생성
const jwt = require("jsonwebtoken"); // JWT 처리 모듈
const fs = require("fs"); // 파일 시스템 모듈
const path = require("path"); // 경로 모듈
const { v4: uuidv4 } = require("uuid"); // UUID 생성 모듈
const bcrypt = require("bcrypt"); // bcrypt 모듈
const ensureDataFileExists = require("../middlewares/ensureDataFileExists"); // 데이터 파일 존재 여부 확인 미들웨어
require("dotenv").config(); // .env 파일을 로드하여 환경 변수 설정

const DATA_FILE = path.join(__dirname, "..", "data", "users.json"); // 사용자 데이터 파일 경로

router.use(ensureDataFileExists("data/users.json")); // 사용자 데이터 파일이 존재하는지 확인

// 사용자 로그인 페이지 라우트
router.get("/login", (req, res) => {
  res.render("users/login"); // 로그인 페이지 렌더링
});

// 사용자 등록 페이지 라우트
router.get("/register", (req, res) => {
  res.render("users/register"); // 회원가입 페이지 렌더링
});

// 사용자 로그인 처리 라우트
router.post("/login", (req, res) => {
  const { username, password } = req.body; // 요청 본문에서 사용자 이름과 비밀번호 가져오기
  const users = JSON.parse(fs.readFileSync(DATA_FILE)); // 사용자 데이터 읽기
  const user = users.find((u) => u.username === username); // 입력된 사용자 이름과 일치하는 사용자 찾기

  // 사용자가 존재하고 비밀번호가 일치하는 경우
  if (user && bcrypt.compareSync(password, user.password)) {
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id }, // 토큰에 사용자 ID 포함
      process.env.JWT_SECRET // JWT 비밀 키
    );
    res.cookie("token", token, { httpOnly: true }); // 토큰을 쿠키에 저장
    res.redirect("/memos"); // 메모 목록 페이지로 리다이렉트
  } else {
    res.render("users/login", {
      // 로그인 실패 시, 오류 메시지 렌더링
      error: "Invalid username or password",
    });
  }
});

// 사용자 로그아웃 처리 라우트
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // 쿠키에서 토큰 제거
  res.redirect("/users/login"); // 로그인 페이지로 리다이렉트
});

// 사용자 등록 처리 라우트
router.post("/register", (req, res) => {
  const { username, password } = req.body; // 사용자 이름과 비밀번호 가져오기
  const users = JSON.parse(fs.readFileSync(DATA_FILE)); // 사용자 데이터 읽기
  const existingUser = users.find((u) => u.username === username); // 이미 존재하는 사용자 확인

  // 이미 존재하는 사용자인 경우
  if (existingUser) {
    return res.render("register", { error: "User already exists" }); // 이미 존재하는 사용자 오류 메시지
  }

  // 새로운 사용자 추가
  const hashedPassword = bcrypt.hashSync(password, 10); // 비밀번호 해시화
  const newUser = {
    id: uuidv4(), // 새로운 UUID 생성
    username,
    password: hashedPassword, // 해시된 비밀번호
  };
  users.push(newUser); // 새로운 사용자 추가
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2)); // 데이터 파일에 저장

  res.redirect("/users/login"); // 로그인 페이지로 리다이렉트
});

// 로그인 페이지로 리다이렉트하는 라우터
router.get("/", (req, res) => {
  if (!req.cookies.token) {
    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    res.redirect("/users/login");
  } else {
    res.redirect("/memos"); // 로그인 상태이면 메모 목록 페이지로 리다이렉트
  }
});

module.exports = router; // 라우터 객체를 다른 곳에서 사용할 수 있게 export
