// Centralized constants

export const VALID_GRADES = ["1.00","1.25","1.50","1.75","2.00","2.25","2.50","2.75","3.00","5.00","INC","DRP"];

export const STATUS_BADGE_CLASS = {
  Present: "status-present",
  Absent: "status-absent",
  Late: "status-late",
  Excused: "status-excused",
  Completed: "status-enrolled",
  "In Progress": "status-pending",
  "Not Taken": "status-NotTaken",
  Pending: "status-pending",
  Finalized: "status-enrolled"
};

export const BACKGROUND_IMAGES = [
  "/static/images/bg7.png",
  "/static/images/bg1.jpg",
  "/static/images/bg2.jpg",
  "/static/images/bg3.jpg",
  "/static/images/bg4.jpg",
  "/static/images/bg5.jpg", 
  "/static/images/bg6.jpg",
  "/static/images/bg8.jpg",
  "/static/images/bg9.jpg",
  "/static/images/bg10.jpg",
  "/static/images/bg11.jpg",
  "/static/images/bg12.jpg"
];

export const DATE_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const GRADE_LEVELS = [
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" }
];

export const SEMESTERS = [
  { label: "1st Semester", value: "1st" },
  { label: "2nd Semester", value: "2nd" },
  { label: "Summer", value: "summer" }
];

export const STUDENT_STATUSES = [
  { label: "Regular", value: "Regular" },
  { label: "Irregular", value: "Irregular" },
  { label: "Transferee", value: "Transferee" },
  { label: "Returnee", value: "Returnee" },
  { label: "Graduated", value: "Graduated" },
  { label: "Inactive", value: "Inactive" }
];

export const INSTRUCTOR_RANKS = [
  { label: "Instructor I", value: "Instructor I" },
  { label: "Instructor II", value: "Instructor II" },
  { label: "Instructor III", value: "Instructor III" },
  { label: "Assistant Professor I", value: "Assistant Professor I" },
  { label: "Assistant Professor II", value: "Assistant Professor II" },
  { label: "Assistant Professor III", value: "Assistant Professor III" },
  { label: "Associate Professor I", value: "Associate Professor I" },
  { label: "Associate Professor II", value: "Associate Professor II" },
  { label: "Associate Professor III", value: "Associate Professor III" },
  { label: "Professor I", value: "Professor I" },
  { label: "Professor II", value: "Professor II" },
  { label: "Professor III", value: "Professor III" }
];

export const EMPLOYMENT_TYPES = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contractual", value: "Contractual" }
];

export const ATTENDANCE_STATUSES = [
  { label: "Present", value: "Present", class: "status-present" },
  { label: "Absent", value: "Absent", class: "status-absent" },
  { label: "Late", value: "Late", class: "status-late" },
  { label: "Excused", value: "Excused", class: "status-excused" }
];