// Admin degree audit management
import { $, $$, addClass, removeClass, setText, setHTML, showElement, hideElement } from '../../core/dom-helpers.js';

export const AdminDegreeAudit = {
  auditStudentData: {},
  statusClass: {},
  
  init() {
    this.initMockData();
    this.bindEvents();
  },
  
  initMockData() {
    this.statusClass = {
      "Completed": "status-enrolled",
      "In Progress": "status-pending",
      "Not Taken": "status-NotTaken"
    };
    
    this.auditStudentData = {
      "2022-00761-SM-0": {
        name: "Monkey D. Luffy",
        program: "Bachelor of Science in Information Technology",
        year: "4th Year",
        gwa: "1.75",
        grad: "June 2026",
        totalUnits: 162,
        curriculum: [
          { code: "IT101",   name: "Introduction to Computing",       units: 3, grade: "1.25", status: "Completed" },
          { code: "IT102",   name: "Computer Programming 1",          units: 3, grade: "1.50", status: "Completed" },
          { code: "IT103",   name: "Computer Programming 2",          units: 3, grade: "1.75", status: "Completed" },
          { code: "IT104",   name: "Computer Programming 3",          units: 3, grade: "1.50", status: "Completed" },
          { code: "IT105",   name: "Computer Programming 4",          units: 3, grade: "1.50", status: "Completed" },
          { code: "IT201",   name: "Data Structures & Algorithms",    units: 3, grade: "1.75", status: "Completed" },
          { code: "IT301",   name: "Human Computer Interaction",      units: 3, grade: "2.00", status: "Completed" },
          { code: "IT401",   name: "Systems Analysis & Design",       units: 3, grade: "1.75", status: "Completed" },
          { code: "GEED001", name: "Purposive Communication",         units: 3, grade: "1.50", status: "Completed" },
          { code: "GEED002", name: "Mathematics in the Modern World", units: 3, grade: "1.75", status: "Completed" },
          { code: "GEED401", name: "On the Job Training",             units: 3, grade: "--",   status: "In Progress" },
          { code: "IT499",   name: "Capstone Project",                units: 6, grade: "--",   status: "Not Taken" }
        ],
        checklist: [
          { label: "All core courses completed",       met: true },
          { label: "Elective requirements met",        met: true },
          { label: "OJT completed",                    met: false },
          { label: "Capstone project completed",       met: false },
          { label: "All clearances obtained",          met: false }
        ]
      },
      "2021-00432-SM-0": {
        name: "Roronoa Zoro",
        program: "Bachelor of Science in Information Technology",
        year: "4th Year",
        gwa: "1.50",
        grad: "June 2026",
        totalUnits: 162,
        curriculum: [
          { code: "IT101",   name: "Introduction to Computing",       units: 3, grade: "1.25", status: "Completed" },
          { code: "IT102",   name: "Computer Programming 1",          units: 3, grade: "1.00", status: "Completed" },
          { code: "IT103",   name: "Computer Programming 2",          units: 3, grade: "1.25", status: "Completed" },
          { code: "IT104",   name: "Computer Programming 3",          units: 3, grade: "1.50", status: "Completed" },
          { code: "IT105",   name: "Computer Programming 4",          units: 3, grade: "1.50", status: "Completed" },
          { code: "IT201",   name: "Data Structures & Algorithms",    units: 3, grade: "1.25", status: "Completed" },
          { code: "IT301",   name: "Human Computer Interaction",      units: 3, grade: "1.50", status: "Completed" },
          { code: "IT401",   name: "Systems Analysis & Design",       units: 3, grade: "1.75", status: "Completed" },
          { code: "GEED001", name: "Purposive Communication",         units: 3, grade: "1.50", status: "Completed" },
          { code: "GEED002", name: "Mathematics in the Modern World", units: 3, grade: "1.25", status: "Completed" },
          { code: "GEED401", name: "On the Job Training",             units: 3, grade: "1.25", status: "Completed" },
          { code: "IT499",   name: "Capstone Project",                units: 6, grade: "1.50", status: "Completed" }
        ],
        checklist: [
          { label: "All core courses completed",       met: true },
          { label: "Elective requirements met",        met: true },
          { label: "OJT completed",                    met: true },
          { label: "Capstone project completed",       met: true },
          { label: "All clearances obtained",          met: true }
        ]
      },
      "2023-00198-SM-0": {
        name: "Nami",
        program: "Bachelor of Science in Accountancy",
        year: "2nd Year",
        gwa: "2.25",
        grad: "June 2028",
        totalUnits: 180,
        curriculum: [
          { code: "ACCO101", name: "Fundamentals of Accounting 1",    units: 3, grade: "2.00", status: "Completed" },
          { code: "ACCO102", name: "Fundamentals of Accounting 2",    units: 3, grade: "2.25", status: "Completed" },
          { code: "ACCO201", name: "Intermediate Accounting 1",       units: 3, grade: "2.50", status: "Completed" },
          { code: "ACCO202", name: "Intermediate Accounting 2",       units: 3, grade: "--",   status: "In Progress" },
          { code: "GEED001", name: "Purposive Communication",         units: 3, grade: "2.00", status: "Completed" },
          { code: "GEED002", name: "Mathematics in the Modern World", units: 3, grade: "2.25", status: "Completed" },
          { code: "ACCO301", name: "Advanced Accounting",             units: 3, grade: "--",   status: "Not Taken" },
          { code: "ACCO401", name: "Auditing & Assurance",            units: 3, grade: "--",   status: "Not Taken" },
          { code: "ACCO499", name: "CPA Board Review",                units: 6, grade: "--",   status: "Not Taken" }
        ],
        checklist: [
          { label: "All core courses completed",        met: false },
          { label: "Elective requirements met",         met: false },
          { label: "OJT completed",                     met: false },
          { label: "Capstone / Board Review completed", met: false },
          { label: "All clearances obtained",           met: false }
        ]
      },
      "2022-00310-SM-0": {
        name: "Nico Robin",
        program: "Bachelor of Science in Hospitality Management",
        year: "3rd Year",
        gwa: "1.90",
        grad: "June 2027",
        totalUnits: 168,
        curriculum: [
          { code: "HM101",   name: "Introduction to Hospitality",     units: 3, grade: "1.75", status: "Completed" },
          { code: "HM102",   name: "Food & Beverage Management",      units: 3, grade: "2.00", status: "Completed" },
          { code: "HM201",   name: "Front Office Operations",         units: 3, grade: "1.75", status: "Completed" },
          { code: "HM202",   name: "Housekeeping Management",         units: 3, grade: "2.00", status: "Completed" },
          { code: "HM301",   name: "Events Management",               units: 3, grade: "1.75", status: "Completed" },
          { code: "GEED001", name: "Purposive Communication",         units: 3, grade: "1.50", status: "Completed" },
          { code: "GEED002", name: "Mathematics in the Modern World", units: 3, grade: "2.00", status: "Completed" },
          { code: "HM302",   name: "Tourism Planning & Development",  units: 3, grade: "--",   status: "In Progress" },
          { code: "HM401",   name: "Practicum",                       units: 6, grade: "--",   status: "Not Taken" },
          { code: "HM499",   name: "Capstone Project",                units: 6, grade: "--",   status: "Not Taken" }
        ],
        checklist: [
          { label: "All core courses completed",       met: false },
          { label: "Elective requirements met",        met: true },
          { label: "OJT / Practicum completed",        met: false },
          { label: "Capstone project completed",       met: false },
          { label: "All clearances obtained",          met: false }
        ]
      }
    };
  },
  
  bindEvents() {
    const searchInput = document.getElementById('searchStudentAudit');
    const btnSearch = document.getElementById('btnSearchAudit');
    
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.runAudit();
      });
    }
    
    if (btnSearch) {
      btnSearch.addEventListener('click', () => this.runAudit());
    }
  },
  
  showNotif(message, isSuccess) {
    const notifEl = document.getElementById('auditSearchNotif');
    if (!notifEl) return;
    notifEl.textContent = message;
    notifEl.style.background = isSuccess ? '#d4edda' : '#f8d7da';
    notifEl.style.color = isSuccess ? '#155724' : '#721c24';
    notifEl.style.padding = '10px 14px';
    notifEl.style.borderRadius = '6px';
    notifEl.style.fontSize = '13px';
    notifEl.style.display = 'block';
    
    setTimeout(() => {
      notifEl.style.display = 'none';
    }, 3500);
  },
  
  runAudit() {
    const searchInput = document.getElementById('searchStudentAudit');
    const query = searchInput?.value.trim().toLowerCase() || '';
    const resultsWrapper = document.getElementById('auditResultsWrapper');
    
    if (!query) {
      this.showNotif('⚠ Please enter a student number or name.', false);
      if (resultsWrapper) resultsWrapper.style.display = 'none';
      return;
    }
    
    let foundKey = null;
    let foundData = null;
    
    Object.keys(this.auditStudentData).forEach((key) => {
      const s = this.auditStudentData[key];
      if (key.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)) {
        foundKey = key;
        foundData = s;
      }
    });
    
    if (!foundData) {
      this.showNotif('⚠ No student found matching "' + query + '". Try: Luffy, Zoro, Nami, or Robin.', false);
      if (resultsWrapper) resultsWrapper.style.display = 'none';
      return;
    }
    
    this.renderAudit(foundKey, foundData);
  },
  
  renderAudit(key, s) {
    const completedUnits = s.curriculum
      .filter(c => c.status === 'Completed')
      .reduce((sum, c) => sum + c.units, 0);
    
    const rate = ((completedUnits / s.totalUnits) * 100).toFixed(1);
    
    const auditCardHeader = document.getElementById('auditCardHeader');
    if (auditCardHeader) {
      auditCardHeader.textContent = `Degree Audit — ${s.name} (${key})`;
    }
    
    const auditProgram = document.getElementById('auditProgram');
    const auditYear = document.getElementById('auditYear');
    const auditUnits = document.getElementById('auditUnits');
    const auditGwa = document.getElementById('auditGwa');
    const auditRate = document.getElementById('auditRate');
    const auditGrad = document.getElementById('auditGrad');
    
    if (auditProgram) auditProgram.textContent = s.program;
    if (auditYear) auditYear.textContent = s.year;
    if (auditUnits) auditUnits.textContent = `${completedUnits} / ${s.totalUnits}`;
    if (auditGwa) auditGwa.textContent = s.gwa;
    if (auditRate) auditRate.textContent = `${rate}%`;
    if (auditGrad) auditGrad.textContent = s.grad;
    
    const tbody = document.getElementById('auditCurriculumBody');
    if (tbody) {
      tbody.innerHTML = '';
      s.curriculum.forEach((c) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.code} </td>
          <td>${c.name} </td>
          <td>${c.units} </td>
          <td>${c.grade} </td>
          <td><span class="status-badge ${this.statusClass[c.status] || ''}">${c.status}</span> </td>
        `;
        tbody.appendChild(tr);
      });
    }
    
    const checklistEl = document.getElementById('auditChecklist');
    if (checklistEl) {
      checklistEl.innerHTML = '';
      const allMet = s.checklist.every(item => item.met);
      
      s.checklist.forEach((item) => {
        const label = document.createElement('label');
        label.className = 'checklist-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.met;
        checkbox.disabled = true;
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + item.label));
        checklistEl.appendChild(label);
      });
      
      const auditStatus = document.getElementById('auditStatus');
      if (auditStatus) {
        if (allMet) {
          auditStatus.textContent = 'Status: Eligible for Graduation';
          auditStatus.style.color = 'var(--bright-green)';
        } else {
          const unmetCount = s.checklist.filter(i => !i.met).length;
          auditStatus.textContent = `Status: Not yet eligible for graduation (${unmetCount} requirement${unmetCount > 1 ? 's' : ''} remaining)`;
          auditStatus.style.color = 'var(--bright-red)';
        }
      }
    }
    
    const resultsWrapper = document.getElementById('auditResultsWrapper');
    if (resultsWrapper) {
      resultsWrapper.style.display = 'block';
      resultsWrapper.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// Global functions
window.searchStudentAudit = () => AdminDegreeAudit.runAudit();