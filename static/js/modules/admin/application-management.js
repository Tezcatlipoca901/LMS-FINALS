// Admin application management (review, approve, reject applications)
import { $, addClass, removeClass, setText, showElement, hideElement } from '../../core/dom-helpers.js';

export const AdminApplicationManagement = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const modals = ['applicationReviewModal', 'viewApplicationModal'];
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
  
  // View Application from pending list
  openApplicationModal(id, studentNo, name, type, date, program, reason) {
    setText(document.getElementById('appModalSubtitle'), `${id} — ${type}`);
    setText(document.getElementById('appModalId'), id);
    setText(document.getElementById('appModalStudentNo'), studentNo);
    setText(document.getElementById('appModalStudentName'), name);
    setText(document.getElementById('appModalType'), type);
    setText(document.getElementById('appModalDate'), date);
    setText(document.getElementById('appModalProgram'), program);
    setText(document.getElementById('appModalReason'), reason);
    
    // Reset fields
    const notesField = document.getElementById('appModalNotes');
    if (notesField) notesField.value = '';
    
    const notif = document.getElementById('appNotification');
    if (notif) {
      notif.style.display = 'none';
      notif.className = 'app-notification';
      notif.textContent = '';
    }
    
    const actions = document.getElementById('appModalActions');
    if (actions) actions.style.display = 'flex';
    
    const modal = document.getElementById('applicationReviewModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeApplicationModal() {
    const modal = document.getElementById('applicationReviewModal');
    if (modal) removeClass(modal, 'active');
  },
  
  approveApplicationModal() {
    const notes = document.getElementById('appModalNotes')?.value.trim() || '';
    
    if (!notes) {
      alert('Please enter admin remarks before approving.');
      return;
    }
    
    const notif = document.getElementById('appNotification');
    if (notif) {
      notif.textContent = 'Application has been approved successfully. (Demo Only)';
      notif.className = 'app-notification approved';
      notif.style.display = 'block';
    }
    
    const actions = document.getElementById('appModalActions');
    if (actions) actions.style.display = 'none';
    
    setTimeout(() => {
      this.closeApplicationModal();
    }, 2500);
  },
  
  rejectApplicationModal() {
    const notes = document.getElementById('appModalNotes')?.value.trim() || '';
    
    if (!notes) {
      alert('Please enter admin remarks before rejecting.');
      return;
    }
    
    const notif = document.getElementById('appNotification');
    if (notif) {
      notif.textContent = 'Application has been rejected. (Demo Only)';
      notif.className = 'app-notification rejected';
      notif.style.display = 'block';
    }
    
    const actions = document.getElementById('appModalActions');
    if (actions) actions.style.display = 'none';
    
    setTimeout(() => {
      this.closeApplicationModal();
    }, 2500);
  },
  
  // View Decided Application (already approved/rejected)
  openViewApplicationModal(id, name, type, status, date, reason, remarks) {
    setText(document.getElementById('viewAppSubtitle'), `${id} — ${type}`);
    setText(document.getElementById('viewAppId'), id);
    setText(document.getElementById('viewAppName'), name);
    setText(document.getElementById('viewAppType'), type);
    setText(document.getElementById('viewAppDate'), date);
    setText(document.getElementById('viewAppReason'), reason);
    setText(document.getElementById('viewAppRemarks'), remarks);
    
    const banner = document.getElementById('viewAppStatusBanner');
    if (banner) {
      if (status === 'Approved') {
        banner.textContent = 'This application was Approved.';
        banner.className = 'app-notification approved';
      } else {
        banner.textContent = 'This application was Rejected.';
        banner.className = 'app-notification rejected';
      }
    }
    
    const modal = document.getElementById('viewApplicationModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeViewApplicationModal() {
    const modal = document.getElementById('viewApplicationModal');
    if (modal) removeClass(modal, 'active');
  },
  
  // Legacy functions for application management page
  viewApplication(appId) {
    const detailsCard = document.getElementById('applicationDetailsCard');
    if (detailsCard) {
      detailsCard.style.display = 'block';
      detailsCard.scrollIntoView({ behavior: 'smooth' });
    }
  },
  
  hideApplicationDetails() {
    const detailsCard = document.getElementById('applicationDetailsCard');
    if (detailsCard) {
      detailsCard.style.display = 'none';
    }
  },
  
  approveApplication() {
    alert('Application approved successfully! (Demo only)');
    this.hideApplicationDetails();
  },
  
  rejectApplication() {
    if (confirm('Are you sure you want to reject this application?')) {
      alert('Application rejected! (Demo only)');
      this.hideApplicationDetails();
    }
  }
};

// Global functions
window.openApplicationModal = (id, studentNo, name, type, date, program, reason) => 
  AdminApplicationManagement.openApplicationModal(id, studentNo, name, type, date, program, reason);
window.closeApplicationModal = () => AdminApplicationManagement.closeApplicationModal();
window.approveApplicationModal = () => AdminApplicationManagement.approveApplicationModal();
window.rejectApplicationModal = () => AdminApplicationManagement.rejectApplicationModal();
window.openViewApplicationModal = (id, name, type, status, date, reason, remarks) => 
  AdminApplicationManagement.openViewApplicationModal(id, name, type, status, date, reason, remarks);
window.closeViewApplicationModal = () => AdminApplicationManagement.closeViewApplicationModal();
window.viewApplication = (appId) => AdminApplicationManagement.viewApplication(appId);
window.hideApplicationDetails = () => AdminApplicationManagement.hideApplicationDetails();
window.approveApplication = () => AdminApplicationManagement.approveApplication();
window.rejectApplication = () => AdminApplicationManagement.rejectApplication();