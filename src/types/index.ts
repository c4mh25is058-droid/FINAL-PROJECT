export type Department = 
  | 'Executive'
  | 'Engineering'
  | 'Product & Design'
  | 'People & Culture'
  | 'Finance & Legal'
  | 'Sales & Growth'
  | 'Operations';

export type RoleLevel =
  | 'C-Level'
  | 'VP'
  | 'Director'
  | 'Manager / Lead'
  | 'Staff / Principal'
  | 'Senior IC'
  | 'Associate';

export type EmploymentStatus = 'Active' | 'On Leave' | 'Probation' | 'Notice Period';

export type OfficeType = 'In-Office' | 'Hybrid' | 'Remote';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  avatar: string;
  email: string;
  phone: string;
  title: string;
  department: Department;
  roleLevel: RoleLevel;
  managerId: string | null;
  location: string;
  officeType: OfficeType;
  status: EmploymentStatus;
  startDate: string;
  bio: string;
  skills: string[];
  emergencyContact: EmergencyContact;
  compensationBand: string;
  timeZone: string;
  slack: string;
  pronouns: string;
}

export type DocumentCategory = 
  | 'Contracts & Agreements'
  | 'Policy & Compliance'
  | 'Performance & Comp'
  | 'Tax & Legal'
  | 'Benefits & Insurance';

export type DocumentClassification =
  | 'Public / Company'
  | 'Department'
  | 'Manager / Confidential'
  | 'Strictly Restricted HR';

export type SignatureStatus = 
  | 'Signed & Verified'
  | 'Pending Signature'
  | 'Not Required'
  | 'Awaiting Counter-Sign';

export interface AccessLogEntry {
  userName: string;
  role: string;
  timestamp: string;
  action: 'Viewed' | 'Downloaded' | 'Signed' | 'Updated';
}

export interface CorporateDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  classification: DocumentClassification;
  employeeId?: string | null;
  employeeName?: string;
  department?: Department | 'All Departments';
  uploadedAt: string;
  fileSize: string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX';
  version: string;
  signatureStatus: SignatureStatus;
  signedBy?: string[];
  lastAccessed: string;
  accessLog: AccessLogEntry[];
  summary: string;
  previewBody: string;
}

export type UserRole = 'hr_admin' | 'department_manager' | 'employee';

export interface RoleProfile {
  id: UserRole;
  name: string;
  title: string;
  department: Department;
  avatar: string;
  description: string;
}
