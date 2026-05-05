import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  UserCircle,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import NotificationPopup from './NotificationPopup';
import {
  canAccessSettingsNavigation,
  getPrimaryNavigation,
  getSearchItems,
  getSettingsNavigation,
  type NavigationItem,
  type NavigationSection,
} from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import { BreadcrumbProvider } from '../context/BreadcrumbContext';
import { useNotifications } from '../context/NotificationContext';
import { sortAlphabeticalDropdownOptions } from '../hooks/useAlphabeticalDropdownOptions';
import useClickOutside from '../hooks/useClickOutside';
import useDebounce from '../hooks/useDebounce';

interface LayoutProps {
  children: React.ReactNode;
}

const NOTIFICATION_POPUP_STORAGE_KEY = 'hris_notification_popup_auto_opened';
const DEFAULT_EMPLOYEE_TAB = 'Profile';

function areSearchParamsEqual(left: URLSearchParams, right: URLSearchParams) {
  const leftEntries = Array.from(left.entries()).sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    if (leftKey === rightKey) {
      return leftValue.localeCompare(rightValue);
    }

    return leftKey.localeCompare(rightKey);
  });

  const rightEntries = Array.from(right.entries()).sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    if (leftKey === rightKey) {
      return leftValue.localeCompare(rightValue);
    }

    return leftKey.localeCompare(rightKey);
  });

  if (leftEntries.length !== rightEntries.length) {
    return false;
  }

  return leftEntries.every(([leftKey, leftValue], index) => {
    const [rightKey, rightValue] = rightEntries[index];
    return leftKey === rightKey && leftValue === rightValue;
  });
}

