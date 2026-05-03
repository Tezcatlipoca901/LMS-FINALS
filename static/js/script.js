// ============================================
// IMPORTS - Core Utilities
// ============================================
import { formatCurrentDate, getRandomIndex, isValidGrade, computeSemGrade } from './core/utils.js';
import { $, $$, addClass, removeClass, toggleClass, setText, hideElement, showElement, scrollToElement } from './core/dom-helpers.js';
import { NotificationManager } from './core/notifications.js';
import { DATE_OPTIONS, BACKGROUND_IMAGES, VALID_GRADES, STATUS_BADGE_CLASS } from './core/constants.js';

// ============================================
// IMPORTS - Student Modules
// ============================================
import { StudentEnrollment } from './modules/student/enrollment.js';
import { StudentAssessment } from './modules/student/assessment.js';
import { StudentApplications } from './modules/student/applications.js';
import { StudentGraduation } from './modules/student/graduation.js';
import { StudentEvaluation } from './modules/student/evaluation.js';
import { StudentAccount } from './modules/student/account.js';

// ============================================
// IMPORTS - Admin Modules
// ============================================
import { AdminStudentManagement } from './modules/admin/student-management.js';
import { AdminCourseManagement } from './modules/admin/course-management.js';
import { AdminProgramManagement } from './modules/admin/program-management.js';
import { AdminSectionManagement } from './modules/admin/section-management.js';
import { AdminUserManagement } from './modules/admin/user-management.js';
import { AdminInstructorManagement } from './modules/admin/instructor-management.js';
import { AdminApplicationManagement } from './modules/admin/application-management.js';
import { AdminScheduleManagement } from './modules/admin/schedule-management.js';
import { AdminRoomManagement } from './modules/admin/room-management.js';
import { AdminGradeOverride } from './modules/admin/grade-override.js';
import { AdminAttendanceOverride } from './modules/admin/attendance-override.js';
import { AdminDegreeAudit } from './modules/admin/degree-audit.js';
import { AdminMessaging } from './modules/admin/messaging.js';
import { AdminAnnouncements } from './modules/admin/announcements.js';
import { AdminCalendar } from './modules/admin/calendar.js';
import { AdminAccount } from './modules/admin/account.js';

// ============================================
// IMPORTS - Instructor Modules
// ============================================
import { InstructorGradebook } from './modules/instructor/gradebook.js';
import { InstructorAttendance } from './modules/instructor/attendance.js';
import { InstructorApplications } from './modules/instructor/applications.js';
import { InstructorStudentRecords } from './modules/instructor/student-records.js';
import { InstructorMessaging } from './modules/instructor/messaging.js';
import { InstructorAccount } from './modules/instructor/account.js';

// ============================================
// GLOBAL NOTIFICATION MANAGER - Single export
// ============================================
const globalNotif = new NotificationManager("#globalNotif");

// ============================================
// CORE FUNCTIONS - Exposed to Global Window
// ============================================

window.updateDate = function() {
  const today = formatCurrentDate(DATE_OPTIONS);
  const dateElement = document.getElementById("currentDate");
  if (dateElement) {
    dateElement.textContent = today;
  }
};

window.toggleMobileMenu = function() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".mobile-overlay");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  
  if (sidebar) sidebar.classList.toggle("mobile-active");
  if (overlay) overlay.classList.toggle("active");
  if (menuBtn) menuBtn.classList.toggle("active");
};

window.closeMobileMenu = function() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".mobile-overlay");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  
  if (sidebar) sidebar.classList.remove("mobile-active");
  if (overlay) overlay.classList.remove("active");
  if (menuBtn) menuBtn.classList.remove("active");
};

function ensureSidebarClosedOnLoad() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  if (menuBtn && window.getComputedStyle(menuBtn).display !== "none") {
    window.closeMobileMenu();
  }
}

window.togglePassword = function() {
  const passwordField = document.getElementById("password");
  const eye = document.querySelector(".toggle-eye");
  
  if (!passwordField || !eye) return;
  
  const isHidden = passwordField.type === "password";
  passwordField.type = isHidden ? "text" : "password";
  if (eye) eye.classList.toggle("closed");
};

