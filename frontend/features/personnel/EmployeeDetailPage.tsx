import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Edit2,
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/phase1/Phase1Ui';
import {
  compareDateDesc,
  formatOrgPath,
  formatStatusLabel,
  type ApprovalRequestRecord,
  type EducationRecord,
  type EmployeePayProfileRecord,
  type EmployeeProfileHistoryRecord,
  type EmployeeProfileRecord,
  type EmployeeRecord,
  type EmergencyContactRecord,
  type EmploymentHistoryRecord,
  type EmploymentRecord,
  type EarningComponentRecord,
  type EarningTemplateFamilyRecord,
  type EarningTemplateRevisionLineRecord,
  type EarningTemplateRevisionRecord,
  type ExamRecord,
  type FamilyMemberRecord,
  type OrgUnitRecord,
  type PafRecord,
  type PositionAssignmentRecord,
  type PositionProfileRecord,
  type PositionRecord,
  type PositionTemplateRecord,
  type ReferenceContactRecord,
  type SalaryGradeRecord,
  type SalaryGradeStepRecord,
} from '../../config/phase1-data';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import { useApiQueries } from '../../hooks/useQueries';
import { 
  getAssignmentPosition, 
  getCurrentPayProfile, 
  getInitials 
} from './personnel-utils';
import { 
  HeaderMetric 
} from './components/EmployeeProfileComponents';
import { 
  ProfileTab, 
  EmploymentTab, 
  PayProfileTab, 
  PafTab, 
  HistoryTab,
  type EmployeeDetailView,
} from './components/DetailTabs';

