import { Employee, CorporateDocument, RoleProfile } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-1001',
    firstName: 'Elena',
    lastName: 'Rostova',
    avatar: '/src/assets/images/avatar_ceo_elena_1793956014962.jpg',
    email: 'elena.rostova@codex4tech.com',
    phone: '+1 (415) 890-2100',
    title: 'Chief Executive Officer & Board Member',
    department: 'Executive',
    roleLevel: 'C-Level',
    managerId: null,
    location: 'San Francisco, CA (HQ)',
    officeType: 'In-Office',
    status: 'Active',
    startDate: '2019-01-15',
    bio: 'Former VP of Operations at Global Scale Inc. Leading CODEX4 TECH LMT through global enterprise expansion and AI-first workforce transformation.',
    skills: ['Executive Leadership', 'Corporate Governance', 'Capital Allocation', 'M&A Strategy', 'Organizational Scaling'],
    emergencyContact: {
      name: 'Alexander Rostov',
      relation: 'Spouse',
      phone: '+1 (415) 890-2101'
    },
    compensationBand: 'Grade E-10 (Executive)',
    timeZone: 'PST (UTC-8)',
    slack: '@elena',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1002',
    firstName: 'Marcus',
    lastName: 'Vance',
    avatar: '/src/assets/images/avatar_vp_marcus_1793956016276.jpg',
    email: 'marcus.vance@codex4tech.com',
    phone: '+1 (415) 890-2144',
    title: 'VP of Engineering',
    department: 'Engineering',
    roleLevel: 'VP',
    managerId: 'EMP-1001',
    location: 'San Francisco, CA (HQ)',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2019-08-01',
    bio: 'Oversees global engineering, cloud infrastructure, and technical architecture. Advocate for developer productivity and resilient distributed systems.',
    skills: ['Distributed Systems', 'Cloud Architecture', 'Engineering Management', 'Kubernetes', 'Cybersecurity'],
    emergencyContact: {
      name: 'Clara Vance',
      relation: 'Partner',
      phone: '+1 (415) 890-2149'
    },
    compensationBand: 'Grade E-8 (VP)',
    timeZone: 'PST (UTC-8)',
    slack: '@mvance',
    pronouns: 'he/him'
  },
  {
    id: 'EMP-1003',
    firstName: 'Priya',
    lastName: 'Sharma',
    avatar: '/src/assets/images/avatar_director_priya_1793956017190.jpg',
    email: 'priya.sharma@codex4tech.com',
    phone: '+1 (415) 890-2180',
    title: 'VP of People & Culture',
    department: 'People & Culture',
    roleLevel: 'VP',
    managerId: 'EMP-1001',
    location: 'New York, NY',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2020-03-10',
    bio: 'Championing high-trust organizational design, modern compensation frameworks, leadership coaching, and inclusive global culture.',
    skills: ['Talent Strategy', 'Compensation & Benefits', 'Executive Coaching', 'Labor Compliance', 'Employee Relations'],
    emergencyContact: {
      name: 'Rohan Sharma',
      relation: 'Spouse',
      phone: '+1 (212) 555-0182'
    },
    compensationBand: 'Grade E-8 (VP)',
    timeZone: 'EST (UTC-5)',
    slack: '@priya.sharma',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1004',
    firstName: 'David',
    lastName: 'Tanaka',
    avatar: '/src/assets/images/avatar_lead_david_1793956019120.jpg',
    email: 'david.tanaka@codex4tech.com',
    phone: '+1 (415) 890-2210',
    title: 'Director of Product & Design',
    department: 'Product & Design',
    roleLevel: 'Director',
    managerId: 'EMP-1001',
    location: 'San Francisco, CA (HQ)',
    officeType: 'In-Office',
    status: 'Active',
    startDate: '2020-11-15',
    bio: 'Leads product design and enterprise UX direction. Passionate about ergonomics, human-centered systems, and cross-functional design systems.',
    skills: ['Design Systems', 'Product Strategy', 'Information Architecture', 'User Research', 'Design Leadership'],
    emergencyContact: {
      name: 'Kenji Tanaka',
      relation: 'Brother',
      phone: '+1 (415) 890-2219'
    },
    compensationBand: 'Grade D-7 (Director)',
    timeZone: 'PST (UTC-8)',
    slack: '@dtanaka',
    pronouns: 'he/him'
  },
  {
    id: 'EMP-1005',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    avatar: '',
    email: 'sarah.jenkins@codex4tech.com',
    phone: '+1 (415) 890-2305',
    title: 'Director of Platform Infrastructure',
    department: 'Engineering',
    roleLevel: 'Director',
    managerId: 'EMP-1002',
    location: 'San Francisco, CA (HQ)',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2021-02-01',
    bio: 'Responsible for 99.99% uptime SLA, multi-region database replication, platform reliability, and SOC 2 Type II compliance.',
    skills: ['Cloud Infrastructure', 'Site Reliability', 'Terraform', 'PostgreSQL', 'Infra Observability'],
    emergencyContact: {
      name: 'Timothy Jenkins',
      relation: 'Spouse',
      phone: '+1 (415) 890-2309'
    },
    compensationBand: 'Grade D-7 (Director)',
    timeZone: 'PST (UTC-8)',
    slack: '@sjenkins',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1006',
    firstName: 'Alex',
    lastName: 'Rivera',
    avatar: '',
    email: 'alex.rivera@codex4tech.com',
    phone: '+1 (415) 890-2311',
    title: 'Director of Product Engineering',
    department: 'Engineering',
    roleLevel: 'Director',
    managerId: 'EMP-1002',
    location: 'New York, NY',
    officeType: 'In-Office',
    status: 'Active',
    startDate: '2021-06-15',
    bio: 'Directs application engineering squads across enterprise workflows, integrations, and core portal capabilities.',
    skills: ['React & Node.js', 'API Design', 'Sprint Governance', 'Microservices', 'Engineering Hiring'],
    emergencyContact: {
      name: 'Maria Rivera',
      relation: 'Sister',
      phone: '+1 (212) 555-0143'
    },
    compensationBand: 'Grade D-7 (Director)',
    timeZone: 'EST (UTC-5)',
    slack: '@arivera',
    pronouns: 'they/them'
  },
  {
    id: 'EMP-1007',
    firstName: 'Jordan',
    lastName: 'Taylor',
    avatar: '',
    email: 'jordan.taylor@codex4tech.com',
    phone: '+1 (415) 890-2401',
    title: 'Head of Global Talent Acquisition',
    department: 'People & Culture',
    roleLevel: 'Manager / Lead',
    managerId: 'EMP-1003',
    location: 'London, UK',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2021-09-01',
    bio: 'Spearheading executive searches and international expansion across North America, EMEA, and APAC markets.',
    skills: ['Global Recruiting', 'Candidate Experience', 'Talent Sourcing', 'Employer Brand', 'Executive Search'],
    emergencyContact: {
      name: 'Oliver Taylor',
      relation: 'Father',
      phone: '+44 20 7946 0912'
    },
    compensationBand: 'Grade M-6 (Manager)',
    timeZone: 'GMT (UTC+0)',
    slack: '@jtaylor',
    pronouns: 'he/him'
  },
  {
    id: 'EMP-1008',
    firstName: 'Liam',
    lastName: 'Chen',
    avatar: '',
    email: 'liam.chen@codex4tech.com',
    phone: '+1 (415) 890-2512',
    title: 'Staff Site Reliability Engineer',
    department: 'Engineering',
    roleLevel: 'Staff / Principal',
    managerId: 'EMP-1005',
    location: 'San Francisco, CA (HQ)',
    officeType: 'In-Office',
    status: 'Active',
    startDate: '2022-01-10',
    bio: 'Specialist in low-latency event streaming, chaos engineering experiments, and disaster recovery automation.',
    skills: ['Go', 'Kafka', 'Terraform', 'Prometheus', 'Incident Command'],
    emergencyContact: {
      name: 'Mei Chen',
      relation: 'Mother',
      phone: '+1 (415) 890-2519'
    },
    compensationBand: 'Grade P-6 (Staff IC)',
    timeZone: 'PST (UTC-8)',
    slack: '@lchen',
    pronouns: 'he/him'
  },
  {
    id: 'EMP-1009',
    firstName: 'Aisha',
    lastName: 'Patel',
    avatar: '',
    email: 'aisha.patel@codex4tech.com',
    phone: '+1 (415) 890-2533',
    title: 'Senior Cloud Security Architect',
    department: 'Engineering',
    roleLevel: 'Senior IC',
    managerId: 'EMP-1005',
    location: 'Remote - US',
    officeType: 'Remote',
    status: 'Active',
    startDate: '2022-04-18',
    bio: 'Defines zero-trust network boundaries, IAM policy enforcement, cryptography standards, and penetration testing.',
    skills: ['Zero Trust', 'AWS/GCP Security', 'IAM Architecture', 'SOC 2 & ISO 27001', 'Cryptography'],
    emergencyContact: {
      name: 'Farhan Patel',
      relation: 'Spouse',
      phone: '+1 (512) 555-0199'
    },
    compensationBand: 'Grade S-5 (Senior)',
    timeZone: 'CST (UTC-6)',
    slack: '@aisha.patel',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1010',
    firstName: 'Maya',
    lastName: 'Lin',
    avatar: '',
    email: 'maya.lin@codex4tech.com',
    phone: '+1 (415) 890-2615',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    roleLevel: 'Senior IC',
    managerId: 'EMP-1006',
    location: 'New York, NY',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2022-07-05',
    bio: 'Focuses on real-time data sync, WebSocket communication, and responsive enterprise dashboard interfaces.',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
    emergencyContact: {
      name: 'David Lin',
      relation: 'Brother',
      phone: '+1 (212) 555-0192'
    },
    compensationBand: 'Grade S-5 (Senior)',
    timeZone: 'EST (UTC-5)',
    slack: '@mlin',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1011',
    firstName: 'Carlos',
    lastName: 'Mendez',
    avatar: '',
    email: 'carlos.mendez@codex4tech.com',
    phone: '+1 (415) 890-2630',
    title: 'Frontend Engineer II',
    department: 'Engineering',
    roleLevel: 'Associate',
    managerId: 'EMP-1006',
    location: 'Remote - US',
    officeType: 'Remote',
    status: 'Active',
    startDate: '2023-03-01',
    bio: 'Crafts accessible UI components, animations, and high performance data tables across the CODEX4 TECH LMT suite.',
    skills: ['React', 'Tailwind CSS', 'Accessibility (a11y)', 'Vite', 'State Management'],
    emergencyContact: {
      name: 'Lucia Mendez',
      relation: 'Mother',
      phone: '+1 (305) 555-0144'
    },
    compensationBand: 'Grade A-4 (Mid)',
    timeZone: 'EST (UTC-5)',
    slack: '@cmendez',
    pronouns: 'he/him'
  },
  {
    id: 'EMP-1012',
    firstName: 'Chloe',
    lastName: 'Bennet',
    avatar: '',
    email: 'chloe.bennet@codex4tech.com',
    phone: '+44 20 7946 0988',
    title: 'Senior Technical Recruiter',
    department: 'People & Culture',
    roleLevel: 'Senior IC',
    managerId: 'EMP-1007',
    location: 'London, UK',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2022-10-15',
    bio: 'Partners with engineering leaders to hire world-class staff engineers and technical directors worldwide.',
    skills: ['Technical Screening', 'Pipeline Management', 'Offer Negotiation', 'Diversity Sourcing'],
    emergencyContact: {
      name: 'James Bennet',
      relation: 'Spouse',
      phone: '+44 20 7946 0990'
    },
    compensationBand: 'Grade S-5 (Senior)',
    timeZone: 'GMT (UTC+0)',
    slack: '@chloe.b',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1013',
    firstName: 'Devon',
    lastName: 'Brooks',
    avatar: '',
    email: 'devon.brooks@codex4tech.com',
    phone: '+1 (415) 890-2710',
    title: 'People Operations & Total Rewards Lead',
    department: 'People & Culture',
    roleLevel: 'Manager / Lead',
    managerId: 'EMP-1003',
    location: 'San Francisco, CA (HQ)',
    officeType: 'In-Office',
    status: 'Active',
    startDate: '2021-04-12',
    bio: 'Administers global health insurance, 401(k) retirement matching, equity plans, and quarterly compensation reviews.',
    skills: ['Total Rewards', 'HRIS Administration', 'Benefits Brokerage', 'Equity Compensation', 'Immigration Visas'],
    emergencyContact: {
      name: 'Taylor Brooks',
      relation: 'Partner',
      phone: '+1 (415) 890-2719'
    },
    compensationBand: 'Grade M-6 (Manager)',
    timeZone: 'PST (UTC-8)',
    slack: '@devon',
    pronouns: 'they/them'
  },
  {
    id: 'EMP-1014',
    firstName: 'Emma',
    lastName: 'Wright',
    avatar: '',
    email: 'emma.wright@codex4tech.com',
    phone: '+1 (415) 890-2804',
    title: 'Principal Product Designer',
    department: 'Product & Design',
    roleLevel: 'Staff / Principal',
    managerId: 'EMP-1004',
    location: 'San Francisco, CA (HQ)',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2021-05-18',
    bio: 'Architect behind CODEX4 Prism Design System, component tokens, user journey maps, and executive presentations.',
    skills: ['Design Systems', 'Figma Mastery', 'Interaction Prototyping', 'Usability Testing', 'Typography'],
    emergencyContact: {
      name: 'Arthur Wright',
      relation: 'Father',
      phone: '+1 (415) 890-2810'
    },
    compensationBand: 'Grade P-6 (Principal)',
    timeZone: 'PST (UTC-8)',
    slack: '@ewright',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1015',
    firstName: 'Lucas',
    lastName: 'Silva',
    avatar: '',
    email: 'lucas.silva@codex4tech.com',
    phone: '+81 3 5555 0177',
    title: 'Senior UX Researcher & Systems Specialist',
    department: 'Product & Design',
    roleLevel: 'Senior IC',
    managerId: 'EMP-1004',
    location: 'Tokyo, Japan',
    officeType: 'Remote',
    status: 'Active',
    startDate: '2022-09-01',
    bio: 'Conducts qualitative interviews and quantitative behavioral metrics across enterprise clients in APAC and EMEA.',
    skills: ['Qualitative Research', 'Card Sorting', 'Data Synthesis', 'Cognitive Walkthroughs'],
    emergencyContact: {
      name: 'Renata Silva',
      relation: 'Sister',
      phone: '+81 3 5555 0180'
    },
    compensationBand: 'Grade S-5 (Senior)',
    timeZone: 'JST (UTC+9)',
    slack: '@lsilva',
    pronouns: 'he/him'
  },
  {
    id: 'EMP-1016',
    firstName: 'Julian',
    lastName: 'Vance',
    avatar: '',
    email: 'julian.vance@codex4tech.com',
    phone: '+1 (415) 890-2900',
    title: 'VP of Finance & Legal Operations',
    department: 'Finance & Legal',
    roleLevel: 'VP',
    managerId: 'EMP-1001',
    location: 'New York, NY',
    officeType: 'In-Office',
    status: 'Active',
    startDate: '2020-02-01',
    bio: 'Oversees financial planning & analysis (FP&A), enterprise audit compliance, board reporting, and corporate governance.',
    skills: ['Corporate FP&A', 'Financial Auditing', 'Cap Table Management', 'Tax Optimization', 'Contract Law'],
    emergencyContact: {
      name: 'Victoria Vance',
      relation: 'Spouse',
      phone: '+1 (212) 555-0166'
    },
    compensationBand: 'Grade E-8 (VP)',
    timeZone: 'EST (UTC-5)',
    slack: '@jvance',
    pronouns: 'he/him'
  },
  {
    id: 'EMP-1017',
    firstName: 'Sophia',
    lastName: 'Zhang',
    avatar: '',
    email: 'sophia.zhang@codex4tech.com',
    phone: '+1 (415) 890-2915',
    title: 'Corporate Controller & Treasurer',
    department: 'Finance & Legal',
    roleLevel: 'Director',
    managerId: 'EMP-1016',
    location: 'New York, NY',
    officeType: 'Hybrid',
    status: 'Active',
    startDate: '2021-08-10',
    bio: 'Oversees SEC and GAAP compliance, international entity consolidation, treasury cash flows, and ERP migration.',
    skills: ['US GAAP', 'Treasury Management', 'NetSuite ERP', 'Internal Controls', 'Audit Defense'],
    emergencyContact: {
      name: 'Wei Zhang',
      relation: 'Brother',
      phone: '+1 (212) 555-0171'
    },
    compensationBand: 'Grade D-7 (Director)',
    timeZone: 'EST (UTC-5)',
    slack: '@szhang',
    pronouns: 'she/her'
  },
  {
    id: 'EMP-1018',
    firstName: 'Nathan',
    lastName: 'Ross',
    avatar: '',
    email: 'nathan.ross@codex4tech.com',
    phone: '+1 (415) 890-2933',
    title: 'Senior Financial Analyst',
    department: 'Finance & Legal',
    roleLevel: 'Senior IC',
    managerId: 'EMP-1017',
    location: 'Remote - US',
    officeType: 'Remote',
    status: 'On Leave',
    startDate: '2023-01-16',
    bio: 'Leads headcount budget reconciliation, quarterly runway modeling, and departmental OPEX forecasting.',
    skills: ['Financial Modeling', 'SQL', 'Scenario Planning', 'Looker BI', 'Budget Analysis'],
    emergencyContact: {
      name: 'Hannah Ross',
      relation: 'Sister',
      phone: '+1 (312) 555-0138'
    },
    compensationBand: 'Grade S-5 (Senior)',
    timeZone: 'CST (UTC-6)',
    slack: '@nross',
    pronouns: 'he/him'
  }
];

