import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileCheck2, 
  Bot, 
  Users, 
  Bell, 
  ShieldAlert, 
  Globe, 
  ChevronRight,
  LogOut,
  GraduationCap,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { NavigationTab, StudentProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  student: StudentProfile;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenBranchFilter: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  student,
  isOpen,
  setIsOpen,
  onOpenBranchFilter,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: 'Sem 1',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'timetable' as NavigationTab,
      label: 'Regular Timetable',
      icon: Calendar,
      badge: 'Room 3206',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'midsem' as NavigationTab,
      label: 'Mid-Sem Exam Schedule',
      icon: FileCheck2,
      badge: 'Oct 2026',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'assistant' as NavigationTab,
      label: 'AI Campus Assistant',
      icon: Bot,
      badge: 'Gemini 3.8',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      id: 'faculty' as NavigationTab,
      label: 'Faculty Directory',
      icon: Users,
      badge: '7 Verified',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'notices' as NavigationTab,
      label: 'Notice Board',
      icon: Bell,
      badge: '2 New',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'admin' as NavigationTab,
      label: 'Admin Control Panel',
      icon: ShieldAlert,
      badge: 'Upload & Edit',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 text-white border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-24 px-5 flex items-center justify-between border-b border-slate-800/90 bg-slate-900/40">
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 text-left group w-full"
          >
            {/* GEC Bharuch Crest Emblem */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform shrink-0 border border-blue-400/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white tracking-tight text-sm sm:text-base truncate">GEC BHARUCH</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Campus Connect</p>
              <p className="text-[9px] text-slate-400 truncate">Govt. Engg. College, Bharuch (GTU)</p>
            </div>
          </button>
        </div>

        {/* Branch & Classroom Quick Status Card */}
        <div className="px-4 py-3.5 bg-slate-900/80 border-b border-slate-800/70">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{student.department}</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5">
                Sem {student.semester} • <strong className="text-amber-300">{student.classroom}</strong>
              </p>
            </div>
            <button
              onClick={onOpenBranchFilter}
              className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
            >
              Change
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Academic Portals
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'text-slate-400 bg-slate-900'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border shrink-0 ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Public Website
          </div>

          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 ${
              activeTab === 'landing'
                ? 'bg-blue-900/60 text-white border border-blue-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-900 text-blue-400">
                <Globe className="w-4 h-4" />
              </div>
              <span>GEC Bharuch Website</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-9 h-9 rounded-full object-cover border border-blue-500/50"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate">{student.name}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{student.enrollmentNumber}</p>
            </div>
            <button
              onClick={() => handleNavClick('landing')}
              title="Return to Website"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
