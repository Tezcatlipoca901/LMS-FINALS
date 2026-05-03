// Graduation application and honors
import { $, showElement, hideElement } from '../../core/dom-helpers.js';

export const StudentGraduation = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const honorSelect = document.getElementById("honorSelect");
    if (honorSelect) {
      honorSelect.addEventListener("change", () => this.toggleHonorFields());
    }
    
    const submitBtn = document.getElementById("gradAppSubmitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.handleSubmit());
    }
  },
  
  toggleHonorFields() {
    const honor = document.getElementById("honorSelect")?.value;
    const gwaField = document.getElementById("gwaField");
    const honorUpload = document.getElementById("honorUpload");
    
    if (gwaField) gwaField.style.display = honor ? "block" : "none";
    if (honorUpload) honorUpload.style.display = honor ? "block" : "none";
  },
  
  handleSubmit() {
    const submitBtn = document.getElementById("gradAppSubmitBtn");
    const notifEl = document.getElementById("gradAppNotif");
    
    if (!submitBtn || !notifEl) return;
    
    const form = submitBtn.closest("form");
    const fullName = form.querySelector("input[name='full_name']")?.value.trim() || "";
    const studentNo = form.querySelector("input[name='student_number']")?.value.trim() || "";
    const program = form.querySelector("select[name='program']")?.value || "";
    const semester = form.querySelector("select[name='semester']")?.value || "";
    const year = form.querySelector("input[name='year']")?.value.trim() || "";
    const honor = form.querySelector("select[name='honor']")?.value || "";
    
    // Base required fields
    if (!fullName || !studentNo || !program || !semester || !year) {
      this.showNotif(notifEl, "⚠ Please fill in all required fields.", false);
      return;
    }
    
    // If applying for honors, GWA is also required
    if (honor) {
      const gwa = form.querySelector("input[name='gwa']")?.value.trim() || "";
      if (!gwa) {
        this.showNotif(notifEl, "⚠ Please enter your GWA for Latin Honors application.", false);
        return;
      }
    }
    
    const original = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.textContent = "Submitted";
      
      form.querySelectorAll("input, select, textarea").forEach(el => {
        el.disabled = true;
      });
      
      this.showNotif(notifEl, "Application successfully submitted! Your graduation application is now under review. (Demo Only)", true);
    }, 1200);
  },
  
  showNotif(el, message, isSuccess) {
    if (!el) return;
    el.textContent = message;
    el.style.background = isSuccess ? "#d4edda" : "#f8d7da";
    el.style.color = isSuccess ? "#155724" : "#721c24";
    el.style.padding = "12px 16px";
    el.style.borderRadius = "6px";
    el.style.fontSize = "14px";
    el.style.marginBottom = "12px";
    el.style.display = "block";
  }
};

// Global functions
window.toggleHonorFields = () => StudentGraduation.toggleHonorFields();