// ============================================
// DROPDOWN MENU TOGGLE - CRITICAL FIX
// ============================================
window.toggleDropdown = function(menuId, btn) {
  console.log("toggleDropdown called with:", menuId);
  
  const dropdown = document.getElementById(menuId);
  if (!dropdown) {
    console.error("Dropdown not found:", menuId);
    return;
  }
  
  // Close all other dropdowns
  document.querySelectorAll(".dropdown-container").forEach((dc) => {
    if (dc !== dropdown) {
      dc.classList.remove("show");
      const prevBtn = dc.previousElementSibling;
      if (prevBtn && prevBtn.classList) {
        prevBtn.classList.remove("active");
        const arrow = prevBtn.querySelector(".arrow");
        if (arrow) arrow.classList.remove("rotate");
      }
    }
  });
  
  // Toggle current dropdown
  dropdown.classList.toggle("show");
  if (btn) btn.classList.toggle("active");
  
  const arrow = btn ? btn.querySelector(".arrow") : null;
  if (arrow) arrow.classList.toggle("rotate");
};

function keepDropdownOpenOnActive() {
  const activeItem = document.querySelector(".sidebar-nav .sub-item.active");
  if (activeItem) {
    const dropdown = activeItem.closest(".dropdown-container");
    if (!dropdown) return;
    
    const button = dropdown.previousElementSibling;
    if (button && button.classList) {
      dropdown.classList.add("show");
      button.classList.add("active");
      const arrow = button.querySelector(".arrow");
      if (arrow) arrow.classList.add("rotate");
    }
  }
}

// ============================================
// BACKGROUND SLIDESHOW (LOGIN PAGE)
// ============================================
window.initBackgroundSlideshow = function() {
  const bgMain = document.getElementById("bgMain");
  const bgBlur = document.getElementById("bgBlur");
  
  if (!bgMain || !bgBlur) return;
  
  BACKGROUND_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
  
  let current = getRandomIndex(BACKGROUND_IMAGES);
  bgMain.style.backgroundImage = `url(${BACKGROUND_IMAGES[current]})`;
  
  function changeBackground() {
    let next = getRandomIndex(BACKGROUND_IMAGES);
    if (next === current) {
      next = (current + 1) % BACKGROUND_IMAGES.length;
    }
    
    bgBlur.style.backgroundImage = `url(${BACKGROUND_IMAGES[next]})`;
    bgBlur.style.opacity = "1";
    
    setTimeout(() => {
      bgMain.style.backgroundImage = `url(${BACKGROUND_IMAGES[next]})`;
      bgBlur.style.opacity = "0";
      current = next;
    }, 2000);
  }
  
  setInterval(changeBackground, 15000);
};

// ============================================
// TOGGLE CLASS DETAILS - Instructor Classes
// FIXED: Uses CSS classes like the original working version
// ============================================
window.toggleClassDetails = function(panelId) {
  console.log("toggleClassDetails called with panelId:", panelId);
  
  // Get the details panel element
  const panel = document.getElementById(panelId);
  
  if (!panel) {
    console.error("Panel not found:", panelId);
    return;
  }

  // Check if panel is open (has 'show' class)
  const isOpen = panel.classList.contains('show');
  
  // Close all other panels
  document.querySelectorAll('.class-details-panel').forEach(p => {
    p.classList.remove('show');
    // Update button text for other panels
    const otherClassItem = p.closest('.class-item');
    const otherButton = otherClassItem ? otherClassItem.querySelector('.class-action-btn') : null;
    if (otherButton) otherButton.textContent = 'View Details';
  });

  // Toggle current panel
  if (!isOpen) {
    panel.classList.add('show');
    // Update button text
    const classItem = panel.closest('.class-item');
    const button = classItem ? classItem.querySelector('.class-action-btn') : null;
    if (button) button.textContent = 'Hide Details';
    console.log("Panel shown:", panelId);
    
    // Smooth scroll to the panel
    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  } else {
    console.log("Panel hidden:", panelId);
  }
};

// ============================================
// INITIALIZE CLASS DETAILS PANELS
// ============================================
function initClassDetailsPanels() {
  // Hide all class details panels initially (remove 'show' class if any)
  const panels = document.querySelectorAll('.class-details-panel');
  panels.forEach(panel => {
    panel.classList.remove('show');
  });
  console.log(`Initialized ${panels.length} class details panels (hidden by default)`);
}