export const INITIAL_DOCUMENTS: CorporateDocument[] = [
  {
    id: 'DOC-9001',
    title: 'Executive Employment Agreement & IP Assignment',
    category: 'Contracts & Agreements',
    classification: 'Strictly Restricted HR',
    employeeId: 'EMP-1001',
    employeeName: 'Elena Rostova',
    department: 'Executive',
    uploadedAt: '2026-01-10',
    fileSize: '2.4 MB',
    fileFormat: 'PDF',
    version: 'v2.1',
    signatureStatus: 'Signed & Verified',
    signedBy: ['Elena Rostova (CEO)', 'Julian Vance (VP Legal)'],
    lastAccessed: '2026-11-04 14:22',
    summary: 'Master executive employment deed covering fiduciary duties, equity vesting schedule, non-solicitation, and IP transfer obligations.',
    previewBody: `CODEX4 TECH LMT
CONFIDENTIAL EXECUTIVE EMPLOYMENT AGREEMENT

This Executive Employment Agreement (the "Agreement") is dated as of January 15, 2019, and re-executed as amended on January 10, 2026, by and between CODEX4 TECH LMT, a Delaware corporation (the "Company"), and Elena Rostova ("Executive").

1. POSITION AND RESPONSIBILITIES:
Executive shall serve as Chief Executive Officer of the Company, reporting directly to the Board of Directors. Executive shall have overall general supervision and control of the business, financial strategies, and personnel of the Company.

2. COMPENSATION & INCENTIVES:
- Base Salary: Governed by Compensation Committee Resolution Ref #EXEC-2026-01.
- Long Term Incentive Plan (LTIP): Performance-based equity RSUs with 4-year vesting schedule subject to double-trigger acceleration upon change of corporate control.
- Benefits: Full tier-1 executive medical, disability coverage, and D&O liability indemnification up to $25,000,000.

3. PROPRIETARY INFORMATION & COVENANTS:
Executive reaffirms adherence to the Master Non-Disclosure, Non-Solicitation (24 months), and Intellectual Property Assignment Schedule attached hereto as Exhibit B.

SIGNATURES:
[Signed Electronically via CODEX4 Vault ID: MDN-AUTH-98214]
Elena Rostova — Chief Executive Officer
Julian Vance — VP of Finance & Legal Operations`,
    accessLog: [
      { userName: 'Elena Rostova', role: 'CEO', timestamp: '2026-11-04 14:22', action: 'Viewed' },
      { userName: 'Priya Sharma', role: 'VP People', timestamp: '2026-10-18 09:15', action: 'Viewed' },
      { userName: 'Julian Vance', role: 'VP Legal', timestamp: '2026-01-10 16:40', action: 'Signed' }
    ]
  },
  {
    id: 'DOC-9002',
    title: 'Global Remote Work & Cybersecurity Policy Standard',
    category: 'Policy & Compliance',
    classification: 'Public / Company',
    department: 'All Departments',
    uploadedAt: '2026-02-15',
    fileSize: '1.8 MB',
    fileFormat: 'PDF',
    version: 'v3.0',
    signatureStatus: 'Signed & Verified',
    signedBy: ['Marcus Vance', 'Sarah Jenkins', 'Aisha Patel'],
    lastAccessed: '2026-11-05 11:05',
    summary: 'Standard operating guidelines for hardware encryption, VPN endpoints, home office expense allowances, and travel insurance coverage.',
    previewBody: `CODEX4 TECH LMT
GLOBAL OPERATING POLICY: INFORMATION SECURITY & DISTRIBUTED WORKFORCE (V3.0)

Effective Date: February 15, 2026
Applies to: All Global Regular Full-Time Employees and Contractors

1. HARDWARE STANDARD & ENCRYPTION:
All CODEX4 TECH LMT corporate workstations must run enterprise disk encryption (FileVault / BitLocker) with MDM enrollment. Under no circumstances may customer data or codebase assets be cloned to unmanaged personal devices.

2. NETWORK SECURITY & VPN:
Access to production clusters, customer tenant records, and internal staging databases mandates dual-factor hardware token authentication (FIDO2 / WebAuthn) and CODEX4 Zero-Trust Gateway routing.

3. WORKPLACE STIPENDS & EXPENSE POLICY:
Remote team members are entitled to an annual equipment ergonomics stipend of $1,200 USD and monthly internet reimbursement of $85 USD submitted via expense workflows by the 25th of each month.

Approved by Information Security Committee and People Operations.`,
    accessLog: [
      { userName: 'Carlos Mendez', role: 'Engineer', timestamp: '2026-11-05 11:05', action: 'Viewed' },
      { userName: 'Maya Lin', role: 'Engineer', timestamp: '2026-10-22 17:30', action: 'Downloaded' }
    ]
  },
  {
    id: 'DOC-9003',
    title: 'Q3 2026 Engineering Leadership Compensation Calibration',
    category: 'Performance & Comp',
    classification: 'Manager / Confidential',
    employeeId: 'EMP-1002',
    employeeName: 'Marcus Vance',
    department: 'Engineering',
    uploadedAt: '2026-09-30',
    fileSize: '890 KB',
    fileFormat: 'PDF',
    version: 'v1.2',
    signatureStatus: 'Signed & Verified',
    signedBy: ['Elena Rostova', 'Priya Sharma', 'Marcus Vance'],
    lastAccessed: '2026-11-01 10:14',
    summary: 'Confidential performance evaluation, OKR completion metrics, team retention ratios, and annual merit increase recommendation for Engineering VP.',
    previewBody: `CODEX4 TECH LMT CONFIDENTIAL — EXECUTIVE & MANAGEMENT PERFORMANCE DOSSIER
EVALUATION CYCLE: Q3 2026

SUBJECT: Marcus Vance (VP of Engineering — EMP-1002)
EVALUATOR: Elena Rostova (CEO — EMP-1001)

PERFORMANCE HIGHLIGHTS & DELIVERABLES:
1. Core Infra Availability: Achieved 99.992% uptime across all Tier-1 microservices.
2. Talent Retention: Engineering attrition remained under 2.8% vs. industry average of 11.4%.
3. System Modernization: Completed migration of legacy monolith to containerized clusters on budget.

RATING & ASSESSMENT:
Overall Score: Exceeds High Expectations (Top Tier Calibration).
Merit Increase Recommendation: Approved +6.5% base adjustment and 15,000 additional RSUs subject to Compensation Committee ratification.`,
    accessLog: [
      { userName: 'Elena Rostova', role: 'CEO', timestamp: '2026-11-01 10:14', action: 'Viewed' },
      { userName: 'Marcus Vance', role: 'VP Engineering', timestamp: '2026-10-02 14:00', action: 'Signed' }
    ]
  },
  {
    id: 'DOC-9004',
    title: 'Comprehensive Health, Dental & Vision Summary Plan (SPD)',
    category: 'Benefits & Insurance',
    classification: 'Public / Company',
    department: 'All Departments',
    uploadedAt: '2026-01-02',
    fileSize: '3.6 MB',
    fileFormat: 'PDF',
    version: 'v2026.1',
    signatureStatus: 'Not Required',
    lastAccessed: '2026-11-03 16:45',
    summary: 'Detailed explanation of employer-paid healthcare premiums, HSA contributions, vision care copays, mental health stipends, and dental coverage.',
    previewBody: `CODEX4 TECH LMT TOTAL REWARDS & BENEFITS SUMMARY (PLAN YEAR 2026-2027)

Plan Administrator: Devon Brooks, People Operations
Underwriter: BlueCross BlueShield Premium PPO & Delta Dental PPO Plus Premier

PLAN PROVISIONS:
- Employee Premium Coverage: CODEX4 TECH LMT sponsors 100% of employee premium and 85% of dependent premiums for PPO Plan A.
- HSA Employer Contribution: $1,500 individual / $3,000 family annual seed credited semi-annually.
- Mental Health & Wellbeing: 24 complimentary coaching and therapy sessions via Modern Health.
- Prescription Benefits: $10 generic / $35 preferred brand copay at all nationwide partner pharmacies.`,
    accessLog: [
      { userName: 'Liam Chen', role: 'Engineer', timestamp: '2026-11-03 16:45', action: 'Viewed' },
      { userName: 'Emma Wright', role: 'Designer', timestamp: '2026-10-15 11:20', action: 'Downloaded' }
    ]
  },
  {
    id: 'DOC-9005',
    title: 'ISO/IEC 27001:2022 Annual Information Security Audit Certificate',
    category: 'Policy & Compliance',
    classification: 'Public / Company',
    department: 'Engineering',
    uploadedAt: '2026-08-14',
    fileSize: '1.2 MB',
    fileFormat: 'PDF',
    version: 'v2026',
    signatureStatus: 'Signed & Verified',
    signedBy: ['Aisha Patel', 'Sarah Jenkins'],
    lastAccessed: '2026-11-02 18:20',
    summary: 'Official third-party accredited audit report certifying CODEX4 TECH LMT systems for international security, cryptography, and access controls.',
    previewBody: `INTERNATIONAL STANDARDIZATION ACCREDITATION REPORT
CERTIFICATE OF CONFORMANCE: ISO/IEC 27001:2022

Certified Entity: CODEX4 TECH LMT
Scope of Registration: Information Security Management System (ISMS) governing cloud SaaS applications, HR directory infrastructure, customer data storage, and engineering operations.

Audit Assessment: Zero non-conformities found. Continuous surveillance cycle scheduled for Q3 2027.`,
    accessLog: [
      { userName: 'Aisha Patel', role: 'Security Architect', timestamp: '2026-11-02 18:20', action: 'Viewed' }
    ]
  },
  {
    id: 'DOC-9006',
    title: '2026 Annual Equity Grant & RSUs Acknowledgment Packet',
    category: 'Performance & Comp',
    classification: 'Strictly Restricted HR',
    employeeId: 'EMP-1004',
    employeeName: 'David Tanaka',
    department: 'Product & Design',
    uploadedAt: '2026-05-12',
    fileSize: '950 KB',
    fileFormat: 'PDF',
    version: 'v1.0',
    signatureStatus: 'Signed & Verified',
    signedBy: ['David Tanaka', 'Julian Vance'],
    lastAccessed: '2026-10-29 09:33',
    summary: 'Restricted stock unit grant notice and vesting schedule for Director of Product & Design.',
    previewBody: `CODEX4 TECH LMT
NOTICE OF RESTRICTED STOCK UNIT GRANT (2026 INCENTIVE EQUITY PLAN)

Participant: David Tanaka (EMP-1004)
Grant Date: May 12, 2026
Number of RSUs: 18,500 Shares of Common Stock
Vesting Commencement Date: June 1, 2026

Vesting Schedule: 25% vests on June 1, 2027, and 1/16th vests quarterly thereafter over 36 months, subject to continuous service to the Company.`,
    accessLog: [
      { userName: 'David Tanaka', role: 'Director', timestamp: '2026-10-29 09:33', action: 'Viewed' }
    ]
  },
  {
    id: 'DOC-9007',
    title: 'Standard Form W-4 & State Tax Withholding Record',
    category: 'Tax & Legal',
    classification: 'Manager / Confidential',
    employeeId: 'EMP-1010',
    employeeName: 'Maya Lin',
    department: 'Engineering',
    uploadedAt: '2026-01-08',
    fileSize: '640 KB',
    fileFormat: 'PDF',
    version: 'v2026',
    signatureStatus: 'Signed & Verified',
    signedBy: ['Maya Lin', 'Devon Brooks'],
    lastAccessed: '2026-09-14 13:00',
    summary: 'Official federal and New York state payroll tax withholding exemptions and verified identification documentation.',
    previewBody: `DEPARTMENT OF THE TREASURY — INTERNAL REVENUE SERVICE
EMPLOYEE'S WITHHOLDING CERTIFICATE (FORM W-4)

Employee Name: Maya Lin
Filing Status: Single or Married Filing Separately
Total Allowances Claimed: 1
State Withholding: New York (IT-2104 on file)
Certified by Employee under penalties of perjury.`,
    accessLog: [
      { userName: 'Devon Brooks', role: 'HR Lead', timestamp: '2026-09-14 13:00', action: 'Viewed' }
    ]
  },
  {
    id: 'DOC-9008',
    title: 'Proprietary Information and Inventions Agreement (PIIA)',
    category: 'Contracts & Agreements',
    classification: 'Strictly Restricted HR',
    employeeId: 'EMP-1011',
    employeeName: 'Carlos Mendez',
    department: 'Engineering',
    uploadedAt: '2026-10-28',
    fileSize: '1.4 MB',
    fileFormat: 'PDF',
    version: 'v1.1',
    signatureStatus: 'Pending Signature',
    lastAccessed: '2026-11-05 15:40',
    summary: 'Updated intellectual property assignment for newly transferred frontend engineering roles. Requires immediate employee digital signature.',
    previewBody: `CODEX4 TECH LMT
PROPRIETARY INFORMATION AND INVENTIONS AGREEMENT (PIIA - 2026 REVISION)

This Proprietary Information and Inventions Agreement ("Agreement") is submitted for electronic acknowledgment to:
Employee: Carlos Mendez (EMP-1011)
Position: Frontend Engineer II

1. CONFIDENTIAL INFORMATION:
Employee acknowledges that in the course of employment, Employee will have access to confidential proprietary algorithms, source repositories, customer lists, and strategic business data.

2. INVENTIONS ASSIGNMENT:
All original works of authorship, designs, code modules, architectures, and intellectual property developed during the scope of employment are exclusively assigned to CODEX4 TECH LMT

STATUS: AWAITING DIGITAL SIGNATURE FROM EMPLOYEE.`,
    accessLog: [
      { userName: 'Devon Brooks', role: 'HR Lead', timestamp: '2026-10-28 10:15', action: 'Updated' },
      { userName: 'Carlos Mendez', role: 'Engineer', timestamp: '2026-11-05 15:40', action: 'Viewed' }
    ]
  }
];

export const ROLE_PROFILES: Record<string, RoleProfile> = {
  hr_admin: {
    id: 'hr_admin',
    name: 'Priya Sharma',
    title: 'VP of People & Culture (HR Executive)',
    department: 'People & Culture',
    avatar: '/src/assets/images/avatar_director_priya_1793956017190.jpg',
    description: 'Full administrative access: Can edit all profiles, view confidential compensation bands, manage and sign all vault documents, and modify the company hierarchy.'
  },
  department_manager: {
    id: 'department_manager',
    name: 'Marcus Vance',
    title: 'VP of Engineering (Department Manager)',
    department: 'Engineering',
    avatar: '/src/assets/images/avatar_vp_marcus_1793956016276.jpg',
    description: 'Management access: Can view team profiles, update direct reports, view manager-level evaluations for engineering direct reports, and access departmental policies.'
  },
  employee: {
    id: 'employee',
    name: 'Carlos Mendez',
    title: 'Frontend Engineer II (Employee)',
    department: 'Engineering',
    avatar: '',
    description: 'Standard employee access: Can update personal profile, view directory & org chart, sign personal documents, and view company-wide policies.'
  }
};
