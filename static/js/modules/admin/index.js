// Admin module entry point
import { AdminStudentManagement } from './student-management.js';
import { AdminCourseManagement } from './course-management.js';
import { AdminProgramManagement } from './program-management.js';
import { AdminSectionManagement } from './section-management.js';
import { AdminUserManagement } from './user-management.js';
import { AdminInstructorManagement } from './instructor-management.js';
import { AdminApplicationManagement } from './application-management.js';
import { AdminScheduleManagement } from './schedule-management.js';
import { AdminRoomManagement } from './room-management.js';
import { AdminGradeOverride } from './grade-override.js';
import { AdminAttendanceOverride } from './attendance-override.js';
import { AdminDegreeAudit } from './degree-audit.js';
import { AdminMessaging } from './messaging.js';
import { AdminAnnouncements } from './announcements.js';
import { AdminCalendar } from './calendar.js';
import { AdminAccount } from './account.js';

export function initAdminModules() {
  AdminStudentManagement.init();
  AdminCourseManagement.init();
  AdminProgramManagement.init();
  AdminSectionManagement.init();
  AdminUserManagement.init();
  AdminInstructorManagement.init();
  AdminApplicationManagement.init();
  AdminScheduleManagement.init();
  AdminRoomManagement.init();
  AdminGradeOverride.init();
  AdminAttendanceOverride.init();
  AdminDegreeAudit.init();
  AdminMessaging.init();
  AdminAnnouncements.init();
  AdminCalendar.init();
  AdminAccount.init();
}