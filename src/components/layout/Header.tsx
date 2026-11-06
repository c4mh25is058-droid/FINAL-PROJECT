import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ROLE_PROFILES } from '../../data/initialData';
import { 
  Building2, 
  Users, 
  GitFork, 
  FileLock2, 
  BarChart3, 
  Sun, 
  Moon, 
  UserCheck, 
  Plus, 
  Search,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'directory' | 'orgchart' | 'documents' | 'analytics';
  onSelectTab: (tab: 'directory' | 'orgchart' | 'documents' | 'analytics') => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddEmployee: () => void;
  onOpenUploadDoc: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  onChangeRole,
  darkMode,
  onToggleDarkMode,
  onOpenAddEmployee,
  onOpenUploadDoc,
  searchQuery,
  onSearchChange
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const activeProfile = ROLE_PROFILES[currentRole];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Vibrant Corporate Gradient Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 via-purple-500 to-emerald-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-bold font-display shadow-md shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
                CODEX4 TECH LMT
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase -mt-0.5">
                Enterprise HRIS & Directory
              </span>
            </div>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => onSelectTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'directory'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-2xs ring-1 ring-blue-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Users className={`w-4 h-4 ${currentTab === 'directory' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              <span>Directory</span>
            </button>

            <button
              onClick={() => onSelectTab('orgchart')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'orgchart'
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 shadow-2xs ring-1 ring-purple-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <GitFork className={`w-4 h-4 ${currentTab === 'orgchart' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
              <span>Org Chart</span>
            </button>

            <button
              onClick={() => onSelectTab('documents')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'documents'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 shadow-2xs ring-1 ring-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FileLock2 className={`w-4 h-4 ${currentTab === 'documents' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span>Document Vault</span>
            </button>

            <button
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentTab === 'analytics'
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 shadow-2xs ring-1 ring-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${currentTab === 'analytics' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
              <span>HR Analytics</span>
            </button>
          </nav>

          {/* Zone 3: Corporate Action & Role Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Live Search Bar */}
            <div className="relative hidden xl:block w-52">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search roster or doc..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Role Simulation Switcher dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-2xs"
                title="Simulate enterprise role permissions"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="hidden sm:inline font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  Role:
                </span>
                <span className="font-semibold truncate max-w-[110px] sm:max-w-none">
                  {currentRole === 'hr_admin'
                    ? 'HR Director'
                    : currentRole === 'department_manager'
                    ? 'VP Eng Manager'
                    : 'Employee'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setRoleMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-40 p-2 text-xs">
                    <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Simulate Role Access
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Test document security & compensation visibility
                      </p>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onChangeRole('hr_admin');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                          currentRole === 'hr_admin'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold">HR Executive (Admin)</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Full clearance: view & edit all compensation, confidential docs, and team hierarchy.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onChangeRole('department_manager');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                          currentRole === 'department_manager'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold">Department Manager (VP)</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Marcus Vance: team member oversight, departmental evaluations, restricted company-wide access.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onChangeRole('employee');
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                          currentRole === 'employee'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Users className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold">Individual Employee</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            Carlos Mendez: personal profile updates, personal docs, company policies. Confidential records locked.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            {currentTab === 'documents' ? (
              <button
                onClick={onOpenUploadDoc}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Doc</span>
              </button>
            ) : (
              <button
                onClick={onOpenAddEmployee}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Employee</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => onSelectTab('directory')}
            className={`px-3 py-1.5 font-medium rounded-md ${
              currentTab === 'directory'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => onSelectTab('orgchart')}
            className={`px-3 py-1.5 font-medium rounded-md ${
              currentTab === 'orgchart'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Org Chart
          </button>
          <button
            onClick={() => onSelectTab('documents')}
            className={`px-3 py-1.5 font-medium rounded-md ${
              currentTab === 'documents'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Docs
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`px-3 py-1.5 font-medium rounded-md ${
              currentTab === 'analytics'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
