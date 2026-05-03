document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================
    // TAB SWITCHING LOGIC (Overview, Modules, Grades, etc.)
    // ==========================================================
    const tabs = document.querySelectorAll(".course-tab");
    const contents = document.querySelectorAll(".tab-content");
    
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"));
                contents.forEach(c => c.classList.remove("active"));
                tab.classList.add("active");
                
                const targetId = tab.getAttribute("data-target");
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            });
        });
    }

    // ==========================================================
    // COURSE PREVIEW MODAL LOGIC (For courses.html)
    // ==========================================================
    const courseCards = document.querySelectorAll(".preview-trigger");
    const courseModal = document.getElementById("course-modal");
    const closeModalBtn = document.querySelector(".close-modal");

    const modalTitle = document.getElementById("modal-title");
    const modalCode = document.getElementById("modal-code");
    const modalInstructor = document.getElementById("modal-instructor");
    const modalSchedule = document.getElementById("modal-schedule");
    const modalTask = document.getElementById("modal-task");

    if (courseCards.length > 0 && courseModal) {
        courseCards.forEach(card => {
            card.addEventListener("click", () => {
                const title = card.getAttribute("data-title") || "Course Title";
                const code = card.getAttribute("data-code") || "Code";
                const instructor = card.getAttribute("data-instructor") || "Instructor Name";
                const schedule = card.getAttribute("data-schedule") || "Schedule TBA";
                const task = card.getAttribute("data-task") || "No pending tasks";

                if (modalTitle) modalTitle.textContent = title;
                if (modalCode) modalCode.textContent = code;
                if (modalInstructor) modalInstructor.textContent = instructor;
                if (modalSchedule) modalSchedule.textContent = schedule;
                if (modalTask) modalTask.textContent = task;

                // Store course data so course-overview.html can read it
                sessionStorage.setItem("course_title", title);
                sessionStorage.setItem("course_code", code);
                sessionStorage.setItem("course_instructor", instructor);
                sessionStorage.setItem("course_email", card.getAttribute("data-email") || "");
                sessionStorage.setItem("course_schedule", schedule);

                courseModal.style.display = "flex"; 
            });
        });
    }

    if (closeModalBtn && courseModal) {
        closeModalBtn.addEventListener("click", () => {
            courseModal.style.display = "none";
        });
    }

    // ==========================================================
    // ASSIGNMENT & SEATWORK POP-UP LOGIC
    // ==========================================================
    const assignmentLinks = document.querySelectorAll(".open-assignment-btn");
    const standardModal = document.getElementById("assignment-modal");
    const seatworkModal = document.getElementById("seatwork-modal");
    const closeAssignmentBtn = document.getElementById("close-assignment-modal");
    const closeSeatworkBtn = document.getElementById("close-seatwork-modal");

    if (assignmentLinks.length > 0) {
        assignmentLinks.forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault(); 
                
                const type = this.getAttribute("data-type") || "standard";
                const title = this.getAttribute("data-title") || "Assignment";
                const due = this.getAttribute("data-due") || "Due Date";
                const points = this.getAttribute("data-points") || "Points";

                if (type === "quiz") {
                    if (document.getElementById("seatwork-title")) document.getElementById("seatwork-title").textContent = title;
                    if (document.getElementById("seatwork-due")) document.getElementById("seatwork-due").textContent = due;
                    if (document.getElementById("seatwork-points")) document.getElementById("seatwork-points").textContent = points;
                    
                    const targetUrl = this.getAttribute("data-target-url") || "/student/seatwork";
                    const startBtn = document.getElementById("modal-start-btn");
                    if (startBtn) {
                        startBtn.href = targetUrl;
                        startBtn.textContent = title.toLowerCase().includes("quiz") ? "Start Quiz" : "Start Seatwork";
                    }

                    if (seatworkModal) seatworkModal.style.display = "flex";
                    
                } else {
                    if (document.getElementById("dynamic-assignment-title")) document.getElementById("dynamic-assignment-title").textContent = title;
                    if (document.getElementById("dynamic-assignment-due")) document.getElementById("dynamic-assignment-due").textContent = due;
                    if (document.getElementById("dynamic-assignment-points")) document.getElementById("dynamic-assignment-points").textContent = points;
                    
                    if (standardModal) standardModal.style.display = "flex";
                }
            });
        });
    }

    if (closeAssignmentBtn && standardModal) closeAssignmentBtn.addEventListener("click", () => standardModal.style.display = "none");
    if (closeSeatworkBtn && seatworkModal) closeSeatworkBtn.addEventListener("click", () => seatworkModal.style.display = "none");

    // Unified window click listener to close whichever modal is open
    window.addEventListener("click", (e) => {
        if (standardModal && e.target === standardModal) standardModal.style.display = "none";
        if (seatworkModal && e.target === seatworkModal) seatworkModal.style.display = "none";
        if (courseModal && e.target === courseModal) courseModal.style.display = "none";
    });

    // ==========================================================
    // ASSIGNMENT UPLOAD & TIMESTAMP SUBMISSION LOGIC
    // ==========================================================
    const uploadBtnTrigger = document.getElementById("upload-btn-trigger");
    const fileUploadInput = document.getElementById("file-upload-input");
    const uploadedFileName = document.getElementById("uploaded-file-name");
    const submitAssignmentBtn = document.getElementById("submit-assignment-btn");
    const submissionStatus = document.getElementById("submission-status");

    if (uploadBtnTrigger && fileUploadInput) {
        uploadBtnTrigger.addEventListener("click", () => {
            fileUploadInput.click(); 
        });

        fileUploadInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                uploadedFileName.textContent = `Attached: ${e.target.files[0].name}`;
                uploadBtnTrigger.innerHTML = `<span class="plus-icon">&#8634;</span> Change File`;
            }
        });
    }

    if (submitAssignmentBtn && submissionStatus && fileUploadInput) {
        submitAssignmentBtn.addEventListener("click", () => {
            if (fileUploadInput.files.length === 0) {
                alert("Please upload a file before submitting the assignment.");
                return;
            }

            const now = new Date();
            const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
            
            const formattedDate = now.toLocaleDateString('en-US', dateOptions);
            const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

            submissionStatus.textContent = `Submitted on ${formattedDate} at ${formattedTime}`;
            submissionStatus.classList.remove("assigned");
            submissionStatus.classList.add("submitted"); 

            submitAssignmentBtn.textContent = "Turned In";
            submitAssignmentBtn.disabled = true;
            submitAssignmentBtn.style.opacity = "0.7";
            submitAssignmentBtn.style.cursor = "not-allowed";
            
            uploadBtnTrigger.disabled = true;
            uploadBtnTrigger.style.opacity = "0.5";
            uploadBtnTrigger.style.cursor = "not-allowed";
        });
    }

    // ==========================================================
    // GRADES CALCULATOR & TOGGLE LOGIC
    // ==========================================================
    const btnRaw = document.getElementById("view-raw");
    const btnPercent = document.getElementById("view-percent");
    const gradeRows = document.querySelectorAll(".grade-item");
    const finalGradeDisplay = document.getElementById("final-grade-display");
    
    let isPercentView = false;

    function calculateAndRenderGrades() {
        if (!gradeRows.length || !finalGradeDisplay) return;

        let totalEarned = 0;
        let totalPossible = 0;

        gradeRows.forEach(row => {
            const earnedStr = row.getAttribute("data-earned");
            const totalStr = row.getAttribute("data-total");
            const scoreCell = row.querySelector(".score-display");

            if (scoreCell) {
                if (earnedStr && earnedStr.trim() !== "") {
                    const earned = parseFloat(earnedStr);
                    const total = parseFloat(totalStr);

                    totalEarned += earned;
                    totalPossible += total;

                    if (isPercentView) {
                        const percent = ((earned / total) * 100).toFixed(1);
                        scoreCell.textContent = `${percent}%`;
                    } else {
                        scoreCell.textContent = `${earned}/${total}`;
                    }
                } else {
                    scoreCell.textContent = "-";
                }
            }
        });

        if (totalPossible > 0) {
            if (isPercentView) {
                const finalPercent = ((totalEarned / totalPossible) * 100).toFixed(1);
                finalGradeDisplay.innerHTML = `<strong>${finalPercent}%</strong>`;
            } else {
                finalGradeDisplay.innerHTML = `<strong>${totalEarned}/${totalPossible}</strong>`;
            }
        } else {
            finalGradeDisplay.innerHTML = `<strong>-</strong>`;
        }
    }

    if (btnRaw && btnPercent) {
        btnRaw.addEventListener("click", () => {
            isPercentView = false;
            btnRaw.classList.add("active");
            btnPercent.classList.remove("active");
            calculateAndRenderGrades();
        });

        btnPercent.addEventListener("click", () => {
            isPercentView = true;
            btnPercent.classList.add("active");
            btnRaw.classList.remove("active");
            calculateAndRenderGrades();
        });

        calculateAndRenderGrades();
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