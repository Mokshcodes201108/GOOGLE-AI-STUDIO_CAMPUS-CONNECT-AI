import React, { useState } from 'react';
import { NoticeItem } from '../types';
import { 
  Bell, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  ChevronRight
} from 'lucide-react';

interface NoticeBoardViewProps {
  notices: NoticeItem[];
  onToggleRead: (id: string) => void;
  selectedNoticeId?: string | null;
  onClearSelectedNotice?: () => void;
}

export const NoticeBoardView: React.FC<NoticeBoardViewProps> = ({
  notices,
  onToggleRead,
  selectedNoticeId,
  onClearSelectedNotice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [activeModalNotice, setActiveModalNotice] = useState<NoticeItem | null>(null);

  // If selectedNoticeId was passed from dashboard or search
  React.useEffect(() => {
    if (selectedNoticeId) {
      const match = notices.find((a) => a.id === selectedNoticeId);
      if (match) {
        setActiveModalNotice(match);
      }
      if (onClearSelectedNotice) onClearSelectedNotice();
    }
  }, [selectedNoticeId, notices]);

  const categories = ['All', 'Examination', 'Academic', 'GTU Circular', 'Events & Sports', 'Administrative'];

  const filtered = notices.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnread = !unreadOnly || !a.read;
    return matchesCat && matchesSearch && matchesUnread;
  });

  const urgentNotices = notices.filter((a) => a.isUrgent);

  const handleDownloadAttachment = (notice: NoticeItem) => {
    const textData = `--- GOVERNMENT ENGINEERING COLLEGE, BHARUCH (GTU) ---\nOFFICIAL CIRCULAR: ${notice.title}\nDATE: ${notice.date}\nISSUED BY: ${notice.issuedBy}\nCATEGORY: ${notice.category}\n\n${notice.content}\n\n[Certified Digital Document - GEC Bharuch Academic Portal]`;
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', notice.attachmentName || `GECB_Notice_${notice.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Pinned Urgent Notice Banner */}
      {urgentNotices.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-blue-950 text-white shadow-lg shadow-rose-950/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rose-500/30">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-rose-800">
                  Urgent Notice
                </span>
                <span className="text-xs text-rose-200">{urgentNotices[0].date}</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base mt-1 leading-snug">
                {urgentNotices[0].title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveModalNotice(urgentNotices[0])}
            className="px-4 py-2 rounded-xl bg-white text-rose-800 hover:bg-rose-50 text-xs font-black shrink-0 shadow-xs transition-colors self-start sm:self-center"
          >
            Read Circular
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars, mid-sem exam notifications, GTU rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                unreadOnly
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Unread Only
            </button>
            <span className="text-xs text-slate-400">
              Showing {filtered.length} notices
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No notices found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or category filters.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalNotice(item)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                item.read 
                  ? 'bg-white border-slate-200 hover:border-slate-300' 
                  : 'bg-blue-50/40 border-blue-200 shadow-xs hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    {item.isUrgent && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        Urgent Notice
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" title="Unread" />
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Issued by: <strong className="text-slate-700">{item.issuedBy}</strong></span>
                    {item.attachmentName && (
                      <span className="text-blue-700 font-bold flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {item.attachmentName} ({item.attachmentSize})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                  <span className="text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read circular <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notice Detail Modal */}
      {activeModalNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setActiveModalNotice(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {activeModalNotice.category}
                    </span>
                    {activeModalNotice.isUrgent && (
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        Urgent
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{activeModalNotice.date}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 leading-snug">
                    {activeModalNotice.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModalNotice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Issuing Authority: <strong className="text-slate-900">{activeModalNotice.issuedBy}</strong></span>
                <span className="font-semibold text-blue-800">GEC Bharuch</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {activeModalNotice.content}
              </p>

              {activeModalNotice.attachmentName && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-700 text-white shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{activeModalNotice.attachmentName}</p>
                      <p className="text-[11px] text-slate-500">Official Circular • {activeModalNotice.attachmentSize}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadAttachment(activeModalNotice)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onToggleRead(activeModalNotice.id);
                  setActiveModalNotice({ ...activeModalNotice, read: !activeModalNotice.read });
                }}
                className="text-xs font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{activeModalNotice.read ? 'Mark as Unread' : 'Mark as Read'}</span>
              </button>

              <button
                onClick={() => setActiveModalNotice(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
