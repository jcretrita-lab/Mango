import React, { lazy, Suspense, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { dynamicShellRoutes, staticShellRoutes, type ShellRoute } from '../config/appShellRoutes';
import { useAuth } from '../context/AuthContext';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import RoutePlaceholder from '../pages/RoutePlaceholder';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const EmployeeDirectoryPage = lazy(() => import('../features/personnel/EmployeeDirectoryPage'));
const EmployeeOnboardingPage = lazy(() => import('../features/personnel/EmployeeOnboardingPage'));
const EmployeeOffboardingPage = lazy(() => import('../features/personnel/EmployeeOffboardingPage'));
const PersonnelActionFormsPage = lazy(() => import('../features/personnel/PersonnelActionFormsPage'));
const EmployeeDetailPage = lazy(() => import('../features/personnel/EmployeeDetailPage'));
const PayStructurePage = lazy(() => import('../features/payroll/PayStructurePage'));
const ApprovalListPage = lazy(() => import('../features/approvals/ApprovalListPage'));
const ApprovalDetailPage = lazy(() => import('../features/approvals/ApprovalDetailPage'));
const SettingsOverviewPage = lazy(() => import('../features/settings/SettingsOverviewPage'));
const UserManagementPage = lazy(() => import('../features/settings/UserManagementPage'));
const RoleManagementPage = lazy(() => import('../features/settings/RoleManagementPage'));
const PermissionManagementPage = lazy(() => import('../features/settings/PermissionManagementPage'));
const RankSettingsPage = lazy(() => import('../features/settings/RankSettingsPage'));
const PositionTemplateSettingsPage = lazy(() => import('../features/settings/PositionTemplateSettingsPage'));
const SalaryGradeSettingsPage = lazy(() => import('../features/settings/SalaryGradeSettingsPage'));
const OrgStructureSettingsPage = lazy(() => import('../features/settings/OrgStructureSettingsPage'));
const ApprovalSetupPage = lazy(() => import('../features/settings/ApprovalSetupPage'));
const EmployeeFieldSettingsPage = lazy(() => import('../features/settings/EmployeeFieldSettingsPage'));

const EMPLOYEE_ALLOWED_PATH_PREFIXES = ['/manage/employee/'];

function isEmployeeRouteAllowed(pathname: string) {
  return pathname === '/my-profile' || EMPLOYEE_ALLOWED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role === 'Employee' && !isEmployeeRouteAllowed(location.pathname)) {
    return <Navigate to="/my-profile" replace />;
  }

  return <>{children}</>;
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user?.role === 'Employee' ? '/my-profile' : '/dashboard'} replace />;
}

function MyProfileRedirect() {
  const { user } = useAuth();

  if (user?.employeeId) {
    return <Navigate to={`/manage/employee/${user.employeeId}`} replace />;
  }

  return (
    <RoutePlaceholder
      title="Employee Record Unavailable"
      description="This session does not have an employee record attached, so the self-service workspace cannot be opened yet."
      contextLabel="Missing employee mapping"
      phase="phase1"
    />
  );
}

function RouteLoadingState() {
  return (
    <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
      <div className="text-lg font-bold text-slate-900">Loading page</div>
      <div className="mt-2 text-sm leading-6 text-slate-500">
        Preparing this workspace view.
      </div>
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <ErrorBoundary>
        <Suspense fallback={<RouteLoadingState />}>{children}</Suspense>
      </ErrorBoundary>
    </motion.div>
  );
}

function titleFromEmployeeTab(tab: string | null) {
  switch (tab) {
    case 'Schedule':
      return 'My Schedule';
    case 'Pay Profile':
      return 'My Pay Profile';
    case 'Payroll':
      return 'My Payroll';
    case 'Attendance':
      return 'My Attendance';
    case 'Personnel Action Form':
      return 'My Personnel Action Forms';
    default:
      return 'Employee Record';
  }
}

