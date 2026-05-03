// Student assessment modal
import { $, $$, setText, showElement, hideElement, scrollToElement, addClass, removeClass } from '../../core/dom-helpers.js';
import { globalNotif } from '../../script.js';

export const StudentAssessment = {
  init() {
    this.bindModalEvents();
  },
  
  bindModalEvents() {
    const modal = document.getElementById("assessModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal();
      });
    }
  },
  
  openModal() {
    const rows = $$(".irregular-table tbody tr");
    const tbody = document.getElementById("assessSubjectBody");
    const warning = document.getElementById("assessEmptyWarning");
    const confirmBtn = document.querySelector(".assess-confirm-btn");
    
    if (!tbody) return;
    
    tbody.innerHTML = "";
    let totalUnits = 0;
    let totalSubjects = 0;
    let anyChecked = false;
    let missingSchedule = false;
    
    rows.forEach((row) => {
      const checkbox = row.querySelector("input[type='checkbox']");
      const select = row.querySelector("select");
      const cells = row.querySelectorAll("td");
      
      if (checkbox && checkbox.checked) {
        anyChecked = true;
        
        const code = cells[2]?.textContent.trim() || '';
        const desc = cells[3]?.textContent.trim() || '';
        const units = parseFloat(cells[6]?.textContent.trim() || '0');
        const selectedSchedule = select?.options[select.selectedIndex]?.text || '';
        const noSchedule = select?.selectedIndex === 0;
        
        if (noSchedule) missingSchedule = true;
        
        totalUnits += units;
        totalSubjects++;
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${this.escapeHtml(code)}</td>
          <td>${this.escapeHtml(desc)}</td>
          <td>${units} units</td>
          <td>${noSchedule ? "<span style='color:var(--bright-red)'>No schedule selected</span>" : this.escapeHtml(selectedSchedule)}</td>
        `;
        tbody.appendChild(tr);
      }
    });
    
    if (!anyChecked) {
      tbody.innerHTML = `<tr class="assess-empty-row"><td colspan="4">No subjects selected.</td></tr>`;
      if (warning) {
        warning.textContent = "⚠ No subjects selected. Please check at least one subject before assessing.";
        addClass(warning, "visible");
        showElement(warning);
      }
      if (confirmBtn) confirmBtn.disabled = true;
    } else if (missingSchedule) {
      if (warning) {
        warning.textContent = "⚠ Please select a schedule for all checked subjects before confirming.";
        addClass(warning, "visible");
        showElement(warning);
      }
      if (confirmBtn) confirmBtn.disabled = true;
    } else {
      if (warning) {
        removeClass(warning, "visible");
        hideElement(warning);
      }
      if (confirmBtn) confirmBtn.disabled = false;
    }
    
    setText(document.getElementById("assessTotalSubjects"), totalSubjects);
    setText(document.getElementById("assessTotalUnits"), totalUnits.toFixed(1) + " units");
    
    const modal = document.getElementById("assessModal");
    if (modal) {
      // Show the modal
      modal.style.display = 'flex';
      addClass(modal, "active");
    }
  },
  
  closeModal() {
    const modal = document.getElementById("assessModal");
    if (modal) {
      // Hide the modal
      modal.style.display = 'none';
      removeClass(modal, "active");
    }
  },
  
  confirmAssessment() {
    // Check if there are selected subjects
    const selectedCheckboxes = document.querySelectorAll('.irregular-table input[type="checkbox"]:checked');
    
    if (selectedCheckboxes.length === 0) {
      alert('Please select at least one subject to enroll.');
      return;
    }
    
    // Check if all selected subjects have schedules
    let hasMissingSchedule = false;
    selectedCheckboxes.forEach(checkbox => {
      const row = checkbox.closest('tr');
      const select = row.querySelector('select');
      if (!select || !select.value || select.selectedIndex === 0) {
        hasMissingSchedule = true;
      }
    });
    
    if (hasMissingSchedule) {
      alert('Please select a schedule for all selected subjects before confirming.');
      return;
    }
    
    const btn = document.querySelector(".assess-confirm-btn");
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = "Enrollment Confirmed (Demo only)";
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      this.closeModal();
      
      // Optional: Show success notification
      if (globalNotif) {
        globalNotif.show('Enrollment confirmed successfully!', 'success');
      } else {
        alert('Enrollment confirmed successfully!');
      }
    }, 1500);
  },
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Global functions for inline onclick
window.openAssessModal = () => StudentAssessment.openModal();
window.closeAssessModal = () => StudentAssessment.closeModal();
window.confirmAssessment = () => StudentAssessment.confirmAssessment();