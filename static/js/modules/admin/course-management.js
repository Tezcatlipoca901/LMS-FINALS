// Admin course management (add, edit, delete courses)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const AdminCourseManagement = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const modals = ['addCourseModal', 'editCourseModal', 'deleteCourseModal'];
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
  
  // Add Course
  openAddCourseModal() {
    const fields = ['addCourseCode', 'addCourseName', 'addCourseUnits', 'addCourseDept'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    
    const modal = document.getElementById('addCourseModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeAddCourseModal() {
    const modal = document.getElementById('addCourseModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmAddCourse() {
    const code = document.getElementById('addCourseCode')?.value.trim() || '';
    const name = document.getElementById('addCourseName')?.value.trim() || '';
    const units = document.getElementById('addCourseUnits')?.value.trim() || '';
    const dept = document.getElementById('addCourseDept')?.value.trim() || '';
    
    if (!code || !name || !units || !dept) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const btn = document.querySelector('#addCourseModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Course Added (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeAddCourseModal();
    }, 2000);
  },
  
  // Edit Course
  openEditCourseModal(code, name, units, dept) {
    setText(document.getElementById('editCourseCode'), code);
    setText(document.getElementById('editCourseName'), name);
    setText(document.getElementById('editCourseUnits'), units);
    setText(document.getElementById('editCourseDept'), dept);
    
    const modal = document.getElementById('editCourseModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEditCourseModal() {
    const modal = document.getElementById('editCourseModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmEditCourse() {
    const code = document.getElementById('editCourseCode')?.value.trim() || '';
    const name = document.getElementById('editCourseName')?.value.trim() || '';
    const units = document.getElementById('editCourseUnits')?.value.trim() || '';
    const dept = document.getElementById('editCourseDept')?.value.trim() || '';
    
    if (!code || !name || !units || !dept) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const btn = document.querySelector('#editCourseModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Changes Saved (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeEditCourseModal();
    }, 2000);
  },
  
  // Delete Course
  openDeleteCourseModal(code, name) {
    setText(document.getElementById('deleteCourseCode'), code);
    setText(document.getElementById('deleteCourseName'), name);
    
    const modal = document.getElementById('deleteCourseModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeDeleteCourseModal() {
    const modal = document.getElementById('deleteCourseModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmDeleteCourse() {
    const btn = document.querySelector('#deleteCourseModal .btn-reject');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Deleted (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeDeleteCourseModal();
    }, 2000);
  }
};

// Global functions
window.openAddCourseModal = () => AdminCourseManagement.openAddCourseModal();
window.closeAddCourseModal = () => AdminCourseManagement.closeAddCourseModal();
window.confirmAddCourse = () => AdminCourseManagement.confirmAddCourse();
window.openEditCourseModal = (code, name, units, dept) => AdminCourseManagement.openEditCourseModal(code, name, units, dept);
window.closeEditCourseModal = () => AdminCourseManagement.closeEditCourseModal();
window.confirmEditCourse = () => AdminCourseManagement.confirmEditCourse();
window.openDeleteCourseModal = (code, name) => AdminCourseManagement.openDeleteCourseModal(code, name);
window.closeDeleteCourseModal = () => AdminCourseManagement.closeDeleteCourseModal();
window.confirmDeleteCourse = () => AdminCourseManagement.confirmDeleteCourse();