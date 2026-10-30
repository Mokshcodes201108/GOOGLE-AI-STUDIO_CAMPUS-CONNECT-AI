import React, { useState } from 'react';
import { FacultyMember } from '../types';
import { 
  Users, 
  Search, 
  Mail, 
  MapPin, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Phone 
} from 'lucide-react';

interface FacultyDirectoryViewProps {
  facultyList: FacultyMember[];
  onAskAIAboutFaculty?: (facultyName: string) => void;
}

export const FacultyDirectoryView: React.FC<FacultyDirectoryViewProps> = ({
  facultyList,
  onAskAIAboutFaculty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');

  const departments = ['All', 'Computer Engineering', 'Electrical Engineering', 'Applied Science & Humanities', 'Mechanical Engineering'];

  const filteredFaculty = facultyList.filter((f) => {
    const matchesDept = selectedDeptFilter === 'All' || f.department.toLowerCase().includes(selectedDeptFilter.toLowerCase());
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.cabin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                GEC Bharuch Faculty Directory — Semester 1 (CE)
              </h2>
              <p className="text-xs text-slate-500">
                Faculty members mapped to Classroom 3206 subjects, office cabins, and consultation hours
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-center flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            7 Timetable Faculty Verified
          </span>
        </div>

        {/* Search & Dept Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty name, subject (BEE, Maths, PPS), or cabin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDeptFilter(dept)}
                className={`text-[11px] px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 border ${
                  selectedDeptFilter === dept
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-blue-200 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-black text-sm text-slate-900 truncate">{member.name}</h3>
                  <p className="text-xs text-blue-700 font-bold truncate">{member.designation}</p>
                  <p className="text-[11px] text-slate-500 truncate">{member.department}</p>
                </div>
              </div>

              {/* Subjects Taught */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                  Subjects Taught:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.subjects.map((sub, i) => (
                    <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-100">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details & Cabin */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate"><strong>Office Cabin:</strong> {member.cabin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate"><strong>Consultation:</strong> {member.consultationHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-mono text-[11px]">{member.email}</span>
                </div>
              </div>
            </div>

            {/* AI Consultation Prompt */}
            {onAskAIAboutFaculty && (
              <button
                onClick={() => onAskAIAboutFaculty(member.name)}
                className="w-full py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ask AI about {member.name.split(' ')[0]}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
