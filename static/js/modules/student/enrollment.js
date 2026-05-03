// Student enrollment and subject selection
import { $, $$, addClass, removeClass, toggleClass } from '../../core/dom-helpers.js';
import { globalNotif } from '../../script.js';

export const StudentEnrollment = {
  init() {
    this.bindEvents();
  },

  // Open the COR image in a new tab
  openCor() {
    window.open("/static/images/COR.png", "_blank");
  },

  // Open midterm grades image in a new tab
  openMidtermGrades() {
    window.open("/static/images/COG MT.png", "_blank");
  },

  // Open final grades image in a new tab
  openFinalGrades() {
    window.open("/static/images/COG FT-MT.png", "_blank");
  },

  bindEvents() {
    // Subject selection checkboxes are handled by inline onclick
    // This is for any additional enrollment-related events
    const checkboxes = document.querySelectorAll('.irregular-table input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (!checkbox.hasAttribute('data-listener')) {
        checkbox.setAttribute('data-listener', 'true');
        checkbox.addEventListener('change', () => this.onSubjectSelect(checkbox));
      }
    });
  },
  
  onSubjectSelect(checkbox) {
    const row = checkbox.closest('tr');
    const select = row.querySelector('select');
    
    // Check if this subject has unmet prerequisites
    if (row.classList.contains('has-prereq')) {
      checkbox.checked = false;
      addClass(row, 'disabled-row');
      alert("You cannot take this course because you did not take the pre-requisite.");
      return;
    }
    
    // Enable or disable the schedule dropdown based on checkbox state
    if (select) select.disabled = !checkbox.checked;
  },
  
  toggleSelect(checkbox) {
    this.onSubjectSelect(checkbox);
  }
};

// Global function for inline onclick
window.toggleSelect = (checkbox) => StudentEnrollment.toggleSelect(checkbox);
// Global function to open COR image
window.openCor = () => StudentEnrollment.openCor();
// Global functions to open grades images
window.openMidtermGrades = () => StudentEnrollment.openMidtermGrades();
// Global function to open final grades image
window.openFinalGrades = () => StudentEnrollment.openFinalGrades();