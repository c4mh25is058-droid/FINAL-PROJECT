import React, { useState } from 'react';
import { Employee, Department, RoleLevel, OfficeType, EmploymentStatus, UserRole, CorporateDocument } from '../../types';
import { Avatar } from '../common/Avatar';
import { PhotoUploadCameraModal } from '../common/PhotoUploadCameraModal';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  GitFork, 
  Edit3, 
  Check, 
  UserPlus, 
  Briefcase, 
  Copy, 
  Share2, 
  Lock,
  ChevronRight,
  FileText,
  AlertCircle,
  Camera
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  allEmployees: Employee[];
  allDocuments: CorporateDocument[];
  currentRole: UserRole;
  onClose: () => void;
  onUpdateEmployee: (updated: Employee) => void;
  onSelectEmployee: (emp: Employee) => void;
  onOpenOrgChartAt: (empId: string) => void;
  onViewDocument: (doc: CorporateDocument) => void;
}

const DEPARTMENTS: Department[] = [
  'Executive',
  'Engineering',
  'Product & Design',
  'People & Culture',
  'Finance & Legal',
  'Sales & Growth',
  'Operations'
];

const DEPARTMENT_GRADIENTS: Record<Department, string> = {
  Executive: 'from-violet-600 via-purple-600 to-indigo-700',
  Engineering: 'from-blue-600 via-indigo-600 to-cyan-600',
  'Product & Design': 'from-emerald-600 via-teal-600 to-cyan-600',
  'People & Culture': 'from-amber-500 via-orange-500 to-rose-500',
  'Finance & Legal': 'from-indigo-600 via-slate-700 to-blue-800',
  'Sales & Growth': 'from-rose-600 via-pink-600 to-red-600',
  Operations: 'from-teal-600 via-cyan-700 to-slate-700'
};

const DEPARTMENT_BADGE_STYLES: Record<Department, string> = {
  Executive: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  Engineering: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Product & Design': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'People & Culture': 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Finance & Legal': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'Sales & Growth': 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Operations: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800'
};

const ROLE_LEVELS: RoleLevel[] = [
  'C-Level',
  'VP',
  'Director',
  'Manager / Lead',
  'Staff / Principal',
  'Senior IC',
  'Associate'
];

