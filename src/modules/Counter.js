export const Counter = {
    options: {
        display: {
            selector: "[data-number]",
            transitionDuration: 0,
            transitionTimingFunction: 'linear',
            transitionClass: 'transition',
        },
        start: 0,
        allowNegativeNumbers: true,
    },
    // dom element
    display: null,
    // timeout per l'evento wheel
    wheelTimeout:null,
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
        this.options.allowNegativeNumbers = (typeof options.allowNegativeNumbers === 'boolean') ? options.allowNegativeNumbers : this.options.allowNegativeNumbers;
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
            
            case "click": // se l'evento ricevuto generato dal mouse lo rimando al gestore del mouse
                this.clickAction(e);
                break;
            case "keydown": // se l'evento ricevuto è generato dalla tastiera lo rimando al gestore della tastiera
                this.keyboardAction(e);
                break;
            case "wheel": // se l'evento ricevuto è generato dalla rotellina de mouse lo rimando al gestore della tastiera
                if (this.wheelTimeout === null)
                    this.wheelTimeout = setTimeout(() => {
                        this.wheelAction(e);
                        clearTimeout(this.wheelTimeout);
                        this.wheelTimeout = null;
                    }, 150);
                break;
            case "change": // se l'evento ricevuto generato dalla tastiera lo rimando al gestore della tastiera
                this.optionsChange(e);
                break;
            default: // se l'evento non è riconosciuto esco
                console.log("Event not allowed");
                return;
        }
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // inizializza l'elemento del dom che visualizza il contatore
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
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // this function handle the click actions
    clickAction(e) {
        // findeing the target with data-action
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
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // this function handle the keyboard actions
    keyboardAction(e) {
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
            case 32:
            case "Spacebar":
            case " ":
                // simulo cambio stato su checkbox
                let checkbox = document.querySelector('[data-action="toggle-negative"]');
                // cambio valore checkbox
                checkbox.checked = !checkbox.checked;
                // simulo l'evento di 'change'
                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    checkbox.dispatchEvent(evt);
                } else
                    checkbox.fireEvent("onchange");
                break;
            default:
                console.log("Keyboard action not found");
                return;
        }
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // this function handle the mouse wheel actions
    wheelAction(e) {
        e.preventDefault();
        let action = e.deltaY < 10 ? 'increment' : e.deltaY > 10 ? 'decrement' : null;

        switch (action) {
            case "increment":
                this.fakeActive(action);
                this.increment();
                break;
            case "decrement":
                this.fakeActive(action);
                this.decrement();
                break;
            default:
                console.log("Standing wheel");
                return;
        }
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // this function handle the keyboard events
    optionsChange(e) {
        let target = e.target,
            action = target.dataset.action,
            value = target.checked ?? null;
        
        switch (action) {
            case "toggle-negative":
                this.options.allowNegativeNumbers = value;
                // assign 0 if the current value is negative
                // don't need to check if allowed, alreay works
                (this.display.dataset.number < 0) && (this.decrement());
                break;
            default:
                console.log("Option not found");
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
        if (current_number < 1 && !this.options.allowNegativeNumbers) {
            this.display.dataset.number = 0;
            return;
        }
        this.transitionEffect().then((resolve) => {
            this.display.dataset.number--;
            this.display.classList.toggle("transition");
        });
    }
};