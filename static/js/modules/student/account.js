// Student account management (Edit Info, Change Password)
import { $, addClass, removeClass } from '../../core/dom-helpers.js';

export const StudentAccount = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const openBtn = document.getElementById("btnOpenEditInfo");
    const modal = document.getElementById("editAccountModal");
    const saveBtn = document.getElementById("editAccountSaveBtn");
    const notifEl = document.getElementById("editAccountNotif");
    
    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        if (notifEl) notifEl.style.display = "none";
        addClass(modal, "active");
      });
      
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeEditModal();
      });
      
      if (saveBtn) {
        saveBtn.addEventListener("click", () => this.saveAccountInfo());
      }
    }
    
    // Change password
    const changePwBtn = document.getElementById("changePwBtn");
    if (changePwBtn) {
      changePwBtn.addEventListener("click", () => this.changePassword());
      
      const newPwInput = document.getElementById("newPassword");
      if (newPwInput) {
        newPwInput.addEventListener("input", () => this.checkPasswordStrength());
      }
    }
  },
  
  closeEditModal() {
    const modal = document.getElementById("editAccountModal");
    if (modal) removeClass(modal, "active");
  },
  
  saveAccountInfo() {
    const email = document.getElementById("editEmail")?.value.trim() || "";
    const contact = document.getElementById("editContact")?.value.trim() || "";
    const notifEl = document.getElementById("editAccountNotif");
    const saveBtn = document.getElementById("editAccountSaveBtn");
    
    if (!email || !contact) {
      if (notifEl) {
        notifEl.textContent = "⚠ Email and contact number are required.";
        notifEl.style.background = "#f8d7da";
        notifEl.style.color = "#721c24";
        notifEl.style.display = "block";
      }
      return;
    }
    
    if (!saveBtn) return;
    
    const original = saveBtn.textContent;
    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;
    
    setTimeout(() => {
      saveBtn.textContent = original;
      saveBtn.disabled = false;
      
      if (notifEl) {
        notifEl.textContent = "Account information updated successfully! (Demo Only)";
        notifEl.style.background = "#d4edda";
        notifEl.style.color = "#155724";
        notifEl.style.display = "block";
        
        setTimeout(() => {
          this.closeEditModal();
          notifEl.style.display = "none";
        }, 1500);
      }
    }, 1000);
  },
  
  checkPasswordStrength() {
    const newPwInput = document.getElementById("newPassword");
    if (!newPwInput) return;
    
    const val = newPwInput.value;
    const wrapper = document.getElementById("pwStrengthWrapper");
    const bar = document.getElementById("pwStrengthBar");
    const label = document.getElementById("pwStrengthLabel");
    
    if (!wrapper || !bar || !label) return;
    
    if (!val) {
      wrapper.style.display = "none";
      return;
    }
    
    wrapper.style.display = "block";
    
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    
    const levels = [
      { label: "Weak", color: "#dc3545", width: "25%" },
      { label: "Fair", color: "#ff5722", width: "50%" },
      { label: "Good", color: "#daa520", width: "75%" },
      { label: "Strong", color: "#28a745", width: "100%" }
    ];
    
    const level = levels[score - 1] || levels[0];
    bar.style.width = level.width;
    bar.style.background = level.color;
    label.textContent = level.label;
    label.style.color = level.color;
  },
  
  changePassword() {
    const current = document.getElementById("currentPassword")?.value.trim() || "";
    const newPass = document.getElementById("newPassword")?.value.trim() || "";
    const confirm = document.getElementById("confirmPassword")?.value.trim() || "";
    const notifEl = document.getElementById("changePwNotif");
    const changePwBtn = document.getElementById("changePwBtn");
    
    const showNotif = (message, isSuccess) => {
      if (!notifEl) return;
      notifEl.textContent = message;
      notifEl.style.background = isSuccess ? "#d4edda" : "#f8d7da";
      notifEl.style.color = isSuccess ? "#155724" : "#721c24";
      notifEl.style.display = "block";
    };
    
    if (!current || !newPass || !confirm) {
      showNotif("⚠ Please fill in all password fields.", false);
      return;
    }
    
    if (newPass.length < 8) {
      showNotif("⚠ Password must be at least 8 characters long.", false);
      return;
    }
    
    if (newPass !== confirm) {
      showNotif("⚠ New password and confirmation do not match.", false);
      return;
    }
    
    if (!changePwBtn) return;
    
    const original = changePwBtn.textContent;
    changePwBtn.textContent = "Updating...";
    changePwBtn.disabled = true;
    
    setTimeout(() => {
      changePwBtn.textContent = original;
      changePwBtn.disabled = false;
      
      document.getElementById("changePasswordForm")?.reset();
      const wrapper = document.getElementById("pwStrengthWrapper");
      if (wrapper) wrapper.style.display = "none";
      
      showNotif("Password updated successfully! (Demo Only)", true);
      
      setTimeout(() => {
        if (notifEl) notifEl.style.display = "none";
      }, 3000);
    }, 1200);
  },
  
  togglePasswordVisibility(inputId, eye) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    if (eye) eye.classList.toggle("closed", !isHidden);
  }
};

// Global functions
window.closeEditAccountModal = () => StudentAccount.closeEditModal();
window.togglePwVisibility = (inputId, eye) => StudentAccount.togglePasswordVisibility(inputId, eye);