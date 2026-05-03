document.querySelectorAll('.open-assignment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const isSeatwork = (btn.getAttribute('data-target-url') || '').includes('seatwork');
        const timerBlock = document.getElementById('modal-timer-block');
        const timerDivider = document.getElementById('modal-timer-divider');
        if (timerBlock) timerBlock.style.display = isSeatwork ? 'none' : 'block';
        if (timerDivider) timerDivider.style.display = isSeatwork ? 'none' : 'block';
    });
});

