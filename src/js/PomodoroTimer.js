class PomodoroTimer {
    constructor(id, manager) {
        this.id = id;
        this.manager = manager;
        this.timeLeft = 0;
        this.timerInterval = null;
        this.audioContext = null;
        this.isRunning = false;
        this.isPaused = false;
        this.selectedMinutes = 0;
        this.chimeInterval = null;
        this.element = null;
    }

    createElement() {
        const container = document.createElement('div');
        container.className = 'timer-container';
        container.id = `timer-${this.id}`;
        
        container.innerHTML = `
            <div class="timer-display" id="display-${this.id}">00:00</div>
            
            <div class="preset-buttons">
                <button class="preset-btn" data-timer-id="${this.id}" data-minutes="5">5 mins</button>
                <button class="preset-btn" data-timer-id="${this.id}" data-minutes="15">15 mins</button>
                <button class="preset-btn" data-timer-id="${this.id}" data-minutes="30">30 mins</button>
            </div>
            
            <div class="controls">
                <button class="control-btn icon-btn" id="pauseBtn-${this.id}" disabled title="Pause">
                    ${this.getSVG('pause')}
                </button>
                <button class="control-btn icon-btn" id="resetBtn-${this.id}" disabled title="Reset">
                    ${this.getSVG('reset')}
                </button>
            </div>
        `;
        
        this.element = container;
        this.setupEventListeners();
        return container;
    }

    getSVG(type) {
        const svgs = {
            pause: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
            play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
            reset: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>'
        };
        return svgs[type];
    }

    setupEventListeners() {
        const presetBtns = this.element.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                this.isRunning ? this.addTime(minutes) : this.startTimer(minutes);
            });
        });

        this.element.querySelector(`#pauseBtn-${this.id}`).addEventListener('click', () => this.pauseTimer());
        this.element.querySelector(`#resetBtn-${this.id}`).addEventListener('click', () => this.resetTimer());
    }

    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playChime() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    startChiming() {
        this.playChime();
        this.chimeInterval = setInterval(() => this.playChime(), 1000);
    }

    stopChiming() {
        if (this.chimeInterval) {
            clearInterval(this.chimeInterval);
            this.chimeInterval = null;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = this.element.querySelector(`#display-${this.id}`);
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updatePresetButtonText() {
        const presetButtons = this.element.querySelectorAll('.preset-btn');
        presetButtons.forEach(button => {
            const minutes = button.dataset.minutes;
            button.textContent = this.isRunning ? `+${minutes} mins` : `${minutes} mins`;
        });
    }

    startTimer(minutes) {
        this.initAudio();
        this.selectedMinutes = minutes;
        this.timeLeft = minutes * 60;
        this.isRunning = true;
        this.isPaused = false;
        
        const display = this.element.querySelector(`#display-${this.id}`);
        const pauseBtn = this.element.querySelector(`#pauseBtn-${this.id}`);
        const resetBtn = this.element.querySelector(`#resetBtn-${this.id}`);
        
        display.classList.add('running');
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        pauseBtn.innerHTML = this.getSVG('pause');
        
        this.updatePresetButtonText();
        this.updateDisplay();
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                    this.timerComplete();
                }
            }
        }, 1000);
    }

    addTime(minutes) {
        if (this.isRunning) {
            this.timeLeft += minutes * 60;
            this.updateDisplay();
        }
    }

    pauseTimer() {
        const display = this.element.querySelector(`#display-${this.id}`);
        const pauseBtn = this.element.querySelector(`#pauseBtn-${this.id}`);
        
        if (this.isPaused) {
            this.isPaused = false;
            pauseBtn.innerHTML = this.getSVG('pause');
            display.classList.add('running');
        } else {
            this.isPaused = true;
            pauseBtn.innerHTML = this.getSVG('play');
            display.classList.remove('running');
        }
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timeLeft = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.updateDisplay();
        
        const display = this.element.querySelector(`#display-${this.id}`);
        const pauseBtn = this.element.querySelector(`#pauseBtn-${this.id}`);
        const resetBtn = this.element.querySelector(`#resetBtn-${this.id}`);
        
        display.classList.remove('running');
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        pauseBtn.innerHTML = this.getSVG('pause');
        
        this.updatePresetButtonText();
    }

    timerComplete() {
        this.isRunning = false;
        const display = this.element.querySelector(`#display-${this.id}`);
        const pauseBtn = this.element.querySelector(`#pauseBtn-${this.id}`);
        const resetBtn = this.element.querySelector(`#resetBtn-${this.id}`);
        
        display.classList.remove('running');
        this.updatePresetButtonText();
        pauseBtn.disabled = true;
        resetBtn.disabled = true;

        this.manager.showModal(this.id);
        this.startChiming();

        if (window.electronAPI) {
            window.electronAPI.showNotification("Time's Up!", "Your Pomodoro session is complete!");
        }
    }

    cleanup() {
        clearInterval(this.timerInterval);
        this.stopChiming();
        this.element.remove();
    }
}