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
    // LIST DEADLINE CHECKER & STATUS UPDATER
    // ==========================================================
    function checkListDeadlines() {
        const assignmentLinks = document.querySelectorAll('.open-assignment-btn');
        const now = new Date();

        assignmentLinks.forEach(link => {
            const listItem = link.closest('li');
            if (!listItem) return;
            const statusBadge = listItem.querySelector('.list-status') || listItem.querySelector('strong');
            if (!statusBadge) return;

            const deadlineStr = link.getAttribute('data-deadline');
            const isSubmitted = link.getAttribute('data-submitted') === "true";

            if (!deadlineStr) return; 
            
            const deadlineDate = new Date(deadlineStr);

            if (isSubmitted) {
                statusBadge.textContent = "Submitted";
                statusBadge.style.color = "#28a745"; // Green
            } else if (now > deadlineDate) {
                statusBadge.textContent = "Closed";
                statusBadge.style.color = "#dc3545"; // Red
            } else {
                statusBadge.textContent = "Pending";
                statusBadge.style.color = "#b08d57"; // Yellow
            }
        });
    }

    checkListDeadlines();
    setInterval(checkListDeadlines, 1000);

    // ==========================================================
    // ASSIGNMENT & SEATWORK POP-UP LOGIC
    // ==========================================================
    const assignmentLinks = document.querySelectorAll(".open-assignment-btn");
    const standardModal = document.getElementById("assignment-modal");
    const seatworkModal = document.getElementById("seatwork-modal");
    const closeAssignmentBtn = document.getElementById("close-assignment-modal");
    const closeSeatworkBtn = document.getElementById("close-seatwork-modal");
    const submitAssignmentBtn = document.getElementById("submit-assignment-btn");
    
    // Core modal state trackers
    let isSubmitted = false; 
    let currentActiveAssignmentLink = null;

    if (assignmentLinks.length > 0) {
        assignmentLinks.forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault(); 
                
                currentActiveAssignmentLink = this;

                const type = this.getAttribute("data-type") || "standard";
                const title = this.getAttribute("data-title") || "Assignment";
                const due = this.getAttribute("data-due") || "Due Date";
                const points = this.getAttribute("data-points") || "Points";
                const deadline = this.getAttribute("data-deadline") || "2099-12-31T23:59:59";

                const deadlineDate = new Date(deadline);
                const now = new Date();
                const isClosed = now > deadlineDate;

                if (type === "quiz") {
                    if (document.getElementById("seatwork-title")) document.getElementById("seatwork-title").textContent = title;
                    if (document.getElementById("seatwork-due")) document.getElementById("seatwork-due").textContent = due;
                    if (document.getElementById("seatwork-points")) document.getElementById("seatwork-points").textContent = points;
                    
                    const targetUrl = this.getAttribute("data-target-url") || "/student/seatwork";
                    const startBtn = document.getElementById("modal-start-btn");
                    const seatworkInstructions = document.getElementById("seatwork-instructions");

                    if (startBtn) {
                        if (isClosed) {
                            startBtn.href = "#";
                            startBtn.textContent = "Closed (Deadline Passed)";
                            startBtn.style.background = "#6c757d"; // Gray background
                            startBtn.style.cursor = "not-allowed";
                            startBtn.style.pointerEvents = "none";
                            
                            if (seatworkInstructions) {
                                seatworkInstructions.innerHTML = "<strong style='color:#dc3545;'>This seatwork is no longer available.</strong> The deadline has passed.";
                            }
                        } else {
                            startBtn.href = targetUrl;
                            startBtn.textContent = title.toLowerCase().includes("quiz") ? "Start Quiz" : "Start Seatwork";
                            startBtn.style.background = "#800000"; // Red background
                            startBtn.style.cursor = "pointer";
                            startBtn.style.pointerEvents = "auto";
                            
                            if (seatworkInstructions) {
                                seatworkInstructions.innerHTML = "Please read each question carefully. You have <strong>1 attempt</strong> to submit this seatwork.";
                            }
                        }
                    }

                    if (seatworkModal) seatworkModal.style.display = "flex";
                    
                } else {
                    // It's a standard assignment upload
                    if (document.getElementById("dynamic-assignment-title")) document.getElementById("dynamic-assignment-title").textContent = title;
                    if (document.getElementById("dynamic-assignment-due")) document.getElementById("dynamic-assignment-due").textContent = due;
                    if (document.getElementById("dynamic-assignment-points")) document.getElementById("dynamic-assignment-points").textContent = points;
                    
                    // 1. Sync the modal state with the specific item clicked
                    isSubmitted = this.getAttribute("data-submitted") === "true";
                    const savedTime = this.getAttribute("data-submission-time") || "";
                    
                    if (submitAssignmentBtn) {
                        submitAssignmentBtn.setAttribute("data-deadline", deadline);
                    }

                    const uploadBtnTrigger = document.getElementById("upload-btn-trigger");
                    const fileUploadInput = document.getElementById("file-upload-input");
                    const uploadedFileName = document.getElementById("uploaded-file-name");
                    const submissionStatus = document.getElementById("submission-status");

                    // 2. Reset the file inputs completely when opening
                    if (fileUploadInput) fileUploadInput.value = "";
                    if (uploadedFileName) uploadedFileName.innerHTML = "";
                    if (uploadBtnTrigger) uploadBtnTrigger.innerHTML = `<span class="red-plus">+</span> Upload`;

                    // 3. Configure the UI based on its state
                    if (isSubmitted) {
                        // It was already submitted! Show the green UI
                        submissionStatus.innerHTML = `<strong>Submitted on ${savedTime}</strong>`;
                        submissionStatus.style.color = "white"; 
                        submissionStatus.classList.remove("assigned");
                        submissionStatus.classList.add("submitted"); 
                        
                        submitAssignmentBtn.textContent = "Undo Turn In";
                        submitAssignmentBtn.disabled = false;
                        submitAssignmentBtn.style.opacity = "1";
                        submitAssignmentBtn.style.cursor = "pointer";
                        
                        uploadBtnTrigger.disabled = true;
                        uploadBtnTrigger.style.opacity = "0.5";
                        uploadBtnTrigger.style.cursor = "not-allowed";

                    } else if (isClosed) {
                        // It was missed! Show the red UI
                        submissionStatus.innerHTML = `<strong>Auto-Submitted (No File)</strong>`;
                        submissionStatus.style.color = "#dc3545"; 
                        submissionStatus.classList.remove("assigned");
                        submissionStatus.classList.add("submitted"); 
                        
                        submitAssignmentBtn.textContent = "Deadline Passed";
                        submitAssignmentBtn.disabled = true;
                        submitAssignmentBtn.style.opacity = "0.7";
                        submitAssignmentBtn.style.cursor = "not-allowed";
                        
                        uploadBtnTrigger.disabled = true;
                        uploadBtnTrigger.style.opacity = "0.5";
                        uploadBtnTrigger.style.cursor = "not-allowed";
                        
                        uploadedFileName.innerHTML = `<span style="color: #dc3545; font-size: 13px; text-align: center; display: block; margin-top: 8px;">Deadline passed. Submission locked.</span>`;
                    } else {
                        // It is pending! Show the default UI
                        submissionStatus.textContent = "Assigned";
                        submissionStatus.style.color = ""; 
                        submissionStatus.classList.remove("submitted");
                        submissionStatus.classList.add("assigned"); 
                        
                        submitAssignmentBtn.textContent = "Submit";
                        submitAssignmentBtn.disabled = false;
                        submitAssignmentBtn.style.opacity = "1";
                        submitAssignmentBtn.style.cursor = "pointer";
                        
                        uploadBtnTrigger.disabled = false;
                        uploadBtnTrigger.style.opacity = "1";
                        uploadBtnTrigger.style.cursor = "pointer";
                    }

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
    const submissionStatus = document.getElementById("submission-status");

    // Background interval checker for an open modal
    function checkAndAutoSubmit() {
        if (!submitAssignmentBtn || !submissionStatus) return;
        const standardModal = document.getElementById("assignment-modal");
        
        // Only run the lock animation if the modal is currently open and looking at a pending assignment
        if (!standardModal || standardModal.style.display === "none") return;
        if (isSubmitted) return; 

        const deadlineString = submitAssignmentBtn.getAttribute("data-deadline") || "2099-12-31T23:59:59";
        const deadlineDate = new Date(deadlineString);
        const now = new Date();

        if (now > deadlineDate) {
            isSubmitted = true; // Lock it internally
            
            if (currentActiveAssignmentLink) {
                currentActiveAssignmentLink.setAttribute("data-submitted", "false");
            }

            submissionStatus.innerHTML = `<strong>Auto-Submitted (No File)</strong>`;
            submissionStatus.style.color = "#dc3545"; 
            submissionStatus.classList.remove("assigned");
            submissionStatus.classList.add("submitted"); 

            submitAssignmentBtn.textContent = "Deadline Passed";
            submitAssignmentBtn.disabled = true;
            submitAssignmentBtn.style.opacity = "0.7";
            submitAssignmentBtn.style.cursor = "not-allowed";
            
            if (uploadBtnTrigger) {
                uploadBtnTrigger.disabled = true;
                uploadBtnTrigger.style.opacity = "0.5";
                uploadBtnTrigger.style.cursor = "not-allowed";
            }
            
            if (uploadedFileName) {
                uploadedFileName.innerHTML = `<span style="color: #dc3545; font-size: 13px; text-align: center; display: block; margin-top: 8px;">Deadline passed. Submission locked.</span>`;
            }
        }
    }

    checkAndAutoSubmit();
    setInterval(checkAndAutoSubmit, 1000);


    if (uploadBtnTrigger && fileUploadInput) {
        uploadBtnTrigger.addEventListener("click", () => {
            if (!isSubmitted) fileUploadInput.click(); 
        });

        fileUploadInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const fileName = file.name;
                
                let iconName = "description"; 
                if (file.type.startsWith("image/")) iconName = "image";
                else if (file.type === "application/pdf") iconName = "picture_as_pdf";
                else if (file.type.startsWith("video/")) iconName = "movie";
                else if (file.type.startsWith("audio/")) iconName = "audiotrack";

                uploadedFileName.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <span class="material-icons" style="font-size: 18px;">${iconName}</span>
                        <span style="word-break: break-all;">${fileName}</span>
                    </div>
                `;
                
                uploadBtnTrigger.innerHTML = `<span class="plus-icon">&#8634;</span> Change File`;
            }
        });
    }

    if (submitAssignmentBtn && submissionStatus && fileUploadInput) {
        submitAssignmentBtn.addEventListener("click", () => {
            if (!isSubmitted) {
                if (fileUploadInput.files.length === 0) {
                    alert("Please upload a file before submitting the assignment.");
                    return;
                }

                const now = new Date();
                const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
                const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
                const formattedDate = now.toLocaleDateString('en-US', dateOptions);
                const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
                const fullTimeString = `${formattedDate} at ${formattedTime}`;

                // Mark the list item as officially submitted and save the time!
                if (currentActiveAssignmentLink) {
                    currentActiveAssignmentLink.setAttribute("data-submitted", "true");
                    currentActiveAssignmentLink.setAttribute("data-submission-time", fullTimeString);
                    checkListDeadlines(); 
                }

                submissionStatus.innerHTML = `<strong>Submitted on ${fullTimeString}</strong>`;
                submissionStatus.style.color = "white"; 
                submissionStatus.classList.remove("assigned");
                submissionStatus.classList.add("submitted"); 
                
                isSubmitted = true;

                submitAssignmentBtn.textContent = "Undo Turn In";
                uploadBtnTrigger.disabled = true;
                uploadBtnTrigger.style.opacity = "0.5";
                uploadBtnTrigger.style.cursor = "not-allowed";

            } else {
                // Remove the submitted state from the list item
                if (currentActiveAssignmentLink) {
                    currentActiveAssignmentLink.setAttribute("data-submitted", "false");
                    currentActiveAssignmentLink.removeAttribute("data-submission-time");
                    checkListDeadlines(); 
                }

                isSubmitted = false;
                
                submissionStatus.textContent = "Not Submitted";
                submissionStatus.classList.remove("submitted");
                submissionStatus.classList.add("assigned");
                submissionStatus.style.color = ""; 

                submitAssignmentBtn.textContent = "Submit Assignment";
                
                uploadBtnTrigger.disabled = false;
                uploadBtnTrigger.style.opacity = "1";
                uploadBtnTrigger.style.cursor = "pointer";
            }
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
