import React, { useDeferredValue, useMemo, useState } from 'react';
import { Calculator, Layers, Package, Search, Sigma, Users } from 'lucide-react';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import SectionSwitcher from '../../components/phase1/SectionSwitcher';
import {
  formatCompactNumber,
  formatDate,
  formatStatusLabel,
  groupBy,
  type EarningComponentRecord,
  type EarningTemplateFamilyRecord,
  type EarningTemplateRevisionLineRecord,
  type EarningTemplateRevisionRecord,
  type EmployeePayProfileRecord,
  type FormulaRecord,
  type FormulaVersionRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';

type PayStructureTab = 'templates' | 'components' | 'formulas';

export default function PayStructurePage() {
  usePageTitle('Pay Structure');

  const [activeTab, setActiveTab] = useState<PayStructureTab>('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    templateFamilies: '/pay-structure/earning-template-families',
    templateRevisions: '/pay-structure/earning-template-revisions',
    templateLines: '/pay-structure/earning-template-revision-lines',
    earningComponents: '/pay-structure/earning-components',
    formulas: '/pay-structure/formulas',
    formulaVersions: '/pay-structure/formula-versions',
    employeePayProfiles: '/pay-structure/employee-pay-profiles',
  });

  const view = useMemo(() => {
    const templateFamilies = data.templateFamilies as EarningTemplateFamilyRecord[] ?? [];
    const templateRevisions = data.templateRevisions as EarningTemplateRevisionRecord[] ?? [];
    const templateLines = data.templateLines as EarningTemplateRevisionLineRecord[] ?? [];
    const earningComponents = data.earningComponents as EarningComponentRecord[] ?? [];
    const formulas = data.formulas as FormulaRecord[] ?? [];
    const formulaVersions = data.formulaVersions as FormulaVersionRecord[] ?? [];
    const employeePayProfiles = data.employeePayProfiles as EmployeePayProfileRecord[] ?? [];

    const filteredFamilies = templateFamilies
      .map((family) => {
        const currentRevision = templateRevisions.find(
          (revision) =>
            revision.earningTemplateFamilyId === family.id && revision.isCurrent,
        );
        const componentCount = currentRevision
          ? templateLines.filter(
              (line) => line.earningTemplateRevisionId === currentRevision.id,
            ).length
          : 0;
        const employeeCount = employeePayProfiles.filter(
          (profile) => profile.earningTemplateFamilyId === family.id,
        ).length;

        return { family, currentRevision, componentCount, employeeCount };
      })
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [
            item.family.name,
            item.family.code,
            item.family.description,
            item.family.templateKind,
            item.family.payBasisApplicability,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => left.family.name.localeCompare(right.family.name));

    const filteredComponents = earningComponents
      .map((component) => ({
        component,
        linkedProfiles: employeePayProfiles.filter((profile) => {
          const currentRevision = templateRevisions.find(
            (revision) =>
              revision.earningTemplateFamilyId ===
                profile.earningTemplateFamilyId && revision.isCurrent,
          );

          return currentRevision
            ? templateLines.some(
                (line) =>
                  line.earningTemplateRevisionId === currentRevision.id &&
                  line.earningComponentId === component.id,
              )
            : false;
        }).length,
      }))
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [
            item.component.name,
            item.component.code,
            item.component.category,
            item.component.valueSource,
            item.component.description,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => left.component.name.localeCompare(right.component.name));

    const filteredFormulas = formulas
      .map((formula) => ({
        formula,
        currentVersion: formulaVersions.find(
          (version) => version.formulaId === formula.id && version.isCurrent,
        ),
        linkedComponents: earningComponents.filter(
          (component) =>
            component.formulaVersionId &&
            formulaVersions.find(
              (version) =>
                version.id === component.formulaVersionId &&
                version.formulaId === formula.id,
            ),
        ).length,
      }))
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        return (
          !query ||
          [
            item.formula.name,
            item.formula.code,
            item.formula.expression,
            item.formula.description,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((left, right) => left.formula.name.localeCompare(right.formula.name));

    const componentGroups = Array.from(
      groupBy(earningComponents, (component) => component.category || 'Uncategorized').entries(),
    )
      .map(([category, components]) => ({ category, count: components.length }))
      .sort((left, right) => right.count - left.count);

    return {
      templateFamilies,
      employeePayProfiles,
      filteredFamilies,
      filteredComponents,
      filteredFormulas,
      defaultFamilies: templateFamilies.filter(
        (family) => family.templateKind === 'DEFAULT',
      ),
      variantFamilies: templateFamilies.filter(
        (family) => family.templateKind === 'VARIANT',
      ),
      componentGroups,
    };
  }, [data, deferredSearch]);

  if (status === 'loading') {
    return (
      <LoadingState description="Loading template families, earning components, and formula libraries from the seeded pay-structure API." />
    );
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Pay structure data is unavailable"
        description={errorMessage ?? 'The pay structure page could not reach the backend.'}
        action={
          <button
            onClick={() => void refresh()}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pay Structure</h1>
          <p className="mt-1 font-medium text-slate-500">
            Manage earning templates and earning components used in employee compensation.
          </p>
        </div>
        <div className="relative w-full max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search templates, components, or formulas"
            className="block w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 transition-all placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Setup Areas
          </div>
          <div className="text-sm font-bold text-slate-700">
            Start with templates, then review components, then refine formulas when needed.
          </div>
        </div>
        <SectionSwitcher
          items={[
            {
              id: 'templates',
              label: 'Template Library',
              description: 'Default earnings packages by position and seeded employee pay profile.',
              icon: Layers,
            },
            {
              id: 'components',
              label: 'Component Catalog',
              description: 'Reusable earnings such as basic pay, allowances, and incentives.',
              icon: Package,
            },
            {
              id: 'formulas',
              label: 'Formula Builder',
              description: 'Calculation rules for dynamic earning components and payroll logic.',
              icon: Sigma,
            },
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'templates' ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricTile
              label="Template Families"
              value={view.templateFamilies.length}
              helper={`${view.defaultFamilies.length} defaults and ${view.variantFamilies.length} variants`}
              icon={Layers}
            />
            <MetricTile
              label="Employee Coverage"
              value={view.employeePayProfiles.length}
              helper="Seeded pay profiles already mapped"
              icon={Users}
            />
            <MetricTile
              label="Visible Results"
              value={view.filteredFamilies.length}
              helper="Families matching the active search"
              icon={Calculator}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-900">Template Library</h2>
              <p className="mt-1 text-sm text-slate-500">
                Default and variant earnings packages by pay basis, revision, component count,
                and live employee coverage.
              </p>
            </div>
            {view.filteredFamilies.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No template families match the current search"
                  description="The template library is ready to display seeded family rows as soon as the current filters return results."
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Family
                        </th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Kind
                        </th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Pay Basis
                        </th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Current Revision
                        </th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Components
                        </th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Employee Coverage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {view.filteredFamilies.map(
                        ({ family, currentRevision, componentCount, employeeCount }) => (
                          <tr key={family.id} className="transition-colors hover:bg-slate-50/70">
                            <td className="px-8 py-5">
                              <div className="text-sm font-bold text-slate-900">{family.name}</div>
                              <div className="mt-1 text-xs font-medium text-slate-400">
                                {family.code}
                                {family.description ? ` • ${family.description}` : ''}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <StatusBadge value={family.templateKind} />
                            </td>
                            <td className="px-8 py-5 text-sm font-semibold text-slate-700">
                              {formatStatusLabel(family.payBasisApplicability)}
                            </td>
                            <td className="px-8 py-5 text-sm text-slate-700">
                              <div className="font-bold text-slate-800">
                                {currentRevision?.versionNo ?? 'No live revision'}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                {currentRevision
                                  ? `Effective ${formatDate(currentRevision.effectiveStartDate)}`
                                  : 'No active revision'}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-700">
                              {componentCount}
                            </td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-700">
                              {formatCompactNumber(employeeCount)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-8 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Showing {view.filteredFamilies.length} template families
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Search updates the seeded library instantly
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === 'components' ? (
        <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">Component Mix</h2>
              <p className="mt-1 text-sm text-slate-500">
                Reusable earning blocks grouped by category in the current seed.
              </p>
            </div>
            <div className="space-y-4">
              {view.componentGroups.map((group, index) => {
                const width = Math.max(
                  8,
                  Math.round((group.count / Math.max(view.filteredComponents.length, 1)) * 100),
                );

                return (
                  <div key={`${group.category}-${index}`}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        {formatStatusLabel(group.category)}
                      </span>
                      <span className="font-medium text-slate-400">{group.count}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-900">Component Catalog</h2>
              <p className="mt-1 text-sm text-slate-500">
                Salary, allowance, and incentive definitions resolved from the seeded pay architecture.
              </p>
            </div>
            {view.filteredComponents.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No components match the current search"
                  description="The component catalog keeps an empty state until matching seeded rows are found."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Component
                      </th>
                      <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Category
                      </th>
                      <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Value Source
                      </th>
                      <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Taxability
                      </th>
                      <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Linked Profiles
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {view.filteredComponents.map(({ component, linkedProfiles }) => (
                      <tr key={component.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-8 py-5">
                          <div className="text-sm font-bold text-slate-900">{component.name}</div>
                          <div className="mt-1 text-xs font-medium text-slate-400">
                            {component.code}
                            {component.description ? ` • ${component.description}` : ''}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700">
                          {formatStatusLabel(component.category)}
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-700">
                          <div className="font-bold text-slate-800">
                            {formatStatusLabel(component.valueSource)}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {component.fixedAmount
                              ? `Fixed ${component.fixedAmount}`
                              : component.orgReferenceType ?? 'Derived'}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-700">
                          {component.isTaxableDefault ? 'Taxable' : 'Non-taxable'}
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-700">
                          {linkedProfiles}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === 'formulas' ? (
        <div className="space-y-4">
          {view.filteredFormulas.length === 0 ? (
            <EmptyState
              title="No formulas match the current search"
              description="The formula builder area keeps its empty state when the filter returns no seeded rules."
            />
          ) : (
            view.filteredFormulas.map(({ formula, currentVersion, linkedComponents }) => (
              <div
                key={formula.id}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{formula.name}</h2>
                      <StatusBadge value={formula.status} />
                    </div>
                    <p className="max-w-3xl text-sm leading-6 text-slate-500">
                      {formula.description ?? 'No description available.'}
                    </p>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                      {currentVersion?.expression ?? formula.expression}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[320px]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Code</div>
                      <div className="mt-2 text-sm font-bold text-slate-900">{formula.code}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Version</div>
                      <div className="mt-2 text-sm font-bold text-slate-900">{currentVersion?.versionNo ?? '—'}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Linked Components</div>
                      <div className="mt-2 text-sm font-bold text-slate-900">{String(linkedComponents)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function MetricTile({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: number;
  helper: string;
  icon: React.ComponentType<{ size?: number }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500">{helper}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
