// Instructor application review (grade change, withdrawal, LOA requests)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const InstructorApplications = {
  appData: {},
  currentAppId: null,
  
  init() {
    this.initMockData();
    this.bindEvents();
  },
  
  initMockData() {
    this.appData = {
      "APP-2026-001": {
        id: "APP-2026-001",
        type: "Grade Change",
        student: "Steven Universe (2024-00182-SM-0)",
        subject: "IT 071 - Data Structures and Algorithms",
        date: "March 20, 2026",
        reason: "Student claims there was a calculation error in the final grade computation. Requests re-checking of exam scores submitted last March 10."
      },
      "APP-2026-002": {
        id: "APP-2026-002",
        type: "Subject Withdrawal",
        student: "Charlotte Lin Lin (2022-00433-SM-0)",
        subject: "IT 083 - Database Systems",
        date: "March 22, 2026",
        reason: "Student is requesting withdrawal due to medical reasons. Supporting documents from the university clinic have been attached."
      },
      "APP-2026-003": {
        id: "APP-2026-003",
        type: "Leave of Absence",
        student: "Optimus Prime (2024-00123-SM-0)",
        subject: "All Classes",
        date: "March 15, 2026",
        reason: "Student is requesting a leave of absence for the remainder of the semester due to a family emergency requiring travel abroad."
      }
    };
  },
  
  bindEvents() {
    const modal = document.getElementById('instrAppReviewModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }
    
    const approveBtn = document.querySelector('#instrAppReviewModal .btn-approve');
    const rejectBtn = document.querySelector('#instrAppReviewModal .btn-reject');
    
    if (approveBtn) {
      approveBtn.addEventListener('click', () => this.confirmDecision('approve'));
    }
    
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => this.confirmDecision('reject'));
    }
  },
  
  showNotif(message, isSuccess) {
    const notif = document.getElementById('instrAppNotif');
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
  },
  
  viewApplicationDetails(appId) {
    const app = this.appData[appId];
    if (!app) return;
    
    this.currentAppId = appId;
    
    const title = document.getElementById('instrAppModalTitle');
    const subtitle = document.getElementById('instrAppModalSubtitle');
    const idSpan = document.getElementById('instrAppModalId');
    const typeSpan = document.getElementById('instrAppModalType');
    const studentSpan = document.getElementById('instrAppModalStudent');
    const subjectSpan = document.getElementById('instrAppModalSubject');
    const dateSpan = document.getElementById('instrAppModalDate');
    const reasonSpan = document.getElementById('instrAppModalReason');
    
    if (title) title.textContent = 'Application Review';
    if (subtitle) subtitle.textContent = `${app.id} — ${app.type}`;
    if (idSpan) idSpan.textContent = app.id;
    if (typeSpan) typeSpan.textContent = app.type;
    if (studentSpan) studentSpan.textContent = app.student;
    if (subjectSpan) subjectSpan.textContent = app.subject;
    if (dateSpan) dateSpan.textContent = app.date;
    if (reasonSpan) reasonSpan.textContent = app.reason;
    
    // Reset state
    const remarksInput = document.getElementById('instrAppRemarks');
    const notif = document.getElementById('instrAppNotif');
    const decisionSection = document.getElementById('instrAppDecisionSection');
    const resultBanner = document.getElementById('instrAppResultBanner');
    
    if (remarksInput) remarksInput.value = '';
    if (notif) notif.style.display = 'none';
    if (decisionSection) decisionSection.style.display = 'block';
    if (resultBanner) resultBanner.style.display = 'none';
    
    const modal = document.getElementById('instrAppReviewModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeModal() {
    const modal = document.getElementById('instrAppReviewModal');
    if (modal) removeClass(modal, 'active');
    this.currentAppId = null;
  },
  
  confirmDecision(decision) {
    const remarks = document.getElementById('instrAppRemarks')?.value.trim() || '';
    
    if (!remarks) {
      this.showNotif('⚠ Please enter remarks before making a decision.', false);
      return;
    }
    
    const isApprove = decision === 'approve';
    const banner = document.getElementById('instrAppResultBanner');
    const section = document.getElementById('instrAppDecisionSection');
    
    const approveBtn = document.querySelector('#instrAppReviewModal .btn-approve');
    const rejectBtn = document.querySelector('#instrAppReviewModal .btn-reject');
    
    if (approveBtn) approveBtn.disabled = true;
    if (rejectBtn) rejectBtn.disabled = true;
    
    if (approveBtn) approveBtn.textContent = isApprove ? 'Processing...' : 'Approve';
    if (rejectBtn) rejectBtn.textContent = isApprove ? 'Reject' : 'Processing...';
    
    setTimeout(() => {
      if (section) section.style.display = 'none';
      
      if (banner) {
        banner.textContent = isApprove
          ? 'Application has been approved successfully. (Demo Only)'
          : 'Application has been rejected. (Demo Only)';
        banner.className = `app-notification ${isApprove ? 'approved' : 'rejected'}`;
        banner.style.display = 'block';
      }
      
      if (approveBtn) {
        approveBtn.disabled = false;
        approveBtn.textContent = 'Approve';
      }
      if (rejectBtn) {
        rejectBtn.disabled = false;
        rejectBtn.textContent = 'Reject';
      }
      
      setTimeout(() => {
        this.closeModal();
      }, 2500);
    }, 1200);
  }
};

// Global functions
window.viewApplicationDetails = (appId) => InstructorApplications.viewApplicationDetails(appId);
window.closeInstrAppReviewModal = () => InstructorApplications.closeModal();