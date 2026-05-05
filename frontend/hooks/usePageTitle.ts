import { useEffect } from 'react';
import { useBreadcrumb } from '../context/BreadcrumbContext';

export function usePageTitle(title: string | null) {
  const { setPageTitle } = useBreadcrumb();

  useEffect(() => {
    setPageTitle(title);

    return () => {
      setPageTitle(null);
    };
  }, [setPageTitle, title]);
}
