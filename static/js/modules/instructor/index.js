// Instructor module entry point
import { InstructorGradebook } from './gradebook.js';
import { InstructorAttendance } from './attendance.js';
import { InstructorApplications } from './applications.js';
import { InstructorStudentRecords } from './student-records.js';
import { InstructorMessaging } from './messaging.js';
import { InstructorAccount } from './account.js';

export function initInstructorModules() {
  InstructorGradebook.init();
  InstructorAttendance.init();
  InstructorApplications.init();
  InstructorStudentRecords.init();
  InstructorMessaging.init();
  InstructorAccount.init();
}