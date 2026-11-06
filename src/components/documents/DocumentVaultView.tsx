import React, { useState, useMemo } from 'react';
import { 
  CorporateDocument, 
  DocumentCategory, 
  DocumentClassification, 
  UserRole,
  Employee
} from '../../types';
import { ROLE_PROFILES } from '../../data/initialData';
import { 
  FileText, 
  Search, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Download, 
  FileCheck,
  Eye,
  FolderLock
} from 'lucide-react';

interface DocumentVaultViewProps {
  documents: CorporateDocument[];
  employees: Employee[];
  currentRole: UserRole;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectDocument: (doc: CorporateDocument) => void;
  onOpenUploadModal: () => void;
  onSignDocument: (docId: string, signerName: string) => void;
}

const CATEGORIES: (DocumentCategory | 'All')[] = [
  'All',
  'Contracts & Agreements',
  'Policy & Compliance',
  'Performance & Comp',
  'Tax & Legal',
  'Benefits & Insurance'
];

const CATEGORY_ACTIVE_COLORS: Record<string, string> = {
  All: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900',
  'Contracts & Agreements': 'bg-blue-600 text-white shadow-sm shadow-blue-500/25',
  'Policy & Compliance': 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25',
  'Performance & Comp': 'bg-rose-600 text-white shadow-sm shadow-rose-500/25',
  'Tax & Legal': 'bg-amber-600 text-white shadow-sm shadow-amber-500/25',
  'Benefits & Insurance': 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
};

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  employees,
  currentRole,
  searchQuery,
  onSearchChange,
  onSelectDocument,
  onOpenUploadModal,
  onSignDocument
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [selectedClassification, setSelectedClassification] = useState<DocumentClassification | 'All'>('All');
  const activeProfile = ROLE_PROFILES[currentRole];

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
      if (selectedClassification !== 'All' && doc.classification !== selectedClassification) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesId = doc.id.toLowerCase().includes(q);
        const matchesCategory = doc.category.toLowerCase().includes(q);
        const matchesEmployee = doc.employeeName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesCategory && !matchesEmployee) {
          return false;
        }
      }

      return true;
    });
  }, [documents, selectedCategory, selectedClassification, searchQuery]);

  // Statistics
  const pendingSignaturesCount = documents.filter(d => d.signatureStatus === 'Pending Signature').length;
  const restrictedDocsCount = documents.filter(d => d.classification === 'Strictly Restricted HR').length;

  return (
    <div className="space-y-6">
      {/* Security Clearance Alert Banner */}
      <div className="bg-slate-900 text-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-800 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-display tracking-tight text-white">
                CODEX4 TECH LMT Secure Corporate Vault
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                ISO/IEC 27001
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Current Clearance: <strong className="text-white">{activeProfile.name}</strong> ({activeProfile.title.split('(')[0].trim()})
              {currentRole === 'hr_admin' && ' — Unrestricted Executive Clearance'}
              {currentRole === 'department_manager' && ' — Management Clearance (Engineering & Team)'}
              {currentRole === 'employee' && ' — Standard IC Clearance (Personal & Company)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => {
            const count = cat === 'All'
              ? documents.length
              : documents.filter(d => d.category === cat).length;

            const activeColorClass = CATEGORY_ACTIVE_COLORS[cat] || 'bg-slate-900 text-white';

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? `${activeColorClass} shadow-xs scale-[1.02]`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70'
                }`}
              >
                <span>{cat === 'All' ? 'All Document Categories' : cat}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat
                    ? 'bg-black/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search document title or ID..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <select
              value={selectedClassification}
              onChange={e => setSelectedClassification(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Classifications</option>
              <option value="Public / Company">Public / Company</option>
              <option value="Department">Department Specific</option>
              <option value="Manager / Confidential">Manager / Confidential</option>
              <option value="Strictly Restricted HR">Strictly Restricted HR</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{filteredDocs.length}</strong> documents archived
            </span>
            {pendingSignaturesCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{pendingSignaturesCount} signature pending</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Document Records List */}
      <div className="space-y-3">
        {filteredDocs.map(doc => {
          // Check security restrictions
          const isLocked = 
            (doc.classification === 'Strictly Restricted HR' && currentRole !== 'hr_admin') ||
            (doc.classification === 'Manager / Confidential' && currentRole === 'employee');

          return (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 hover:border-indigo-400/80 dark:hover:border-indigo-600/80 transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Zone: File Icon & Title/Details */}
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isLocked
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    : doc.classification === 'Strictly Restricted HR'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {isLocked ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {doc.title}
                    </h3>
                    <span className="font-mono text-[10px] text-slate-400 font-medium">
                      {doc.version}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-2xl">
                    {doc.summary}
                  </p>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span className="font-mono text-[10px]">{doc.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.fileSize}</span>
                    <span aria-hidden="true">·</span>
                    <span>Updated {doc.uploadedAt}</span>
                    {doc.employeeName && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {doc.employeeName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Zone: Classification & Status Controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
                    doc.classification === 'Strictly Restricted HR'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      : doc.classification === 'Manager / Confidential'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : doc.classification === 'Department'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  }`}>
                    {doc.classification}
                  </span>

                  <span className={`text-[10px] font-semibold ${
                    doc.signatureStatus === 'Signed & Verified'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : doc.signatureStatus === 'Pending Signature'
                      ? 'text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-slate-400'
                  }`}>
                    {doc.signatureStatus}
                  </span>
                </div>

                {isLocked ? (
                  <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDocument(doc);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
