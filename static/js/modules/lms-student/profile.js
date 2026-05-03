/**
 * PUPLMS Profile Edit Script
 * Makes all editable fields on the profile page inline-editable with Green Toast feedback.
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ─── Edit Button Handler (Contact Details) ───────────────────── */
  document.querySelectorAll(".edit-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contactItem = btn.closest(".contact-item");
      const valueEl = contactItem.querySelector(".contact-item-value");

      if (contactItem.querySelector(".edit-input")) return;

      const currentValue = valueEl.textContent.trim();
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;
      input.className = "edit-input";
      applyInputStyles(input);

      const actions = document.createElement("div");
      actions.className = "edit-actions";
      applyActionsStyles(actions);

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      applyBtnStyles(saveBtn, "#800000", "#ffffff");

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      applyBtnStyles(cancelBtn, "#f0f0f0", "#555");

      actions.appendChild(saveBtn);
      actions.appendChild(cancelBtn);

      valueEl.style.display = "none";
      btn.style.display = "none";
      contactItem.appendChild(input);
      contactItem.appendChild(actions);
      input.focus();

      /* ── Save ── */
      const save = () => {
        const newValue = input.value.trim();
        if (newValue !== "") {
          valueEl.textContent = newValue;
          cleanup();
          showToast("Changes saved!", "success"); // Green Success Toast
        } else {
          showToast("Field cannot be empty.", "error"); // Red Error Toast
        }
      };

      const cleanup = () => {
        valueEl.style.display = "";
        btn.style.display = "";
        input.remove();
        actions.remove();
      };

      saveBtn.addEventListener("click", save);
      cancelBtn.addEventListener("click", cleanup);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") cleanup();
      });
    });
  });

  /* ─── Avatar / Edit-icon ──────────────────────────────────────── */
  const editIcon = document.querySelector(".profile-edit-icon");
  const avatarEl = document.querySelector(".profile-avatar");
  const sidebarAvatar = document.querySelector(".user-avatar");

  if (editIcon) {
    editIcon.addEventListener("click", () => {
      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = "image/*";
      picker.style.display = "none";
      document.body.appendChild(picker);
      picker.click();

      picker.addEventListener("change", () => {
        const file = picker.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarEl.innerHTML = "";
          avatarEl.style.padding = "0";
          avatarEl.style.overflow = "hidden";
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;";
          avatarEl.appendChild(img);

          if (sidebarAvatar) {
            sidebarAvatar.innerHTML = "";
            sidebarAvatar.style.overflow = "hidden";
            const sideImg = img.cloneNode();
            sideImg.src = e.target.result;
            sidebarAvatar.appendChild(sideImg);
          }

          showToast("Changes saved!", "success"); // Green Success Toast
        };
        reader.readAsDataURL(file);
        picker.remove();
      });
    });
  }

  /* ─── Toast Notification ──────────────────────────────────────── */
  // Added a 'type' parameter to handle different colors
  function showToast(message, type = "success") {
    const existing = document.querySelector(".pup-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `pup-toast toast-${type}`;
    toast.textContent = message;

    // Define colors based on type
    let bgColor, borderColor;
    if (type === "success") {
      bgColor = "#28a745"; // Green
      borderColor = "#1e7e34"; // Darker Green
    } else {
      bgColor = "#7a0000"; // Red for errors
      borderColor = "#ff8888"; // Darker Red
    }

    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: ${bgColor};
      color: #ffffff;
      padding: 12px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-family: "Segoe UI", sans-serif;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      border-left: 5px solid ${borderColor};
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    // Animate out
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // Define Info Fields again so makeInfoFieldEditable works properly
  const dobFieldInit = document.querySelector(".info-section:nth-of-type(1) .info-field");
  if (dobFieldInit) makeInfoFieldEditable(dobFieldInit, "date");

  const pobFieldInit = document.querySelector(".info-section:nth-of-type(2) .info-field");
  if (pobFieldInit) makeInfoFieldEditable(pobFieldInit, "text");

  /* ─── Style Helpers ────────────────────────────────────────────── */
  function applyInputStyles(el) {
    el.style.cssText += `width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px; font-size: 14px;`;
  }

  function applyActionsStyles(el) {
    el.style.cssText = `display: flex; gap: 10px; margin-top: 10px;`;
  }

  function applyBtnStyles(btn, bg, col) {
    btn.style.cssText = `padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; background: ${bg}; color: ${col}; font-weight: bold;`;
  }
});

(function () {
  function buildMobileNav() {
    if (document.querySelector('.mobile-topbar')) return;
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // --- Top bar ---
    const topbar = document.createElement('div');
    topbar.className = 'mobile-topbar';

    const logoImgEl  = sidebar.querySelector('.sidebar-logo-icon img');
    const logoTextEl = sidebar.querySelector('.sidebar-logo-text strong');
    const logoWrap   = document.createElement('div');
    logoWrap.className = 'mobile-topbar-logo';
    if (logoImgEl) {
      const img = document.createElement('img');
      img.src = logoImgEl.src;
      logoWrap.appendChild(img);
    }
    const logoSpan = document.createElement('span');
    logoSpan.textContent = logoTextEl ? logoTextEl.textContent : 'PUPSIS';
    logoWrap.appendChild(logoSpan);

    const burger = document.createElement('button');
    burger.className = 'mobile-hamburger';
    burger.setAttribute('aria-label', 'Toggle navigation');
    burger.innerHTML = '<span></span><span></span><span></span>';

    topbar.appendChild(logoWrap);
    topbar.appendChild(burger);
    document.body.appendChild(topbar);

    // --- Dropdown ---
    const dropdown = document.createElement('div');
    dropdown.className = 'mobile-nav-dropdown';

    sidebar.querySelectorAll('.nav-item').forEach(item => {
      const link = document.createElement('a');
      link.className = 'nav-link' + (item.classList.contains('active-nav') ? ' active-nav' : '');
      link.textContent = item.textContent.trim();
      link.href = '#';
      link.addEventListener('click', (e) => { e.preventDefault(); item.click(); close(); });
      dropdown.appendChild(link);
    });

    const logoutBtn = sidebar.querySelector('.logout-btn');
    if (logoutBtn) {
      const logoutLink = document.createElement('a');
      logoutLink.className = 'nav-link nav-logout';
      logoutLink.textContent = logoutBtn.textContent.trim();
      logoutLink.href = '#';
      logoutLink.addEventListener('click', (e) => { e.preventDefault(); close(); logoutBtn.click(); });
      dropdown.appendChild(logoutLink);
    }

    document.body.appendChild(dropdown);

    // --- Overlay ---
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);

    // --- Toggle ---
    function open() {
      dropdown.classList.add('open');
      overlay.classList.add('active');
      burger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      dropdown.classList.remove('open');
      overlay.classList.remove('active');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () =>
      dropdown.classList.contains('open') ? close() : open()
    );
    overlay.addEventListener('click', close);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', buildMobileNav)
    : buildMobileNav();
})();
