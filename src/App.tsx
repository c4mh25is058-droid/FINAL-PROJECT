/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Employee, CorporateDocument, UserRole } from './types';
import { 
  loadEmployees, 
  saveEmployees, 
  loadDocuments, 
  saveDocuments, 
  resetStorage,
  exportEmployeesCsv
} from './utils/storage';
import { Header } from './components/layout/Header';
import { DirectoryView } from './components/directory/DirectoryView';
import { EmployeeDetailModal } from './components/directory/EmployeeDetailModal';
import { AddEmployeeModal } from './components/directory/AddEmployeeModal';
import { OrgChartView } from './components/orgchart/OrgChartView';
import { DocumentVaultView } from './components/documents/DocumentVaultView';
import { DocumentPreviewModal } from './components/documents/DocumentPreviewModal';
import { UploadDocumentModal } from './components/documents/UploadDocumentModal';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Globe2, 
  UserPlus, 
  FileUp, 
  Download, 
  Zap, 
  Building2, 
  ChevronRight 
} from 'lucide-react';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(() => loadEmployees());
  const [documents, setDocuments] = useState<CorporateDocument[]>(() => loadDocuments());
  const [currentTab, setCurrentTab] = useState<'directory' | 'orgchart' | 'documents' | 'analytics'>('directory');
  const [currentRole, setCurrentRole] = useState<UserRole>('hr_admin');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Selections
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<CorporateDocument | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [orgChartFocusId, setOrgChartFocusId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist employee roster changes
  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees(prev => {
      const next = prev.map(e => (e.id === updated.id ? updated : e));
      saveEmployees(next);
      return next;
    });

    // If currently selected in modal, keep updated
    setSelectedEmployee(updated);

    showToast(`Updated profile for ${updated.firstName} ${updated.lastName}`);
  };

  // Onboard new employee
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees(prev => {
      const next = [newEmp, ...prev];
      saveEmployees(next);
      return next;
    });
    showToast(`Onboarded ${newEmp.firstName} ${newEmp.lastName} (${newEmp.id})`);
  };

  // Reassign manager from Org Chart or Modal
  const handleUpdateManager = (employeeId: string, newManagerId: string | null) => {
    setEmployees(prev => {
      const next = prev.map(e => e.id === employeeId ? { ...e, managerId: newManagerId } : e);
      saveEmployees(next);
      return next;
    });
    const target = employees.find(e => e.id === employeeId);
    showToast(`Reassigned reporting chain for ${target ? target.firstName : 'employee'}`);
  };

  // Ingest new document into vault
  const handleUploadDocument = (newDoc: CorporateDocument) => {
    setDocuments(prev => {
      const next = [newDoc, ...prev];
      saveDocuments(next);
      return next;
    });
    showToast(`Securely archived ${newDoc.title}`);
  };

  // Digital signature flow
  const handleSignDocument = (docId: string, signerName: string) => {
    const nowStr = new Date().toISOString().slice(0, 10);
    const nowTimeStr = new Date().toTimeString().slice(0, 5);

    setDocuments(prev => {
      const next = prev.map(d => {
        if (d.id === docId) {
          const updatedSigners = Array.from(new Set([...(d.signedBy || []), signerName]));
          const updatedLog = [
            {
              userName: signerName,
              role: currentRole === 'hr_admin' ? 'HR Executive' : currentRole === 'department_manager' ? 'VP Manager' : 'Employee',
              timestamp: `${nowStr} ${nowTimeStr}`,
              action: 'Signed' as const
            },
            ...d.accessLog
          ];

          return {
            ...d,
            signatureStatus: 'Signed & Verified' as const,
            signedBy: updatedSigners,
            accessLog: updatedLog
          };
        }
        return d;
      });

      saveDocuments(next);
      return next;
    });

    // Update selected modal doc in real time
    setSelectedDocument(prev => {
      if (prev && prev.id === docId) {
        return {
          ...prev,
          signatureStatus: 'Signed & Verified',
          signedBy: Array.from(new Set([...(prev.signedBy || []), signerName])),
          accessLog: [
            {
              userName: signerName,
              role: currentRole === 'hr_admin' ? 'HR Executive' : 'Employee',
              timestamp: `${nowStr} ${nowTimeStr}`,
              action: 'Signed' as const
            },
            ...prev.accessLog
          ]
        };
      }
      return prev;
    });

    showToast(`Electronically signed and verified by ${signerName}`);
  };

  const handleOpenOrgChartAt = (empId: string) => {
    setOrgChartFocusId(empId);
    setCurrentTab('orgchart');
    setSelectedEmployee(null);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all employee and document records to original corporate baseline?')) {
      const fresh = resetStorage();
      setEmployees(fresh.employees);
      setDocuments(fresh.documents);
      showToast('Reset system to default corporate baseline');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top 3-Zone Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
        onOpenUploadDoc={() => setIsUploadDocOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Corporate Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Corporate Command Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 p-6 sm:p-7 shadow-xl">
          {/* Ambient colorful background glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 w-96 h-96 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 -bottom-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-300 ring-1 ring-white/15">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>CODEX4 TECH LMT HRIS Platform</span>
                <span className="text-white/40">·</span>
                <span className="text-emerald-400 font-mono text-[11px]">System Online</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                Global Workforce Operations & Personnel Hub
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Real-time synchronized corporate directory, dynamic multi-tier organizational chart, and ISO/IEC 27001 verified document security vault.
              </p>

              {/* Colorful Live Indicator Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span><strong>{employees.length}</strong> Regular Personnel</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
                  <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>5 Global Hubs (SF · NYC · London · Tokyo · Remote)</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong>{documents.length}</strong> Secured Vault Records</span>
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => setIsAddEmployeeOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>Onboard New Personnel</span>
              </button>

              <button
                onClick={() => setIsUploadDocOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                <FileUp className="w-4 h-4" />
                <span>Deposit Vault Record</span>
              </button>

              <button
                onClick={() => exportEmployeesCsv(employees)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Export Master Directory (CSV)</span>
              </button>
            </div>
          </div>
        </div>

        {currentTab === 'directory' && (
          <DirectoryView
            employees={employees}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectEmployee={setSelectedEmployee}
            onOpenOrgChartAt={handleOpenOrgChartAt}
          />
        )}

        {currentTab === 'orgchart' && (
          <OrgChartView
            employees={employees}
            selectedEmployeeId={orgChartFocusId}
            onSelectEmployee={setSelectedEmployee}
            onUpdateManager={handleUpdateManager}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentVaultView
            documents={documents}
            employees={employees}
            currentRole={currentRole}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectDocument={setSelectedDocument}
            onOpenUploadModal={() => setIsUploadDocOpen(true)}
            onSignDocument={handleSignDocument}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            employees={employees}
            documents={documents}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-xs text-slate-500 transition-colors mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-display">
              CODEX4 TECH LMT
            </span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Directory & Secure Document Vault</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Reset state to pristine initial seed"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Corporate Data</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-400">
              ISO/IEC 27001 Certified
            </span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modals */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        allEmployees={employees}
        allDocuments={documents}
        currentRole={currentRole}
        onClose={() => setSelectedEmployee(null)}
        onUpdateEmployee={handleUpdateEmployee}
        onSelectEmployee={setSelectedEmployee}
        onOpenOrgChartAt={handleOpenOrgChartAt}
        onViewDocument={setSelectedDocument}
      />

      <AddEmployeeModal
        allEmployees={employees}
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAdd={handleAddEmployee}
      />

      <DocumentPreviewModal
        document={selectedDocument}
        currentRole={currentRole}
        onClose={() => setSelectedDocument(null)}
        onSignDocument={handleSignDocument}
      />

      <UploadDocumentModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        onUpload={handleUploadDocument}
        employees={employees}
        currentRole={currentRole}
      />
    </div>
  );
}
