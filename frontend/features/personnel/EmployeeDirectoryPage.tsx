import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Building2,
  ExternalLink,
  FileCheck,
  FileText,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../../components/phase1/Phase1Ui';
import {
  EmployeeRecord,
  EmploymentRecord,
  formatOrgPath,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { buildQueryPath, useApiQueries } from '../../hooks/useQueries';
import { getCurrentEmployment, getInitials } from './personnel-utils';
import { FilterSelect } from './components/FilterSelect';
import { PaginationControls } from '../../components/phase1/PaginationControls';

const DIRECTORY_PAGE_SIZE = 25;

function EmployeeAvatar({ employee }: { employee: EmployeeRecord }) {
  if (employee.avatarUrl) {
    return (
      <img
        src={employee.avatarUrl}
        alt={employee.displayName}
        className="h-11 w-11 rounded-xl object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700 shadow-sm">
      {getInitials(employee.displayName)}
    </div>
  );
}

export default function EmployeeDirectoryPage() {
  usePageTitle('Employee Directory');

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchTerm);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, departmentFilter, jobTypeFilter, statusFilter]);

  const employeePath = useMemo(
    () =>
      buildQueryPath('/personnel/employees', {
        page,
        limit: DIRECTORY_PAGE_SIZE,
        search: deferredSearch.trim(),
        status: statusFilter,
        jobType: jobTypeFilter,
        department: departmentFilter,
      }),
    [deferredSearch, departmentFilter, jobTypeFilter, page, statusFilter],
  );

  const { status, data, pages, errorMessage, refresh } = useApiQueries({
    employees: employeePath,
    employeeFilterOptions: '/personnel/employees?limit=500',
    employments: '/personnel/employments',
  });

  const view = useMemo(() => {
    const employees = (data.employees ?? []) as EmployeeRecord[];
    const filterEmployees = (data.employeeFilterOptions ?? []) as EmployeeRecord[];
    const employments = (data.employments ?? []) as EmploymentRecord[];

    const jobTypes = Array.from(new Set(filterEmployees.map((employee) => employee.jobType))).sort((left, right) =>
      left.localeCompare(right),
    );
    const departments = Array.from(
      new Set(
        filterEmployees.map((employee) => {
          const department = employee.orgUnitJson?.department;
          return typeof department === 'string' && department.trim()
            ? department.trim()
            : 'Unassigned';
        }),
      ),
    ).sort((left, right) => left.localeCompare(right));

    return {
      employees,
      employments,
      jobTypes,
      departments,
    };
  }, [data]);

  if (status === 'loading') {
    return <LoadingState description="Loading directory records, lifecycle tags, and current seeded personnel assignments." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Employee directory is unavailable"
        description={errorMessage ?? 'The directory could not reach the seeded personnel API.'}
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Employee Directory</h1>
          <p className="mt-1 font-medium text-slate-500">
            Manage, filter and track all team members in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/manage/paf')}
            className="flex items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-6 py-3 text-sm font-bold text-indigo-700 transition-all hover:bg-indigo-100"
          >
            <FileText size={18} />
            Personnel Action Form
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2 p-1">
          <FilterSelect
            icon={Briefcase}
            label="Role"
            value={jobTypeFilter}
            onChange={setJobTypeFilter}
            options={[
              { label: 'All job types', value: 'all' },
              ...view.jobTypes.map((jobType) => ({
                label: jobType,
                value: jobType,
              })),
            ]}
          />
          <FilterSelect
            icon={Building2}
            label="Department"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            options={[
              { label: 'All departments', value: 'all' },
              ...view.departments.map((department) => ({
                label: department,
                value: department,
              })),
            ]}
          />
          <FilterSelect
            icon={FileCheck}
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All statuses', value: 'all' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
              { label: 'Terminated', value: 'TERMINATED' },
            ]}
          />
        </div>

        <div className="relative max-w-md flex-1 p-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            className="block w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 transition-all placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Search by name, ID or email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {view.employees.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No employees match the current filters"
              description="The directory still preserves a proper empty state when the current search or filter combination returns no rows."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Employee
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      ID & Contact
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Work Info
                    </th>
                    <th className="px-8 py-5 text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {view.employees.map((employee) => {
                    const currentEmployment = getCurrentEmployment(employee.id, view.employments);

                    return (
                      <tr
                        key={employee.id}
                        onClick={() => navigate(`/manage/employee/${employee.id}`)}
                        className="group cursor-pointer transition-colors hover:bg-indigo-50/20"
                      >
                        <td className="whitespace-nowrap px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="h-11 w-11 overflow-hidden rounded-xl ring-2 ring-white shadow-sm">
                                <EmployeeAvatar employee={employee} />
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                                  employee.status.toUpperCase() === 'ACTIVE'
                                    ? 'bg-green-500'
                                    : 'bg-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                                {employee.displayName}
                              </div>
                              <div className="text-xs font-semibold text-slate-400">
                                {employee.roleTitle ?? 'Unassigned role'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-8 py-5">
                          <StatusBadge value={employee.status} />
                        </td>
                        <td className="whitespace-nowrap px-8 py-5">
                          <div className="text-sm font-bold text-slate-700">
                            #{employee.employeeNumber}
                          </div>
                          <div className="text-xs font-medium lowercase text-slate-400">
                            {employee.email}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-8 py-5">
                          <div className="text-sm font-semibold text-slate-700">
                            {formatOrgPath(employee.orgUnitJson)}
                          </div>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-400">
                            {currentEmployment?.jobType ?? employee.jobType}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/manage/employee/${employee.id}`);
                              }}
                              className="rounded-lg p-2 text-slate-400 opacity-0 transition-all hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100"
                            >
                              <ExternalLink size={16} />
                            </button>
                            <button
                              onClick={(event) => event.stopPropagation()}
                              className="rounded-lg p-2 text-slate-300 transition-all hover:bg-slate-50 hover:text-slate-600"
                            >
                              <MoreHorizontal size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <PaginationControls
              page={pages.employees}
              noun="Employees"
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
