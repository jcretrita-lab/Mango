import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { HIDDEN_SEGMENTS, SEGMENT_LABELS } from '../config/route';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const { pageTitle } = useBreadcrumb();

  const items = useMemo((): BreadcrumbItem[] => {
    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/dashboard', isLast: false }];

    let accumulatedPath = '';

    for (const segment of segments) {
      accumulatedPath += `/${segment}`;

      if (HIDDEN_SEGMENTS.has(segment)) {
        continue;
      }

      const label = SEGMENT_LABELS[segment];
      if (!label) {
        continue;
      }

      const resolvedPath = segment === 'settings' ? '/settings/overview' : accumulatedPath;
      const lastCrumb = crumbs[crumbs.length - 1];

      if (lastCrumb && lastCrumb.path === resolvedPath) {
        continue;
      }

      crumbs.push({ label, path: resolvedPath, isLast: false });
    }

    if (crumbs.length <= 1) {
      return [];
    }

    crumbs[crumbs.length - 1] = {
      ...crumbs[crumbs.length - 1],
      isLast: true,
      label: pageTitle ?? crumbs[crumbs.length - 1].label,
    };

    return crumbs;
  }, [location.pathname, pageTitle]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex select-none items-center gap-1.5 text-sm font-medium">
      {items.map((item, index) => (
        <React.Fragment key={`${item.path}-${index}`}>
          {index > 0 && <ChevronRight size={16} className="flex-shrink-0 text-slate-300" aria-hidden="true" />}

          {index === 0 ? (
            <Link to={item.path} className="flex-shrink-0 text-slate-400 transition-colors duration-150 hover:text-slate-600" aria-label="Home">
              <Home size={18} />
            </Link>
          ) : item.isLast ? (
            <span className="max-w-[280px] truncate font-semibold text-slate-800" title={item.label} aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="max-w-[200px] truncate whitespace-nowrap text-slate-400 transition-colors duration-150 hover:text-slate-700"
              title={item.label}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
