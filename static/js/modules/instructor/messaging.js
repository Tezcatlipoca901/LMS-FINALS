// Instructor messaging system (messages, grade overrides, attendance overrides, leave)
import { $, addClass, removeClass, setText, showElement, hideElement } from '../../core/dom-helpers.js';

export const InstructorMessaging = {
  fieldMap: {
    "message": "instrFieldsMessage",
    "grade_override": "instrFieldsGradeOverride",
    "attendance_override": "instrFieldsAttOverride",
    "leave": "instrFieldsLeave"
  },
  
  submitLabels: {
    "message": "Send Message",
    "grade_override": "Submit Grade Override Request",
    "attendance_override": "Submit Attendance Override Request",
    "leave": "Submit Leave Application"
  },
  
  successMessages: {
    "message": "Message sent successfully! (Demo Only)",
    "grade_override": "Grade override request submitted successfully! The admin will review it shortly. (Demo Only)",
    "attendance_override": "Attendance override request submitted successfully! The admin will review it shortly. (Demo Only)",
    "leave": "Leave of absence application submitted successfully! The admin will review it shortly. (Demo Only)"
  },
  
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const form = document.getElementById('instrMessageForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    const typeSelect = document.getElementById('instrMsgType');
    if (typeSelect) {
      typeSelect.addEventListener('change', () => this.toggleFields());
    }
  },
  
  toggleFields() {
    const type = document.getElementById('instrMsgType')?.value || '';
    const submitBtn = document.getElementById('instrMsgSubmitBtn');
    
    // Hide all field groups
    Object.values(this.fieldMap).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    
    // Hide notif
    const notif = document.getElementById('instrMessageNotif');
    if (notif) notif.style.display = 'none';
    
    if (!type) {
      if (submitBtn) submitBtn.style.display = 'none';
      return;
    }
    
    // Show relevant fields
    const target = document.getElementById(this.fieldMap[type]);
    if (target) target.style.display = 'block';
    
    // Update and show submit button
    if (submitBtn) {
      submitBtn.textContent = this.submitLabels[type] || 'Send';
      submitBtn.style.display = 'block';
    }
  },
  
  validateAndSubmit(type) {
    const notif = document.getElementById('instrMessageNotif');
    
    const showNotif = (message, isSuccess) => {
      if (!notif) return;
      notif.textContent = message;
      notif.style.background = isSuccess ? '#d4edda' : '#f8d7da';
      notif.style.color = isSuccess ? '#155724' : '#721c24';
      notif.style.display = 'block';
      notif.classList.remove('hide');
      
      if (isSuccess) {
        setTimeout(() => {
          notif.classList.add('hide');
          setTimeout(() => {
            notif.style.display = 'none';
            notif.classList.remove('hide');
          }, 500);
        }, 4000);
      }
    };
    
    // Per-type validation
    if (type === 'message') {
      const to = document.getElementById('instrMsgTo')?.value.trim() || '';
      const subject = document.getElementById('instrMsgSubject')?.value.trim() || '';
      const body = document.getElementById('instrMsgBody')?.value.trim() || '';
      if (!to || !subject || !body) {
        showNotif('⚠ Please fill in all required fields.', false);
        return false;
      }
    }
    
    if (type === 'grade_override') {
      const studentNo = document.getElementById('instrGradeStudentNo')?.value.trim() || '';
      const studentName = document.getElementById('instrGradeStudentName')?.value.trim() || '';
      const course = document.getElementById('instrGradeCourse')?.value || '';
      const gradeType = document.getElementById('instrGradeType')?.value || '';
      const current = document.getElementById('instrGradeCurrent')?.value.trim() || '';
      const requested = document.getElementById('instrGradeRequested')?.value.trim() || '';
      const reason = document.getElementById('instrGradeReason')?.value.trim() || '';
      if (!studentNo || !studentName || !course || !gradeType || !current || !requested || !reason) {
        showNotif('⚠ Please fill in all required fields.', false);
        return false;
      }
    }
    
    if (type === 'attendance_override') {
      const studentNo = document.getElementById('instrAttStudentNo')?.value.trim() || '';
      const studentName = document.getElementById('instrAttStudentName')?.value.trim() || '';
      const course = document.getElementById('instrAttCourse')?.value || '';
      const date = document.getElementById('instrAttDate')?.value || '';
      const current = document.getElementById('instrAttCurrent')?.value || '';
      const requested = document.getElementById('instrAttRequested')?.value || '';
      const reason = document.getElementById('instrAttReason')?.value.trim() || '';
      if (!studentNo || !studentName || !course || !date || !current || !requested || !reason) {
        showNotif('⚠ Please fill in all required fields.', false);
        return false;
      }
    }
    
    if (type === 'leave') {
      const leaveType = document.getElementById('instrLeaveType')?.value || '';
      const start = document.getElementById('instrLeaveStart')?.value || '';
      const end = document.getElementById('instrLeaveEnd')?.value || '';
      const coverage = document.getElementById('instrLeaveCoverage')?.value || '';
      const reason = document.getElementById('instrLeaveReason')?.value.trim() || '';
      if (!leaveType || !start || !end || !coverage || !reason) {
        showNotif('⚠ Please fill in all required fields.', false);
        return false;
      }
      if (new Date(end) < new Date(start)) {
        showNotif('⚠ End date cannot be before the start date.', false);
        return false;
      }
    }
    
    return true;
  },
  
  handleSubmit(e) {
    e.preventDefault();
    
    const type = document.getElementById('instrMsgType')?.value || '';
    const submitBtn = document.getElementById('instrMsgSubmitBtn');
    const notif = document.getElementById('instrMessageNotif');
    
    if (!type) {
      if (notif) {
        notif.textContent = '⚠ Please select a message type.';
        notif.style.background = '#f8d7da';
        notif.style.color = '#721c24';
        notif.style.display = 'block';
      }
      return;
    }
    
    if (!this.validateAndSubmit(type)) return;
    
    if (!submitBtn) return;
    
    const original = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.textContent = original;
      submitBtn.disabled = false;
      
      if (notif) {
        notif.textContent = this.successMessages[type];
        notif.style.background = '#d4edda';
        notif.style.color = '#155724';
        notif.style.display = 'block';
        notif.classList.remove('hide');
      }
      
      // Reset form
      const form = document.getElementById('instrMessageForm');
      if (form) form.reset();
      
      const typeSelect = document.getElementById('instrMsgType');
      if (typeSelect) typeSelect.value = '';
      this.toggleFields();
      
      setTimeout(() => {
        if (notif) {
          notif.classList.add('hide');
          setTimeout(() => {
            if (notif) notif.style.display = 'none';
            if (notif) notif.classList.remove('hide');
          }, 500);
        }
      }, 4000);
    }, 1200);
  }
};

// Global functions
window.toggleInstrMessageFields = () => InstructorMessaging.toggleFields();