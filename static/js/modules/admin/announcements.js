// Admin announcements management (publish, edit, delete)
import { $, $$, addClass, removeClass, setText, setHTML, showElement, hideElement } from '../../core/dom-helpers.js';

export const AdminAnnouncements = {
  init() {
    this.bindEvents();
    this.wireExistingAnnouncements();
  },
  
  bindEvents() {
    const annForm = document.getElementById('announcementForm');
    if (annForm) {
      annForm.addEventListener('submit', (e) => this.handlePublish(e));
    }
    
    const editModal = document.getElementById('annEditModal');
    if (editModal) {
      editModal.addEventListener('click', (e) => {
        if (e.target === editModal) this.closeAnnEditModal();
      });
    }
    
    const deleteModal = document.getElementById('annDeleteModal');
    if (deleteModal) {
      deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) this.closeAnnDeleteModal();
      });
    }
    
    const editSaveBtn = document.getElementById('annEditSaveBtn');
    if (editSaveBtn) {
      editSaveBtn.addEventListener('click', () => this.saveEditAnnouncement());
    }
    
    const deleteConfirmBtn = document.getElementById('annDeleteConfirmBtn');
    if (deleteConfirmBtn) {
      deleteConfirmBtn.addEventListener('click', () => this.confirmDeleteAnnouncement());
    }
  },
  
  wireExistingAnnouncements() {
    document.querySelectorAll('.announcement-item').forEach((item) => {
      this.wireAnnouncementButtons(item);
    });
  },
  
  wireAnnouncementButtons(item) {
    const editBtn = item.querySelector('.btn-edit, .ann-edit-btn');
    const deleteBtn = item.querySelector('.btn-archive, .ann-delete-btn');
    
    if (editBtn && !editBtn.hasAttribute('data-wired')) {
      editBtn.setAttribute('data-wired', 'true');
      editBtn.addEventListener('click', () => {
        const titleNode = item.querySelector('.announcement-title');
        const title = titleNode?.childNodes[0]?.textContent.trim() || '';
        const message = item.querySelector('p')?.textContent.trim() || '';
        this.openEditModal(title, message, item);
      });
    }
    
    if (deleteBtn && !deleteBtn.hasAttribute('data-wired')) {
      deleteBtn.setAttribute('data-wired', 'true');
      deleteBtn.addEventListener('click', () => {
        const titleNode = item.querySelector('.announcement-title');
        const title = titleNode?.childNodes[0]?.textContent.trim() || '';
        this.openDeleteModal(title, item);
      });
    }
  },
  
  showPublishNotif(form, message, isSuccess) {
    if (!form._publishNotif) {
      const notif = document.createElement('div');
      notif.className = 'reset-success-notif';
      notif.style.marginBottom = '10px';
      const btn = form.querySelector('.margin-top');
      if (btn) {
        form.insertBefore(notif, btn);
      } else {
        form.appendChild(notif);
      }
      form._publishNotif = notif;
    }
    
    const notif = form._publishNotif;
    notif.textContent = message;
    notif.style.background = isSuccess ? '#d4edda' : '#f8d7da';
    notif.style.color = isSuccess ? '#155724' : '#721c24';
    notif.style.display = 'block';
    notif.classList.remove('hide');
    
    setTimeout(() => {
      notif.classList.add('hide');
      setTimeout(() => {
        notif.style.display = 'none';
        notif.classList.remove('hide');
      }, 500);
    }, 3500);
  },
  
  handlePublish(e) {
    e.preventDefault();
    
    const form = e.target;
    const title = document.getElementById('annTitle')?.value.trim() || '';
    const message = document.getElementById('annMessage')?.value.trim() || '';
    const audience = document.getElementById('annAudience')?.value || '';
    const priority = document.getElementById('annPriority')?.value || '';
    
    if (!title || !message || !audience || !priority) {
      this.showPublishNotif(form, '⚠ Please fill in all required fields.', false);
      return;
    }
    
    const btn = form.querySelector('.btn-save');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Publishing...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      this.showPublishNotif(form, 'Announcement successfully published! (Demo Only)', true);
      form.reset();
    }, 1200);
  },
  
  openEditModal(title, message, item) {
    this.editTargetItem = item;
    const titleInput = document.getElementById('annEditTitle');
    const messageInput = document.getElementById('annEditMessage');
    if (titleInput) titleInput.value = title;
    if (messageInput) messageInput.value = message;
    
    const notif = document.getElementById('annEditNotif');
    if (notif) {
      notif.style.display = 'none';
      notif.classList.remove('hide');
    }
    
    const modal = document.getElementById('annEditModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeAnnEditModal() {
    const modal = document.getElementById('annEditModal');
    if (modal) removeClass(modal, 'active');
    this.editTargetItem = null;
  },
  
  saveEditAnnouncement() {
    const newTitle = document.getElementById('annEditTitle')?.value.trim() || '';
    const newMessage = document.getElementById('annEditMessage')?.value.trim() || '';
    const notif = document.getElementById('annEditNotif');
    
    if (!newTitle || !newMessage) {
      if (notif) {
        notif.textContent = '⚠ Title and message cannot be empty.';
        notif.style.background = '#f8d7da';
        notif.style.color = '#721c24';
        notif.style.display = 'block';
      }
      return;
    }
    
    const btn = document.getElementById('annEditSaveBtn');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      
      if (notif) {
        notif.textContent = 'Announcement updated successfully! (Demo Only)';
        notif.style.background = '#d4edda';
        notif.style.color = '#155724';
        notif.style.display = 'block';
      }
      
      setTimeout(() => {
        this.closeAnnEditModal();
        if (notif) notif.style.display = 'none';
      }, 1500);
    }, 1000);
  },
  
  openDeleteModal(title, item) {
    this.deleteTargetItem = item;
    const titleEl = document.getElementById('annDeleteTitle');
    if (titleEl) titleEl.textContent = title;
    
    const notif = document.getElementById('annDeleteNotif');
    if (notif) {
      notif.style.display = 'none';
      notif.classList.remove('hide');
    }
    
    const modal = document.getElementById('annDeleteModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeAnnDeleteModal() {
    const modal = document.getElementById('annDeleteModal');
    if (modal) removeClass(modal, 'active');
    this.deleteTargetItem = null;
  },
  
  confirmDeleteAnnouncement() {
    const btn = document.getElementById('annDeleteConfirmBtn');
    if (!btn) return;
    
    const original = btn.textContent;
    btn.textContent = 'Deleting...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = 'Deleted (Demo Only)';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        this.closeAnnDeleteModal();
      }, 1500);
    }, 1000);
  }
};

// Global functions
window.closeAnnEditModal = () => AdminAnnouncements.closeAnnEditModal();
window.closeAnnDeleteModal = () => AdminAnnouncements.closeAnnDeleteModal();