// ============================================
// LMS LAUNCH
// ============================================
const lmsSteps = [
  { label: "Initializing...", progress: 10 },
  { label: "Authenticating Session...", progress: 30 },
  { label: "Loading LMS Modules...", progress: 55 },
  { label: "Syncing Student Data...", progress: 75 },
  { label: "Preparing Dashboard...", progress: 90 },
  { label: "Launching LMS...", progress: 100 }
];

window.launchLMS = function() {
  console.log("launchLMS called");
  const overlay = document.getElementById("lmsOverlay");
  const subtitle = document.getElementById("lmsOverlaySubtitle");
  const progressBar = document.getElementById("lmsProgressBar");
  
  if (!overlay) return;
  
  if (progressBar) progressBar.style.width = "0%";
  if (subtitle) subtitle.textContent = lmsSteps[0].label;
  overlay.classList.add("active");
  
  let i = 0;
  function runStep() {
    if (i >= lmsSteps.length) {
      setTimeout(() => {
        overlay.classList.remove("active");

        // 👉 ADD THIS LINE (redirect)
        window.location.href = '/lms';

      }, 1000);
      return;
    }
    
    const step = lmsSteps[i];
    if (subtitle) subtitle.textContent = step.label;
    if (progressBar) progressBar.style.width = step.progress + "%";
    i++;
    
    const delay = i === lmsSteps.length ? 800 : 400 + Math.random() * 300;
    setTimeout(runStep, delay);
  }
  
  setTimeout(runStep, 500);
};

// ============================================
// RESET PASSWORD MODAL
// ============================================
window.openModal = function() {
  console.log("MODAL CLICKED");
  const modal = document.getElementById("resetModal");
  if (modal) modal.classList.add("active");
};

window.closeModal = function() {
  const modal = document.getElementById("resetModal");
  if (modal) modal.classList.remove("active");
};

function initResetPasswordForm() {
  const resetForm = document.getElementById("resetForm");
  if (resetForm) {
    resetForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const successDiv = document.createElement("div");
      successDiv.className = "reset-success-notif";
      successDiv.textContent = "Reset link sent successfully! Check your email. (Demo only)";
      this.insertBefore(successDiv, this.firstChild);
      this.reset();
      setTimeout(() => {
        successDiv.classList.add("hide");
        setTimeout(() => successDiv.remove(), 500);
      }, 3000);
    });
  }
}

// ============================================
// FORM HANDLERS
// ============================================
function initFormHandlers() {
  const reasonSelect = document.getElementById("reason");
  const detailsInput = document.getElementById("details");
  
  if (reasonSelect && detailsInput) {
    const detailsBox = detailsInput.parentElement;
    reasonSelect.addEventListener("change", function() {
      detailsBox.style.display = this.value === "others" ? "block" : "none";
    });
    detailsBox.style.display = "none";
  }
  
  const fileInput = document.getElementById("remarks_file");
  const fileName = document.getElementById("file-name");
  if (fileInput && fileName) {
    fileInput.addEventListener("change", function() {
      fileName.textContent = this.files.length > 0 ? this.files[0].name : "No file chosen";
    });
  }
  
  const torFile = document.getElementById("tor_file");
  const torFileName = document.getElementById("fileName");
  if (torFile && torFileName) {
    torFile.addEventListener("change", function() {
      torFileName.textContent = this.files[0]?.name || "No file chosen";
    });
  }
}

// ============================================
// FLASH MESSAGES AUTO-HIDE
// ============================================
function initFlashMessages() {
  const flash = document.querySelector(".incorrectPorU");
  if (flash) {
    setTimeout(() => {
      flash.classList.add("hide");
      setTimeout(() => flash.remove(), 500);
    }, 3000);
  }
}

// ============================================
// ESCAPE KEY HANDLER
// ============================================
function initEscapeKeyHandler() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const lmsOverlay = document.getElementById("lmsOverlay");
      if (lmsOverlay && lmsOverlay.classList.contains("active")) {
        lmsOverlay.classList.remove("active");
      }
      document.querySelectorAll(".modal.active").forEach(modal => {
        modal.classList.remove("active");
      });
    }
  });
}

// ============================================
// VIEW STUDENT LIST AND SCHEDULE - Helper functions
// ============================================
window.viewStudentList = function(classCode) {
  console.log("View student list for class:", classCode);
  // Redirect to the students page with class filter
  window.location.href = `/instructor/students?class=${classCode}`;
};

window.viewClassSchedule = function(classCode) {
  console.log("View schedule for class:", classCode);
  // Redirect to the schedule page with class filter
  window.location.href = `/instructor/schedule?class=${classCode}`;
};

