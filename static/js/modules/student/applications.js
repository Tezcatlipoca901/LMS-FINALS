// Student applications (Withdrawal, LOA, TOR)
import { $, $$, showElement, hideElement, addClass, removeClass } from '../../core/dom-helpers.js';

export const StudentApplications = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const requestType = document.getElementById("requestType");
    if (requestType) {
      requestType.addEventListener("change", () => this.showForm());
    }
    
    const torFile = document.getElementById("tor_file");
    const torFileName = document.getElementById("fileName");
    if (torFile && torFileName) {
      torFile.addEventListener("change", () => {
        torFileName.textContent = torFile.files[0]?.name || "No file chosen";
      });
    }
    
    this.initSubmissionHandlers();
  },
  
  showForm() {
    const type = document.getElementById("requestType")?.value;
    
    const forms = ["withdrawalForm", "loaForm", "torForm"];
    forms.forEach(formId => {
      const form = document.getElementById(formId);
      if (form) form.style.display = "none";
    });
    
    if (type === "withdrawal") {
      const form = document.getElementById("withdrawalForm");
      if (form) form.style.display = "block";
    }
    if (type === "loa") {
      const form = document.getElementById("loaForm");
      if (form) form.style.display = "block";
    }
    if (type === "tor") {
      const form = document.getElementById("torForm");
      if (form) form.style.display = "block";
    }
  },
  
  initSubmissionHandlers() {
    // Withdrawal/Drop submission
    const withdrawWrapper = document.getElementById("withdrawalForm");
    if (withdrawWrapper) {
      const btn = withdrawWrapper.querySelector(".submit-btn");
      const notif = withdrawWrapper.querySelector("[id='studentAppNotif']");
      if (btn && notif) {
        btn.addEventListener("click", () => {
          const selects = withdrawWrapper.querySelectorAll("select");
          const course = selects[0]?.value || "";
          const appType = selects[1]?.value || "";
          const reason = selects[2]?.value || "";
          
          if (!course || !appType || !reason) {
            this.showNotif(notif, "⚠ Please fill in all required fields.", false);
            return;
          }
          this.submitForm(btn, notif, withdrawWrapper);
        });
      }
    }
    
    // LOA submission
    const loaWrapper = document.getElementById("loaForm");
    if (loaWrapper) {
      const btn = loaWrapper.querySelector(".submit-btn");
      const notif = loaWrapper.querySelector("[id='studentAppNotif']");
      if (btn && notif) {
        btn.addEventListener("click", () => {
          const selects = loaWrapper.querySelectorAll("select");
          const inputs = loaWrapper.querySelectorAll("input[type='text']");
          const semester = selects[0]?.value || "";
          const schoolYear = inputs[0]?.value.trim() || "";
          const reason = selects[1]?.value || "";
          
          if (!semester || !schoolYear || !reason) {
            this.showNotif(notif, "⚠ Please fill in all required fields.", false);
            return;
          }
          this.submitForm(btn, notif, loaWrapper);
        });
      }
    }
    
    // TOR submission
    const torWrapper = document.getElementById("torForm");
    if (torWrapper) {
      const btn = torWrapper.querySelector(".submit-btn");
      const notif = torWrapper.querySelector("[id='torAppNotif']");
      if (btn && notif) {
        btn.addEventListener("click", () => {
          const inputs = torWrapper.querySelectorAll("input[type='text'], input[type='number']");
          const selects = torWrapper.querySelectorAll("select");
          const fileInput = torWrapper.querySelector("input[type='file']");
          
          const fullName = inputs[0]?.value.trim() || "";
          const studentNo = inputs[1]?.value.trim() || "";
          const copies = inputs[2]?.value.trim() || "";
          const program = selects[0]?.value || "";
          const purpose = selects[1]?.value || "";
          const delivery = selects[2]?.value || "";
          const hasFile = fileInput && fileInput.files.length > 0;
          
          if (!fullName || !studentNo || !program || !purpose || !copies || !delivery) {
            this.showNotif(notif, "⚠ Please fill in all required fields.", false);
            return;
          }
          if (!hasFile) {
            this.showNotif(notif, "⚠ Please upload a supporting document.", false);
            return;
          }
          this.submitForm(btn, notif, torWrapper);
        });
      }
    }
  },
  
  submitForm(btn, notif, wrapper) {
    const original = btn.textContent;
    btn.textContent = "Submitting...";
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = "Submitted";
      
      wrapper.querySelectorAll("input, select, textarea").forEach(el => {
        el.disabled = true;
      });
      
      this.showNotif(notif, "Application successfully submitted! Your request is now under review. (Demo Only)", true);
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
window.showForm = () => StudentApplications.showForm();