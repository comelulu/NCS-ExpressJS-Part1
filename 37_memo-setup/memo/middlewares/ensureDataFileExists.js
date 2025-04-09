const fs = require("fs"); // 파일 시스템 모듈
const path = require("path"); // 경로 모듈

// 데이터 파일이 존재하는지 확인하고, 없으면 빈 배열로 초기화하는 함수
const ensureDataFileExists = (relativePath) => (req, res, next) => {
  const fullPath = path.join(__dirname, "..", relativePath); // 경로를 절대 경로로 변환

  // 파일이 없으면 빈 배열을 담은 파일을 생성
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify([]), "utf8");
  }

  next(); // 다음 미들웨어로 넘어감
};

module.exports = ensureDataFileExists; // 이 모듈을 다른 곳에서 사용할 수 있게 export