// ============================================
// STUDENT FUNCTIONS - Exposed to Global Window
// ============================================
window.toggleSelect = (checkbox) => StudentEnrollment.toggleSelect(checkbox);
window.openAssessModal = () => StudentAssessment.openModal();
window.closeAssessModal = () => StudentAssessment.closeModal();
window.confirmAssessment = () => StudentAssessment.confirmAssessment();
window.showForm = () => StudentApplications.showForm();
window.toggleHonorFields = () => StudentGraduation.toggleHonorFields();
window.openCorModal = () => StudentEvaluation.openCorModal();
window.closeCorModal = () => StudentEvaluation.closeCorModal();
window.openEvalModal = () => StudentEvaluation.openEvalModal();
window.closeEvalModal = () => StudentEvaluation.closeEvalModal();
window.downloadCor = () => StudentEvaluation.downloadCor();
window.startEvaluation = (subjectCode) => StudentEvaluation.startEvaluation(subjectCode);
window.closeEditAccountModal = () => StudentAccount.closeEditModal();
window.togglePwVisibility = (inputId, eye) => StudentAccount.togglePasswordVisibility(inputId, eye);

// ============================================
// ADMIN FUNCTIONS - Student Management
// ============================================
window.openStudentProfileModal = (btn) => AdminStudentManagement.openStudentProfileModal(btn);
window.closeStudentProfileModal = () => AdminStudentManagement.closeStudentProfileModal();
window.openArchiveStudentModal = (btn) => AdminStudentManagement.openArchiveStudentModal(btn);
window.closeArchiveStudentModal = () => AdminStudentManagement.closeArchiveStudentModal();
window.confirmArchiveStudent = () => AdminStudentManagement.confirmArchiveStudent();
window.openEditProfileModal = () => AdminStudentManagement.openEditProfileModal();
window.closeEditProfileModal = () => AdminStudentManagement.closeEditProfileModal();
window.confirmEditProfile = () => AdminStudentManagement.confirmEditProfile();
window.openEnrollmentHistoryModal = () => AdminStudentManagement.openEnrollmentHistoryModal();
window.closeEnrollmentHistoryModal = () => AdminStudentManagement.closeEnrollmentHistoryModal();
window.openEnrollStudentModal = () => AdminStudentManagement.openEnrollStudentModal();
window.closeEnrollStudentModal = () => AdminStudentManagement.closeEnrollStudentModal();
window.enrollStepNext = () => AdminStudentManagement.enrollStepNext();
window.enrollStepBack = () => AdminStudentManagement.enrollStepBack();

// ============================================
// ADMIN FUNCTIONS - Course Management
// ============================================
window.openAddCourseModal = () => AdminCourseManagement.openAddCourseModal();
window.closeAddCourseModal = () => AdminCourseManagement.closeAddCourseModal();
window.confirmAddCourse = () => AdminCourseManagement.confirmAddCourse();
window.openEditCourseModal = (code, name, units, dept) => AdminCourseManagement.openEditCourseModal(code, name, units, dept);
window.closeEditCourseModal = () => AdminCourseManagement.closeEditCourseModal();
window.confirmEditCourse = () => AdminCourseManagement.confirmEditCourse();
window.openDeleteCourseModal = (code, name) => AdminCourseManagement.openDeleteCourseModal(code, name);
window.closeDeleteCourseModal = () => AdminCourseManagement.closeDeleteCourseModal();
window.confirmDeleteCourse = () => AdminCourseManagement.confirmDeleteCourse();

// ============================================
// ADMIN FUNCTIONS - Program Management
// ============================================
window.openAddProgramModal = () => AdminProgramManagement.openAddProgramModal();
window.closeAddProgramModal = () => AdminProgramManagement.closeAddProgramModal();
window.confirmAddProgram = () => AdminProgramManagement.confirmAddProgram();
window.openEditProgramModal = (code, name, dept, duration) => AdminProgramManagement.openEditProgramModal(code, name, dept, duration);
window.closeEditProgramModal = () => AdminProgramManagement.closeEditProgramModal();
window.confirmEditProgram = () => AdminProgramManagement.confirmEditProgram();
window.openDeleteProgramModal = (code, name) => AdminProgramManagement.openDeleteProgramModal(code, name);
window.closeDeleteProgramModal = () => AdminProgramManagement.closeDeleteProgramModal();
window.confirmDeleteProgram = () => AdminProgramManagement.confirmDeleteProgram();

