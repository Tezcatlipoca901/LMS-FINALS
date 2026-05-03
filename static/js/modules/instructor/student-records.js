// Instructor student records view
import { $, addClass, removeClass, setText, setHTML } from '../../core/dom-helpers.js';

export const InstructorStudentRecords = {
  studentData: {},
  
  init() {
    this.initMockData();
    this.bindEvents();
  },
  
  initMockData() {
    this.studentData = {
      "2025-00156-SM-0": {
        name: "Franky Super",
        course: "BSIT - 1st Year",
        class: "IT 101 (1A)",
        email: "superfranky@iskolarngbayan.pup.edu.ph",
        history: [
          { sem: "1st Sem 2024-2025", code: "GEED001", subject: "Purposive Communication", grade: "1.50", units: 3 },
          { sem: "1st Sem 2024-2025", code: "GEED002", subject: "Mathematics in the Modern World", grade: "1.75", units: 3 }
        ],
        enrolled: [
          { code: "IT101", subject: "Introduction to Computing", section: "1A", units: 3 },
          { code: "GEED003", subject: "Science, Technology & Society", section: "1A", units: 3 }
        ]
      },
      "2025-00201-SM-0": {
        name: "Johnny Test",
        course: "BSIT - 1st Year",
        class: "IT 101 (1A)",
        email: "johnnytest@iskolarngbayan.pup.edu.ph",
        history: [
          { sem: "1st Sem 2024-2025", code: "GEED001", subject: "Purposive Communication", grade: "2.00", units: 3 },
          { sem: "1st Sem 2024-2025", code: "GEED002", subject: "Mathematics in the Modern World", grade: "2.25", units: 3 }
        ],
        enrolled: [
          { code: "IT101", subject: "Introduction to Computing", section: "1A", units: 3 },
          { code: "GEED003", subject: "Science, Technology & Society", section: "1A", units: 3 }
        ]
      },
      "2024-00123-SM-0": {
        name: "Optimus Prime",
        course: "BSIT - 2nd Year",
        class: "IT 071 (2B)",
        email: "optimusprime@iskolarngbayan.pup.edu.ph",
        history: [
          { sem: "1st Sem 2024-2025", code: "IT101", subject: "Introduction to Computing", grade: "1.25", units: 3 },
          { sem: "1st Sem 2024-2025", code: "IT102", subject: "Computer Programming 1", grade: "1.50", units: 3 },
          { sem: "2nd Sem 2024-2025", code: "IT103", subject: "Computer Programming 2", grade: "1.75", units: 3 }
        ],
        enrolled: [
          { code: "IT071", subject: "Data Structures and Algorithms", section: "2B", units: 3 },
          { code: "IT072", subject: "Object Oriented Programming", section: "2B", units: 3 }
        ]
      },
      "2024-00178-SM-0": {
        name: "Clark Kent",
        course: "BSIT - 2nd Year",
        class: "IT 071 (2B)",
        email: "clarkkent@iskolarngbayan.pup.edu.ph",
        history: [
          { sem: "1st Sem 2024-2025", code: "IT101", subject: "Introduction to Computing", grade: "1.75", units: 3 },
          { sem: "1st Sem 2024-2025", code: "IT102", subject: "Computer Programming 1", grade: "2.00", units: 3 },
          { sem: "2nd Sem 2024-2025", code: "IT103", subject: "Computer Programming 2", grade: "2.00", units: 3 }
        ],
        enrolled: [
          { code: "IT071", subject: "Data Structures and Algorithms", section: "2B", units: 3 },
          { code: "IT072", subject: "Object Oriented Programming", section: "2B", units: 3 }
        ]
      },
      "2023-00154-SM-0": {
        name: "Carlos Agassi",
        course: "BSIT - 3rd Year",
        class: "IT 083 (3A)",
        email: "carlosagassi@iskolarngbayan.pup.edu.ph",
        history: [
          { sem: "1st Sem 2023-2024", code: "IT101", subject: "Introduction to Computing", grade: "1.50", units: 3 },
          { sem: "1st Sem 2023-2024", code: "IT102", subject: "Computer Programming 1", grade: "1.75", units: 3 },
          { sem: "2nd Sem 2023-2024", code: "IT103", subject: "Computer Programming 2", grade: "1.75", units: 3 },
          { sem: "2nd Sem 2023-2024", code: "IT071", subject: "Data Structures and Algorithms", grade: "2.00", units: 3 }
        ],
        enrolled: [
          { code: "IT083", subject: "Database Systems", section: "3A", units: 3 },
          { code: "IT084", subject: "Systems Analysis and Design", section: "3A", units: 3 }
        ]
      },
      "2022-00001-SM-0": {
        name: "Vega Punk",
        course: "BSIT - 4th Year",
        class: "IT 101 (4A)",
        email: "vegapunk@iskolarngbayan.pup.edu.ph",
        history: [
          { sem: "1st Sem 2022-2023", code: "IT101", subject: "Introduction to Computing", grade: "1.00", units: 3 },
          { sem: "1st Sem 2022-2023", code: "IT102", subject: "Computer Programming 1", grade: "1.25", units: 3 },
          { sem: "2nd Sem 2022-2023", code: "IT103", subject: "Computer Programming 2", grade: "1.25", units: 3 },
          { sem: "2nd Sem 2022-2023", code: "IT071", subject: "Data Structures and Algorithms", grade: "1.50", units: 3 },
          { sem: "1st Sem 2023-2024", code: "IT083", subject: "Database Systems", grade: "1.25", units: 3 },
          { sem: "1st Sem 2023-2024", code: "IT084", subject: "Systems Analysis and Design", grade: "1.50", units: 3 }
        ],
        enrolled: [
          { code: "IT101", subject: "Integrative Programming and Technologies", section: "4A", units: 3 },
          { code: "IT499", subject: "Capstone Project", section: "4A", units: 6 }
        ]
      }
    };
  },
  
  bindEvents() {
    const modal = document.getElementById('instrStudentProfileModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }
    
    const classFilter = document.getElementById('classFilter');
    if (classFilter) {
      classFilter.addEventListener('change', (e) => this.filterByClass(e.target.value));
    }
    
    const searchInput = document.getElementById('studentSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.searchStudents(e.target.value));
    }
  },
  
  openModal(btn) {
    const row = btn.closest('tr');
    const cells = row.querySelectorAll('td');
    
    // Cell order: Student No | Name | Course | Class | Email | Action
    const studentNo = cells[0]?.textContent.trim() || '';
    const data = this.studentData[studentNo];
    
    if (!data) {
      alert(`No profile data found for student: ${studentNo}`);
      return;
    }
    
    const subtitle = document.getElementById('instrProfileSubtitle');
    const studentNoSpan = document.getElementById('instrProfileStudentNo');
    const fullNameSpan = document.getElementById('instrProfileFullName');
    const courseSpan = document.getElementById('instrProfileCourse');
    const classSpan = document.getElementById('instrProfileClass');
    const emailSpan = document.getElementById('instrProfileEmail');
    
    if (subtitle) subtitle.textContent = `${studentNo} — ${data.course}`;
    if (studentNoSpan) studentNoSpan.textContent = studentNo;
    if (fullNameSpan) fullNameSpan.textContent = data.name;
    if (courseSpan) courseSpan.textContent = data.course;
    if (classSpan) classSpan.textContent = data.class;
    if (emailSpan) emailSpan.textContent = data.email;
    
    // Populate academic history table
    const histBody = document.getElementById('instrProfileHistoryBody');
    if (histBody) {
      histBody.innerHTML = '';
      
      if (data.history.length === 0) {
        histBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--gray-dark); font-style:italic; padding:16px;">No academic history on record.</td></tr>';
      } else {
        data.history.forEach((h) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${h.sem} 
            <td>${h.code} 
            <td>${h.subject} 
            <td>${h.grade} 
            <td>${h.units} 
          `;
          histBody.appendChild(tr);
        });
      }
    }
    
    // Populate current enrollment table
    const enrollBody = document.getElementById('instrProfileEnrollBody');
    if (enrollBody) {
      enrollBody.innerHTML = '';
      
      if (data.enrolled.length === 0) {
        enrollBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--gray-dark); font-style:italic; padding:16px;">No current enrollment on record.</td></tr>';
      } else {
        data.enrolled.forEach((e) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${e.code} 
            <td>${e.subject} 
            <td>${e.section} 
            <td>${e.units} 
          `;
          enrollBody.appendChild(tr);
        });
      }
    }
    
    const modal = document.getElementById('instrStudentProfileModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeModal() {
    const modal = document.getElementById('instrStudentProfileModal');
    if (modal) removeClass(modal, 'active');
  },
  
  filterByClass(value) {
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach((row) => {
      const classCell = row.querySelectorAll('td')[3];
      if (!classCell) return;
      row.style.display = (value === 'all' || classCell.textContent.trim().toLowerCase().includes(value.toLowerCase()))
        ? '' : 'none';
    });
  },
  
  searchStudents(query) {
    const rows = document.querySelectorAll('.data-table tbody tr');
    const q = query.trim().toLowerCase();
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (!cells.length) return;
      const studentNo = cells[0]?.textContent.toLowerCase() || '';
      const name = cells[1]?.textContent.toLowerCase() || '';
      row.style.display = (!q || studentNo.includes(q) || name.includes(q)) ? '' : 'none';
    });
  }
};

// Global functions
window.openInstrStudentProfile = (btn) => InstructorStudentRecords.openModal(btn);
window.closeInstrStudentProfile = () => InstructorStudentRecords.closeModal();
window.filterStudentsByClass = (value) => InstructorStudentRecords.filterByClass(value);
window.searchStudents = (query) => InstructorStudentRecords.searchStudents(query);