// path 모듈을 불러옵니다. (디렉토리 경로를 쉽게 관리하기 위해 사용)
const path = require("path");
// express 모듈을 불러옵니다. (웹 서버를 구축하기 위한 라이브러리)
const express = require("express");
// Express 애플리케이션 인스턴스를 생성합니다.
const app = express();

// 뷰 엔진을 EJS로 설정합니다. EJS는 서버에서 동적으로 HTML을 생성할 수 있는 템플릿 엔진입니다.
app.set("view engine", "ejs");
// 'views' 폴더를 템플릿 파일을 찾을 디렉토리로 설정합니다. __dirname은 현재 파일의 디렉토리 경로를 참조합니다.
app.set("views", path.join(__dirname, "views"));

// 1. 동기 코드에서 직접 오류를 발생시키는 경우
// 이 라우트에서는 요청을 받으면 동기적으로 오류를 발생시킵니다.
app.get("/", (req, res) => {
  // 오류를 발생시킵니다. 이 오류는 바로 아래 미들웨어로 넘어가게 됩니다.
  throw new Error("Something went wrong!");
});

// 2. next 함수를 사용하여 오류를 명시적으로 전달하는 경우
// 'next()'를 사용하여 오류를 명시적으로 전달합니다.
app.get("/", (req, res, next) => {
  // 오류 객체를 생성합니다.
  const err = new Error("Something went wrong!");
  // next()를 통해 이 오류를 Express의 오류 처리 미들웨어로 전달합니다.
  next(err);
});

// 3. 비동기 작업에서 발생한 오류를 next 함수로 전달하는 경우
// 비동기 작업에서 오류가 발생한 경우, 그 오류를 처리하기 위해 next()를 사용합니다.
app.get("/", (req, res, next) => {
  setTimeout(() => {
    try {
      // 비동기 코드 내에서 오류를 발생시킵니다.
      throw new Error("Async error");
    } catch (err) {
      // 오류가 발생하면, 이를 next()로 전달하여 오류 처리 미들웨어로 넘깁니다.
      next(err);
    }
  }, 1000); // setTimeout은 비동기 작업의 예시입니다.
});

// 4. Promise 또는 async/await 구문에서 발생한 오류를 처리하지 않고 next로 전달하는 경우
// async/await를 사용하는 비동기 작업에서 오류가 발생하면, 이를 처리하지 않고 next()로 전달합니다.
app.get("/", async (req, res, next) => {
  try {
    // someAsyncOperation()은 비동기 함수로 예시입니다.
    await someAsyncOperation();
  } catch (err) {
    // 오류 발생 시 next()로 오류를 전달합니다.
    next(err);
  }
});

// 5. 기타 미들웨어에서 next를 호출하여 다음 오류 처리 미들웨어로 직접 이동하는 경우
// 특정 조건에 따라 오류를 처리하거나 다음 미들웨어로 넘어갑니다.
app.use((req, res, next) => {
  // someCondition은 조건을 확인하는 예시입니다.
  if (someCondition) {
    // 조건이 맞으면 다음 미들웨어로 넘어갑니다.
    next();
  } else {
    // 조건이 맞지 않으면 오류를 발생시킵니다.
    const error = new Error("Error message");
    // 오류가 발생하면 이를 next()로 오류 처리 미들웨어로 전달합니다.
    next(error);
  }
});

// 404 페이지 처리 미들웨어 (잘못된 경로 접근 시)
// 사용자가 존재하지 않는 경로를 요청할 때 404 페이지를 렌더링합니다.
app.use((req, res, next) => {
  // 404 상태 코드와 함께 404.ejs 템플릿을 렌더링합니다.
  res.status(404).render("404", { url: req.url });
});

// 500 에러 처리 미들웨어
// 위에서 발생한 모든 오류는 이 미들웨어로 전달됩니다.
app.use((err, req, res, next) => {
  // 오류 스택을 콘솔에 출력하여 서버 로그를 기록합니다.
  // 이렇게 하면 개발자는 오류의 원인을 추적할 수 있습니다.
  console.error(err.stack);
  // 사용자에게는 500 에러 메시지와 함께 응답을 보냅니다.
  res.status(500).send("Internal Server Error");
});

// 서버 실행
// 포트 3000에서 애플리케이션을 실행합니다.
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
