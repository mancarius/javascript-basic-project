import Counter from "./Counter";

const counter = Counter;

counter.init({
  counterSelector: "[data-number]",
  transitionDuration: 100
});

document.querySelector(".app").addEventListener("click", counter);

document.addEventListener("keydown", counter);
