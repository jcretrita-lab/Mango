import {
  HierarchyLevel,
  JobArchitectureData,
  OrgUnit,
  Position,
  PositionProfile,
  PositionSubLevel,
  PositionTemplate,
  Rank,
  SalaryGrade,
} from "../types";
import {
  MOCK_ORG_UNITS,
  MOCK_POSITIONS,
  MOCK_RANKS,
  MOCK_UNIT_TYPES,
} from "./corporateMockData";
import {
  MOCK_ORG_UNITS_SCHOOL,
  MOCK_POSITIONS_SCHOOL,
  MOCK_RANKS_SCHOOL,
} from "./schoolMockData";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "item";

const unique = <T,>(values: T[]) => Array.from(new Set(values));

const DEFAULT_SALARY_GRADES: SalaryGrade[] = [
  { id: "sg-1", code: "SG-1", name: "Utility / Support I", rateType: "range", type: "RANGE", minSalary: 15000, maxSalary: 17000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 15000 }, { id: "s2", name: "Step 2", amount: 16000 }, { id: "s3", name: "Step 3", amount: 17000 }] },
  { id: "sg-2", code: "SG-2", name: "Utility / Support II", rateType: "range", type: "RANGE", minSalary: 17000, maxSalary: 20000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 17000 }, { id: "s2", name: "Step 2", amount: 18500 }, { id: "s3", name: "Step 3", amount: 20000 }] },
  { id: "sg-3", code: "SG-3", name: "Clerical / Staff I", rateType: "range", type: "RANGE", minSalary: 20000, maxSalary: 24000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 20000 }, { id: "s2", name: "Step 2", amount: 22000 }, { id: "s3", name: "Step 3", amount: 24000 }] },
  { id: "sg-4", code: "SG-4", name: "Clerical / Staff II", rateType: "range", type: "RANGE", minSalary: 24000, maxSalary: 28000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 24000 }, { id: "s2", name: "Step 2", amount: 26000 }, { id: "s3", name: "Step 3", amount: 28000 }] },
  { id: "sg-5", code: "SG-5", name: "Professional I", rateType: "range", type: "RANGE", minSalary: 28000, maxSalary: 36000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 28000 }, { id: "s2", name: "Step 2", amount: 32000 }, { id: "s3", name: "Step 3", amount: 36000 }] },
  { id: "sg-6", code: "SG-6", name: "Professional II", rateType: "range", type: "RANGE", minSalary: 36000, maxSalary: 45000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 36000 }, { id: "s2", name: "Step 2", amount: 40000 }, { id: "s3", name: "Step 3", amount: 45000 }] },
  { id: "sg-7", code: "SG-7", name: "Specialist I", rateType: "range", type: "RANGE", minSalary: 45000, maxSalary: 58000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 45000 }, { id: "s2", name: "Step 2", amount: 50000 }, { id: "s3", name: "Step 3", amount: 58000 }] },
  { id: "sg-8", code: "SG-8", name: "Specialist II", rateType: "range", type: "RANGE", minSalary: 58000, maxSalary: 72000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 58000 }, { id: "s2", name: "Step 2", amount: 65000 }, { id: "s3", name: "Step 3", amount: 72000 }] },
  { id: "sg-9", code: "SG-9", name: "Senior Specialist I", rateType: "range", type: "RANGE", minSalary: 72000, maxSalary: 90000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 72000 }, { id: "s2", name: "Step 2", amount: 80000 }, { id: "s3", name: "Step 3", amount: 90000 }] },
  { id: "sg-10", code: "SG-10", name: "Senior Specialist II", rateType: "range", type: "RANGE", minSalary: 90000, maxSalary: 115000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 90000 }, { id: "s2", name: "Step 2", amount: 100000 }, { id: "s3", name: "Step 3", amount: 115000 }] },
  { id: "sg-11", code: "SG-11", name: "Principal / Manager I", rateType: "range", type: "RANGE", minSalary: 115000, maxSalary: 145000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 115000 }, { id: "s2", name: "Step 2", amount: 130000 }, { id: "s3", name: "Step 3", amount: 145000 }] },
  { id: "sg-12", code: "SG-12", name: "Principal / Manager II", rateType: "range", type: "RANGE", minSalary: 145000, maxSalary: 185000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 145000 }, { id: "s2", name: "Step 2", amount: 165000 }, { id: "s3", name: "Step 3", amount: 185000 }] },
  { id: "sg-13", code: "SG-13", name: "Director I", rateType: "range", type: "RANGE", minSalary: 185000, maxSalary: 240000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 185000 }, { id: "s2", name: "Step 2", amount: 210000 }, { id: "s3", name: "Step 3", amount: 240000 }] },
  { id: "sg-14", code: "SG-14", name: "Director II", rateType: "range", type: "RANGE", minSalary: 240000, maxSalary: 320000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 240000 }, { id: "s2", name: "Step 2", amount: 280000 }, { id: "s3", name: "Step 3", amount: 320000 }] },
  { id: "sg-15", code: "SG-15", name: "Vice President I", rateType: "range", type: "RANGE", minSalary: 320000, maxSalary: 440000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 320000 }, { id: "s2", name: "Step 2", amount: 380000 }, { id: "s3", name: "Step 3", amount: 440000 }] },
  { id: "sg-16", code: "SG-16", name: "Vice President II", rateType: "range", type: "RANGE", minSalary: 440000, maxSalary: 600000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 440000 }, { id: "s2", name: "Step 2", amount: 500000 }, { id: "s3", name: "Step 3", amount: 600000 }] },
  { id: "sg-17", code: "SG-17", name: "Executive VP", rateType: "range", type: "RANGE", minSalary: 600000, maxSalary: 850000, currency: "PHP", steps: [{ id: "s1", name: "Step 1", amount: 600000 }, { id: "s2", name: "Step 2", amount: 700000 }, { id: "s3", name: "Step 3", amount: 850000 }] },
  { id: "sg-18", code: "SG-18", name: "C-Suite / Chief", rateType: "fixed", type: "ALIGNED", minSalary: 850000, maxSalary: 850000, currency: "PHP", steps: [] },
];

