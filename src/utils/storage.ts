import { Employee, CorporateDocument } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_DOCUMENTS } from '../data/initialData';

const EMPLOYEES_STORAGE_KEY = 'codex4_tech_employees_v2';
const DOCUMENTS_STORAGE_KEY = 'codex4_tech_documents_v2';

export function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading employees from localStorage', e);
  }
  return INITIAL_EMPLOYEES;
}

export function saveEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error('Error saving employees to localStorage', e);
  }
}

export function loadDocuments(): CorporateDocument[] {
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading documents from localStorage', e);
  }
  return INITIAL_DOCUMENTS;
}

export function saveDocuments(docs: CorporateDocument[]): void {
  try {
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Error saving documents to localStorage', e);
  }
}

export function resetStorage(): { employees: Employee[]; documents: CorporateDocument[] } {
  localStorage.removeItem(EMPLOYEES_STORAGE_KEY);
  localStorage.removeItem(DOCUMENTS_STORAGE_KEY);
  return {
    employees: INITIAL_EMPLOYEES,
    documents: INITIAL_DOCUMENTS,
  };
}

export function getDirectReports(managerId: string, employees: Employee[]): Employee[] {
  return employees.filter((emp) => emp.managerId === managerId);
}

export function getReportingChain(employeeId: string, employees: Employee[]): Employee[] {
  const chain: Employee[] = [];
  let current = employees.find((e) => e.id === employeeId);
  const visited = new Set<string>();

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    chain.unshift(current);
    if (!current.managerId) break;
    current = employees.find((e) => e.id === current?.managerId);
  }
  return chain;
}

export function getAllSubordinatesCount(managerId: string, employees: Employee[]): number {
  let count = 0;
  const queue = [managerId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const directReports = employees.filter((e) => e.managerId === currentId);
    count += directReports.length;
    for (const report of directReports) {
      queue.push(report.id);
    }
  }
  return count;
}

export function exportEmployeesCsv(employees: Employee[]): void {
  const headers = [
    'Employee ID',
    'First Name',
    'Last Name',
    'Title',
    'Department',
    'Role Level',
    'Email',
    'Phone',
    'Location',
    'Workplace Type',
    'Status',
    'Start Date',
    'Manager ID',
    'Compensation Band',
    'Timezone'
  ];

  const rows = employees.map(e => [
    `"${e.id}"`,
    `"${e.firstName}"`,
    `"${e.lastName}"`,
    `"${e.title.replace(/"/g, '""')}"`,
    `"${e.department}"`,
    `"${e.roleLevel}"`,
    `"${e.email}"`,
    `"${e.phone}"`,
    `"${e.location}"`,
    `"${e.officeType}"`,
    `"${e.status}"`,
    `"${e.startDate}"`,
    `"${e.managerId || 'N/A'}"`,
    `"${e.compensationBand}"`,
    `"${e.timeZone}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `codex4_tech_lmt_directory_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
