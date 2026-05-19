import { PayTemplate, Rank, RankPosition, SubLevelStep } from '../types';
import { MOCK_GRADES, MOCK_POSITIONS, MOCK_RANKS } from './corporateMockData';
import { ENTERPRISE_PAY_COMPONENTS } from './payComponentsData';

type CompensationFamily =
  | 'support'
  | 'professional'
  | 'specialist'
  | 'manager'
  | 'director'
  | 'executive';

const VALID_COMPONENT_IDS = new Set(ENTERPRISE_PAY_COMPONENTS.map(component => component.id));

const FAMILY_COMPONENTS: Record<CompensationFamily, string[]> = {
  support: ['pc-basic', 'pc-meal', 'pc-trans', 'pc-cloth'],
  professional: ['pc-basic', 'pc-meal', 'pc-trans', 'pc-comm', 'pc-perf'],
  specialist: ['pc-basic', 'pc-tech', 'pc-comm', 'pc-meal', 'pc-trans', 'pc-oncall', 'pc-perf'],
  manager: ['pc-basic', 'pc-lead', 'pc-rep', 'pc-comm', 'pc-trans', 'pc-perf'],
  director: ['pc-basic', 'pc-rep', 'pc-car', 'pc-hous', 'pc-comm', 'pc-perf'],
  executive: ['pc-basic', 'pc-lead', 'pc-rep', 'pc-car', 'pc-hous', 'pc-comm', 'pc-perf']
};

const RANK_ADD_ONS: Record<string, string[]> = {
  'r-sup': ['pc-lead'],
  'r-m': ['pc-lead', 'pc-rep'],
  'r-x': ['pc-lead', 'pc-rep', 'pc-car', 'pc-hous']
};

/**
 * Extracts the numeric salary-grade level used by resolveFamily to classify compensation packages.
 */
const getGradeNumber = (gradeId?: string): number => {
  if (!gradeId) return 0;
  const match = gradeId.match(/sg-(\d+)/i);
  return match ? Number(match[1]) : 0;
};

/**
 * Chooses the compensation family that drives default component selection for generated pay templates.
 */
const resolveFamily = (gradeId?: string, rankId?: string): CompensationFamily => {
  if (rankId === 'r-x') return 'executive';

  const gradeNumber = getGradeNumber(gradeId);

  if (gradeNumber >= 15) return 'executive';
  if (gradeNumber >= 13) return 'director';
  if (gradeNumber >= 11) return 'manager';
  if (gradeNumber >= 7) return 'specialist';
  if (gradeNumber >= 5) return 'professional';

  return 'support';
};

/**
 * Finds the rank position definition, including leveled rank positions, for generateTemplates.
 */
const getRankPosition = (rank: Rank, rankPositionId?: string): RankPosition | undefined => {
  if (!rankPositionId) return undefined;

  if (rank.mode === 'leveled' && rank.levels) {
    for (const level of rank.levels) {
      const found = level.positions.find(position => position.id === rankPositionId);
      if (found) return found;
    }
  }

  if (rank.mode === 'flat' && rank.positions) {
    return rank.positions.find(position => position.id === rankPositionId);
  }

  return undefined;
};

/**
 * Builds the component id list for a pay template and filters it against ENTERPRISE_PAY_COMPONENTS.
 */
const buildComponents = (family: CompensationFamily, rankId?: string): string[] => {
  const familyComponents = FAMILY_COMPONENTS[family];
  const rankAddOns = rankId ? RANK_ADD_ONS[rankId] || [] : [];

  return Array.from(
    new Set(['pc-basic', ...familyComponents.filter(component => component !== 'pc-basic'), ...rankAddOns])
  ).filter(componentId => VALID_COMPONENT_IDS.has(componentId));
};

/**
 * Chooses a base pay from the salary grade when available, falling back to the position default amount.
 */
const resolveBasePay = (positionDefaultBasePay: number, salaryGradeId?: string): number => {
  const grade = MOCK_GRADES.find(item => item.id === salaryGradeId);
  return grade?.amount || positionDefaultBasePay;
};

/**
 * Creates display names for generated pay templates used later by dummy-data.ts earning template families.
 */
const buildTemplateName = (positionTitle: string, step?: SubLevelStep): string => {
  if (step) {
    return `${positionTitle} - ${step.name} Compensation Package`;
  }

  return `${positionTitle} Standard Package`;
};

/**
 * Generates one or more pay templates per position, including sub-level variants, for enterprise pay seed data.
 */
const generateTemplates = (): PayTemplate[] => {
  const templates: PayTemplate[] = [];

  MOCK_POSITIONS.forEach(position => {
    const rank = MOCK_RANKS.find(item => item.id === position.rankId);
    if (!rank) return;

    const rankPosition = getRankPosition(rank, position.rankPositionId);
    const rankSubLevels = rankPosition?.subLevels || [];

    if (rankSubLevels.length > 0) {
      rankSubLevels.forEach(step => {
        const family = resolveFamily(step.salaryGradeId, position.rankId);
        templates.push({
          id: `pt-${position.id}-${step.id}`,
          name: buildTemplateName(position.title, step),
          targetType: 'Position',
          targetId: position.id,
          targetSubLevelStepId: step.id,
          basePay: resolveBasePay(position.defaultBasePay, step.salaryGradeId),
          components: buildComponents(family, position.rankId)
        });
      });

      return;
    }

    const family = resolveFamily(position.salaryGradeId, position.rankId);

    templates.push({
      id: `pt-${position.id}`,
      name: buildTemplateName(position.title),
      targetType: 'Position',
      targetId: position.id,
      basePay: resolveBasePay(position.defaultBasePay, position.salaryGradeId),
      components: buildComponents(family, position.rankId)
    });
  });

  return templates;
};

export const ENTERPRISE_PAY_TEMPLATES = generateTemplates();
