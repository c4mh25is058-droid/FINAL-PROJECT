import React, { useState, useMemo } from 'react';
import { Employee, Department, OfficeType, EmploymentStatus } from '../../types';
import { Avatar } from '../common/Avatar';
import { exportEmployeesCsv } from '../../utils/storage';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Download, 
  MapPin, 
  GitFork, 
  Mail, 
  Filter, 
  ArrowUpDown, 
  Building,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface DirectoryViewProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectEmployee: (emp: Employee) => void;
  onOpenOrgChartAt: (empId: string) => void;
}

const DEPARTMENTS: (Department | 'All')[] = [
  'All',
  'Executive',
  'Engineering',
  'Product & Design',
  'People & Culture',
  'Finance & Legal'
];

const DEPT_ACTIVE_COLORS: Record<string, string> = {
  All: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900',
  Executive: 'bg-violet-600 text-white shadow-sm shadow-violet-500/20',
  Engineering: 'bg-blue-600 text-white shadow-sm shadow-blue-500/20',
  'Product & Design': 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20',
  'People & Culture': 'bg-amber-600 text-white shadow-sm shadow-amber-500/20',
  'Finance & Legal': 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
};

const DEPT_CARD_GRADIENTS: Record<string, string> = {
  Executive: 'from-violet-500 to-indigo-600',
  Engineering: 'from-blue-500 to-cyan-500',
  'Product & Design': 'from-emerald-500 to-teal-500',
  'People & Culture': 'from-amber-500 to-rose-500',
  'Finance & Legal': 'from-indigo-500 to-blue-700',
  'Sales & Growth': 'from-rose-500 to-pink-500',
  Operations: 'from-teal-500 to-sky-600'
};

const DEPT_PILL_STYLES: Record<string, string> = {
  Executive: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  Engineering: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Product & Design': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'People & Culture': 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Finance & Legal': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'Sales & Growth': 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Operations: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800'
};

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  onSelectEmployee,
  onOpenOrgChartAt
}) => {
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState<OfficeType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<EmploymentStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'dept' | 'tenure' | 'level'>('name');

  // Filter & Search Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Dept filter
      if (selectedDept !== 'All' && emp.department !== selectedDept) return false;
      // Workplace filter
      if (selectedWorkplace !== 'All' && emp.officeType !== selectedWorkplace) return false;
      // Status filter
      if (selectedStatus !== 'All' && emp.status !== selectedStatus) return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q);
        const matchesTitle = emp.title.toLowerCase().includes(q);
        const matchesEmail = emp.email.toLowerCase().includes(q);
        const matchesLocation = emp.location.toLowerCase().includes(q);
        const matchesSkill = emp.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesEmail && !matchesLocation && !matchesSkill) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.lastName.localeCompare(b.lastName);
      } else if (sortBy === 'dept') {
        return a.department.localeCompare(b.department);
      } else if (sortBy === 'tenure') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (sortBy === 'level') {
        return a.roleLevel.localeCompare(b.roleLevel);
      }
      return 0;
    });
  }, [employees, selectedDept, selectedWorkplace, selectedStatus, searchQuery, sortBy]);

  // Direct reports lookup for badges
  const reportsCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const emp of employees) {
      if (emp.managerId) {
        map.set(emp.managerId, (map.get(emp.managerId) || 0) + 1);
      }
    }
    return map;
  }, [employees]);

  return (
    <div className="space-y-6">
      {/* Top Filter and Viewport Toolbar */}
      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Department Segmented Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DEPARTMENTS.map(dept => {
            const count = dept === 'All' 
              ? employees.length 
              : employees.filter(e => e.department === dept).length;
            const activeColorClass = DEPT_ACTIVE_COLORS[dept] || 'bg-slate-900 text-white';

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? `${activeColorClass} shadow-xs scale-[1.02]`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70'
                }`}
              >
                <span>{dept === 'All' ? 'All Departments' : dept}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  selectedDept === dept
                    ? 'bg-black/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Multi-Filter & Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, role, skill..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Workplace Select */}
            <select
              value={selectedWorkplace}
              onChange={e => setSelectedWorkplace(e.target.value as OfficeType | 'All')}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Locations & Workplaces</option>
              <option value="In-Office">In-Office Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as EmploymentStatus | 'All')}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2 py-1.5 text-xs bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
              >
                <option value="name">Sort by Last Name</option>
                <option value="dept">Sort by Department</option>
                <option value="tenure">Sort by Tenure (Earliest)</option>
                <option value="level">Sort by Seniority</option>
              </select>
            </div>
          </div>

          {/* View toggle and export */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportEmployeesCsv(employees)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Download directory roster as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="High-Density Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Metric Count Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{filteredEmployees.length}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{employees.length}</strong> employees
        </span>
        <span className="hidden sm:inline">
          Click any card to open profile dossier & live edit mode
        </span>
      </div>

      {/* View Content: Grid or High-Density Table */}
      {filteredEmployees.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            No employees match the specified criteria
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Try adjusting your search terms, department selection, or location filter.
          </p>
          <button
            onClick={() => {
              setSelectedDept('All');
              setSelectedWorkplace('All');
              setSelectedStatus('All');
              onSearchChange('');
            }}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => {
            const reportsCount = reportsCountMap.get(emp.id) || 0;
            const manager = employees.find(e => e.id === emp.managerId);

            return (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 hover:border-indigo-400/80 dark:hover:border-indigo-600/80 transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden"
              >
                {/* Department Color Accent Line */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${DEPT_CARD_GRADIENTS[emp.department] || 'from-indigo-500 to-blue-500'} -mt-5 -mx-5 mb-4 rounded-t-2xl shrink-0`} />

                <div>
                  {/* Card Header: Avatar & Core Identifiers */}
                  <div className="flex items-start gap-3.5">
                    <Avatar
                      src={emp.avatar}
                      firstName={emp.firstName}
                      lastName={emp.lastName}
                      department={emp.department}
                      status={emp.status}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {emp.firstName} {emp.lastName}
                        </h3>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0">
                          {emp.id}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                        {emp.title}
                      </p>
                      {/* Department & Office metadata */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${DEPT_PILL_STYLES[emp.department] || 'bg-slate-100'}`}>
                          {emp.department}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{emp.officeType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1 mt-3.5">
                    {emp.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {emp.skills.length > 3 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 text-slate-400">
                        +{emp.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Location, Manager & Org Chart Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[170px]" title={emp.location}>
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.location}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {reportsCount > 0 && (
                      <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                        {reportsCount} reports
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrgChartAt(emp.id);
                      }}
                      title="View position in Org Chart"
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <GitFork className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Data Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Title & Level</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Direct Manager</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Tenure</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map(emp => {
                  const manager = employees.find(e => e.id === emp.managerId);
                  const reportsCount = reportsCountMap.get(emp.id) || 0;

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={emp.avatar}
                            firstName={emp.firstName}
                            lastName={emp.lastName}
                            department={emp.department}
                            size="sm"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <span className="font-mono text-[10px] text-slate-400">
                              {emp.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {emp.title}
                        </p>
                        <span className="text-[11px] text-slate-400">
                          {emp.roleLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${DEPT_PILL_STYLES[emp.department] || 'bg-slate-100 text-slate-700'}`}>
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {manager ? (
                          <div className="text-[11px]">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {manager.firstName} {manager.lastName}
                            </span>
                            <span className="block text-slate-400 text-[10px]">
                              {manager.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Board of Directors</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {emp.location} ({emp.officeType})
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {emp.startDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenOrgChartAt(emp.id);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                          title="View in Org Chart"
                        >
                          Trace Org
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
