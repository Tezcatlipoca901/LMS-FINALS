// Instructor gradebook management
import { $, $$, addClass, removeClass, setText, setHTML, showElement, hideElement } from '../../core/dom-helpers.js';
import { VALID_GRADES, STATUS_BADGE_CLASS } from '../../core/constants.js';
import { isValidGrade, computeSemGrade } from '../../core/utils.js';

export const InstructorGradebook = {
  gradebookData: {},
  currentClassCode: null,
  gradeNotifTimeout: null,
  
  init() {
    this.initMockData();
    this.bindEvents();
  },
  
  initMockData() {
    this.gradebookData = {
      IT101: {
        title: "IT 101 - Introduction to Computing (1A)",
        students: [
          { studentNo: "2025-00230-SM-0", name: "Monkey D. Luffy",    midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" },
          { studentNo: "2025-00244-SM-0", name: "Roronoa Zoro",       midterm: "1.75", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2025-00189-SM-0", name: "Nami",               midterm: "1.25", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2025-00261-SM-0", name: "Usopp",              midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" },
          { studentNo: "2025-00245-SM-0", name: "Vinsmoke Sanji",     midterm: "1.50", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2025-00137-SM-0", name: "Marco the Phoenix",  midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" }
        ]
      },
      IT102: {
        title: "IT 102 - Computer Programming 1 (1C)",
        students: [
          { studentNo: "2025-00151-SM-0", name: "Tony Tony Chopper",  midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" },
          { studentNo: "2025-00122-SM-0", name: "Franky",             midterm: "2.25", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2025-00253-SM-0", name: "Brook",              midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" },
          { studentNo: "2025-00054-SM-0", name: "Wheeljack",          midterm: "1.75", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2025-00155-SM-0", name: "Johnny Bravo",       midterm: "1.50", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2025-00176-SM-0", name: "Nico Robin",         midterm: "1.25", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2025-00157-SM-0", name: "Jinbe",              midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" }
        ]
      },
      IT071: {
        title: "IT 071 - Data Structures and Algorithms (2B)",
        students: [
          { studentNo: "2024-00291-SM-0", name: "Trafalgar D. Law",   midterm: "1.50", final: "1.25", semGrade: "1.38", remarks: "Excellent", status: "Finalized" },
          { studentNo: "2024-00123-SM-0", name: "Optimus Prime",      midterm: "1.75", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2024-00202-SM-0", name: "Eustass Kid",        midterm: "2.00", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2024-00293-SM-0", name: "Megatron",           midterm: "2.25", final: "2.25", semGrade: "2.25", remarks: "Fair", status: "Finalized" },
          { studentNo: "2024-00114-SM-0", name: "Starscream",         midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" },
          { studentNo: "2024-00115-SM-0", name: "Killer",             midterm: "1.75", final: "1.50", semGrade: "1.63", remarks: "Good", status: "Finalized" },
          { studentNo: "2024-00106-SM-0", name: "Steven Universe",    midterm: "1.25", final: "1.00", semGrade: "1.13", remarks: "Excellent", status: "Finalized" }
        ]
      },
      IT022: {
        title: "IT 022 - Human Computer Interaction (3A)",
        students: [
          { studentNo: "2023-00391-SM-0", name: "Portgas D. Ace",     midterm: "1.75", final: "1.75", semGrade: "1.75", remarks: "Good", status: "Finalized" },
          { studentNo: "2023-00032-SM-0", name: "Sa D. Bo",           midterm: "1.25", final: "",     semGrade: "", remarks: "", status: "In Progress" },
          { studentNo: "2023-00163-SM-0", name: "Vista Flower Blade", midterm: "",     final: "",     semGrade: "", remarks: "", status: "Pending" },
          { studentNo: "2023-00214-SM-0", name: "Ultra Magnus",       midterm: "2.00", final: "2.00", semGrade: "2.00", remarks: "Satisfactory", status: "Finalized" },
          { studentNo: "2023-00315-SM-0", name: "Charlotte Katakuri", midterm: "1.50", final: "1.25", semGrade: "1.38", remarks: "Excellent", status: "Finalized" }
        ]
      },
      IT083: {
        title: "IT 083 - Database Systems (4A)",
        students: [
          { studentNo: "2022-00411-SM-0", name: "Dracule Mihawk",     midterm: "1.50", final: "1.25", semGrade: "1.38", remarks: "Excellent", status: "Finalized" },
          { studentNo: "2022-00222-SM-0", name: "Boa Hancock",        midterm: "1.25", final: "1.00", semGrade: "1.13", remarks: "Excellent", status: "Finalized" },
          { studentNo: "2022-00006-SM-0", name: "Diamond Jozu",       midterm: "1.75", final: "1.75", semGrade: "1.75", remarks: "Good", status: "Finalized" },
          { studentNo: "2022-00132-SM-0", name: "Ultra Magnus",       midterm: "2.00", final: "1.75", semGrade: "1.88", remarks: "Satisfactory", status: "Finalized" },
          { studentNo: "2022-00405-SM-0", name: "Grimlock",           midterm: "2.50", final: "2.25", semGrade: "2.38", remarks: "Fair", status: "Finalized" }
        ]
      }
    };
  },
  
  bindEvents() {
    const classSelect = document.getElementById('classSelect');
    if (classSelect) {
      classSelect.addEventListener('change', (e) => this.loadGradebook(e.target.value));
    }
    
    const saveBtn = document.querySelector('#gradebookCard .btn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveGrades());
    }
    
    const finalizeBtn = document.querySelector('#gradebookCard .btn-finalize');
    if (finalizeBtn) {
      finalizeBtn.addEventListener('click', () => this.finalizeGrades());
    }
    
    const finalizeModal = document.getElementById('finalizeGradesModal');
    if (finalizeModal) {
      finalizeModal.addEventListener('click', (e) => {
        if (e.target === finalizeModal) this.closeFinalizeModal();
      });
    }
    
    const confirmBtn = document.querySelector('#finalizeGradesModal .assess-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.confirmFinalizeGrades());
    }
  },
  
  getStatusBadge(status) {
    const map = {
      "Pending": "status-pending",
      "In Progress": "status-excused",
      "Finalized": "status-enrolled"
    };
    return map[status] || "status-pending";
  },
  
  computeStatus(student) {
    if (student.status === "Finalized") return "Finalized";
    if (student.semGrade) return "In Progress";
    if (student.midterm || student.final) return "In Progress";
    return "Pending";
  },
  
  showGradeNotif(message, isSuccess) {
    const notif = document.getElementById('gradebookNotif');
    if (!notif) return;
    
    if (this.gradeNotifTimeout) clearTimeout(this.gradeNotifTimeout);
    
    notif.textContent = message;
    notif.style.background = isSuccess ? '#d4edda' : '#f8d7da';
    notif.style.color = isSuccess ? '#155724' : '#721c24';
    notif.style.display = 'block';
    notif.classList.remove('hide');
    
    this.gradeNotifTimeout = setTimeout(() => {
      notif.classList.add('hide');
      setTimeout(() => {
        notif.style.display = 'none';
        notif.classList.remove('hide');
      }, 500);
    }, 3500);
  },
  
  updateGradeSummary(students) {
    const total = students.length;
    const graded = students.filter(s => s.semGrade !== "").length;
    const pending = total - graded;
    
    const grades = students
      .filter(s => s.semGrade && !isNaN(parseFloat(s.semGrade)))
      .map(s => parseFloat(s.semGrade));
    
    const average = grades.length > 0
      ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
      : "--";
    
    const totalEl = document.getElementById('totalStudents');
    const gradedEl = document.getElementById('gradedCount');
    const pendingEl = document.getElementById('pendingCount');
    const averageEl = document.getElementById('averageGrade');
    
    if (totalEl) totalEl.textContent = total;
    if (gradedEl) gradedEl.textContent = graded;
    if (pendingEl) pendingEl.textContent = pending;
    if (averageEl) averageEl.textContent = average;
  },
  
  renderGradebook(classCode) {
    const classData = this.gradebookData[classCode];
    if (!classData) return;
    
    this.currentClassCode = classCode;
    
    const tbody = document.getElementById('gradebookBody');
    const title = document.getElementById('gradebookTitle');
    
    if (title) title.textContent = `Gradebook — ${classData.title}`;
    if (tbody) {
      tbody.innerHTML = '';
      
      classData.students.forEach((s, index) => {
        const isFinalized = s.status === 'Finalized';
        const displaySem = s.semGrade || '--';
        const status = this.computeStatus(s);
        
        const tr = document.createElement('tr');
        tr.id = `gradeRow-${classCode}-${index}`;
        tr.innerHTML = `
          <td>${s.studentNo} </td>
          <td>${s.name} </td>
          <td>
            <input type="text" class="table-input" value="${s.midterm}" 
              id="midterm-${classCode}-${index}" 
              placeholder="e.g. 1.75" 
              ${isFinalized ? 'disabled' : ''} />
           <td>
            <input type="text" class="table-input" value="${s.final}" 
              id="final-${classCode}-${index}" 
              placeholder="e.g. 1.75" 
              ${isFinalized ? 'disabled' : ''} />
    
           <td><span class="grade-value" id="semGrade-${classCode}-${index}">${displaySem}</span>
           <td>
            <input type="text" class="table-input" value="${s.remarks}" 
              id="remarks-${classCode}-${index}" 
              placeholder="Optional remarks" 
              ${isFinalized ? 'disabled' : ''} />
           
           <td><span class="status-badge ${this.getStatusBadge(status)}" id="statusBadge-${classCode}-${index}">${status}</span>
        `;
        tbody.appendChild(tr);
        
        // Wire up live grade computation on input change
        if (!isFinalized) {
          const midInput = document.getElementById(`midterm-${classCode}-${index}`);
          const finalInput = document.getElementById(`final-${classCode}-${index}`);
          const semGradeSpan = document.getElementById(`semGrade-${classCode}-${index}`);
          const statusSpan = document.getElementById(`statusBadge-${classCode}-${index}`);
          
          const updateRow = () => {
            const midVal = midInput?.value.trim() || '';
            const finalVal = finalInput?.value.trim() || '';
            
            const midOk = isValidGrade(midVal, VALID_GRADES);
            const finalOk = isValidGrade(finalVal, VALID_GRADES);
            
            if (midInput) {
              midInput.style.borderColor = (!midOk && midVal) ? 'var(--bright-red)' : '';
            }
            if (finalInput) {
              finalInput.style.borderColor = (!finalOk && finalVal) ? 'var(--bright-red)' : '';
            }
            
            const computed = computeSemGrade(midVal, finalVal);
            s.midterm = midVal;
            s.final = finalVal;
            s.semGrade = computed;
            
            if (semGradeSpan) semGradeSpan.textContent = computed || '--';
            
            const newStatus = this.computeStatus(s);
            s.status = newStatus;
            if (statusSpan) {
              statusSpan.textContent = newStatus;
              statusSpan.className = `status-badge ${this.getStatusBadge(newStatus)}`;
            }
            
            this.updateGradeSummary(classData.students);
          };
          
          if (midInput) midInput.addEventListener('input', updateRow);
          if (finalInput) finalInput.addEventListener('input', updateRow);
        }
      });
    }
    
    const gradebookCard = document.getElementById('gradebookCard');
    const gradeSummaryCard = document.getElementById('gradeSummaryCard');
    if (gradebookCard) gradebookCard.style.display = 'block';
    if (gradeSummaryCard) gradeSummaryCard.style.display = 'block';
    
    this.updateGradeSummary(classData.students);
  },
  
  loadGradebook(classCode) {
    if (!classCode) {
      const gradebookCard = document.getElementById('gradebookCard');
      const gradeSummaryCard = document.getElementById('gradeSummaryCard');
      if (gradebookCard) gradebookCard.style.display = 'none';
      if (gradeSummaryCard) gradeSummaryCard.style.display = 'none';
      return;
    }
    this.renderGradebook(classCode);
  },
  
  saveGrades() {
    const classCode = this.currentClassCode;
    if (!classCode) {
      this.showGradeNotif('⚠ Please select a class first.', false);
      return;
    }
    
    const classData = this.gradebookData[classCode];
    if (!classData) return;
    
    let hasInvalid = false;
    classData.students.forEach((s, index) => {
      if (s.status === 'Finalized') return;
      const midVal = document.getElementById(`midterm-${classCode}-${index}`)?.value.trim() || '';
      const finalVal = document.getElementById(`final-${classCode}-${index}`)?.value.trim() || '';
      
      if ((!isValidGrade(midVal, VALID_GRADES) && midVal) || 
          (!isValidGrade(finalVal, VALID_GRADES) && finalVal)) {
        hasInvalid = true;
      }
    });
    
    if (hasInvalid) {
      this.showGradeNotif('⚠ Please fix invalid grade entries before saving.', false);
      return;
    }
    
    const btn = document.querySelector('#gradebookCard .btn-save');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      this.showGradeNotif('Grades saved successfully! (Demo Only)', true);
    }, 1200);
  },
  
  finalizeGrades() {
    const classCode = this.currentClassCode;
    if (!classCode) {
      this.showGradeNotif('⚠ Please select a class first.', false);
      return;
    }
    
    const classData = this.gradebookData[classCode];
    if (!classData) return;
    
    const incomplete = classData.students.filter(s => 
      s.status !== 'Finalized' && (!s.midterm || !s.final)
    );
    
    const finalizeNotif = document.getElementById('finalizeWarning');
    if (finalizeNotif) {
      if (incomplete.length > 0) {
        finalizeNotif.textContent = `⚠ ${incomplete.length} student(s) still have missing grades. You can still finalize, but those entries will remain as Pending.`;
        finalizeNotif.style.display = 'block';
      } else {
        finalizeNotif.style.display = 'none';
      }
    }
    
    const finalizeClassName = document.getElementById('finalizeClassName');
    const finalizeGradedCount = document.getElementById('finalizeGradedCount');
    const finalizeTotalCount = document.getElementById('finalizeTotalCount');
    
    if (finalizeClassName) finalizeClassName.textContent = classData.title;
    if (finalizeGradedCount) finalizeGradedCount.textContent = classData.students.filter(s => s.semGrade).length;
    if (finalizeTotalCount) finalizeTotalCount.textContent = classData.students.length;
    
    const modal = document.getElementById('finalizeGradesModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeFinalizeModal() {
    const modal = document.getElementById('finalizeGradesModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmFinalizeGrades() {
    const classCode = this.currentClassCode;
    const classData = this.gradebookData[classCode];
    if (!classData) return;
    
    const btn = document.querySelector('#finalizeGradesModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Finalizing...';
    btn.disabled = true;
    
    setTimeout(() => {
      classData.students.forEach((s, index) => {
        if (s.semGrade && s.status !== 'Finalized') {
          s.status = 'Finalized';
          
          const midInput = document.getElementById(`midterm-${classCode}-${index}`);
          const finalInput = document.getElementById(`final-${classCode}-${index}`);
          const remarksInput = document.getElementById(`remarks-${classCode}-${index}`);
          const statusSpan = document.getElementById(`statusBadge-${classCode}-${index}`);
          
          if (midInput) {
            midInput.disabled = true;
            midInput.style.borderColor = '';
          }
          if (finalInput) {
            finalInput.disabled = true;
            finalInput.style.borderColor = '';
          }
          if (remarksInput) remarksInput.disabled = true;
          if (statusSpan) {
            statusSpan.textContent = 'Finalized';
            statusSpan.className = 'status-badge status-enrolled';
          }
        }
      });
      
      this.updateGradeSummary(classData.students);
      
      btn.textContent = original;
      btn.disabled = false;
      this.closeFinalizeModal();
      this.showGradeNotif('Grades finalized and submitted successfully! (Demo Only)', true);
    }, 1500);
  }
};

// Global functions
window.loadGradebook = (classCode) => InstructorGradebook.loadGradebook(classCode);
window.saveGrades = () => InstructorGradebook.saveGrades();
window.finalizeGrades = () => InstructorGradebook.finalizeGrades();
window.closeFinalizeModal = () => InstructorGradebook.closeFinalizeModal();
window.confirmFinalizeGrades = () => InstructorGradebook.confirmFinalizeGrades();