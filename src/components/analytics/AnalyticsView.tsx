import React from 'react';
import { Employee, CorporateDocument } from '../../types';
import { exportEmployeesCsv } from '../../utils/storage';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Award, 
  MapPin, 
  Calendar, 
  FileCheck2, 
  Download, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AnalyticsViewProps {
  employees: Employee[];
  documents: CorporateDocument[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  employees,
  documents
}) => {
  // Compute analytics
  const totalEmployees = employees.length;

  // Department counts
  const deptCounts: Record<string, number> = {};
  employees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  // Workplace counts
  const officeCounts: Record<string, number> = {
    'In-Office': 0,
    Hybrid: 0,
    Remote: 0
  };
  employees.forEach(e => {
    officeCounts[e.officeType] = (officeCounts[e.officeType] || 0) + 1;
  });

  // People managers and average span of control
  const managers = employees.filter(e => employees.some(child => child.managerId === e.id));
  const totalDirectReports = employees.filter(e => e.managerId !== null).length;
  const avgSpanOfControl = managers.length > 0 ? (totalDirectReports / managers.length).toFixed(1) : '0';

  // Seniority distribution
  const seniorityCounts: Record<string, number> = {};
  employees.forEach(e => {
    seniorityCounts[e.roleLevel] = (seniorityCounts[e.roleLevel] || 0) + 1;
  });

  // Upcoming tenure milestones
  const tenureList = employees.map(emp => {
    const start = new Date(emp.startDate);
    const now = new Date('2026-11-06');
    const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return {
      emp,
      years: parseFloat(years.toFixed(1)),
      startYear: start.getFullYear()
    };
  }).sort((a, b) => b.years - a.years);

  return (
    <div className="space-y-6">
      {/* Top Headline Strip & Export */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
            CODEX4 TECH LMT Workforce Intelligence & Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time organizational headcount distribution, retention health, and span-of-control metrics.
          </p>
        </div>

        <button
          onClick={() => exportEmployeesCsv(employees)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-white dark:to-slate-900 p-4 sm:p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-indigo-900 dark:text-indigo-300">Total Regular Headcount</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
            {totalEmployees}
          </p>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            100% full-time roster
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-white dark:to-slate-900 p-4 sm:p-5 rounded-2xl border border-sky-200 dark:border-sky-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-sky-900 dark:text-sky-300">People Managers</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
            {managers.length}
          </p>
          <div className="text-[11px] text-sky-700 dark:text-sky-300 mt-1 font-medium">
            Avg {avgSpanOfControl} reports per lead
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:to-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300">Annual Retention Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
            97.4%
          </p>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            +3.2% vs. tech baseline
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:to-slate-900 p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-amber-900 dark:text-amber-300">Secured Vault Records</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
            {documents.length}
          </p>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 mt-1 font-medium">
            {documents.filter(d => d.signatureStatus === 'Signed & Verified').length} signed & verified
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Headcount Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Headcount by Department
          </h3>
          <div className="space-y-3">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / totalEmployees) * 100);
              const barColor = 
                dept === 'Executive' ? 'bg-violet-600' :
                dept === 'Engineering' ? 'bg-blue-600' :
                dept === 'Product & Design' ? 'bg-emerald-600' :
                dept === 'People & Culture' ? 'bg-amber-500' :
                dept === 'Finance & Legal' ? 'bg-indigo-600' : 'bg-slate-600';

              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {dept}
                    </span>
                    <span className="font-mono tabular-nums text-slate-500 font-medium">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`${barColor} h-full rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workplace Distribution */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Workplace Model & Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(officeCounts).map(([type, count]) => {
              const pct = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {type}
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {count} employees ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        type === 'Hybrid'
                          ? 'bg-blue-600'
                          : type === 'In-Office'
                          ? 'bg-emerald-600'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Corporate policy supports flexible hybrid arrangements across HQ hubs (San Francisco & New York) with high-trust distributed teams in London and Tokyo.
          </div>
        </div>
      </div>

      {/* Global Office Hubs Grid */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Global Office Hubs & Regional Footprint
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Active personnel stationed across enterprise headquarters, regional offices, and remote hubs
            </p>
          </div>
          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
            5 Active Nodes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:to-slate-900 shadow-2xs">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Global HQ</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">San Francisco</p>
            <p className="text-xl font-extrabold font-display text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
              {employees.filter(e => e.location.includes('San Francisco')).length}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">California, US</span>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-white dark:to-slate-900 shadow-2xs">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">East Coast Hub</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">New York City</p>
            <p className="text-xl font-extrabold font-display text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
              {employees.filter(e => e.location.includes('New York')).length}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">New York, US</span>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-white dark:to-slate-900 shadow-2xs">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">EMEA Gateway</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">London</p>
            <p className="text-xl font-extrabold font-display text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
              {employees.filter(e => e.location.includes('London')).length}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">United Kingdom</span>
          </div>

          <div className="p-3.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-white dark:to-slate-900 shadow-2xs">
            <span className="text-[10px] font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider block">APAC Center</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Tokyo</p>
            <p className="text-xl font-extrabold font-display text-pink-600 dark:text-pink-400 mt-1 tabular-nums">
              {employees.filter(e => e.location.includes('Tokyo')).length}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Japan</span>
          </div>

          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-white dark:to-slate-900 shadow-2xs">
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">Distributed</span>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Remote Global</p>
            <p className="text-xl font-extrabold font-display text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
              {employees.filter(e => e.location.includes('Remote')).length}
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Global Talent</span>
          </div>
        </div>
      </div>

      {/* Tenure Highlights */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Founding Tenures & Milestone Anniversaries
          </h3>
          <span className="text-[11px] text-slate-400">
            Sorted by earliest hire date
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tenureList.slice(0, 6).map(({ emp, years, startYear }) => (
            <div
              key={emp.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {emp.firstName} {emp.lastName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {emp.title}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {years} yrs
                </span>
                <span className="block text-[10px] text-slate-400">
                  Since {startYear}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
