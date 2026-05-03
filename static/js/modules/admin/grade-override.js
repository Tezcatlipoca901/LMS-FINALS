// Admin grade override management
import { $, $$, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const AdminGradeOverride = {
  studentGradeData: {},
  currentStudentKey: null,
  pendingOverride: null,
  
  init() {
    this.initMockData();
    this.bindEvents();
  },
  
  initMockData() {
    this.studentGradeData = {
      "2024-00111-SM-0": {
        name: "Marshall D. Teach",
        courses: [
          { code: "IT101",   name: "Data Structures and Algorithms",   grade: "1.75" },
          { code: "GEED002", name: "Mathematics in the Modern World",  grade: "2.00" },
          { code: "GEED001", name: "Purposive Communication",          grade: "1.50" }
        ]
      },
      "2023-00230-SM-0": {
        name: "Monkey D. Luffy",
        courses: [
          { code: "IT102",   name: "Computer Programming 3",           grade: "2.25" },
          { code: "IT105",   name: "Human Computer Interactions",      grade: "1.75" },
          { code: "ACCO101", name: "Accountancy",                      grade: "2.00" }
        ]
      },
      "2022-00045-SM-0": {
        name: "Roronoa Zoro",
        courses: [
          { code: "IT102",   name: "Computer Programming 2",           grade: "1.25" },
          { code: "GEED001", name: "Purposive Communication",          grade: "1.50" },
          { code: "IT104",   name: "Data Structures and Algorithms",   grade: "1.75" }
        ]
      },
      "2024-00123-SM-0": {
        name: "Optimus Prime",
        courses: [
          { code: "IT102",   name: "Computer Programming 3",           grade: "2.25" },
          { code: "IT101",   name: "Introduction to Computing",        grade: "1.75" },
          { code: "GEED002", name: "Mathematics in the Modern World",  grade: "2.00" }
        ]
      }
    };
  },
  
  bindEvents() {
    const searchInput = document.getElementById('searchStudentGrade');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.searchStudentGrade();
      });
    }
    
    const modal = document.getElementById('gradeOverrideModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeGradeOverrideModal();
      });
    }
  },
  
  showNotif(id, message, isSuccess) {
    const notif = document.getElementById(id);
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
  
  searchStudentGrade() {
    const query = document.getElementById('searchStudentGrade')?.value.trim().toLowerCase() || '';
    const gradesCard = document.getElementById('studentGradesCard');
    const gradesHeader = document.getElementById('studentGradesCardHeader');
    const tbody = document.getElementById('studentGradesBody');
    
    if (!query) {
      this.showNotif('searchGradeNotif', '⚠ Please enter a student number or name.', false);
      if (gradesCard) gradesCard.style.display = 'none';
      return;
    }
    
    let foundKey = null;
    let foundStudent = null;
    
    Object.keys(this.studentGradeData).forEach((key) => {
      const student = this.studentGradeData[key];
      if (key.toLowerCase().includes(query) || student.name.toLowerCase().includes(query)) {
        foundKey = key;
        foundStudent = student;
      }
    });
    
    if (!foundStudent) {
      this.showNotif('searchGradeNotif', `⚠ No student found matching "${query}". Please check and try again.`, false);
      if (gradesCard) gradesCard.style.display = 'none';
      this.currentStudentKey = null;
      return;
    }
    
    this.currentStudentKey = foundKey;
    if (gradesHeader) {
      gradesHeader.textContent = `Student Grades — ${foundStudent.name} (${foundKey})`;
    }
    
    if (tbody) {
      tbody.innerHTML = '';
      foundStudent.courses.forEach((course, index) => {
        tbody.innerHTML += `
          <tr id="gradeRow-${index}">
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td><span class="grade-value" id="currentGrade-${index}">${course.grade}</span></td>
            <td><input type="text" class="table-input" id="newGrade-${index}" placeholder="Enter new grade" /></td>
            <td><input type="text" class="table-input" id="gradeRemarks-${index}" placeholder="Reason for override" /></td>
            <td><button class="btn-save" onclick="openGradeOverrideModal(${index})">Update</button></td>
          </tr>
          <tr id="gradeNotifRow-${index}" style="display:none;">
            <td colspan="6" style="padding: 0 15px 10px;">
              <div id="gradeRowNotif-${index}" class="reset-success-notif" style="margin:0;"></div>
            </td>
          </tr>`;
      });
    }
    
    if (gradesCard) {
      gradesCard.style.display = 'block';
      gradesCard.scrollIntoView({ behavior: 'smooth' });
    }
  },
  
  openGradeOverrideModal(index) {
    if (!this.currentStudentKey) return;
    
    const student = this.studentGradeData[this.currentStudentKey];
    const course = student.courses[index];
    const newGrade = document.getElementById(`newGrade-${index}`)?.value.trim() || '';
    const remarks = document.getElementById(`gradeRemarks-${index}`)?.value.trim() || '';
    
    const notifRow = document.getElementById(`gradeNotifRow-${index}`);
    const notif = document.getElementById(`gradeRowNotif-${index}`);
    
    if (!newGrade) {
      if (notif) {
        notif.textContent = '⚠ Please enter a new grade before updating.';
        notif.style.background = '#f8d7da';
        notif.style.color = '#721c24';
      }
      if (notifRow) notifRow.style.display = 'table-row';
      setTimeout(() => { if (notifRow) notifRow.style.display = 'none'; }, 3500);
      return;
    }
    
    if (!remarks) {
      if (notif) {
        notif.textContent = '⚠ Please enter a reason for the override.';
        notif.style.background = '#f8d7da';
        notif.style.color = '#721c24';
      }
      if (notifRow) notifRow.style.display = 'table-row';
      setTimeout(() => { if (notifRow) notifRow.style.display = 'none'; }, 3500);
      return;
    }
    
    this.pendingOverride = { index, newGrade, remarks, course };
    
    setText(document.getElementById('modalOverrideStudent'), `${student.name} (${this.currentStudentKey})`);
    setText(document.getElementById('modalOverrideCourse'), `${course.code} — ${course.name}`);
    setText(document.getElementById('modalOverrideOldGrade'), course.grade);
    setText(document.getElementById('modalOverrideNewGrade'), newGrade);
    setText(document.getElementById('modalOverrideRemarks'), remarks || '—');
    
    const modal = document.getElementById('gradeOverrideModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeGradeOverrideModal() {
    const modal = document.getElementById('gradeOverrideModal');
    if (modal) removeClass(modal, 'active');
    this.pendingOverride = null;
  },
  
  confirmGradeOverride() {
    if (!this.pendingOverride || !this.currentStudentKey) return;
    
    const { index, newGrade, course } = this.pendingOverride;
    const btn = document.querySelector('#gradeOverrideModal .assess-confirm-btn');
    
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = 'Saving... (Demo Only)';
    btn.disabled = true;
    
    setTimeout(() => {
      const currentGradeSpan = document.getElementById(`currentGrade-${index}`);
      if (currentGradeSpan) currentGradeSpan.textContent = newGrade;
      
      if (this.studentGradeData[this.currentStudentKey]) {
        this.studentGradeData[this.currentStudentKey].courses[index].grade = newGrade;
      }
      
      const newGradeInput = document.getElementById(`newGrade-${index}`);
      const remarksInput = document.getElementById(`gradeRemarks-${index}`);
      if (newGradeInput) newGradeInput.value = '';
      if (remarksInput) remarksInput.value = '';
      
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeGradeOverrideModal();
      
      const notifRow = document.getElementById(`gradeNotifRow-${index}`);
      const notif = document.getElementById(`gradeRowNotif-${index}`);
      if (notif) {
        notif.textContent = `Grade for ${course.code} successfully updated to ${newGrade}. (Demo Only)`;
        notif.style.background = '#d4edda';
        notif.style.color = '#155724';
      }
      if (notifRow) notifRow.style.display = 'table-row';
      
      setTimeout(() => { if (notifRow) notifRow.style.display = 'none'; }, 3500);
      
      this.pendingOverride = null;
    }, 1500);
  }
};

// Global functions
window.searchStudentGrade = () => AdminGradeOverride.searchStudentGrade();
window.openGradeOverrideModal = (index) => AdminGradeOverride.openGradeOverrideModal(index);
window.closeGradeOverrideModal = () => AdminGradeOverride.closeGradeOverrideModal();
window.confirmGradeOverride = () => AdminGradeOverride.confirmGradeOverride();