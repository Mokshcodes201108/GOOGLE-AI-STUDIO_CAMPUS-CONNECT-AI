import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Upload, 
  Plus, 
  Calendar, 
  FileCheck2, 
  Bell, 
  Check, 
  AlertCircle, 
  Layers, 
  Edit3, 
  Trash2,
  FileText,
  Clock
} from 'lucide-react';
import { 
  ClassSession, 
  MidSemExam, 
  NoticeItem, 
  DepartmentName 
} from '../types';
import { AVAILABLE_DEPARTMENTS } from '../data/mockData';

interface AdminPanelViewProps {
  classes: ClassSession[];
  exams: MidSemExam[];
  notices: NoticeItem[];
  onAddClassSession: (session: ClassSession) => void;
  onAddExam: (exam: MidSemExam) => void;
  onAddNotice: (notice: NoticeItem) => void;
  onDeleteClassSession: (id: string) => void;
  onDeleteNotice: (id: string) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  classes,
  exams,
  notices,
  onAddClassSession,
  onAddExam,
  onAddNotice,
  onDeleteClassSession,
  onDeleteNotice,
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'timetables' | 'exams' | 'notices'>('timetables');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Class Session Form State
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCode, setNewSubjCode] = useState('31100XX');
  const [newFaculty, setNewFaculty] = useState('');
  const [newDay, setNewDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [newStartTime, setNewStartTime] = useState('10:30');
  const [newEndTime, setNewEndTime] = useState('11:30');
  const [newClassroom, setNewClassroom] = useState('Room 3206');
  const [newType, setNewType] = useState<'Lecture' | 'Lab' | 'Tutorial'>('Lecture');
  const [newPeriodNum, setNewPeriodNum] = useState(1);

  // New Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeItem['category']>('Academic');
  const [noticeIssuedBy, setNoticeIssuedBy] = useState('Principal Office, GEC Bharuch');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeIsUrgent, setNoticeIsUrgent] = useState(false);
  const [noticeFileName, setNoticeFileName] = useState('');

  // New Exam Form State
  const [examDate, setExamDate] = useState('2026-11-04');
  const [examSubject, setExamSubject] = useState('');
  const [examCode, setExamCode] = useState('31100XX');
  const [examDuration, setExamDuration] = useState(75);
  const [examHall, setExamHall] = useState('Room 3206');

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim() || !newFaculty.trim()) return;

    const created: ClassSession = {
      id: `admin_class_${Date.now()}`,
      lectureNumber: newPeriodNum,
      startTime: newStartTime,
      endTime: newEndTime,
      subjectCode: newSubjCode.trim(),
      subjectName: newSubjName.trim(),
      facultyName: newFaculty.trim(),
      day: newDay,
      type: newType,
      classroom: newClassroom.trim() || 'Room 3206',
      batch: 'All',
      colorTag: 'border-l-4 border-indigo-600 bg-indigo-50/70',
      isVerified: true,
    };

    onAddClassSession(created);
    setNewSubjName('');
    setNewFaculty('');
    showNotification('New class lecture added to Room 3206 timetable successfully!');
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const created: NoticeItem = {
      id: `admin_not_${Date.now()}`,
      title: noticeTitle.trim(),
      category: noticeCategory,
      date: new Date().toISOString().split('T')[0],
      issuedBy: noticeIssuedBy.trim(),
      isUrgent: noticeIsUrgent,
      content: noticeContent.trim(),
      attachmentName: noticeFileName.trim() ? `${noticeFileName.trim()}.pdf` : 'Official_Circular.pdf',
      attachmentSize: '450 KB',
      read: false,
    };

    onAddNotice(created);
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeFileName('');
    setNoticeIsUrgent(false);
    showNotification('New official notice published to the campus notice board!');
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject.trim()) return;

    const created: MidSemExam = {
      id: `admin_exam_${Date.now()}`,
      dateStr: examDate,
      dateDisplay: `${examDate.split('-')[2]} November 2026`,
      day: 'Wednesday',
      startTime: '11:00 AM',
      endTime: examDuration === 90 ? '12:30 PM' : '12:15 PM',
      durationMins: examDuration,
      subjectCode: examCode.trim(),
      subjectName: examSubject.trim(),
      department: 'Computer Engineering',
      semester: 1,
      syllabusOverview: ['Unit 1 to Unit 4 as per GTU prescribed syllabus'],
      blockLocation: examHall.trim() || 'Room 3206',
      isVerified: true,
    };

    onAddExam(created);
    setExamSubject('');
    showNotification('New Mid-Sem examination paper added to the schedule!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight">Admin & Faculty Control Panel</h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-200 mt-1">
            Government Engineering College, Bharuch • Timetable Management, Examination Datesheets & Circular Uploads
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center p-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold">
          <button
            onClick={() => setActiveAdminSubTab('timetables')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeAdminSubTab === 'timetables' ? 'bg-white text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Class Timetables</span>
          </button>
          <button
            onClick={() => setActiveAdminSubTab('exams')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeAdminSubTab === 'exams' ? 'bg-white text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Exams</span>
          </button>
          <button
            onClick={() => setActiveAdminSubTab('notices')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              activeAdminSubTab === 'notices' ? 'bg-white text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notices</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Subtab 1: Manage Timetables */}
      {activeAdminSubTab === 'timetables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-700" />
              Add / Update Lecture in Room 3206
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics-I or Programming in C"
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={newSubjCode}
                    onChange={(e) => setNewSubjCode(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Period Number</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newPeriodNum}
                    onChange={(e) => setNewPeriodNum(parseInt(e.target.value, 10))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. M. P. Shah"
                  value={newFaculty}
                  onChange={(e) => setNewFaculty(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Session Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                  >
                    <option value="Lecture">Theory Lecture</option>
                    <option value="Lab">Practical Lab</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Classroom / Lab</label>
                <input
                  type="text"
                  value={newClassroom}
                  onChange={(e) => setNewClassroom(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all"
              >
                Save to Room 3206 Timetable
              </button>
            </form>
          </div>

          {/* Existing Timetable Entries List (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Active Classes ({classes.filter(c => c.type !== 'Break').length} Lectures)
              </h4>
              <span className="text-xs text-slate-400">Classroom 3206</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {classes.filter(c => c.type !== 'Break').map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-blue-700">{item.day} P{item.lectureNumber}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono text-slate-600">{item.startTime} - {item.endTime}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">{item.classroom}</span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 mt-0.5">{item.subjectName}</h5>
                    <p className="text-[11px] text-slate-500">Faculty: {item.facultyName}</p>
                  </div>
                  <button
                    onClick={() => onDeleteClassSession(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Manage Mid-Sem Exams */}
      {activeAdminSubTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              Add Examination Paper
            </h3>

            <form onSubmit={handleCreateExam} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics-I"
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Duration</label>
                  <select
                    value={examDuration}
                    onChange={(e) => setExamDuration(parseInt(e.target.value, 10))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-600"
                  >
                    <option value={75}>75 Minutes (11:00 AM – 12:15 PM)</option>
                    <option value={90}>90 Minutes (11:00 AM – 12:30 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Exam Hall</label>
                  <input
                    type="text"
                    value={examHall}
                    onChange={(e) => setExamHall(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Add Exam to Schedule
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Current Progressive Assessment Schedule (Oct / Nov 2026)
            </h4>
            <div className="space-y-2">
              {exams.map((ex) => (
                <div key={ex.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-700">{ex.dateDisplay} ({ex.day})</span>
                    <h5 className="font-extrabold text-slate-900">{ex.subjectName}</h5>
                    <p className="text-[11px] text-slate-500">{ex.startTime} - {ex.endTime} • {ex.durationMins} Mins • {ex.blockLocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Upload & Manage Notices */}
      {activeAdminSubTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-600" />
              Publish New Academic Notice / Circular
            </h3>

            <form onSubmit={handleCreateNotice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Circular Title</label>
                <input
                  type="text"
                  placeholder="e.g. Progressive Assessment Seating Block & Hall Ticket Rules"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="GTU Circular">GTU Circular</option>
                    <option value="Events & Sports">Events & Sports</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={noticeIssuedBy}
                    onChange={(e) => setNoticeIssuedBy(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Notice Circular Body</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed notice text, guidelines, instructions, or exam timings..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Simulated Attachment File Name</label>
                <input
                  type="text"
                  placeholder="e.g. GECB_Notice_October_2026"
                  value={noticeFileName}
                  onChange={(e) => setNoticeFileName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={noticeIsUrgent}
                  onChange={(e) => setNoticeIsUrgent(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
                <label htmlFor="urgentCheck" className="text-xs font-bold text-slate-800">
                  Mark as High Priority / Urgent Notice (Beacon Badge)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Publish Circular Immediately
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Published Circulars ({notices.length})
            </h4>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {notices.map((nt) => (
                <div key={nt.id} className="p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-blue-700">{nt.category}</span>
                      {nt.isUrgent && <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-1.5 rounded">Urgent</span>}
                      <span className="text-slate-400 text-[10px]">{nt.date}</span>
                    </div>
                    <h5 className="font-extrabold text-slate-900 mt-0.5 line-clamp-1">{nt.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{nt.issuedBy}</p>
                  </div>
                  <button
                    onClick={() => onDeleteNotice(nt.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
