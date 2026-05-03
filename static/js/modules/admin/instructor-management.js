// Admin instructor management (add, edit, archive instructors)
import { $, addClass, removeClass, setText } from '../../core/dom-helpers.js';
import { formatDate } from '../../core/utils.js';

export const AdminInstructorManagement = {
  currentInstrStep: 1,
  totalInstrSteps: 4,
  
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const modals = ['addInstructorModal', 'editInstructorModal', 'archiveInstructorModal'];
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
  
  // Add Instructor
  openAddInstructorModal() {
    this.currentInstrStep = 1;
    this.renderInstrStep(1);
    
    const textFields = [
      'instrLastName', 'instrFirstName', 'instrMiddleName', 'instrDob', 'instrContact',
      'instrEmail', 'instrNationality', 'instrAddress', 'instrSpecialization',
      'instrGraduateSchool', 'instrYearGraduated', 'instrProfLicense',
      'instrOtherCredentials', 'instrId', 'instrDateHired'
    ];
    
    textFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = id === 'instrNationality' ? 'Filipino' : '';
    });
    
    const selectFields = [
      'instrSuffix', 'instrSex', 'instrCivilStatus', 'instrDegree',
      'instrDepartment', 'instrRank', 'instrEmploymentType',
      'instrStatus', 'instrMaxLoad'
    ];
    
    selectFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    
    const modal = document.getElementById('addInstructorModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeAddInstructorModal() {
    const modal = document.getElementById('addInstructorModal');
    if (modal) removeClass(modal, 'active');
  },
  
  renderInstrStep(step) {
    for (let i = 1; i <= this.totalInstrSteps; i++) {
      const stepEl = document.getElementById(`instrStep${i}`);
      if (stepEl) stepEl.style.display = i === step ? 'block' : 'none';
    }
    
    for (let i = 1; i <= this.totalInstrSteps; i++) {
      const indicator = document.getElementById(`instrStepIndicator${i}`);
      if (indicator) {
        indicator.classList.remove('active', 'completed');
        if (i === step) indicator.classList.add('active');
        else if (i < step) indicator.classList.add('completed');
      }
    }
    
    const lines = document.querySelectorAll('#addInstructorModal .enroll-step-line');
    lines.forEach((line, index) => {
      if (index < step - 1) line.classList.add('completed');
      else line.classList.remove('completed');
    });
    
    const backBtn = document.getElementById('instrBtnBack');
    const nextBtn = document.getElementById('instrBtnNext');
    if (backBtn) backBtn.style.display = step > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.innerHTML = step === this.totalInstrSteps ? 'Confirm & Add Instructor' : 'Next →';
  },
  
  instrStepNext() {
    if (this.currentInstrStep === 1) {
      const last = document.getElementById('instrLastName')?.value.trim() || '';
      const first = document.getElementById('instrFirstName')?.value.trim() || '';
      const dob = document.getElementById('instrDob')?.value || '';
      const sex = document.getElementById('instrSex')?.value || '';
      const civil = document.getElementById('instrCivilStatus')?.value || '';
      const contact = document.getElementById('instrContact')?.value.trim() || '';
      const email = document.getElementById('instrEmail')?.value.trim() || '';
      const nationality = document.getElementById('instrNationality')?.value.trim() || '';
      const address = document.getElementById('instrAddress')?.value.trim() || '';
      
      if (!last || !first || !dob || !sex || !civil || !contact || !email || !nationality || !address) {
        alert('Please fill in all required fields in Personal Information.');
        return;
      }
    }
    
    if (this.currentInstrStep === 2) {
      const degree = document.getElementById('instrDegree')?.value || '';
      const spec = document.getElementById('instrSpecialization')?.value.trim() || '';
      const school = document.getElementById('instrGraduateSchool')?.value.trim() || '';
      const year = document.getElementById('instrYearGraduated')?.value.trim() || '';
      
      if (!degree || !spec || !school || !year) {
        alert('Please fill in all required fields in Academic Credentials.');
        return;
      }
    }
    
    if (this.currentInstrStep === 3) {
      const id = document.getElementById('instrId')?.value.trim() || '';
      const dept = document.getElementById('instrDepartment')?.value || '';
      const rank = document.getElementById('instrRank')?.value || '';
      const type = document.getElementById('instrEmploymentType')?.value || '';
      const dateHired = document.getElementById('instrDateHired')?.value || '';
      const load = document.getElementById('instrMaxLoad')?.value || '';
      
      if (!id || !dept || !rank || !type || !dateHired || !load) {
        alert('Please fill in all required fields in Employment Information.');
        return;
      }
      
      // Populate confirmation summary
      const suffix = document.getElementById('instrSuffix')?.value || '';
      const middle = document.getElementById('instrMiddleName')?.value.trim() || '';
      const firstName = document.getElementById('instrFirstName')?.value.trim() || '';
      const lastName = document.getElementById('instrLastName')?.value.trim() || '';
      const fullName = [firstName, middle, lastName, suffix].filter(Boolean).join(' ');
      
      setText(document.getElementById('instrConfirmName'), fullName);
      
      const dob = document.getElementById('instrDob')?.value;
      if (dob) {
        setText(document.getElementById('instrConfirmDob'), formatDate(dob));
      }
      
      setText(document.getElementById('instrConfirmSex'), document.getElementById('instrSex')?.value || '');
      setText(document.getElementById('instrConfirmContact'), document.getElementById('instrContact')?.value.trim() || '');
      setText(document.getElementById('instrConfirmEmail'), document.getElementById('instrEmail')?.value.trim() || '');
      setText(document.getElementById('instrConfirmDegree'), document.getElementById('instrDegree')?.value || '');
      setText(document.getElementById('instrConfirmSpecialization'), document.getElementById('instrSpecialization')?.value.trim() || '');
      setText(document.getElementById('instrConfirmSchool'), document.getElementById('instrGraduateSchool')?.value.trim() || '');
      setText(document.getElementById('instrConfirmYearGrad'), document.getElementById('instrYearGraduated')?.value.trim() || '');
      setText(document.getElementById('instrConfirmId'), id);
      setText(document.getElementById('instrConfirmDept'), dept);
      setText(document.getElementById('instrConfirmRank'), rank);
      setText(document.getElementById('instrConfirmType'), type);
      
      if (dateHired) {
        setText(document.getElementById('instrConfirmDateHired'), formatDate(dateHired));
      }
      
      setText(document.getElementById('instrConfirmLoad'), `${load} units`);
    }
    
    if (this.currentInstrStep === this.totalInstrSteps) {
      const btn = document.getElementById('instrBtnNext');
      if (!btn) return;
      
      const original = btn.innerHTML;
      btn.innerHTML = 'Instructor Added Successfully (Demo Only)';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        this.closeAddInstructorModal();
      }, 2500);
      return;
    }
    
    this.currentInstrStep++;
    this.renderInstrStep(this.currentInstrStep);
  },
  
  instrStepBack() {
    if (this.currentInstrStep > 1) {
      this.currentInstrStep--;
      this.renderInstrStep(this.currentInstrStep);
    }
  },
  
  // Edit Instructor
  openEditInstructorModal(id, name, dept, email, rank, type, status, load) {
    setText(document.getElementById('editInstrId'), id);
    setText(document.getElementById('editInstrName'), name);
    setText(document.getElementById('editInstrEmail'), email);
    
    const deptSelect = document.getElementById('editInstrDept');
    if (deptSelect) {
      for (let i = 0; i < deptSelect.options.length; i++) {
        if (deptSelect.options[i].value === dept) {
          deptSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const rankSelect = document.getElementById('editInstrRank');
    if (rankSelect) {
      for (let i = 0; i < rankSelect.options.length; i++) {
        if (rankSelect.options[i].value === rank) {
          rankSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const typeSelect = document.getElementById('editInstrType');
    if (typeSelect) {
      for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].value === type) {
          typeSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const statusSelect = document.getElementById('editInstrStatus');
    if (statusSelect) {
      for (let i = 0; i < statusSelect.options.length; i++) {
        if (statusSelect.options[i].value === status) {
          statusSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const loadSelect = document.getElementById('editInstrLoad');
    if (loadSelect) {
      for (let i = 0; i < loadSelect.options.length; i++) {
        if (loadSelect.options[i].value === load) {
          loadSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    const modal = document.getElementById('editInstructorModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEditInstructorModal() {
    const modal = document.getElementById('editInstructorModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmEditInstructor() {
    const name = document.getElementById('editInstrName')?.value.trim() || '';
    const email = document.getElementById('editInstrEmail')?.value.trim() || '';
    const dept = document.getElementById('editInstrDept')?.value || '';
    const rank = document.getElementById('editInstrRank')?.value || '';
    const type = document.getElementById('editInstrType')?.value || '';
    const status = document.getElementById('editInstrStatus')?.value || '';
    const load = document.getElementById('editInstrLoad')?.value || '';
    
    if (!name || !email || !dept || !rank || !type || !status || !load) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const btn = document.querySelector('#editInstructorModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Changes Saved (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeEditInstructorModal();
    }, 2000);
  },
  
  // Archive Instructor
  openArchiveInstructorModal(id, name, dept) {
    setText(document.getElementById('archiveInstrId'), id);
    setText(document.getElementById('archiveInstrName'), name);
    setText(document.getElementById('archiveInstrDept'), dept);
    
    const modal = document.getElementById('archiveInstructorModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeArchiveInstructorModal() {
    const modal = document.getElementById('archiveInstructorModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmArchiveInstructor() {
    const btn = document.querySelector('#archiveInstructorModal .btn-reject');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Instructor Archived (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeArchiveInstructorModal();
    }, 2000);
  }
};

// Global functions
window.openAddInstructorModal = () => AdminInstructorManagement.openAddInstructorModal();
window.closeAddInstructorModal = () => AdminInstructorManagement.closeAddInstructorModal();
window.instrStepNext = () => AdminInstructorManagement.instrStepNext();
window.instrStepBack = () => AdminInstructorManagement.instrStepBack();
window.openEditInstructorModal = (id, name, dept, email, rank, type, status, load) => 
  AdminInstructorManagement.openEditInstructorModal(id, name, dept, email, rank, type, status, load);
window.closeEditInstructorModal = () => AdminInstructorManagement.closeEditInstructorModal();
window.confirmEditInstructor = () => AdminInstructorManagement.confirmEditInstructor();
window.openArchiveInstructorModal = (id, name, dept) => 
  AdminInstructorManagement.openArchiveInstructorModal(id, name, dept);
window.closeArchiveInstructorModal = () => AdminInstructorManagement.closeArchiveInstructorModal();
window.confirmArchiveInstructor = () => AdminInstructorManagement.confirmArchiveInstructor();