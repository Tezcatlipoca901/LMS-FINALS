// Admin academic calendar management
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';
import { formatDate } from '../../core/utils.js';

export const AdminCalendar = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const modal = document.getElementById('updateCalendarModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeUpdateCalendarModal();
      });
    }
  },
  
  openUpdateCalendarModal() {
    const year = document.getElementById('academicYear')?.value || '';
    const sem = document.getElementById('semester')?.value || '';
    const start = document.getElementById('startDate')?.value || '';
    const end = document.getElementById('endDate')?.value || '';
    
    if (!year || !sem || !start || !end) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (new Date(start) >= new Date(end)) {
      alert('End date must be after the start date.');
      return;
    }
    
    const semLabels = {
      "1st": "1st Semester",
      "2nd": "2nd Semester",
      "summer": "Summer"
    };
    
    const calSummaryYear = document.getElementById('calSummaryYear');
    const calSummarySem = document.getElementById('calSummarySem');
    const calSummaryStart = document.getElementById('calSummaryStart');
    const calSummaryEnd = document.getElementById('calSummaryEnd');
    
    if (calSummaryYear) calSummaryYear.textContent = 'A.Y. ' + year;
    if (calSummarySem) calSummarySem.textContent = semLabels[sem] || sem;
    if (calSummaryStart) calSummaryStart.textContent = formatDate(start);
    if (calSummaryEnd) calSummaryEnd.textContent = formatDate(end);
    
    const modal = document.getElementById('updateCalendarModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeUpdateCalendarModal() {
    const modal = document.getElementById('updateCalendarModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmUpdateCalendar() {
    const btn = document.querySelector('#updateCalendarModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Calendar Updated (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeUpdateCalendarModal();
    }, 2000);
  }
};

// Global functions
window.openUpdateCalendarModal = () => AdminCalendar.openUpdateCalendarModal();
window.closeUpdateCalendarModal = () => AdminCalendar.closeUpdateCalendarModal();
window.confirmUpdateCalendar = () => AdminCalendar.confirmUpdateCalendar();