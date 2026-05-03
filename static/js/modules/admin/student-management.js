// Admin student management (view, edit, archive, enroll)
import { $, $$, addClass, removeClass, setText, showElement, hideElement } from '../../core/dom-helpers.js';
import { formatDate } from '../../core/utils.js';

export const AdminStudentManagement = {
  currentStudentProfile: {},
  currentEnrollStep: 1,
  totalEnrollSteps: 4,
  
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    // Modal close on outside click
    const modals = [
      'studentProfileModal', 'archiveStudentModal', 'editProfileModal',
      'enrollmentHistoryModal', 'enrollStudentModal'
    ];
    
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
  
  // View Profile Modal
  openStudentProfileModal(btn) {
    const row = btn.closest('tr');
    const cells = row.querySelectorAll('td');
    
    this.currentStudentProfile = {
      studentNo: cells[0]?.textContent.trim() || '',
      name: cells[1]?.textContent.trim() || '',
      program: cells[2]?.textContent.trim() || '',
      year: cells[3]?.textContent.trim() || '',
      email: cells[4]?.textContent.trim() || '',
      status: cells[5]?.textContent.trim() || ''
    };
    
    setText(document.getElementById('profileSubtitle'), 
      `${this.currentStudentProfile.studentNo} — ${this.currentStudentProfile.program}`);
    setText(document.getElementById('profileStudentNo'), this.currentStudentProfile.studentNo);
    setText(document.getElementById('profileName'), this.currentStudentProfile.name);
    setText(document.getElementById('profileEmail'), this.currentStudentProfile.email);
    setText(document.getElementById('profileStatus'), this.currentStudentProfile.status);
    setText(document.getElementById('profileProgram'), this.currentStudentProfile.program);
    setText(document.getElementById('profileYear'), this.currentStudentProfile.year);
    
    const modal = document.getElementById('studentProfileModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeStudentProfileModal() {
    const modal = document.getElementById('studentProfileModal');
    if (modal) removeClass(modal, 'active');
  },
  
  // Archive Student Modal
  openArchiveStudentModal(btn) {
    const row = btn.closest('tr');
    const cells = row.querySelectorAll('td');
    const status = cells[5]?.textContent.trim() || '';
    
    if (status !== 'Inactive' && status !== 'Graduated') {
      alert('Only Inactive or Graduated students can be archived.');
      return;
    }
    
    setText(document.getElementById('archiveStudentNo'), cells[0]?.textContent.trim() || '');
    setText(document.getElementById('archiveStudentName'), cells[1]?.textContent.trim() || '');
    setText(document.getElementById('archiveStudentProgram'), cells[2]?.textContent.trim() || '');
    setText(document.getElementById('archiveStudentStatus'), status);
    
    const modal = document.getElementById('archiveStudentModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeArchiveStudentModal() {
    const modal = document.getElementById('archiveStudentModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmArchiveStudent() {
    const btn = document.querySelector('#archiveStudentModal .btn-reject');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Student Archived (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeArchiveStudentModal();
    }, 2000);
  },
  
  // Edit Profile Modal
  openEditProfileModal() {
    const formFields = ['editProfileName', 'editProfileEmail', 'editProfileContact', 'editProfileDob'];
    formFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && this.currentStudentProfile[fieldId.replace('editProfile', '').toLowerCase()]) {
        field.value = this.currentStudentProfile[fieldId.replace('editProfile', '').toLowerCase()];
      }
    });
    
    // Set default contact and dob if not present
    if (document.getElementById('editProfileContact') && !this.currentStudentProfile.contact) {
      document.getElementById('editProfileContact').value = '+63 912 345 6789';
    }
    if (document.getElementById('editProfileDob') && !this.currentStudentProfile.dob) {
      document.getElementById('editProfileDob').value = '2006-05-05';
    }
    
    // Set program select
    const programSelect = document.getElementById('editProfileProgram');
    if (programSelect) {
      for (let i = 0; i < programSelect.options.length; i++) {
        if (programSelect.options[i].value === this.currentStudentProfile.program) {
          programSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    // Set year select
    const yearSelect = document.getElementById('editProfileYear');
    if (yearSelect) {
      for (let i = 0; i < yearSelect.options.length; i++) {
        if (yearSelect.options[i].value === this.currentStudentProfile.year) {
          yearSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    // Set status select
    const statusSelect = document.getElementById('editProfileStatus');
    if (statusSelect) {
      for (let i = 0; i < statusSelect.options.length; i++) {
        if (statusSelect.options[i].value === this.currentStudentProfile.status) {
          statusSelect.selectedIndex = i;
          break;
        }
      }
    }
    
    this.closeStudentProfileModal();
    const modal = document.getElementById('editProfileModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmEditProfile() {
    const name = document.getElementById('editProfileName')?.value.trim() || '';
    const email = document.getElementById('editProfileEmail')?.value.trim() || '';
    const contact = document.getElementById('editProfileContact')?.value.trim() || '';
    const dob = document.getElementById('editProfileDob')?.value || '';
    const program = document.getElementById('editProfileProgram')?.value || '';
    const year = document.getElementById('editProfileYear')?.value || '';
    const status = document.getElementById('editProfileStatus')?.value || '';
    
    if (!name || !email || !contact || !dob || !program || !year || !status) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const btn = document.querySelector('#editProfileModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Profile Updated (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeEditProfileModal();
    }, 2000);
  },
  
  // Enrollment History Modal
  openEnrollmentHistoryModal() {
    setText(document.getElementById('historySubtitle'), 
      `${this.currentStudentProfile.name} — ${this.currentStudentProfile.studentNo}`);
    
    this.closeStudentProfileModal();
    const modal = document.getElementById('enrollmentHistoryModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEnrollmentHistoryModal() {
    const modal = document.getElementById('enrollmentHistoryModal');
    if (modal) removeClass(modal, 'active');
  },
  
  // Enroll New Student Modal
  openEnrollStudentModal() {
    this.currentEnrollStep = 1;
    this.renderEnrollStep(1);
    
    // Clear all fields
    const textFields = [
      'enrLastName', 'enrFirstName', 'enrMiddleName', 'enrDob', 'enrContact',
      'enrReligion', 'enrAddress', 'enrEmergencyContact', 'enrEmergencyNumber',
      'enrLastSchool', 'enrStrand', 'enrStudentNo', 'enrEmail', 'enrNationality'
    ];
    
    textFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = id === 'enrNationality' ? 'Filipino' : '';
    });
    
    const selectFields = [
      'enrSuffix', 'enrSex', 'enrCivilStatus', 'enrProgram', 'enrYearLevel',
      'enrSection', 'enrSemester', 'enrAcademicYear', 'enrStudentType',
      'enrStatus', 'enrScholarship'
    ];
    
    selectFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.selectedIndex = 0;
    });
    
    const modal = document.getElementById('enrollStudentModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeEnrollStudentModal() {
    const modal = document.getElementById('enrollStudentModal');
    if (modal) removeClass(modal, 'active');
  },
  
  renderEnrollStep(step) {
    // Show/hide step content
    for (let i = 1; i <= this.totalEnrollSteps; i++) {
      const stepEl = document.getElementById(`enrollStep${i}`);
      if (stepEl) stepEl.style.display = i === step ? 'block' : 'none';
    }
    
    // Update step indicators
    for (let i = 1; i <= this.totalEnrollSteps; i++) {
      const indicator = document.getElementById(`stepIndicator${i}`);
      if (indicator) {
        indicator.classList.remove('active', 'completed');
        if (i === step) indicator.classList.add('active');
        else if (i < step) indicator.classList.add('completed');
      }
    }
    
    // Update step lines
    const lines = document.querySelectorAll('.enroll-step-line');
    lines.forEach((line, index) => {
      if (index < step - 1) line.classList.add('completed');
      else line.classList.remove('completed');
    });
    
    // Update buttons
    const backBtn = document.getElementById('enrollBtnBack');
    const nextBtn = document.getElementById('enrollBtnNext');
    if (backBtn) backBtn.style.display = step > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.innerHTML = step === this.totalEnrollSteps ? 'Confirm Enrollment' : 'Next →';
  },
  
  enrollStepNext() {
    if (this.currentEnrollStep === 1) {
      const last = document.getElementById('enrLastName')?.value.trim() || '';
      const first = document.getElementById('enrFirstName')?.value.trim() || '';
      const dob = document.getElementById('enrDob')?.value || '';
      const sex = document.getElementById('enrSex')?.value || '';
      const civil = document.getElementById('enrCivilStatus')?.value || '';
      const nationality = document.getElementById('enrNationality')?.value.trim() || '';
      const contact = document.getElementById('enrContact')?.value.trim() || '';
      const address = document.getElementById('enrAddress')?.value.trim() || '';
      const emergency = document.getElementById('enrEmergencyContact')?.value.trim() || '';
      const emergencyNum = document.getElementById('enrEmergencyNumber')?.value.trim() || '';
      
      if (!last || !first || !dob || !sex || !civil || !nationality || !contact || !address || !emergency || !emergencyNum) {
        alert('Please fill in all required fields in Personal Information.');
        return;
      }
    }
    
    if (this.currentEnrollStep === 2) {
      const program = document.getElementById('enrProgram')?.value || '';
      const year = document.getElementById('enrYearLevel')?.value || '';
      const section = document.getElementById('enrSection')?.value || '';
      const semester = document.getElementById('enrSemester')?.value || '';
      const ay = document.getElementById('enrAcademicYear')?.value || '';
      const type = document.getElementById('enrStudentType')?.value || '';
      
      if (!program || !year || !section || !semester || !ay || !type) {
        alert('Please fill in all required fields in Academic Information.');
        return;
      }
    }
    
    if (this.currentEnrollStep === 3) {
      const studentNo = document.getElementById('enrStudentNo')?.value.trim() || '';
      const email = document.getElementById('enrEmail')?.value.trim() || '';
      
      if (!studentNo || !email) {
        alert('Please fill in all required fields in Account Information.');
        return;
      }
      
      // Populate confirmation summary
      const suffix = document.getElementById('enrSuffix')?.value || '';
      const middle = document.getElementById('enrMiddleName')?.value.trim() || '';
      const firstName = document.getElementById('enrFirstName')?.value.trim() || '';
      const lastName = document.getElementById('enrLastName')?.value.trim() || '';
      const fullName = [firstName, middle, lastName, suffix].filter(Boolean).join(' ');
      
      setText(document.getElementById('confirmFullName'), fullName);
      
      const dob = document.getElementById('enrDob')?.value;
      if (dob) {
        setText(document.getElementById('confirmDob'), formatDate(dob, { year: 'numeric', month: 'long', day: 'numeric' }));
      }
      
      setText(document.getElementById('confirmSex'), document.getElementById('enrSex')?.value || '');
      setText(document.getElementById('confirmContact'), document.getElementById('enrContact')?.value.trim() || '');
      setText(document.getElementById('confirmAddress'), document.getElementById('enrAddress')?.value.trim() || '');
      setText(document.getElementById('confirmProgram'), document.getElementById('enrProgram')?.value || '');
      setText(document.getElementById('confirmYear'), document.getElementById('enrYearLevel')?.value || '');
      setText(document.getElementById('confirmSection'), document.getElementById('enrSection')?.value || '');
      
      const semester = document.getElementById('enrSemester')?.value || '';
      const academicYear = document.getElementById('enrAcademicYear')?.value || '';
      setText(document.getElementById('confirmSemester'), `${semester}, A.Y. ${academicYear}`);
      
      setText(document.getElementById('confirmStudentType'), document.getElementById('enrStudentType')?.value || '');
      setText(document.getElementById('confirmStudentNo'), studentNo);
      setText(document.getElementById('confirmEmail'), email);
      setText(document.getElementById('confirmStatus'), document.getElementById('enrStatus')?.value || '');
      
      const scholarship = document.getElementById('enrScholarship')?.value || '';
      setText(document.getElementById('confirmScholarship'), scholarship || 'None');
    }
    
    if (this.currentEnrollStep === this.totalEnrollSteps) {
      const btn = document.getElementById('enrollBtnNext');
      if (!btn) return;
      
      const original = btn.innerHTML;
      btn.innerHTML = 'Student Successfully Enrolled (Demo Only)';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        this.closeEnrollStudentModal();
      }, 2500);
      return;
    }
    
    this.currentEnrollStep++;
    this.renderEnrollStep(this.currentEnrollStep);
  },
  
  enrollStepBack() {
    if (this.currentEnrollStep > 1) {
      this.currentEnrollStep--;
      this.renderEnrollStep(this.currentEnrollStep);
    }
  }
};

// Global functions
window.openStudentProfileModal = (btn) => AdminStudentManagement.openStudentProfileModal(btn);
window.closeStudentProfileModal = () => AdminStudentManagement.closeStudentProfileModal();
window.openArchiveStudentModal = (btn) => AdminStudentManagement.openArchiveStudentModal(btn);
window.closeArchiveStudentModal = () => AdminStudentManagement.closeArchiveStudentModal();
window.confirmArchiveStudent = () => AdminStudentManagement.confirmArchiveStudent();
window.openEditProfileModal = () => AdminStudentManagement.openEditProfileModal();
window.closeEditProfileModal = () => AdminStudentManagement.closeEditProfileModal();
window.confirmEditProfile = () => AdminStudentManagement.confirmEditProfile();
window.openEnrollmentHistoryModal = () => AdminStudentManagement.openEnrollmentHistoryModal();
window.closeEnrollmentHistoryModal = () => AdminStudentManagement.closeEnrollmentHistoryModal();
window.openEnrollStudentModal = () => AdminStudentManagement.openEnrollStudentModal();
window.closeEnrollStudentModal = () => AdminStudentManagement.closeEnrollStudentModal();
window.enrollStepNext = () => AdminStudentManagement.enrollStepNext();
window.enrollStepBack = () => AdminStudentManagement.enrollStepBack();