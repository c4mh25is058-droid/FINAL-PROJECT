import React, { useState } from 'react';
import { 
  CorporateDocument, 
  DocumentCategory, 
  DocumentClassification, 
  SignatureStatus, 
  Department, 
  Employee,
  UserRole
} from '../../types';
import { ROLE_PROFILES } from '../../data/initialData';
import { X, UploadCloud, Shield, FileText } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newDoc: CorporateDocument) => void;
  employees: Employee[];
  currentRole: UserRole;
}

const CATEGORIES: DocumentCategory[] = [
  'Contracts & Agreements',
  'Policy & Compliance',
  'Performance & Comp',
  'Tax & Legal',
  'Benefits & Insurance'
];

const CLASSIFICATIONS: DocumentClassification[] = [
  'Public / Company',
  'Department',
  'Manager / Confidential',
  'Strictly Restricted HR'
];

const DEPARTMENTS: (Department | 'All Departments')[] = [
  'All Departments',
  'Executive',
  'Engineering',
  'Product & Design',
  'People & Culture',
  'Finance & Legal',
  'Sales & Growth',
  'Operations'
];

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  employees,
  currentRole
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Policy & Compliance');
  const [classification, setClassification] = useState<DocumentClassification>('Public / Company');
  const [department, setDepartment] = useState<Department | 'All Departments'>('All Departments');
  const [taggedEmployeeId, setTaggedEmployeeId] = useState<string>('');
  const [version, setVersion] = useState('v1.0');
  const [requiresSignature, setRequiresSignature] = useState(false);
  const [summary, setSummary] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const activeProfile = ROLE_PROFILES[currentRole];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taggedEmployee = employees.find(e => e.id === taggedEmployeeId);
    const newDocId = `DOC-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().slice(0, 10);
    const nowTimeStr = new Date().toTimeString().slice(0, 5);

    const newDoc: CorporateDocument = {
      id: newDocId,
      title: title.trim(),
      category,
      classification,
      employeeId: taggedEmployeeId || null,
      employeeName: taggedEmployee ? `${taggedEmployee.firstName} ${taggedEmployee.lastName}` : undefined,
      department,
      uploadedAt: nowStr,
      fileSize: '1.4 MB',
      fileFormat: 'PDF',
      version,
      signatureStatus: requiresSignature ? 'Pending Signature' : 'Not Required',
      signedBy: [],
      lastAccessed: `${nowStr} ${nowTimeStr}`,
      summary: summary.trim() || `Official ${category} corporate record archived in CODEX4 TECH LMT Vault.`,
      previewBody: previewContent.trim() || `CODEX4 TECH LMT\nDOCUMENT RECORD: ${title.toUpperCase()}\n\nDate: ${nowStr}\nCategory: ${category}\nClassification: ${classification}\nDepartment: ${department}\n\n1. PURPOSE & PROVISIONS:\nThis official corporate record has been securely archived by ${activeProfile.name} in compliance with ISO/IEC 27001 data governance standards.\n\n2. ENFORCEMENT & ARCHIVE:\nAccess to this record is strictly governed by CODEX4 TECH LMT RBAC policies.`,
      accessLog: [
        {
          userName: activeProfile.name,
          role: activeProfile.title.split('(')[0].trim(),
          timestamp: `${nowStr} ${nowTimeStr}`,
          action: 'Updated'
        }
      ]
    };

    onUpload(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Upload Secure Corporate Document
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deposit agreements, compliance policies, and personnel files
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
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Master Services Agreement & Data Addendum"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as DocumentCategory)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Security Classification
              </label>
              <select
                value={classification}
                onChange={e => setClassification(e.target.value as DocumentClassification)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {CLASSIFICATIONS.map(cl => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department Assignment
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tag Specific Employee (Optional)
              </label>
              <select
                value={taggedEmployeeId}
                onChange={e => setTaggedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="">None (Company-wide / General)</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} ({e.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="w-24">
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="sigReq"
                checked={requiresSignature}
                onChange={e => setRequiresSignature(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="sigReq" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Requires Verified Electronic Signature
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Document Abstract / Executive Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Brief description of the document purpose and scope..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Document Text / Policy Body
            </label>
            <textarea
              rows={4}
              value={previewContent}
              onChange={e => setPreviewContent(e.target.value)}
              placeholder="Paste or draft policy clauses, terms, and conditions..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-[11px]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
            >
              Securely Archive Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
