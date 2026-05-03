document.addEventListener("DOMContentLoaded", () => {
    let timeRemaining = 15 * 60; // 15 minutes (change 15 to whatever you need)
    const timerDisplay = document.getElementById("time-display");
    const quizForm = document.getElementById("seatwork-form");
    const successMsg = document.getElementById("seatwork-success");
    const successTitle = document.getElementById("success-title");

    // Timer Logic
    const interval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;
        
        // Add a zero if seconds are under 10 (e.g., 9 becomes 09)
        if (seconds < 10) seconds = '0' + seconds;
        
        timerDisplay.textContent = `${minutes}:${seconds}`;

        // When time is up
        if (timeRemaining <= 0) {
            clearInterval(interval);
            autoSubmit();
        }
    }, 1000); // 1000 milliseconds = 1 second

    function autoSubmit() {
        quizForm.style.display = "none";
        successTitle.textContent = "Time's up! Quiz Submitted Automatically.";
        successMsg.style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Manual Submit Button Logic
    const submitBtn = document.querySelector(".submit-seatwork-btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            clearInterval(interval); // Stop the timer
            quizForm.style.display = "none";
            successTitle.textContent = "Quiz Submitted Successfully!";
            successMsg.style.display = "block";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

(function () {
  function buildMobileNav() {
    if (document.querySelector('.mobile-topbar')) return;
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // --- Top bar ---
    const topbar = document.createElement('div');
    topbar.className = 'mobile-topbar';

    const logoImgEl  = sidebar.querySelector('.sidebar-logo-icon img');
    const logoTextEl = sidebar.querySelector('.sidebar-logo-text strong');
    const logoWrap   = document.createElement('div');
    logoWrap.className = 'mobile-topbar-logo';
    if (logoImgEl) {
      const img = document.createElement('img');
      img.src = logoImgEl.src;
      logoWrap.appendChild(img);
    }
    const logoSpan = document.createElement('span');
    logoSpan.textContent = logoTextEl ? logoTextEl.textContent : 'PUPSIS';
    logoWrap.appendChild(logoSpan);

    const burger = document.createElement('button');
    burger.className = 'mobile-hamburger';
    burger.setAttribute('aria-label', 'Toggle navigation');
    burger.innerHTML = '<span></span><span></span><span></span>';

    topbar.appendChild(logoWrap);
    topbar.appendChild(burger);
    document.body.appendChild(topbar);

    // --- Dropdown ---
    const dropdown = document.createElement('div');
    dropdown.className = 'mobile-nav-dropdown';

    sidebar.querySelectorAll('.nav-item').forEach(item => {
      const link = document.createElement('a');
      link.className = 'nav-link' + (item.classList.contains('active-nav') ? ' active-nav' : '');
      link.textContent = item.textContent.trim();
      link.href = '#';
      link.addEventListener('click', (e) => { e.preventDefault(); item.click(); close(); });
      dropdown.appendChild(link);
    });

    const logoutBtn = sidebar.querySelector('.logout-btn');
    if (logoutBtn) {
      const logoutLink = document.createElement('a');
      logoutLink.className = 'nav-link nav-logout';
      logoutLink.textContent = logoutBtn.textContent.trim();
      logoutLink.href = '#';
      logoutLink.addEventListener('click', (e) => { e.preventDefault(); close(); logoutBtn.click(); });
      dropdown.appendChild(logoutLink);
    }

    document.body.appendChild(dropdown);

    // --- Overlay ---
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);

    // --- Toggle ---
    function open() {
      dropdown.classList.add('open');
      overlay.classList.add('active');
      burger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      dropdown.classList.remove('open');
      overlay.classList.remove('active');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () =>
      dropdown.classList.contains('open') ? close() : open()
    );
    overlay.addEventListener('click', close);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', buildMobileNav)
    : buildMobileNav();
})();