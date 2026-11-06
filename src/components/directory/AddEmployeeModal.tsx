import React, { useState } from 'react';
import { Employee, Department, RoleLevel, OfficeType, EmploymentStatus } from '../../types';
import { X, UserPlus, Check, Building2 } from 'lucide-react';

interface AddEmployeeModalProps {
  allEmployees: Employee[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newEmployee: Employee) => void;
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

const ROLE_LEVELS: RoleLevel[] = [
  'C-Level',
  'VP',
  'Director',
  'Manager / Lead',
  'Staff / Principal',
  'Senior IC',
  'Associate'
];

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  allEmployees,
  isOpen,
  onClose,
  onAdd
}) => {
  if (!isOpen) return null;

  const nextIdNumber = 1000 + allEmployees.length + 1;
  const defaultId = `EMP-${nextIdNumber}`;

  const [formData, setFormData] = useState({
    id: defaultId,
    firstName: '',
    lastName: '',
    title: '',
    department: 'Engineering' as Department,
    roleLevel: 'Senior IC' as RoleLevel,
    managerId: allEmployees[1]?.id || allEmployees[0]?.id || '',
    email: '',
    phone: '+1 (415) 890-',
    location: 'San Francisco, CA (HQ)',
    officeType: 'Hybrid' as OfficeType,
    status: 'Active' as EmploymentStatus,
    startDate: new Date().toISOString().slice(0, 10),
    bio: '',
    skills: 'TypeScript, Cloud Infrastructure',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    compensationBand: 'Grade S-5 (Senior)',
    timeZone: 'PST (UTC-8)',
    slack: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.title || !formData.email) {
      alert('Please fill in required fields (First Name, Last Name, Title, Email).');
      return;
    }

    const newEmp: Employee = {
      id: formData.id,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      title: formData.title.trim(),
      department: formData.department,
      roleLevel: formData.roleLevel,
      managerId: formData.managerId || null,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      officeType: formData.officeType,
      status: formData.status,
      startDate: formData.startDate,
      bio: formData.bio.trim() || `Enterprise team member in ${formData.department} department.`,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyContactName.trim() || 'Primary Contact',
        relation: formData.emergencyContactRelation.trim() || 'Family',
        phone: formData.emergencyContactPhone.trim() || formData.phone
      },
      compensationBand: formData.compensationBand,
      timeZone: formData.timeZone,
      slack: formData.slack.trim() || `@${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
      pronouns: 'they/them',
      avatar: ''
    };

    onAdd(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Onboard New Employee
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create new corporate personnel record and assign reporting tree
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </label>
              <input
                required
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Rachel"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </label>
              <input
                required
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Morrison"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Official Job Title *
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Staff Security Engineer"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Corporate Email *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="rachel.morrison@codex4tech.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {ROLE_LEVELS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reports To (Direct Manager)
              </label>
              <select
                value={formData.managerId}
                onChange={e => setFormData({ ...formData, managerId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {allEmployees.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} — {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Office Location & Workplace
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Skills & Core Competencies (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={e => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. AWS, Kubernetes, Rust, Incident Command"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Executive Bio Summary
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief professional background, previous domain experience..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white font-semibold transition-colors shadow-sm"
            >
              Onboard & Add to Directory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
