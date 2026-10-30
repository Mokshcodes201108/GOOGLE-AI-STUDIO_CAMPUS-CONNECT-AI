import React, { useState } from 'react';
import { 
  StudentProfile, 
  SubjectAttendance, 
  ClassSession, 
  Announcement, 
  NavigationTab 
} from '../types';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Bus, 
  Coffee, 
  Calculator,
  ChevronRight,
  ExternalLink,
  Flame,
  UserCheck
} from 'lucide-react';

interface DashboardViewProps {
  student: StudentProfile;
  attendances: SubjectAttendance[];
  todayClasses: ClassSession[];
  announcements: Announcement[];
  setActiveTab: (tab: NavigationTab) => void;
  onSelectNotice: (id: string) => void;
  onAskAI: (prompt: string) => void;
  onSelectLocation: (locId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  student,
  attendances,
  todayClasses,
  announcements,
  setActiveTab,
  onSelectNotice,
  onAskAI,
  onSelectLocation,
}) => {
  // Quick AI prompt input
  const [quickPrompt, setQuickPrompt] = useState('');

  // Attendance Forecaster State
  const [selectedCourseId, setSelectedCourseId] = useState(attendances[2]?.id || attendances[0]?.id);
  const [hypotheticalAttended, setHypotheticalAttended] = useState(3);
  const [hypotheticalMissed, setHypotheticalMissed] = useState(0);

  const selectedCourse = attendances.find(a => a.id === selectedCourseId) || attendances[0];
  const forecastedTotal = (selectedCourse?.total || 0) + hypotheticalAttended + hypotheticalMissed;
  const forecastedAttended = (selectedCourse?.attended || 0) + hypotheticalAttended;
  const forecastedPercentage = forecastedTotal > 0 
    ? Math.round((forecastedAttended / forecastedTotal) * 1000) / 10 
    : 0;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onAskAI(quickPrompt.trim());
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-48 h-48 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/15 text-indigo-200">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Academic Week 8 • Mid-Terms in 17 Days</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {student.name}!
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              You are enrolled in <span className="text-white font-semibold">{student.program}</span>. 
              You have <span className="text-amber-300 font-bold">{todayClasses.length} sessions</span> scheduled today.
              Your overall attendance is <span className="text-emerald-300 font-bold">{student.overallAttendance}%</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('assistant')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-50 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('study-buddy')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700/90 text-white text-xs sm:text-sm font-semibold border border-indigo-400/30 backdrop-blur-md transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>AI Study Buddy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{student.overallAttendance}%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Safe &gt; 75%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${student.overallAttendance}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>1 course below 75% threshold</span>
          </p>
        </div>

        {/* CGPA Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cumulative GPA</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{student.cgpa}</span>
            <span className="text-xs font-semibold text-slate-400">Scale of 10.0</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-indigo-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +0.14 vs Sem 4
            </span>
            <span className="text-slate-500 font-medium">Top 5% in AI&DS</span>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-400">
            Next target: 9.00 Magna Cum Laude
          </div>
        </div>

        {/* Credits Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Degree Credits</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{student.earnedCredits}</span>
            <span className="text-xs font-semibold text-slate-400">of {student.totalCredits} req.</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${(student.earnedCredits / student.totalCredits) * 100}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>72.3% Completed</span>
            <span className="font-semibold text-purple-700">36 Credits Left</span>
          </div>
        </div>

        {/* Grievances Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Grievances & Help</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">2 Active</span>
            <span className="text-xs font-semibold text-emerald-600">1 Resolved</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs text-slate-600 truncate">GRV-894: GPU Lab AC in progress</span>
          </div>
          <button
            onClick={() => setActiveTab('grievance')}
            className="mt-2.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            Track tickets <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left (Classes & Forecaster) vs Right (Notices & Utilities) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Timeline */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Today's Class Schedule (Monday)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">3 academic sessions scheduled today</p>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Full Week Timetable <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayClasses.map((item, index) => {
                const isOngoing = index === 0; // Simulate first class as ongoing / next
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isOngoing 
                        ? 'bg-indigo-50/50 border-indigo-200/90 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-white shrink-0 shadow-xs bg-gradient-to-br ${item.color}`}>
                          <span className="text-[10px] uppercase font-semibold">Rm</span>
                          <span className="text-xs leading-none">{item.room.replace('Room ', '')}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{item.courseCode}</span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {item.type}
                            </span>
                            {isOngoing && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                                Next Session
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.courseName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Instructor: {item.instructor}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{item.startTime} - {item.endTime}</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('campus');
                            onSelectLocation('loc_block_b');
                          }}
                          className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>{item.building}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject-Wise Attendance Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Subject Attendance & 75% Rule Monitor
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  University regulations require minimum 75% attendance to sit for end-semester exams.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {attendances.map((subj) => {
                const isCritical = subj.percentage < 75;
                const isWarning = subj.percentage >= 75 && subj.percentage < 80;
                
                // Calculate how many classes can miss or need to attend
                // To get 75%: (attended + X) / (total + X) >= 0.75 => attended + X >= 0.75*total + 0.75*X => 0.25*X >= 0.75*total - attended => X = ceil(3*total - 4*attended)
                const needToAttend = isCritical ? Math.max(1, Math.ceil(3 * subj.total - 4 * subj.attended)) : 0;
                // Can miss: (attended) / (total + Y) >= 0.75 => attended >= 0.75*(total + Y) => 4/3*attended - total >= Y
                const canMiss = !isCritical ? Math.floor((4 * subj.attended) / 3 - subj.total) : 0;

                return (
                  <div
                    key={subj.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCritical
                        ? 'bg-rose-50/40 border-rose-200'
                        : isWarning
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">{subj.courseCode}</span>
                          {isCritical && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-700">
                              Critical
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{subj.courseName}</h4>
                        <p className="text-[11px] text-slate-500">{subj.faculty}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-black ${
                          isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {subj.percentage}%
                        </span>
                        <p className="text-[10px] text-slate-500">{subj.attended} / {subj.total} attended</p>
                      </div>
                    </div>

                    <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${
                          isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${subj.percentage}%` }}
                      />
                    </div>

                    <div className="mt-2 text-[11px] flex items-center justify-between">
                      {isCritical ? (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Must attend next {needToAttend} classes to reach 75%
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">
                          Can miss {canMiss} class{canMiss === 1 ? '' : 'es'} safely
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Attendance Forecaster Calculator */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Attendance Simulator & Forecaster</h3>
                <p className="text-xs text-slate-500">Plan ahead before taking leave or missing college classes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-indigo-500"
                >
                  {attendances.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.courseCode} ({a.percentage}%) - {a.courseName.slice(0, 20)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attend Next (Classes): <span className="text-indigo-600 font-extrabold">{hypotheticalAttended}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={hypotheticalAttended}
                  onChange={(e) => setHypotheticalAttended(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Miss Next (Classes): <span className="text-rose-600 font-extrabold">{hypotheticalMissed}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={hypotheticalMissed}
                  onChange={(e) => setHypotheticalMissed(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white border border-indigo-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-slate-500">Forecasted Outcome for {selectedCourse?.courseCode}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 line-through">{selectedCourse?.percentage}%</span>
                  <span className={`text-xl font-extrabold ${forecastedPercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {forecastedPercentage}%
                  </span>
                  <span className="text-xs text-slate-600">
                    ({forecastedAttended} of {forecastedTotal} sessions)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {forecastedPercentage >= 75 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Eligible for End-Sem Exam
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Debarred Risk (&lt;75%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Quick Chat + Campus Services & Notices */}
        <div className="space-y-6">
          {/* AI Quick Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-900 to-slate-900 text-white shadow-lg shadow-indigo-950/20">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Ask Gemini Assistant</h4>
                <p className="text-[11px] text-indigo-300">AIST Campus Concierge</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Ask about classroom locations, exam circulars, library timings, or hostel leave permissions.
            </p>

            <form onSubmit={handleQuickSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="e.g., Where is GPU Lab 402 located?"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>Ask AI Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  onAskAI("Where is GPU Lab 402 and what are its open hours?");
                  setActiveTab('assistant');
                }}
                className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
              >
                📍 Find GPU Lab 402
              </button>
              <button
                onClick={() => {
                  onAskAI("What is the mandatory attendance criteria for exams?");
                  setActiveTab('assistant');
                }}
                className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
              >
                📋 Attendance Policy
              </button>
              <button
                onClick={() => {
                  onAskAI("When does the campus shuttle run between North Gate and Metro?");
                  setActiveTab('assistant');
                }}
                className="text-[10px] px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
              >
                🚌 Shuttle Timings
              </button>
            </div>
          </div>

          {/* Urgent Notices Widget */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Latest Circulars
              </h4>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View all ({announcements.length})
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((anc) => (
                <div
                  key={anc.id}
                  onClick={() => onSelectNotice(anc.id)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {anc.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{anc.date}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-2">
                    {anc.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                    {anc.publisherRole}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Campus Services Status */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900">Live Campus Services</h4>

            {/* Library Seat occupancy */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Central Library</p>
                  <p className="text-[11px] text-slate-500">342 / 500 Seats Available</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Open (Low Crowd)
              </span>
            </div>

            {/* Shuttle status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Campus Shuttle Bus</p>
                  <p className="text-[11px] text-slate-500">Route 1: North Gate ⇄ Metro</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                In 6 mins
              </span>
            </div>

            {/* Cafeteria */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Student Plaza Cafeteria</p>
                  <p className="text-[11px] text-slate-500">Today: Paneer Bowl & Pasta</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                Lunch serving
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
