import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Calendar, 
  Bell, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { NavigationTab } from '../types';
import { 
  CAMPUS_LOCATIONS, 
  TIMETABLE_CLASSES, 
  ANNOUNCEMENTS, 
  INITIAL_GRIEVANCES 
} from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onSelectLocation?: (locId: string) => void;
  onSelectNotice?: (noticeId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectLocation,
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

  // Global keydown handler for ESC and Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle modal handled in parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchingLocations = q
    ? CAMPUS_LOCATIONS.filter(l => 
        l.name.toLowerCase().includes(q) || 
        l.code.toLowerCase().includes(q) ||
        l.keyFacilities.some(f => f.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  const matchingClasses = q
    ? TIMETABLE_CLASSES.filter(c =>
        c.courseCode.toLowerCase().includes(q) ||
        c.courseName.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingNotices = q
    ? ANNOUNCEMENTS.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingGrievances = q
    ? INITIAL_GRIEVANCES.filter(g =>
        g.ticketNumber.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      ).slice(0, 2)
    : [];

  const hasResults = 
    matchingLocations.length > 0 || 
    matchingClasses.length > 0 || 
    matchingNotices.length > 0 || 
    matchingGrievances.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-indigo-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search classes, rooms, circulars, lab facilities, or ask AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-slate-800 placeholder-slate-400 bg-transparent text-base outline-none font-medium"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md mr-2">
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
            // Suggested Quick Actions
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
                Quick Shortcuts & AI Prompts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('assistant');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 border border-indigo-100 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ask Gemini Campus Concierge</p>
                    <p className="text-xs text-indigo-600/80">Campus policies, rules, and questions</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('study-buddy');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 border border-purple-100 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0 shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Generate AI Quiz or Summarize</p>
                    <p className="text-xs text-purple-600/80">Instant study material with AI</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('campus');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border border-emerald-100 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Campus Route Finder</p>
                    <p className="text-xs text-emerald-600/80">Walk directions to labs & library</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('grievance');
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 text-left rounded-xl bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 border border-amber-100 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0 shadow-xs">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">File Grievance / Complaint</p>
                    <p className="text-xs text-amber-600/80">Track facility or academic issues</p>
                  </div>
                </button>
              </div>
            </div>
          ) : hasResults ? (
            <div className="space-y-4">
              {/* Campus Locations */}
              {matchingLocations.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Campus Buildings & Labs ({matchingLocations.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingLocations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onNavigate('campus');
                          if (onSelectLocation) onSelectLocation(loc.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">{loc.name}</p>
                            <p className="text-xs text-slate-500">{loc.code} • {loc.floors} Floors • {loc.timing}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes */}
              {matchingClasses.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Classes & Timetable ({matchingClasses.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingClasses.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => {
                          onNavigate('timetable');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-purple-600">{cls.courseCode}: {cls.courseName}</p>
                            <p className="text-xs text-slate-500">{cls.day} {cls.startTime} - {cls.endTime} • {cls.room} ({cls.instructor})</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {cls.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {matchingNotices.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-rose-600" />
                    <span>Circulars & Announcements ({matchingNotices.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingNotices.map((ntc) => (
                      <button
                        key={ntc.id}
                        onClick={() => {
                          onNavigate('notices');
                          if (onSelectNotice) onSelectNotice(ntc.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="max-w-md">
                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-rose-600">{ntc.title}</p>
                            <p className="text-xs text-slate-500">{ntc.category} • {ntc.date}</p>
                          </div>
                        </div>
                        {ntc.isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Urgent
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Grievances */}
              {matchingGrievances.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Grievance Tickets ({matchingGrievances.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingGrievances.map((grv) => (
                      <button
                        key={grv.id}
                        onClick={() => {
                          onNavigate('grievance');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-600">[{grv.ticketNumber}] {grv.title}</p>
                            <p className="text-xs text-slate-500">{grv.category} • Status: {grv.status}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {grv.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No matching campus records found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Lab", "Library", "CS501", or "Attendance"</p>
              <button
                onClick={() => {
                  onNavigate('assistant');
                  onClose();
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask Gemini Assistant instead
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600">↑↓</kbd>
            <span>to navigate</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600">Enter</kbd>
            <span>to select</span>
          </div>
          <span className="font-medium text-indigo-600">CampusConnect AI Search</span>
        </div>
      </div>
    </div>
  );
};
