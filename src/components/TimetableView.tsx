import React, { useState } from 'react';
import { 
  ClassSession, 
  NavigationTab 
} from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Plus, 
  Download, 
  Grid3X3, 
  List, 
  Check, 
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';

interface TimetableViewProps {
  classes: ClassSession[];
  setActiveTab: (tab: NavigationTab) => void;
  onSelectLocation: (locId: string) => void;
  onAddClassSession: (newSession: ClassSession) => void;
}

const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const TimetableView: React.FC<TimetableViewProps> = ({
  classes,
  setActiveTab,
  onSelectLocation,
  onAddClassSession,
}) => {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Form for custom study slot
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('STUDY-01');
  const [newInstructor, setNewInstructor] = useState('Self / Study Group');
  const [newRoom, setNewRoom] = useState('Central Library Pod 4');
  const [newDay, setNewDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [newStartTime, setNewStartTime] = useState('16:30');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [newType, setNewType] = useState<'Lecture' | 'Lab' | 'Tutorial' | 'Seminar'>('Tutorial');

  const filteredDayClasses = classes.filter((c) => {
    const matchesDay = c.day === selectedDay;
    const matchesType = typeFilter === 'All' || c.type === typeFilter;
    return matchesDay && matchesType;
  });

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: ClassSession = {
      id: `custom_${Date.now()}`,
      courseCode: newCourseCode.trim() || 'SLOT',
      courseName: newTitle.trim(),
      instructor: newInstructor.trim(),
      room: newRoom.trim(),
      building: 'Campus Facility',
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      type: newType,
      color: 'from-violet-600 to-indigo-800',
    };

    onAddClassSession(created);
    setIsAddModalOpen(false);
    setSelectedDay(newDay);
    setNewTitle('');
  };

  const handleDownloadICS = () => {
    // Generate real .ics calendar string
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusConnect AI//Timetable//EN',
      'CALSCALE:GREGORIAN',
      ...classes.map(c => [
        'BEGIN:VEVENT',
        `SUMMARY:${c.courseCode} - ${c.courseName}`,
        `DESCRIPTION:Instructor: ${c.instructor} | Type: ${c.type}`,
        `LOCATION:${c.room}, ${c.building}`,
        `STATUS:CONFIRMED`,
        'END:VEVENT'
      ].join('\r\n')),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AIST_Fall2026_Timetable.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            Smart Academic Timetable
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fall 2026 Semester Schedule • 5th Semester AI & ML
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Day / Week View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'day' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Day View</span>
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Week Grid</span>
            </button>
          </div>

          {/* Export to Calendar */}
          <button
            onClick={handleDownloadICS}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-semibold transition-colors shadow-2xs"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Downloaded .ICS</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export to iCal</span>
              </>
            )}
          </button>

          {/* Add Study Slot */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Slot</span>
          </button>
        </div>
      </div>

      {/* Filter and Day Selector (for Day View) */}
      {viewMode === 'day' ? (
        <div className="space-y-4">
          {/* Day Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DAYS.map((day) => {
              const dayCount = classes.filter((c) => c.day === day).length;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {dayCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Type:
            </span>
            {['All', 'Lecture', 'Lab', 'Tutorial', 'Seminar'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors border ${
                  typeFilter === type
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Classes List */}
          {filteredDayClasses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No scheduled sessions</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No classes match your filter for {selectedDay}. You can add a custom study session or project sprint.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Schedule Study Slot
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDayClasses.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Gradient Badge */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex flex-col items-center justify-center text-white font-extrabold shrink-0 shadow-md`}>
                        <span className="text-[10px] uppercase opacity-80">{item.startTime}</span>
                        <span className="text-xs">{item.courseCode}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {item.courseName}
                          </h3>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {item.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                          <div className="flex items-center gap-1 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.instructor}</span>
                          </div>
                          <div className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{item.startTime} - {item.endTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Room & Campus Link */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                          {item.room}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">{item.building}</p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('campus');
                          onSelectLocation('loc_block_a');
                        }}
                        className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Navigate to Room</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Full Week Grid View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-6 divide-x divide-slate-200">
              {DAYS.map((day) => {
                const daySessions = classes.filter((c) => c.day === day);
                return (
                  <div key={day} className="flex flex-col">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 text-center">
                      <p className="text-xs font-extrabold text-slate-900">{day}</p>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {daySessions.length} Classes
                      </span>
                    </div>

                    <div className="p-2 space-y-2 min-h-[420px] bg-slate-50/30">
                      {daySessions.length === 0 ? (
                        <div className="text-center py-12 text-slate-300 text-xs">
                          No classes
                        </div>
                      ) : (
                        daySessions.map((session) => (
                          <div
                            key={session.id}
                            className={`p-2.5 rounded-xl text-white text-xs shadow-xs bg-gradient-to-br ${session.color}`}
                          >
                            <p className="font-extrabold text-[11px] opacity-90">{session.startTime} - {session.endTime}</p>
                            <p className="font-bold text-xs mt-0.5 line-clamp-1">{session.courseCode}</p>
                            <p className="text-[10px] opacity-90 line-clamp-1">{session.courseName}</p>
                            <div className="mt-2 pt-1 border-t border-white/20 flex items-center justify-between text-[10px]">
                              <span className="font-semibold">{session.room}</span>
                              <span className="opacity-80">{session.type}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Study Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" 
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                Add Personal Study / Sprint Slot
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session / Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Capstone Project Sprint or Exam Revision"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Code / Label</label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Room</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="Tutorial">Tutorial / Study</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab / Coding</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
