export type NavigationTab = 
  | 'dashboard' 
  | 'assistant' 
  | 'timetable' 
  | 'notices' 
  | 'campus' 
  | 'grievance' 
  | 'study-buddy'
  | 'landing';

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  program: string;
  semester: number;
  section: string;
  email: string;
  avatarUrl: string;
  cgpa: number;
  overallAttendance: number;
  totalCredits: number;
  earnedCredits: number;
}

export interface ClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  room: string;
  building: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';
  color: string;
}

export interface SubjectAttendance {
  id: string;
  courseCode: string;
  courseName: string;
  attended: number;
  total: number;
  percentage: number;
  faculty: string;
  status: 'safe' | 'warning' | 'critical';
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Examinations' | 'Events & Hackathons' | 'Placements' | 'Hostel & Transport';
  date: string;
  publisher: string;
  publisherRole: string;
  isUrgent?: boolean;
  content: string;
  attachmentName?: string;
  attachmentSize?: string;
  read: boolean;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: 'Academic' | 'Administrative' | 'Recreation' | 'Food' | 'Hostel' | 'Utility';
  coordinates: { x: number; y: number }; // percentage on map (0-100)
  floors: number;
  description: string;
  keyFacilities: string[];
  headOrContact: string;
  timing: string;
  image: string;
}

export type GrievanceStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Escalated';
export type GrievancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface GrievanceTimelineEvent {
  date: string;
  title: string;
  note: string;
  by: string;
}

export interface GrievanceTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: 'Academic' | 'Hostel & Mess' | 'Infrastructure & WiFi' | 'Library' | 'Transport' | 'Administrative';
  priority: GrievancePriority;
  status: GrievanceStatus;
  createdAt: string;
  updatedAt: string;
  description: string;
  location?: string;
  assignedTo: string;
  isAnonymous: boolean;
  timeline: GrievanceTimelineEvent[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
