import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  Layers3,
  TableProperties,
  Briefcase,
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
  formatCurrency,
  formatStatusLabel,
  type SalaryGradeRecord,
  type SalaryGradeStepRecord,
  type PositionRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { MiniMetric } from './components/SettingsUi';
import { InfoGrid } from '../personnel/components/EmployeeProfileComponents';

export default function SalaryGradeSettingsPage() {
  usePageTitle('Salary Grade');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    salaryGrades: '/pay-structure/salary-grades',
    salaryGradeSteps: '/pay-structure/salary-grade-steps',
    positions: '/org-structure/positions',
  });

  const view = useMemo(() => {
    const salaryGrades = data.salaryGrades as SalaryGradeRecord[];
    const salaryGradeSteps = data.salaryGradeSteps as SalaryGradeStepRecord[];
    const positions = data.positions as PositionRecord[];

    const gradeCards = salaryGrades
      .map((grade) => ({
        grade,
        steps: salaryGradeSteps
          .filter((step) => step.salaryGradeId === grade.id)
          .sort((left, right) => left.stepNumber - right.stepNumber),
        livePositions: positions.filter((position) => position.salaryGradeId === grade.id).length,
      }))
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [item.grade.code, item.grade.name, item.grade.rateType]
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => left.grade.code.localeCompare(right.grade.code));

    return {
      gradeCards,
      selectedGrade:
        gradeCards.find((item) => item.grade.id === selectedGradeId) ?? gradeCards[0] ?? null,
    };
  }, [data, deferredSearch, selectedGradeId]);

  if (status === 'loading') {
    return <LoadingState description="Loading seeded salary grades, step ladders, and current org usage." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Salary grades are unavailable"
        description={errorMessage ?? 'The salary-grade page could not reach the backend.'}
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

  if (!view.selectedGrade) {
    return (
      <EmptyState
        title="No salary grades are available"
        description="The salary-grade page preserves its empty state when no seed data is present."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Compensation Architecture"
        title="Salary Grade"
        description="Salary bands and steps are now rendered from the seeded pay-structure tables, including live org-position usage."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search salary code or grade name" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Grades" value={view.gradeCards.length} helper="Seeded compensation bands" icon={Layers3} accent="indigo" />
        <StatCard label="Steps" value={view.gradeCards.reduce((sum, item) => sum + item.steps.length, 0)} helper="Configured grade ladders" icon={TableProperties} accent="blue" />
        <StatCard label="Mapped Positions" value={view.gradeCards.reduce((sum, item) => sum + item.livePositions, 0)} helper="Live org positions using grades" icon={Briefcase} accent="emerald" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr]">
        <SectionCard title="Grade Catalog" description="Browse the salary-grade ladder imported into the enterprise seed dataset.">
          <div className="space-y-3">
            {view.gradeCards.map((item) => (
              <button
                key={item.grade.id}
                onClick={() => setSelectedGradeId(item.grade.id)}
                className={`w-full rounded-3xl border p-5 text-left transition ${
                  view.selectedGrade?.grade.id === item.grade.id
                    ? 'border-indigo-200 bg-indigo-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{item.grade.code}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.grade.name}</div>
                  </div>
                  <StatusBadge value={item.grade.status} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniMetric label="Rate Type" value={formatStatusLabel(item.grade.rateType)} />
                  <MiniMetric label="Steps" value={String(item.steps.length)} />
                  <MiniMetric label="Positions" value={String(item.livePositions)} />
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={view.selectedGrade.grade.code} description="The selected grade shows the configured range and step ladder from the seed dataset.">
          <div className="space-y-6">
            <InfoGrid
              items={[
                ['Name', view.selectedGrade.grade.name],
                ['Rate Type', formatStatusLabel(view.selectedGrade.grade.rateType)],
                ['Minimum', formatCurrency(view.selectedGrade.grade.minSalary)],
                ['Maximum', formatCurrency(view.selectedGrade.grade.maxSalary)],
              ]}
            />

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Step</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Name</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {view.selectedGrade.steps.map((step) => (
                    <tr key={step.id}>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">{step.stepNumber}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{step.name}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">{formatCurrency(step.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
