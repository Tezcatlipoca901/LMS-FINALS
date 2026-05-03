// Admin user management (edit, archive users)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const AdminUserManagement = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const modals = ['editUserModal', 'archiveUserModal'];
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
  
  // Edit User
  openEditUserModal(id, name, email, type, role, status) {
    setText(document.getElementById('editUserId'), id);
    setText(document.getElementById('editUserName'), name);
    setText(document.getElementById('editUserEmail'), email);
    
    const typeSelect = document.getElementById('editUserType');
    if (typeSelect) {
      for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].value === type) {
          typeSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const roleSelect = document.getElementById('editUserRole');
    if (roleSelect) {
      for (let i = 0; i < roleSelect.options.length; i++) {
        if (roleSelect.options[i].value === role) {
          roleSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const statusSelect = document.getElementById('editUserStatus');
    if (statusSelect) {
      for (let i = 0; i < statusSelect.options.length; i++) {
        if (statusSelect.options[i].value === status) {
          statusSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const modal = document.getElementById('editUserModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEditUserModal() {
    const modal = document.getElementById('editUserModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmEditUser() {
    const name = document.getElementById('editUserName')?.value.trim() || '';
    const email = document.getElementById('editUserEmail')?.value.trim() || '';
    const type = document.getElementById('editUserType')?.value || '';
    const role = document.getElementById('editUserRole')?.value || '';
    const status = document.getElementById('editUserStatus')?.value || '';
    
    if (!name || !email || !type || !role || !status) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const btn = document.querySelector('#editUserModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Changes Saved (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeEditUserModal();
    }, 2000);
  },
  
  // Archive User
  openArchiveUserModal(id, name) {
    setText(document.getElementById('archiveUserId'), id);
    setText(document.getElementById('archiveUserName'), name);
    
    const modal = document.getElementById('archiveUserModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeArchiveUserModal() {
    const modal = document.getElementById('archiveUserModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmArchiveUser() {
    const btn = document.querySelector('#archiveUserModal .btn-reject');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'User Archived (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeArchiveUserModal();
    }, 2000);
  }
};

// Global functions
window.openEditUserModal = (id, name, email, type, role, status) => 
  AdminUserManagement.openEditUserModal(id, name, email, type, role, status);
window.closeEditUserModal = () => AdminUserManagement.closeEditUserModal();
window.confirmEditUser = () => AdminUserManagement.confirmEditUser();
window.openArchiveUserModal = (id, name) => AdminUserManagement.openArchiveUserModal(id, name);
window.closeArchiveUserModal = () => AdminUserManagement.closeArchiveUserModal();
window.confirmArchiveUser = () => AdminUserManagement.confirmArchiveUser();