function EmployeeRecordPlaceholder() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');
  const title = titleFromEmployeeTab(activeTab);

  return (
    <RoutePlaceholder
      title={title}
      description="This employee view uses the final shell navigation, but the tab content remains empty until Personnel, Org Structure, and Pay Structure data is available from the backend."
      contextLabel={activeTab ? `Current tab: ${activeTab}` : 'Employee detail'}
      phase="phase1"
      preview={dynamicShellRoutes.find((route) => route.path === '/manage/employee/:id')?.preview}
    />
  );
}

function Phase1StaticPage({ path }: { path: string }) {
  switch (path) {
    case '/dashboard':
      return <DashboardPage />;
    case '/manage/employee':
      return <EmployeeDirectoryPage />;
    case '/manage/employee/onboarding':
      return <EmployeeOnboardingPage />;
    case '/manage/employee/offboarding':
      return <EmployeeOffboardingPage />;
    case '/manage/paf':
      return <PersonnelActionFormsPage />;
    case '/manage/pay-structure':
      return <PayStructurePage />;
    case '/monitor/approvals':
      return <ApprovalListPage />;
    case '/settings/overview':
      return <SettingsOverviewPage />;
    case '/settings/users':
      return <UserManagementPage />;
    case '/settings/roles':
      return <RoleManagementPage />;
    case '/settings/permissions':
      return <PermissionManagementPage />;
    case '/settings/ranks':
      return <RankSettingsPage />;
    case '/settings/position-templates':
      return <PositionTemplateSettingsPage />;
    case '/settings/salary-grade':
      return <SalaryGradeSettingsPage />;
    case '/settings/structure':
      return <OrgStructureSettingsPage />;
    case '/settings/approvals':
      return <ApprovalSetupPage />;
    case '/settings/employee-fields':
      return <EmployeeFieldSettingsPage />;
    default:
      return null;
  }
}

function Phase1DynamicPage({ path }: { path: string }) {
  switch (path) {
    case '/manage/employee/:id':
      return <EmployeeDetailPage />;
    case '/monitor/approvals/:id':
      return <ApprovalDetailPage />;
    default:
      return null;
  }
}

function PoliciesPlaceholder() {
  const [searchParams] = useSearchParams();
  const { setPageTitle } = useBreadcrumb();
  const activeTab = searchParams.get('tab');
  const isGovernmentTab = activeTab?.toLowerCase() === 'government';
  const title = isGovernmentTab ? 'Government Policy' : 'Company Policy';

  useEffect(() => {
    setPageTitle(title);

    return () => setPageTitle(null);
  }, [setPageTitle, title]);

  return (
    <RoutePlaceholder
      title={title}
      description={
        isGovernmentTab
          ? 'Government policy standards and compliance rules will appear here once the Policies and Rules backend is connected.'
          : 'Company policy catalogs and internal rule definitions will appear here once the Policies and Rules backend is connected.'
      }
      contextLabel={activeTab ? `Current tab: ${activeTab}` : 'Policy configuration'}
      phase="future"
    />
  );
}

function ShellRoutePlaceholder({ route }: { route: ShellRoute }) {
  return (
    <RoutePlaceholder
      title={route.title}
      description={route.description}
      phase={route.phase}
      preview={route.preview}
    />
  );
}

export default function AppShellRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/my-profile" element={<ProtectedRoute><MyProfileRedirect /></ProtectedRoute>} />

        {staticShellRoutes
          .filter((route) => route.path !== '/settings/policies')
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    {route.phase === 'phase1' ? (
                      <Phase1StaticPage path={route.path} />
                    ) : (
                      <ShellRoutePlaceholder route={route} />
                    )}
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
          ))}

        <Route
          path="/settings/policies"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <PoliciesPlaceholder />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage/employee/:id"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Phase1DynamicPage path="/manage/employee/:id" />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        {dynamicShellRoutes
          .filter((route) => route.path !== '/manage/employee/:id')
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    {route.phase === 'phase1' ? (
                      <Phase1DynamicPage path={route.path} />
                    ) : (
                      <ShellRoutePlaceholder route={route} />
                    )}
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
          ))}

        <Route
          path="*"
          element={
            <PageWrapper>
              <RoutePlaceholder
                title="Page not configured"
                description="This route has not been mapped into the Diwa HRIS shell yet. The navigation shell is active, but this specific page is still waiting to be connected."
                phase="future"
              />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
