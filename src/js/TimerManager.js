class TimerManager {
    constructor() {
        this.timers = new Map();
        this.nextTimerId = 1;
        this.MAX_TIMERS = 6;
        this.grid = document.getElementById('timersGrid');
        this.addBtn = document.getElementById('addTimerBtn');
        this.modal = document.getElementById('modal');
        this.okBtn = document.getElementById('okBtn');
        
        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.createTimer());
        this.okBtn.addEventListener('click', () => this.handleModalClose());
        this.createTimer();
    }

    createTimer() {
        if (this.timers.size >= this.MAX_TIMERS) return;
        
        const timer = new PomodoroTimer(this.nextTimerId++, this);
        this.timers.set(timer.id, timer);
        
        this.grid.appendChild(timer.createElement());
        this.updateLayout();
        this.updateDeleteButtons();
        this.updateAddButton();
    }

    deleteTimer(timerId) {
        if (this.timers.size <= 1) return;
        
        const timer = this.timers.get(timerId);
        if (timer) {
            timer.cleanup();
            this.timers.delete(timerId);
            this.updateLayout();
            this.updateDeleteButtons();
            this.updateAddButton();
        }
    }

    updateLayout() {
        this.grid.setAttribute('data-count', this.timers.size.toString());
    }

    updateDeleteButtons() {
        document.querySelectorAll('.timer-container').forEach(container => {
            const deleteBtn = container.querySelector('.delete-timer');
            if (this.timers.size > 1) {
                if (!deleteBtn) {
                    const timerId = parseInt(container.id.replace('timer-', ''));
                    const timer = this.timers.get(timerId);
                    if (timer) {
                        const btn = this.createDeleteButton(timerId);
                        container.appendChild(btn);
                    }
                }
            } else if (deleteBtn) {
                deleteBtn.remove();
            }
        });
    }

    createDeleteButton(timerId) {
        const btn = document.createElement('button');
        btn.className = 'delete-timer';
        btn.setAttribute('data-timer-id', timerId);
        btn.setAttribute('title', 'Delete Timer');
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        btn.addEventListener('click', () => this.deleteTimer(timerId));
        return btn;
    }

    updateAddButton() {
        this.addBtn.style.display = this.timers.size >= this.MAX_TIMERS ? 'none' : 'flex';
    }

    handleModalClose() {
        const timerId = parseInt(this.modal.dataset.timerId);
        const timer = this.timers.get(timerId);
        
        if (timer) {
            timer.stopChiming();
            timer.resetTimer();
        }
        
        this.modal.style.display = 'none';
    }

    showModal(timerId) {
        this.modal.style.display = 'flex';
        this.modal.dataset.timerId = timerId;
    }
}