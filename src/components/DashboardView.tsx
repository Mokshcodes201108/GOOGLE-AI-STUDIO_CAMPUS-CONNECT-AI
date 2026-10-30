import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  ClassSession, 
  MidSemExam, 
  NoticeItem, 
  NavigationTab,
  BranchFilterState 
} from '../types';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  GraduationCap, 
  FileCheck2, 
  User, 
  MapPin, 
  Layers, 
  Timer,
  ChevronRight,
  Download
} from 'lucide-react';

interface DashboardViewProps {
  student: StudentProfile;
  todayClasses: ClassSession[];
  nextExam: MidSemExam;
  notices: NoticeItem[];
  branchFilter: BranchFilterState;
  setActiveTab: (tab: NavigationTab) => void;
  onAskAI: (prompt: string) => void;
  onOpenBranchFilter: () => void;
  onSelectNotice: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  student,
  todayClasses,
  nextExam,
  notices,
  branchFilter,
  setActiveTab,
  onAskAI,
  onOpenBranchFilter,
  onSelectNotice,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');

  // Countdown to next exam: 27 October 2026, 11:00 AM
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const examDate = new Date(`${nextExam.dateStr}T11:00:00`);
      const now = new Date();
      const diff = examDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextExam]);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onAskAI(quickPrompt.trim());
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/50">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-36 -top-12 w-60 h-60 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/15 text-blue-200">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Government Engineering College, Bharuch • GTU Affiliated</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Namaste, {student.name}!
            </h2>

            <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
              Enrolled in <strong className="text-white font-bold">{branchFilter.department} (Semester {branchFilter.semester})</strong>.
              Your allocated theory lectures are held in <strong className="text-amber-300 font-extrabold">{branchFilter.classroom}</strong>.
              You have <strong className="text-white font-bold">{todayClasses.filter(c => c.type !== 'Break').length} academic sessions</strong> scheduled today.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-blue-900/70 border border-blue-700/60 font-semibold text-blue-200">
                Enrollment: {student.enrollmentNumber}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-700/60 font-semibold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Attendance: {student.currentAttendance}% (GTU Safe &gt; 75%)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('timetable')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-700/30 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Room 3206 Timetable</span>
            </button>
            <button
              onClick={() => setActiveTab('midsem')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Mid-Sem Exam Datesheet</span>
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Ask AI Concierge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Exam Countdown Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Upcoming Mid-Sem Exam</span>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 truncate">{nextExam.subjectName}</h4>
          <p className="text-xs font-mono font-bold text-blue-700 mt-0.5">{nextExam.dateDisplay} • {nextExam.startTime}</p>
          
          <div className="mt-3 p-2 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-center">
            <div>
              <span className="text-base font-black text-amber-950 block">{timeLeft.days}</span>
              <span className="text-[9px] uppercase font-bold text-amber-800">Days</span>
            </div>
            <span className="text-amber-400 font-bold">:</span>
            <div>
              <span className="text-base font-black text-amber-950 block">{timeLeft.hours}</span>
              <span className="text-[9px] uppercase font-bold text-amber-800">Hours</span>
            </div>
            <span className="text-amber-400 font-bold">:</span>
            <div>
              <span className="text-base font-black text-amber-950 block">{timeLeft.minutes}</span>
              <span className="text-[9px] uppercase font-bold text-amber-800">Mins</span>
            </div>
            <span className="text-amber-400 font-bold">:</span>
            <div>
              <span className="text-base font-black text-amber-950 block">{timeLeft.seconds}</span>
              <span className="text-[9px] uppercase font-bold text-amber-800">Secs</span>
            </div>
          </div>
        </div>

        {/* Today's Lectures Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Today's Class Schedule</span>
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{todayClasses.filter(c => c.type !== 'Break').length} Lectures</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 truncate">First class at 10:30 AM in {branchFilter.classroom}</p>
          <button
            onClick={() => setActiveTab('timetable')}
            className="mt-3 text-xs font-extrabold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
          >
            Open day timetable <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Classroom Allocation */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Allocated Classroom</span>
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{branchFilter.classroom}</span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Block 3
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">3rd Floor, Computer Engineering Wing</p>
          <p className="mt-1 text-[11px] text-slate-400">PPS Lab: Lab 3208 • Drawing: Hall 2</p>
        </div>

        {/* GTU Attendance Compliance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">GTU Attendance Sentinel</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{student.currentAttendance}%</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
              Safe (&gt; 75%)
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${student.currentAttendance}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-emerald-700 font-semibold">
            Term-work endorsement eligible for GTU
          </p>
        </div>
      </div>

      {/* Main Grid: Left (Today's Classes & Next Exam) & Right (AI Box & Circulars) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Today's Classes & Mid-Sem Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Lectures in Room 3206 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  Today's Lectures & Labs (Monday)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regular timetable for Semester 1 Computer Engineering in {branchFilter.classroom}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-extrabold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                Full Week View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayClasses.map((item, idx) => {
                const isBreak = item.type === 'Break';
                if (isBreak) {
                  return (
                    <div 
                      key={item.id}
                      className="py-2 px-4 rounded-xl bg-slate-100/80 border border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-600"
                    >
                      <span className="font-bold flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.startTime} - {item.endTime}: {item.subjectName}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.classroom}</span>
                    </div>
                  );
                }

                const isFirst = idx === 0;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isFirst 
                        ? 'bg-blue-50/60 border-blue-200/90 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex flex-col items-center justify-center font-black shrink-0 shadow-xs">
                          <span className="text-[9px] uppercase tracking-wider opacity-80">Lec</span>
                          <span className="text-sm leading-none">{item.lectureNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-extrabold text-slate-900">{item.subjectCode}</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {item.type}
                            </span>
                            {isFirst && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                                Upcoming First
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{item.subjectName}</h4>
                          <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Faculty: <strong className="text-slate-800">{item.facultyName}</strong></span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-xs font-black text-slate-800 flex items-center gap-1 sm:justify-end">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.startTime} - {item.endTime}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold block mt-1">
                          {item.classroom}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mid-Sem Examination Progressive Assessment Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-blue-50/50 border border-amber-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Mid-Sem Progressive Assessment Schedule (October 2026)
                  </h3>
                  <p className="text-xs text-slate-500">Computer Engineering • Semester 1 • Room 3206</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('midsem')}
                className="text-xs font-black text-amber-800 hover:text-amber-900 underline"
              >
                View Full Datesheet
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">Next Paper: Mathematics-I (Calculus)</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">90 Minutes Exam</span>
              </div>
              <p className="text-xs text-slate-600">
                Exam Date: <strong>Monday, 27 October 2026 (11:00 AM – 12:30 PM)</strong>. 
                Seating block in <strong>Room 3206</strong>. Non-programmable scientific calculator permitted.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                <span>Remaining papers: BEE (28 Oct), PPS (29 Oct), EGD (30 Oct), EVS (02 Nov)</span>
                <button
                  onClick={() => setActiveTab('midsem')}
                  className="text-blue-700 font-bold hover:underline"
                >
                  Full timetable &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): AI Campus Concierge & Circulars */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Campus Assistant Widget */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-blue-950 text-white shadow-lg border border-blue-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black">AI Campus Assistant</h4>
                <p className="text-[11px] text-blue-300">GEC Bharuch Timetable & Exam Guide</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Ask anything about your Semester 1 timetable, upcoming exams, or faculty cabins:
            </p>

            <form onSubmit={handleQuickSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="e.g. When is my Mathematics examination?"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white/15"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
              >
                <span>Ask AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  onAskAI("What is my next lecture today?");
                  setActiveTab('assistant');
                }}
                className="text-[10px] px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-blue-200 transition-colors"
              >
                ⏱️ Next lecture?
              </button>
              <button
                onClick={() => {
                  onAskAI("When is my Mathematics examination?");
                  setActiveTab('assistant');
                }}
                className="text-[10px] px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-blue-200 transition-colors"
              >
                📅 Math exam date?
              </button>
              <button
                onClick={() => {
                  onAskAI("Who teaches Basic Electrical Engineering?");
                  setActiveTab('assistant');
                }}
                className="text-[10px] px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-blue-200 transition-colors"
              >
                👨‍🏫 Who teaches BEE?
              </button>
              <button
                onClick={() => {
                  onAskAI("What is my timetable for Wednesday?");
                  setActiveTab('assistant');
                }}
                className="text-[10px] px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-blue-200 transition-colors"
              >
                🗓️ Wednesday schedule?
              </button>
            </div>
          </div>

          {/* Official Notices & Circulars */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Latest GEC Bharuch Circulars
              </h4>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs text-blue-700 hover:text-blue-900 font-extrabold"
              >
                View all ({notices.length})
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectNotice(item.id)}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 line-clamp-2">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                    {item.issuedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Academic Document Downloads */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Quick Academic Resources
            </h5>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('timetable')}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-2xs"
              >
                <span>Room 3206 Regular Timetable (PDF / iCal)</span>
                <Download className="w-3.5 h-3.5 text-blue-600" />
              </button>
              <button
                onClick={() => setActiveTab('midsem')}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-2xs"
              >
                <span>Oct 2026 Progressive Assessment Schedule</span>
                <Download className="w-3.5 h-3.5 text-amber-600" />
              </button>
              <button
                onClick={() => setActiveTab('faculty')}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-left text-xs font-bold text-slate-800 flex items-center justify-between transition-colors shadow-2xs"
              >
                <span>Faculty Directory & Office Cabins</span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
