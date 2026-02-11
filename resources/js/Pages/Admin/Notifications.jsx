'use client';

import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import {
  Bell,
  Package,
  AlertTriangle,
  Check,
  Trash2,
  Clock,
  Inbox,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Notifications({ notifications }) {
  const { auth } = usePage().props;

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package size={20} className="text-forest-green" />;
      case 'stock':
        return <AlertTriangle size={20} className="text-amber-500" />;
      default:
        return <Bell size={20} className="text-blue-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const markAsRead = (id) => {
    router.post(
      `/admin/notifications/${id}/read`,
      {},
      {
        preserveScroll: true,
      }
    );
  };

  const markAllAsRead = () => {
    router.post(
      '/admin/notifications/mark-all-as-read',
      {},
      {
        preserveScroll: true,
      }
    );
  };

  const deleteNotification = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette notification ?')) {
      router.delete(`/admin/notifications/${id}`, {
        preserveScroll: true,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2
              className="text-3xl font-bold text-dark-green mb-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Notifications
            </h2>
            <p className="text-dark-green/60 font-medium">
              Gérez vos alertes de commandes et de stock.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-forest-green/10 text-forest-green hover:bg-forest-green hover:text-white rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
            >
              <CheckCircle2 size={14} />
              Tout marquer comme lu
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-forest-green/10 rounded-[2.5rem] shadow-xl overflow-hidden"
        >
          {notifications.data.length > 0 ? (
            <div className="divide-y divide-forest-green/5">
              {notifications.data.map((n) => (
                <motion.div
                  key={n.id}
                  variants={itemVariants}
                  className={`group p-6 hover:bg-forest-green/[0.02] transition-all relative flex flex-col sm:flex-row gap-4 sm:items-center ${!n.is_read ? 'bg-forest-green/[0.03]' : ''}`}
                >
                  {/* Status Indicator bubble */}
                  {!n.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-forest-green"></div>
                  )}

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${!n.is_read ? 'bg-white shadow-md' : 'bg-gray-50'}`}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4
                        className={`text-sm font-black uppercase tracking-tight ${!n.is_read ? 'text-dark-green' : 'text-dark-green/60'}`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-dark-green/30 font-bold flex items-center gap-1">
                        <Clock size={12} /> {formatTime(n.created_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${!n.is_read ? 'text-dark-green/80' : 'text-dark-green/40'}`}
                    >
                      {n.message}
                    </p>

                    {n.data?.url && (
                      <Link
                        href={n.data.url}
                        className="mt-3 inline-flex items-center gap-2 text-[10px] font-black text-forest-green hover:text-dark-green uppercase tracking-widest group/link"
                        onClick={() => !n.is_read && markAsRead(n.id)}
                      >
                        Voir les détails{' '}
                        <MoreVertical
                          size={12}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="p-3 bg-white shadow-sm border border-forest-green/10 text-forest-green hover:bg-forest-green hover:text-white rounded-xl transition-all"
                        title="Marquer comme lu"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="p-3 bg-white shadow-sm border border-red-100 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-gray-200">
                <Inbox size={40} className="text-gray-200" />
              </div>
              <h3 className="text-lg font-black text-dark-green uppercase tracking-[0.2em] italic">
                Votre boîte est vide
              </h3>
              <p className="text-xs text-dark-green/40 font-bold uppercase tracking-widest mt-3">
                Vous n'avez aucune notification pour le moment.
              </p>
            </div>
          )}

          {/* Pagination would go here if needed, but for simple use we just show the paginate results */}
          {notifications.links && notifications.links.length > 3 && (
            <div className="p-6 border-t border-forest-green/5 flex justify-center">
              <nav className="flex gap-1">
                {notifications.links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${link.active ? 'bg-forest-green text-white shadow-lg shadow-forest-green/30' : 'text-dark-green/60 hover:bg-forest-green/10'}`}
                  />
                ))}
              </nav>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