// ============================================
// ADMIN FUNCTIONS - Section Management
// ============================================
window.openAddSectionModal = () => AdminSectionManagement.openAddSectionModal();
window.closeAddSectionModal = () => AdminSectionManagement.closeAddSectionModal();
window.confirmAddSection = () => AdminSectionManagement.confirmAddSection();
window.openEditSectionModal = (code, year, program, capacity, enrolled) => AdminSectionManagement.openEditSectionModal(code, year, program, capacity, enrolled);
window.closeEditSectionModal = () => AdminSectionManagement.closeEditSectionModal();
window.confirmEditSection = () => AdminSectionManagement.confirmEditSection();
window.openDeleteSectionModal = (code, program) => AdminSectionManagement.openDeleteSectionModal(code, program);
window.closeDeleteSectionModal = () => AdminSectionManagement.closeDeleteSectionModal();
window.confirmDeleteSection = () => AdminSectionManagement.confirmDeleteSection();

// ============================================
// ADMIN FUNCTIONS - User Management
// ============================================
window.openEditUserModal = (id, name, email, type, role, status) => AdminUserManagement.openEditUserModal(id, name, email, type, role, status);
window.closeEditUserModal = () => AdminUserManagement.closeEditUserModal();
window.confirmEditUser = () => AdminUserManagement.confirmEditUser();
window.openArchiveUserModal = (id, name) => AdminUserManagement.openArchiveUserModal(id, name);
window.closeArchiveUserModal = () => AdminUserManagement.closeArchiveUserModal();
window.confirmArchiveUser = () => AdminUserManagement.confirmArchiveUser();

// ============================================
// ADMIN FUNCTIONS - Instructor Management
// ============================================
window.openAddInstructorModal = () => AdminInstructorManagement.openAddInstructorModal();
window.closeAddInstructorModal = () => AdminInstructorManagement.closeAddInstructorModal();
window.instrStepNext = () => AdminInstructorManagement.instrStepNext();
window.instrStepBack = () => AdminInstructorManagement.instrStepBack();
window.openEditInstructorModal = (id, name, dept, email, rank, type, status, load) => AdminInstructorManagement.openEditInstructorModal(id, name, dept, email, rank, type, status, load);
window.closeEditInstructorModal = () => AdminInstructorManagement.closeEditInstructorModal();
window.confirmEditInstructor = () => AdminInstructorManagement.confirmEditInstructor();
window.openArchiveInstructorModal = (id, name, dept) => AdminInstructorManagement.openArchiveInstructorModal(id, name, dept);
window.closeArchiveInstructorModal = () => AdminInstructorManagement.closeArchiveInstructorModal();
window.confirmArchiveInstructor = () => AdminInstructorManagement.confirmArchiveInstructor();

// ============================================
// ADMIN FUNCTIONS - Application Management
// ============================================
window.openApplicationModal = (id, studentNo, name, type, date, program, reason) => AdminApplicationManagement.openApplicationModal(id, studentNo, name, type, date, program, reason);
window.closeApplicationModal = () => AdminApplicationManagement.closeApplicationModal();
window.approveApplicationModal = () => AdminApplicationManagement.approveApplicationModal();
window.rejectApplicationModal = () => AdminApplicationManagement.rejectApplicationModal();
window.openViewApplicationModal = (id, name, type, status, date, reason, remarks) => AdminApplicationManagement.openViewApplicationModal(id, name, type, status, date, reason, remarks);
window.closeViewApplicationModal = () => AdminApplicationManagement.closeViewApplicationModal();

// ============================================
// ADMIN FUNCTIONS - Schedule Management
// ============================================
window.openEditScheduleModal = (course, section, instructor, day, startTime, endTime, room) => AdminScheduleManagement.openEditScheduleModal(course, section, instructor, day, startTime, endTime, room);
window.closeEditScheduleModal = () => AdminScheduleManagement.closeEditScheduleModal();
window.confirmEditSchedule = () => AdminScheduleManagement.confirmEditSchedule();
window.openDeleteScheduleModal = (course, section, instructor, day, time, room) => AdminScheduleManagement.openDeleteScheduleModal(course, section, instructor, day, time, room);
window.closeDeleteScheduleModal = () => AdminScheduleManagement.closeDeleteScheduleModal();
window.confirmDeleteSchedule = () => AdminScheduleManagement.confirmDeleteSchedule();

