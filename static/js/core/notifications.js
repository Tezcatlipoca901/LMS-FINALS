// Notification system

export class NotificationManager {
  constructor(containerSelector, defaultDuration = 3500) {
    this.container = document.querySelector(containerSelector);
    this.defaultDuration = defaultDuration;
    this.timeout = null;
  }

  show(message, isSuccess = true, duration = null) {
    if (!this.container) return;
    
    if (this.timeout) clearTimeout(this.timeout);
    
    this.container.textContent = message;
    this.container.style.background = isSuccess ? "#d4edda" : "#f8d7da";
    this.container.style.color = isSuccess ? "#155724" : "#721c24";
    this.container.style.display = "block";
    this.container.classList.remove("hide");
    
    const timeoutDuration = duration || this.defaultDuration;
    this.timeout = setTimeout(() => {
      this.container.classList.add("hide");
      setTimeout(() => {
        this.container.style.display = "none";
        this.container.classList.remove("hide");
      }, 500);
    }, timeoutDuration);
  }

  hide() {
    if (this.container) {
      this.container.style.display = "none";
      if (this.timeout) clearTimeout(this.timeout);
    }
  }
}

export function showFlashMessage(message, isSuccess = true, duration = 3000) {
  const flash = document.querySelector(".incorrectPorU");
  if (flash) {
    flash.textContent = message;
    flash.style.background = isSuccess ? "#d4edda" : "#f8d7da";
    flash.style.color = isSuccess ? "#155724" : "#721c24";
    flash.style.display = "block";
    
    setTimeout(() => {
      flash.classList.add("hide");
      setTimeout(() => flash.remove(), 500);
    }, duration);
  }
}