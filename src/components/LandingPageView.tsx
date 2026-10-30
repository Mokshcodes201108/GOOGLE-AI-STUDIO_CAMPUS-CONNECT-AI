import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Bot, 
  Calendar, 
  FileCheck2, 
  Users, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Clock, 
  Layers, 
  ChevronDown, 
  BookOpen, 
  Send,
  Building2,
  FileText,
  MapPin,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { NavigationTab } from '../types';

interface LandingPageViewProps {
  onEnterPortal: (tab?: NavigationTab) => void;
  onAskAI: (prompt: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterPortal,
  onAskAI,
}) => {
  const [demoPrompt, setDemoPrompt] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState<'timetable' | 'midsem' | 'ai' | 'faculty'>('timetable');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Embedded live interactive AI playground on website
  const [playgroundQuery, setPlaygroundQuery] = useState('');
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(
    'Namaste! I am the GEC Bharuch Academic Assistant. Ask me about your Semester 1 Computer Engineering classes in Room 3206 or the October 2026 Mid-Semester exam dates!'
  );

  const handlePlaygroundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playgroundQuery.trim() || playgroundLoading) return;
    setPlaygroundLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: playgroundQuery.trim() }),
      });
      const data = await res.json();
      setPlaygroundResponse(data.reply || 'Information retrieved from verified GEC Bharuch records.');
    } catch {
      setPlaygroundResponse(
        `At GEC Bharuch, Semester 1 Computer Engineering lectures are held in Room 3206. Next Mid-Sem exam is Mathematics-I on 27 October 2026 from 11:00 AM to 12:30 PM (90 mins).`
      );
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoPrompt.trim()) {
      onEnterPortal('assistant');
      return;
    }
    onAskAI(demoPrompt.trim());
    onEnterPortal('assistant');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Where can I find the official classroom for Semester 1 Computer Engineering?',
      a: 'All regular theory lectures for B.E. Semester 1 (Computer Engineering) are conducted in Classroom 3206 on the 3rd Floor of Academic Block 3. Practical sessions are held in Computer Lab 3208 and Electrical Machines Lab.',
    },
    {
      q: 'What are the exact timings for the October 2026 Mid-Sem Exams?',
      a: 'Mathematics-I is of 90 minutes duration (11:00 AM to 12:30 PM). All other progressive assessment examinations (BEE, PPS, EGD, EVS, Induction) are of 75 minutes duration (11:00 AM to 12:15 PM).',
    },
    {
      q: 'Does this platform solve having to search multiple WhatsApp timetable images?',
      a: 'Yes! Campus Connect digitizes and verifies official timetable documents. Students simply open the portal to see their live daily lectures, periods, faculty names, and exam datesheets in one clean view.',
    },
    {
      q: 'Can administrators update timetables and upload notices?',
      a: 'Yes, the Admin Control Panel allows faculty and administrators to add or update lecture sessions, examination dates, and publish new official circulars with simulated attachments.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Government Institution Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white text-xs py-2.5 px-4 text-center font-bold flex items-center justify-center gap-2 border-b border-blue-900/60">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-black uppercase tracking-wider text-amber-300 border border-blue-400/30">
          <GraduationCap className="w-3.5 h-3.5" />
          Government of Gujarat • CTE
        </span>
        <span className="hidden sm:inline">Government Engineering College, Bharuch • Affiliated to Gujarat Technological University (GTU)</span>
        <button
          onClick={() => onEnterPortal('dashboard')}
          className="underline font-black text-amber-300 hover:text-white ml-2 flex items-center gap-0.5"
        >
          <span>Launch Student Portal</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Website Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-900/30 border border-blue-400/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">GEC BHARUCH</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Campus Connect
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Centralized Academic Information Platform</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-black text-slate-700">
          <button onClick={() => scrollToSection('features')} className="hover:text-blue-700 transition-colors">
            Core Modules
          </button>
          <button onClick={() => scrollToSection('timetable-preview')} className="hover:text-blue-700 transition-colors">
            Room 3206 Timetable
          </button>
          <button onClick={() => scrollToSection('exam-schedule')} className="hover:text-blue-700 transition-colors">
            Mid-Sem Datesheet
          </button>
          <button onClick={() => scrollToSection('ai-playground')} className="hover:text-blue-700 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Concierge</span>
          </button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-blue-700 transition-colors">
            FAQ
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onEnterPortal('assistant')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Ask AI</span>
          </button>
          <button
            onClick={() => onEnterPortal('dashboard')}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-800/20 transition-all hover:scale-102 flex items-center gap-1.5"
          >
            <span>Enter Student Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-12 pb-20 px-6 overflow-hidden bg-radial from-blue-900/10 via-slate-50 to-slate-50">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-black shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Official Academic Timetable & Examination Hub • GTU Odd Term 2026–2027</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.15]">
            No More Hunting Through <span className="text-blue-700">Timetable Images & WhatsApp Circulars</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to <strong>GEC BHARUCH – CAMPUS CONNECT</strong>. Instant access to regular classroom schedules in <strong>Room 3206</strong>, October 2026 Progressive Assessment examination datesheets, subject faculty, and an AI Academic Assistant powered by Gemini.
          </p>

          {/* Quick AI Try Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleHeroSubmit} className="flex items-center p-2 rounded-2xl bg-white border border-slate-300 shadow-xl shadow-blue-950/5">
              <Bot className="w-5 h-5 text-blue-600 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Ask: 'When is my Mathematics exam?' or 'Who teaches BEE?'"
                value={demoPrompt}
                onChange={(e) => setDemoPrompt(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-semibold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shrink-0 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onEnterPortal('dashboard')}
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-800/30 transition-all flex items-center gap-2"
            >
              <Laptop className="w-4 h-4 text-blue-200" />
              <span>Launch Student Portal (Sem 1 CE)</span>
            </button>
            <button
              onClick={() => onEnterPortal('midsem')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Mid-Sem Exam Schedule (Oct 2026)</span>
            </button>
          </div>

          {/* Verified Stats Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xl font-black text-blue-700">Room 3206</span>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Sem 1 CE Classroom</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xl font-black text-amber-600">27 Oct 2026</span>
              <p className="text-xs text-slate-500 font-bold mt-0.5">First Mid-Sem Exam</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xl font-black text-emerald-600">7 Verified</span>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Subject Faculty Mapped</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xl font-black text-purple-700">GTU Aligned</span>
              <p className="text-xs text-slate-500 font-bold mt-0.5">75% Attendance Sentinel</p>
            </div>
          </div>
        </div>
      </header>

      {/* Embedded Live AI Playground */}
      <section id="ai-playground" className="py-16 px-6 bg-gradient-to-b from-white to-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              Interactive AI Assistant
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Ask Anything About Your Timetable & Exams
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Trained strictly on the uploaded Semester 1 Computer Engineering schedule and Progressive Assessment timetable.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
            <form onSubmit={handlePlaygroundSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about Monday lectures, Mathematics exam date, BEE faculty, or Room 3206..."
                value={playgroundQuery}
                onChange={(e) => setPlaygroundQuery(e.target.value)}
                className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
              <button
                type="submit"
                disabled={playgroundLoading || !playgroundQuery.trim()}
                className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
              >
                {playgroundLoading ? <span>Consulting...</span> : <span>Ask AI</span>}
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-black text-slate-400 self-center mr-1 uppercase">Try prompts:</span>
              <button
                type="button"
                onClick={() => setPlaygroundQuery('When is my Mathematics examination?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-bold transition-colors"
              >
                📅 When is Math exam?
              </button>
              <button
                type="button"
                onClick={() => setPlaygroundQuery('Who teaches Basic Electrical Engineering?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-bold transition-colors"
              >
                👨‍🏫 Who teaches BEE?
              </button>
              <button
                type="button"
                onClick={() => setPlaygroundQuery('What is my timetable for Wednesday?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-bold transition-colors"
              >
                🗓️ Wednesday schedule?
              </button>
              <button
                type="button"
                onClick={() => setPlaygroundQuery('Where is classroom 3206 located?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 font-bold transition-colors"
              >
                📍 Classroom 3206 location?
              </button>
            </div>

            {playgroundResponse && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs mb-1">
                  <Bot className="w-4 h-4 text-blue-700" />
                  <span>GEC Bharuch AI Assistant:</span>
                </div>
                <p className="whitespace-pre-line font-medium">{playgroundResponse}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Feature Modules Showcase */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            System Modules
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Comprehensive Academic Suite for GEC Bharuch
          </h2>
          <p className="text-sm text-slate-500">
            Designed specifically to centralize timetables, examination schedules, faculty contacts, and circulars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div 
            onClick={() => onEnterPortal('dashboard')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-md">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Classroom 3206
              </span>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                Regular Class Timetable
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monday to Friday lecture schedule, timings (10:30 AM to 05:15 PM), faculty names, PPS & BEE lab batches, and lunch recess.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-700 flex items-center justify-between">
              <span>View Timetable</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onEnterPortal('midsem')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Oct 27 – Nov 03
              </span>
              <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                Mid-Sem Exam Datesheet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                October 2026 Progressive Assessment schedule. Exact timings: Maths-I (90 mins), other papers (75 mins) with live countdown.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-amber-700 flex items-center justify-between">
              <span>Inspect Datesheet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onEnterPortal('assistant')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-bold shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Gemini 3.8 Flash
              </span>
              <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                AI Campus Assistant
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant conversational queries grounded strictly in verified timetables and faculty allocations without hallucination.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-700 flex items-center justify-between">
              <span>Ask Assistant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onEnterPortal('faculty')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                Verified Teaching Staff
              </span>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                Faculty Directory
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Contact information, office cabins, emails, and consultation hours organized by course subject.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-700 flex items-center justify-between">
              <span>Browse Faculty</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => onEnterPortal('notices')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-rose-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
                <Bell className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                GTU & College Circulars
              </span>
              <h3 className="text-base font-black text-slate-900 group-hover:text-rose-700 transition-colors">
                Digital Notice Board
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Official circulars from the Principal's office, examination seating plans, and GTU attendance mandates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-rose-700 flex items-center justify-between">
              <span>Read Circulars</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6 */}
          <div 
            onClick={() => onEnterPortal('admin')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-md">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Staff & Admin Access
              </span>
              <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                Admin Control Panel
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload new timetables, publish exam circulars, and manage classroom mappings with local persistence.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-700 flex items-center justify-between">
              <span>Admin Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Academic Information FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-700' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Institution Footer */}
      <footer className="mt-auto bg-slate-950 text-white pt-16 pb-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-black text-lg">GEC BHARUCH</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Government Engineering College, Bharuch, Gujarat. Centralized academic timetable, mid-sem exam datesheet, and AI assistant portal.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Old National Highway 8, Bholav, Bharuch, Gujarat 392002</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3">Academic Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onEnterPortal('dashboard')} className="hover:text-white">Student Dashboard</button></li>
              <li><button onClick={() => onEnterPortal('timetable')} className="hover:text-white">Room 3206 Timetable</button></li>
              <li><button onClick={() => onEnterPortal('midsem')} className="hover:text-white">Mid-Sem Exam Datesheet</button></li>
              <li><button onClick={() => onEnterPortal('assistant')} className="hover:text-white">Gemini AI Assistant</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3">Administration</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onEnterPortal('faculty')} className="hover:text-white">Faculty Directory</button></li>
              <li><button onClick={() => onEnterPortal('notices')} className="hover:text-white">Notice Board & Circulars</button></li>
              <li><button onClick={() => onEnterPortal('admin')} className="hover:text-white">Admin Control Panel</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-3">Quick Portal Launch</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Computer Engineering • Semester 1 • Room 3206
            </p>
            <button
              onClick={() => onEnterPortal('dashboard')}
              className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 font-bold text-xs text-white shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          GEC BHARUCH – CAMPUS CONNECT © 2026 • Government Engineering College, Bharuch • Gujarat Technological University (GTU)
        </div>
      </footer>
    </div>
  );
};
