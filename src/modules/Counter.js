export const Counter = {
    options: {
        display: {
            selector: "[data-number]",
            transitionDuration: 0,
            transitionTimingFunction: 'linear',
            transitionClass: 'transition',
        },
        start: 0,
        negativeNumbers: true,
    },
    // dom element
    display: null,
    //initializer
    init(options) {
        //update selector
        this.options.display.selector = options.selector ?? this.options.display.selector;
        //update transitionDuration
        this.options.display.transitionDuration = Number(options.transitionDuration ?? this.options.display.transitionDuration);
        //update transitionTimingFunction
        this.options.display.transitionTimingFunction = options.transitionTimingFunction ?? this.options.display.transitionTimingFunction;
        //update transitionClass
        this.options.display.transitionClass = options.transitionClass ?? this.options.display.transitionClass;
        //update starting number
        this.options.display.start = Number(options.start ?? this.options.start);
        //update negative numbers allow
        this.options.negativeNumbers = (typeof options.negativeNumbers === 'boolean') ? options.negativeNumbers : this.options.negativeNumbers;
        //init display element
        this.setDisplay();
    },
    // gestore di eventi
    handleEvent(e) {
        // se non ho l'elemento in cui stampare il numero non procedo
        if (this.display === null) {
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

    setDisplay() {
        if (this.display === null) {
            let selector = this.options.display.selector;
            try {
                this.display = document.querySelector(selector);
            } catch (err) {
                console.log("Bad selector");
                return;
            }
            // starting number
            this.display.dataset.number = this.options.start;
            //set transition duration
            this.display.style.transitionDuration =
                this.options.display.transitionDuration + "ms";
            //set transition property
            this.display.style.transitionTimingFunction =
                this.options.display.transitionTimingFunction;
        }
        return this.display !== null;
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
            this.display.classList.toggle(this.options.display.transitionClass);
            setTimeout(() => resolve(true), this.options.display.transitionDuration);
        });
    },

    increment() {
        this.transitionEffect().then((resolve) => {
            this.display.dataset.number++;
            this.display.classList.toggle("transition");
        });
    },

    decrement() {
        let current_number = this.display.dataset.number;
        // if negative numbers are not allowed, exit.
        if (current_number <= 0 && !this.options.negativeNumbers) {
            this.display.dataset.number = 0;
            return;
        }
        this.transitionEffect().then((resolve) => {
            this.display.dataset.number--;
            this.display.classList.toggle("transition");
        });
    }
};