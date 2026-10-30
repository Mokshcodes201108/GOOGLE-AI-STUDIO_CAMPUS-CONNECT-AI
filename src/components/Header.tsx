import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sparkles, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';
import { NavigationTab, StudentProfile, BranchFilterState } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenBranchFilter: () => void;
  unreadCount: number;
  student: StudentProfile;
  branchFilter: BranchFilterState;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSidebar,
  onOpenSearch,
  onOpenNotifications,
  onOpenBranchFilter,
  unreadCount,
  student,
  branchFilter,
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
        return { 
          title: 'Student Academic Dashboard', 
          subtitle: `Government Engineering College, Bharuch • Welcome, ${student.name.split(' ')[0]}` 
        };
      case 'timetable':
        return { 
          title: 'Regular Class Timetable', 
          subtitle: `Classroom ${branchFilter.classroom} • ${branchFilter.department} (Semester ${branchFilter.semester})` 
        };
      case 'midsem':
        return { 
          title: 'Mid-Sem Progressive Assessment Schedule', 
          subtitle: 'October / November 2026 Examination Timetable • GTU Regulations' 
        };
      case 'assistant':
        return { 
          title: 'AI Campus Concierge', 
          subtitle: 'Grounded strictly in verified GEC Bharuch timetables & faculty data (Gemini 3.8 Flash)' 
        };
      case 'faculty':
        return { 
          title: 'Faculty Directory', 
          subtitle: 'Semester 1 Computer Engineering teaching faculty, cabins, and consultation slots' 
        };
      case 'notices':
        return { 
          title: 'Academic Notice Board', 
          subtitle: 'Official circulars from Principal, GTU Controller of Examinations, and SSIP' 
        };
      case 'admin':
        return { 
          title: 'Admin Timetable & Schedule Management', 
          subtitle: 'Upload, modify, and publish regular class schedules and examination datesheets' 
        };
      case 'landing':
        return { 
          title: 'GEC Bharuch – Campus Connect', 
          subtitle: 'Centralized academic portal for Government Engineering College, Bharuch' 
        };
      default:
        return { 
          title: 'GEC BHARUCH – CAMPUS CONNECT', 
          subtitle: 'Centralized Academic Information Platform' 
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Breadcrumb Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {title}
            </h1>
            <button
              onClick={onOpenBranchFilter}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors shrink-0"
              title="Click to change branch or semester"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              <span>{branchFilter.department === 'Computer Engineering' ? 'CE' : branchFilter.department} • Sem {branchFilter.semester} • {branchFilter.classroom}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate hidden md:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Branch / Sem Selector Button on mobile */}
        <button
          onClick={onOpenBranchFilter}
          className="sm:hidden p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
          title="Change branch or semester"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors text-xs font-medium border border-slate-200/60"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline">Search timetable / exams...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white rounded border border-slate-300 text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200/60">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{timeStr || '10:30 AM'}</span>
        </div>

        {/* AI Quick Button */}
        {activeTab !== 'assistant' && (
          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-102 group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        )}

        {/* Return to Website Button */}
        <button
          onClick={() => setActiveTab('landing')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          title="Return to GEC Bharuch Public Website"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Website</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
          aria-label="View notices & circulars"
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
