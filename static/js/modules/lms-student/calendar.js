document.addEventListener('DOMContentLoaded', () => {
  // --- ROLE SETUP ---
  // Get the role from the body tag (e.g., <body data-role="faculty">) or default to 'user'
  const currentRole = document.body.dataset.role || 'user';
  // Create a dynamic storage key so events don't mix between roles
  const storageKey = `pupCalendarEvents_${currentRole}`;

  const monthDisplay = document.getElementById('month-display');
  const calendarGrid = document.getElementById('calendar-grid');
  const prevButton = document.getElementById('prev-month');
  const nextButton = document.getElementById('next-month');

  const selectedDateDisplay = document.getElementById('selected-date-display');
  const eventList = document.getElementById('event-list');
  const eventTitleInput = document.getElementById('event-title');
  const eventTimeInput = document.getElementById('event-time');
  const iosTimeModal = document.getElementById('ios-time-modal');
  const wheelHours = document.getElementById('wheel-hours');
  const wheelMinutes = document.getElementById('wheel-minutes');
  const wheelAmPm = document.getElementById('wheel-ampm');

  // Add a role-specific class to the main event container for custom CSS styling
  eventList.classList.add(`event-list-${currentRole}`);

  // Populate Hours (01-12)
  for (let i = 1; i <= 12; i++) {
    let li = document.createElement('li');
    li.textContent = i.toString().padStart(2, '0');
    wheelHours.appendChild(li);
  }

  // Populate Minutes (00-59)
  for (let i = 0; i < 60; i++) {
    let li = document.createElement('li');
    li.textContent = i.toString().padStart(2, '0');
    wheelMinutes.appendChild(li);
  }

  // Open the wheel picker when clicking the input
  eventTimeInput.addEventListener('click', () => {
    iosTimeModal.classList.add('active');
  });

  // Close without saving
  document.getElementById('ios-time-cancel').addEventListener('click', () => {
    iosTimeModal.classList.remove('active');
  });

  // Save the selected time
  document.getElementById('ios-time-done').addEventListener('click', () => {
    const hIndex = Math.round(wheelHours.scrollTop / 36);
    const mIndex = Math.round(wheelMinutes.scrollTop / 36);
    const aIndex = Math.round(wheelAmPm.scrollTop / 36);

    const h = wheelHours.children[hIndex].textContent;
    const m = wheelMinutes.children[mIndex].textContent;
    const a = wheelAmPm.children[aIndex].textContent;

    eventTimeInput.value = `${h}:${m} ${a}`;

    let hour24 = parseInt(h);
    if (a === 'PM' && hour24 !== 12) hour24 += 12;
    if (a === 'AM' && hour24 === 12) hour24 = 0;
    eventTimeInput.dataset.time24 = `${hour24.toString().padStart(2, '0')}:${m}`;

    iosTimeModal.classList.remove('active');
  });

  const addEventBtn = document.getElementById('add-event-btn');

  // Custom Alert Modal Elements
  const customAlertModal = document.getElementById('custom-alert-modal');
  const customAlertMessage = document.getElementById('custom-alert-message');
  const closeAlertBtn = document.querySelector('.close-alert-btn');
  const alertOkBtn = document.querySelector('.alert-ok-btn');

  // Initialize dates
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let selectedDate = new Date(currentYear, currentMonth, currentDate.getDate());

  // --- MIGRATE legacy localStorage data ---
  function decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  function migrateDisplayTimeTo24h(displayTime) {
    if (!displayTime) return '';
    if (/^\d{2}:\d{2}$/.test(displayTime)) return displayTime;
    const match = displayTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return '';
    let h = parseInt(match[1]);
    const m = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
  }

  // Use the dynamic storage key
  const rawEvents = JSON.parse(localStorage.getItem(storageKey)) || {};
  let migrated = false;
  for (const key in rawEvents) {
    rawEvents[key] = rawEvents[key].map(ev => {
      const cleanTitle = decodeHTMLEntities(ev.title);
      const cleanTime = migrateDisplayTimeTo24h(ev.time);
      if (cleanTitle !== ev.title || cleanTime !== ev.time) migrated = true;
      return { title: cleanTitle, time: cleanTime };
    });
  }
  if (migrated) localStorage.setItem(storageKey, JSON.stringify(rawEvents));
  const events = rawEvents;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function showAlert(message) {
    customAlertMessage.textContent = message;
    customAlertModal.classList.add('active');
  }

  function hideAlert() {
    customAlertModal.classList.remove('active');
  }

  closeAlertBtn.addEventListener('click', hideAlert);
  alertOkBtn.addEventListener('click', hideAlert);

  function renderCalendar() {
    calendarGrid.innerHTML = '';
    monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.classList.add('calendar-day-name');
      dayEl.textContent = day;
      calendarGrid.appendChild(dayEl);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = firstDay; i > 0; i--) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('calendar-day', 'muted');
      dayEl.textContent = daysInPrevMonth - i + 1;
      calendarGrid.appendChild(dayEl);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('calendar-day');
      dayEl.textContent = i;
      const dayKey = `${currentYear}-${currentMonth}-${i}`;

      if (i === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
        dayEl.classList.add('today');
      }

      if (i === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear()) {
        dayEl.classList.add('selected');
      }

      // Add role class to the event dots container on the calendar grid too
      if (events[dayKey] && events[dayKey].length > 0) {
        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('day-events-container', `dots-${currentRole}`);
        const count = events[dayKey].length;
        const maxDots = 4;
        const dotsToShow = Math.min(count, maxDots);
        for (let d = 0; d < dotsToShow; d++) {
          const dot = document.createElement('div');
          dot.classList.add('calendar-event-dot');
          eventsContainer.appendChild(dot);
        }
        if (count > maxDots) {
          const overflow = document.createElement('span');
          overflow.classList.add('calendar-event-overflow');
          overflow.textContent = `+${count - maxDots}`;
          eventsContainer.appendChild(overflow);
        }
        dayEl.appendChild(eventsContainer);
      }

      dayEl.addEventListener('click', () => {
        selectedDate = new Date(currentYear, currentMonth, i);
        renderCalendar();
        renderEvents();
      });

      calendarGrid.appendChild(dayEl);
    }

    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('calendar-day', 'muted');
      dayEl.textContent = i;
      calendarGrid.appendChild(dayEl);
    }
  }

  function formatTime(timeString) {
    if (!timeString) return "All day";
    const [hourStr, minute] = timeString.split(':');
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  function renderEvents() {
    const dayKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    selectedDateDisplay.textContent = formattedDate;

    eventList.innerHTML = ''; 
    const dayEvents = events[dayKey] || [];

    if (dayEvents.length === 0) {
      const noEventsMsg = document.createElement('div');
      noEventsMsg.classList.add('no-events-msg');
      noEventsMsg.textContent = 'No events scheduled.';
      eventList.appendChild(noEventsMsg);
    } else {
      dayEvents.sort((a, b) => a.time.localeCompare(b.time));

      dayEvents.forEach((event, index) => {
        const eventEl = document.createElement('div');
        // Add a role-specific class to individual event items
        eventEl.classList.add('event-item', `event-item-${currentRole}`);

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('event-item-info');

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('event-item-title');
        titleDiv.textContent = event.title;

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('event-item-time');
        timeDiv.textContent = formatTime(event.time);

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(timeDiv);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-event-btn');
        deleteBtn.innerHTML = '&times;'; 
        deleteBtn.title = "Delete Event";

        deleteBtn.addEventListener('click', () => {
          dayEvents.splice(index, 1);
          if (dayEvents.length === 0) delete events[dayKey];
          localStorage.setItem(storageKey, JSON.stringify(events));
          renderEvents();
          renderCalendar();
          showToast("Event removed.", "error");
        });

        eventEl.appendChild(infoDiv);
        eventEl.appendChild(deleteBtn);
        eventList.appendChild(eventEl);
      });
    }
  }

function addEvent() {
    const rawTitle = eventTitleInput.value.trim();
    const time = eventTimeInput.dataset.time24 || '';

    if (!rawTitle) {
      showAlert("Please enter an event title.");
      return;
    }

    const title = rawTitle;
    const dayKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

    if (!events[dayKey]) events[dayKey] = [];
    events[dayKey].push({ title, time });

    // Save to LocalStorage
    localStorage.setItem(storageKey, JSON.stringify(events));

    // Reset Inputs
    eventTitleInput.value = '';
    eventTimeInput.value = '';
    if (eventTimeInput.dataset) eventTimeInput.dataset.time24 = '';
    
    // Refresh UI
    renderEvents();
    renderCalendar();

    // ==========================================
    // TOAST TRIGGER: EVENT ADDED
    // ==========================================
    if (typeof showToast === 'function') {
        showToast("Event Added Successfully!", "success");
    }
  }
  prevButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  nextButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  addEventBtn.addEventListener('click', addEvent);
  eventTitleInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addEvent(); });
  eventTimeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addEvent(); });

  renderCalendar();
  renderEvents();
});

// --- ACCORDION LOGIC ---
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(acc => {
  acc.addEventListener('click', function() {
    this.classList.toggle('active');
    accordions.forEach(other => {
      if (other !== this) other.classList.remove('active');
    });
  });
});

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
            toast.remove();
        }, 250);
    }, 3000);
}

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