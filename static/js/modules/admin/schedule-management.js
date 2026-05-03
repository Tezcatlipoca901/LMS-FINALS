// Admin schedule management (create, edit, delete schedules)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const AdminScheduleManagement = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    // Create schedule form
    const createForm = document.getElementById('createScheduleForm');
    if (createForm) {
      createForm.addEventListener('submit', (e) => this.handleCreateSchedule(e));
    }
    
    // Assign course form
    const assignForm = document.getElementById('assignCourseForm');
    if (assignForm) {
      assignForm.addEventListener('submit', (e) => this.handleAssignCourse(e));
    }
    
    // Modal close events
    const modals = ['editScheduleModal', 'deleteScheduleModal'];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            const closeFn = this[`close${modalId.charAt(0).toUpperCase() + modalId.slice(1)}`];
            if (closeFn) closeFn.call(this);
          }
        });
      }
    });
  },
  
  // Create Schedule
  handleCreateSchedule(e) {
    e.preventDefault();
    
    const courseSelect = document.getElementById('schedCourse');
    const sectionSelect = document.getElementById('schedSection');
    const instructorSelect = document.getElementById('schedInstructor');
    const daySelect = document.getElementById('schedDay');
    const startTime = document.getElementById('schedStartTime');
    const endTime = document.getElementById('schedEndTime');
    const roomSelect = document.getElementById('schedRoom');
    const notif = document.getElementById('createScheduleNotif');
    
    const showNotif = (message, isSuccess) => {
      if (!notif) return;
      notif.textContent = message;
      notif.style.background = isSuccess ? '#d4edda' : '#f8d7da';
      notif.style.color = isSuccess ? '#155724' : '#721c24';
      notif.style.display = 'block';
      notif.classList.remove('hide');
      
      setTimeout(() => {
        notif.classList.add('hide');
        setTimeout(() => {
          notif.style.display = 'none';
          notif.classList.remove('hide');
        }, 500);
      }, 3500);
    };
    
    if (
      !courseSelect?.value ||
      !sectionSelect?.value ||
      !instructorSelect?.value ||
      !daySelect?.value ||
      !startTime?.value.trim() ||
      !endTime?.value.trim() ||
      !roomSelect?.value
    ) {
      showNotif('⚠ Please fill in all required fields.', false);
      return;
    }
    
    const courseText = courseSelect.options[courseSelect.selectedIndex]?.text || '';
    const sectionText = sectionSelect.options[sectionSelect.selectedIndex]?.text || '';
    const instructorText = instructorSelect.options[instructorSelect.selectedIndex]?.text || '';
    const dayText = daySelect.options[daySelect.selectedIndex]?.text || '';
    const roomText = roomSelect.options[roomSelect.selectedIndex]?.text || '';
    
    showNotif(
      `Schedule created — ${courseText} for ${sectionText} with ${instructorText} on ${dayText}, ${startTime.value.trim()} - ${endTime.value.trim()} at ${roomText}.`,
      true
    );
    
    const form = e.target;
    if (form) form.reset();
  },
  
  // Assign Course to Instructor
  handleAssignCourse(e) {
    e.preventDefault();
    
    const instructorSelect = document.getElementById('selectInstructor');
    const courseSelect = document.getElementById('selectCourse');
    const sectionSelect = document.getElementById('selectSection');
    const notif = document.getElementById('assignCourseNotif');
    
    const showNotif = (message, isSuccess) => {
      if (!notif) return;
      notif.textContent = message;
      notif.style.background = isSuccess ? '#d4edda' : '#f8d7da';
      notif.style.color = isSuccess ? '#155724' : '#721c24';
      notif.style.display = 'block';
      notif.classList.remove('hide');
      
      setTimeout(() => {
        notif.classList.add('hide');
        setTimeout(() => {
          notif.style.display = 'none';
          notif.classList.remove('hide');
        }, 500);
      }, 3500);
    };
    
    const instructor = instructorSelect?.value || '';
    const course = courseSelect?.value || '';
    const section = sectionSelect?.value || '';
    
    if (!instructor || !course || !section) {
      showNotif('⚠ Please fill in all required fields.', false);
      return;
    }
    
    const instructorText = instructorSelect.options[instructorSelect.selectedIndex]?.text || '';
    const courseText = courseSelect.options[courseSelect.selectedIndex]?.text || '';
    
    showNotif(
      `${instructorText} has been successfully assigned to ${courseText} — Section ${section}.`,
      true
    );
    
    const form = e.target;
    if (form) form.reset();
  },
  
  // Edit Schedule
  openEditScheduleModal(course, section, instructor, day, startTime, endTime, room) {
    const setSelect = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      for (let i = 0; i < el.options.length; i++) {
        if (el.options[i].value === value) {
          el.selectedIndex = i;
          break;
        }
      }
    };
    
    setSelect('editSchedCourse', course);
    setSelect('editSchedSection', section);
    setSelect('editSchedInstructor', instructor);
    setSelect('editSchedDay', day);
    setSelect('editSchedRoom', room);
    
    const startTimeInput = document.getElementById('editSchedStartTime');
    const endTimeInput = document.getElementById('editSchedEndTime');
    if (startTimeInput) startTimeInput.value = startTime;
    if (endTimeInput) endTimeInput.value = endTime;
    
    const notif = document.getElementById('editScheduleNotif');
    if (notif) {
      notif.style.display = 'none';
      notif.classList.remove('hide');
    }
    
    const modal = document.getElementById('editScheduleModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEditScheduleModal() {
    const modal = document.getElementById('editScheduleModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmEditSchedule() {
    const course = document.getElementById('editSchedCourse')?.value || '';
    const section = document.getElementById('editSchedSection')?.value || '';
    const instructor = document.getElementById('editSchedInstructor')?.value || '';
    const day = document.getElementById('editSchedDay')?.value || '';
    const startTime = document.getElementById('editSchedStartTime')?.value.trim() || '';
    const endTime = document.getElementById('editSchedEndTime')?.value.trim() || '';
    const room = document.getElementById('editSchedRoom')?.value || '';
    const notif = document.getElementById('editScheduleNotif');
    
    const showNotif = (message, isSuccess) => {
      if (!notif) return;
      notif.textContent = message;
      notif.style.background = isSuccess ? '#d4edda' : '#f8d7da';
      notif.style.color = isSuccess ? '#155724' : '#721c24';
      notif.style.display = 'block';
      notif.classList.remove('hide');
      
      setTimeout(() => {
        notif.classList.add('hide');
        setTimeout(() => {
          notif.style.display = 'none';
          notif.classList.remove('hide');
        }, 500);
      }, 3500);
    };
    
    if (!course || !section || !instructor || !day || !startTime || !endTime || !room) {
      showNotif('⚠ Please fill in all required fields.', false);
      return;
    }
    
    const btn = document.querySelector('#editScheduleModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Changes Saved (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeEditScheduleModal();
    }, 2000);
  },
  
  // Delete Schedule
  openDeleteScheduleModal(course, section, instructor, day, time, room) {
    setText(document.getElementById('deleteSchedCourse'), course);
    setText(document.getElementById('deleteSchedSection'), section);
    setText(document.getElementById('deleteSchedInstructor'), instructor);
    setText(document.getElementById('deleteSchedDay'), day);
    setText(document.getElementById('deleteSchedTime'), time);
    setText(document.getElementById('deleteSchedRoom'), room);
    
    const modal = document.getElementById('deleteScheduleModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeDeleteScheduleModal() {
    const modal = document.getElementById('deleteScheduleModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmDeleteSchedule() {
    const btn = document.querySelector('#deleteScheduleModal .btn-reject');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Deleted (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeDeleteScheduleModal();
    }, 2000);
  }
};

// Global functions
window.openEditScheduleModal = (course, section, instructor, day, startTime, endTime, room) => 
  AdminScheduleManagement.openEditScheduleModal(course, section, instructor, day, startTime, endTime, room);
window.closeEditScheduleModal = () => AdminScheduleManagement.closeEditScheduleModal();
window.confirmEditSchedule = () => AdminScheduleManagement.confirmEditSchedule();
window.openDeleteScheduleModal = (course, section, instructor, day, time, room) => 
  AdminScheduleManagement.openDeleteScheduleModal(course, section, instructor, day, time, room);
window.closeDeleteScheduleModal = () => AdminScheduleManagement.closeDeleteScheduleModal();
window.confirmDeleteSchedule = () => AdminScheduleManagement.confirmDeleteSchedule();