export const getGradeBaseAmount = (grade?: SalaryGrade) => {
  if (!grade) return 0;
  if (typeof grade.amount === "number") return grade.amount;
  if (grade.steps && grade.steps.length > 0) return grade.steps[0].amount;
  return grade.minSalary || 0;
};

const normalizeGrade = (grade: SalaryGrade): SalaryGrade => {
  const rateType =
    grade.rateType ||
    (grade.type === "ALIGNED" ||
    (grade.minSalary !== undefined && grade.maxSalary !== undefined && grade.minSalary === grade.maxSalary)
      ? "fixed"
      : "range");

  const minSalary = grade.minSalary ?? grade.amount ?? grade.steps?.[0]?.amount ?? 0;
  const maxSalary = grade.maxSalary ?? (rateType === "fixed" ? minSalary : minSalary);
  const next: SalaryGrade = {
    ...grade,
    rateType,
    type: rateType === "fixed" ? "ALIGNED" : "RANGE",
    minSalary,
    maxSalary,
    currency: grade.currency || "PHP",
    steps: clone(grade.steps || []),
  };
  next.amount = getGradeBaseAmount(next);
  return next;
};

const stripRankDefinitions = (ranks: Rank[]): Rank[] =>
  ranks.map((rank) => ({
    id: rank.id,
    name: rank.name,
    order: rank.order,
    color: rank.color,
    mode: rank.mode,
    positions: rank.mode === "flat" ? [] : undefined,
    levels:
      rank.mode === "leveled"
        ? (rank.levels || []).map((level) => ({
            id: level.id,
            code: level.code,
            positions: [],
          }))
        : undefined,
  }));

const buildHierarchyLevelsFromTypes = (
  types: { id: string; name: string; level: number }[]
): HierarchyLevel[] =>
  types
    .map((type) => ({
      id: `hl-${slugify(type.name)}`,
      name: type.name,
      order: type.level,
    }))
    .sort((a, b) => a.order - b.order);

const buildHierarchyLevelsFromOrgUnits = (orgUnits: OrgUnit[]): HierarchyLevel[] => {
  const seen = new Map<string, HierarchyLevel>();
  const walk = (units: OrgUnit[], depth: number) => {
    units.forEach((unit) => {
      const key = unit.type.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, {
          id: `hl-${slugify(unit.type)}`,
          name: unit.type,
          order: depth + 1,
        });
      }
      walk(unit.children, depth + 1);
    });
  };
  walk(orgUnits, 0);
  return Array.from(seen.values()).sort((a, b) => a.order - b.order);
};

const annotateHierarchyLevels = (orgUnits: OrgUnit[], hierarchyLevels: HierarchyLevel[]): OrgUnit[] => {
  const levelLookup = new Map(
    hierarchyLevels.map((level) => [level.name.toLowerCase(), level.id])
  );
  const apply = (units: OrgUnit[]): OrgUnit[] =>
    units.map((unit) => ({
      ...unit,
      hierarchyLevelId: levelLookup.get(unit.type.toLowerCase()),
      children: apply(unit.children || []),
    }));
  return apply(orgUnits);
};

