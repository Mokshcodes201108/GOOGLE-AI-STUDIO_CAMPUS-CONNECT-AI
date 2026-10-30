import React, { useState } from 'react';
import { ClassSession, BranchFilterState } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Filter, 
  Download, 
  Grid3X3, 
  List, 
  Check, 
  CheckCircle2, 
  MapPin, 
  Layers,
  Printer
} from 'lucide-react';

interface TimetableViewProps {
  classes: ClassSession[];
  branchFilter: BranchFilterState;
  onOpenBranchFilter: () => void;
}

const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

export const TimetableView: React.FC<TimetableViewProps> = ({
  classes,
  branchFilter,
  onOpenBranchFilter,
}) => {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredDayClasses = classes.filter((c) => {
    const matchesDay = c.day === selectedDay;
    const matchesType = typeFilter === 'All' 
      ? true 
      : typeFilter === 'Lectures' 
      ? c.type === 'Lecture'
      : typeFilter === 'Labs' 
      ? c.type === 'Lab'
      : typeFilter === 'Breaks' 
      ? c.type === 'Break'
      : true;
    return matchesDay && matchesType;
  });

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GEC Bharuch//Campus Connect Regular Timetable//EN',
      'CALSCALE:GREGORIAN',
      ...classes.filter(c => c.type !== 'Break').map(c => [
        'BEGIN:VEVENT',
        `SUMMARY:${c.subjectCode} - ${c.subjectName}`,
        `DESCRIPTION:Faculty: ${c.facultyName} | Classroom: ${c.classroom}`,
        `LOCATION:GEC Bharuch, ${c.classroom}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      ].join('\r\n')),
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'GEC_Bharuch_Sem1_CE_Timetable.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner and Controls */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Regular Class Timetable — {branchFilter.department} (Sem {branchFilter.semester})
                </h2>
                <p className="text-xs text-slate-500">
                  Classroom: <strong className="text-slate-900 font-extrabold">{branchFilter.classroom}</strong> • Academic Term 2026–2027
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Day / Week View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'day' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Day View</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'week' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>Weekly Grid</span>
              </button>
            </div>

            {/* Print View */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            {/* Export iCal */}
            <button
              onClick={handleDownloadICS}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors shadow-2xs"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">Calendar Synced (.ICS)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Sync to Calendar (.ICS)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Verified Data Badge */}
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-950 font-bold">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Official Verified Timetable: B.E. Semester 1 (Computer Engineering) — Classroom 3206</span>
          </div>
          <button
            onClick={onOpenBranchFilter}
            className="text-[11px] font-extrabold text-blue-700 hover:underline flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Switch Branch / Semester</span>
          </button>
        </div>
      </div>

      {/* Filter and Day Selector (for Day View) */}
      {viewMode === 'day' ? (
        <div className="space-y-4">
          {/* Day Pills (Monday to Friday) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DAYS.map((day) => {
              const dayClassesCount = classes.filter((c) => c.day === day && c.type !== 'Break').length;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-800/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isSelected ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {dayClassesCount} Lectures
                  </span>
                </button>
              );
            })}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {['All', 'Lectures', 'Labs', 'Breaks'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                  typeFilter === t
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Day Schedule List */}
          <div className="space-y-3">
            {filteredDayClasses.map((item, idx) => {
              const isBreak = item.type === 'Break';
              if (isBreak) {
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-100/90 border border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-600"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <strong className="text-slate-800 font-extrabold">{item.subjectName}</strong>
                        <span className="ml-2 text-slate-500 font-medium">({item.startTime} - {item.endTime})</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.classroom}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Lecture Number Badge */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 text-white flex flex-col items-center justify-center font-black shrink-0 shadow-md">
                        <span className="text-[10px] uppercase font-bold opacity-80">Period</span>
                        <span className="text-base leading-none">{item.lectureNumber}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            Code: {item.subjectCode}
                          </span>
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {item.type}
                          </span>
                          {item.batch && item.batch !== 'All' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                              {item.batch}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {item.subjectName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Faculty: <strong className="text-slate-900">{item.facultyName}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-blue-700">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.startTime} - {item.endTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {item.classroom}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">Academic Block 3</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Full Weekly Matrix View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800">Weekly Schedule Matrix (Classroom 3206)</span>
            <span className="text-slate-500 font-semibold">Semester 1 Computer Engineering</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px] grid grid-cols-5 divide-x divide-slate-200">
              {DAYS.map((day) => {
                const daySessions = classes.filter((c) => c.day === day);
                return (
                  <div key={day} className="flex flex-col">
                    <div className="p-3 bg-blue-950 text-white text-center">
                      <p className="text-xs font-black tracking-wider uppercase">{day}</p>
                      <span className="text-[10px] text-blue-200 font-semibold">
                        {daySessions.filter(s => s.type !== 'Break').length} Lectures
                      </span>
                    </div>

                    <div className="p-2 space-y-2 min-h-[520px] bg-slate-50/50">
                      {daySessions.map((session) => {
                        const isBreak = session.type === 'Break';
                        if (isBreak) {
                          return (
                            <div
                              key={session.id}
                              className="p-1.5 rounded-lg bg-slate-200/80 text-center text-[10px] font-bold text-slate-600"
                            >
                              {session.startTime} - {session.endTime}: {session.subjectName}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={session.id}
                            className="p-2.5 rounded-xl border border-blue-200 bg-white text-xs shadow-2xs hover:shadow-xs transition-shadow space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] font-black text-blue-800">
                              <span>P{session.lectureNumber} ({session.startTime})</span>
                              <span className="text-slate-500">{session.type}</span>
                            </div>
                            <h5 className="font-extrabold text-slate-900 text-xs leading-snug line-clamp-2">
                              {session.subjectName}
                            </h5>
                            <p className="text-[10px] text-slate-600 line-clamp-1">
                              {session.facultyName}
                            </p>
                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
                              <span className="font-bold text-indigo-700">{session.classroom}</span>
                              {session.batch && <span>{session.batch}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
