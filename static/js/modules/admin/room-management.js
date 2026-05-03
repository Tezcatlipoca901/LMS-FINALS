// Admin room management (view rooms, mark unavailable, restore)
import { $, $$, addClass, removeClass, setText, setHTML } from '../../core/dom-helpers.js';

export const AdminRoomManagement = {
  roomData: {},
  roomMaintenanceStatus: {},
  roomMaintenanceReasons: {},
  currentUnavailableRoom: null,
  
  init() {
    this.initRoomData();
    this.bindEvents();
  },
  
  initRoomData() {
    this.roomData = {
      "Room101": {
        label: "Room 101",
        schedule: [
          { day: "Monday",    time: "08:00 AM - 10:00 AM", course: "IT101",   section: "BSIT-1A",  instructor: "Dr. Hiriluk" },
          { day: "Wednesday", time: "10:00 AM - 12:00 PM", course: "IT103",   section: "BSIT-2A",  instructor: "Prof. Ironhide" },
          { day: "Friday",    time: "01:00 PM - 03:00 PM", course: "IT105",   section: "BSIT-3A",  instructor: "Dr. Hiriluk" }
        ]
      },
      "Room102": {
        label: "Room 102",
        schedule: [
          { day: "Tuesday",  time: "10:00 AM - 12:00 PM", course: "IT102",   section: "BSIT-1A",  instructor: "Prof. Rachet" },
          { day: "Thursday", time: "08:00 AM - 10:00 AM", course: "GEED002", section: "BSA-1A",   instructor: "Prof. Ironhide" }
        ]
      },
      "Room201": {
        label: "Room 201",
        schedule: [
          { day: "Wednesday", time: "01:00 PM - 03:00 PM", course: "GEED001", section: "BSHM-2B", instructor: "Prof. Edward Newgate" },
          { day: "Friday",    time: "08:00 AM - 10:00 AM", course: "GEED003", section: "BSHM-1A", instructor: "Prof. Boa Hancock" }
        ]
      },
      "Lab1": {
        label: "Computer Lab 1",
        schedule: [
          { day: "Monday",   time: "01:00 PM - 03:00 PM", course: "IT104",   section: "BSIT-2B",  instructor: "Dr. Hiriluk" },
          { day: "Saturday", time: "08:00 AM - 12:00 PM", course: "IT106",   section: "BSIT-4A",  instructor: "Prof. Rachet" }
        ]
      },
      "Room105": {
        label: "Room 105",
        schedule: [
          { day: "Tuesday",  time: "01:00 PM - 03:00 PM", course: "BA101",   section: "BSA-2A",   instructor: "Prof. Edward Newgate" }
        ]
      }
    };
    
    this.roomMaintenanceStatus = {};
    this.roomMaintenanceReasons = {};
  },
  
  bindEvents() {
    const dayFilter = document.getElementById('roomDayFilter');
    if (dayFilter) {
      dayFilter.addEventListener('change', () => this.filterRoomsByDay());
    }
    
    const reasonSelect = document.getElementById('unavailableReason');
    if (reasonSelect) {
      reasonSelect.addEventListener('change', () => {
        const otherGroup = document.getElementById('otherReasonGroup');
        if (otherGroup) {
          otherGroup.style.display = reasonSelect.value === 'Other' ? 'block' : 'none';
        }
      });
    }
    
    const modals = ['roomDetailsModal', 'roomUnavailableModal'];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            const closeFn = this[`close${modalId.charAt(0).toUpperCase() + modalId.slice(1)}`];
            if (closeFn) closeFn.call(this);
          }
        });
      }
    });
    
    // Initial render
    this.renderRoomCards('Monday');
  },
  
  renderRoomCards(day) {
    const grid = document.getElementById('roomCardsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.keys(this.roomData).forEach((roomKey) => {
      const room = this.roomData[roomKey];
      const isMaintenance = this.roomMaintenanceStatus[roomKey] || false;
      const daySchedule = room.schedule.filter(s => s.day === day);
      const isOccupied = daySchedule.length > 0 && !isMaintenance;
      
      let statusClass, statusText;
      if (isMaintenance) {
        statusClass = 'status-maintenance';
        statusText = this.roomMaintenanceReasons[roomKey] || 'Under Maintenance';
      } else if (isOccupied) {
        statusClass = 'status-occupied';
        statusText = 'Occupied';
      } else {
        statusClass = 'status-available';
        statusText = 'Available';
      }
      
      let scheduleHTML = '';
      if (isMaintenance) {
        scheduleHTML = `<li class="room-schedule-item maintenance-block">${this.roomMaintenanceReasons[roomKey] || 'Under Maintenance'}</li>`;
      } else if (daySchedule.length === 0) {
        scheduleHTML = `<li class="room-no-schedule">No classes scheduled for ${day}.</li>`;
      } else {
        daySchedule.forEach(s => {
          scheduleHTML += `
            <li class="room-schedule-item">
              <strong>${s.course}</strong> — ${s.section}<br>
              ${s.time}<br>
              ${s.instructor}
            </li>`;
        });
      }
      
      const toggleBtn = isMaintenance
        ? `<button class="btn-room-restore" onclick="restoreRoom('${roomKey}')">Restore Room</button>`
        : `<button class="btn-room-maintenance" onclick="openRoomUnavailableModal('${roomKey}')">Mark Unavailable</button>`;
      
      grid.innerHTML += `
        <div class="room-card" id="roomCard-${roomKey}">
          <div class="room-card-header">
            <span class="room-card-name">${room.label}</span>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="room-card-body">
            <ul class="room-schedule-list">${scheduleHTML}</ul>
            <div class="room-card-actions">
              <button class="btn-room-details" onclick="openRoomDetailsModal('${roomKey}')">View Details</button>
              ${toggleBtn}
            </div>
          </div>
        </div>`;
    });
  },
  
  filterRoomsByDay() {
    const day = document.getElementById('roomDayFilter')?.value || 'Monday';
    this.renderRoomCards(day);
  },
  
  openRoomDetailsModal(roomKey) {
    const room = this.roomData[roomKey];
    const isMaintenance = this.roomMaintenanceStatus[roomKey] || false;
    
    setText(document.getElementById('roomDetailsTitle'), room.label);
    setText(document.getElementById('roomDetailsSubtitle'), 
      isMaintenance ? '⚠ This room is currently marked as unavailable.' : 'Full weekly schedule for this room.');
    
    const tbody = document.getElementById('roomDetailsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let hasAny = false;
    
    days.forEach(day => {
      room.schedule.filter(s => s.day === day).forEach(s => {
        hasAny = true;
        tbody.innerHTML += `
          <tr>
            <td>${s.day}</td>
            <td>${s.time}</td>
            <td>${s.course}</td>
            <td>${s.section}</td>
            <td>${s.instructor}</td>
          </tr>`;
      });
    });
    
    if (!hasAny) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--gray-dark); font-style:italic; padding:20px;">No classes scheduled for this room.</td></tr>`;
    }
    
    const modal = document.getElementById('roomDetailsModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeRoomDetailsModal() {
    const modal = document.getElementById('roomDetailsModal');
    if (modal) removeClass(modal, 'active');
  },
  
  openRoomUnavailableModal(roomKey) {
    this.currentUnavailableRoom = roomKey;
    const room = this.roomData[roomKey];
    
    setText(document.getElementById('unavailableRoomName'), room.label);
    setText(document.getElementById('unavailableRoomStatus'), 'Available');
    setText(document.getElementById('roomUnavailableSubtitle'), 'Set this room as unavailable for scheduling.');
    
    const reasonSelect = document.getElementById('unavailableReason');
    const otherReason = document.getElementById('unavailableOtherReason');
    const otherGroup = document.getElementById('otherReasonGroup');
    
    if (reasonSelect) reasonSelect.selectedIndex = 0;
    if (otherReason) otherReason.value = '';
    if (otherGroup) otherGroup.style.display = 'none';
    
    const notif = document.getElementById('roomUnavailableNotif');
    if (notif) {
      notif.style.display = 'none';
      notif.classList.remove('hide');
    }
    
    const modal = document.getElementById('roomUnavailableModal');
    if (modal) addClass(modal, 'active');
  },
  
  closeRoomUnavailableModal() {
    const modal = document.getElementById('roomUnavailableModal');
    if (modal) removeClass(modal, 'active');
    this.currentUnavailableRoom = null;
  },
  
  confirmRoomUnavailable() {
    const reasonSelect = document.getElementById('unavailableReason');
    const otherReason = document.getElementById('unavailableOtherReason')?.value.trim() || '';
    const notif = document.getElementById('roomUnavailableNotif');
    
    const showNotif = (message, isSuccess) => {
      if (!notif) return;
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
      }, 3000);
    };
    
    if (!reasonSelect?.value) {
      showNotif('Please select a reason.', false);
      return;
    }
    
    if (reasonSelect.value === 'Other' && !otherReason) {
      showNotif('Please specify the reason.', false);
      return;
    }
    
    const finalReason = reasonSelect.value === 'Other' ? otherReason : reasonSelect.value;
    if (this.currentUnavailableRoom) {
      this.roomMaintenanceStatus[this.currentUnavailableRoom] = true;
      this.roomMaintenanceReasons[this.currentUnavailableRoom] = finalReason;
    }
    
    const day = document.getElementById('roomDayFilter')?.value || 'Monday';
    this.renderRoomCards(day);
    this.closeRoomUnavailableModal();
  },
  
  restoreRoom(roomKey) {
    this.roomMaintenanceStatus[roomKey] = false;
    this.roomMaintenanceReasons[roomKey] = '';
    
    const day = document.getElementById('roomDayFilter')?.value || 'Monday';
    this.renderRoomCards(day);
  }
};

// Global functions
window.filterRoomsByDay = () => AdminRoomManagement.filterRoomsByDay();
window.openRoomDetailsModal = (roomKey) => AdminRoomManagement.openRoomDetailsModal(roomKey);
window.closeRoomDetailsModal = () => AdminRoomManagement.closeRoomDetailsModal();
window.openRoomUnavailableModal = (roomKey) => AdminRoomManagement.openRoomUnavailableModal(roomKey);
window.closeRoomUnavailableModal = () => AdminRoomManagement.closeRoomUnavailableModal();
window.confirmRoomUnavailable = () => AdminRoomManagement.confirmRoomUnavailable();
window.restoreRoom = (roomKey) => AdminRoomManagement.restoreRoom(roomKey);