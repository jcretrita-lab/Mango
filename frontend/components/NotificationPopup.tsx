import React, { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bell, CheckCircle, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, type NotificationType } from '../context/NotificationContext';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'Success':
      return <CheckCircle2 size={11} className="text-emerald-500" />;
    case 'Warning':
      return <AlertCircle size={11} className="text-amber-500" />;
    case 'Error':
      return <AlertCircle size={11} className="text-rose-500" />;
    default:
      return <Info size={11} className="text-blue-500" />;
  }
};

const getBgColor = (type: NotificationType) => {
  switch (type) {
    case 'Success':
      return 'bg-emerald-50';
    case 'Warning':
      return 'bg-amber-50';
    case 'Error':
      return 'bg-rose-50';
    default:
      return 'bg-blue-50';
  }
};

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  const handleNotificationClick = useCallback(
    (id: string) => {
      markAsRead(id);
      navigate(`/monitor/notifications/${id}`);
      onClose();
    },
    [markAsRead, navigate, onClose],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed right-4 top-16 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell size={13} className="text-indigo-600" />
                {unreadCount > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />}
              </div>
              <span className="text-sm font-bold text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">{unreadCount}</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded px-2 py-1 text-[10px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[260px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                <CheckCircle size={20} className="mb-1 text-emerald-400" />
                <p className="text-xs text-slate-500">No notification events from the API yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.15 }}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`relative cursor-pointer border-b border-slate-100 p-2.5 transition-all last:border-b-0 ${
                      notif.isRead ? 'bg-slate-50 opacity-75' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-amber-500" />}

                    <div className="flex items-start gap-2 pl-2">
                      <div className={`shrink-0 rounded-lg p-1.5 ${getBgColor(notif.type)} mt-0.5`}>{getIcon(notif.type)}</div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className={`truncate text-xs ${notif.isRead ? 'font-medium text-slate-500' : 'font-bold text-slate-900'}`}>
                            {notif.title}
                          </h4>
                          <span className={`shrink-0 text-[9px] ${notif.isRead ? 'text-slate-400' : 'font-bold text-indigo-600'}`}>
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className={`mt-0.5 line-clamp-1 text-[10px] ${notif.isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                          {notif.message}
                        </p>
                      </div>

                      {!notif.isRead && (
                        <motion.div
                          className="shrink-0 mt-0.5"
                          animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Bell size={10} className="text-amber-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-2 py-1.5">
            <button
              onClick={() => {
                navigate('/monitor/notifications');
                onClose();
              }}
              className="flex w-full items-center justify-center gap-1 rounded py-1 text-[10px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              <span>View All</span>
              <ArrowRight size={10} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