function normalizeEmployeeTab(value: string | null): string {
  const normalized = (value ?? 'profile').trim().toLowerCase();

  switch (normalized) {
    case 'profile':
      return 'profile';
    case 'employment':
    case 'schedule':
      return 'employment';
    case 'pay profile':
    case 'pay-profile':
    case 'payroll':
      return 'pay-profile';
    case 'personnel action form':
    case 'personnel-action-form':
    case 'action forms':
    case 'paf':
      return 'paf';
    case 'history':
    case 'attendance':
    case 'contributions':
      return 'history';
    default:
      return 'profile';
  }
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const normalizedTab = normalizeEmployeeTab(searchParams.get('tab'));
  const { user } = useAuth();
  const canReadReferenceCatalogs = user?.role !== 'Employee';

  const detailQueries = useMemo(
    () => ({
      employees: '/personnel/employees',
      employments: '/personnel/employments',
      employeeProfiles: '/personnel/employee-profiles',
      educationRecords: '/personnel/education-records',
      examRecords: '/personnel/exam-records',
      employmentHistoryRecords: '/personnel/employment-history-records',
      referenceContacts: '/personnel/reference-contacts',
      familyMembers: '/personnel/family-members',
      emergencyContacts: '/personnel/emergency-contacts',
      profileHistories: '/personnel/employee-profile-histories',
      pafRecords: '/personnel/paf-records',
      payProfiles: '/pay-structure/employee-pay-profiles',
      approvalRequests: '/approvals/approval-requests',
      ...(canReadReferenceCatalogs
        ? {
            templateFamilies: '/pay-structure/earning-template-families',
            templateRevisions: '/pay-structure/earning-template-revisions',
            templateLines: '/pay-structure/earning-template-revision-lines',
            earningComponents: '/pay-structure/earning-components',
            positions: '/org-structure/positions',
            positionAssignments: '/org-structure/position-assignments',
            positionProfiles: '/org-structure/position-profiles',
            positionTemplates: '/org-structure/position-templates',
            orgUnits: '/org-structure/org-units',
            salaryGrades: '/pay-structure/salary-grades',
            salaryGradeSteps: '/pay-structure/salary-grade-steps',
          }
        : {}),
    }),
    [canReadReferenceCatalogs],
  );

  const { status, data, errorMessage, refresh } = useApiQueries(
    detailQueries,
    { enabled: Boolean(id) },
  );

  const view = useMemo<EmployeeDetailView | null>(() => {
    const employees = (data.employees ?? []) as EmployeeRecord[];
    const employments = (data.employments ?? []) as EmploymentRecord[];
    const employeeProfiles = (data.employeeProfiles ?? []) as EmployeeProfileRecord[];
    const educationRecords = (data.educationRecords ?? []) as EducationRecord[];
    const examRecords = (data.examRecords ?? []) as ExamRecord[];
    const employmentHistoryRecords = (data.employmentHistoryRecords ?? []) as EmploymentHistoryRecord[];
    const referenceContacts = (data.referenceContacts ?? []) as ReferenceContactRecord[];
    const familyMembers = (data.familyMembers ?? []) as FamilyMemberRecord[];
    const emergencyContacts = (data.emergencyContacts ?? []) as EmergencyContactRecord[];
    const profileHistories = (data.profileHistories ?? []) as EmployeeProfileHistoryRecord[];
    const pafRecords = (data.pafRecords ?? []) as PafRecord[];
    const payProfiles = (data.payProfiles ?? []) as EmployeePayProfileRecord[];
    const templateFamilies = (data.templateFamilies ?? []) as EarningTemplateFamilyRecord[];
    const templateRevisions = (data.templateRevisions ?? []) as EarningTemplateRevisionRecord[];
    const templateLines = (data.templateLines ?? []) as EarningTemplateRevisionLineRecord[];
    const earningComponents = (data.earningComponents ?? []) as EarningComponentRecord[];
    const approvalRequests = (data.approvalRequests ?? []) as ApprovalRequestRecord[];
    const positions = (data.positions ?? []) as PositionRecord[];
    const positionAssignments = (data.positionAssignments ?? []) as PositionAssignmentRecord[];
    const positionProfiles = (data.positionProfiles ?? []) as PositionProfileRecord[];
    const positionTemplates = (data.positionTemplates ?? []) as PositionTemplateRecord[];
    const orgUnits = (data.orgUnits ?? []) as OrgUnitRecord[];
    const salaryGrades = (data.salaryGrades ?? []) as SalaryGradeRecord[];
    const salaryGradeSteps = (data.salaryGradeSteps ?? []) as SalaryGradeStepRecord[];

    const employee = employees.find((record) => String(record.id) === id);

    if (!employee) {
      return null;
    }

    const employeeProfile = employeeProfiles.find((profile) => profile.employeeId === employee.id);
    const { employment, assignment, position } = getAssignmentPosition(
      employee,
      employments,
      positionAssignments,
      positions,
    );
    const positionProfile = position
      ? positionProfiles.find((profile) => profile.id === position.positionProfileId)
      : undefined;
    const positionTemplate = positionProfile
      ? positionTemplates.find((template) => template.id === positionProfile.positionTemplateId)
      : undefined;
    const orgUnit = position ? orgUnits.find((unit) => unit.id === position.orgUnitId) : undefined;
    const salaryGrade = position?.salaryGradeId
      ? salaryGrades.find((grade) => grade.id === position.salaryGradeId)
      : positionProfile?.defaultSalaryGradeId
        ? salaryGrades.find((grade) => grade.id === positionProfile.defaultSalaryGradeId)
        : undefined;
    const salaryGradeStep = position?.salaryGradeStepId
      ? salaryGradeSteps.find((step) => step.id === position.salaryGradeStepId)
      : undefined;
    const payProfile = getCurrentPayProfile(employee.id, payProfiles);
    const templateFamily = payProfile
      ? templateFamilies.find((family) => family.id === payProfile.earningTemplateFamilyId)
      : undefined;
    const currentTemplateRevision = templateFamily
      ? templateRevisions.find(
          (revision) => revision.earningTemplateFamilyId === templateFamily.id && revision.isCurrent,
        )
      : undefined;
    const compensationLines = currentTemplateRevision
      ? [...templateLines]
          .filter((line) => line.earningTemplateRevisionId === currentTemplateRevision.id)
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map((line) => ({
            line,
            component: earningComponents.find((component) => component.id === line.earningComponentId),
          }))
      : [];

    return {
      employee,
      employeeProfile,
      employment,
      assignment,
      position,
      positionProfile,
      positionTemplate,
      orgUnit,
      salaryGrade,
      salaryGradeStep,
      educationRecords: educationRecords
        .filter((record) => record.employeeId === employee.id)
        .sort((left, right) => compareDateDesc(left.dateGraduated, right.dateGraduated)),
      examRecords: examRecords
        .filter((record) => record.employeeId === employee.id)
        .sort((left, right) => compareDateDesc(left.dateTaken, right.dateTaken)),
      employmentHistoryRecords: employmentHistoryRecords
        .filter((record) => record.employeeId === employee.id)
        .sort((left, right) => compareDateDesc(left.endDate ?? left.startDate, right.endDate ?? right.startDate)),
      referenceContacts: referenceContacts.filter((record) => record.employeeId === employee.id),
      familyMembers: familyMembers.filter((record) => record.employeeId === employee.id),
      emergencyContacts: emergencyContacts.filter((record) => record.employeeId === employee.id),
      profileHistories: [...profileHistories]
        .filter((record) => record.employeeId === employee.id)
        .sort((left, right) => compareDateDesc(left.changedAt, right.changedAt)),
      pafRecords: [...pafRecords]
        .filter((record) => record.employeeId === employee.id)
        .sort((left, right) => compareDateDesc(left.effectiveDate, right.effectiveDate))
        .map((record) => ({
          record,
          approvalRequest: record.approvalRequestId
            ? approvalRequests.find((request) => request.id === record.approvalRequestId)
            : undefined,
        })),
      payProfile,
      templateFamily,
      currentTemplateRevision,
      compensationLines,
    };
  }, [data, id]);

  usePageTitle(view?.employee.displayName ?? 'Employee Record');

  const tabs = useMemo(() => {
    const allTabs = [
      { id: 'profile', label: 'Profile' },
      { id: 'employment', label: 'Employment' },
      { id: 'pay-profile', label: 'Pay Profile' },
      { id: 'paf', label: 'Action Forms' },
      { id: 'history', label: 'History' },
    ];

    if (user?.role === 'Employee') {
      return allTabs.filter((tab) => ['profile', 'pay-profile', 'paf'].includes(tab.id));
    }

    return allTabs;
  }, [user?.role]);

  const activeTab = tabs.some((tab) => tab.id === normalizedTab) ? normalizedTab : tabs[0]?.id ?? 'profile';

  if (!id) {
    return (
      <EmptyState
        title="Employee record is missing"
        description="No employee identifier was provided for this detail route."
      />
    );
  }

  if (status === 'loading') {
    return <LoadingState description="Loading the seeded employee record, linked compensation, and lifecycle history." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Employee detail is unavailable"
        description={errorMessage ?? 'The employee detail page could not reach the backend.'}
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
        title="Employee record not found"
        description="The requested employee id does not exist in the seeded personnel dataset."
      />
    );
  }

  const handleTabChange = (nextTab: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('tab', nextTab);
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/manage/employee')}
          className="group inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-500 transition-all hover:bg-indigo-50 hover:text-indigo-600"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Directory
        </button>
        <div className="flex gap-3">
          <button className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100">
            Actions
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800">
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-50/30 blur-3xl" />
        <div className="relative flex flex-col items-center gap-10 md:flex-row md:items-start">
          <div className="relative group">
            <div className="h-40 w-40 overflow-hidden rounded-[2.5rem] ring-8 ring-slate-50 shadow-xl transition-transform group-hover:scale-[1.02]">
                {view.employee.avatarUrl ? (
                  <img
                    src={view.employee.avatarUrl}
                    alt={view.employee.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-3xl font-bold text-indigo-700">
                    {getInitials(view.employee.displayName)}
                  </div>
                )}
              </div>
            <div className="absolute -bottom-2 -right-2 rounded-2xl border-4 border-white bg-emerald-500 p-2 shadow-lg">
              <CheckCircle2 size={20} className="text-white" />
            </div>
          </div>

          <div className="w-full flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {view.employee.displayName}
                </h1>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                  {formatStatusLabel(view.employee.status).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-500 md:justify-start">
                <span className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-300" /> {view.employee.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-300" />{' '}
                  {view.employee.phone || 'No mobile number'}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-300" />{' '}
                  {formatOrgPath(view.employee.orgUnitJson)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <HeaderMetric label="Role" value={view.employee.roleTitle ?? 'Unclassified position'} icon={Briefcase} />
              <HeaderMetric label="Dept" value={view.orgUnit?.name ?? formatOrgPath(view.employee.orgUnitJson)} icon={Building2} />
              <HeaderMetric label="ID" value={view.employee.employeeNumber} icon={Globe} />
              <HeaderMetric label="Type" value={view.employment?.jobType ?? view.employee.jobType} icon={Calendar} />
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-slate-100">
        <nav className="flex gap-10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative pb-4 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'profile' && <ProfileTab view={view} />}
        {activeTab === 'employment' && <EmploymentTab view={view} />}
        {activeTab === 'pay-profile' && <PayProfileTab view={view} />}
        {activeTab === 'paf' && <PafTab view={view} />}
        {activeTab === 'history' && <HistoryTab view={view} />}
      </div>
    </div>
  );
}
