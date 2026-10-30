import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  FileCheck2, 
  Users, 
  Bell, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { NavigationTab, ClassSession, MidSemExam, FacultyMember, NoticeItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  classes: ClassSession[];
  exams: MidSemExam[];
  faculty: FacultyMember[];
  notices: NoticeItem[];
  onSelectNotice?: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  classes,
  exams,
  faculty,
  notices,
  onSelectNotice,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingClasses = q
    ? classes.filter(c =>
        c.subjectName.toLowerCase().includes(q) ||
        c.subjectCode.toLowerCase().includes(q) ||
        c.facultyName.toLowerCase().includes(q) ||
        c.classroom.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingExams = q
    ? exams.filter(e =>
        e.subjectName.toLowerCase().includes(q) ||
        e.subjectCode.toLowerCase().includes(q) ||
        e.dateDisplay.toLowerCase().includes(q) ||
        e.blockLocation.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingFaculty = q
    ? faculty.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.subjects.some(s => s.toLowerCase().includes(q)) ||
        f.cabin.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingNotices = q
    ? notices.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasResults = 
    matchingClasses.length > 0 || 
    matchingExams.length > 0 || 
    matchingFaculty.length > 0 || 
    matchingNotices.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-blue-700 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lectures, BEE, Maths, exam dates, Room 3206, faculty cabins..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-slate-800 placeholder-slate-400 bg-transparent text-sm sm:text-base outline-none font-semibold"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-md mr-2">
              ESC
            </kbd>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                Quick Shortcuts & Academic Inquiries
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('timetable');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 border border-blue-200 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-blue-700 text-white shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Room 3206 Regular Timetable</p>
                    <p className="text-[11px] text-blue-700">Monday to Friday lectures</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('midsem');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 border border-amber-200 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Oct 2026 Mid-Sem Datesheet</p>
                    <p className="text-[11px] text-amber-700">Exam schedule & countdown</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('assistant');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 border border-indigo-200 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-indigo-700 text-white shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Ask Gemini Campus Concierge</p>
                    <p className="text-[11px] text-indigo-700">Timetable & faculty QA</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('faculty');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-slate-100/70 hover:bg-slate-200/70 text-slate-900 border border-slate-200 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-white shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Faculty Cabins & Office Hours</p>
                    <p className="text-[11px] text-slate-600">Browse subject professors</p>
                  </div>
                </button>
              </div>
            </div>
          ) : hasResults ? (
            <div className="space-y-4">
              {/* Mid Sem Exams */}
              {matchingExams.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 px-2 mb-1.5 flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Mid-Sem Progressive Assessment Schedule ({matchingExams.length})
                  </span>
                  <div className="space-y-1">
                    {matchingExams.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          onNavigate('midsem');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 text-left transition-colors group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800">{ex.subjectName}</p>
                          <p className="text-[11px] text-slate-500">{ex.dateDisplay} ({ex.day}) • {ex.startTime} - {ex.endTime} • {ex.blockLocation}</p>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {ex.durationMins} Mins
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Classes */}
              {matchingClasses.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 px-2 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Regular Timetable ({matchingClasses.length})
                  </span>
                  <div className="space-y-1">
                    {matchingClasses.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => {
                          onNavigate('timetable');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 text-left transition-colors group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-800">{cls.subjectCode}: {cls.subjectName}</p>
                          <p className="text-[11px] text-slate-500">{cls.day} {cls.startTime}-{cls.endTime} • {cls.classroom} (Faculty: {cls.facultyName})</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty */}
              {matchingFaculty.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 px-2 mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Faculty Directory ({matchingFaculty.length})
                  </span>
                  <div className="space-y-1">
                    {matchingFaculty.map((fac) => (
                      <button
                        key={fac.id}
                        onClick={() => {
                          onNavigate('faculty');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{fac.name}</p>
                          <p className="text-[11px] text-slate-500">{fac.designation} • Cabin: {fac.cabin}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {matchingNotices.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 px-2 mb-1.5 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5" />
                    Circulars & Notices ({matchingNotices.length})
                  </span>
                  <div className="space-y-1">
                    {matchingNotices.map((ntc) => (
                      <button
                        key={ntc.id}
                        onClick={() => {
                          onNavigate('notices');
                          if (onSelectNotice) onSelectNotice(ntc.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 text-left transition-colors group"
                      >
                        <div className="max-w-md">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-rose-800 truncate">{ntc.title}</p>
                          <p className="text-[11px] text-slate-500">{ntc.category} • {ntc.date}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No records found for "{query}"</p>
              <button
                onClick={() => {
                  onNavigate('assistant');
                  onClose();
                }}
                className="mt-3 px-3.5 py-1.5 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-600 transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask AI Assistant instead
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>GEC Bharuch Academic Indexer</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
