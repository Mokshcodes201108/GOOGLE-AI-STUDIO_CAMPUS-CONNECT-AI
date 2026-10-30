import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  StudentProfile, 
  SubjectAttendance, 
  ClassSession, 
  Announcement, 
  CampusLocation, 
  GrievanceTicket 
} from './types';
import { 
  CURRENT_STUDENT, 
  SUBJECT_ATTENDANCES, 
  TIMETABLE_CLASSES, 
  ANNOUNCEMENTS, 
  CAMPUS_LOCATIONS, 
  INITIAL_GRIEVANCES 
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { NotificationDrawer, StudentNotification } from './components/NotificationDrawer';
import { DashboardView } from './components/DashboardView';
import { AIAssistantView } from './components/AIAssistantView';
import { TimetableView } from './components/TimetableView';
import { NoticeBoardView } from './components/NoticeBoardView';
import { CampusNavView } from './components/CampusNavView';
import { GrievanceView } from './components/GrievanceView';
import { StudyBuddyView } from './components/StudyBuddyView';
import { LandingPageView } from './components/LandingPageView';

const INITIAL_NOTIFICATIONS: StudentNotification[] = [
  {
    id: 'notif_1',
    title: 'Mid-Term Datesheet Released',
    message: 'Fall 2026 Mid-Semester schedule is now live. Exams commence Nov 16th.',
    time: '2 hours ago',
    type: 'academic',
    read: false,
    actionTab: 'notices',
  },
  {
    id: 'notif_2',
    title: 'Attendance Alert: CS503',
    message: 'Your attendance in Compiler Design is currently 73.1% (below 75% threshold).',
    time: '5 hours ago',
    type: 'alert',
    read: false,
    actionTab: 'dashboard',
  },
  {
    id: 'notif_3',
    title: 'Grievance GRV-2026-894 Update',
    message: 'Estates team dispatched condenser unit for GPU Lab 402 AC.',
    time: '1 day ago',
    type: 'grievance',
    read: false,
    actionTab: 'grievance',
  },
  {
    id: 'notif_4',
    title: 'HackHorizon 2026 Registration',
    message: 'Team registrations for $15,000 hackathon close in 5 days.',
    time: '2 days ago',
    type: 'event',
    read: true,
    actionTab: 'notices',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // College Data in state with local persistence
  const [student] = useState<StudentProfile>(CURRENT_STUDENT);
  const [attendances] = useState<SubjectAttendance[]>(SUBJECT_ATTENDANCES);
  const [classes, setClasses] = useState<ClassSession[]>(() => {
    try {
      const saved = localStorage.getItem('campusconnect_classes');
      return saved ? JSON.parse(saved) : TIMETABLE_CLASSES;
    } catch {
      return TIMETABLE_CLASSES;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('campusconnect_notices');
      return saved ? JSON.parse(saved) : ANNOUNCEMENTS;
    } catch {
      return ANNOUNCEMENTS;
    }
  });

  const [locations] = useState<CampusLocation[]>(CAMPUS_LOCATIONS);

  const [grievances, setGrievances] = useState<GrievanceTicket[]>(() => {
    try {
      const saved = localStorage.getItem('campusconnect_grievances');
      return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
    } catch {
      return INITIAL_GRIEVANCES;
    }
  });

  const [notifications, setNotifications] = useState<StudentNotification[]>(INITIAL_NOTIFICATIONS);

  // Transient selection states
  const [initialAIPrompt, setInitialAIPrompt] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  // Save to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('campusconnect_classes', JSON.stringify(classes));
    } catch (e) {
      console.error(e);
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem('campusconnect_notices', JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('campusconnect_grievances', JSON.stringify(grievances));
    } catch (e) {
      console.error(e);
    }
  }, [grievances]);

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
  const handleAddClassSession = (newSession: ClassSession) => {
    setClasses((prev) => [...prev, newSession]);
  };

  const handleToggleNoticeRead = (noticeId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === noticeId ? { ...a, read: !a.read } : a))
    );
  };

  const handleSubmitGrievance = (newTicket: GrievanceTicket) => {
    setGrievances((prev) => [newTicket, ...prev]);
    // Also push a notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: `Ticket ${newTicket.ticketNumber} Registered`,
        message: `Assigned to ${newTicket.assignedTo}. Response SLA: 24-48 Hours.`,
        time: 'Just now',
        type: 'grievance',
        read: false,
        actionTab: 'grievance',
      },
      ...prev,
    ]);
  };

  const handleAddGrievanceComment = (ticketId: string, comment: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== ticketId) return g;
        return {
          ...g,
          updatedAt: 'Just now',
          timeline: [
            ...g.timeline,
            {
              date: 'Just now',
              title: 'Student Follow-up Note',
              note: comment,
              by: 'Aarav Sharma (Student)',
            },
          ],
        };
      })
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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

  const handleAskAI = (prompt: string) => {
    setInitialAIPrompt(prompt);
    setActiveTab('assistant');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const todayClasses = classes.filter((c) => c.day === 'Monday');

  // If user is on the Landing / Presentation view
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
          unreadCount={unreadNotificationCount}
          student={student}
        />

        {/* View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              student={student}
              attendances={attendances}
              todayClasses={todayClasses}
              announcements={announcements}
              setActiveTab={setActiveTab}
              onSelectNotice={(id) => {
                setSelectedNoticeId(id);
                setActiveTab('notices');
              }}
              onAskAI={handleAskAI}
              onSelectLocation={(locId) => {
                setSelectedLocationId(locId);
                setActiveTab('campus');
              }}
            />
          )}

          {activeTab === 'assistant' && (
            <AIAssistantView
              initialPrompt={initialAIPrompt}
              onClearInitialPrompt={() => setInitialAIPrompt('')}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableView
              classes={classes}
              setActiveTab={setActiveTab}
              onSelectLocation={(locId) => {
                setSelectedLocationId(locId);
                setActiveTab('campus');
              }}
              onAddClassSession={handleAddClassSession}
            />
          )}

          {activeTab === 'notices' && (
            <NoticeBoardView
              announcements={announcements}
              onToggleRead={handleToggleNoticeRead}
              selectedNoticeId={selectedNoticeId}
              onClearSelectedNotice={() => setSelectedNoticeId(null)}
            />
          )}

          {activeTab === 'campus' && (
            <CampusNavView
              locations={locations}
              selectedLocationId={selectedLocationId}
              onSelectLocation={(id) => setSelectedLocationId(id)}
              setActiveTab={setActiveTab}
              onAskAI={handleAskAI}
            />
          )}

          {activeTab === 'grievance' && (
            <GrievanceView
              grievances={grievances}
              onSubmitGrievance={handleSubmitGrievance}
              onAddComment={handleAddGrievanceComment}
            />
          )}

          {activeTab === 'study-buddy' && <StudyBuddyView />}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onSelectLocation={(locId) => {
          setSelectedLocationId(locId);
          setActiveTab('campus');
        }}
        onSelectNotice={(noticeId) => {
          setSelectedNoticeId(noticeId);
          setActiveTab('notices');
        }}
      />

      {/* Global Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />
    </div>
  );
}