// ============================================
// ADMIN FUNCTIONS - Room Management
// ============================================
window.filterRoomsByDay = () => AdminRoomManagement.filterRoomsByDay();
window.openRoomDetailsModal = (roomKey) => AdminRoomManagement.openRoomDetailsModal(roomKey);
window.closeRoomDetailsModal = () => AdminRoomManagement.closeRoomDetailsModal();
window.openRoomUnavailableModal = (roomKey) => AdminRoomManagement.openRoomUnavailableModal(roomKey);
window.closeRoomUnavailableModal = () => AdminRoomManagement.closeRoomUnavailableModal();
window.confirmRoomUnavailable = () => AdminRoomManagement.confirmRoomUnavailable();
window.restoreRoom = (roomKey) => AdminRoomManagement.restoreRoom(roomKey);

// ============================================
// ADMIN FUNCTIONS - Grade Override
// ============================================
window.searchStudentGrade = () => AdminGradeOverride.searchStudentGrade();
window.openGradeOverrideModal = (index) => AdminGradeOverride.openGradeOverrideModal(index);
window.closeGradeOverrideModal = () => AdminGradeOverride.closeGradeOverrideModal();
window.confirmGradeOverride = () => AdminGradeOverride.confirmGradeOverride();

// ============================================
// ADMIN FUNCTIONS - Degree Audit
// ============================================
window.searchStudentAudit = () => AdminDegreeAudit.runAudit();

// ============================================
// ADMIN FUNCTIONS - Calendar
// ============================================
window.openUpdateCalendarModal = () => AdminCalendar.openUpdateCalendarModal();
window.closeUpdateCalendarModal = () => AdminCalendar.closeUpdateCalendarModal();
window.confirmUpdateCalendar = () => AdminCalendar.confirmUpdateCalendar();

// ============================================
// ADMIN FUNCTIONS - Announcements
// ============================================
window.closeAnnEditModal = () => AdminAnnouncements.closeAnnEditModal();
window.closeAnnDeleteModal = () => AdminAnnouncements.closeAnnDeleteModal();

// ============================================
// ADMIN FUNCTIONS - Account
// ============================================
window.closeEditAccountModalAdmin = () => AdminAccount.closeEditAccountModalAdmin();

// ============================================
// INSTRUCTOR FUNCTIONS - Gradebook
// ============================================
window.loadGradebook = (classCode) => InstructorGradebook.loadGradebook(classCode);
window.saveGrades = () => InstructorGradebook.saveGrades();
window.finalizeGrades = () => InstructorGradebook.finalizeGrades();
window.closeFinalizeModal = () => InstructorGradebook.closeFinalizeModal();
window.confirmFinalizeGrades = () => InstructorGradebook.confirmFinalizeGrades();

// ============================================
// INSTRUCTOR FUNCTIONS - Attendance
// ============================================
window.instrAttLoadSection = () => InstructorAttendance.loadSection();
window.instrLoadAttendanceSheet = () => InstructorAttendance.loadAttendanceSheet();
window.instrSaveAttendance = () => InstructorAttendance.saveAttendance();
window.instrSubmitAttendance = () => InstructorAttendance.submitAttendance();
window.closeSubmitAttendanceModal = () => InstructorAttendance.closeSubmitAttendanceModal();
window.confirmSubmitAttendance = () => InstructorAttendance.confirmSubmitAttendance();
window.loadAttendanceHistory = (classCode) => InstructorAttendance.loadAttendanceHistory(classCode);
window.instrOpenHistoryModal = (classCode, index) => InstructorAttendance.openHistoryModal(classCode, index);
window.closeAttendanceHistoryModal = () => InstructorAttendance.closeAttendanceHistoryModal();

// ============================================
// INSTRUCTOR FUNCTIONS - Applications
// ============================================
window.viewApplicationDetails = (appId) => InstructorApplications.viewApplicationDetails(appId);
window.closeInstrAppReviewModal = () => InstructorApplications.closeModal();

// ============================================
// INSTRUCTOR FUNCTIONS - Student Records
// ============================================
window.openInstrStudentProfile = (btn) => InstructorStudentRecords.openModal(btn);
window.closeInstrStudentProfile = () => InstructorStudentRecords.closeModal();
window.filterStudentsByClass = (value) => InstructorStudentRecords.filterByClass(value);
window.searchStudents = (query) => InstructorStudentRecords.searchStudents(query);

