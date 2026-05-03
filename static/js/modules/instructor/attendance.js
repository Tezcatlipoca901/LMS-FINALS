// Instructor attendance management
import { $, $$, addClass, removeClass, setText, setHTML, showElement, hideElement } from '../../core/dom-helpers.js';
import { STATUS_BADGE_CLASS } from '../../core/constants.js';

export const InstructorAttendance = {
  classSections: {},
  classNames: {},
  rosterData: {},
  attendanceHistoryData: {},
  currentClassCode: null,
  currentSectionCode: null,
  
  init() {
    this.initMockData();
    this.bindEvents();
  },
  
  initMockData() {
    this.classSections = {
      IT101: ["1A", "1B"],
      IT102: ["1C", "1D"],
      IT071: ["2A", "2B"],
      IT022: ["3A", "3B"],
      IT083: ["4A"]
    };
    
    this.classNames = {
      IT101: "IT 101 - Introduction to Computing",
      IT102: "IT 102 - Computer Programming 1",
      IT071: "IT 071 - Data Structures and Algorithms",
      IT022: "IT 022 - Human Computer Interaction",
      IT083: "IT 083 - Database Systems"
    };
    
    this.rosterData = {
      "IT101-1A": [
        { studentNo: "2025-00230-SM-0", name: "Monkey D. Luffy",    status: "Present", remarks: "" },
        { studentNo: "2025-00244-SM-0", name: "Roronoa Zoro",       status: "Late",    remarks: "Arrived 20 mins late" },
        { studentNo: "2025-00256-SM-0", name: "Nami",               status: "Present", remarks: "" },
        { studentNo: "2025-00322-SM-0", name: "Usopp",              status: "Absent",  remarks: "" },
        { studentNo: "2025-00111-SM-0", name: "Vinsmoke Sanji",     status: "Present", remarks: "" },
        { studentNo: "2025-00125-SM-0", name: "Tony Tony Chopper",  status: "Excused", remarks: "Medical appointment" },
        { studentNo: "2025-00211-SM-0", name: "Nico Robin",         status: "Present", remarks: "" }
      ],
      "IT101-1B": [
        { studentNo: "2025-00111-SM-0", name: "Franky Super",       status: "Present", remarks: "" },
        { studentNo: "2025-00112-SM-0", name: "Brook",              status: "Absent",  remarks: "" },
        { studentNo: "2025-00113-SM-0", name: "Jinbe",              status: "Present", remarks: "" },
        { studentNo: "2025-00114-SM-0", name: "Yamato",             status: "Late",    remarks: "Arrived 15 mins late" },
        { studentNo: "2025-00115-SM-0", name: "Vivi Nefertari",     status: "Present", remarks: "" }
      ],
      "IT102-1C": [
        { studentNo: "2025-00151-SM-0", name: "Trafalgar D. Law",   status: "Present", remarks: "" },
        { studentNo: "2025-00152-SM-0", name: "Eustass Kid",        status: "Absent",  remarks: "" },
        { studentNo: "2025-00153-SM-0", name: "Killer",             status: "Present", remarks: "" },
        { studentNo: "2025-00154-SM-0", name: "Carrot",             status: "Excused", remarks: "Family matter" },
        { studentNo: "2025-00155-SM-0", name: "Portgas D. Ace",     status: "Present", remarks: "" },
        { studentNo: "2025-00156-SM-0", name: "Sabo",               status: "Late",    remarks: "Arrived 10 mins late" },
        { studentNo: "2025-00157-SM-0", name: "Marco the Phoenix",  status: "Present", remarks: "" }
      ],
      "IT102-1D": [
        { studentNo: "2025-00161-SM-0", name: "Dracule Mihawk",     status: "Present", remarks: "" },
        { studentNo: "2025-00162-SM-0", name: "Boa Hancock",        status: "Present", remarks: "" },
        { studentNo: "2025-00163-SM-0", name: "Silvers Rayleigh",   status: "Absent",  remarks: "" },
        { studentNo: "2025-00164-SM-0", name: "Charlotte Katakuri", status: "Present", remarks: "" }
      ],
      "IT071-2A": [
        { studentNo: "2024-00201-SM-0", name: "Shanks",                status: "Present", remarks: "" },
        { studentNo: "2024-00202-SM-0", name: "Buggy D. Clown",        status: "Absent",  remarks: "" },
        { studentNo: "2024-00203-SM-0", name: "Crocodile",             status: "Present", remarks: "" },
        { studentNo: "2024-00204-SM-0", name: "Donquixote Doflamingo", status: "Late",    remarks: "Arrived 5 mins late" }
      ],
      "IT071-2B": [
        { studentNo: "2024-00211-SM-0", name: "Bartholomew Kuma",   status: "Present", remarks: "" },
        { studentNo: "2024-00212-SM-0", name: "Gecko Moria",        status: "Excused", remarks: "Medical leave" },
        { studentNo: "2024-00213-SM-0", name: "Jinbe",              status: "Present", remarks: "" },
        { studentNo: "2024-00214-SM-0", name: "Marshall D. Teach",  status: "Absent",  remarks: "" },
        { studentNo: "2024-00215-SM-0", name: "Edward Newgate",     status: "Present", remarks: "" }
      ],
      "IT022-3A": [
        { studentNo: "2023-00301-SM-0", name: "Gol D. Roger",       status: "Present", remarks: "" },
        { studentNo: "2023-00302-SM-0", name: "Rocks D. Xebec",     status: "Absent",  remarks: "" },
        { studentNo: "2023-00303-SM-0", name: "Monkey D. Garp",     status: "Present", remarks: "" },
        { studentNo: "2023-00304-SM-0", name: "Sengoku",            status: "Late",    remarks: "Arrived 8 mins late" }
      ],
      "IT022-3B": [
        { studentNo: "2023-00311-SM-0", name: "Tsuru",              status: "Present", remarks: "" },
        { studentNo: "2023-00312-SM-0", name: "Kuzan",              status: "Present", remarks: "" },
        { studentNo: "2023-00313-SM-0", name: "Borsalino",          status: "Absent",  remarks: "" },
        { studentNo: "2023-00314-SM-0", name: "Sakazuki",           status: "Excused", remarks: "Official errand" }
      ],
      "IT083-4A": [
        { studentNo: "2022-00401-SM-0", name: "Vista Flower Blade", status: "Present", remarks: "" },
        { studentNo: "2022-00402-SM-0", name: "Curiel",             status: "Present", remarks: "" },
        { studentNo: "2022-00403-SM-0", name: "Jozu Diamond",       status: "Absent",  remarks: "" },
        { studentNo: "2022-00404-SM-0", name: "Kozuki Oden",        status: "Present", remarks: "" },
        { studentNo: "2022-00405-SM-0", name: "Edward Weevil",      status: "Late",    remarks: "Arrived 12 mins late" }
      ]
    };
    
    this.attendanceHistoryData = {
      IT101: [
        {
          date: "2026-03-26", day: "Thursday", time: "08:00 AM - 10:00 AM",
          present: 5, absent: 1, late: 1, excused: 1,
          students: [
            { studentNo: "2025-00230-SM-0", name: "Monkey D. Luffy",   status: "Present", remarks: "" },
            { studentNo: "2025-00244-SM-0", name: "Roronoa Zoro",      status: "Late",    remarks: "Arrived 20 mins late" },
            { studentNo: "2025-00256-SM-0", name: "Nami",              status: "Present", remarks: "" },
            { studentNo: "2025-00322-SM-0", name: "Usopp",             status: "Absent",  remarks: "" },
            { studentNo: "2025-00111-SM-0", name: "Vinsmoke Sanji",    status: "Present", remarks: "" },
            { studentNo: "2025-00125-SM-0", name: "Tony Tony Chopper", status: "Excused", remarks: "Medical appointment" },
            { studentNo: "2025-00211-SM-0", name: "Nico Robin",        status: "Present", remarks: "" }
          ]
        },
        {
          date: "2026-03-24", day: "Tuesday", time: "08:00 AM - 10:00 AM",
          present: 6, absent: 0, late: 1, excused: 0,
          students: [
            { studentNo: "2025-00230-SM-0", name: "Monkey D. Luffy",   status: "Present", remarks: "" },
            { studentNo: "2025-00244-SM-0", name: "Roronoa Zoro",      status: "Late",    remarks: "Arrived 10 mins late" },
            { studentNo: "2025-00256-SM-0", name: "Nami",              status: "Present", remarks: "" },
            { studentNo: "2025-00322-SM-0", name: "Usopp",             status: "Present", remarks: "" },
            { studentNo: "2025-00111-SM-0", name: "Vinsmoke Sanji",    status: "Present", remarks: "" },
            { studentNo: "2025-00125-SM-0", name: "Tony Tony Chopper", status: "Present", remarks: "" },
            { studentNo: "2025-00211-SM-0", name: "Nico Robin",        status: "Present", remarks: "" }
          ]
        }
      ],
      IT102: [
        {
          date: "2026-03-25", day: "Wednesday", time: "10:00 AM - 12:00 PM",
          present: 4, absent: 1, late: 1, excused: 1,
          students: [
            { studentNo: "2025-00151-SM-0", name: "Trafalgar D. Law",  status: "Present", remarks: "" },
            { studentNo: "2025-00152-SM-0", name: "Eustass Kid",       status: "Absent",  remarks: "" },
            { studentNo: "2025-00153-SM-0", name: "Killer",            status: "Present", remarks: "" },
            { studentNo: "2025-00154-SM-0", name: "Carrot",            status: "Late",    remarks: "Arrived 10 mins late" },
            { studentNo: "2025-00155-SM-0", name: "Portgas D. Ace",    status: "Present", remarks: "" },
            { studentNo: "2025-00156-SM-0", name: "Sabo",              status: "Excused", remarks: "Family matter" },
            { studentNo: "2025-00157-SM-0", name: "Marco the Phoenix", status: "Present", remarks: "" }
          ]
        }
      ]
    };
  },
  
  bindEvents() {
    const classSelect = document.getElementById('attendanceClass');
    const sectionSelect = document.getElementById('attendanceSection');
    const dateSelect = document.getElementById('attendanceDate');
    const loadBtn = document.getElementById('btnLoadAttendance');
    const saveBtn = document.querySelector('#attendanceSheetCard .btn-save');
    const submitBtn = document.querySelector('#attendanceSheetCard .btn-finalize');
    
    if (classSelect) {
      classSelect.addEventListener('change', () => this.loadSection());
    }
    
    if (sectionSelect) {
      sectionSelect.addEventListener('change', () => this.hideAttendanceSheet());
    }
    
    if (dateSelect) {
      dateSelect.addEventListener('change', () => this.hideAttendanceSheet());
    }
    
    if (loadBtn) {
      loadBtn.addEventListener('click', () => this.loadAttendanceSheet());
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveAttendance());
    }
    
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitAttendance());
    }
    
    // History dropdown
    const historySelect = document.getElementById('attendanceHistorySelect');
    if (historySelect) {
      historySelect.addEventListener('change', (e) => this.loadAttendanceHistory(e.target.value));
    }
    
    // Modal events
    const submitModal = document.getElementById('submitAttendanceModal');
    if (submitModal) {
      submitModal.addEventListener('click', (e) => {
        if (e.target === submitModal) this.closeSubmitAttendanceModal();
      });
    }
    
    const historyModal = document.getElementById('attendanceHistoryModal');
    if (historyModal) {
      historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) this.closeAttendanceHistoryModal();
      });
    }
    
    const confirmSubmitBtn = document.querySelector('#submitAttendanceModal .assess-confirm-btn');
    if (confirmSubmitBtn) {
      confirmSubmitBtn.addEventListener('click', () => this.confirmSubmitAttendance());
    }
  },
  
  showNotif(message, isSuccess) {
    const notif = document.getElementById('attendanceNotif');
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
  
  updateSummary() {
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    let present = 0, absent = 0, late = 0, excused = 0;
    
    rows.forEach((row) => {
      const sel = row.querySelector('select');
      if (!sel) return;
      const val = sel.value;
      if (val === 'Present') present++;
      else if (val === 'Absent') absent++;
      else if (val === 'Late') late++;
      else if (val === 'Excused') excused++;
    });
    
    const total = present + absent + late + excused;
    const totalEl = document.getElementById('instrAttSummaryTotal');
    const presentEl = document.getElementById('instrAttSummaryPresent');
    const absentEl = document.getElementById('instrAttSummaryAbsent');
    const lateEl = document.getElementById('instrAttSummaryLate');
    const excusedEl = document.getElementById('instrAttSummaryExcused');
    
    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = present;
    if (absentEl) absentEl.textContent = absent;
    if (lateEl) lateEl.textContent = late;
    if (excusedEl) excusedEl.textContent = excused;
  },
  
  hideAttendanceSheet() {
    const sheetCard = document.getElementById('attendanceSheetCard');
    const summaryCard = document.getElementById('instrAttSummaryCard');
    if (sheetCard) sheetCard.style.display = 'none';
    if (summaryCard) summaryCard.style.display = 'none';
  },
  
  loadSection() {
    const classSelect = document.getElementById('attendanceClass');
    const sectionSelect = document.getElementById('attendanceSection');
    
    if (!classSelect || !sectionSelect) return;
    
    const classCode = classSelect.value;
    sectionSelect.innerHTML = '<option value="">-- Select Section --</option>';
    sectionSelect.disabled = true;
    
    this.hideAttendanceSheet();
    
    if (!classCode || !this.classSections[classCode]) return;
    
    this.classSections[classCode].forEach((sec) => {
      const opt = document.createElement('option');
      opt.value = sec;
      opt.textContent = sec;
      sectionSelect.appendChild(opt);
    });
    
    sectionSelect.disabled = false;
  },
  
  loadAttendanceSheet() {
    const classSelect = document.getElementById('attendanceClass');
    const sectionSelect = document.getElementById('attendanceSection');
    const dateSelect = document.getElementById('attendanceDate');
    
    const classCode = classSelect?.value || '';
    const sectionCode = sectionSelect?.value || '';
    const date = dateSelect?.value || '';
    
    if (!classCode) {
      this.showNotif('⚠ Please select a class.', false);
      return;
    }
    if (!sectionCode) {
      this.showNotif('⚠ Please select a section.', false);
      return;
    }
    if (!date) {
      this.showNotif('⚠ Please select a date.', false);
      return;
    }
    
    const rosterKey = `${classCode}-${sectionCode}`;
    const students = this.rosterData[rosterKey] || [];
    
    this.currentClassCode = classCode;
    this.currentSectionCode = sectionCode;
    
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const sheetTitle = document.getElementById('attendanceSheetTitle');
    if (sheetTitle) {
      sheetTitle.textContent = `Attendance Sheet — ${this.classNames[classCode]} (${sectionCode}) — ${formattedDate}`;
    }
    
    const tbody = document.getElementById('attendanceTableBody');
    if (tbody) {
      tbody.innerHTML = '';
      students.forEach((s) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${s.studentNo} 
          <td>${s.name} 
          <td>
            <select class="table-select" data-student="${s.studentNo}">
              <option value="Present" ${s.status === 'Present' ? 'selected' : ''}>Present</option>
              <option value="Absent" ${s.status === 'Absent' ? 'selected' : ''}>Absent</option>
              <option value="Late" ${s.status === 'Late' ? 'selected' : ''}>Late</option>
              <option value="Excused" ${s.status === 'Excused' ? 'selected' : ''}>Excused</option>
            </select>
           
          <td><input type="text" class="table-input" value="${s.remarks || ''}" placeholder="Optional remarks" />
        `;
        tbody.appendChild(tr);
      });
      
      // Wire dropdowns to live-update summary
      tbody.querySelectorAll('select').forEach((sel) => {
        sel.addEventListener('change', () => this.updateSummary());
      });
    }
    
    // Re-enable save/submit buttons
    const saveBtn = document.querySelector('#attendanceSheetCard .btn-save');
    const submitBtn = document.querySelector('#attendanceSheetCard .btn-finalize');
    if (saveBtn) saveBtn.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    
    const allInputs = document.querySelectorAll('#attendanceTableBody select, #attendanceTableBody input');
    allInputs.forEach(el => el.disabled = false);
    
    const sheetCard = document.getElementById('attendanceSheetCard');
    const summaryCard = document.getElementById('instrAttSummaryCard');
    if (sheetCard) sheetCard.style.display = 'block';
    if (summaryCard) summaryCard.style.display = 'block';
    
    this.updateSummary();
    if (sheetCard) sheetCard.scrollIntoView({ behavior: 'smooth' });
  },
  
  saveAttendance() {
    const btn = document.querySelector('#attendanceSheetCard .btn-save');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      this.showNotif('Attendance saved successfully! (Demo Only)', true);
    }, 1200);
  },
  
  submitAttendance() {
    if (!this.currentClassCode || !this.currentSectionCode) {
      this.showNotif('⚠ Please load an attendance sheet first.', false);
      return;
    }
    
    const className = document.getElementById('submitAttClassName');
    const section = document.getElementById('submitAttSection');
    const date = document.getElementById('submitAttDate');
    const presentSpan = document.getElementById('submitAttPresent');
    const absentSpan = document.getElementById('submitAttAbsent');
    const lateSpan = document.getElementById('submitAttLate');
    const excusedSpan = document.getElementById('submitAttExcused');
    
    if (className) className.textContent = this.classNames[this.currentClassCode];
    if (section) section.textContent = this.currentSectionCode;
    if (date) date.textContent = document.getElementById('attendanceDate')?.value || '';
    
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    let present = 0, absent = 0, late = 0, excused = 0;
    rows.forEach((row) => {
      const val = row.querySelector('select')?.value || '';
      if (val === 'Present') present++;
      else if (val === 'Absent') absent++;
      else if (val === 'Late') late++;
      else if (val === 'Excused') excused++;
    });
    
    if (presentSpan) presentSpan.textContent = present;
    if (absentSpan) absentSpan.textContent = absent;
    if (lateSpan) lateSpan.textContent = late;
    if (excusedSpan) excusedSpan.textContent = excused;
    
    const modal = document.getElementById('submitAttendanceModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeSubmitAttendanceModal() {
    const modal = document.getElementById('submitAttendanceModal');
    if (modal) removeClass(modal, 'active');
  },
  
  confirmSubmitAttendance() {
    const btn = document.querySelector('#submitAttendanceModal .assess-confirm-btn');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      this.closeSubmitAttendanceModal();
      
      // Lock the table after submission
      const allInputs = document.querySelectorAll('#attendanceTableBody select, #attendanceTableBody input');
      allInputs.forEach(el => el.disabled = true);
      
      const saveBtn = document.querySelector('#attendanceSheetCard .btn-save');
      const submitBtn = document.querySelector('#attendanceSheetCard .btn-finalize');
      if (saveBtn) saveBtn.disabled = true;
      if (submitBtn) submitBtn.disabled = true;
      
      this.showNotif('Attendance submitted and locked successfully! (Demo Only)', true);
    }, 1500);
  },
  
  loadAttendanceHistory(classCode) {
    const wrapper = document.getElementById('attendanceHistoryWrapper');
    if (!classCode) {
      if (wrapper) wrapper.style.display = 'none';
      return;
    }
    
    const history = this.attendanceHistoryData[classCode] || [];
    const tbody = document.getElementById('attendanceHistoryBody');
    
    if (tbody) {
      tbody.innerHTML = '';
      history.forEach((h, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${h.date}
          <td>${h.day}
          <td>${h.time}
          <td>${h.present}
          <td>${h.absent}
          <td>${h.late}
          <td>${h.excused}
          <td><button class="action-btn" onclick="instrOpenHistoryModal('${classCode}', ${index})">View</button>
        `;
        tbody.appendChild(tr);
      });
    }
    
    if (wrapper) wrapper.style.display = 'block';
  },
  
  openHistoryModal(classCode, index) {
    const record = this.attendanceHistoryData[classCode]?.[index];
    if (!record) return;
    
    const title = document.getElementById('attHistoryModalTitle');
    const subtitle = document.getElementById('attHistoryModalSubtitle');
    const dateSpan = document.getElementById('attHistoryModalDate');
    const daySpan = document.getElementById('attHistoryModalDay');
    const timeSpan = document.getElementById('attHistoryModalTime');
    const presentSpan = document.getElementById('attHistoryModalPresent');
    const absentSpan = document.getElementById('attHistoryModalAbsent');
    const lateSpan = document.getElementById('attHistoryModalLate');
    const excusedSpan = document.getElementById('attHistoryModalExcused');
    const tbody = document.getElementById('attHistoryModalBody');
    
    if (title) title.textContent = this.classNames[classCode];
    if (subtitle) subtitle.textContent = `Attendance record for ${record.date}`;
    if (dateSpan) dateSpan.textContent = record.date;
    if (daySpan) daySpan.textContent = record.day;
    if (timeSpan) timeSpan.textContent = record.time;
    if (presentSpan) presentSpan.textContent = record.present;
    if (absentSpan) absentSpan.textContent = record.absent;
    if (lateSpan) lateSpan.textContent = record.late;
    if (excusedSpan) excusedSpan.textContent = record.excused;
    
    if (tbody) {
      tbody.innerHTML = '';
      record.students.forEach((s) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${s.studentNo}
          <td>${s.name}
          <td><span class="status-badge ${STATUS_BADGE_CLASS[s.status] || ''}">${s.status}</span>
          <td>${s.remarks || '—'}
        `;
        tbody.appendChild(tr);
      });
    }
    
    const modal = document.getElementById('attendanceHistoryModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeAttendanceHistoryModal() {
    const modal = document.getElementById('attendanceHistoryModal');
    if (modal) removeClass(modal, 'active');
  }
};

// Global functions
window.instrAttLoadSection = () => InstructorAttendance.loadSection();
window.instrLoadAttendanceSheet = () => InstructorAttendance.loadAttendanceSheet();
window.instrSaveAttendance = () => InstructorAttendance.saveAttendance();
window.instrSubmitAttendance = () => InstructorAttendance.submitAttendance();
window.closeSubmitAttendanceModal = () => InstructorAttendance.closeSubmitAttendanceModal();
window.confirmSubmitAttendance = () => InstructorAttendance.confirmSubmitAttendance();
window.loadAttendanceHistory = (classCode) => InstructorAttendance.loadAttendanceHistory(classCode);
window.instrOpenHistoryModal = (classCode, index) => InstructorAttendance.openHistoryModal(classCode, index);
window.closeAttendanceHistoryModal = () => InstructorAttendance.closeAttendanceHistoryModal();