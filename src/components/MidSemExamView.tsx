import React, { useState, useEffect } from 'react';
import { MidSemExam, BranchFilterState } from '../types';
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  Timer, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Printer, 
  Download, 
  Layers, 
  MapPin, 
  ShieldCheck,
  List,
  CalendarDays
} from 'lucide-react';

interface MidSemExamViewProps {
  exams: MidSemExam[];
  branchFilter: BranchFilterState;
  onOpenBranchFilter: () => void;
}

export const MidSemExamView: React.FC<MidSemExamViewProps> = ({
  exams,
  branchFilter,
  onOpenBranchFilter,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedExam, setSelectedExam] = useState<MidSemExam>(exams[0]);

  // Live countdown to next exam
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const examDate = new Date(`${exams[0].dateStr}T11:00:00`);
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
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [exams]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDatesheet = () => {
    const textData = `=================================================================\nGOVERNMENT ENGINEERING COLLEGE, BHARUCH (GTU)\nMID-SEMESTER PROGRESSIVE ASSESSMENT EXAMINATION SCHEDULE\nOctober / November 2026 • Branch: ${branchFilter.department} (Sem ${branchFilter.semester})\n=================================================================\n\n` +
      exams.map((e, idx) => 
        `Paper ${idx + 1}: ${e.dateDisplay} (${e.day})\nSubject: ${e.subjectCode} - ${e.subjectName}\nTiming: ${e.startTime} to ${e.endTime} (${e.durationMins} Minutes)\nLocation: ${e.blockLocation}\nSyllabus:\n` +
        e.syllabusOverview.map(s => `  - ${s}`).join('\n') +
        `\n-----------------------------------------------------------------\n`
      ).join('\n') +
      `\nEXAMINATION RULES:\n1. Students must report 15 minutes before 11:00 AM.\n2. Seating arrangement will be posted in Classroom 3206.\n3. Mobile phones are strictly prohibited in the exam hall.\n4. Non-programmable calculators are allowed for Mathematics-I and BEE.`;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'GEC_Bharuch_MidSem_Datesheet_Oct2026.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-blue-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-100">
              <FileCheck2 className="w-4 h-4" />
              <span>GTU Progressive Assessment (Mid-Sem) 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              October 2026 Examination Schedule
            </h2>
            <p className="text-xs sm:text-sm text-amber-100">
              Government Engineering College, Bharuch • Branch: <strong className="text-white">{branchFilter.department} (Sem {branchFilter.semester})</strong>
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/20 flex flex-col items-center shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1 mb-1">
              <Timer className="w-3.5 h-3.5" />
              Countdown to First Exam (Maths-I)
            </span>
            <div className="flex items-center gap-2 text-center">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.days}</span>
                <span className="text-[9px] uppercase font-bold text-amber-200 block">Days</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase font-bold text-amber-200 block">Hours</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase font-bold text-amber-200 block">Mins</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase font-bold text-amber-200 block">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-white hover:text-amber-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-white hover:text-amber-200'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Calendar View</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Schedule</span>
            </button>
            <button
              onClick={handleDownloadDatesheet}
              className="px-4 py-1.5 rounded-xl bg-white text-slate-950 text-xs font-black hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Datesheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Timing Clarification Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs leading-relaxed text-amber-950">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-black text-amber-900 block">EXAMINATION TIMINGS & DURATION NOTICE:</strong>
          <span>
            • <strong>Mathematics-I:</strong> 11:00 AM to 12:30 PM (90 Minutes duration).<br />
            • <strong>All other subjects:</strong> 11:00 AM to 12:15 PM (75 Minutes duration).<br />
            Seating will be arranged in <strong>Classroom 3206 and adjoining halls</strong> on the 3rd Floor of Academic Block 3.
          </span>
        </div>
      </div>

      {/* View Mode: List View vs Calendar View */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List of 6 Examination Papers (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              {exams.map((item, idx) => {
                const isSelected = selectedExam.id === item.id;
                const isMaths = item.durationMins === 90;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedExam(item)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-300 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        {/* Date Circle */}
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black shrink-0 shadow-md ${
                          isMaths ? 'bg-gradient-to-br from-blue-700 to-indigo-800' : 'bg-gradient-to-br from-slate-800 to-slate-900'
                        }`}>
                          <span className="text-[10px] uppercase opacity-90">{item.day.slice(0, 3)}</span>
                          <span className="text-base leading-none">{item.dateDisplay.split(' ')[0]}</span>
                          <span className="text-[9px] opacity-80">{item.dateDisplay.split(' ')[1].slice(0, 3)}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                              {item.subjectCode}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                              isMaths ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.durationMins} Minutes
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              Paper {idx + 1}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-slate-900">
                            {item.subjectName}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-slate-600 font-bold pt-0.5">
                            <span className="flex items-center gap-1 text-blue-700">
                              <Clock className="w-3.5 h-3.5" />
                              {item.startTime} – {item.endTime}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {item.blockLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-800 hover:underline">
                          Inspect syllabus &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Exam Syllabus & Seating Deep-Dive (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-blue-700">{selectedExam.subjectCode}</span>
                    <span className="font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                      {selectedExam.durationMins} Mins Duration
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 leading-snug">
                    {selectedExam.subjectName}
                  </h4>
                  <p className="text-xs font-bold text-slate-600 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedExam.dateDisplay} ({selectedExam.day}) • {selectedExam.startTime} to {selectedExam.endTime}</span>
                  </p>
                </div>

                {/* Syllabus coverage */}
                <div className="space-y-2">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    Progressive Assessment Syllabus Coverage
                  </h5>
                  <ul className="space-y-2">
                    {selectedExam.syllabusOverview.map((item, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Seating & Rules Box */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                  <span className="font-extrabold text-blue-950 block">Seating Block & Venue Guidelines:</span>
                  <div className="text-slate-700 space-y-1 text-[11px] leading-relaxed">
                    <p>• Allocated Hall: <strong>{selectedExam.blockLocation}</strong></p>
                    <p>• Candidate reporting time: <strong>10:45 AM</strong> (15 mins prior)</p>
                    <p>• GTU Enrollment ID Card is mandatory.</p>
                    {selectedExam.subjectCode === '3110014' && (
                      <p className="text-blue-900 font-bold">• FX-991ES / Non-programmable scientific calculator permitted.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Calendar Grid View */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-black text-slate-900">
              October – November 2026 Examination Calendar
            </h4>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              6 Exam Days Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {ex.dateDisplay}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">{ex.day}</span>
                </div>
                <h5 className="text-sm font-extrabold text-slate-900 line-clamp-1">{ex.subjectName}</h5>
                <p className="text-xs font-mono text-slate-600">{ex.subjectCode}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>{ex.startTime} - {ex.endTime}</span>
                  <span className="text-slate-500 text-[10px]">{ex.blockLocation.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
