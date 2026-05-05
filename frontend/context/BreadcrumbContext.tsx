import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbContextType {
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  pageTitle: null,
  setPageTitle: () => {},
});

interface TitleEntry {
  path: string;
  title: string;
}

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [titleEntry, setTitleEntry] = useState<TitleEntry | null>(null);
  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;

  const setPageTitle = useCallback((title: string | null) => {
    setTitleEntry(title === null ? null : { path: pathnameRef.current, title });
  }, []);

  const pageTitle = titleEntry?.path === location.pathname ? titleEntry.title : null;

  return <BreadcrumbContext.Provider value={{ pageTitle, setPageTitle }}>{children}</BreadcrumbContext.Provider>;
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);
