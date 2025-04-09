// 모든 .todo 요소를 찾아서 클릭 이벤트를 걸어줌
const todos = document.querySelectorAll(".todo");

for (todo of todos) {
  todo.addEventListener("click", () => {
    // 클릭한 항목에 줄 긋기 스타일 적용
    todo.style.textDecoration = "line-through";
  });
}
