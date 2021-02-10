'use strict';

import {
  Counter
} from './modules/Counter.js';

Counter.init({
  transitionDuration: 100,
  transitionClass: 'transition',
  transitionTimingFunction: 'linear',
  start: 0,
  allowNegativeNumbers: false,
  fakeActiveClass: 'fake-class'
});

document.querySelector(".app").addEventListener("click", Counter);

document.addEventListener("wheel", Counter, {
  passive: false
});

document.addEventListener("keydown", Counter);

document.getElementById("allowNegative").addEventListener("change", Counter);