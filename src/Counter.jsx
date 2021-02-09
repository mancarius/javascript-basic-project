const Counter = {
  options: {
    viewer: {
      selector: "[data-number]",
      transitionDuration: 100
    }
  },
  viewer: null,
  // gestore di eventi
  handleEvent(e) {
    // se non ho l'elemento in cui stampare il risultato non procedo
    if (!this.setViewer()) {
      console.log("Viewer not found");
      return;
    }

    switch (e.type) {
      // se l'evento ricevuto generato dal mouse lo rimando al gestore del mouse
      case "click":
        this.mouseEvent(e);
        break;
      // se l'evento ricevuto generato dalla tastiera lo rimando al gestore della tastiera
      case "keydown":
        this.keyboardEvent(e);
        break;
      // se l'evento non è riconosciuto esco
      default:
        console.log("Event not allowed");
        return;
    }
  },

  setViewer() {
    if (this.viewer === null) {
      let selector = this.options.viewer.selector;
      try {
        this.viewer = document.querySelector(selector);
      } catch (err) {
        console.log("Bad selector");
        return;
      }
      this.viewer.style.transitionDuration =
        this.options.viewer.transitionDuration + "ms";
    }
    return this.viewer !== null;
  },

  mouseEvent(e) {
    // identifico il target
    let target = e.target.closest("[data-action]") ?? e.target,
      action = target.dataset.action;

    switch (action) {
      case "increment":
        this.increment();
        break;
      case "decrement":
        this.decrement();
        break;
      default:
        console.log("Mouse action not found");
        return;
    }
  },

  keyboardEvent(e) {
    let action = e.key || e.keyCode;

    switch (action) {
      case "+":
      case 38:
      case "ArrowUp":
        this.fakeActive("increment");
        this.increment();
        break;
      case "-":
      case 40:
      case "ArrowDown":
        this.fakeActive("decrement");
        this.decrement();
        break;
      default:
        console.log("Keyboard action not found");
        return;
    }
  },

  fakeActive(action) {
    let btn = document.querySelector('[data-action="' + action + '"]');
    btn.classList.toggle("fake-active");
    setTimeout(() => btn.classList.toggle("fake-active"), 100);
  },

  transitionEffect() {
    return new Promise((resolve, reject) => {
      this.viewer.classList.toggle("transition");
      setTimeout(() => resolve(true), this.transition.duration);
    });
  },

  increment() {
    this.transitionEffect().then((resolve) => {
      this.viewer.dataset.number++;
      this.viewer.classList.toggle("transition");
    });
  },

  decrement() {
    this.transitionEffect().then((resolve) => {
      this.viewer.dataset.number--;
      this.viewer.classList.toggle("transition");
    });
  }
};
