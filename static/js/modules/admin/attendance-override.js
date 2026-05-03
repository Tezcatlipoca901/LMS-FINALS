// Admin attendance override management
import { $, $$, addClass, removeClass, setText } from '../../core/dom-helpers.js';

export const AdminAttendanceOverride = {
  attMockData: {},
  statusBadgeClass: {},
  
  init() {
    this.initMockData();
    this.bindEvents();
  },
  
  initMockData() {
    this.statusBadgeClass = {
      Present: 'status-present',
      Absent: 'status-absent',
      Late: 'status-late',
      Excused: 'status-excused'
    };
    
    this.attMockData = {
      IT101: {
        sections: ['BSIT-1A', 'BSIT-1B'],
        students: {
          'BSIT-1A': [
            { no: '2024-00564-SM-0', name: 'Dracule Mihawk',   status: 'Excused' },
            { no: '2024-00579-SM-0', name: 'Red Haired Shanks', status: 'Late' },
            { no: '2024-00890-SM-0', name: 'Nico Robin',        status: 'Absent' },
            { no: '2024-00113-SM-0', name: 'Vinsmoke Sanji',    status: 'Present' },
            { no: '2024-00221-SM-0', name: 'Roronoa Zoro',      status: 'Present' },
            { no: '2024-00332-SM-0', name: 'Nami',              status: 'Present' }
          ],
          'BSIT-1B': [
            { no: '2024-00401-SM-0', name: 'Tony Tony Chopper', status: 'Present' },
            { no: '2024-00402-SM-0', name: 'Usopp',             status: 'Absent' },
            { no: '2024-00403-SM-0', name: 'Franky',            status: 'Present' }
          ]
        }
      },
      GEED002: {
        sections: ['BSA-1A', 'BSHM-1A'],
        students: {
          'BSA-1A': [
            { no: '2024-00501-SM-0', name: 'Marshall D. Teach', status: 'Present' },
            { no: '2024-00502-SM-0', name: 'Monkey D. Luffy',   status: 'Late' },
            { no: '2024-00503-SM-0', name: 'Portgas D. Ace',    status: 'Excused' }
          ],
          'BSHM-1A': [
            { no: '2024-00601-SM-0', name: 'Boa Hancock',       status: 'Present' },
            { no: '2024-00602-SM-0', name: 'Edward Newgate',    status: 'Absent' }
          ]
        }
      },
      GEED001: {
        sections: ['BSIT-2A', 'BSA-2A'],
        students: {
          'BSIT-2A': [
            { no: '2023-00111-SM-0', name: 'Trafalgar Law',     status: 'Present' },
            { no: '2023-00112-SM-0', name: 'Eustass Kid',       status: 'Absent' },
            { no: '2023-00113-SM-0', name: 'Killer',            status: 'Present' }
          ],
          'BSA-2A': [
            { no: '2023-00201-SM-0', name: 'Charlotte Katakuri', status: 'Late' },
            { no: '2023-00202-SM-0', name: 'Carrot',             status: 'Present' }
          ]
        }
      }
    };
  },
  
  bindEvents() {
    const courseSelect = document.getElementById('selectCourseAtt');
    const sectionSelect = document.getElementById('selectSectionAtt');
    const btnLoad = document.getElementById('btnLoadAttendance');
    const dateSelect = document.getElementById('selectDateAtt');
    
    if (courseSelect) {
      courseSelect.addEventListener('change', () => this.onCourseChange());
    }
    
    if (sectionSelect) {
      sectionSelect.addEventListener('change', () => this.hideCards());
    }
    
    if (dateSelect) {
      dateSelect.addEventListener('change', () => this.hideCards());
    }
    
    if (btnLoad) {
      btnLoad.addEventListener('click', () => this.loadAttendance());
    }
  },
  
  onCourseChange() {
    const courseSelect = document.getElementById('selectCourseAtt');
    const sectionSelect = document.getElementById('selectSectionAtt');
    
    if (!courseSelect || !sectionSelect) return;
    
    const course = courseSelect.value;
    sectionSelect.innerHTML = '<option value="">-- Select Section --</option>';
    sectionSelect.disabled = true;
    
    this.hideCards();
    
    if (!course || !this.attMockData[course]) return;
    
    this.attMockData[course].sections.forEach((sec) => {
      const opt = document.createElement('option');
      opt.value = sec;
      opt.textContent = sec;
      sectionSelect.appendChild(opt);
    });
    
    sectionSelect.disabled = false;
  },
  
  hideCards() {
    const recordCard = document.getElementById('attendanceRecordCard');
    const summaryCard = document.getElementById('attendanceSummaryCard');
    if (recordCard) recordCard.style.display = 'none';
    if (summaryCard) summaryCard.style.display = 'none';
  },
  
  showNotif(message, isSuccess) {
    const notifEl = document.getElementById('attLoadNotif');
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
  
  updateSummary() {
    const rows = document.querySelectorAll('#attendanceRecordBody tr');
    let present = 0, absent = 0, late = 0, excused = 0;
    
    rows.forEach((row) => {
      const badge = row.querySelector('.status-badge');
      if (!badge) return;
      const txt = badge.textContent.trim();
      if (txt === 'Present') present++;
      else if (txt === 'Absent') absent++;
      else if (txt === 'Late') late++;
      else if (txt === 'Excused') excused++;
    });
    
    const total = present + absent + late + excused;
    const totalEl = document.getElementById('attSummaryTotal');
    const presentEl = document.getElementById('attSummaryPresent');
    const absentEl = document.getElementById('attSummaryAbsent');
    const lateEl = document.getElementById('attSummaryLate');
    const excusedEl = document.getElementById('attSummaryExcused');
    
    if (totalEl) totalEl.textContent = total;
    if (presentEl) presentEl.textContent = present;
    if (absentEl) absentEl.textContent = absent;
    if (lateEl) lateEl.textContent = late;
    if (excusedEl) excusedEl.textContent = excused;
  },
  
  loadAttendance() {
    const courseSelect = document.getElementById('selectCourseAtt');
    const sectionSelect = document.getElementById('selectSectionAtt');
    const dateSelect = document.getElementById('selectDateAtt');
    
    const course = courseSelect?.value || '';
    const section = sectionSelect?.value || '';
    const date = dateSelect?.value || '';
    
    if (!course) {
      this.showNotif('⚠ Please select a course.', false);
      return;
    }
    if (!section) {
      this.showNotif('⚠ Please select a section.', false);
      return;
    }
    if (!date) {
      this.showNotif('⚠ Please select a date.', false);
      return;
    }
    
    const students = this.attMockData[course]?.students[section] || [];
    
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const recordTitle = document.getElementById('attendanceRecordTitle');
    if (recordTitle) {
      recordTitle.textContent = `Attendance Record — ${course} ${section} (${formattedDate})`;
    }
    
    const recordBody = document.getElementById('attendanceRecordBody');
    if (recordBody) {
      recordBody.innerHTML = '';
      students.forEach((s) => {
        const tr = document.createElement('tr');
        const badgeId = `badge-${s.no.replace(/[^a-z0-9]/gi, '')}`;
        tr.innerHTML = `
          <td>${s.no}</td>
          <td>${s.name}</td>
          <td><span class="status-badge ${this.statusBadgeClass[s.status]}" id="${badgeId}">${s.status}</span></td>
          <td>
            <select class="table-select" data-student="${s.no}">
              <option value="Present" ${s.status === 'Present' ? 'selected' : ''}>Present</option>
              <option value="Absent" ${s.status === 'Absent' ? 'selected' : ''}>Absent</option>
              <option value="Late" ${s.status === 'Late' ? 'selected' : ''}>Late</option>
              <option value="Excused" ${s.status === 'Excused' ? 'selected' : ''}>Excused</option>
            </select>
          </td>
          <td><input type="text" class="table-input" placeholder="Optional remarks" /></td>
          <td><button class="btn-save att-update-btn">Update</button></td>
        `;
        recordBody.appendChild(tr);
      });
      
      // Wire up Update buttons
      recordBody.querySelectorAll('.att-update-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => this.handleUpdateAttendance(e));
      });
    }
    
    const recordCard = document.getElementById('attendanceRecordCard');
    const summaryCard = document.getElementById('attendanceSummaryCard');
    if (recordCard) recordCard.style.display = 'block';
    if (summaryCard) summaryCard.style.display = 'block';
    
    this.updateSummary();
    if (recordCard) recordCard.scrollIntoView({ behavior: 'smooth' });
  },
  
  handleUpdateAttendance(e) {
    const btn = e.currentTarget;
    const row = btn.closest('tr');
    const selEl = row.querySelector('.table-select');
    const newStatus = selEl.value;
    const badge = row.querySelector('.status-badge');
    const studentName = row.cells[1]?.textContent || '';
    
    if (badge) {
      badge.textContent = newStatus;
      badge.className = `status-badge ${this.statusBadgeClass[newStatus] || ''}`;
    }
    
    const originalText = btn.textContent;
    btn.textContent = 'Updated';
    btn.disabled = true;
    btn.style.background = '#28a745';
    
    let notifRow = row.nextElementSibling;
    if (!notifRow || !notifRow.classList.contains('att-notif-row')) {
      notifRow = document.createElement('tr');
      notifRow.classList.add('att-notif-row');
      notifRow.innerHTML = `
        <td colspan="6" style="padding: 0 15px 10px;">
          <div class="reset-success-notif" style="margin:0;"></div>
        </td>
      `;
      row.after(notifRow);
    }
    
    const notifDiv = notifRow.querySelector('.reset-success-notif');
    if (notifDiv) {
      notifDiv.textContent = `Attendance for ${studentName} successfully updated to ${newStatus}. (Demo Only)`;
      notifDiv.style.display = 'block';
      notifDiv.classList.remove('hide');
    }
    notifRow.style.display = 'table-row';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      if (notifDiv) {
        notifDiv.classList.add('hide');
        setTimeout(() => {
          notifRow.style.display = 'none';
          if (notifDiv) notifDiv.classList.remove('hide');
        }, 500);
      }
    }, 2500);
    
    this.updateSummary();
  }
};

// Global functions (if any needed on window)