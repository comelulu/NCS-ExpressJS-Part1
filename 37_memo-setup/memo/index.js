const express = require("express"); // Express 모듈을 가져옵니다.
const path = require("path"); // 경로 모듈을 가져옵니다.
const cookieParser = require("cookie-parser"); // 쿠키 파싱을 위한 모듈
const bodyParser = require("body-parser"); // 요청 본문 파싱을 위한 모듈
const logger = require("morgan"); // 로그 출력을 위한 모듈
const dotenv = require("dotenv"); // 환경 변수 로드를 위한 모듈
const fs = require("fs"); // 파일 시스템 모듈

const usersRouter = require("./routes/users"); // 사용자 관련 라우터
const memosRouter = require("./routes/memos"); // 메모 관련 라우터

// 환경 변수 로드
dotenv.config(); // .env 파일에 정의된 환경 변수를 로드

// Express 애플리케이션 초기화
const app = express();

// 요청 본문을 JSON 형식으로 파싱하는 미들웨어 설정
app.use(bodyParser.json());

// 요청 본문을 URL 인코딩된 형식으로 파싱하는 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));

// 쿠키 파싱을 위한 미들웨어 설정
app.use(cookieParser());

// HTTP 요청 로그를 출력하는 미들웨어 설정
app.use(logger("dev"));

// EJS를 템플릿 엔진으로 사용 설정
app.set("view engine", "ejs");

// views 폴더 경로 설정
app.set("views", path.join(__dirname, "views"));

// 정적 파일 (CSS, JS, 이미지 등)을 서빙하는 경로 설정
app.use(express.static(path.join(__dirname, "public")));

// 사용자 관련 라우터 등록
app.use("/users", usersRouter);

// 메모 관련 라우터 등록
app.use("/memos", memosRouter);

// 기본 라우터 (홈 페이지)
app.get("/", (req, res) => {
  // 메인 페이지로 리다이렉트
  res.redirect("/memos");
});

// 404 에러 핸들링 (존재하지 않는 페이지)
app.use((req, res, next) => {
  res.status(404).render("notfound"); // "notfound" 뷰를 렌더링
});

// 서버를 시작합니다.
const port = process.env.PORT || 3000; // 환경 변수에서 포트를 가져오거나 기본값 3000 사용
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // 서버가 실행되면 콘솔에 메시지 출력
});