// ============================================
// INSTRUCTOR FUNCTIONS - Messaging
// ============================================
window.toggleInstrMessageFields = () => InstructorMessaging.toggleFields();

// ============================================
// INSTRUCTOR FUNCTIONS - Account
// ============================================
window.closeEditAccountModalInstr = () => InstructorAccount.closeEditModal();

// ============================================
// MODULE INITIALIZATION FUNCTIONS
// ============================================
function initStudentModules() {
  if (StudentEnrollment.init) StudentEnrollment.init();
  if (StudentAssessment.init) StudentAssessment.init();
  if (StudentApplications.init) StudentApplications.init();
  if (StudentGraduation.init) StudentGraduation.init();
  if (StudentEvaluation.init) StudentEvaluation.init();
  if (StudentAccount.init) StudentAccount.init();
}

function initAdminModules() {
  if (AdminStudentManagement.init) AdminStudentManagement.init();
  if (AdminCourseManagement.init) AdminCourseManagement.init();
  if (AdminProgramManagement.init) AdminProgramManagement.init();
  if (AdminSectionManagement.init) AdminSectionManagement.init();
  if (AdminUserManagement.init) AdminUserManagement.init();
  if (AdminInstructorManagement.init) AdminInstructorManagement.init();
  if (AdminApplicationManagement.init) AdminApplicationManagement.init();
  if (AdminScheduleManagement.init) AdminScheduleManagement.init();
  if (AdminRoomManagement.init) AdminRoomManagement.init();
  if (AdminGradeOverride.init) AdminGradeOverride.init();
  if (AdminAttendanceOverride.init) AdminAttendanceOverride.init();
  if (AdminDegreeAudit.init) AdminDegreeAudit.init();
  if (AdminMessaging.init) AdminMessaging.init();
  if (AdminAnnouncements.init) AdminAnnouncements.init();
  if (AdminCalendar.init) AdminCalendar.init();
  if (AdminAccount.init) AdminAccount.init();
}

function initInstructorModules() {
  if (InstructorGradebook.init) InstructorGradebook.init();
  if (InstructorAttendance.init) InstructorAttendance.init();
  if (InstructorApplications.init) InstructorApplications.init();
  if (InstructorStudentRecords.init) InstructorStudentRecords.init();
  if (InstructorMessaging.init) InstructorMessaging.init();
  if (InstructorAccount.init) InstructorAccount.init();
}

// ============================================
// PAGE INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded - Initializing");
  
  // Core UI initialization
  window.updateDate();
  ensureSidebarClosedOnLoad();
  window.initBackgroundSlideshow();
  keepDropdownOpenOnActive();
  initFormHandlers();
  initResetPasswordForm();
  initFlashMessages();
  initEscapeKeyHandler();
  initClassDetailsPanels(); // Initialize class details panels
  
  // Setup dropdown listeners to prevent event bubbling
  document.querySelectorAll(".dropdown-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("Dropdown button clicked - stopping propagation");
      e.stopPropagation();
    });
  });
  
  // Setup navigation listeners for mobile menu
  const navLinks = document.querySelectorAll(".sidebar-nav a.nav-item:not(.dropdown-btn), .sidebar-nav .sub-item");
  navLinks.forEach((link) => {
    link.addEventListener("click", function() {
      const menuBtn = document.querySelector(".mobile-menu-btn");
      if (menuBtn && window.getComputedStyle(menuBtn).display !== "none") {
        setTimeout(() => window.closeMobileMenu(), 150);
      }
    });
  });
  
  // Initialize all portal modules
  initStudentModules();
  initAdminModules();
  initInstructorModules();
  
  console.log("Initialization complete");
  console.log("toggleDropdown available:", typeof window.toggleDropdown === "function");
  console.log("launchLMS available:", typeof window.launchLMS === "function");
  console.log("toggleClassDetails available:", typeof window.toggleClassDetails === "function");
});

// ============================================
// SINGLE EXPORT - No duplicate exports
// ============================================
export { 
  globalNotif,
  $, $$, addClass, removeClass, toggleClass, setText, hideElement, showElement, scrollToElement,
  isValidGrade, computeSemGrade, formatCurrentDate,
  VALID_GRADES, STATUS_BADGE_CLASS
};