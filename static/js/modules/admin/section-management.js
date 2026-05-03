// Admin section management (add, edit, delete sections)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const AdminSectionManagement = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const modals = ['addSectionModal', 'editSectionModal', 'deleteSectionModal'];
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
  
  // Add Section
  openAddSectionModal() {
    const fields = ['addSectionCode', 'addSectionCapacity'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    
    const yearSelect = document.getElementById('addSectionYear');
    if (yearSelect) yearSelect.selectedIndex = 0;
    
    const programSelect = document.getElementById('addSectionProgram');
    if (programSelect) programSelect.selectedIndex = 0;
    
    const modal = document.getElementById('addSectionModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeAddSectionModal() {
    const modal = document.getElementById('addSectionModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmAddSection() {
    const code = document.getElementById('addSectionCode')?.value.trim() || '';
    const year = document.getElementById('addSectionYear')?.value || '';
    const program = document.getElementById('addSectionProgram')?.value || '';
    const capacity = document.getElementById('addSectionCapacity')?.value.trim() || '';
    
    if (!code || !year || !program || !capacity) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (isNaN(capacity) || parseInt(capacity) <= 0) {
      alert('Please enter a valid capacity number.');
      return;
    }
    
    const btn = document.querySelector('#addSectionModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Section Added (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeAddSectionModal();
    }, 2000);
  },
  
  // Edit Section
  openEditSectionModal(code, year, program, capacity, enrolled) {
    setText(document.getElementById('editSectionCode'), code);
    setText(document.getElementById('editSectionCapacity'), capacity);
    setText(document.getElementById('editSectionEnrolled'), enrolled);
    
    const yearSelect = document.getElementById('editSectionYear');
    if (yearSelect) {
      for (let i = 0; i < yearSelect.options.length; i++) {
        if (yearSelect.options[i].value === year) {
          yearSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const programSelect = document.getElementById('editSectionProgram');
    if (programSelect) {
      for (let i = 0; i < programSelect.options.length; i++) {
        if (programSelect.options[i].value === program) {
          programSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const modal = document.getElementById('editSectionModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEditSectionModal() {
    const modal = document.getElementById('editSectionModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmEditSection() {
    const code = document.getElementById('editSectionCode')?.value.trim() || '';
    const year = document.getElementById('editSectionYear')?.value || '';
    const program = document.getElementById('editSectionProgram')?.value || '';
    const capacity = document.getElementById('editSectionCapacity')?.value.trim() || '';
    
    if (!code || !year || !program || !capacity) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (isNaN(capacity) || parseInt(capacity) <= 0) {
      alert('Please enter a valid capacity number.');
      return;
    }
    
    const btn = document.querySelector('#editSectionModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Changes Saved (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeEditSectionModal();
    }, 2000);
  },
  
  // Delete Section
  openDeleteSectionModal(code, program) {
    setText(document.getElementById('deleteSectionCode'), code);
    setText(document.getElementById('deleteSectionProgram'), program);
    
    const modal = document.getElementById('deleteSectionModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeDeleteSectionModal() {
    const modal = document.getElementById('deleteSectionModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmDeleteSection() {
    const btn = document.querySelector('#deleteSectionModal .btn-reject');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Deleted (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeDeleteSectionModal();
    }, 2000);
  }
};

// Global functions
window.openAddSectionModal = () => AdminSectionManagement.openAddSectionModal();
window.closeAddSectionModal = () => AdminSectionManagement.closeAddSectionModal();
window.confirmAddSection = () => AdminSectionManagement.confirmAddSection();
window.openEditSectionModal = (code, year, program, capacity, enrolled) => 
  AdminSectionManagement.openEditSectionModal(code, year, program, capacity, enrolled);
window.closeEditSectionModal = () => AdminSectionManagement.closeEditSectionModal();
window.confirmEditSection = () => AdminSectionManagement.confirmEditSection();
window.openDeleteSectionModal = (code, program) => AdminSectionManagement.openDeleteSectionModal(code, program);
window.closeDeleteSectionModal = () => AdminSectionManagement.closeDeleteSectionModal();
window.confirmDeleteSection = () => AdminSectionManagement.confirmDeleteSection();