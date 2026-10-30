import React from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { NavigationTab } from '../types';

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'academic' | 'alert' | 'grievance' | 'event';
  read: boolean;
  actionTab?: NavigationTab;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: StudentNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: StudentNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: StudentNotification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'grievance':
        return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
      case 'academic':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-600" />;
    }
  };

  const getIconBg = (type: StudentNotification['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-rose-50 border-rose-100';
      case 'grievance':
        return 'bg-amber-50 border-amber-100';
      case 'academic':
        return 'bg-indigo-50 border-indigo-100';
      case 'event':
        return 'bg-purple-50 border-purple-100';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded-md hover:bg-indigo-50 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500">No notifications</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                    : 'bg-indigo-50/40 border-indigo-100/80 hover:bg-indigo-50/70 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border shrink-0 ${getIconBg(item.type)}`}>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-bold truncate ${item.read ? 'text-slate-800' : 'text-indigo-950'}`}>
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.time}</span>
                      {item.actionTab && (
                        <span className="text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline">
                          View details <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Automated campus alerts by CampusConnect AI
          </p>
        </div>
      </div>
    </>
  );
};
