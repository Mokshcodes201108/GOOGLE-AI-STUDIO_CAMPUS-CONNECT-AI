import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  StudentProfile, 
  ClassSession, 
  MidSemExam, 
  FacultyMember, 
  NoticeItem, 
  BranchFilterState 
} from './types';
import { 
  CURRENT_STUDENT, 
  DEFAULT_BRANCH_FILTER, 
  VERIFIED_TIMETABLE_CLASSES, 
  VERIFIED_MIDSEM_EXAMS, 
  VERIFIED_FACULTY, 
  OFFICIAL_NOTICES 
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { NotificationDrawer, StudentNotification } from './components/NotificationDrawer';
import { BranchFilterModal } from './components/BranchFilterModal';
import { DashboardView } from './components/DashboardView';
import { TimetableView } from './components/TimetableView';
import { MidSemExamView } from './components/MidSemExamView';
import { AIAssistantView } from './components/AIAssistantView';
import { FacultyDirectoryView } from './components/FacultyDirectoryView';
import { NoticeBoardView } from './components/NoticeBoardView';
import { AdminPanelView } from './components/AdminPanelView';
import { LandingPageView } from './components/LandingPageView';

const INITIAL_GEC_NOTIFICATIONS: StudentNotification[] = [
  {
    id: 'gec_notif_1',
    title: 'Progressive Assessment Datesheet Out',
    message: 'Oct 2026 Mid-Sem exams start 27th Oct. Maths-I is 90 mins (11:00 AM–12:30 PM).',
    time: '2 hours ago',
    type: 'academic',
    read: false,
    actionTab: 'midsem',
  },
  {
    id: 'gec_notif_2',
    title: 'Room 3206 Timetable Active',
    message: 'Semester 1 Computer Engineering lectures allocated to Classroom 3206.',
    time: '4 hours ago',
    type: 'academic',
    read: false,
    actionTab: 'timetable',
  },
  {
    id: 'gec_notif_3',
    title: 'GTU 75% Attendance Compliance',
    message: 'Mandatory 75% attendance required across theory and lab sessions.',
    time: '1 day ago',
    type: 'alert',
    read: false,
    actionTab: 'dashboard',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [branchFilterOpen, setBranchFilterOpen] = useState(false);

  // Student Profile & Branch Filter State
  const [student, setStudent] = useState<StudentProfile>(CURRENT_STUDENT);
  const [branchFilter, setBranchFilter] = useState<BranchFilterState>(() => {
    try {
      const saved = localStorage.getItem('gecbh_branch_filter');
      return saved ? JSON.parse(saved) : DEFAULT_BRANCH_FILTER;
    } catch {
      return DEFAULT_BRANCH_FILTER;
    }
  });

  // State with LocalStorage Persistence
  const [classes, setClasses] = useState<ClassSession[]>(() => {
    try {
      const saved = localStorage.getItem('gecbh_classes');
      return saved ? JSON.parse(saved) : VERIFIED_TIMETABLE_CLASSES;
    } catch {
      return VERIFIED_TIMETABLE_CLASSES;
    }
  });

  const [exams, setExams] = useState<MidSemExam[]>(() => {
    try {
      const saved = localStorage.getItem('gecbh_midsem_exams');
      return saved ? JSON.parse(saved) : VERIFIED_MIDSEM_EXAMS;
    } catch {
      return VERIFIED_MIDSEM_EXAMS;
    }
  });

  const [faculty, setFaculty] = useState<FacultyMember[]>(() => {
    try {
      const saved = localStorage.getItem('gecbh_faculty');
      return saved ? JSON.parse(saved) : VERIFIED_FACULTY;
    } catch {
      return VERIFIED_FACULTY;
    }
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem('gecbh_notices');
      return saved ? JSON.parse(saved) : OFFICIAL_NOTICES;
    } catch {
      return OFFICIAL_NOTICES;
    }
  });

  const [notifications, setNotifications] = useState<StudentNotification[]>(INITIAL_GEC_NOTIFICATIONS);

  // Transient selections
  const [initialAIPrompt, setInitialAIPrompt] = useState<string>('');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('gecbh_classes', JSON.stringify(classes));
    } catch (e) {
      console.error(e);
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem('gecbh_midsem_exams', JSON.stringify(exams));
    } catch (e) {
      console.error(e);
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem('gecbh_notices', JSON.stringify(notices));
    } catch (e) {
      console.error(e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem('gecbh_branch_filter', JSON.stringify(branchFilter));
    } catch (e) {
      console.error(e);
    }
  }, [branchFilter]);

  // Global Cmd+K trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleAddClassSession = (session: ClassSession) => {
    setClasses((prev) => [...prev, session]);
  };

  const handleDeleteClassSession = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddExam = (exam: MidSemExam) => {
    setExams((prev) => [...prev, exam]);
  };

  const handleAddNotice = (notice: NoticeItem) => {
    setNotices((prev) => [notice, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: `Circular: ${notice.title}`,
        message: notice.content.slice(0, 75) + '...',
        time: 'Just now',
        type: 'academic',
        read: false,
        actionTab: 'notices',
      },
      ...prev,
    ]);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const handleToggleNoticeRead = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, read: !n.read } : n))
    );
  };

  const handleSaveBranchFilter = (newFilter: BranchFilterState) => {
    setBranchFilter(newFilter);
    setStudent((prev) => ({
      ...prev,
      department: newFilter.department,
      semester: newFilter.semester,
      division: newFilter.division,
      classroom: newFilter.classroom,
    }));
  };

  const handleAskAI = (prompt: string) => {
    setInitialAIPrompt(prompt);
    setActiveTab('assistant');
  };

  const handleSelectNotification = (item: StudentNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.actionTab) {
      setActiveTab(item.actionTab);
    }
    setNotificationsOpen(false);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const todayClasses = classes.filter((c) => c.day === 'Monday');
  const nextExam = exams[0] || VERIFIED_MIDSEM_EXAMS[0];

  // If user is on the Public Website Landing view
  if (activeTab === 'landing') {
    return (
      <LandingPageView
        onEnterPortal={(tab) => setActiveTab(tab || 'dashboard')}
        onAskAI={handleAskAI}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onOpenBranchFilter={() => setBranchFilterOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenBranchFilter={() => setBranchFilterOpen(true)}
          unreadCount={unreadNotificationCount}
          student={student}
          branchFilter={branchFilter}
        />

        {/* View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              student={student}
              todayClasses={todayClasses}
              nextExam={nextExam}
              notices={notices}
              branchFilter={branchFilter}
              setActiveTab={setActiveTab}
              onAskAI={handleAskAI}
              onOpenBranchFilter={() => setBranchFilterOpen(true)}
              onSelectNotice={(id) => {
                setSelectedNoticeId(id);
                setActiveTab('notices');
              }}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableView
              classes={classes}
              branchFilter={branchFilter}
              onOpenBranchFilter={() => setBranchFilterOpen(true)}
            />
          )}

          {activeTab === 'midsem' && (
            <MidSemExamView
              exams={exams}
              branchFilter={branchFilter}
              onOpenBranchFilter={() => setBranchFilterOpen(true)}
            />
          )}

          {activeTab === 'assistant' && (
            <AIAssistantView
              initialPrompt={initialAIPrompt}
              onClearInitialPrompt={() => setInitialAIPrompt('')}
            />
          )}

          {activeTab === 'faculty' && (
            <FacultyDirectoryView
              facultyList={faculty}
              onAskAIAboutFaculty={(name) => handleAskAI(`Tell me about ${name}, what subjects do they teach, and what is their cabin location?`)}
            />
          )}

          {activeTab === 'notices' && (
            <NoticeBoardView
              notices={notices}
              onToggleRead={handleToggleNoticeRead}
              selectedNoticeId={selectedNoticeId}
              onClearSelectedNotice={() => setSelectedNoticeId(null)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanelView
              classes={classes}
              exams={exams}
              notices={notices}
              onAddClassSession={handleAddClassSession}
              onAddExam={handleAddExam}
              onAddNotice={handleAddNotice}
              onDeleteClassSession={handleDeleteClassSession}
              onDeleteNotice={handleDeleteNotice}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        classes={classes}
        exams={exams}
        faculty={faculty}
        notices={notices}
        onSelectNotice={(id) => {
          setSelectedNoticeId(id);
          setActiveTab('notices');
        }}
      />

      {/* Global Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onSelectNotification={handleSelectNotification}
      />

      {/* Branch & Semester Selection Modal */}
      <BranchFilterModal
        isOpen={branchFilterOpen}
        onClose={() => setBranchFilterOpen(false)}
        filter={branchFilter}
        onSaveFilter={handleSaveBranchFilter}
      />
    </div>
  );
}
