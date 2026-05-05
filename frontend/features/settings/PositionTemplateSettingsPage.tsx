import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  Briefcase,
  GitBranch,
  Users,
} from 'lucide-react';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SearchField,
  SectionCard,
  StatCard,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import {
  type PositionTemplateRecord,
  type PositionProfileRecord,
  type RankRecord,
  type RankLevelRecord,
  type SalaryGradeRecord,
  type PositionRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { MiniMetric } from './components/SettingsUi';
import { InfoGrid } from '../personnel/components/EmployeeProfileComponents';

export default function PositionTemplateSettingsPage() {
  usePageTitle('Position Template');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    positionTemplates: '/org-structure/position-templates',
    positionProfiles: '/org-structure/position-profiles',
    ranks: '/org-structure/ranks',
    rankLevels: '/org-structure/rank-levels',
    salaryGrades: '/pay-structure/salary-grades',
    positions: '/org-structure/positions',
  });

  const view = useMemo(() => {
    const positionTemplates = data.positionTemplates as PositionTemplateRecord[];
    const positionProfiles = data.positionProfiles as PositionProfileRecord[];
    const ranks = data.ranks as RankRecord[];
    const rankLevels = data.rankLevels as RankLevelRecord[];
    const salaryGrades = data.salaryGrades as SalaryGradeRecord[];
    const positions = data.positions as PositionRecord[];

    const templateCards = positionTemplates
      .map((template) => {
        const profiles = positionProfiles.filter((profile) => profile.positionTemplateId === template.id);
        const profileIds = profiles.map((profile) => profile.id);
        const livePositions = positions.filter((position) => profileIds.includes(position.positionProfileId)).length;

        return { template, profiles, livePositions };
      })
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [item.template.name, item.template.family, item.template.category, item.template.description]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => left.template.name.localeCompare(right.template.name));

    return {
      templateCards,
      ranks,
      rankLevels,
      salaryGrades,
      selectedTemplate:
        templateCards.find((item) => item.template.id === selectedTemplateId) ??
        templateCards[0] ??
        null,
    };
  }, [data, deferredSearch, selectedTemplateId]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded position templates, profiles, rank mapping, and live org usage." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Position templates are unavailable"
        description={errorMessage ?? 'The position-template page could not reach the backend.'}
        action={
          <button
            onClick={() => void refresh()}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!view.selectedTemplate) {
    return (
      <EmptyState
        title="No position templates are available"
        description="The position-template page preserves an empty state when no seed data is loaded."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Org Structure"
        title="Position Template"
        description="The template catalog now mirrors the seeded enterprise job library, including linked profiles, ranks, salary-grade defaults, and live org usage."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search template, family, or category" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Templates" value={view.templateCards.length} helper="Seeded job templates" icon={Briefcase} accent="indigo" />
        <StatCard label="Profiles" value={view.templateCards.reduce((sum, item) => sum + item.profiles.length, 0)} helper="Mapped classification profiles" icon={GitBranch} accent="blue" />
        <StatCard label="Live Positions" value={view.templateCards.reduce((sum, item) => sum + item.livePositions, 0)} helper="Positions using seeded templates" icon={Users} accent="emerald" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr]">
        <SectionCard title="Template Catalog" description="Browse the imported template library from the unified-HRIS source data.">
          <div className="space-y-3">
            {view.templateCards.map((item) => (
              <button
                key={item.template.id}
                onClick={() => setSelectedTemplateId(item.template.id)}
                className={`w-full rounded-3xl border p-5 text-left transition ${
                  view.selectedTemplate?.template.id === item.template.id
                    ? 'border-indigo-200 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-lg font-bold text-slate-900">{item.template.name}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {item.template.family ?? 'No family'}{item.template.category ? ` | ${item.template.category}` : ''}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniMetric label="Profiles" value={String(item.profiles.length)} />
                  <MiniMetric label="Positions" value={String(item.livePositions)} />
                  <MiniMetric label="Family" value={item.template.family ?? '—'} />
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={view.selectedTemplate.template.name} description="The selected template shows the profile-level classification that the org structure can assign to live positions.">
          <div className="space-y-6">
            <InfoGrid
              items={[
                ['Family', view.selectedTemplate.template.family ?? '—'],
                ['Category', view.selectedTemplate.template.category ?? '—'],
                ['Description', view.selectedTemplate.template.description ?? '—'],
                ['Profiles', String(view.selectedTemplate.profiles.length)],
              ]}
            />

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Profile</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Rank</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Progression</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Default Grade</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Live Positions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {view.selectedTemplate.profiles.map((profile) => {
                    const rank = profile.rankId
                      ? view.ranks.find((item) => item.id === profile.rankId)
                      : undefined;
                    const level = profile.rankLevelId
                      ? view.rankLevels.find((item) => item.id === profile.rankLevelId)
                      : undefined;
                    const salaryGrade = profile.defaultSalaryGradeId
                      ? view.salaryGrades.find((item) => item.id === profile.defaultSalaryGradeId)
                      : undefined;
                    const livePositions = data.positions
                      ? (data.positions as PositionRecord[]).filter((position) => position.positionProfileId === profile.id).length
                      : 0;

                    return (
                      <tr key={profile.id}>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">{profile.label}</td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {rank?.name ?? 'Unranked'}{level ? ` | ${level.code}` : ''}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge value={profile.progressionMode} />
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {salaryGrade ? `${salaryGrade.code} | ${salaryGrade.name}` : '—'}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">{livePositions}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
