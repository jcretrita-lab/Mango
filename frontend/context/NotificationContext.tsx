import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type NotificationType = 'Info' | 'Success' | 'Warning' | 'Error';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function sortNotifications(notifications: NotificationItem[]) {
  return [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) {
      return 0;
    }

    return a.isRead ? 1 : -1;
  });
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.isRead).length, [notifications]);
  const sortedNotifications = useMemo(() => sortNotifications(notifications), [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((previousNotifications) =>
      sortNotifications(
        previousNotifications.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification,
        ),
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((previousNotifications) =>
      sortNotifications(previousNotifications.map((notification) => ({ ...notification, isRead: true }))),
    );
  }, []);

  const value = useMemo(
    () => ({
      notifications: sortedNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
    }),
    [markAllAsRead, markAsRead, sortedNotifications, unreadCount],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  return context;
};