const buildPositionTemplatesFromRanks = (ranks: Rank[]) => {
  const templateMap = new Map<string, PositionTemplate>();
  const legacyProfileMap = new Map<string, { templateId: string; profileId: string }>();

  const ensureTemplate = (name: string, rankName?: string) => {
    const key = name.toLowerCase();
    const existing = templateMap.get(key);
    if (existing) return existing;
    const template: PositionTemplate = {
      id: `tpl-${slugify(name)}`,
      name,
      family: rankName,
      profiles: [],
    };
    templateMap.set(key, template);
    return template;
  };

  const addProfile = (
    template: PositionTemplate,
    rank: Rank,
    levelCode: string | undefined,
    levelId: string | undefined,
    position: {
      id: string;
      name: string;
      salaryGradeId?: string;
      subLevels?: { id: string; name: string; salaryGradeId: string }[];
    }
  ) => {
    const progressionMode = position.subLevels && position.subLevels.length > 0 ? "sub_levels" : "base_grade";
    const subLevels: PositionSubLevel[] = (position.subLevels || []).map((step, index) => ({
      id: step.id,
      name: step.name,
      order: index + 1,
      salaryGradeId: step.salaryGradeId,
    }));
    const validGradeIds =
      progressionMode === "sub_levels"
        ? unique(subLevels.map((step) => step.salaryGradeId))
        : position.salaryGradeId
          ? [position.salaryGradeId]
          : [];

    const profile: PositionProfile = {
      id: `profile-${position.id}`,
      label: levelCode ? `${rank.name} • ${levelCode}` : rank.name,
      rankId: rank.id,
      rankLevelId: levelId,
      defaultGradeId: progressionMode === "base_grade" ? position.salaryGradeId : undefined,
      validGradeIds,
      progressionMode,
      subLevels,
      legacyRankPositionId: position.id,
    };
    template.profiles.push(profile);
    legacyProfileMap.set(position.id, { templateId: template.id, profileId: profile.id });
  };

  ranks.forEach((rank) => {
    if (rank.mode === "flat") {
      (rank.positions || []).forEach((position) => {
        addProfile(ensureTemplate(position.name, rank.name), rank, undefined, undefined, position);
      });
      return;
    }

    (rank.levels || []).forEach((level) => {
      level.positions.forEach((position) => {
        addProfile(ensureTemplate(position.name, rank.name), rank, level.code, level.id, position);
      });
    });
  });

  return {
    positionTemplates: Array.from(templateMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    legacyProfileMap,
  };
};

const annotatePositions = (
  positions: Position[],
  legacyProfileMap: Map<string, { templateId: string; profileId: string }>
): Position[] =>
  positions.map((position) => {
    const profileRef = position.rankPositionId
      ? legacyProfileMap.get(position.rankPositionId)
      : undefined;

    return {
      ...position,
      positionTemplateId: profileRef?.templateId,
      positionProfileId: profileRef?.profileId,
      plannedHeadcount: position.plannedHeadcount ?? 1,
      fte: position.fte ?? 1,
    };
  });

const buildSchoolGrades = (): SalaryGrade[] => {
  const defaultGrades = new Map(DEFAULT_SALARY_GRADES.map((grade) => [grade.id, normalizeGrade(grade)]));
  const gradeIds = unique(
    [
      ...MOCK_POSITIONS_SCHOOL.map((position) => position.salaryGradeId).filter(Boolean),
      ...MOCK_RANKS_SCHOOL.flatMap((rank) =>
        (rank.positions || []).map((position) => position.salaryGradeId).filter(Boolean)
      ),
    ] as string[]
  );

  return gradeIds.map((gradeId) => {
    const existing = defaultGrades.get(gradeId);
    if (existing) return clone(existing);

    const matchingPositions = MOCK_POSITIONS_SCHOOL.filter((position) => position.salaryGradeId === gradeId);
    const averagePay =
      matchingPositions.length > 0
        ? Math.round(
            matchingPositions.reduce((sum, position) => sum + position.defaultBasePay, 0) /
              matchingPositions.length
          )
        : 0;

    return normalizeGrade({
      id: gradeId,
      code: gradeId.toUpperCase(),
      name: `School Grade ${gradeId.replace("sg-", "")}`,
      rateType: "range",
      minSalary: Math.max(0, Math.round(averagePay * 0.9)),
      maxSalary: Math.round(averagePay * 1.1),
      currency: "PHP",
      steps: [],
      amount: averagePay,
    });
  });
};

export const buildInitialJobArchitecture = (
  businessMode: "corporate" | "school"
): JobArchitectureData => {
  if (businessMode === "school") {
    const hierarchyLevels = buildHierarchyLevelsFromOrgUnits(MOCK_ORG_UNITS_SCHOOL);
    const { positionTemplates, legacyProfileMap } = buildPositionTemplatesFromRanks(MOCK_RANKS_SCHOOL);

    return {
      salaryGrades: buildSchoolGrades(),
      ranks: stripRankDefinitions(clone(MOCK_RANKS_SCHOOL)),
      positionTemplates,
      hierarchyLevels,
      orgUnits: annotateHierarchyLevels(clone(MOCK_ORG_UNITS_SCHOOL), hierarchyLevels),
      positions: annotatePositions(clone(MOCK_POSITIONS_SCHOOL), legacyProfileMap),
    };
  }

  const hierarchyLevels = buildHierarchyLevelsFromTypes(clone(MOCK_UNIT_TYPES));
  const { positionTemplates, legacyProfileMap } = buildPositionTemplatesFromRanks(MOCK_RANKS);

  return {
    salaryGrades: DEFAULT_SALARY_GRADES.map((grade) => normalizeGrade(clone(grade))),
    ranks: stripRankDefinitions(clone(MOCK_RANKS)),
    positionTemplates,
    hierarchyLevels,
    orgUnits: annotateHierarchyLevels(clone(MOCK_ORG_UNITS), hierarchyLevels),
    positions: annotatePositions(clone(MOCK_POSITIONS), legacyProfileMap),
  };
};
