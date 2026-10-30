import React, { useState } from 'react';
import { 
  GrievanceTicket, 
  GrievanceStatus, 
  GrievancePriority 
} from '../types';
import { 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Filter, 
  ShieldCheck, 
  MessageSquare, 
  X, 
  Send,
  Building,
  UserCheck
} from 'lucide-react';

interface GrievanceViewProps {
  grievances: GrievanceTicket[];
  onSubmitGrievance: (newTicket: GrievanceTicket) => void;
  onAddComment: (ticketId: string, comment: string) => void;
}

export const GrievanceView: React.FC<GrievanceViewProps> = ({
  grievances,
  onSubmitGrievance,
  onAddComment,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | GrievanceStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<GrievanceTicket | null>(grievances[0] || null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GrievanceTicket['category']>('Infrastructure & WiFi');
  const [priority, setPriority] = useState<GrievancePriority>('Medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const filtered = grievances.filter((g) => {
    const matchesTab = activeTab === 'All' || g.status === activeTab;
    const matchesSearch = 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newTicket: GrievanceTicket = {
      id: `grv_${Date.now()}`,
      ticketNumber: `GRV-2026-${randomNum}`,
      title: title.trim(),
      category,
      priority,
      status: 'Submitted',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      description: description.trim(),
      location: location.trim() || 'Campus Main Grounds',
      assignedTo: getAssignedDepartment(category),
      isAnonymous,
      timeline: [
        {
          date: 'Just now',
          title: 'Ticket Submitted',
          note: isAnonymous 
            ? 'Ticket registered anonymously by student.' 
            : 'Ticket registered by Aarav Sharma (24CS089).',
          by: isAnonymous ? 'Student (Anonymous)' : 'Aarav Sharma',
        },
      ],
    };

    onSubmitGrievance(newTicket);
    setSelectedTicket(newTicket);
    setIsSubmitModalOpen(false);

    // Reset
    setTitle('');
    setDescription('');
    setLocation('');
    setIsAnonymous(false);
  };

  const getAssignedDepartment = (cat: GrievanceTicket['category']) => {
    switch (cat) {
      case 'Academic': return 'Academic Section & HOD Office';
      case 'Hostel & Mess': return 'Hostel Warden & Mess Committee';
      case 'Infrastructure & WiFi': return 'Campus Estates & IT Network Cell';
      case 'Library': return 'Central Library Circulation Desk';
      case 'Transport': return 'Campus Transport & Fleet Management';
      case 'Administrative': return 'Dean Student Welfare Office';
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;
    onAddComment(selectedTicket.id, newComment.trim());
    setNewComment('');
  };

  const getStatusBadge = (status: GrievanceStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Escalated':
        return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  const getPriorityBadge = (p: GrievancePriority) => {
    switch (p) {
      case 'Urgent': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Student Grievance & Complaint Redressal</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SLA: 24-48 Hours
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dean of Student Welfare Office • Guaranteed response tracking & escalation system
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge New Grievance</span>
        </button>
      </div>

      {/* Main Grid: Ticket List (Left 5 Cols) & Detail Timeline (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket number, issue, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {(['All', 'In Progress', 'Under Review', 'Resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 border ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No grievance tickets found</p>
              </div>
            ) : (
              filtered.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                        {ticket.ticketNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                      {ticket.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{ticket.category}</span>
                      <span>Updated: {ticket.updatedAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Ticket Timeline & Follow-up */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
              {/* Ticket Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(selectedTicket.priority)}`}>
                      Priority: {selectedTicket.priority}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Registered: {selectedTicket.createdAt}</span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {selectedTicket.title}
                </h3>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
                    <strong className="text-slate-800">{selectedTicket.category}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                    <strong className="text-slate-800 truncate block">{selectedTicket.location}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Cell</span>
                    <strong className="text-slate-800 truncate block">{selectedTicket.assignedTo}</strong>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Description</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedTicket.description}
                </p>
                {selectedTicket.isAnonymous && (
                  <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Submitted under student anonymity protection. Student identity is hidden.
                  </p>
                )}
              </div>

              {/* Resolution Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Redressal Timeline & Official Updates
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                  {selectedTicket.timeline.map((event, i) => (
                    <div key={i} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <strong className="text-slate-900 font-bold">{event.title}</strong>
                          <span className="text-[10px] text-slate-400">{event.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{event.note}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Logged by: {event.by}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Comment / Update Box */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Add Student Update / Follow-up Note
                </h4>

                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Provide additional details or ask the assigned team..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    <span>Post</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              Select a grievance ticket to inspect its details and timeline.
            </div>
          )}
        </div>
      </div>

      {/* Submit Grievance Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsSubmitModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-600" />
                Lodge Student Grievance / Concern
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Inoperative projector in Room 201 or Mess food hygiene"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="Academic">Academic / Grading</option>
                    <option value="Hostel & Mess">Hostel & Mess</option>
                    <option value="Infrastructure & WiFi">Infrastructure & WiFi</option>
                    <option value="Library">Library</option>
                    <option value="Transport">Transport & Shuttle</option>
                    <option value="Administrative">Administrative / Fees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Safety/Health)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Block B, GPU Lab 402 or Tagore Hostel Room 214"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe what occurred, when it started, and how it impacts your academic schedule or living conditions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">Anonymous Submission</span>
                  <p className="text-[11px] text-indigo-700">Hide my roll number and name from the public grievance board</p>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
                >
                  Register Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
