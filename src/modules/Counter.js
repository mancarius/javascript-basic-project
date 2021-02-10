export const Counter = {
    options: {
        default: {
            selector: "[data-number]",
            transitionDuration: 0,
            transitionTimingFunction: 'linear',
            transitionClass: 'transition',
            start: 0,
            allowNegativeNumbers: true,
        },
        selector: "[data-number]",
        transitionDuration: 0,
        transitionTimingFunction: 'linear',
        transitionClass: 'transition',
        start: 0,
        allowNegativeNumbers: true,
    },
    // dom element
    display: null,
    // timeout per l'evento wheel
    wheelTimeout:null,
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // inizializza l'oggetto
    init(options) {
        //update selector
        this.options.selector = options.selector ?? this.options.default.selector;
        //update transitionDuration
        this.options.transitionDuration = Number(options.transitionDuration ?? this.options.default.transitionDuration);
        //update transitionTimingFunction
        this.options.transitionTimingFunction = options.transitionTimingFunction ?? this.options.default.transitionTimingFunction;
        //update transitionClass
        this.options.transitionClass = options.transitionClass ?? this.options.default.transitionClass;
        //update starting number
        this.options.start = Number(options.start ?? this.options.default.start);
        //update negative numbers allow
        this.options.allowNegativeNumbers = (typeof options.allowNegativeNumbers === 'boolean') ? options.allowNegativeNumbers : this.options.default.allowNegativeNumbers;
        //init display element
        this.setDisplay();
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // gestore principale degli eventi
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
            let selector = this.options.selector;
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
                this.options.transitionDuration + "ms";
            //set transition property
            this.display.style.transitionTimingFunction =
                this.options.transitionTimingFunction;
        }
        return this.display !== null;
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // gestore clicks
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
    // gestore aioni tastiera
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
    // gestore mouse wheel
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
    // gestore modifica opzioni
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
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // simula stato :active sui bottoni
    fakeActive(action) {
        let btn = document.querySelector('[data-action="' + action + '"]');
        btn.classList.toggle("fake-active");
        setTimeout(() => btn.classList.toggle("fake-active"), 100);
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // gestore effetto transizione numeri
    transitionEffect() {
        return new Promise((resolve, reject) => {
            this.display.classList.toggle(this.options.transitionClass);
            setTimeout(() => resolve(true), this.options.transitionDuration);
        });
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // incrementa contatore
    increment() {
        this.transitionEffect().then((resolve) => {
            this.display.dataset.number++;
            this.display.classList.toggle(this.options.transitionClass);
        });
    },
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    // decrementa contatore
    decrement() {
        let current_number = this.display.dataset.number;
        // if negative numbers are not allowed, exit.
        if (current_number < 1 && !this.options.allowNegativeNumbers) {
            this.display.dataset.number = 0;
            return;
        }
        this.transitionEffect().then((resolve) => {
            this.display.dataset.number--;
            this.display.classList.toggle(this.options.transitionClass);
        });
    }
};