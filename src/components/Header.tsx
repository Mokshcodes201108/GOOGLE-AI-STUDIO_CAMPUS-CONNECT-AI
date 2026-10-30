import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sparkles, 
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';
import { NavigationTab, StudentProfile } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  student: StudentProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidebar,
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  student,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Student Dashboard', subtitle: `Welcome back, ${student.name.split(' ')[0]}! Here is your daily overview.` };
      case 'assistant':
        return { title: 'AI Campus Concierge', subtitle: 'Real-time intelligent answers powered by Gemini 3.8 Flash' };
      case 'timetable':
        return { title: 'Smart Timetable', subtitle: 'Weekly lecture timetable, labs, and classroom allocations' };
      case 'notices':
        return { title: 'Announcements & Circulars', subtitle: 'Official college notices, examinations datesheets, and event alerts' };
      case 'campus':
        return { title: 'Interactive Campus Navigation', subtitle: 'Explore university facilities, departments, labs, and walking routes' };
      case 'grievance':
        return { title: 'Student Grievance & Complaints', subtitle: 'Submit campus issues, track resolution timelines, and report concerns' };
      case 'study-buddy':
        return { title: 'AI Study Buddy', subtitle: 'Smart lecture notes summarizer, interactive quizzes, and concept coach' };
      case 'landing':
        return { title: 'CampusConnect AI Platform', subtitle: 'Product overview and hackathon demonstration' };
      default:
        return { title: 'CampusConnect AI', subtitle: 'Apex Institute of Science & Technology' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Breadcrumb Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Calendar className="w-3 h-3" />
              Fall 2026 • Sem 5
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate hidden md:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors text-xs font-medium border border-slate-200/60"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline">Search campus...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white rounded border border-slate-300 text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200/60">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>{timeStr || '09:41 AM'}</span>
        </div>

        {/* AI Quick Button */}
        {activeTab !== 'assistant' && (
          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-xs hover:shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        )}

        {/* Website Return Button */}
        <button
          onClick={() => setActiveTab('landing')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          title="Return to University Website"
        >
          <span>Website</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
