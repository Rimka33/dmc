import React, { useState, useEffect, useRef } from 'react';
import { Bell, Package, AlertTriangle, Check, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { Link } from '@inertiajs/react';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/count');
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
      if (!notifications.find((n) => n.id === id)?.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package size={16} className="text-forest-green" />;
      case 'stock':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20' : 'text-dark-green/60 hover:bg-forest-green/5 hover:text-forest-green'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-forest-green/10 z-[100] overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-forest-green/5 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-sm font-black text-dark-green uppercase tracking-wider">
                  Notifications
                </h3>
                <p className="text-[10px] text-dark-green/40 font-bold uppercase tracking-widest mt-0.5">
                  {unreadCount} non lues
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-black text-forest-green hover:text-dark-green uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                  <Check size={12} /> Tout lire
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest-green mx-auto"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-forest-green/5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 hover:bg-forest-green/[0.02] transition-colors cursor-pointer relative group ${!n.is_read ? 'bg-forest-green/[0.03]' : ''}`}
                      onClick={() => {
                        if (!n.is_read) markAsRead(n.id);
                        if (n.data?.url) {
                          setIsOpen(false);
                          // We use window.location because we don't know if the URL is an Inertia route
                          window.location.href = n.data.url;
                        }
                      }}
                    >
                      <div className="flex gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.is_read ? 'bg-white shadow-sm' : 'bg-gray-50'}`}
                        >
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4
                              className={`text-xs font-bold truncate pr-6 ${!n.is_read ? 'text-dark-green' : 'text-dark-green/60'}`}
                            >
                              {n.title}
                            </h4>
                            <span className="text-[9px] text-dark-green/30 font-bold flex items-center gap-1">
                              <Clock size={10} /> {formatTime(n.created_at)}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] leading-relaxed line-clamp-2 ${!n.is_read ? 'text-dark-green/70' : 'text-dark-green/40'}`}
                          >
                            {n.message}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons hidden by default, shown on hover */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => deleteNotification(n.id, e)}
                          className="p-1.5 bg-white shadow-sm border border-red-100 text-red-400 hover:text-red-500 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {!n.is_read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-forest-green rounded-full opacity-50"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-100">
                    <Bell size={24} className="text-gray-200" />
                  </div>
                  <h4 className="text-xs font-black text-dark-green uppercase tracking-widest italic">
                    Aucune notification
                  </h4>
                  <p className="text-[10px] text-dark-green/40 font-bold uppercase tracking-wider mt-2">
                    Vous êtes à jour !
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-forest-green/5 text-center">
              <Link
                href="/admin/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-dark-green/40 hover:text-forest-green uppercase tracking-[0.2em] transition-colors block w-full"
              >
                Voir tout l'historique
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