function matchesNavItemPath(itemPath: string, pathname: string, search: string) {
  const itemUrl = new URL(itemPath, 'https://diwa-hris.local');

  if (itemUrl.pathname !== pathname) {
    return false;
  }

  if (!itemUrl.search) {
    return true;
  }

  return areSearchParamsEqual(itemUrl.searchParams, new URLSearchParams(search));
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNotificationsPinned, setIsNotificationsPinned] = useState(false);

  const searchQuery = useDebounce(searchInput, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const isSettingsPath = location.pathname.startsWith('/settings');
  const isStandalonePage = location.pathname === '/login';
  const employeeBasePath = user?.employeeId ? `/manage/employee/${user.employeeId}` : '/my-profile';
  const activeEmployeeTab = useMemo(
    () => new URLSearchParams(location.search).get('tab') ?? DEFAULT_EMPLOYEE_TAB,
    [location.search],
  );
  const canAccessSettings = canAccessSettingsNavigation(user?.role);

  const activeNavigation = useMemo(
    () => (isSettingsPath ? getSettingsNavigation(user?.role) : getPrimaryNavigation(user?.role, employeeBasePath)),
    [employeeBasePath, isSettingsPath, user?.role],
  );
  const searchItems = useMemo(
    () => getSearchItems(user?.role, employeeBasePath),
    [employeeBasePath, user?.role],
  );

  const isNavigationItemActive = useCallback(
    (item: NavigationItem) => {
      if (user?.role === 'Employee' && item.profileTab) {
        return location.pathname === employeeBasePath && activeEmployeeTab === item.profileTab;
      }

      return matchesNavItemPath(item.path, location.pathname, location.search);
    },
    [activeEmployeeTab, employeeBasePath, location.pathname, location.search, user?.role],
  );

  const filteredSearchItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchingItems = searchItems.filter((item) => item.title.toLowerCase().includes(normalizedQuery));

    return sortAlphabeticalDropdownOptions(matchingItems, (item) => item.title);
  }, [searchItems, searchQuery]);

  const closeSearch = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  useClickOutside(searchRef, closeSearch, isSearchFocused);

  useEffect(() => {
    const hasAutoOpened = sessionStorage.getItem(NOTIFICATION_POPUP_STORAGE_KEY);

    if (!hasAutoOpened && unreadCount > 0) {
      setShowNotifications(true);
      sessionStorage.setItem(NOTIFICATION_POPUP_STORAGE_KEY, 'true');
    }
  }, [unreadCount]);

  useEffect(() => {
    if (activeNavigation.length === 0) {
      return;
    }

    setExpandedGroups((previousGroups) => {
      const nextGroups = [...previousGroups];
      let hasChanged = false;

      activeNavigation.forEach((group) => {
        const hasActiveItem = group.items.some(isNavigationItemActive);

        if (hasActiveItem && group.section !== 'Home' && !nextGroups.includes(group.section)) {
          nextGroups.push(group.section);
          hasChanged = true;
        }
      });

      return hasChanged ? nextGroups : previousGroups;
    });
  }, [activeNavigation, isNavigationItemActive]);

  const toggleGroup = useCallback((section: string) => {
    setExpandedGroups((previousGroups) =>
      previousGroups.includes(section)
        ? previousGroups.filter((group) => group !== section)
        : [...previousGroups, section],
    );
  }, []);

  const handleBellClick = useCallback(() => {
    setShowNotifications((isOpen) => {
      const nextIsOpen = !isOpen;
      setIsNotificationsPinned(nextIsOpen);
      return nextIsOpen;
    });
  }, []);

  const handleBellMouseEnter = useCallback(() => {
    setShowNotifications(true);
  }, []);

  const handleBellMouseLeave = useCallback(() => {
    if (!isNotificationsPinned) {
      setShowNotifications(false);
    }
  }, [isNotificationsPinned]);

  const handleCloseNotifications = useCallback(() => {
    setShowNotifications(false);
    setIsNotificationsPinned(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleSearchResultClick = useCallback(
    (path: string) => {
      navigate(path);
      setIsSearchFocused(false);
      setSearchInput('');
    },
    [navigate],
  );

  const renderNavigationSection = (group: NavigationSection) => {
    const isGroupOpen = expandedGroups.includes(group.section);
    const isCollapsible = group.isCollapsible !== false;
    const SectionIcon = group.icon;

    return (
      <div key={group.section} className="flex flex-col">
        {isSidebarOpen ? (
          isCollapsible ? (
            <button
              onClick={() => toggleGroup(group.section)}
              className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 transition-all group ${
                isSettingsPath ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 text-left">
                {SectionIcon ? (
                  <span
                    className={`transition-colors ${
                      isSettingsPath ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  >
                    <SectionIcon size={19} />
                  </span>
                ) : null}
                <span
                  className={`text-left text-[12px] font-bold uppercase tracking-wider transition-colors ${
                    isSettingsPath ? 'group-hover:text-white' : 'group-hover:text-slate-900'
                  }`}
                >
                  {group.section}
                </span>
              </div>
              <ChevronRight
                size={14}
                className={`transition-all duration-200 ${
                  isSettingsPath ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'
                } ${isGroupOpen ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            <h3
              className={`mb-1 px-3 pt-1 text-left text-[11px] font-bold uppercase tracking-widest ${
                isSettingsPath ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {group.section}
            </h3>
          )
        ) : (
          <div className="mb-1 flex w-full justify-center" title={group.section}>
            {isCollapsible ? (
              <button
                onClick={() => {
                  setIsSidebarOpen(true);

                  if (!isGroupOpen) {
                    toggleGroup(group.section);
                  }
                }}
                className={`rounded-xl p-2 transition-all ${
                  isSettingsPath ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-indigo-600'
                }`}
              >
                {SectionIcon ? <SectionIcon size={19} /> : null}
              </button>
            ) : (
              <div className={`mx-1 my-2 h-px w-full ${isSettingsPath ? 'bg-slate-700' : 'bg-slate-200'}`} />
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {(!isCollapsible || isGroupOpen || !isSidebarOpen) && (
            <motion.div
              key={`content-${group.section}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className={isSidebarOpen ? 'mt-0.5 space-y-0.5' : 'space-y-1'}>
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = isNavigationItemActive(item);

                  return (
                    <NavLink
                      key={`${group.section}-${item.path}`}
                      to={item.path}
                      title={isSidebarOpen ? '' : item.label}
                      className={() =>
                        [
                          'group relative flex items-center rounded-xl transition-all duration-200',
                          isSidebarOpen ? 'ml-3 gap-3 border-l-2 px-3 py-2 text-sm font-medium' : 'mx-auto h-10 w-10 justify-center border-none',
                          isActive
                            ? isSettingsPath
                              ? 'border-indigo-500 bg-slate-800/50 text-white'
                              : 'border-indigo-500 bg-indigo-50/50 font-semibold text-indigo-700'
                            : isSettingsPath
                              ? 'border-transparent text-slate-400 hover:border-slate-500 hover:text-slate-200'
                              : 'border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-50/50 hover:text-slate-900',
                        ].join(' ')
                      }
                    >
                      <span
                        className={`text-left ${
                          isActive
                            ? isSettingsPath
                              ? 'text-indigo-400'
                              : 'text-indigo-600'
                            : isSettingsPath
                              ? 'text-slate-500 group-hover:text-slate-400'
                              : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        <ItemIcon size={18} strokeWidth={1.5} />
                      </span>
                      {isSidebarOpen ? <span className="text-left">{item.label}</span> : null}
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside
        className={`fixed z-20 flex h-full flex-col overflow-hidden border-r border-slate-200 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isSettingsPath ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
      >
        <div className={`flex items-center gap-3 ${isSidebarOpen ? 'px-6 py-6' : 'justify-center py-6'}`}>
          <div className={`${isSettingsPath ? 'bg-indigo-500' : 'bg-indigo-600'} shrink-0 rounded-xl p-2 shadow-lg`}>
            <ShieldCheck className="text-white" size={22} />
          </div>
          {isSidebarOpen ? (
            <span className={`text-xl font-bold tracking-tight ${isSettingsPath ? 'text-white' : 'text-slate-900'}`}>HRIS</span>
          ) : null}
        </div>

        {isSettingsPath && canAccessSettings ? (
          <div className={`pb-3 ${isSidebarOpen ? 'px-4' : 'flex justify-center px-2'}`}>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 transition-all hover:bg-slate-800 hover:text-white ${
                isSidebarOpen ? 'w-full px-3 py-2.5' : 'justify-center p-2.5'
              }`}
              title={isSidebarOpen ? '' : 'Return to App'}
            >
              <ArrowLeft size={16} />
              {isSidebarOpen ? 'Return to App' : null}
            </button>
          </div>
        ) : null}

        <nav className={`no-scrollbar custom-scroll flex-1 overflow-y-auto ${isSidebarOpen ? 'space-y-3 px-3 py-4' : 'space-y-2 px-3 py-4'}`}>
          {activeNavigation.length > 0 ? (
            activeNavigation.map(renderNavigationSection)
          ) : (
            <div className="p-4 text-left text-xs italic text-slate-500">{isSidebarOpen ? 'No settings available for this role.' : ''}</div>
          )}
        </nav>

        {!isSettingsPath && canAccessSettings ? (
          <div className={`mt-auto border-t border-slate-100 ${isSidebarOpen ? 'p-4' : 'flex justify-center p-3'}`}>
            <button
              onClick={() => navigate('/settings/overview')}
              className={`flex items-center gap-3 rounded-xl text-slate-600 transition-all hover:bg-slate-100 hover:shadow-sm ${
                isSidebarOpen ? 'w-full px-3 py-2.5 text-sm font-bold' : 'h-10 w-10 justify-center p-2.5'
              }`}
              title={isSidebarOpen ? '' : 'System Settings'}
            >
              <Settings size={19} className="shrink-0 text-slate-400" />
              {isSidebarOpen ? <span>System Settings</span> : null}
            </button>
          </div>
        ) : null}
      </aside>

      <main className={`relative flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <Menu size={20} />
            </button>

            {isSettingsPath ? (
              <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                System Mode
              </div>
            ) : null}

            <div className="relative hidden max-w-lg flex-1 md:block" ref={searchRef}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search pages"
                className="w-full rounded-xl border-none bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-100"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 top-full z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl"
                  >
                    {filteredSearchItems.length > 0 ? (
                      <div className="py-2">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Search Results</div>
                        {filteredSearchItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSearchResultClick(item.path)}
                            className="group flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${
                                  item.type === 'Page' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {item.type}
                              </span>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.title}</span>
                            </div>
                            <ArrowLeft size={14} className="rotate-180 text-slate-300 opacity-0 transition-all group-hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-400">No results found.</div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative group" onMouseEnter={handleBellMouseEnter} onMouseLeave={handleBellMouseLeave}>
              <button
                onClick={handleBellClick}
                className={`relative rounded-lg p-2 transition-all duration-200 ${
                  showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                <Bell size={18} />
                {unreadCount > 0 ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-indigo-600"
                  >
                    <span className="text-[9px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  </motion.span>
                ) : null}
              </button>
              <NotificationPopup isOpen={showNotifications} onClose={handleCloseNotifications} />
            </div>

            <div className="h-6 w-px bg-slate-200" />

            <div className="relative group">
              <button className="flex cursor-pointer items-center gap-3 rounded-xl py-1.5 pl-2 text-left outline-none transition-colors hover:bg-slate-50">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold leading-none text-slate-900">{user?.name ?? 'Guest'}</p>
                  <p className="mt-1 text-[10px] font-semibold text-slate-500">{user?.role ?? 'Seeded Phase 1 session'}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-md">
                  {user?.name ? user.name.split(' ').map((token) => token[0]).join('') : <UserCircle size={24} />}
                </div>
                <ChevronDown size={14} className="text-slate-400 transition-colors group-hover:text-slate-600" />
              </button>

              <div className="invisible absolute right-0 top-full z-50 mt-1 w-48 origin-top-right rounded-xl border border-slate-100 bg-white p-1 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="mb-1 border-b border-slate-50 px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto flex-1 min-w-0 w-full max-w-full p-10">
          <BreadcrumbProvider>
            <Breadcrumb />
            {children}
          </BreadcrumbProvider>
        </div>
      </main>
    </div>
  );
};

export default Layout;
