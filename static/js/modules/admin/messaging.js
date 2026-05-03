// Admin messaging system
import { $, $$, addClass, removeClass, setText, setHTML, showElement, hideElement } from '../../core/dom-helpers.js';

export const AdminMessaging = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const form = document.getElementById('messagingForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  },
  
  handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const recipient = document.getElementById('msgRecipient')?.value || '';
    const type = document.getElementById('msgType')?.value || '';
    const subject = document.getElementById('msgSubject')?.value.trim() || '';
    const body = document.getElementById('msgBody')?.value.trim() || '';
    
    let notifEl = null;
    if (!form._notifEl) {
      notifEl = document.createElement('div');
      notifEl.style.borderRadius = '6px';
      notifEl.style.fontSize = '14px';
      notifEl.style.padding = '12px 16px';
      notifEl.style.marginBottom = '12px';
      notifEl.style.display = 'none';
      const sendBtn = form.querySelector('.send-btn');
      if (sendBtn) {
        form.insertBefore(notifEl, sendBtn);
      }
      form._notifEl = notifEl;
    } else {
      notifEl = form._notifEl;
    }
    
    if (!recipient || !type || !subject || !body) {
      notifEl.textContent = '⚠ Please fill in all required fields.';
      notifEl.style.background = '#f8d7da';
      notifEl.style.color = '#721c24';
      notifEl.style.display = 'block';
      return;
    }
    
    const btn = form.querySelector('.send-btn');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      
      const recipientSelect = document.getElementById('msgRecipient');
      const typeSelect = document.getElementById('msgType');
      const rLabel = recipientSelect?.options[recipientSelect.selectedIndex]?.text || '';
      const tLabel = typeSelect?.options[typeSelect.selectedIndex]?.text || '';
      
      notifEl.textContent = `Message successfully sent to ${rLabel} via ${tLabel}. (Demo Only)`;
      notifEl.style.background = '#d4edda';
      notifEl.style.color = '#155724';
      notifEl.style.display = 'block';
      
      form.reset();
      
      setTimeout(() => {
        notifEl.style.display = 'none';
      }, 4000);
    }, 1200);
  }
};