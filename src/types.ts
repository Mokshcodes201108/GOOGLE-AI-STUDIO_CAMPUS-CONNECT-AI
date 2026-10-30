export type NavigationTab = 
  | 'dashboard' 
  | 'timetable' 
  | 'midsem'
  | 'assistant' 
  | 'faculty' 
  | 'notices' 
  | 'admin'
  | 'landing';

export type DepartmentName = 
  | 'Computer Engineering'
  | 'Mechanical Engineering'
  | 'Electrical Engineering'
  | 'Chemical Engineering'
  | 'Civil Engineering'
  | 'Electronics & Communication';

export interface BranchFilterState {
  department: DepartmentName;
  semester: number;
  academicYear: string;
  division: string;
  classroom: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  enrollmentNumber: string;
  collegeName: string;
  department: DepartmentName;
  semester: number;
  division: string;
  classroom: string;
  email: string;
  avatarUrl: string;
  currentAttendance: number;
  totalCredits: number;
}

export interface ClassSession {
  id: string;
  lectureNumber: number;
  startTime: string; // "10:30"
  endTime: string;   // "11:30"
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Break';
  classroom: string;
  batch?: 'All' | 'Batch A' | 'Batch B' | 'Batch C';
  colorTag?: string;
  isVerified?: boolean;
}

export interface MidSemExam {
  id: string;
  dateStr: string;   // "2026-10-27"
  dateDisplay: string; // "27 October 2026"
  day: string;       // "Monday"
  startTime: string; // "11:00 AM"
  endTime: string;   // "12:30 PM" or "12:15 PM"
  durationMins: number; // 90 for Math-I, 75 for others
  subjectCode: string;
  subjectName: string;
  department: DepartmentName;
  semester: number;
  syllabusOverview: string[];
  blockLocation: string;
  isVerified: boolean;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  cabin: string;
  email: string;
  contactExt?: string;
  subjects: string[];
  qualification: string;
  consultationHours: string;
  avatarUrl: string;
  isVerified: boolean;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'GTU Circular' | 'Events & Sports' | 'Administrative';
  date: string;
  issuedBy: string;
  isUrgent?: boolean;
  content: string;
  attachmentName?: string;
  attachmentSize?: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sourceVerified?: boolean;
}



