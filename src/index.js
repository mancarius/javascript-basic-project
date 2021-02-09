import { Counter } from './modules/Counter.js'

Counter.init({
  selector: '[data-number]',
  transitionDuration: 100,
  transitionClass: 'transition',
  transitionTimingFunction: 'linear',
  start: 0,
  negativeNumbers: false
})

document.querySelector(".app").addEventListener("click", Counter);

document.addEventListener("keydown", Counter);