const express = require("express");
const app = express();

// ① 사용할 템플릿 엔진을 'ejs'로 설정합니다
app.set("view engine", "ejs");

/*
  🔍 view engine이란?
  - "Express야, 나는 화면을 만들 때 ejs라는 템플릿 도구를 쓸 거야" 하고 알려주는 설정입니다.
  - 'ejs' 말고도 pug, handlebars 등 다양한 템플릿 엔진을 사용할 수 있습니다.
*/

// ② EJS 파일이 저장된 폴더 경로를 지정합니다
app.set("views", "./views");

/*
  🔍 views란?
  - "ejs 파일들이 어디 폴더에 있는지"를 알려주는 설정입니다.
  - 기본값은 "./views"지만, 명시적으로 적어주는 게 좋습니다.
  - 즉, 'res.render("index")'라고 했을 때, 실제로는 './views/index.ejs' 파일을 찾게 됩니다.
*/

// ③ 루트 경로로 요청이 오면 index.ejs 파일을 렌더링합니다
app.get("/", (req, res) => {
  // index.ejs 파일을 불러오고, title 값을 전달합니다
  res.render("index", { title: "Hello, EJS!" });

  /*
    🔍 res.render(뷰 파일 이름, 데이터 객체)
    - 첫 번째 인자: 렌더링할 ejs 파일 이름입니다 (확장자 없이)
    - 두 번째 인자: HTML 안에서 사용할 데이터를 객체로 넘깁니다
    - 예: index.ejs 안에서 <%= title %>로 "Hello, EJS!"가 들어갑니다
  */
});

// ④ 서버 실행
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
