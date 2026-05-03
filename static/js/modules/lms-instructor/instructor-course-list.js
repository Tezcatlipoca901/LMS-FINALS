document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('sectionDropdown');
    const courseContainer = document.getElementById('courseContainer');
    const scheduleContainer = document.getElementById('scheduleContainer');
    const selectedValueLabel = document.getElementById('selected-value');

    // Modal Elements
    const courseModal = document.getElementById('courseModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalCourseCode = document.getElementById('modalCourseCode');
    const modalCourseName = document.getElementById('modalCourseName');
    const modalSchedule = document.getElementById('modalSchedule');
    
    // Modal action button
    const enterDashboardBtn = document.querySelector('.modal-btn');

    // 1. Data Structure
    const sectionData = {
        "BSIT 1-1": {
            courses: [
                { name: "Computer Programming 1", code: "COMP 201" },
                { name: "Introduction to Computing", code: "COMP 202" }
            ],
            schedule: [
                { day: "Monday", time: "08:00 AM - 11:00 AM", subject: "COMP 201", room: "Lab 1 (Main Bldg)" },
                { day: "Wednesday", time: "01:00 PM - 04:00 PM", subject: "COMP 202", room: "Lab 3 (Main Bldg)" }
            ]
        },
        "BSIT 2-1": {
            courses: [
                { name: "Object Oriented Programming", code: "COMP 209" },
                { name: "Pathfit 4: Physical Activity", code: "PATHFIT 4" }
            ],
            schedule: [
                { day: "Tuesday", time: "09:00 AM - 12:00 PM", subject: "COMP 209", room: "Lab 2 (Main Bldg)" },
                { day: "Friday", time: "07:00 AM - 09:00 AM", subject: "PATHFIT 4", room: "Gymnasium" }
            ]
        }
    };

    // Helper function to find a schedule string for the modal based on course code
    function getScheduleString(courseCode) {
        let foundSchedules = [];
        for (let section in sectionData) {
            let matches = sectionData[section].schedule.filter(s => s.subject === courseCode);
            foundSchedules = foundSchedules.concat(matches);
        }

        if (foundSchedules.length === 0) return "Schedule TBA";
        
        // Formats it like "MON 08:00 AM - 11:00 AM (Lab 1)"
        return foundSchedules.map(s => {
            let shortDay = s.day.substring(0, 3).toUpperCase();
            return `${shortDay} ${s.time} (${s.room})`;
        }).join(' & ');
    }

    // 2. Render Function
    function renderDashboard(section) {
        courseContainer.innerHTML = '';
        scheduleContainer.innerHTML = '';

        let coursesToRender = [];
        let schedulesToRender = [];

        if (section === "All") {
            for (let key in sectionData) {
                // BUG FIX: Map the section key to the course object so it remembers where it came from!
                let sectionCourses = sectionData[key].courses.map(course => ({ ...course, actualSection: key }));
                coursesToRender = coursesToRender.concat(sectionCourses);
                
                let sectionSchedules = sectionData[key].schedule.map(item => ({ ...item, sectionBadge: key }));
                schedulesToRender = schedulesToRender.concat(sectionSchedules);
            }
        } else {
            const data = sectionData[section];
            coursesToRender = data ? data.courses : [];
            schedulesToRender = data ? data.schedule : [];
        }

        // Render Schedule HTML
        if (schedulesToRender.length > 0) {
            schedulesToRender.forEach(item => {
                const badgeHTML = item.sectionBadge ? `<span style="background:#b08d57; color:#fff; padding:2px 6px; border-radius:4px; margin-left:8px; font-size:10px;">${item.sectionBadge}</span>` : '';
                const schedHTML = `
                    <div class="schedule-item">
                        <span class="sched-time">${item.day} | ${item.time} ${badgeHTML}</span>
                        <span class="sched-subject">${item.subject}</span>
                        <span class="sched-room">📍 ${item.room}</span>
                    </div>
                `;
                scheduleContainer.insertAdjacentHTML('beforeend', schedHTML);
            });
        } else {
            scheduleContainer.innerHTML = `<div class="empty-schedule">No schedules available.</div>`;
        }

        // Render Course Boxes HTML
        coursesToRender.forEach(course => {
            // BUG FIX: Use the actualSection we saved above, or fallback to the selected section
            const courseSection = course.actualSection || section; 
            
            const courseHTML = `
                <a href="#" class="course-box" data-code="${course.code}" data-name="${course.name}" data-section="${courseSection}">
                    <div class="course-name-section">
                        <span class="course-name">${course.name}</span>
                    </div>
                    <div class="course-code-section">
                        <span class="course-code-text">COURSE CODE: ${course.code}</span>
                    </div>
                </a>
            `;
            courseContainer.insertAdjacentHTML('beforeend', courseHTML);
        });
    }

    // 3. Dropdown Logic
    if (dropdown) {
        const header = dropdown.querySelector('.dropdown-header');
        const listItems = dropdown.querySelectorAll('.dropdown-list li');

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        listItems.forEach(item => {
            item.addEventListener('click', () => {
                const newValue = item.getAttribute('data-value');
                selectedValueLabel.innerText = item.innerText; 
                dropdown.classList.remove('active');
                renderDashboard(newValue);
            });
        });

        window.addEventListener('click', (e) => {
            if (dropdown.classList.contains('active') && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // 4. Modal & LocalStorage Logic
    let currentSelectedCourse = {}; // Holds data temporarily

    // Listen for clicks on the course container
    courseContainer.addEventListener('click', (e) => {
        const clickedBox = e.target.closest('.course-box');
        
        if (clickedBox) {
            e.preventDefault(); 
            
            // Get data from the clicked box
            const code = clickedBox.getAttribute('data-code');
            const name = clickedBox.getAttribute('data-name');
            const section = clickedBox.getAttribute('data-section');
            const scheduleString = getScheduleString(code);

            // Save data to our temporary variable
            currentSelectedCourse = {
                code: code,
                name: name,
                section: section,
                schedule: scheduleString
            };

            // Populate Modal
            modalCourseCode.innerText = code;
            modalCourseName.innerText = name;
            modalSchedule.innerText = scheduleString;

            // Show Modal
            courseModal.classList.add('active');
        }
    });

    // Close Modal via 'X' button
    closeModalBtn.addEventListener('click', () => {
        courseModal.classList.remove('active');
    });

    // Close Modal by clicking outside of the box
    courseModal.addEventListener('click', (e) => {
        if (e.target === courseModal) {
            courseModal.classList.remove('active');
        }
    });

    // Handle clicking the "Enter Full Course Dashboard" button
    if (enterDashboardBtn) {
        enterDashboardBtn.addEventListener('click', () => {
            // Save the selected course to the browser's memory
            localStorage.setItem('puplms_current_course', JSON.stringify(currentSelectedCourse));
            
            // Redirect to the overview page
            window.location.href = 'course-overview.html';
        });
    }

    // Initial Load
    renderDashboard("All");
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
