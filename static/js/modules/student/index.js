// Student module entry point
import { StudentEnrollment } from './enrollment.js';
import { StudentAssessment } from './assessment.js';
import { StudentApplications } from './applications.js';
import { StudentGraduation } from './graduation.js';
import { StudentEvaluation } from './evaluation.js';
import { StudentAccount } from './account.js';

export function initStudentModules() {
  StudentEnrollment.init();
  StudentAssessment.init();
  StudentApplications.init();
  StudentGraduation.init();
  StudentEvaluation.init();
  StudentAccount.init();
}