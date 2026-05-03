// Admin program management (add, edit, delete programs)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const AdminProgramManagement = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const modals = ['addProgramModal', 'editProgramModal', 'deleteProgramModal'];
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
  
  // Add Program
  openAddProgramModal() {
    const fields = ['addProgramCode', 'addProgramName', 'addProgramDept'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    
    const durationSelect = document.getElementById('addProgramDuration');
    if (durationSelect) durationSelect.selectedIndex = 0;
    
    const modal = document.getElementById('addProgramModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeAddProgramModal() {
    const modal = document.getElementById('addProgramModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmAddProgram() {
    const code = document.getElementById('addProgramCode')?.value.trim() || '';
    const name = document.getElementById('addProgramName')?.value.trim() || '';
    const dept = document.getElementById('addProgramDept')?.value.trim() || '';
    const duration = document.getElementById('addProgramDuration')?.value || '';
    
    if (!code || !name || !dept || !duration) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const btn = document.querySelector('#addProgramModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Program Added (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeAddProgramModal();
    }, 2000);
  },
  
  // Edit Program
  openEditProgramModal(code, name, dept, duration) {
    setText(document.getElementById('editProgramCode'), code);
    setText(document.getElementById('editProgramName'), name);
    setText(document.getElementById('editProgramDept'), dept);
    
    const durationSelect = document.getElementById('editProgramDuration');
    if (durationSelect) {
      for (let i = 0; i < durationSelect.options.length; i++) {
        if (durationSelect.options[i].value === duration) {
          durationSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const modal = document.getElementById('editProgramModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEditProgramModal() {
    const modal = document.getElementById('editProgramModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmEditProgram() {
    const code = document.getElementById('editProgramCode')?.value.trim() || '';
    const name = document.getElementById('editProgramName')?.value.trim() || '';
    const dept = document.getElementById('editProgramDept')?.value.trim() || '';
    const duration = document.getElementById('editProgramDuration')?.value || '';
    
    if (!code || !name || !dept || !duration) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const btn = document.querySelector('#editProgramModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Changes Saved (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeEditProgramModal();
    }, 2000);
  },
  
  // Delete Program
  openDeleteProgramModal(code, name) {
    setText(document.getElementById('deleteProgramCode'), code);
    setText(document.getElementById('deleteProgramName'), name);
    
    const modal = document.getElementById('deleteProgramModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeDeleteProgramModal() {
    const modal = document.getElementById('deleteProgramModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmDeleteProgram() {
    const btn = document.querySelector('#deleteProgramModal .btn-reject');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Deleted (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeDeleteProgramModal();
    }, 2000);
  }
};

// Global functions
window.openAddProgramModal = () => AdminProgramManagement.openAddProgramModal();
window.closeAddProgramModal = () => AdminProgramManagement.closeAddProgramModal();
window.confirmAddProgram = () => AdminProgramManagement.confirmAddProgram();
window.openEditProgramModal = (code, name, dept, duration) => AdminProgramManagement.openEditProgramModal(code, name, dept, duration);
window.closeEditProgramModal = () => AdminProgramManagement.closeEditProgramModal();
window.confirmEditProgram = () => AdminProgramManagement.confirmEditProgram();
window.openDeleteProgramModal = (code, name) => AdminProgramManagement.openDeleteProgramModal(code, name);
window.closeDeleteProgramModal = () => AdminProgramManagement.closeDeleteProgramModal();
window.confirmDeleteProgram = () => AdminProgramManagement.confirmDeleteProgram();