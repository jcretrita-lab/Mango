import { MOCK_EMPLOYEES } from './source/unified-hris/data/corporateMockData';
import { buildInitialJobArchitecture } from './source/unified-hris/data/jobArchitectureSeeds';
import { ENTERPRISE_PAY_COMPONENTS } from './source/unified-hris/data/payComponentsData';
import { ENTERPRISE_PAY_TEMPLATES } from './source/unified-hris/data/payTemplatesData';
import { initialPersonnelDataset } from './source/unified-hris/data/personnelSeeds';
import { PHASE1_DEMO_ACCOUNT_MAP } from './phase1-demo-accounts';

const orgStructureEffectiveStart = '2025-01-01T00:00:00.000Z';
const roleAssignmentStart = '2026-01-01T08:00:00.000Z';
const nowIso = '2026-04-21T08:00:00.000Z';

const sourceJobArchitecture = buildInitialJobArchitecture('corporate');

type SourceOrgUnit = (typeof sourceJobArchitecture.orgUnits)[number];
type SourcePosition = (typeof sourceJobArchitecture.positions)[number];
type SourcePayTemplate = (typeof ENTERPRISE_PAY_TEMPLATES)[number];
type SourceEmployee = (typeof MOCK_EMPLOYEES)[number];

function sanitizeText(value: string | undefined): string {
  return (value ?? '')
    .replace(/â€¢/g, ' - ')
    .replace(/â€“/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€™/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string): string {
  return sanitizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function buildOrgUnitClosures(
  units: readonly { id: number; parentOrgUnitId?: number | null }[],
) {
  const parentByOrgUnitId = new Map<number, number | null>(
    units.map((unit) => [unit.id, unit.parentOrgUnitId ?? null]),
  );

  let nextId = 1;
  const closures: Array<{
    id: number;
    ancestorOrgUnitId: number;
    descendantOrgUnitId: number;
    depth: number;
  }> = [];

  for (const unit of units) {
    closures.push({
      id: nextId++,
      ancestorOrgUnitId: unit.id,
      descendantOrgUnitId: unit.id,
      depth: 0,
    });

    let depth = 1;
    let ancestorId = unit.parentOrgUnitId ?? null;

    while (ancestorId) {
      closures.push({
        id: nextId++,
        ancestorOrgUnitId: ancestorId,
        descendantOrgUnitId: unit.id,
        depth,
      });

      ancestorId = parentByOrgUnitId.get(ancestorId) ?? null;
      depth += 1;
    }
  }

  return closures;
}

function flattenOrgUnits(units: readonly SourceOrgUnit[]): SourceOrgUnit[] {
  return units.flatMap((unit) => [unit, ...flattenOrgUnits(unit.children ?? [])]);
}

function splitDisplayName(displayName: string) {
  const parts = sanitizeText(displayName).split(' ').filter(Boolean);
  if (parts.length === 0) {
    return { firstName: 'Unknown', lastName: 'Employee' };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: 'Employee' };
  }
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
}

function toIsoDate(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString();
}

function shiftIsoDate(isoDate: string, years: number): string {
  const value = new Date(isoDate);
  return toIsoDate(value.getUTCFullYear() + years, value.getUTCMonth() + 1, value.getUTCDate());
}

const siteCatalog = [
  {
    id: 1,
    code: 'MKT-HQ',
    name: 'Makati Head Office',
    address: '6750 Ayala Avenue, Makati City',
    city: 'Makati',
    region: 'NCR',
    countryCode: 'PH',
    sortOrder: 1,
  },
  {
    id: 2,
    code: 'QC-SSC',
    name: 'Quezon City Shared Services Campus',
    address: 'Commonwealth Avenue, Quezon City',
    city: 'Quezon City',
    region: 'NCR',
    countryCode: 'PH',
    sortOrder: 2,
  },
  {
    id: 3,
    code: 'ALA-CSC',
    name: 'Alabang Customer Success Center',
    address: 'Filinvest City, Muntinlupa',
    city: 'Muntinlupa',
    region: 'NCR',
    countryCode: 'PH',
    sortOrder: 3,
  },
  {
    id: 4,
    code: 'LAG-HUB',
    name: 'Laguna Learning Hub',
    address: 'Nuvali, Santa Rosa, Laguna',
    city: 'Santa Rosa',
    region: 'Region IV-A',
    countryCode: 'PH',
    sortOrder: 4,
  },
  {
    id: 5,
    code: 'BUL-HUB',
    name: 'Bulacan North Luzon Hub',
    address: 'Malolos, Bulacan',
    city: 'Malolos',
    region: 'Region III',
    countryCode: 'PH',
    sortOrder: 5,
  },
  {
    id: 6,
    code: 'CEB-RO',
    name: 'Cebu Regional Office',
    address: 'Cebu IT Park, Cebu City',
    city: 'Cebu City',
    region: 'Region VII',
    countryCode: 'PH',
    sortOrder: 6,
  },
  {
    id: 7,
    code: 'DAV-RO',
    name: 'Davao Regional Office',
    address: 'J.P. Laurel Avenue, Davao City',
    city: 'Davao City',
    region: 'Region XI',
    countryCode: 'PH',
    sortOrder: 7,
  },
  {
    id: 8,
    code: 'CDO-SAT',
    name: 'Cagayan de Oro Satellite Office',
    address: 'Limketkai Center, Cagayan de Oro',
    city: 'Cagayan de Oro',
    region: 'Region X',
    countryCode: 'PH',
    sortOrder: 8,
  },
  {
    id: 9,
    code: 'COT-SAT',
    name: 'Cotabato Satellite Office',
    address: 'Sinsuat Avenue, Cotabato City',
    city: 'Cotabato City',
    region: 'BARMM',
    countryCode: 'PH',
    sortOrder: 9,
  },
  {
    id: 10,
    code: 'ZAM-SAT',
    name: 'Zamboanga Satellite Office',
    address: 'Veterans Avenue, Zamboanga City',
    city: 'Zamboanga City',
    region: 'Region IX',
    countryCode: 'PH',
    sortOrder: 10,
  },
] as const;

const hierarchyLevels = [...sourceJobArchitecture.hierarchyLevels]
  .sort((left, right) => left.order - right.order)
  .map((level, index) => ({
    id: index + 1,
    levelNo: level.order,
    label: sanitizeText(level.name),
    description:
      level.order === 1
        ? 'Top-level enterprise node'
        : `Imported ${sanitizeText(level.name).toLowerCase()} layer from unified HRIS seed`,
  }));

const hierarchyLevelIdBySourceId = new Map(
  [...sourceJobArchitecture.hierarchyLevels]
    .sort((left, right) => left.order - right.order)
    .map((level, index) => [level.id, index + 1]),
);

const sourceOrgUnits = flattenOrgUnits(sourceJobArchitecture.orgUnits);
const sourceOrgUnitById = new Map(sourceOrgUnits.map((unit) => [unit.id, unit]));
const orgUnitIdBySourceId = new Map(
  sourceOrgUnits.map((unit, index) => [unit.id, index + 1]),
);

const sourcePositions = [...sourceJobArchitecture.positions];
const sourcePositionById = new Map(sourcePositions.map((position) => [position.id, position]));
const positionIdBySourceId = new Map(
  sourcePositions.map((position, index) => [position.id, index + 1]),
);

function buildOrgUnitPath(orgUnitId: string): SourceOrgUnit[] {
  const path: SourceOrgUnit[] = [];
  let current = sourceOrgUnitById.get(orgUnitId);

  while (current) {
    path.unshift(current);
    current = current.parentId ? sourceOrgUnitById.get(current.parentId) : undefined;
  }

  return path;
}

function inferSiteName(path: readonly SourceOrgUnit[]): string {
  const joined = path.map((unit) => sanitizeText(unit.name).toLowerCase()).join(' ');

  if (joined.includes('cebu') || joined.includes('iloilo') || joined.includes('tacloban') || joined.includes('visayas')) {
    return 'Cebu Regional Office';
  }
  if (joined.includes('davao') || joined.includes('socsargen')) {
    return 'Davao Regional Office';
  }
  if (joined.includes('cotabato')) {
    return 'Cotabato Satellite Office';
  }
  if (joined.includes('zamboanga')) {
    return 'Zamboanga Satellite Office';
  }
  if (joined.includes('cagayan de oro') || joined.includes('cdo')) {
    return 'Cagayan de Oro Satellite Office';
  }
  if (joined.includes('bulacan') || joined.includes('north luzon')) {
    return 'Bulacan North Luzon Hub';
  }
  if (joined.includes('laguna') || joined.includes('south luzon')) {
    return 'Laguna Learning Hub';
  }
  if (joined.includes('customer success') || joined.includes('sales support') || joined.includes('alabang')) {
    return 'Alabang Customer Success Center';
  }
  if (joined.includes('information technology') || joined.includes('human resource') || joined.includes('accounting')) {
    return 'Quezon City Shared Services Campus';
  }

  return 'Makati Head Office';
}

function buildOrgUnitJson(orgUnitId: string): Record<string, string> {
  const path = buildOrgUnitPath(orgUnitId);
  const result: Record<string, string> = {};

  for (const unit of path) {
    const normalizedName = sanitizeText(unit.name);
    switch (unit.type.toLowerCase()) {
      case 'company':
        result.company = normalizedName;
        break;
      case 'division':
        result.division = normalizedName;
        break;
      case 'department':
        result.department = normalizedName;
        break;
      case 'section':
        result.section = normalizedName;
        break;
      default:
        result[slugify(unit.type)] = normalizedName;
        break;
    }
  }

  result.site = inferSiteName(path);
  return result;
}

const sourceSalaryGrades = [...sourceJobArchitecture.salaryGrades].sort((left, right) => {
  const leftNumber = Number(left.code.replace(/\D/g, ''));
  const rightNumber = Number(right.code.replace(/\D/g, ''));
  return leftNumber - rightNumber;
});

const salaryGradeIdBySourceId = new Map(
  sourceSalaryGrades.map((grade, index) => [grade.id, index + 1]),
);

const salaryGrades = sourceSalaryGrades.map((grade, index) => ({
  id: index + 1,
  code: sanitizeText(grade.code),
  name: sanitizeText(grade.name),
  rateType: grade.rateType ?? (grade.steps && grade.steps.length > 0 ? 'range' : 'fixed'),
  minSalary: grade.minSalary ?? grade.amount ?? grade.steps?.[0]?.amount ?? 0,
  maxSalary:
    grade.maxSalary ??
    grade.amount ??
    grade.steps?.[grade.steps.length - 1]?.amount ??
    grade.steps?.[0]?.amount ??
    0,
  currency: grade.currency ?? 'PHP',
}));

const salaryGradeStepIdBySourceKey = new Map<string, number>();
const salaryGradeSteps = sourceSalaryGrades.flatMap((grade) =>
  (grade.steps ?? []).map((step, index) => {
    const id = salaryGradeStepIdBySourceKey.size + 1;
    salaryGradeStepIdBySourceKey.set(`${grade.id}:${step.id}`, id);
    return {
      id,
      salaryGradeId: salaryGradeIdBySourceId.get(grade.id)!,
      stepNumber: index + 1,
      name: sanitizeText(step.name),
      amount: step.amount,
    };
  }),
);

function resolveSalaryGradeStepId(
  sourceSalaryGradeId: string | undefined,
  basePay: number,
): number | undefined {
  if (!sourceSalaryGradeId) {
    return undefined;
  }

  const sourceGrade = sourceSalaryGrades.find((grade) => grade.id === sourceSalaryGradeId);
  if (!sourceGrade || !sourceGrade.steps || sourceGrade.steps.length === 0) {
    return undefined;
  }

  const closestStep = sourceGrade.steps.reduce((closest, current) =>
    Math.abs(current.amount - basePay) < Math.abs(closest.amount - basePay) ? current : closest,
  );

  return salaryGradeStepIdBySourceKey.get(`${sourceSalaryGradeId}:${closestStep.id}`);
}

const sourceRanks = [...sourceJobArchitecture.ranks].sort((left, right) => left.order - right.order);
const rankIdBySourceId = new Map(sourceRanks.map((rank, index) => [rank.id, index + 1]));

const ranks = sourceRanks.map((rank, index) => ({
  id: index + 1,
  name: sanitizeText(rank.name),
  sortOrder: rank.order,
  color: rank.color ?? ['#7C2D12', '#1D4ED8', '#0F766E', '#4B5563'][index % 4],
  mode: rank.mode,
}));

const rankLevelIdBySourceId = new Map<string, number>();
const rankLevels = sourceRanks.flatMap((rank) =>
  (rank.levels ?? []).map((level, index) => {
    const id = rankLevelIdBySourceId.size + 1;
    rankLevelIdBySourceId.set(level.id, id);
    return {
      id,
      rankId: rankIdBySourceId.get(rank.id)!,
      code: sanitizeText(level.code),
      sortOrder: index + 1,
    };
  }),
);

const sourcePositionTemplates = [...sourceJobArchitecture.positionTemplates].sort((left, right) =>
  sanitizeText(left.name).localeCompare(sanitizeText(right.name)),
);
const positionTemplateIdBySourceId = new Map(
  sourcePositionTemplates.map((template, index) => [template.id, index + 1]),
);

const positionTemplates = sourcePositionTemplates.map((template, index) => ({
  id: index + 1,
  name: sanitizeText(template.name),
  family: template.family ? sanitizeText(template.family) : undefined,
  category: template.category ? sanitizeText(template.category) : undefined,
  description:
    template.description
      ? sanitizeText(template.description)
      : `Imported unified-HRIS job template for ${sanitizeText(template.name)}`,
}));

const sourcePositionProfiles = sourcePositionTemplates.flatMap((template) =>
  template.profiles.map((profile) => ({
    ...profile,
    sourceTemplateId: template.id,
  })),
);
const positionProfileIdBySourceId = new Map(
  sourcePositionProfiles.map((profile, index) => [profile.id, index + 1]),
);

function resolveSourcePositionProfileId(position: SourcePosition): string | undefined {
  if (position.positionProfileId) {
    return position.positionProfileId;
  }

  const normalizedTitle = sanitizeText(position.title).toLowerCase();

  const templateSpecificCandidate = sourcePositionProfiles.find((profile) => {
    const templateName = sanitizeText(profile.sourceTemplateId).toLowerCase();
    return (
      (normalizedTitle.includes('vp') && templateName.includes('vice-president')) ||
      ((normalizedTitle.includes('chief') || normalizedTitle.includes('chro')) &&
        templateName.includes('executive-director'))
    );
  });

  if (templateSpecificCandidate) {
    return templateSpecificCandidate.id;
  }

  const exactRankCandidates = sourcePositionProfiles.filter(
    (profile) =>
      (!position.rankId || profile.rankId === position.rankId) &&
      (!position.rankLevelId || profile.rankLevelId === position.rankLevelId),
  );
  const sourceSalaryGradeId = position.salaryGradeId;

  const exactGradeCandidate = exactRankCandidates.find(
    (profile) =>
      sourceSalaryGradeId !== undefined &&
      (profile.defaultGradeId === sourceSalaryGradeId ||
        profile.validGradeIds?.includes(sourceSalaryGradeId)),
  );

  if (exactGradeCandidate) {
    return exactGradeCandidate.id;
  }

  return exactRankCandidates[0]?.id;
}

const positionProfiles = sourcePositionProfiles.map((profile, index) => ({
  id: index + 1,
  positionTemplateId: positionTemplateIdBySourceId.get(profile.sourceTemplateId)!,
  label: sanitizeText(profile.label),
  rankId: profile.rankId ? rankIdBySourceId.get(profile.rankId) : undefined,
  rankLevelId: profile.rankLevelId ? rankLevelIdBySourceId.get(profile.rankLevelId) : undefined,
  progressionMode: profile.progressionMode === 'sub_levels' ? 'sub_level' : 'base_grade',
  defaultSalaryGradeId: profile.defaultGradeId
    ? salaryGradeIdBySourceId.get(profile.defaultGradeId)
    : undefined,
}));

const sourcePositionSubLevels = sourcePositionProfiles.flatMap((profile) =>
  profile.subLevels.map((subLevel) => ({
    ...subLevel,
    sourceProfileId: profile.id,
  })),
);
const positionSubLevelIdBySourceId = new Map(
  sourcePositionSubLevels.map((subLevel, index) => [subLevel.id, index + 1]),
);

const positionSubLevels = sourcePositionSubLevels.map((subLevel, index) => ({
  id: index + 1,
  positionProfileId: positionProfileIdBySourceId.get(subLevel.sourceProfileId)!,
  name: sanitizeText(subLevel.name),
  sortOrder: subLevel.order,
  salaryGradeId: salaryGradeIdBySourceId.get(subLevel.salaryGradeId)!,
}));

const orgUnits = sourceOrgUnits.map((unit, index) => ({
  id: index + 1,
  code: `${slugify(unit.type).toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
  name: sanitizeText(unit.name),
  hierarchyLevelId: hierarchyLevelIdBySourceId.get(unit.hierarchyLevelId!)!,
  parentOrgUnitId: unit.parentId ? orgUnitIdBySourceId.get(unit.parentId) : undefined,
  headPositionId: unit.headPositionId ? positionIdBySourceId.get(unit.headPositionId) : undefined,
}));

const orgUnitClosures = buildOrgUnitClosures(orgUnits);

const orgUnitVersions = sourceOrgUnits.map((unit, index) => ({
  id: index + 1,
  orgUnitId: orgUnitIdBySourceId.get(unit.id)!,
  parentOrgUnitId: unit.parentId ? orgUnitIdBySourceId.get(unit.parentId) : undefined,
  hierarchyLevelId: hierarchyLevelIdBySourceId.get(unit.hierarchyLevelId!)!,
  headPositionId: unit.headPositionId ? positionIdBySourceId.get(unit.headPositionId) : undefined,
  name: sanitizeText(unit.name),
  effectiveStartDate: orgStructureEffectiveStart,
  isCurrent: true,
  changeReason: 'Imported from unified-HRIS enterprise org structure',
}));

const positions = sourcePositions.map((position, index) => ({
  id: index + 1,
  orgUnitId: orgUnitIdBySourceId.get(position.orgUnitId)!,
  positionProfileId: positionProfileIdBySourceId.get(resolveSourcePositionProfileId(position)!)!,
  positionSubLevelId: position.subLevelsStepId
    ? positionSubLevelIdBySourceId.get(position.subLevelsStepId)
    : undefined,
  salaryGradeId: position.salaryGradeId
    ? salaryGradeIdBySourceId.get(position.salaryGradeId)
    : undefined,
  salaryGradeStepId: resolveSalaryGradeStepId(position.salaryGradeId, position.defaultBasePay),
  supervisorPositionId: position.supervisorId
    ? positionIdBySourceId.get(position.supervisorId)
    : undefined,
  title: sanitizeText(position.title),
  employmentStatus: sanitizeText(position.employmentStatus ?? 'Regular'),
  defaultBasePay: position.defaultBasePay,
  plannedHeadcount: position.plannedHeadcount ?? 1,
  fte: position.fte ?? 1,
}));

const companyProfiles = [
  {
    id: 1,
    registeredName: 'Diwa Learning Systems Inc.',
    displayName: 'Diwa Learning Systems',
    registrationType: 'CORPORATION',
    registrationNo: 'CS2012-109887',
    tin: '245-781-963-000',
    branchCode: '000',
    rdoCode: '047',
    sssEmployerNo: '13-4589123-6',
    philhealthEmployerNo: '04-891237456-8',
    pagibigEmployerNo: '458912374561',
    businessAddress: '6750 Ayala Avenue, Makati City',
    countryCode: 'PH',
    rootOrgUnitId: orgUnitIdBySourceId.get('root-corporate'),
    status: 'ACTIVE',
  },
];

const protectedSourceEmployeeIds = new Set(
  ['CHRO', 'VP of HRMD', 'VP of Information Technology', 'IT Manager', 'Accounting Manager', 'HRMD Supervisor']
    .map((role) => MOCK_EMPLOYEES.find((employee) => employee.role === role)?.id)
    .filter((id): id is string => Boolean(id)),
);

const separatedSourceEmployeeIds = new Set(
  MOCK_EMPLOYEES
    .filter(
      (employee, index) =>
        index >= 20 &&
        !protectedSourceEmployeeIds.has(employee.id) &&
        index % 61 === 0,
    )
    .slice(0, 5)
    .map((employee) => employee.id),
);

const suspendedSourceEmployeeIds = new Set(
  MOCK_EMPLOYEES
    .filter(
      (employee, index) =>
        index >= 30 &&
        !protectedSourceEmployeeIds.has(employee.id) &&
        index % 73 === 0,
    )
    .slice(0, 3)
    .map((employee) => employee.id),
);

const probationarySourceEmployeeIds = new Set(
  MOCK_EMPLOYEES.slice(-18).map((employee) => employee.id),
);

function inferTrack(role: string, department: string): string {
  const text = `${sanitizeText(role)} ${sanitizeText(department)}`.toLowerCase();

  if (/information technology|developer|programmer|technical|systems|network|data center|qa/.test(text)) {
    return 'technology';
  }
  if (/human resource|hr|people/.test(text)) {
    return 'people';
  }
  if (/accounting|finance|credit|cash|ar |ap |compliance/.test(text)) {
    return 'finance';
  }
  if (/sales|marketing|customer service|telesales|product management/.test(text)) {
    return 'commercial';
  }
  if (/training|e-learning|aftersales|instructional/.test(text)) {
    return 'learning';
  }
  if (/warehouse|traffic|operations support|office services|driver|messenger|maintenance|janitor/.test(text)) {
    return 'operations';
  }
  if (/vp|chief|president|executive/.test(text)) {
    return 'leadership';
  }

  return 'corporate';
}

function inferEducationAttainment(role: string): string {
  const text = sanitizeText(role).toLowerCase();
  if (/chief|vp|president/.test(text)) {
    return "Master's Degree";
  }
  if (/manager|director|supervisor|lead|specialist|developer|analyst/.test(text)) {
    return "Bachelor's Degree";
  }
  if (/assistant|coordinator|clerk|cashier|encoder/.test(text)) {
    return "Bachelor's Degree";
  }
  return 'High School';
}

function inferCourse(track: string, attainment: string): string | undefined {
  if (attainment === 'High School') {
    return undefined;
  }

  switch (track) {
    case 'technology':
      return 'BS Information Technology';
    case 'people':
      return 'BS Psychology';
    case 'finance':
      return 'BS Accountancy';
    case 'commercial':
      return 'BS Business Administration';
    case 'learning':
      return 'BS Education';
    case 'operations':
      return 'BS Industrial Engineering';
    case 'leadership':
      return 'MBA';
    default:
      return 'BS Management';
  }
}

function inferBank(index: number): string {
  const banks = ['BDO', 'BPI', 'Metrobank', 'UnionBank', 'Security Bank', 'PNB'];
  return banks[index % banks.length];
}

function buildLifecycle(
  sourceEmployee: SourceEmployee,
  index: number,
) {
  if (separatedSourceEmployeeIds.has(sourceEmployee.id)) {
    return {
      employeeStatus: 'Inactive',
      employmentStatus: 'Separated',
      startDate: toIsoDate(2018 + (index % 5), (index % 12) + 1, ((index * 3) % 27) + 1),
      endDate: toIsoDate(2026, (index % 3) + 1, ((index * 5) % 27) + 1),
      jobType: 'Full-Time',
    };
  }

  if (suspendedSourceEmployeeIds.has(sourceEmployee.id)) {
    return {
      employeeStatus: 'Suspended',
      employmentStatus: 'Suspended',
      startDate: toIsoDate(2020 + (index % 4), ((index + 2) % 12) + 1, ((index * 7) % 27) + 1),
      endDate: undefined,
      jobType: 'Full-Time',
    };
  }

  if (probationarySourceEmployeeIds.has(sourceEmployee.id)) {
    return {
      employeeStatus: 'Active',
      employmentStatus: 'Probationary',
      startDate: toIsoDate(2026, (index % 4) + 1, ((index * 5) % 27) + 1),
      endDate: undefined,
      jobType: 'Full-Time',
    };
  }

  return {
    employeeStatus: 'Active',
    employmentStatus: 'Active',
    startDate: toIsoDate(2017 + (index % 8), ((index + 6) % 12) + 1, ((index * 11) % 27) + 1),
    endDate: undefined,
    jobType: 'Full-Time',
  };
}

const transformedEmployees = MOCK_EMPLOYEES.map((sourceEmployee, index) => {
  const sourcePosition = sourcePositionById.get(sourceEmployee.positionId);
  const lifecycle = buildLifecycle(sourceEmployee, index);
  const names = splitDisplayName(sourceEmployee.name);
  const path = buildOrgUnitPath(sourceEmployee.orgUnitId);
  const orgUnitJson = buildOrgUnitJson(sourceEmployee.orgUnitId);
  const track = inferTrack(sourceEmployee.role, sourceEmployee.department);
  const employeeNumber = `DLSI-${new Date(lifecycle.startDate).getUTCFullYear()}-${String(index + 1).padStart(4, '0')}`;

  return {
    sourceEmployee,
    employeeId: index + 1,
    assignmentId: index + 1,
    sourcePosition,
    track,
    employeeNumber,
    firstName: names.firstName,
    lastName: names.lastName,
    displayName: sanitizeText(sourceEmployee.name),
    roleTitle: sanitizeText(sourceEmployee.role),
    email: sourceEmployee.email.replace(/@.+$/, '@diwalearning.local'),
    phone: `09${String(170000000 + index).padStart(9, '0')}`,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(sanitizeText(sourceEmployee.name))}&background=1D4ED8&color=ffffff`,
    employeeStatus: lifecycle.employeeStatus,
    employmentStatus: lifecycle.employmentStatus,
    assignmentStartDate: lifecycle.startDate,
    assignmentEndDate: lifecycle.endDate,
    employmentStartDate: lifecycle.startDate,
    employmentEndDate: lifecycle.endDate,
    jobType: lifecycle.jobType,
    orgUnitJson,
    siteName: inferSiteName(path),
    city:
      siteCatalog.find((site) => site.name === inferSiteName(path))?.city ??
      'Makati',
  };
});

const employeeIdBySourceId = new Map(
  transformedEmployees.map((employee) => [employee.sourceEmployee.id, employee.employeeId]),
);

const positionAssignments = transformedEmployees.map((employee) => ({
  id: employee.assignmentId,
  positionId: positionIdBySourceId.get(employee.sourceEmployee.positionId)!,
  employeeId: employee.employeeId,
  startDate: employee.assignmentStartDate,
  endDate: employee.assignmentEndDate,
  assignmentType: 'PRIMARY',
  fte: employee.employmentStatus === 'Probationary' ? 0.9 : 1,
  version: 1,
}));

const employees = transformedEmployees.map((employee) => ({
  id: employee.employeeId,
  employeeNumber: employee.employeeNumber,
  firstName: employee.firstName,
  lastName: employee.lastName,
  displayName: employee.displayName,
  email: employee.email,
  phone: employee.phone,
  status: employee.employeeStatus,
  jobType: employee.jobType,
  roleTitle: employee.roleTitle,
  avatarUrl: employee.avatarUrl,
  primaryPositionAssignmentId: employee.assignmentId,
  orgUnitJson: employee.orgUnitJson,
}));

const employments = transformedEmployees.map((employee) => ({
  id: employee.employeeId,
  employeeId: employee.employeeId,
  positionAssignmentId: employee.assignmentId,
  status: employee.employmentStatus,
  jobType: employee.jobType,
  startDate: employee.employmentStartDate,
  endDate: employee.employmentEndDate,
  remarks: `${employee.roleTitle} assignment within ${employee.orgUnitJson.department ?? employee.orgUnitJson.division}.`,
}));

const employeeProfiles = transformedEmployees.map((employee, index) => {
  const birthYear = 1968 + (index % 25);
  const civilStatuses = ['Single', 'Married', 'Single', 'Married', 'Single'];
  return {
    employeeId: employee.employeeId,
    birthDate: toIsoDate(birthYear, (index % 12) + 1, ((index * 3) % 27) + 1),
    gender: index % 2 === 0 ? 'Male' : 'Female',
    civilStatus: civilStatuses[index % civilStatuses.length],
    residentialAddress: `${100 + index} ${employee.city} Business Park, ${employee.city}`,
    sssNo: `33-${String(4100000 + index).padStart(7, '0')}-${index % 9}`,
    tinNo: `245-781-${String(900 + index).padStart(3, '0')}-${String((index % 900) + 1).padStart(3, '0')}`,
    philhealthNo: `12-${String(983451200 + index).padStart(9, '0')}-${(index % 8) + 1}`,
    pagibigNo: `8100-${String(24560000 + index).padStart(8, '0')}`,
    bankName: inferBank(index),
    bankAccountNo: `011${String(100000000 + index).padStart(9, '0')}`,
  };
});

const educationRecords = transformedEmployees.map((employee, index) => {
  const attainment = inferEducationAttainment(employee.roleTitle);
  return {
    id: index + 1,
    employeeId: employee.employeeId,
    attainment,
    course: inferCourse(employee.track, attainment),
    school:
      employee.track === 'technology'
        ? 'Mapua University'
        : employee.track === 'people'
          ? 'University of Santo Tomas'
          : employee.track === 'finance'
            ? 'De La Salle University'
            : employee.track === 'commercial'
              ? 'Ateneo de Davao University'
              : employee.track === 'learning'
                ? 'Philippine Normal University'
                : 'Polytechnic University of the Philippines',
    dateGraduated: shiftIsoDate(employee.employmentStartDate, -4),
  };
});

const examRecords = transformedEmployees
  .filter((employee, index) => index % 4 === 0)
  .map((employee, index) => ({
    id: index + 1,
    employeeId: employee.employeeId,
    dateTaken: shiftIsoDate(employee.employmentStartDate, -1),
    name:
      employee.track === 'technology'
        ? 'AWS Solutions Architect Associate'
        : employee.track === 'people'
          ? 'People Analytics Certificate'
          : employee.track === 'finance'
            ? 'CPA Continuing Professional Development'
            : employee.track === 'commercial'
              ? 'Strategic Selling Certification'
              : employee.track === 'learning'
                ? 'Instructional Design Certification'
                : 'Lean Six Sigma Yellow Belt',
    rating: 'Passed',
    description: `Enterprise credential for ${employee.track} roles.`,
  }));

const employmentHistoryRecords = transformedEmployees.map((employee, index) => ({
  id: index + 1,
  employeeId: employee.employeeId,
  company:
    employee.track === 'technology'
      ? 'NorthBridge Digital Services'
      : employee.track === 'people'
        ? 'PeopleCore Advisory Inc.'
        : employee.track === 'finance'
          ? 'Harborline Financial Services'
          : employee.track === 'commercial'
            ? 'PrimeReach Distribution Corporation'
            : employee.track === 'learning'
              ? 'Edventure Learning Group'
              : 'Metro Operations Solutions',
  address: `${employee.city}, Philippines`,
  position: employee.roleTitle,
  department: sanitizeText(employee.sourceEmployee.department),
  startDate: shiftIsoDate(employee.employmentStartDate, -5),
  endDate: shiftIsoDate(employee.employmentStartDate, -1),
}));

const referenceContacts = transformedEmployees.map((employee, index) => ({
  id: index + 1,
  employeeId: employee.employeeId,
  firstName: ['Maria', 'Paolo', 'Cecilia', 'Ramon', 'Liza', 'Francis'][index % 6],
  lastName: ['Santos', 'Navarro', 'Padilla', 'Roxas', 'Lim', 'Cruz'][index % 6],
  position: `${employee.track === 'technology' ? 'Engineering' : 'Functional'} Manager`,
  contactNo: `0918${String(1234500 + index).padStart(7, '0')}`,
  business: employmentHistoryRecords[index].company,
  address: employmentHistoryRecords[index].address,
}));

const familyMembers = transformedEmployees.map((employee, index) => ({
  id: index + 1,
  employeeId: employee.employeeId,
  relationship: ['Spouse', 'Parent', 'Sibling', 'Child'][index % 4],
  firstName: ['Andrea', 'Miguel', 'Liza', 'Noel', 'Patricia', 'Mae'][index % 6],
  lastName: employee.lastName,
  birthday: shiftIsoDate(employeeProfiles[index].birthDate, -25),
  occupation: ['Teacher', 'Engineer', 'Entrepreneur', 'Nurse', 'Architect', 'Consultant'][index % 6],
  address: employeeProfiles[index].residentialAddress,
}));

const emergencyContacts = transformedEmployees.map((employee, index) => ({
  id: index + 1,
  employeeId: employee.employeeId,
  relationship: ['Spouse', 'Mother', 'Father', 'Sibling'][index % 4],
  firstName: ['Elena', 'Marco', 'Jessa', 'Rico', 'Aileen', 'Jon'][index % 6],
  lastName: employee.lastName,
  contactNo: `0917${String(9870000 + index).padStart(7, '0')}`,
  email: `emergency.${slugify(employee.displayName)}@diwalearning.test`,
}));

const pisTabs = initialPersonnelDataset.pisTabs.map((tab, index) => ({
  id: index + 1,
  code: sanitizeText(tab.code),
  name: sanitizeText(tab.name),
  description: tab.description ? sanitizeText(tab.description) : undefined,
  sortOrder: tab.sortOrder,
  isActive: tab.isActive,
  isSystem: tab.isSystem,
}));

const pisTabIdBySourceId = new Map(
  initialPersonnelDataset.pisTabs.map((tab, index) => [tab.id, index + 1]),
);

const pisFields = initialPersonnelDataset.pisFields.map((field, index) => ({
  id: index + 1,
  pisTabId: pisTabIdBySourceId.get(field.tabId)!,
  code: sanitizeText(field.code),
  label: sanitizeText(field.label),
  dataType: sanitizeText(field.dataType),
  isSensitive: field.isSensitive,
  sortOrder: field.sortOrder,
  isSystem: field.isSystem,
  sourceTable: field.sourceTable,
  sourceColumn: field.sourceColumn,
  placeholder: field.placeholder ? sanitizeText(field.placeholder) : undefined,
  helpText: field.helpText ? sanitizeText(field.helpText) : undefined,
}));

const pisFieldIdBySourceId = new Map(
  initialPersonnelDataset.pisFields.map((field, index) => [field.id, index + 1]),
);
const pisFieldIdByCode = new Map(pisFields.map((field) => [field.code, field.id]));

const pisFieldOptions = initialPersonnelDataset.pisFieldOptions.map((option, index) => ({
  id: index + 1,
  pisFieldId: pisFieldIdBySourceId.get(option.fieldId)!,
  code: sanitizeText(option.code),
  label: sanitizeText(option.label),
  sortOrder: option.sortOrder,
  isActive: option.isActive,
}));

const pisFieldPolicies = initialPersonnelDataset.pisFieldPolicies.map((policy, index) => ({
  id: index + 1,
  pisFieldId: pisFieldIdBySourceId.get(policy.fieldId)!,
  scopeType: sanitizeText(policy.scopeType).toUpperCase(),
  scopeId: policy.scopeId ? Number(policy.scopeId) : undefined,
  isEnabled: policy.isEnabled,
  isRequired: policy.isRequired,
  priority: policy.priority,
}));

const customAssetValues = transformedEmployees.flatMap((employee) => {
  const laptopEligible = ['technology', 'people', 'finance', 'leadership', 'commercial', 'learning'].includes(employee.track);
  const mobileEligible = ['commercial', 'leadership', 'people'].includes(employee.track);
  const records: Array<{
    employeeId: number;
    pisFieldId: number;
    valueJson: Record<string, string>;
    updatedBy: number;
  }> = [];

  if (laptopEligible) {
    records.push({
      employeeId: employee.employeeId,
      pisFieldId: pisFieldIdByCode.get('laptop_model')!,
      valueJson: { value: ['Dell Latitude 7440', 'ThinkPad T14', 'MacBook Pro 14'][employee.employeeId % 3] },
      updatedBy: 4,
    });
    records.push({
      employeeId: employee.employeeId,
      pisFieldId: pisFieldIdByCode.get('asset_tag')!,
      valueJson: { value: `AST-${String(employee.employeeId).padStart(4, '0')}` },
      updatedBy: 4,
    });
  }

  if (mobileEligible) {
    records.push({
      employeeId: employee.employeeId,
      pisFieldId: pisFieldIdByCode.get('mobile_plan')!,
      valueJson: { value: employee.track === 'leadership' ? 'Postpaid' : employee.employeeId % 2 === 0 ? 'Postpaid' : 'Prepaid' },
      updatedBy: 4,
    });
  }

  return records;
});

const employeeFieldValues = customAssetValues.map((value, index) => ({
  id: index + 1,
  ...value,
}));

const employeeFieldValueHistory = employeeFieldValues
  .filter((value) =>
    value.pisFieldId === pisFieldIdByCode.get('mobile_plan') ||
    value.pisFieldId === pisFieldIdByCode.get('laptop_model'),
  )
  .slice(0, 24)
  .map((value, index) => ({
    id: index + 1,
    employeeFieldValueId: value.id,
    previousValueJson:
      value.pisFieldId === pisFieldIdByCode.get('mobile_plan')
        ? { value: 'Prepaid' }
        : { value: 'ThinkPad T14' },
    changedBy: 4,
    changeReason:
      value.pisFieldId === pisFieldIdByCode.get('mobile_plan')
        ? 'Aligned mobile entitlement with field-travel coverage.'
        : 'Standardized issued hardware across imported enterprise users.',
  }));

const formulaBlueprints = [
  {
    sourceId: 'position-default-base-pay',
    code: 'POSITION_DEFAULT_BASE_PAY',
    name: 'Position Default Base Pay',
    expression: 'position.defaultBasePay',
    description: 'Uses the position default base pay anchor from job architecture.',
  },
  ...ENTERPRISE_PAY_COMPONENTS.filter(
    (component) => component.type === 'earning' && component.valueType === 'formula',
  ).map((component) => ({
    sourceId: component.formulaId!,
    code: sanitizeText(component.formulaId!).replace(/[^A-Za-z0-9]+/g, '_').toUpperCase(),
    name: sanitizeText(component.name),
    expression: String(component.fixedValue ?? 0),
    description: `${sanitizeText(component.name)} imported from unified-HRIS pay components.`,
  })),
];

const formulaIdBySourceId = new Map(
  formulaBlueprints.map((formula, index) => [formula.sourceId, index + 1]),
);

const formulas = formulaBlueprints.map((formula, index) => ({
  id: index + 1,
  code: formula.code,
  name: formula.name,
  expression: formula.expression,
  description: formula.description,
}));

const formulaVersions = formulaBlueprints.map((formula, index) => ({
  id: index + 1,
  formulaId: index + 1,
  versionNo: 'v2.0.0',
  expression: formula.expression,
  effectiveStartDate: orgStructureEffectiveStart,
  isCurrent: true,
  changeSummary: 'Imported from unified-HRIS enterprise pay component seed.',
}));

const sourceEarningComponents = ENTERPRISE_PAY_COMPONENTS.filter(
  (component) => component.type === 'earning',
);
const earningComponentIdBySourceId = new Map(
  sourceEarningComponents.map((component, index) => [component.id, index + 1]),
);

const earningComponents = sourceEarningComponents.map((component, index) => ({
  id: index + 1,
  code: sanitizeText(component.id).replace(/[^A-Za-z0-9]+/g, '_').toUpperCase(),
  name: sanitizeText(component.name),
  category:
    component.id === 'pc-basic'
      ? 'BASE_SALARY'
      : component.name.toLowerCase().includes('incentive')
        ? 'INCENTIVE'
        : 'ALLOWANCE',
  valueSource:
    component.id === 'pc-basic'
      ? 'ORG_ARCH_REFERENCE'
      : component.valueType === 'formula'
        ? 'FORMULA'
        : 'FIXED_AMOUNT',
  orgReferenceType: component.id === 'pc-basic' ? 'POSITION_BASE_SALARY' : undefined,
  fixedAmount:
    component.id === 'pc-basic' || component.valueType === 'formula'
      ? undefined
      : component.fixedValue,
  formulaVersionId:
    component.valueType === 'formula'
      ? formulaIdBySourceId.get(component.formulaId!)
      : undefined,
  isTaxableDefault: component.isTaxable,
  includeIn13thMonthDefault: component.includeIn13thMonth ?? false,
  status: component.isArchived ? 'INACTIVE' : 'ACTIVE',
  isSystem: component.isSystem ?? false,
  description: `${sanitizeText(component.name)} imported from unified-HRIS enterprise pay components.`,
}));

const payTemplatesByPosition = new Map<string, SourcePayTemplate[]>();
for (const template of ENTERPRISE_PAY_TEMPLATES) {
  const list = payTemplatesByPosition.get(template.targetId) ?? [];
  list.push(template);
  payTemplatesByPosition.set(template.targetId, list);
}

const payTemplateBlueprints = ENTERPRISE_PAY_TEMPLATES.map((template) => {
  const siblings = [...(payTemplatesByPosition.get(template.targetId) ?? [])].sort((left, right) =>
    sanitizeText(left.name).localeCompare(sanitizeText(right.name)),
  );
  const templateIndex = siblings.findIndex((sibling) => sibling.id === template.id);
  const baseTemplate = siblings[0];

  return {
    template,
    templateKind: templateIndex === 0 ? 'DEFAULT' : 'VARIANT',
    showInDefaultPicker: templateIndex === 0,
    baseTemplateId: baseTemplate.id,
  };
});

const earningTemplateFamilyIdBySourceId = new Map(
  payTemplateBlueprints.map((blueprint, index) => [blueprint.template.id, index + 1]),
);

const earningTemplateFamilies = payTemplateBlueprints.map((blueprint, index) => ({
  id: index + 1,
  baseEarningTemplateFamilyId:
    blueprint.baseTemplateId !== blueprint.template.id
      ? earningTemplateFamilyIdBySourceId.get(blueprint.baseTemplateId)
      : undefined,
  code: `TPL-${String(index + 1).padStart(4, '0')}`,
  name: sanitizeText(blueprint.template.name),
  templateKind: blueprint.templateKind,
  showInDefaultPicker: blueprint.showInDefaultPicker,
  payBasisApplicability: 'MONTHLY',
  status: 'ACTIVE',
  description: `Imported pay template for ${sanitizeText(blueprint.template.targetId)}${blueprint.template.targetSubLevelStepId ? ` (${sanitizeText(blueprint.template.targetSubLevelStepId)})` : ''}.`,
}));

const earningTemplateFamilyScopes = payTemplateBlueprints.map((blueprint, index) => ({
  id: index + 1,
  earningTemplateFamilyId: index + 1,
  scopeType: blueprint.template.targetType.toUpperCase(),
  scopeRefId: positionIdBySourceId.get(blueprint.template.targetId),
  isPrimary: true,
  notes: blueprint.template.targetSubLevelStepId
    ? `Applies to imported position sub-level ${sanitizeText(blueprint.template.targetSubLevelStepId)}.`
    : 'Applies to the imported standard position package.',
}));

const earningTemplateRevisions = payTemplateBlueprints.map((blueprint, index) => ({
  id: index + 1,
  earningTemplateFamilyId: index + 1,
  versionNo: 'v2.0.0',
  currencyCode: 'PHP',
  effectiveStartDate: orgStructureEffectiveStart,
  isCurrent: true,
  changeSummary: `Imported from unified-HRIS template ${sanitizeText(blueprint.template.id)}.`,
}));

const earningTemplateRevisionLines = payTemplateBlueprints.flatMap((blueprint, blueprintIndex) =>
  blueprint.template.components
    .filter((componentId) => earningComponentIdBySourceId.has(componentId))
    .map((componentId, componentIndex) => ({
      id: blueprintIndex * 10 + componentIndex + 1,
      earningTemplateRevisionId: blueprintIndex + 1,
      earningComponentId: earningComponentIdBySourceId.get(componentId)!,
      sortOrder: componentIndex + 1,
      isRequired: componentId === 'pc-basic' || componentId === 'pc-meal' || componentId === 'pc-trans',
    })),
);

const templateFamilyIdByTargetKey = new Map<string, number>();
for (const blueprint of payTemplateBlueprints) {
  templateFamilyIdByTargetKey.set(
    `${blueprint.template.targetId}:${blueprint.template.targetSubLevelStepId ?? ''}`,
    earningTemplateFamilyIdBySourceId.get(blueprint.template.id)!,
  );
}

function resolveTemplateFamilyId(sourcePosition: SourcePosition | undefined): number {
  if (!sourcePosition) {
    return 1;
  }

  const exactKey = `${sourcePosition.id}:${sourcePosition.subLevelsStepId ?? ''}`;
  const byExact = templateFamilyIdByTargetKey.get(exactKey);
  if (byExact) {
    return byExact;
  }

  const byPosition = templateFamilyIdByTargetKey.get(`${sourcePosition.id}:`);
  if (byPosition) {
    return byPosition;
  }

  const siblings = payTemplateBlueprints.find((blueprint) => blueprint.template.targetId === sourcePosition.id);
  return siblings ? earningTemplateFamilyIdBySourceId.get(siblings.template.id)! : 1;
}

const baseEmployeePayProfiles = transformedEmployees.map((employee) => ({
  id: employee.employeeId,
  employeeId: employee.employeeId,
  earningTemplateFamilyId: resolveTemplateFamilyId(employee.sourcePosition),
  payBasis: 'MONTHLY',
  effectiveStartDate: employee.employmentStartDate,
  effectiveEndDate: employee.employmentEndDate,
  status: employee.employmentStatus === 'Separated' ? 'INACTIVE' : 'ACTIVE',
  notes: `Assigned from imported position ${employee.sourceEmployee.positionId}.`,
}));

const recentEmployees = transformedEmployees.filter((employee) =>
  new Date(employee.employmentStartDate).getUTCFullYear() >= 2025,
);

const employeeOnboardingRecords = recentEmployees.slice(0, 28).map((employee, index) => ({
  id: index + 1,
  employeeId: employee.employeeId,
  status:
    employee.employmentStatus === 'Probationary'
      ? 'In Progress'
      : 'Completed',
  startDate: employee.employmentStartDate,
  completedStepsJson: {
    documents: true,
    orientation: true,
    systemAccess: employee.track !== 'operations',
    managerBriefing: true,
    statutoryEnrollment: employee.track !== 'operations',
  },
  notes:
    employee.employmentStatus === 'Probationary'
      ? 'Imported recent hire still within structured onboarding window.'
      : 'Imported onboarding checklist completed during rollout.',
}));

const separatedEmployees = transformedEmployees.filter(
  (employee) => employee.employmentStatus === 'Separated',
);

const employeeOffboardingRecords = separatedEmployees.map((employee, index) => ({
  id: index + 1,
  employeeId: employee.employeeId,
  reason: index % 2 === 0 ? 'Resignation' : 'End of Contract',
  effectiveDate: employee.employmentEndDate,
  clearanceStatus: index % 2 === 0 ? 'Completed' : 'In Progress',
  notes: 'Imported offboarding case retained for Phase 1 separation and clearance testing.',
}));

const loaCandidate = transformedEmployees.find(
  (employee) =>
    employee.employeeStatus === 'Active' &&
    ['commercial', 'operations', 'technology'].includes(employee.track),
)!;
const regularizationCandidate = transformedEmployees.find(
  (employee) => employee.employmentStatus === 'Probationary',
)!;
const payProfileCandidate = transformedEmployees.find(
  (employee) => employee.track === 'technology' && employee.employeeStatus === 'Active',
)!;
const separationCandidate = separatedEmployees[0];
const transferDraftCandidate = transformedEmployees.find(
  (employee) => employee.track === 'people' && employee.employeeStatus === 'Active',
)!;

const keyEmployeeByRole = (role: string) =>
  transformedEmployees.find((employee) => employee.sourceEmployee.role === role)!;

const keyEmployees = {
  chro: keyEmployeeByRole('CHRO'),
  vpHr: keyEmployeeByRole('VP of HRMD'),
  vpIt: keyEmployeeByRole('VP of Information Technology'),
  itManager: keyEmployeeByRole('IT Manager'),
  accountingManager: keyEmployeeByRole('Accounting Manager'),
  hrSupervisor: keyEmployeeByRole('HRMD Supervisor'),
  hrSpecialist: keyEmployeeByRole('HR Specialist'),
  executiveAssistant: keyEmployeeByRole('Executive Assistant'),
};

const employeeSelfServiceUser = transformedEmployees.find(
  (employee) => employee.employeeId === PHASE1_DEMO_ACCOUNT_MAP.employee.employeeId,
)!;

const users = [
  {
    id: 1,
    email: PHASE1_DEMO_ACCOUNT_MAP.superadmin.email,
    firstName: 'Platform',
    lastName: 'Admin',
    displayName: PHASE1_DEMO_ACCOUNT_MAP.superadmin.displayName,
    status: 'ACTIVE',
  },
  {
    id: 2,
    email: keyEmployees.chro.email,
    firstName: keyEmployees.chro.firstName,
    lastName: keyEmployees.chro.lastName,
    displayName: keyEmployees.chro.displayName,
    status: 'ACTIVE',
  },
  {
    id: 3,
    email: PHASE1_DEMO_ACCOUNT_MAP.approver.email,
    firstName: keyEmployees.vpHr.firstName,
    lastName: keyEmployees.vpHr.lastName,
    displayName: PHASE1_DEMO_ACCOUNT_MAP.approver.displayName,
    status: 'ACTIVE',
  },
  {
    id: 4,
    email: keyEmployees.hrSupervisor.email,
    firstName: keyEmployees.hrSupervisor.firstName,
    lastName: keyEmployees.hrSupervisor.lastName,
    displayName: keyEmployees.hrSupervisor.displayName,
    status: 'ACTIVE',
  },
  {
    id: 5,
    email: keyEmployees.accountingManager.email,
    firstName: keyEmployees.accountingManager.firstName,
    lastName: keyEmployees.accountingManager.lastName,
    displayName: keyEmployees.accountingManager.displayName,
    status: 'ACTIVE',
  },
  {
    id: 6,
    email: keyEmployees.vpIt.email,
    firstName: keyEmployees.vpIt.firstName,
    lastName: keyEmployees.vpIt.lastName,
    displayName: keyEmployees.vpIt.displayName,
    status: 'ACTIVE',
  },
  {
    id: 7,
    email: keyEmployees.itManager.email,
    firstName: keyEmployees.itManager.firstName,
    lastName: keyEmployees.itManager.lastName,
    displayName: keyEmployees.itManager.displayName,
    status: 'ACTIVE',
  },
  {
    id: 8,
    email: keyEmployees.hrSpecialist.email,
    firstName: keyEmployees.hrSpecialist.firstName,
    lastName: keyEmployees.hrSpecialist.lastName,
    displayName: keyEmployees.hrSpecialist.displayName,
    status: 'ACTIVE',
  },
  {
    id: 9,
    email: PHASE1_DEMO_ACCOUNT_MAP.employee.email,
    firstName: employeeSelfServiceUser.firstName,
    lastName: employeeSelfServiceUser.lastName,
    displayName: PHASE1_DEMO_ACCOUNT_MAP.employee.displayName,
    status: 'ACTIVE',
  },
];

const roles = [
  { id: 1, code: 'SUPERADMIN', name: 'Superadmin', description: 'Full platform access across all Phase 1 modules' },
  { id: 2, code: 'APPROVER', name: 'Approver', description: 'Acts on routed personnel and pay approvals' },
  { id: 3, code: 'EMPLOYEE', name: 'Employee', description: 'Uses employee self-service and personal profile workflows' },
];

const permissions = [
  { id: 1, code: 'ORG_MANAGE', name: 'Manage Org Structure', description: 'Can manage org structure resources' },
  { id: 2, code: 'PERSONNEL_MANAGE', name: 'Manage Personnel', description: 'Can manage personnel resources' },
  { id: 3, code: 'PAY_STRUCTURE_MANAGE', name: 'Manage Pay Structure', description: 'Can manage pay structure resources' },
  { id: 4, code: 'APPROVALS_MANAGE', name: 'Manage Approvals', description: 'Can manage approval resources' },
  { id: 5, code: 'RBAC_MANAGE', name: 'Manage RBAC', description: 'Can manage roles, permissions, and users' },
];

const systemModules = [
  { id: 1, code: 'ORG_STRUCTURE', name: 'Org Structure', description: 'Organization structure and job architecture' },
  { id: 2, code: 'PERSONNEL', name: 'Personnel', description: 'Personnel information system' },
  { id: 3, code: 'PAY_STRUCTURE', name: 'Pay Structure', description: 'Pay templates and employee pay setup' },
  { id: 4, code: 'APPROVALS', name: 'Approvals', description: 'Approval workflow configuration' },
  { id: 5, code: 'RBAC', name: 'RBAC', description: 'Roles and permissions' },
];

const permissionModuleConfigs = systemModules.map((module) => ({
  id: module.id,
  systemModuleId: module.id,
  code: `${module.code}_CORE`,
  name: `${module.name} Core`,
  description: `Core configuration for ${module.name}`,
}));

const permissionModuleConfigScopes = [
  { id: 1, permissionModuleConfigId: 1, code: 'ORG_GLOBAL', name: 'Global' },
  { id: 2, permissionModuleConfigId: 1, code: 'ORG_ORG_UNIT', name: 'Org Unit' },
  { id: 3, permissionModuleConfigId: 2, code: 'PERSONNEL_GLOBAL', name: 'Global' },
  { id: 4, permissionModuleConfigId: 2, code: 'PERSONNEL_EMPLOYEE', name: 'Employee' },
  { id: 5, permissionModuleConfigId: 3, code: 'PAY_POSITION', name: 'Position' },
  { id: 6, permissionModuleConfigId: 3, code: 'PAY_EMPLOYEE', name: 'Employee' },
  { id: 7, permissionModuleConfigId: 4, code: 'APPROVALS_GLOBAL', name: 'Global' },
  { id: 8, permissionModuleConfigId: 4, code: 'APPROVALS_ORG_UNIT', name: 'Org Unit' },
  { id: 9, permissionModuleConfigId: 5, code: 'RBAC_GLOBAL', name: 'Global' },
];

const permissionModuleConfigActions = [
  { id: 1, permissionModuleConfigId: 1, code: 'ORG_MANAGE', name: 'Manage Org Structure' },
  { id: 2, permissionModuleConfigId: 2, code: 'PERSONNEL_MANAGE', name: 'Manage Personnel' },
  { id: 3, permissionModuleConfigId: 3, code: 'PAY_MANAGE', name: 'Manage Pay Structure' },
  { id: 4, permissionModuleConfigId: 4, code: 'APPROVALS_APPROVE', name: 'Approve Requests' },
  { id: 5, permissionModuleConfigId: 5, code: 'RBAC_MANAGE', name: 'Manage RBAC' },
];

const permissionModuleConfigStates = [
  { id: 1, permissionModuleConfigId: 1, code: 'ORG_ACTIVE', name: 'Active' },
  { id: 2, permissionModuleConfigId: 2, code: 'PERSONNEL_ACTIVE', name: 'Active' },
  { id: 3, permissionModuleConfigId: 3, code: 'PAY_ACTIVE', name: 'Active' },
  { id: 4, permissionModuleConfigId: 4, code: 'APPROVALS_PENDING', name: 'Pending' },
  { id: 5, permissionModuleConfigId: 4, code: 'APPROVALS_APPROVED', name: 'Approved' },
  { id: 6, permissionModuleConfigId: 5, code: 'RBAC_ACTIVE', name: 'Active' },
];

const userRoleAssignments = [
  { id: 1, userId: 1, roleId: 1, isActive: true, assignedAt: roleAssignmentStart },
  { id: 2, userId: 2, roleId: 2, isActive: true, assignedAt: roleAssignmentStart },
  { id: 3, userId: 3, roleId: 2, isActive: true, assignedAt: roleAssignmentStart },
  { id: 4, userId: 4, roleId: 2, isActive: true, assignedAt: roleAssignmentStart },
  { id: 5, userId: 5, roleId: 2, isActive: true, assignedAt: roleAssignmentStart },
  { id: 6, userId: 6, roleId: 2, isActive: true, assignedAt: roleAssignmentStart },
  { id: 7, userId: 7, roleId: 2, isActive: true, assignedAt: roleAssignmentStart },
  { id: 8, userId: 8, roleId: 3, isActive: true, assignedAt: roleAssignmentStart },
  { id: 9, userId: 9, roleId: 3, isActive: true, assignedAt: roleAssignmentStart },
];

const rolePermissionAssignments = [
  ...permissions.map((permission, index) => ({
    id: index + 1,
    roleId: 1,
    permissionId: permission.id,
    systemModuleId: permission.id,
    isActive: true,
  })),
  { id: 6, roleId: 2, permissionId: 1, systemModuleId: 1, isActive: true },
  { id: 7, roleId: 2, permissionId: 2, systemModuleId: 2, isActive: true },
  { id: 8, roleId: 2, permissionId: 3, systemModuleId: 3, isActive: true },
  { id: 9, roleId: 2, permissionId: 4, systemModuleId: 4, isActive: true },
  { id: 10, roleId: 3, permissionId: 2, systemModuleId: 2, isActive: true },
];

const userSessions = [
  { id: 1, userId: 1, status: 'ACTIVE', userAgent: 'Seed Platform Session', ipAddress: '127.0.0.1', lastSeenAt: nowIso },
  { id: 2, userId: 2, status: 'ACTIVE', userAgent: 'Seed CHRO Session', ipAddress: '127.0.0.1', lastSeenAt: '2026-04-21T07:45:00.000Z' },
  { id: 3, userId: 3, status: 'ACTIVE', userAgent: 'Seed VP HR Session', ipAddress: '127.0.0.1', lastSeenAt: '2026-04-21T07:30:00.000Z' },
  { id: 4, userId: 9, status: 'ACTIVE', userAgent: 'Seed Employee Session', ipAddress: '127.0.0.1', lastSeenAt: '2026-04-21T06:55:00.000Z' },
];

const userAuthTokens = [
  { id: 1, userId: 1, tokenType: 'PERSONAL_ACCESS', tokenHash: 'seed-token-platform-admin', expiresAt: '2027-04-21T08:00:00.000Z' },
  { id: 2, userId: 2, tokenType: 'PERSONAL_ACCESS', tokenHash: 'seed-token-chro', expiresAt: '2027-04-21T08:00:00.000Z' },
  { id: 3, userId: 3, tokenType: 'PERSONAL_ACCESS', tokenHash: 'seed-token-vp-hr', expiresAt: '2027-04-21T08:00:00.000Z' },
  { id: 4, userId: 9, tokenType: 'PERSONAL_ACCESS', tokenHash: 'seed-token-employee', expiresAt: '2027-04-21T08:00:00.000Z' },
];

const approvalSetups = [
  { id: 1, code: 'PAF_APPROVAL', name: 'Personnel Action Approval Flow', moduleKey: 'PERSONNEL', actionType: 'PAF', description: 'Default approval flow for personnel action forms' },
  { id: 2, code: 'PAY_PROFILE_APPROVAL', name: 'Employee Pay Profile Approval', moduleKey: 'PAY_STRUCTURE', actionType: 'EMPLOYEE_PAY_PROFILE', description: 'Approval flow for pay profile changes and template exceptions' },
];

const approverSequences = [
  {
    id: 1,
    approvalSetupId: 1,
    stepNo: 1,
    name: 'HRBP Review',
    approverUserId: 4,
    approverPositionId: positionIdBySourceId.get(keyEmployees.hrSupervisor.sourceEmployee.positionId),
    requiredApprovals: 1,
  },
  {
    id: 2,
    approvalSetupId: 1,
    stepNo: 2,
    name: 'VP HR Review',
    approverUserId: 3,
    approverPositionId: positionIdBySourceId.get(keyEmployees.vpHr.sourceEmployee.positionId),
    requiredApprovals: 1,
  },
  {
    id: 3,
    approvalSetupId: 1,
    stepNo: 3,
    name: 'CHRO Approval',
    approverUserId: 2,
    approverPositionId: positionIdBySourceId.get(keyEmployees.chro.sourceEmployee.positionId),
    requiredApprovals: 1,
  },
  {
    id: 4,
    approvalSetupId: 2,
    stepNo: 1,
    name: 'Finance Review',
    approverUserId: 5,
    approverPositionId: positionIdBySourceId.get(keyEmployees.accountingManager.sourceEmployee.positionId),
    requiredApprovals: 1,
  },
  {
    id: 5,
    approvalSetupId: 2,
    stepNo: 2,
    name: 'Executive Sponsor Approval',
    approverUserId: 6,
    approverPositionId: positionIdBySourceId.get(keyEmployees.vpIt.sourceEmployee.positionId),
    requiredApprovals: 1,
  },
];

const approvalSequenceSecondaryApprovers = [
  { id: 1, approverSequenceId: 1, userId: 8 },
  { id: 2, approverSequenceId: 2, userId: 2 },
  { id: 3, approverSequenceId: 4, roleId: 2 },
  { id: 4, approverSequenceId: 5, userId: 7 },
];

const approvalDelegations = [
  { id: 1, fromUserId: 2, toUserId: 3, startDate: '2026-04-22T00:00:00.000Z', endDate: '2026-04-26T00:00:00.000Z', reason: 'CHRO attending regional leadership summit', status: 'ACTIVE' },
  { id: 2, fromUserId: 6, toUserId: 7, startDate: '2026-04-18T00:00:00.000Z', endDate: '2026-04-24T00:00:00.000Z', reason: 'VP IT on enterprise client roadshow', status: 'ACTIVE' },
];

const workflowAssignments = [
  { id: 1, approvalSetupId: 1, scopeType: 'ORG_UNIT', scopeRefId: orgUnitIdBySourceId.get('ou-corp-115'), isActive: true, notes: 'Applies to Human Resource Management actions' },
  { id: 2, approvalSetupId: 1, scopeType: 'ORG_UNIT', scopeRefId: orgUnitIdBySourceId.get('ou-corp-111'), isActive: true, notes: 'Applies to Information Technology actions' },
  { id: 3, approvalSetupId: 1, scopeType: 'ORG_UNIT', scopeRefId: orgUnitIdBySourceId.get('ou-corp-4'), isActive: true, notes: 'Applies to national sales field actions' },
  { id: 4, approvalSetupId: 2, scopeType: 'GLOBAL', isActive: true, notes: 'Default approval for all pay profile changes' },
];

const pafRecords = [
  {
    id: 1,
    employeeId: regularizationCandidate.employeeId,
    approvalSetupId: 1,
    approvalRequestId: 1,
    actionType: 'Regularization',
    effectiveDate: '2026-05-15T00:00:00.000Z',
    payloadJson: {
      probationEndDate: '2026-05-14',
      recommendedStatus: 'Regular',
      currentPositionAssignmentId: regularizationCandidate.assignmentId,
    },
    status: 'Pending Approval',
    submittedAt: '2026-04-18T02:30:00.000Z',
  },
  {
    id: 2,
    employeeId: separationCandidate.employeeId,
    approvalSetupId: 1,
    approvalRequestId: 4,
    actionType: 'Separation',
    effectiveDate: separationCandidate.employmentEndDate,
    payloadJson: {
      separationReason: 'Resignation',
      turnoverOwnerEmployeeId: keyEmployees.hrSupervisor.employeeId,
      lastWorkingDate: separationCandidate.employmentEndDate?.slice(0, 10),
    },
    status: 'Approved',
    submittedAt: '2026-04-03T01:00:00.000Z',
  },
  {
    id: 3,
    employeeId: loaCandidate.employeeId,
    approvalSetupId: 1,
    approvalRequestId: 3,
    actionType: 'Medical Leave',
    effectiveDate: '2026-04-10T00:00:00.000Z',
    payloadJson: {
      loaType: 'MEDICAL_LEAVE',
      expectedReturnDate: '2026-04-24',
      physicianClearanceReceived: true,
    },
    status: 'Approved',
    submittedAt: '2026-04-08T00:15:00.000Z',
    appliedAt: '2026-04-10T00:00:00.000Z',
  },
  {
    id: 4,
    employeeId: transferDraftCandidate.employeeId,
    approvalSetupId: 1,
    actionType: 'Department Transfer',
    effectiveDate: '2026-06-01T00:00:00.000Z',
    payloadJson: {
      fromOrgUnitId: orgUnitIdBySourceId.get(transferDraftCandidate.sourceEmployee.orgUnitId),
      toOrgUnitId: orgUnitIdBySourceId.get('ou-corp-111'),
      rationale: 'Align people analytics support with enterprise systems rollout.',
    },
    status: 'Draft',
  },
];

const approvalRequests = [
  { id: 1, approvalSetupId: 1, requestedByUserId: 4, employeeId: regularizationCandidate.employeeId, referenceType: 'PAF_RECORD', referenceId: 1, status: 'PENDING', submittedAt: '2026-04-18T02:30:00.000Z' },
  { id: 2, approvalSetupId: 2, requestedByUserId: 7, employeeId: payProfileCandidate.employeeId, referenceType: 'EMPLOYEE_PAY_PROFILE', referenceId: payProfileCandidate.employeeId, status: 'APPROVED', submittedAt: '2026-04-11T03:00:00.000Z', resolvedAt: '2026-04-11T10:00:00.000Z' },
  { id: 3, approvalSetupId: 1, requestedByUserId: 4, employeeId: loaCandidate.employeeId, referenceType: 'PAF_RECORD', referenceId: 3, status: 'APPROVED', submittedAt: '2026-04-08T00:15:00.000Z', resolvedAt: '2026-04-09T08:00:00.000Z' },
  { id: 4, approvalSetupId: 1, requestedByUserId: 8, employeeId: separationCandidate.employeeId, referenceType: 'PAF_RECORD', referenceId: 2, status: 'APPROVED', submittedAt: '2026-04-03T01:00:00.000Z', resolvedAt: '2026-04-04T07:30:00.000Z' },
];

const employeePayProfiles = baseEmployeePayProfiles.map((profile) => ({
  ...profile,
  approvalRequestId:
    profile.employeeId === payProfileCandidate.employeeId
      ? 2
      : undefined,
}));

const approvalWorkflows = [
  { id: 1, approvalRequestId: 1, approverSequenceId: 1, approverUserId: 4, status: 'APPROVED', actedAt: '2026-04-18T06:10:00.000Z', comments: 'Onboarding and probation review complete.' },
  { id: 2, approvalRequestId: 1, approverSequenceId: 2, approverUserId: 3, status: 'PENDING' },
  { id: 3, approvalRequestId: 2, approverSequenceId: 4, approverUserId: 5, status: 'APPROVED', actedAt: '2026-04-11T06:15:00.000Z', comments: 'Compensation package aligned to imported template revision.' },
  { id: 4, approvalRequestId: 2, approverSequenceId: 5, approverUserId: 6, status: 'APPROVED', actedAt: '2026-04-11T10:00:00.000Z', comments: 'Approved for systems rollout retention package.' },
  { id: 5, approvalRequestId: 3, approverSequenceId: 1, approverUserId: 4, status: 'APPROVED', actedAt: '2026-04-08T04:30:00.000Z', comments: 'Medical documents uploaded and verified.' },
  { id: 6, approvalRequestId: 3, approverSequenceId: 3, approverUserId: 2, status: 'APPROVED', actedAt: '2026-04-09T08:00:00.000Z', comments: 'Leave approved.' },
  { id: 7, approvalRequestId: 4, approverSequenceId: 1, approverUserId: 4, status: 'APPROVED', actedAt: '2026-04-03T05:00:00.000Z', comments: 'Exit clearance initiated.' },
  { id: 8, approvalRequestId: 4, approverSequenceId: 2, approverUserId: 3, status: 'APPROVED', actedAt: '2026-04-03T11:00:00.000Z', comments: 'Separation endorsed based on resignation documents.' },
  { id: 9, approvalRequestId: 4, approverSequenceId: 3, approverUserId: 2, status: 'APPROVED', actedAt: '2026-04-04T07:30:00.000Z', comments: 'Approved.' },
];

const approvalWorkflowNotes = [
  { id: 1, approvalWorkflowId: 1, authorUserId: 4, noteType: 'COMMENT', note: 'Regularization package and performance review attached.' },
  { id: 2, approvalWorkflowId: 2, authorUserId: 3, noteType: 'SYSTEM', note: 'Awaiting VP HR review as of April 21, 2026.' },
  { id: 3, approvalWorkflowId: 3, authorUserId: 5, noteType: 'SYSTEM', note: 'Imported pay-template mapping verified against position package.' },
  { id: 4, approvalWorkflowId: 5, authorUserId: 4, noteType: 'COMMENT', note: 'Return-to-work expectations aligned with direct supervisor.' },
  { id: 5, approvalWorkflowId: 7, authorUserId: 8, noteType: 'COMMENT', note: 'Company assets and access deprovisioning checklist opened.' },
  { id: 6, approvalWorkflowId: 9, authorUserId: 2, noteType: 'SYSTEM', note: 'Separation approved and linked to offboarding record.' },
];

const employeeLoaRecords = [
  {
    id: 1,
    employeeId: loaCandidate.employeeId,
    loaType: 'MEDICAL_LEAVE',
    startDate: '2026-04-10T00:00:00.000Z',
    expectedReturnDate: '2026-04-24T00:00:00.000Z',
    pauseAccruals: false,
    haltPayrollExpectations: false,
    pafRecordId: 3,
    notes: 'Approved short medical leave seeded for Phase 1 approvals and personnel flows.',
  },
];

const employeeProfileHistory = transformedEmployees.slice(0, 18).map((employee, index) => ({
  id: index + 1,
  employeeId: employee.employeeId,
  fieldName: ['civilStatus', 'residentialAddress', 'bankName'][index % 3],
  previousValue:
    index % 3 === 0
      ? 'Single'
      : index % 3 === 1
        ? `${employee.city} Old Address`
        : 'BPI',
  newValue:
    index % 3 === 0
      ? 'Married'
      : index % 3 === 1
        ? employeeProfiles[index].residentialAddress
        : employeeProfiles[index].bankName,
  effectiveDate: toIsoDate(2025 + (index % 2), ((index + 2) % 12) + 1, ((index * 7) % 27) + 1),
  changeSource: ['HR_UPDATE', 'EMPLOYEE_SELF_SERVICE', 'PAYROLL_UPDATE'][index % 3],
  changeReason:
    index % 3 === 0
      ? 'Civil status update'
      : index % 3 === 1
        ? 'Residence relocation closer to assigned site'
        : 'Payroll disbursement bank change',
  changedAt: toIsoDate(2025 + (index % 2), ((index + 2) % 12) + 1, ((index * 7) % 27) + 1),
  changedBy: [8, 4, 5][index % 3],
}));

export const seedData = {
  users,
  roles,
  permissions,
  systemModules,
  permissionModuleConfigs,
  permissionModuleConfigScopes,
  permissionModuleConfigActions,
  permissionModuleConfigStates,
  userRoleAssignments,
  rolePermissionAssignments,
  userSessions,
  userAuthTokens,
  hierarchyLevels,
  sites: siteCatalog,
  orgUnits,
  companyProfiles,
  orgUnitClosures,
  orgUnitVersions,
  ranks,
  rankLevels,
  salaryGrades,
  salaryGradeSteps,
  positionTemplates,
  positionProfiles,
  positionSubLevels,
  positions,
  positionAssignments,
  employees,
  employments,
  employeeProfiles,
  educationRecords,
  examRecords,
  employmentHistoryRecords,
  referenceContacts,
  familyMembers,
  emergencyContacts,
  pisTabs,
  pisFields,
  pisFieldOptions,
  pisFieldPolicies,
  employeeFieldValues,
  employeeFieldValueHistory,
  employeeOnboardingRecords,
  employeeOffboardingRecords,
  formulas,
  formulaVersions,
  earningComponents,
  earningTemplateFamilies,
  earningTemplateFamilyScopes,
  earningTemplateRevisions,
  earningTemplateRevisionLines,
  approvalSetups,
  approverSequences,
  approvalSequenceSecondaryApprovers,
  approvalDelegations,
  workflowAssignments,
  approvalRequests,
  approvalWorkflows,
  approvalWorkflowNotes,
  pafRecords,
  employeeLoaRecords,
  employeeProfileHistory,
  employeePayProfiles,
} as const;
