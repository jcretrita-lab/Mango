import { OrgUnit, Position, Rank, SalaryGrade } from "../types";

export const MOCK_RANKS_SCHOOL: Rank[] = [
  { id: "sr-0", name: "Rank 0", order: 0, color: "bg-slate-400", mode: "flat", positions: [] },
  { id: "sr-1", name: "Rank 1", order: 1, color: "bg-blue-400", mode: "flat", positions: [] },
  { id: "sr-2", name: "Rank 2", order: 2, color: "bg-cyan-500", mode: "flat", positions: [] },
  { id: "sr-3", name: "Rank 3", order: 3, color: "bg-teal-500", mode: "flat", positions: [] },
  { id: "sr-4", name: "Rank 4", order: 4, color: "bg-emerald-500", mode: "flat", positions: [] },
  { id: "sr-5", name: "Rank 5", order: 5, color: "bg-amber-500", mode: "flat", positions: [] },
  { id: "sr-6", name: "Rank 6", order: 6, color: "bg-orange-500", mode: "flat", positions: [] },
  { id: "sr-8", name: "Rank 8", order: 8, color: "bg-rose-500", mode: "flat", positions: [] },
];

// Map positions to ranks (Level in user data maps to Rank ID)
const posMap: Record<string, { name: string; grade: string }[]> = {
  "sr-0": [
    { name: "Secretary", grade: "sg-3" }, { name: "Accounting Staff", grade: "sg-3" },
    { name: "Bookstore Clerk", grade: "sg-2" }, { name: "Faculty Member", grade: "sg-5" },
    { name: "Dentist", grade: "sg-10" }, { name: "Doctor", grade: "sg-12" },
    { name: "Nurse", grade: "sg-6" }, { name: "HRMD Staff", grade: "sg-3" },
    { name: "Coach", grade: "sg-5" }, { name: "SDO Assistant", grade: "sg-3" },
    { name: "GS Teacher", grade: "sg-5" }, { name: "HS Teacher", grade: "sg-5" },
    { name: "PS Teacher", grade: "sg-5" }, { name: "Program Coordinator", grade: "sg-6" }
  ],
  "sr-1": [
    { name: "Photocopying Operator", grade: "sg-1" }, { name: "Library Assistant", grade: "sg-2" },
    { name: "School Orderly", grade: "sg-1" }
  ],
  "sr-2": [
    { name: "Records Keeper", grade: "sg-2" }, { name: "Registrar Staff", grade: "sg-2" },
    { name: "Communication Multimedia Specialist", grade: "sg-4" }, { name: "Cook", grade: "sg-2" },
    { name: "Service Crew", grade: "sg-2" }, { name: "Store Roomkeeper", grade: "sg-2" },
    { name: "Aircon Technician", grade: "sg-3" }, { name: "Carpenter", grade: "sg-2" },
    { name: "Gardener", grade: "sg-2" }, { name: "Painter", grade: "sg-2" },
    { name: "School Driver", grade: "sg-2" }, { name: "MIS Clerk", grade: "sg-2" }
  ],
  "sr-3": [
    { name: "Secretary", grade: "sg-3" }, { name: "Accounting Assistant for AP", grade: "sg-4" },
    { name: "Accounting Assistant for AR", grade: "sg-4" }, { name: "Cashier", grade: "sg-4" },
    { name: "Junior Accountant", grade: "sg-5" }, { name: "Senior Cashier", grade: "sg-5" },
    { name: "Admissions Specialist", grade: "sg-5" }, { name: "Marketing Assistant", grade: "sg-4" },
    { name: "Asset Management Clerk", grade: "sg-3" }, { name: "Property Control Assistant", grade: "sg-4" },
    { name: "Student Welfare Facilitator", grade: "sg-5" }, { name: "Benefits and Training Assistant", grade: "sg-5" },
    { name: "Faculty Assistant", grade: "sg-4" }, { name: "IRPA Assistant", grade: "sg-4" },
    { name: "Technical Support", grade: "sg-5" }, { name: "Residence Hall Assistant", grade: "sg-4" },
    { name: "Student Affairs Asst-Campus Ministry", grade: "sg-4" }, { name: "Student Affairs Asst-Special Projects", grade: "sg-4" },
    { name: "OSFA SPECIALIST", grade: "sg-5" }, { name: "Electrician", grade: "sg-4" },
    { name: "Evaluator", grade: "sg-5" }, { name: "TS Evaluator", grade: "sg-5" },
    { name: "LABORATORY CUSTODIAN", grade: "sg-3" }, { name: "Teacher Aide", grade: "sg-2" }
  ],
  "sr-4": [
    { name: "Reports Specialist", grade: "sg-6" }, { name: "Payroll Specialist", grade: "sg-7" },
    { name: "Staffing and HRIS Specialist", grade: "sg-7" }, { name: "Librarian", grade: "sg-7" },
    { name: "Junior Programmer", grade: "sg-8" }, { name: "Discipline Officer", grade: "sg-6" },
    { name: "Foreman", grade: "sg-5" }, { name: "Lead Gardener", grade: "sg-3" },
    { name: "Technical Staff", grade: "sg-6" }
  ],
  "sr-5": [
    { name: "Accounting Supervisor", grade: "sg-9" }, { name: "Business Services Supervisor", grade: "sg-9" },
    { name: "Guidance Head", grade: "sg-11" }, { name: "Senior Librarian", grade: "sg-10" },
    { name: "Network Adminstrator", grade: "sg-11" }, { name: "Assistant to the VP of SA", grade: "sg-13" },
    { name: "Construction and Maintenance Supervisor", grade: "sg-9" }, { name: "Facilities and Housekeeping Supervisor", grade: "sg-9" },
    { name: "Vice Principal", grade: "sg-13" }
  ],
  "sr-6": [
    { name: "HRMD Manager", grade: "sg-13" }, { name: "Chair", grade: "sg-11" },
    { name: "GS Principal", grade: "sg-14" }, { name: "HS Principal", grade: "sg-14" }
  ],
  "sr-8": [
    { name: "Vice President", grade: "sg-16" }, { name: "Vice President of Student Affairs", grade: "sg-16" },
    { name: "VP PPF", grade: "sg-16" }, { name: "VP Registrar", grade: "sg-16" },
    { name: "VP Unified School", grade: "sg-16" }, { name: "Dean", grade: "sg-15" }
  ]
};

