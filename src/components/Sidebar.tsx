import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Calendar, 
  Bell, 
  MapPin, 
  AlertCircle, 
  Sparkles, 
  Compass, 
  ChevronRight,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { NavigationTab, StudentProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  student: StudentProfile;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  student,
  isOpen,
  setIsOpen,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'assistant' as NavigationTab,
      label: 'AI Campus Concierge',
      icon: Bot,
      badge: 'Gemini 3.8',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      id: 'timetable' as NavigationTab,
      label: 'Smart Timetable',
      icon: Calendar,
      badge: 'Today: 3',
    },
    {
      id: 'notices' as NavigationTab,
      label: 'Announcements',
      icon: Bell,
      badge: '2 New',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    },
    {
      id: 'campus' as NavigationTab,
      label: 'Campus Navigation',
      icon: MapPin,
      badge: 'Interactive',
    },
    {
      id: 'grievance' as NavigationTab,
      label: 'Grievance Portal',
      icon: AlertCircle,
      badge: '2 Active',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    {
      id: 'study-buddy' as NavigationTab,
      label: 'AI Study Buddy',
      icon: Sparkles,
      badge: 'Quiz & Flashcards',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
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
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">CampusConnect</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-100">AI</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Apex Institute (AIST)</p>
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Student Management
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 bg-slate-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Platform & Tour
          </div>

          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
              activeTab === 'landing'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Compass className="w-4 h-4" />
              </div>
              <span>Product Pitch / Landing</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/70 shadow-xs">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-10 h-10 rounded-full object-cover border border-indigo-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-slate-900 truncate">{student.name}</p>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500 truncate">{student.rollNumber} • Sem {student.semester}</p>
            </div>
            <button
              onClick={() => handleNavClick('landing')}
              title="Return to Landing Page"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
