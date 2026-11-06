import React, { useState } from 'react';
import { CorporateDocument, UserRole } from '../../types';
import { ROLE_PROFILES } from '../../data/initialData';
import { 
  X, 
  Download, 
  ShieldCheck, 
  FileCheck, 
  Lock, 
  Clock, 
  History, 
  CheckCircle2, 
  FileText,
  AlertTriangle
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: CorporateDocument | null;
  currentRole: UserRole;
  onClose: () => void;
  onSignDocument: (docId: string, signerName: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  currentRole,
  onClose,
  onSignDocument
}) => {
  if (!doc) return null;

  const [activeTab, setActiveTab] = useState<'content' | 'audit'>('content');
  const [downloadNotice, setDownloadNotice] = useState(false);
  const activeProfile = ROLE_PROFILES[currentRole];

  // Access control check
  const isLocked = 
    (doc.classification === 'Strictly Restricted HR' && currentRole !== 'hr_admin') ||
    (doc.classification === 'Manager / Confidential' && currentRole === 'employee');

  const handleDownload = () => {
    const blob = new Blob([doc.previewBody], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${doc.version}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 2500);
  };

  const handleSign = () => {
    onSignDocument(doc.id, activeProfile.name);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Document Header Strip */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {doc.title}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {doc.version}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{doc.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{doc.fileSize}</span>
                <span aria-hidden="true">·</span>
                <span className={`font-semibold ${
                  doc.classification === 'Strictly Restricted HR'
                    ? 'text-rose-600 dark:text-rose-400'
                    : doc.classification === 'Manager / Confidential'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {doc.classification}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isLocked && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                title="Download verified document"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadNotice ? 'Exported!' : 'Download'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Tabs (Document vs Audit Log) */}
        {!isLocked && (
          <div className="px-5 pt-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Document Body Preview
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-1.5 px-3 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'audit'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Security Access Log ({doc.accessLog.length})</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {isLocked ? (
            /* Restricted Access State */
            <div className="py-12 px-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Access Restricted by Security Policy
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  This document has been classified under <strong className="text-rose-600 dark:text-rose-400">{doc.classification}</strong>. Your current active role (<strong className="text-slate-700 dark:text-slate-200">{activeProfile.name}</strong>) does not have clearance to decrypt or view this content.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 text-left">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>How to test clearance:</span>
                </div>
                Use the <strong className="text-indigo-600 dark:text-indigo-400">Role Simulator</strong> dropdown in the top header to switch your viewpoint to <strong>HR Director (Admin)</strong> to inspect and edit this file.
              </div>
            </div>
          ) : activeTab === 'content' ? (
            /* Official Stylized Document Letterhead Viewer */
            <div className="space-y-4">
              {/* Document Metadata Strip */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Doc ID: <strong className="text-slate-700 dark:text-slate-300">{doc.id}</strong>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <span className="text-slate-500">
                    Uploaded: <strong className="text-slate-700 dark:text-slate-300">{doc.uploadedAt}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    doc.signatureStatus === 'Signed & Verified'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  }`}>
                    {doc.signatureStatus === 'Signed & Verified' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    <span>{doc.signatureStatus}</span>
                  </span>
                </div>
              </div>

              {/* Sign Action Callout if Pending */}
              {doc.signatureStatus === 'Pending Signature' && (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-indigo-950 dark:text-indigo-200">
                      Signature Required on Record
                    </p>
                    <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300 mt-0.5">
                      This formal agreement requires electronic acknowledgment and verified signature.
                    </p>
                  </div>
                  <button
                    onClick={handleSign}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm whitespace-nowrap"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Sign as {activeProfile.name}</span>
                  </button>
                </div>
              )}

              {/* Formal Text Preview Area */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-text relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-10 text-4xl font-display font-extrabold text-slate-900 dark:text-white pointer-events-none select-none">
                  MERIDIAN
                </div>
                {doc.previewBody}
              </div>

              {/* Signed Signatories */}
              {doc.signedBy && doc.signedBy.length > 0 && (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Verified Digital Signatories:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doc.signedBy.map((signer, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{signer}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Audit Log Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  Document Security & Compliance Access Log
                </h4>
                <span className="text-slate-400 text-[11px]">
                  Cryptographically verified immutable audit trail
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                {doc.accessLog.map((log, index) => (
                  <div key={index} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {log.userName}
                          <span className="font-normal text-slate-500 ml-1.5 text-[11px]">
                            ({log.role})
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {log.timestamp}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                      log.action === 'Signed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : log.action === 'Downloaded'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