// Populates school rank positions so jobArchitectureSeeds can derive school position templates.
MOCK_RANKS_SCHOOL.forEach(r => {
  r.positions = (posMap[r.id] || []).map((p, idx) => ({
    id: `srp-${r.id}-${idx}`,
    name: p.name,
    salaryGradeId: p.grade
  }));
});

export const MOCK_ORG_UNITS_SCHOOL: OrgUnit[] = [
  {
    id: 's-root',
    name: 'FAITH',
    type: 'Company',
    parentId: null,
    children: [
      {
        id: 's-div-admin',
        name: 'Admin',
        type: 'Division',
        parentId: 's-root',
        children: [
          { id: 's-dept-pres', name: 'Office of the President', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-acc', name: 'Accounting', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-adm', name: 'Admissions', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-asset', name: 'Asset and Property', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-bkst', name: 'BOOKSTORE', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-biz', name: 'Business Services', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-cas', name: 'CAS', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-clinic', name: 'Clinic', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-con', name: 'CON', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-guid', name: 'Guidance', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-hrmd', name: 'HRMD', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-ict', name: 'ICT', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-irpa', name: 'IRPA', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-lib', name: 'Library', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-mis', name: 'MIS', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-osa', name: 'OSA', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-osfa', name: 'OSFA', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-ppf', name: 'PPF', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-reg', name: 'Registrar', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-sdo', name: 'SDO', type: 'Department', parentId: 's-div-admin', children: [] },
          { id: 's-dept-stel', name: 'STELLAR', type: 'Department', parentId: 's-div-admin', children: [] },
        ]
      },
      {
        id: 's-div-tert',
        name: 'Tertiary School',
        type: 'Division',
        parentId: 's-root',
        children: [
          { id: 's-dept-tert-cas', name: 'CAS', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-cba', name: 'CBA', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-chm', name: 'CHM', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-coe', name: 'COE', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-coed', name: 'COED', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-con', name: 'CON', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-cops', name: 'COPS', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-ict', name: 'ICT', type: 'Department', parentId: 's-div-tert', children: [] },
          { id: 's-dept-tert-ppf', name: 'PPF', type: 'Department', parentId: 's-div-tert', children: [] },
        ]
      },
      {
        id: 's-div-uni',
        name: 'Unified School',
        type: 'Division',
        parentId: 's-root',
        children: [
          { id: 's-dept-gs', name: 'Grade School', type: 'Department', parentId: 's-div-uni', children: [] },
          { id: 's-dept-hs', name: 'High School', type: 'Department', parentId: 's-div-uni', children: [] },
          { id: 's-dept-ps', name: 'Pre School', type: 'Department', parentId: 's-div-uni', children: [] },
        ]
      }
    ],
  },
];

export const MOCK_POSITIONS_SCHOOL: Position[] = [
  // Admin -> President
  { id: 'sp-1', title: 'Secretary', orgUnitId: 's-dept-pres', defaultBasePay: 30000, salaryGradeId: 'sg-3', rankId: 'sr-3', rankPositionId: 'srp-sr-3-0', employmentStatus: 'Regular' },
  
  // Admin -> Accounting
  { id: 'sp-2', title: 'Accounting Staff', orgUnitId: 's-dept-acc', defaultBasePay: 28000, salaryGradeId: 'sg-3', rankId: 'sr-0', rankPositionId: 'srp-sr-0-1', employmentStatus: 'Regular' },
  { id: 'sp-3', title: 'Accounting Assistant for AP', orgUnitId: 's-dept-acc', defaultBasePay: 35000, salaryGradeId: 'sg-4', rankId: 'sr-3', rankPositionId: 'srp-sr-3-1', employmentStatus: 'Regular' },
  { id: 'sp-3b', title: 'Accounting Assistant for AR', orgUnitId: 's-dept-acc', defaultBasePay: 35000, salaryGradeId: 'sg-4', rankId: 'sr-3', rankPositionId: 'srp-sr-3-2', employmentStatus: 'Regular' },
  { id: 'sp-4', title: 'Cashier', orgUnitId: 's-dept-acc', defaultBasePay: 32000, salaryGradeId: 'sg-4', rankId: 'sr-3', rankPositionId: 'srp-sr-3-3', employmentStatus: 'Regular' },
  { id: 'sp-5', title: 'Junior Accountant', orgUnitId: 's-dept-acc', defaultBasePay: 40000, salaryGradeId: 'sg-5', rankId: 'sr-3', rankPositionId: 'srp-sr-3-4', employmentStatus: 'Regular' },
  { id: 'sp-6', title: 'Accounting Supervisor', orgUnitId: 's-dept-acc', defaultBasePay: 65000, salaryGradeId: 'sg-9', rankId: 'sr-5', rankPositionId: 'srp-sr-5-0', employmentStatus: 'Regular' },

  // Admin -> Admissions
  { id: 'sp-7', title: 'Admissions Specialist', orgUnitId: 's-dept-adm', defaultBasePay: 40000, salaryGradeId: 'sg-3', rankId: 'sr-3', rankPositionId: 'srp-sr-3-6', employmentStatus: 'Regular' },
  { id: 'sp-8', title: 'Marketing Assistant', orgUnitId: 's-dept-adm', defaultBasePay: 35000, salaryGradeId: 'sg-3', rankId: 'sr-3', rankPositionId: 'srp-sr-3-7', employmentStatus: 'Regular' },
  { id: 'sp-9', title: 'Reports Specialist', orgUnitId: 's-dept-adm', defaultBasePay: 45000, salaryGradeId: 'sg-4', rankId: 'sr-4', rankPositionId: 'srp-sr-4-0', employmentStatus: 'Regular' },

  // Admin -> HRMD
  { id: 'sp-10', title: 'HRMD Staff', orgUnitId: 's-dept-hrmd', defaultBasePay: 30000, salaryGradeId: 'sg-0', rankId: 'sr-0', rankPositionId: 'srp-sr-0-7', employmentStatus: 'Regular' },
  { id: 'sp-11', title: 'Payroll Specialist', orgUnitId: 's-dept-hrmd', defaultBasePay: 50000, salaryGradeId: 'sg-4', rankId: 'sr-4', rankPositionId: 'srp-sr-4-1', employmentStatus: 'Regular' },
  { id: 'sp-12', title: 'HRMD Manager', orgUnitId: 's-dept-hrmd', defaultBasePay: 120000, salaryGradeId: 'sg-6', rankId: 'sr-6', rankPositionId: 'srp-sr-6-0', employmentStatus: 'Regular' },

  // Admin -> PPF
  { id: 'sp-13', title: 'VP PPF', orgUnitId: 's-dept-ppf', defaultBasePay: 350000, salaryGradeId: 'sg-8', rankId: 'sr-8', rankPositionId: 'srp-sr-8-2', employmentStatus: 'Regular' },
  
  // Tertiary School -> CAS
  { id: 'sp-14', title: 'Dean', orgUnitId: 's-dept-tert-cas', defaultBasePay: 200000, salaryGradeId: 'sg-8', rankId: 'sr-8', rankPositionId: 'srp-sr-8-5', employmentStatus: 'Regular' },
  { id: 'sp-15', title: 'Chair', orgUnitId: 's-dept-tert-cas', defaultBasePay: 150000, salaryGradeId: 'sg-6', rankId: 'sr-6', rankPositionId: 'srp-sr-6-1', employmentStatus: 'Regular' },
  { id: 'sp-16', title: 'Faculty Member', orgUnitId: 's-dept-tert-cas', defaultBasePay: 60000, salaryGradeId: 'sg-0', rankId: 'sr-0', rankPositionId: 'srp-sr-0-3', employmentStatus: 'Regular' },

  // Unified School -> Grade School
  { id: 'sp-17', title: 'GS Teacher', orgUnitId: 's-dept-gs', defaultBasePay: 45000, salaryGradeId: 'sg-0', rankId: 'sr-0', rankPositionId: 'srp-sr-0-10', employmentStatus: 'Regular' },
  { id: 'sp-18', title: 'GS Principal', orgUnitId: 's-dept-gs', defaultBasePay: 140000, salaryGradeId: 'sg-6', rankId: 'sr-6', rankPositionId: 'srp-sr-6-2', employmentStatus: 'Regular' },
  
  // Unified School -> High School
  { id: 'sp-19', title: 'HS Teacher', orgUnitId: 's-dept-hs', defaultBasePay: 45000, salaryGradeId: 'sg-0', rankId: 'sr-0', rankPositionId: 'srp-sr-0-11', employmentStatus: 'Regular' },
  { id: 'sp-20', title: 'VP Unified School', orgUnitId: 's-dept-hs', defaultBasePay: 280000, salaryGradeId: 'sg-8', rankId: 'sr-8', rankPositionId: 'srp-sr-8-4', employmentStatus: 'Regular' },
];
