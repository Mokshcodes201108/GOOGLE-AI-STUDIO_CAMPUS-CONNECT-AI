import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Bot, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Award, 
  Clock, 
  Users, 
  Compass,
  Star,
  Zap,
  BarChart3,
  Search,
  Building,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Laptop,
  HelpCircle,
  Phone,
  Mail,
  Send,
  MessageSquare
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
  const [activePreviewTab, setActivePreviewTab] = useState<'attendance' | 'timetable' | 'map' | 'grievance' | 'ai'>('ai');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Embedded live interactive AI playground on website
  const [playgroundQuery, setPlaygroundQuery] = useState('');
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(
    'Hello! I am the CampusConnect AI Assistant for Apex Institute of Science & Technology. Ask me about courses, attendance criteria, faculty, hostel rules, or lab facilities!'
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
      setPlaygroundResponse(data.reply || 'Information retrieved from university campus records.');
    } catch {
      setPlaygroundResponse(
        `At Apex Institute (AIST), Central Library operates 8am-10pm (24/7 during exams), mandatory attendance is 75%, and GPU Lab 402 is located in Block B Innovation Hub.`
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
      q: 'How does the 75% Attendance Sentinel calculate bunk margins?',
      a: 'The system uses an algorithm that cross-references university examination bylaws with biometric course records. It calculates the minimum required classes to reach 75% or the maximum safe absences allowed before falling below eligibility.',
    },
    {
      q: 'Is the AI Campus Concierge trained on university-specific data?',
      a: 'Yes! Powered by Gemini 3.8 Flash, CampusConnect AI has built-in knowledge of AIST departments, classroom locations, bus routes, library hours, examination datesheets, and student welfare policies.',
    },
    {
      q: 'How does the Grievance Redressal system maintain anonymity?',
      a: 'Students can toggle Anonymous Submission when filing maintenance or academic complaints. The ticket is assigned to facility engineers without exposing the student roll number, email, or identity, while still allowing two-way updates.',
    },
    {
      q: 'Can students export their timetable to Google Calendar or Apple iCal?',
      a: 'Yes, with one click in the Smart Timetable module, students can download a standard RFC-5545 .ICS file with all lecture times, room allocations, and instructor contacts to sync across their personal calendars.',
    },
    {
      q: 'How does the AI Study Buddy generate quizzes?',
      a: 'By calling Gemini with structured response schemas, it ingests lecture notes and outputs rigorous multiple-choice questions with difficulty tiers, distractor explanations, and real-time score tracking.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-amber-300">
          <Flame className="w-3 h-3 fill-amber-300" />
          Fall 2026 Academic Term
        </span>
        <span className="hidden sm:inline">Apex Institute of Science & Technology • NAAC Grade A++ Accredited</span>
        <button
          onClick={() => onEnterPortal('dashboard')}
          className="underline font-bold text-amber-300 hover:text-white ml-2 flex items-center gap-0.5"
        >
          <span>Launch Demo Student Portal</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Website Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">CampusConnect</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-100">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Apex Institute of Science & Technology</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
          <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 transition-colors">
            Core Modules
          </button>
          <button onClick={() => scrollToSection('ai-playground')} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>AI Concierge</span>
          </button>
          <button onClick={() => scrollToSection('preview-section')} className="hover:text-indigo-600 transition-colors">
            Interactive Tour
          </button>
          <button onClick={() => scrollToSection('academics')} className="hover:text-indigo-600 transition-colors">
            Academic Programs
          </button>
          <button onClick={() => scrollToSection('campus-life')} className="hover:text-indigo-600 transition-colors">
            Campus Life
          </button>
          <button onClick={() => scrollToSection('plans')} className="hover:text-indigo-600 transition-colors">
            Institutions
          </button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-indigo-600 transition-colors">
            FAQ
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onEnterPortal('assistant')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>Try AI Chat</span>
          </button>
          <button
            onClick={() => onEnterPortal('dashboard')}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-102 flex items-center gap-1.5"
          >
            <span>Enter Student Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-14 pb-20 px-6 overflow-hidden bg-radial from-indigo-900/10 via-slate-50 to-slate-50">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Autonomous College Management Platform • Powered by Gemini 3.8 Flash</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.1]">
            The Modern AI Operating System for <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">Connected Universities</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate fragmented ERPs, attendance anxiety, and campus confusion. CampusConnect AI gives students, faculty, and administrators one unified, intelligent platform.
          </p>

          {/* Instant AI Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleHeroSubmit} className="flex items-center p-2 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-950/5">
              <Bot className="w-5 h-5 text-indigo-600 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Ask Gemini: 'Where is GPU Lab 402?' or 'Library hours?'"
                value={demoPrompt}
                onChange={(e) => setDemoPrompt(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shrink-0 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onEnterPortal('dashboard')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Laptop className="w-4 h-4 text-indigo-400" />
              <span>Explore Student Portal (Demo)</span>
            </button>
            <button
              onClick={() => scrollToSection('preview-section')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-purple-600" />
              <span>See Live Feature Demos</span>
            </button>
          </div>

          {/* Live University Stats Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-2xl font-black text-indigo-600">14,200+</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Enrolled Students</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-2xl font-black text-purple-600">99.4%</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Grievance SLA Compliance</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-2xl font-black text-emerald-600">120 Acres</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Digitally Mapped Campus</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-2xl font-black text-amber-600">4.9 / 5</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </header>

      {/* Embedded Live AI Playground on Website */}
      <section id="ai-playground" className="py-16 px-6 bg-gradient-to-b from-white to-slate-50 border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Live AI Playground
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Test the Campus AI Assistant Live
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Type any university question below. Our server-side Gemini 3.8 Flash model will respond with accurate campus knowledge.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
            <form onSubmit={handlePlaygroundSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about library hours, minimum attendance, bus routes, or Dean Eleanor Vance..."
                value={playgroundQuery}
                onChange={(e) => setPlaygroundQuery(e.target.value)}
                className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={playgroundLoading || !playgroundQuery.trim()}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
              >
                {playgroundLoading ? (
                  <span>Thinking...</span>
                ) : (
                  <>
                    <span>Query AI</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 self-center mr-1">Quick prompts:</span>
              <button
                type="button"
                onClick={() => setPlaygroundQuery('Where is GPU Lab 402 located?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-medium transition-colors"
              >
                Where is GPU Lab 402?
              </button>
              <button
                type="button"
                onClick={() => setPlaygroundQuery('What is the mandatory attendance criteria for exams?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-medium transition-colors"
              >
                Attendance Policy
              </button>
              <button
                type="button"
                onClick={() => setPlaygroundQuery('When does the campus shuttle run to Metro?')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-medium transition-colors"
              >
                Shuttle Timings
              </button>
            </div>

            {playgroundResponse && (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                  <Bot className="w-4 h-4" />
                  <span>CampusConnect AI Response:</span>
                </div>
                <p className="whitespace-pre-line">{playgroundResponse}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Feature Demos Showcase */}
      <section id="preview-section" className="py-20 px-6 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Interactive System Preview
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            See the Core Engines in Action
          </h2>
          <p className="text-sm text-slate-500">
            Click through the interactive modules to see how CampusConnect AI empowers everyday university life.
          </p>
        </div>

        {/* Demo Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'ai' as const, label: 'AI Concierge', icon: Bot },
            { id: 'attendance' as const, label: '75% Attendance Sentinel', icon: BarChart3 },
            { id: 'timetable' as const, label: 'Smart Timetable', icon: Calendar },
            { id: 'map' as const, label: 'Campus 2D Map', icon: MapPin },
            { id: 'grievance' as const, label: 'Grievance SLA Portal', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activePreviewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePreviewTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isSel 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Display Window */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8">
          {activePreviewTab === 'ai' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Powered by Gemini 3.8 Flash
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Instant Answers to Any Campus Policy or Location
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Students never have to stand in line at the Dean's office or hunt through 40-page PDF handbooks. The conversational concierge understands lab equipment access, bus schedules, exam datesheets, and fee clearance.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Real-time grounding in university statutes & circulars
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Sub-second response latency with streaming support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Supports custom department and faculty directories
                  </li>
                </ul>
                <button
                  onClick={() => onEnterPortal('assistant')}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Launch AI Concierge in Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 font-sans shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="font-bold flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    CampusConnect Assistant Live Demo
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                    Online
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-800 p-3 rounded-xl max-w-[85%] text-slate-300">
                    "Where can I find GPU Lab 402 and what are the open hours?"
                  </div>
                  <div className="bg-indigo-950/80 border border-indigo-800/60 p-3.5 rounded-xl ml-auto max-w-[90%] text-indigo-100 space-y-1">
                    <strong className="text-white block font-bold">CampusConnect AI:</strong>
                    <p className="leading-relaxed">
                      GPU Lab 402 is located on the <strong>4th Floor of Block B (Innovation & AI Hub)</strong>. It is equipped with NVIDIA RTX A6000 clusters and is open <strong>24/7 with Student Smart Card access</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  75% Examination Safeguard
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Live Attendance Forecaster & Simulator
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never face sudden debarment notices. The forecaster lets students simulate "What if I miss 2 classes?" or "How many classes must I attend to recover from 73%?", calculating exact academic margins.
                </p>
                <button
                  onClick={() => onEnterPortal('dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Open Attendance Forecaster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">CS503: Compiler Design</span>
                  <span className="text-xs font-extrabold text-rose-600">73.1% (Critical Alert)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full w-[73%]" />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <strong className="text-indigo-900 block font-bold">Simulator Projection:</strong>
                  <p className="text-slate-600">Attending next <strong>2 classes</strong> raises attendance to <strong>77.8% (Exam Safe)</strong>.</p>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'timetable' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Conflict-Free Scheduling
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Dynamic Weekly Schedule & iCal Sync
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Switch between daily agenda and full week timetable. See room allocations, professors, and export directly to Google Calendar and Apple iCal with a single click.
                </p>
                <button
                  onClick={() => onEnterPortal('timetable')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
                >
                  <span>View Full Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">09:00 - 10:15 • Room 304</span>
                    <h5 className="text-xs font-extrabold text-slate-900">Deep Learning & Neural Networks</h5>
                    <p className="text-[11px] text-slate-500">Dr. Vikramaditya Rao • Block B</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">Lecture</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase">10:30 - 11:45 • Room 201</span>
                    <h5 className="text-xs font-extrabold text-slate-900">Distributed Systems & Cloud</h5>
                    <p className="text-[11px] text-slate-500">Prof. Ananya Sen • Block A</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Lecture</span>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  120-Acre Campus Digital Twin
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Turn-by-Turn Campus Navigation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Interactive 2D vector map covering academic blocks, digital knowledge library, research arenas, and residential hostels with walking routes and accessibility information.
                </p>
                <button
                  onClick={() => onEnterPortal('campus')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Launch Campus Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-3">
                <MapPin className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-sm">Interactive Route Pathfinding</h4>
                <p className="text-xs text-slate-400">
                  North Gate ➔ Block B Innovation Hub (3 mins • 240 meters • Wheelchair Accessible)
                </p>
              </div>
            </div>
          )}

          {activePreviewTab === 'grievance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                  Guaranteed 24-48h SLA
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Transparent Grievance Tracking & Anonymous Filing
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Report hostel maintenance, WiFi downtime, or academic issues. Track milestone updates from facility engineers with full student anonymity safeguards.
                </p>
                <button
                  onClick={() => onEnterPortal('grievance')}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Track Grievances</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-indigo-700">Ticket #GRV-2026-894</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">In Progress</span>
                </div>
                <p className="text-slate-800 font-bold">AC unit malfunctioning in Block B GPU Lab 402</p>
                <p className="text-slate-500 text-[11px]">Latest update: Replacement condenser unit dispatched. Installation scheduled Friday.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Academic Programs & Research */}
      <section id="academics" className="py-20 px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Academics & Research
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Apex Institute of Science & Technology
            </h2>
            <p className="text-sm text-slate-500">
              World-class curriculum grounded in modern research, industry internships, and hands-on lab projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-indigo-600 uppercase">Undergraduate</span>
              <h4 className="text-base font-extrabold text-slate-900">B.Tech in Artificial Intelligence & ML</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deep neural networks, computer vision, natural language processing, and high-performance computing on dedicated NVIDIA clusters.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-700 border-t border-slate-200/60">
                130 Credits • 8 Semesters
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-purple-600 uppercase">Undergraduate</span>
              <h4 className="text-base font-extrabold text-slate-900">B.Tech in Computer Science & Cloud</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Distributed consensus algorithms, microservices, Linux internals, compiler design, and database architecture.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-700 border-t border-slate-200/60">
                128 Credits • 8 Semesters
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-emerald-600 uppercase">Undergraduate</span>
              <h4 className="text-base font-extrabold text-slate-900">B.Tech in Cyber Physical Systems</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Autonomous robotics, embedded firmware, sensor fusion, IoT sandboxes, and hardware-level cybersecurity.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-700 border-t border-slate-200/60">
                132 Credits • 8 Semesters
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-amber-600 uppercase">Postgraduate</span>
              <h4 className="text-base font-extrabold text-slate-900">M.Tech / MBA Business Analytics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Econometric modeling, enterprise data warehousing, product analytics, and executive technology leadership.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-700 border-t border-slate-200/60">
                64 Credits • 4 Semesters
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Facilities & Life */}
      <section id="campus-life" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Life at Apex
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Infrastructure Built for 24/7 Innovation
          </h2>
          <p className="text-sm text-slate-500">
            From the quiet reading pods of the Central Knowledge Center to the Olympic swimming arena.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600"
              alt="Central Library"
              className="w-full h-44 object-cover"
            />
            <div className="p-5 space-y-2">
              <h4 className="font-extrabold text-base text-slate-900">Central Digital Library</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                120,000+ academic volumes, digital IEEE/ACM research terminals, and 24x7 reading halls during examination months.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600"
              alt="Innovation Hub"
              className="w-full h-44 object-cover"
            />
            <div className="p-5 space-y-2">
              <h4 className="font-extrabold text-base text-slate-900">Block B Innovation & GPU Hub</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                High-compute cluster with NVIDIA RTX A6000 servers, hardware makerspaces, 3D printing labs, and incubation sandbox.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600"
              alt="Olympus Sports Arena"
              className="w-full h-44 object-cover"
            />
            <div className="p-5 space-y-2">
              <h4 className="font-extrabold text-base text-slate-900">Olympus Sports Complex</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Indoor wooden badminton courts, Olympic-size heated pool, strength fitness gym, and 400m synthetic running track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institution Rollout Plans */}
      <section id="plans" className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
              For Universities & Colleges
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Deployment Plans for Academic Institutions
            </h2>
            <p className="text-sm text-slate-400">
              Transform your university campus into an autonomous smart ecosystem in less than 72 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-900">
            {/* Plan 1 */}
            <div className="p-6 rounded-2xl bg-white space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Department / College</span>
                <h4 className="text-xl font-black">Campus Starter</h4>
                <p className="text-xs text-slate-500">For smaller colleges and standalone academic departments up to 2,500 students.</p>
                <div className="text-2xl font-black text-slate-900">$1.20 <span className="text-xs font-normal text-slate-400">/ student / term</span></div>
                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Smart Timetable & Classes</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 75% Attendance Sentinel</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Basic AI Campus Assistant</li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPortal('dashboard')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Explore Demo
              </button>
            </div>

            {/* Plan 2: Highlighted */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-600 to-purple-700 text-white space-y-5 flex flex-col justify-between shadow-2xl scale-102 border-2 border-indigo-300">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">Most Adopted</span>
                <h4 className="text-xl font-black">University Pro</h4>
                <p className="text-xs text-indigo-100">Full institutional deployment for universities up to 15,000 students.</p>
                <div className="text-2xl font-black text-white">$2.50 <span className="text-xs font-normal text-indigo-200">/ student / term</span></div>
                <ul className="space-y-2 text-xs text-indigo-100 pt-2 border-t border-white/20">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> 120-Acre 2D Vector Map Navigation</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> SLA-Guaranteed Grievance Redressal</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white" /> AI Study Buddy (Summarizer & Quiz)</li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPortal('dashboard')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-extrabold text-xs transition-colors shadow-md"
              >
                Launch University Pro Demo
              </button>
            </div>

            {/* Plan 3 */}
            <div className="p-6 rounded-2xl bg-white space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Multi-Campus Network</span>
                <h4 className="text-xl font-black">Consortium Enterprise</h4>
                <p className="text-xs text-slate-500">For multi-campus state and private university systems with 15,000+ students.</p>
                <div className="text-2xl font-black text-slate-900">Custom <span className="text-xs font-normal text-slate-400">Tier SLA</span></div>
                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Cloud Infrastructure</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Custom ERP & SIS Database Sync</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 24/7 Priority Support & On-Prem Options</li>
                </ul>
              </div>
              <button
                onClick={() => onEnterPortal('dashboard')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Schedule Architecture Review
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
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
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
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

      {/* University Directory & Footer */}
      <footer className="mt-auto bg-slate-950 text-white pt-16 pb-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg">CampusConnect AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous College Management System engineered for Apex Institute of Science & Technology.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Apex Tech Boulevard, Innovation Corridor</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-indigo-400" /> Emergency Hotline: +1 (800) 412-AIST (Ext. 108)</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Student Portal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onEnterPortal('dashboard')} className="hover:text-white">Student Dashboard</button></li>
              <li><button onClick={() => onEnterPortal('assistant')} className="hover:text-white">AI Campus Concierge</button></li>
              <li><button onClick={() => onEnterPortal('timetable')} className="hover:text-white">Smart Timetable & iCal</button></li>
              <li><button onClick={() => onEnterPortal('campus')} className="hover:text-white">Interactive Campus Map</button></li>
              <li><button onClick={() => onEnterPortal('study-buddy')} className="hover:text-white">AI Study Buddy & Quizzes</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Administration</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onEnterPortal('grievance')} className="hover:text-white">Dean Student Welfare</button></li>
              <li><button onClick={() => onEnterPortal('notices')} className="hover:text-white">Examination Circulars</button></li>
              <li><button onClick={() => onEnterPortal('campus')} className="hover:text-white">Facility Management</button></li>
              <li><a href="#plans" className="hover:text-white">Institutional Rollout</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Hackathon Demo</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Full-stack implementation featuring server-side Gemini 3.8 Flash, live attendance forecasting, and persistent state.
            </p>
            <button
              onClick={() => onEnterPortal('dashboard')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Live Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          CampusConnect AI © 2026 • Apex Institute of Science & Technology • All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
