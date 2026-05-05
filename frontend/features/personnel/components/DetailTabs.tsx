import React from 'react';
import { SectionCard, StatusBadge } from '../../../components/phase1/Phase1Ui';
import {
  describeJsonValue,
  formatCurrency,
  formatDate,
  formatDateRange,
  formatStatusLabel,
  parseNumber,
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
} from '../../../config/phase1-data';
import { InfoGrid, RecordTable, SubList } from './EmployeeProfileComponents';

interface CompensationLine {
  line: EarningTemplateRevisionLineRecord;
  component?: EarningComponentRecord;
}

interface PafRecordRow {
  record: PafRecord;
  approvalRequest?: ApprovalRequestRecord;
}

export interface EmployeeDetailView {
  employee: EmployeeRecord;
  employeeProfile?: EmployeeProfileRecord;
  employment?: EmploymentRecord;
  assignment?: PositionAssignmentRecord;
  position?: PositionRecord;
  positionProfile?: PositionProfileRecord;
  positionTemplate?: PositionTemplateRecord;
  orgUnit?: OrgUnitRecord;
  salaryGrade?: SalaryGradeRecord;
  salaryGradeStep?: SalaryGradeStepRecord;
  educationRecords: EducationRecord[];
  examRecords: ExamRecord[];
  employmentHistoryRecords: EmploymentHistoryRecord[];
  referenceContacts: ReferenceContactRecord[];
  familyMembers: FamilyMemberRecord[];
  emergencyContacts: EmergencyContactRecord[];
  profileHistories: EmployeeProfileHistoryRecord[];
  pafRecords: PafRecordRow[];
  payProfile?: EmployeePayProfileRecord;
  templateFamily?: EarningTemplateFamilyRecord;
  currentTemplateRevision?: EarningTemplateRevisionRecord;
  compensationLines: CompensationLine[];
}

interface DetailTabProps {
  view: EmployeeDetailView;
}

export function ProfileTab({ view }: DetailTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
      <SectionCard
        title="Personal Details"
        description="Demographics, identity references, and contact details from the seeded employee profile."
      >
        <InfoGrid
          items={[
            ['Birth Date', formatDate(view.employeeProfile?.birthDate)],
            ['Gender', formatStatusLabel(view.employeeProfile?.gender)],
            ['Civil Status', formatStatusLabel(view.employeeProfile?.civilStatus)],
            ['Address', view.employeeProfile?.residentialAddress ?? '-'],
            ['SSS No.', view.employeeProfile?.sssNo ?? '-'],
            ['TIN', view.employeeProfile?.tinNo ?? '-'],
            ['PhilHealth No.', view.employeeProfile?.philhealthNo ?? '-'],
            ['Pag-IBIG No.', view.employeeProfile?.pagibigNo ?? '-'],
            ['Bank', view.employeeProfile?.bankName ?? '-'],
            ['Bank Account', view.employeeProfile?.bankAccountNo ?? '-'],
          ]}
        />
      </SectionCard>

      <SectionCard
        title="Family & Emergency Contacts"
        description="Dependent, family, and emergency information from the seed dataset."
      >
        <div className="space-y-6">
          <SubList
            title={`Family Members (${view.familyMembers.length})`}
            emptyLabel="No family members recorded"
            items={view.familyMembers.map((member) => ({
              title: `${member.firstName} ${member.lastName}`,
              subtitle: `${formatStatusLabel(member.relationship)}${member.occupation ? ` | ${member.occupation}` : ''}`,
              detail: member.address ?? '-',
            }))}
          />
          <SubList
            title={`Emergency Contacts (${view.emergencyContacts.length})`}
            emptyLabel="No emergency contacts recorded"
            items={view.emergencyContacts.map((contact) => ({
              title: `${contact.firstName} ${contact.lastName}`,
              subtitle: `${formatStatusLabel(contact.relationship)}${contact.contactNo ? ` | ${contact.contactNo}` : ''}`,
              detail: contact.email ?? '-',
            }))}
          />
        </div>
      </SectionCard>

      <SectionCard title="Education" description="Academic records linked to this employee.">
        <RecordTable
          emptyLabel="No education records available"
          columns={['Attainment', 'School', 'Course', 'Graduated']}
          rows={view.educationRecords.map((record) => [
            record.attainment,
            record.school,
            record.course ?? '-',
            formatDate(record.dateGraduated),
          ])}
        />
      </SectionCard>

      <SectionCard
        title="Exams & Certifications"
        description="Exam records imported into the seeded employee profile."
      >
        <RecordTable
          emptyLabel="No exams or certifications available"
          columns={['Exam', 'Taken', 'Rating', 'Description']}
          rows={view.examRecords.map((record) => [
            record.name,
            formatDate(record.dateTaken),
            record.rating ?? '-',
            record.description ?? '-',
          ])}
        />
      </SectionCard>
    </div>
  );
}

