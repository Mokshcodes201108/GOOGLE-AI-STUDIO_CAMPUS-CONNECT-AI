import React from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  Info, 
  Building2, 
  GraduationCap 
} from 'lucide-react';
import { BranchFilterState, DepartmentName } from '../types';
import { AVAILABLE_DEPARTMENTS } from '../data/mockData';

interface BranchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: BranchFilterState;
  onSaveFilter: (newFilter: BranchFilterState) => void;
}

export const BranchFilterModal: React.FC<BranchFilterModalProps> = ({
  isOpen,
  onClose,
  filter,
  onSaveFilter,
}) => {
  const [selectedDept, setSelectedDept] = React.useState<DepartmentName>(filter.department);
  const [selectedSem, setSelectedSem] = React.useState<number>(filter.semester);

  if (!isOpen) return null;

  const isVerifiedCurrent = selectedDept === 'Computer Engineering' && selectedSem === 1;

  const handleApply = () => {
    onSaveFilter({
      department: selectedDept,
      semester: selectedSem,
      academicYear: '2026–2027',
      division: selectedDept === 'Computer Engineering' ? 'CE-1' : 'Div-A',
      classroom: isVerifiedCurrent ? 'Room 3206' : 'Room 2104 (Block 2)',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Select Branch & Semester</h3>
              <p className="text-xs text-slate-500">Government Engineering College, Bharuch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-5">
          {/* Verified Data Callout */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
            isVerifiedCurrent 
              ? 'bg-blue-50/80 border-blue-200 text-blue-950' 
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              {isVerifiedCurrent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Verified Official Timetable Active</span>
                </>
              ) : (
                <>
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Sample / Admin Schedule Preview</span>
                </>
              )}
            </div>
            <p>
              {isVerifiedCurrent
                ? 'Semester 1 Computer Engineering is officially verified from the uploaded timetable documents (Room 3206, Oct 2026 Progressive Assessment schedule, and subject faculty).'
                : 'Verified documents are currently uploaded for Semester 1 Computer Engineering. Administrators can upload additional timetables in the Admin Panel.'}
            </p>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
              Engineering Department
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_DEPARTMENTS.map((dept) => {
                const isSelected = selectedDept === dept;
                const isVerified = dept === 'Computer Engineering';
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{dept}</span>
                    {isVerified && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Verified
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Semester Selection */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
              Academic Semester
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSelectedSem(sem)}
                  className={`py-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedSem === sem
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Classroom preview */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Allocated Classroom:</span>
            <strong className="text-slate-900 font-extrabold">
              {isVerifiedCurrent ? 'Room 3206 (3rd Floor, Block 3)' : 'Classroom 2104'}
            </strong>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            Apply Schedule View
          </button>
        </div>
      </div>
    </div>
  );
};
