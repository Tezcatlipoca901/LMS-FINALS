// Instructor account management (edit info, change password)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const InstructorAccount = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    // Edit Info Modal
    const openBtn = document.getElementById('btnOpenEditInfoInstr');
    const modal = document.getElementById('editAccountModalInstr');
    const saveBtn = document.getElementById('editAccountSaveBtnInstr');
    const notifEl = document.getElementById('editAccountNotifInstr');
    
    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        if (notifEl) notifEl.style.display = 'none';
        addClass(modal, 'active');
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeEditModal();
      });
      
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveAccountInfo());
      }
    }
    
    // Change Password
    const changePwBtn = document.getElementById('changePwBtnInstr');
    if (changePwBtn) {
      changePwBtn.addEventListener('click', () => this.changePassword());
      
      const newPwInput = document.getElementById('newPassword');
      if (newPwInput) {
        newPwInput.addEventListener('input', () => this.checkPasswordStrength());
      }
    }
  },
  
  closeEditModal() {
    const modal = document.getElementById('editAccountModalInstr');
    if (modal) removeClass(modal, 'active');
  },
  
  saveAccountInfo() {
    const email = document.getElementById('editEmailInstr')?.value.trim() || '';
    const contact = document.getElementById('editContactInstr')?.value.trim() || '';
    const notifEl = document.getElementById('editAccountNotifInstr');
    const saveBtn = document.getElementById('editAccountSaveBtnInstr');
    
    if (!email || !contact) {
      if (notifEl) {
        notifEl.textContent = '⚠ Email and contact number are required.';
        notifEl.style.background = '#f8d7da';
        notifEl.style.color = '#721c24';
        notifEl.style.display = 'block';
      }
      return;
    }
    
    if (!saveBtn) return;
    
    const original = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    setTimeout(() => {
      saveBtn.textContent = original;
      saveBtn.disabled = false;
      
      if (notifEl) {
        notifEl.textContent = 'Account information updated successfully! (Demo Only)';
        notifEl.style.background = '#d4edda';
        notifEl.style.color = '#155724';
        notifEl.style.display = 'block';
        
        setTimeout(() => {
          this.closeEditModal();
          if (notifEl) notifEl.style.display = 'none';
        }, 1500);
      }
    }, 1000);
  },
  
  checkPasswordStrength() {
    const newPwInput = document.getElementById('newPassword');
    if (!newPwInput) return;
    
    const val = newPwInput.value;
    const wrapper = document.getElementById('pwStrengthWrapperInstr');
    const bar = document.getElementById('pwStrengthBarInstr');
    const label = document.getElementById('pwStrengthLabelInstr');
    
    if (!wrapper || !bar || !label) return;
    
    if (!val) {
      wrapper.style.display = 'none';
      return;
    }
    
    wrapper.style.display = 'block';
    
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    
    const levels = [
      { label: 'Weak', color: '#dc3545', width: '25%' },
      { label: 'Fair', color: '#ff5722', width: '50%' },
      { label: 'Good', color: '#daa520', width: '75%' },
      { label: 'Strong', color: '#28a745', width: '100%' }
    ];
    
    const level = levels[score - 1] || levels[0];
    bar.style.width = level.width;
    bar.style.background = level.color;
    label.textContent = level.label;
    label.style.color = level.color;
  },
  
  changePassword() {
    const current = document.getElementById('currentPassword')?.value.trim() || '';
    const newPass = document.getElementById('newPassword')?.value.trim() || '';
    const confirm = document.getElementById('confirmPassword')?.value.trim() || '';
    const notifEl = document.getElementById('changePwNotifInstr');
    const changePwBtn = document.getElementById('changePwBtnInstr');
    
    const showNotif = (message, isSuccess) => {
      if (!notifEl) return;
      notifEl.textContent = message;
      notifEl.style.background = isSuccess ? '#d4edda' : '#f8d7da';
      notifEl.style.color = isSuccess ? '#155724' : '#721c24';
      notifEl.style.display = 'block';
    };
    
    if (!current || !newPass || !confirm) {
      showNotif('⚠ Please fill in all password fields.', false);
      return;
    }
    
    if (newPass.length < 8) {
      showNotif('⚠ Password must be at least 8 characters long.', false);
      return;
    }
    
    if (newPass !== confirm) {
      showNotif('⚠ New password and confirmation do not match.', false);
      return;
    }
    
    if (!changePwBtn) return;
    
    const original = changePwBtn.textContent;
    changePwBtn.textContent = 'Updating...';
    changePwBtn.disabled = true;
    
    setTimeout(() => {
      changePwBtn.textContent = original;
      changePwBtn.disabled = false;
      
      const form = document.getElementById('changePasswordForm');
      if (form) form.reset();
      
      const wrapper = document.getElementById('pwStrengthWrapperInstr');
      if (wrapper) wrapper.style.display = 'none';
      
      showNotif('Password updated successfully! (Demo Only)', true);
      
      setTimeout(() => {
        if (notifEl) notifEl.style.display = 'none';
      }, 3000);
    }, 1200);
  }
};

// Global functions
window.closeEditAccountModalInstr = () => InstructorAccount.closeEditModal();