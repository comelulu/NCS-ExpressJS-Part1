const jwt = require("jsonwebtoken");  // JWT 처리 모듈

// 사용자 인증을 처리하는 미들웨어
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;  // 클라이언트가 보낸 쿠키에서 토큰을 가져옴
  if (!token) {  // 토큰이 없으면 인증되지 않은 사용자로 간주
    return res.status(403).render("unauthorized");  // Unauthorized 페이지로 리다이렉트
  }

  // JWT 토큰을 검증
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {  // 토큰이 유효하지 않으면 에러 처리
      return res.status(403).send("Invalid token");
    }
    req.userId = decoded.userId;  // 토큰에서 사용자 ID를 추출하여 요청 객체에 저장
    next();  // 인증이 완료되었으므로 다음 미들웨어로 넘어감
  });
};

module.exports = authenticateUser;  // 미들웨어를 다른 곳에서 사용할 수 있게 export
