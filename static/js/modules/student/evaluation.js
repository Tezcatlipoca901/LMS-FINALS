// Student evaluation (COR, Eval, etc.)
import { $, addClass, removeClass } from '../../core/dom-helpers.js';

export const StudentEvaluation = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    // COR Modal events
    const corModal = document.getElementById("corModal");
    if (corModal) {
      corModal.addEventListener("click", (e) => {
        if (e.target === corModal) this.closeCorModal();
      });
    }
    
    // Eval Modal events
    const evalModal = document.getElementById("evalModal");
    if (evalModal) {
      evalModal.addEventListener("click", (e) => {
        if (e.target === evalModal) this.closeEvalModal();
      });
    }
    
    // Evaluation form submission
    const evalSubmitBtn = document.getElementById("evalSubmitBtn");
    if (evalSubmitBtn) {
      evalSubmitBtn.addEventListener("click", () => this.submitEvaluation());
    }
  },
  
  openCorModal() {
    const modal = document.getElementById("corModal");
    if (modal) addClass(modal, "active");
  },
  
  closeCorModal() {
    const modal = document.getElementById("corModal");
    if (modal) removeClass(modal, "active");
  },
  
  openEvalModal() {
    const modal = document.getElementById("evalModal");
    if (modal) addClass(modal, "active");
  },
  
  closeEvalModal() {
    const modal = document.getElementById("evalModal");
    if (modal) removeClass(modal, "active");
  },
  
  downloadCor() {
    const btn = document.querySelector(".cor-download-btn");
    if (!btn) return;
    
    const original = btn.innerHTML;
    btn.innerHTML = "Downloaded (Demo only)";
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 2500);
  },
  
  startEvaluation(subjectCode) {
    console.log("Evaluating subject:", subjectCode);
    window.location.href = "/student/evaluation";
  },
  
  submitEvaluation() {
    const submitBtn = document.getElementById("evalSubmitBtn");
    const notifEl = document.getElementById("evalSubmitNotif");
    
    if (!submitBtn || !notifEl) return;
    
    const form = submitBtn.closest("form");
    const questions = [
      "teaching_effectiveness",
      "communication",
      "organization",
      "fairness",
      "mastery"
    ];
    
    let allAnswered = true;
    questions.forEach((name) => {
      if (!form.querySelector(`input[name='${name}']:checked`)) {
        allAnswered = false;
      }
    });
    
    if (!allAnswered) {
      notifEl.textContent = "⚠ Please answer all questions before submitting.";
      notifEl.style.background = "#f8d7da";
      notifEl.style.color = "#721c24";
      notifEl.style.padding = "12px 16px";
      notifEl.style.borderRadius = "6px";
      notifEl.style.fontSize = "14px";
      notifEl.style.marginBottom = "12px";
      notifEl.style.display = "block";
      return;
    }
    
    // Clear any previous notif
    notifEl.style.display = "none";
    
    const original = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;
    
    setTimeout(() => {
      form.querySelectorAll("input, textarea").forEach(el => {
        el.disabled = true;
      });
      
      submitBtn.textContent = "Submitted";
      
      notifEl.textContent = "Evaluation submitted successfully! Thank you for your feedback. (Demo Only)";
      notifEl.style.background = "#d4edda";
      notifEl.style.color = "#155724";
      notifEl.style.display = "block";
    }, 1200);
  }
};

// Global functions
window.openCorModal = () => StudentEvaluation.openCorModal();
window.closeCorModal = () => StudentEvaluation.closeCorModal();
window.openEvalModal = () => StudentEvaluation.openEvalModal();
window.closeEvalModal = () => StudentEvaluation.closeEvalModal();
window.downloadCor = () => StudentEvaluation.downloadCor();
window.startEvaluation = (subjectCode) => StudentEvaluation.startEvaluation(subjectCode);