export function EmploymentTab({ view }: DetailTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <SectionCard
        title="Current Assignment"
        description="The employee's current org, position, and assignment details are joined from seeded personnel and org-structure tables."
      >
        <InfoGrid
          items={[
            ['Employment Status', formatStatusLabel(view.position?.employmentStatus ?? view.employment?.status)],
            ['Employment Range', formatDateRange(view.employment?.startDate, view.employment?.endDate)],
            ['Org Unit', view.orgUnit ? `${view.orgUnit.code} | ${view.orgUnit.name}` : '-'],
            ['Position Template', view.positionTemplate?.name ?? '-'],
            ['Position Profile', view.positionProfile?.label ?? '-'],
            ['Assignment Type', view.assignment?.assignmentType ?? '-'],
            ['FTE', view.assignment?.fte ? `${parseNumber(view.assignment.fte)}` : '-'],
            ['Base Pay', formatCurrency(view.position?.defaultBasePay)],
            ['Planned Headcount', String(view.position?.plannedHeadcount ?? '-')],
            ['Remarks', view.employment?.remarks ?? '-'],
          ]}
        />
      </SectionCard>

      <SectionCard
        title="Employment History"
        description="Background experience and references are pulled from the seeded profile-history and employment-history records."
      >
        <div className="space-y-6">
          <RecordTable
            emptyLabel="No employment history available"
            columns={['Company', 'Position', 'Department', 'Range']}
            rows={view.employmentHistoryRecords.map((record) => [
              record.company,
              record.position ?? '-',
              record.department ?? '-',
              formatDateRange(record.startDate, record.endDate),
            ])}
          />
          <SubList
            title={`Reference Contacts (${view.referenceContacts.length})`}
            emptyLabel="No reference contacts recorded"
            items={view.referenceContacts.map((contact) => ({
              title: `${contact.firstName} ${contact.lastName}`,
              subtitle: `${contact.position ?? 'Reference'}${contact.business ? ` | ${contact.business}` : ''}`,
              detail: contact.contactNo ?? contact.address ?? '-',
            }))}
          />
        </div>
      </SectionCard>
    </div>
  );
}

export function PayProfileTab({ view }: DetailTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <SectionCard
        title="Pay Profile Summary"
        description="This section combines seeded employee pay profiles, salary-grade setup, and position-level compensation data."
      >
        <InfoGrid
          items={[
            ['Pay Basis', view.payProfile?.payBasis ?? '-'],
            ['Profile Status', formatStatusLabel(view.payProfile?.status)],
            ['Effective Range', formatDateRange(view.payProfile?.effectiveStartDate, view.payProfile?.effectiveEndDate)],
            ['Template Family', view.templateFamily?.name ?? '-'],
            ['Template Kind', formatStatusLabel(view.templateFamily?.templateKind)],
            ['Pay Applicability', view.templateFamily?.payBasisApplicability ?? '-'],
            ['Current Revision', view.currentTemplateRevision?.versionNo ?? '-'],
            ['Salary Grade', view.salaryGrade ? `${view.salaryGrade.code} | ${view.salaryGrade.name}` : '-'],
            [
              'Salary Step',
              view.salaryGradeStep
                ? `${view.salaryGradeStep.name} | ${formatCurrency(view.salaryGradeStep.amount)}`
                : '-',
            ],
            ['Base Pay', formatCurrency(view.position?.defaultBasePay)],
          ]}
        />
      </SectionCard>

      <SectionCard
        title="Compensation Components"
        description="The current template revision lines are resolved into real earning components from the seeded pay-structure dataset."
      >
        <RecordTable
          emptyLabel="No compensation components were resolved for this employee"
          columns={['Component', 'Category', 'Value Source', 'Taxable', '13th Month']}
          rows={view.compensationLines.map(({ component }) => [
            component?.name ?? 'Unknown component',
            formatStatusLabel(component?.category),
            formatStatusLabel(component?.valueSource),
            component?.isTaxableDefault ? 'Yes' : 'No',
            component?.includeIn13thMonthDefault ? 'Included' : 'Excluded',
          ])}
        />
      </SectionCard>
    </div>
  );
}

export function PafTab({ view }: DetailTabProps) {
  return (
    <SectionCard
      title="Personnel Action Forms"
      description="Action forms for this employee are linked to seeded approval requests when applicable."
    >
      <RecordTable
        emptyLabel="No personnel action forms were recorded for this employee"
        columns={['Action', 'Effective Date', 'Status', 'Approval Request', 'Payload']}
        rows={view.pafRecords.map(({ record, approvalRequest }) => [
          formatStatusLabel(record.actionType),
          formatDate(record.effectiveDate),
          <StatusBadge key={record.id} value={record.status} />,
          approvalRequest ? `#${approvalRequest.id} | ${formatStatusLabel(approvalRequest.status)}` : 'Unrouted',
          describeJsonValue(record.payloadJson),
        ])}
      />
    </SectionCard>
  );
}

export function HistoryTab({ view }: DetailTabProps) {
  return (
    <SectionCard
      title="Change History"
      description="Recent employee changes from the seeded profile-history table."
    >
      <div className="space-y-4">
        {view.profileHistories.length === 0 ? (
          <EmptyState
            title="No profile history is available"
            description="This employee does not have seeded change-history rows yet."
          />
        ) : (
          view.profileHistories.map((history) => (
            <div key={history.id} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-slate-900">
                      {formatStatusLabel(history.fieldName)}
                    </div>
                    <StatusBadge value={history.changeSource} />
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">{history.previousValue ?? '-'}</span>
                    <span className="mx-2 text-slate-400">to</span>
                    <span className="font-semibold text-slate-700">{history.newValue ?? '-'}</span>
                  </div>
                  <div className="text-xs text-slate-500">{history.changeReason ?? 'No change reason provided'}</div>
                </div>
                <div className="text-right text-xs font-semibold text-slate-500">
                  <div>{formatDate(history.changedAt)}</div>
                  <div className="mt-1">
                    {history.pafRecordId ? `PAF #${history.pafRecordId}` : 'Direct update'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center">
      <div className="text-sm font-bold text-slate-900">{title}</div>
      <div className="mt-1 text-xs text-slate-500">{description}</div>
    </div>
  );
}
