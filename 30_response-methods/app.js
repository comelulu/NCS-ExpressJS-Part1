const path = require("path");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/home", (req, res) => {
  res.render("home", { title: "Home Page" });
});

// 서버 실행
app.listen(3000, () => {
  console.log(`app listening at http://localhost:3000`);
});