const OFFICE_TYPES: OfficeType[] = ['In-Office', 'Hybrid', 'Remote'];
const STATUSES: EmploymentStatus[] = ['Active', 'On Leave', 'Probation', 'Notice Period'];

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  allEmployees,
  allDocuments,
  currentRole,
  onClose,
  onUpdateEmployee,
  onSelectEmployee,
  onOpenOrgChartAt,
  onViewDocument
}) => {
  if (!employee) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Employee>({ ...employee });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hierarchy' | 'documents'>('overview');
  const [newSkill, setNewSkill] = useState('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Identify direct manager and direct reports
  const directManager = allEmployees.find(e => e.id === employee.managerId);
  const directReports = allEmployees.filter(e => e.managerId === employee.id);
  const employeeDocs = allDocuments.filter(d => d.employeeId === employee.id);

  // Check compensation clearance
  const canViewComp = currentRole === 'hr_admin' || (currentRole === 'department_manager' && employee.department === 'Engineering');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(employee.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSave = () => {
    onUpdateEmployee(formData);
    setIsEditing(false);
  };

  const handlePhotoSelected = (photoUrl: string) => {
    const updated = { ...formData, avatar: photoUrl };
    setFormData(updated);
    if (!isEditing) {
      onUpdateEmployee({ ...employee, avatar: photoUrl });
    }
  };

  const deptGradient = DEPARTMENT_GRADIENTS[employee.department] || 'from-indigo-600 to-blue-700';
  const deptBadgeStyle = DEPARTMENT_BADGE_STYLES[employee.department] || 'bg-slate-100 text-slate-800';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Vibrant Department Color Accent Top Bar */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${deptGradient}`} />

        {/* Modal Top Banner & Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar with Camera Trigger */}
              <div className="relative group/avatar">
                <Avatar
                  src={isEditing ? formData.avatar : employee.avatar}
                  firstName={employee.firstName}
                  lastName={employee.lastName}
                  department={employee.department}
                  status={employee.status}
                  size="xl"
                />
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center justify-center transition-all hover:scale-105 ring-2 ring-white dark:ring-slate-900"
                  title="Upload or take photo with camera"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {employee.id}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                  {employee.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  <span className={`px-2 py-0.5 rounded-md font-semibold border ${deptBadgeStyle}`}>
                    {employee.department}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{employee.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className={employee.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400 font-semibold'}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Top action controls */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => {
                    setFormData({ ...employee });
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          {!isEditing && (
            <div className="flex items-center gap-1 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Overview & Bio
              </button>
              <button
                onClick={() => setActiveTab('hierarchy')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'hierarchy'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Hierarchy</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700">
                  {directReports.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'documents'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Dossier & Docs</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700">
                  {employeeDocs.length}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isEditing ? (
            /* Live Profile Form Editor */
            <div className="space-y-5 text-xs">
              {/* Photo Upload / Take Photo Banner in Edit Mode */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={formData.avatar}
                    firstName={formData.firstName}
                    lastName={formData.lastName}
                    department={formData.department}
                    size="md"
                  />
                  <div>
                    <p className="font-bold text-indigo-950 dark:text-indigo-200">
                      Profile Headshot Photo
                    </p>
                    <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300">
                      Take a snapshot via webcam or upload an image file
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Update Photo</span>
                </button>
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-indigo-950 dark:text-indigo-200">
                    Live Real-Time Synchronization Active
                  </p>
                  <p className="text-indigo-800/80 dark:text-indigo-300 text-[11px]">
                    Updates to reporting manager, title, or department will instantly reflect across the entire organizational chart and directory roster.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Official Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role Seniority Level
                  </label>
                  <select
                    value={formData.roleLevel}
                    onChange={e => setFormData({ ...formData, roleLevel: e.target.value as RoleLevel })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    {ROLE_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Reports To (Direct Manager)
                  </label>
                  <select
                    value={formData.managerId || ''}
                    onChange={e => setFormData({ ...formData, managerId: e.target.value || null })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">None (Top of Org / Board)</option>
                    {allEmployees
                      .filter(e => e.id !== employee.id)
                      .map(mgr => (
                        <option key={mgr.id} value={mgr.id}>
                          {mgr.firstName} {mgr.lastName} — {mgr.title} ({mgr.department})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Direct Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Work Arrangement
                  </label>
                  <select
                    value={formData.officeType}
                    onChange={e => setFormData({ ...formData, officeType: e.target.value as OfficeType })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    {OFFICE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Employment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    {STATUSES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Slack Handle
                  </label>
                  <input
                    type="text"
                    value={formData.slack}
                    onChange={e => setFormData({ ...formData, slack: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Compensation Grade - HR Restricted */}
              {canViewComp && (
                <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="flex items-center gap-1.5 mb-1.5 text-amber-800 dark:text-amber-300 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confidential Compensation Grade (HR Clearance)</span>
                  </div>
                  <input
                    type="text"
                    value={formData.compensationBand}
                    onChange={e => setFormData({ ...formData, compensationBand: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              )}

              {/* Bio & Summary */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Professional Bio & Executive Background
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Skills Tag Management */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Skills & Core Competencies
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.skills.map(s => (
                    <span 
                      key={s} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                    >
                      {s}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(s)}
                        className="text-slate-400 hover:text-red-500 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add competency (e.g. Distributed Systems)..."
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            /* View Mode: Overview Tab */
            <div className="space-y-6">
              {/* Contact and Work Metadata Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <a 
                      href={`mailto:${employee.email}`} 
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate hover:underline"
                    >
                      {employee.email}
                    </a>
                    <button
                      onClick={handleCopyEmail}
                      title="Copy email to clipboard"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 p-1 rounded"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Direct Phone</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
                    {employee.phone}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Office & Arrangement</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {employee.officeType} · {employee.location}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Hire Date / Tenure</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
                    {employee.startDate}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Timezone & Slack</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {employee.timeZone} · <span className="text-indigo-600 dark:text-indigo-400">{employee.slack}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Compensation Grade</span>
                  </div>
                  {canViewComp ? (
                    <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
                      {employee.compensationBand}
                    </p>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Lock className="w-3 h-3" />
                      <span>Confidential (HR Only)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Executive & Professional Summary
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {employee.bio}
                </p>
              </div>

              {/* Skills & Competencies */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Core Skills & Domain Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {employee.skills.map(skill => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Verified Emergency Contact
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
                  <span><strong className="text-slate-800 dark:text-slate-200">Name:</strong> {employee.emergencyContact.name} ({employee.emergencyContact.relation})</span>
                  <span>·</span>
                  <span><strong className="text-slate-800 dark:text-slate-200">Emergency Phone:</strong> <span className="font-mono">{employee.emergencyContact.phone}</span></span>
                </div>
              </div>
            </div>
          ) : activeTab === 'hierarchy' ? (
            /* View Mode: Reporting Hierarchy Tab */
            <div className="space-y-6">
              {/* Direct Manager Card */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Direct Manager
                </h4>
                {directManager ? (
                  <div 
                    onClick={() => onSelectEmployee(directManager)}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={directManager.avatar}
                        firstName={directManager.firstName}
                        lastName={directManager.lastName}
                        department={directManager.department}
                        size="md"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {directManager.firstName} {directManager.lastName}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {directManager.title}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {directManager.department} · {directManager.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 text-xs font-medium">
                      <span>View Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400">
                    Top of corporate hierarchy (Reports directly to the Board of Directors).
                  </div>
                )}
              </div>

              {/* Direct Reports List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Direct Reports ({directReports.length})
                  </h4>
                  <button
                    onClick={() => onOpenOrgChartAt(employee.id)}
                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Expand in Org Chart</span>
                  </button>
                </div>

                {directReports.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {directReports.map(rep => (
                      <div
                        key={rep.id}
                        onClick={() => onSelectEmployee(rep)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={rep.avatar}
                            firstName={rep.firstName}
                            lastName={rep.lastName}
                            department={rep.department}
                            size="sm"
                          />
                          <div className="truncate max-w-[160px]">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {rep.firstName} {rep.lastName}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {rep.title}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    Individual Contributor (no direct reports currently assigned).
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* View Mode: Documents Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Personnel Vault Documents
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Official employment agreements, tax filings, and performance dossiers.
                  </p>
                </div>
              </div>

              {employeeDocs.length > 0 ? (
                <div className="space-y-2">
                  {employeeDocs.map(doc => {
                    const isLocked = 
                      (doc.classification === 'Strictly Restricted HR' && currentRole !== 'hr_admin') ||
                      (doc.classification === 'Manager / Confidential' && currentRole === 'employee');

                    return (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {doc.title}
                              </p>
                              <span className="font-mono text-[10px] text-slate-400">
                                {doc.version}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <span>{doc.classification}</span>
                              <span aria-hidden="true">·</span>
                              <span>{doc.fileSize}</span>
                              <span aria-hidden="true">·</span>
                              <span className={doc.signatureStatus === 'Signed & Verified' ? 'text-emerald-600' : 'text-amber-600'}>
                                {doc.signatureStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isLocked ? (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                              <Lock className="w-3 h-3" />
                              <span>Restricted</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onClose();
                                onViewDocument(doc);
                              }}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                            >
                              Preview Doc
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  No individual contracts or tax records linked to this employee.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Employee Record ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{employee.id}</strong></span>
          </div>
          <button
            onClick={() => onOpenOrgChartAt(employee.id)}
            className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Trace in Org Chart</span>
          </button>
        </div>

        {/* Camera / Photo Upload Modal */}
        <PhotoUploadCameraModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onPhotoSelected={handlePhotoSelected}
          currentPhoto={formData.avatar}
          employeeName={`${employee.firstName} ${employee.lastName}`}
        />
      </div>
    </div>
  );
};

