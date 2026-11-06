import React, { useState, useMemo } from 'react';
import { Employee, Department } from '../../types';
import { Avatar } from '../common/Avatar';
import { 
  GitFork, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowRight, 
  Layers, 
  UserCheck,
  Building,
  Edit2
} from 'lucide-react';

interface OrgChartViewProps {
  employees: Employee[];
  selectedEmployeeId?: string | null;
  onSelectEmployee: (emp: Employee) => void;
  onUpdateManager: (employeeId: string, newManagerId: string | null) => void;
}

interface TreeNode {
  employee: Employee;
  children: TreeNode[];
}

export const OrgChartView: React.FC<OrgChartViewProps> = ({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onUpdateManager
}) => {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [focusedDept, setFocusedDept] = useState<Department | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(selectedEmployeeId || null);
  const [reassignModalTarget, setReassignModalTarget] = useState<Employee | null>(null);
  const [newManagerSelectId, setNewManagerSelectId] = useState<string>('');

  // Build recursive tree from employee list
  const rootNode = useMemo(() => {
    const employeeMap = new Map<string, Employee>();
    const childrenMap = new Map<string, Employee[]>();

    employees.forEach(emp => {
      employeeMap.set(emp.id, emp);
      const mId = emp.managerId || '__ROOT__';
      if (!childrenMap.has(mId)) {
        childrenMap.set(mId, []);
      }
      childrenMap.get(mId)!.push(emp);
    });

    const buildSubtree = (emp: Employee): TreeNode => {
      const rawChildren = childrenMap.get(emp.id) || [];
      // Filter if department focus is set (apply to top branch children)
      const filteredChildren = focusedDept === 'All' 
        ? rawChildren 
        : rawChildren.filter(c => c.department === focusedDept || emp.managerId === null);

      return {
        employee: emp,
        children: filteredChildren.map(buildSubtree)
      };
    };

    const topLeaders = childrenMap.get('__ROOT__') || [];
    if (topLeaders.length === 0 && employees.length > 0) {
      return buildSubtree(employees[0]);
    }
    return topLeaders[0] ? buildSubtree(topLeaders[0]) : null;
  }, [employees, focusedDept]);

  // Compute reporting chain path for active highlight
  const highlightPathSet = useMemo(() => {
    const path = new Set<string>();
    if (!activeHighlightId) return path;

    let curr: Employee | undefined = employees.find(e => e.id === activeHighlightId);
    while (curr) {
      path.add(curr.id);
      if (!curr.managerId) break;
      curr = employees.find(e => e.id === curr?.managerId);
    }
    return path;
  }, [activeHighlightId, employees]);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => setCollapsedNodes(new Set());
  const handleCollapseAll = () => {
    const allManagerIds = new Set(employees.filter(e => employees.some(child => child.managerId === e.id)).map(e => e.id));
    setCollapsedNodes(allManagerIds);
  };

  const handleOpenReassign = (emp: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setReassignModalTarget(emp);
    setNewManagerSelectId(emp.managerId || '');
  };

  const handleConfirmReassign = () => {
    if (reassignModalTarget) {
      onUpdateManager(reassignModalTarget.id, newManagerSelectId || null);
      setReassignModalTarget(null);
    }
  };

  // Department Colors for Tree Nodes
  const DEPT_TREE_GRADIENTS: Record<string, string> = {
    Executive: 'from-violet-500 to-indigo-600',
    Engineering: 'from-blue-500 to-cyan-500',
    'Product & Design': 'from-emerald-500 to-teal-500',
    'People & Culture': 'from-amber-500 to-rose-500',
    'Finance & Legal': 'from-indigo-500 to-blue-700',
    'Sales & Growth': 'from-rose-500 to-pink-500',
    Operations: 'from-teal-500 to-sky-600'
  };

  const DEPT_TREE_PILLS: Record<string, string> = {
    Executive: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    Engineering: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'Product & Design': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'People & Culture': 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'Finance & Legal': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    'Sales & Growth': 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    Operations: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800'
  };

  // Render recursive tree node
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const { employee, children } = node;
    const isCollapsed = collapsedNodes.has(employee.id);
    const hasChildren = children.length > 0;
    const isHighlighted = highlightPathSet.has(employee.id);
    const isTarget = activeHighlightId === employee.id;

    // Search query match
    const matchesSearch = searchQuery.trim() && (
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deptGrad = DEPT_TREE_GRADIENTS[employee.department] || 'from-indigo-500 to-blue-600';
    const deptPill = DEPT_TREE_PILLS[employee.department] || 'bg-slate-100 text-slate-700';

    return (
      <div key={employee.id} className="flex flex-col items-center">
        {/* The Card Node */}
        <div
          onClick={() => {
            setActiveHighlightId(employee.id);
            onSelectEmployee(employee);
          }}
          className={`relative group bg-white dark:bg-slate-900 rounded-xl p-3.5 border transition-all cursor-pointer shadow-2xs hover:shadow-md w-64 overflow-hidden ${
            isTarget
              ? 'border-indigo-600 ring-2 ring-indigo-500/40 dark:ring-indigo-400/40'
              : isHighlighted
              ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
              : matchesSearch
              ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          {/* Top departmental accent stripe */}
          <div className={`h-1 w-full bg-gradient-to-r ${deptGrad} -mt-3.5 -mx-3.5 mb-3`} />

          {/* Node Content */}
          <div className="flex items-start gap-3">
            <Avatar
              src={employee.avatar}
              firstName={employee.firstName}
              lastName={employee.lastName}
              department={employee.department}
              status={employee.status}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {employee.firstName} {employee.lastName}
                </p>
                <span className="font-mono text-[9px] text-slate-400">
                  {employee.id}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5">
                {employee.title}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                <span className={`px-1.5 py-0.2 rounded font-semibold border ${deptPill}`}>
                  {employee.department}
                </span>
                <span aria-hidden="true">·</span>
                <span>{employee.location.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {/* Quick Manager Reassignment affordance */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <button
              onClick={(e) => handleOpenReassign(employee, e)}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
              title="Reassign direct manager"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>Change Manager</span>
            </button>

            {hasChildren && (
              <span className="font-mono text-[10px] font-medium text-slate-500">
                {children.length} direct report{children.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Expand / Collapse toggle pill at bottom of card */}
          {hasChildren && (
            <button
              onClick={(e) => toggleCollapse(employee.id, e)}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
              title={isCollapsed ? 'Expand branch' : 'Collapse branch'}
            >
              {isCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Tree Branch Connectors and Children */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center">
            {/* Vertical connector down from parent */}
            <div className={`w-0.5 h-8 transition-colors ${
              isHighlighted ? 'bg-indigo-500 shadow-xs shadow-indigo-500/50' : 'bg-slate-300 dark:bg-slate-700'
            }`} />

            {/* Horizontal line across children */}
            <div className="flex relative pt-2">
              {children.map((child, index) => {
                const isOnly = children.length === 1;
                const isFirst = index === 0;
                const isLast = index === children.length - 1;
                const isChildHighlighted = highlightPathSet.has(child.employee.id);

                return (
                  <div key={child.employee.id} className="flex flex-col items-center px-4 relative">
                    {/* Top horizontal connector segment */}
                    {!isOnly && (
                      <div
                        className={`absolute top-0 h-0.5 transition-colors ${
                          isChildHighlighted ? 'bg-indigo-500 shadow-xs shadow-indigo-500/50' : 'bg-slate-300 dark:bg-slate-700'
                        } ${
                          isFirst
                            ? 'left-1/2 right-0'
                            : isLast
                            ? 'left-0 right-1/2'
                            : 'left-0 right-0'
                        }`}
                      />
                    )}
                    {/* Vertical connector drop into child */}
                    <div className={`w-0.5 h-6 transition-colors ${
                      isChildHighlighted ? 'bg-indigo-500 shadow-xs shadow-indigo-500/50' : 'bg-slate-300 dark:bg-slate-700'
                    }`} />
                    {renderNode(child, depth + 1)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Breadcrumb chain for active highlighted employee
  const selectedChain = useMemo(() => {
    if (!activeHighlightId) return [];
    const chain: Employee[] = [];
    let curr: Employee | undefined = employees.find(e => e.id === activeHighlightId);
    while (curr) {
      chain.unshift(curr);
      if (!curr.managerId) break;
      curr = employees.find(e => e.id === curr?.managerId);
    }
    return chain;
  }, [activeHighlightId, employees]);

  return (
    <div className="space-y-4">
      {/* Org Chart Controls Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Focus Select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Branch Focus:</span>
            <select
              value={focusedDept}
              onChange={e => setFocusedDept(e.target.value as any)}
              className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="All">Complete Enterprise Tree</option>
              <option value="Engineering">Engineering Branch</option>
              <option value="People & Culture">People & Culture Branch</option>
              <option value="Product & Design">Product & Design Branch</option>
              <option value="Finance & Legal">Finance & Legal Branch</option>
            </select>
          </div>

          {/* Quick Node Search */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Find person in tree..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Viewport Zoom & Tree Expansion Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Collapse All
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 10, 60))}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-slate-500 w-10 text-center tabular-nums">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 10, 130))}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reporting Chain Breadcrumb Bar */}
      {selectedChain.length > 0 && (
        <div className="px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs overflow-x-auto scrollbar-none">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider shrink-0">
            Reporting Chain:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {selectedChain.map((member, idx) => (
              <React.Fragment key={member.id}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                <button
                  onClick={() => {
                    setActiveHighlightId(member.id);
                    onSelectEmployee(member);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    member.id === activeHighlightId
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {member.firstName} {member.lastName}
                  <span className="text-[10px] opacity-75 ml-1">({member.title.split(' ')[0]})</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Org Chart Canvas */}
      <div className="bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:24px_24px] bg-slate-50/70 dark:bg-slate-950/70 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 min-h-[580px] overflow-auto flex justify-center items-start relative shadow-inner">
        {rootNode ? (
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="pb-16"
          >
            {renderNode(rootNode)}
          </div>
        ) : (
          <div className="text-center p-12 text-slate-500 text-xs">
            No organizational hierarchy found.
          </div>
        )}
      </div>

      {/* Reassign Manager Modal */}
      {reassignModalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Reassign Reporting Hierarchy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose a new manager for <strong className="text-slate-800 dark:text-slate-200">{reassignModalTarget.firstName} {reassignModalTarget.lastName}</strong> ({reassignModalTarget.title}). The tree will immediately reorganize.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                New Direct Manager
              </label>
              <select
                value={newManagerSelectId}
                onChange={e => setNewManagerSelectId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="">None (Top Executive / Board)</option>
                {employees
                  .filter(e => e.id !== reassignModalTarget.id)
                  .map(m => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} — {m.title} ({m.department})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReassignModalTarget(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReassign}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
              >
                Update Reporting Chain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
