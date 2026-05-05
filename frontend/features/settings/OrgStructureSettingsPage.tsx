import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  MapPinned,
  Network,
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
} from '../../components/phase1/Phase1Ui';
import {
  formatCurrency,
  parseNumber,
  type CompanyProfileRecord,
  type EmployeeRecord,
  type OrgUnitRecord,
  type PositionAssignmentRecord,
  type PositionProfileRecord,
  type PositionRecord,
  type PositionTemplateRecord,
  type SalaryGradeRecord,
  type SiteRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useApiQueries } from '../../hooks/useQueries';
import { InfoGrid } from '../personnel/components/EmployeeProfileComponents';

interface TreeNode extends OrgUnitRecord {
  children: TreeNode[];
}

function buildOrgTree(orgUnits: OrgUnitRecord[]): TreeNode[] {
  const nodeMap = new Map<number, TreeNode>(
    orgUnits.map((unit) => [unit.id, { ...unit, children: [] }]),
  );
  const roots: TreeNode[] = [];

  nodeMap.forEach((node) => {
    if (node.parentOrgUnitId && nodeMap.has(node.parentOrgUnitId)) {
      nodeMap.get(node.parentOrgUnitId)?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function collectUnitIds(node: TreeNode): number[] {
  return [node.id, ...node.children.flatMap((child) => collectUnitIds(child))];
}

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return nodes;
  }

  return nodes
    .map((node) => ({
      ...node,
      children: filterTree(node.children, query),
    }))
    .filter(
      (node) =>
        node.name.toLowerCase().includes(normalizedQuery) ||
        node.code.toLowerCase().includes(normalizedQuery) ||
        node.children.length > 0,
    );
}

function OrgTreeNodeView({
  node,
  selectedUnitId,
  expandedUnitIds,
  onToggle,
  onSelect,
  depth = 0,
}: {
  node: TreeNode;
  selectedUnitId: number;
  expandedUnitIds: Set<number>;
  onToggle: (unitId: number) => void;
  onSelect: (unitId: number) => void;
  depth?: number;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedUnitIds.has(node.id) || depth === 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 transition ${
          selectedUnitId === node.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'
        }`}
        style={{ paddingLeft: `${12 + depth * 18}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.id)}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-6" />
        )}
        <button onClick={() => onSelect(node.id)} className="flex-1 text-left">
          <div className="text-sm font-bold">{node.name}</div>
          <div className="text-xs text-slate-500">{node.code}</div>
        </button>
      </div>
      {hasChildren && isExpanded ? (
        <div className="space-y-1">
          {node.children.map((child) => (
            <OrgTreeNodeView
              key={child.id}
              node={child}
              selectedUnitId={selectedUnitId}
              expandedUnitIds={expandedUnitIds}
              onToggle={onToggle}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function OrgStructureSettingsPage() {
  usePageTitle('Org Structure');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [expandedUnitIds, setExpandedUnitIds] = useState<Set<number>>(new Set());
  const deferredSearch = useDeferredValue(searchTerm);
  const { status, data, errorMessage, refresh } = useApiQueries({
    companyProfiles: '/org-structure/company-profiles',
    hierarchyLevels: '/org-structure/hierarchy-levels',
    sites: '/org-structure/sites',
    orgUnits: '/org-structure/org-units',
    positions: '/org-structure/positions',
    positionAssignments: '/org-structure/position-assignments',
    employees: '/personnel/employees',
    positionProfiles: '/org-structure/position-profiles',
    positionTemplates: '/org-structure/position-templates',
    salaryGrades: '/pay-structure/salary-grades',
  });

  const view = useMemo(() => {
    const companyProfiles = data.companyProfiles as CompanyProfileRecord[];
    const hierarchyLevels = data.hierarchyLevels as Array<{ id: number; levelNo: number; label: string }>;
    const sites = data.sites as SiteRecord[];
    const orgUnits = data.orgUnits as OrgUnitRecord[];
    const positions = data.positions as PositionRecord[];
    const positionAssignments = data.positionAssignments as PositionAssignmentRecord[];
    const employees = data.employees as EmployeeRecord[];
    const positionProfiles = data.positionProfiles as PositionProfileRecord[];
    const positionTemplates = data.positionTemplates as PositionTemplateRecord[];
    const salaryGrades = data.salaryGrades as SalaryGradeRecord[];

    const roots = buildOrgTree(orgUnits);

    const selectedNode = (() => {
      const all = new Map<number, TreeNode>();
      const visit = (node: TreeNode) => {
        all.set(node.id, node);
        node.children.forEach(visit);
      };
      roots.forEach(visit);
      return selectedUnitId ? all.get(selectedUnitId) ?? roots[0] : roots[0];
    })();

    if (!selectedNode) {
      return null;
    }

    const subtreeIds = new Set(collectUnitIds(selectedNode));
    const scopedPositions = positions.filter((position) => subtreeIds.has(position.orgUnitId));
    const scopedAssignments = positionAssignments.filter((assignment) =>
      scopedPositions.some((position) => position.id === assignment.positionId),
    );

    const positionRows = scopedPositions.map((position) => {
      const assignment = scopedAssignments.find((item) => item.positionId === position.id && !item.endDate);
      const employee = assignment?.employeeId
        ? employees.find((record) => record.id === assignment.employeeId)
        : undefined;
      const profile = positionProfiles.find((record) => record.id === position.positionProfileId);
      const template = profile
        ? positionTemplates.find((record) => record.id === profile.positionTemplateId)
        : undefined;
      const salaryGrade = position.salaryGradeId
        ? salaryGrades.find((record) => record.id === position.salaryGradeId)
        : undefined;

      return { position, employee, template, salaryGrade };
    });

    return {
      companyProfiles,
      hierarchyLevels,
      sites,
      roots,
      selectedNode,
      scopedPositions: positionRows,
      subtreeHeadcount: scopedAssignments.filter((assignment) => assignment.employeeId).length,
      subtreeBudget: scopedPositions.reduce((sum, position) => sum + (parseNumber(position.defaultBasePay) ?? 0), 0),
    };
  }, [data, selectedUnitId]);

  if (status === 'loading') {
    return <LoadingState description="Loading the seeded org tree, hierarchy levels, positions, and assignment coverage." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Org structure is unavailable"
        description={errorMessage ?? 'The org-structure page could not reach the backend.'}
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

  if (!view) {
    return (
      <EmptyState
        title="No org structure is available"
        description="The organization page preserves an empty state when no org-unit seed data is loaded."
      />
    );
  }

  const filteredRoots = filterTree(view.roots, deferredSearch);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Org Structure"
        title="Org Structure"
        description="The organization page now renders a real hierarchy tree from the seeded enterprise org-unit tables, with live positions and staffing attached to each node."
        actions={<SearchField value={searchTerm} onChange={setSearchTerm} placeholder="Search org unit by code or name" />}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Companies" value={view.companyProfiles.length} helper="Seeded company profiles" icon={Building2} accent="indigo" />
        <StatCard label="Sites" value={view.sites.length} helper="Operational site records" icon={MapPinned} accent="blue" />
        <StatCard label="Headcount" value={view.subtreeHeadcount} helper="Assigned employees in selected subtree" icon={Users} accent="emerald" />
        <StatCard label="Budget" value={formatCurrency(view.subtreeBudget)} helper="Sum of position base pay in subtree" icon={Network} accent="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr]">
        <SectionCard title="Hierarchy" description="The left tree reflects the current seeded org structure; selecting a unit updates the live detail panel.">
          {filteredRoots.length === 0 ? (
            <EmptyState
              title="No org units match the current search"
              description="The tree keeps a clean empty state when the search does not match any unit."
            />
          ) : (
            <div className="space-y-2">
              {filteredRoots.map((node) => (
                <OrgTreeNodeView
                  key={node.id}
                  node={node}
                  selectedUnitId={view.selectedNode.id}
                  expandedUnitIds={expandedUnitIds}
                  onToggle={(unitId) =>
                    setExpandedUnitIds((previous) => {
                      const next = new Set(previous);
                      if (next.has(unitId)) {
                        next.delete(unitId);
                      } else {
                        next.add(unitId);
                      }
                      return next;
                    })
                  }
                  onSelect={(unitId) => setSelectedUnitId(unitId)}
                />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title={view.selectedNode.name} description="The selected org unit shows direct and descendant position usage from the seeded org-structure dataset.">
          <div className="space-y-6">
            <InfoGrid
              items={[
                ['Code', view.selectedNode.code],
                ['Hierarchy Level', view.hierarchyLevels.find((level) => level.id === view.selectedNode.hierarchyLevelId)?.label ?? '—'],
                ['Active', view.selectedNode.isActive ? 'Yes' : 'No'],
                ['Subtree Positions', String(view.scopedPositions.length)],
              ]}
            />

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Position</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Template</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Salary Grade</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Assigned Employee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {view.scopedPositions.map(({ position, template, salaryGrade, employee }) => (
                    <tr key={position.id}>
                      <td className="px-5 py-4">
                        <div className="text-sm font-bold text-slate-900">{position.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{formatCurrency(position.defaultBasePay)}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{template?.name ?? '—'}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{salaryGrade?.code ?? '—'}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{employee?.displayName ?? 'Vacant'}</td>
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
