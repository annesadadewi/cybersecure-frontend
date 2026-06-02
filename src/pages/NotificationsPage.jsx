import React, { useEffect, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Bell,
  Filter,
  XCircle,
  RotateCcw,
  CloudCog,
  ChevronDown,
} from 'lucide-react';
import { notificationService } from '../api/notifications';
import { formatIDR } from '../utils/transactions';

const BADGE_STYLES = {
  green: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: ArrowUpRight },
  red: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', icon: ArrowDownLeft },
  grey: { bg: 'bg-violet-300/10', border: 'border-violet-300/25', text: 'text-violet-300', icon: XCircle },
  yellow: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', icon: RotateCcw },
};

const ConfirmModal = ({ open, count, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1F5E88] border border-white/15 rounded-2xl p-14 max-w-md w-full shadow-2xl text-white space-y-6 animate-fadeIn">
        <h3 className="text-3xl font-extrabold tracking-wide text-[#B8DDF5]">
          Konfirmasi
        </h3>
        <p className="text-base text-white/90 leading-relaxed">
          Tandai <strong className="text-white font-black decoration-2">{count}</strong> notifikasi terpilih sebagai sudah dibaca?
        </p>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="px-8 py-4 rounded-xl bg-white/10 text-sm font-bold cursor-pointer">
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-4 rounded-xl bg-[#B8DDF5] text-[#1F5E88] text-sm font-bold cursor-pointer"
          >
            Ya, tandai dibaca
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filterLabels = {
    all: 'Semua',
    income: 'Pemasukan (Dana Masuk)',
    refund: 'Pengembalian Dana (Refund/Retur)',
    cancelled: 'Transaksi Dibatalkan',
  };

  const isNotificationUnread = (n) =>
    n.status === 'unread' || n.unread === true || n.is_read === false;

  const sortNotifications = (list) =>
    [...list].sort((a, b) => {
      const aUnread = isNotificationUnread(a);
      const bUnread = isNotificationUnread(b);
      if (aUnread !== bUnread) return aUnread ? -1 : 1;
      return new Date(b.occurred_at) - new Date(a.occurred_at);
    });

  const markAsReadLocally = (n) => ({
    ...n,
    is_read: true,
    unread: false,
    status: 'read',
  });

  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await notificationService.getAll(filter, 50);
      const rawNotifications = data.notifications || [];
      setNotifications(sortNotifications(rawNotifications));
      setUnreadCount(data.unread_count || 0);
      setSelectedIds([]);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (!silent) setNotifications([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    const markedIds = [...selectedIds];
    // Hitung unread yang benar-benar unread dari yang dipilih
    const unreadMarkedCount = notifications.filter(
      (n) => markedIds.includes(n.id) && isNotificationUnread(n)
    ).length;
    setNotifications((prev) =>
      sortNotifications(
        prev.map((n) => (markedIds.includes(n.id) ? markAsReadLocally(n) : n))
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - unreadMarkedCount));
    setSelectedIds([]);
    setConfirmOpen(false);
    try {
      const data = await notificationService.bulkMarkRead(markedIds, filter, 50);
      if (data.notifications) {
        setNotifications(sortNotifications(data.notifications));
        setUnreadCount(data.unread_count ?? 0);
      } else {
        fetchNotifications(true);
      }
    } catch (err) {
      console.error('Gagal menandai notifikasi:', err);
      fetchNotifications();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-white/70">
        <RefreshCw size={40} className="animate-spin mb-4 text-[#B8DDF5]" />
        <p className="text-lg font-medium">Memuat notifikasi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Notifikasi Transaksi</h2>
          {unreadCount > 0 && (
            <div className="w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
              {unreadCount}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <button
            type="button"
            onClick={() => (selectedIds.length > 0 ? setConfirmOpen(true) : null)}
            disabled={selectedIds.length === 0}
            className="flex-1 sm:flex-initial bg-[#B8DDF5]/15 text-[#B8DDF5] px-4 py-2 rounded-xl font-bold border border-[#B8DDF5]/30 hover:bg-[#B8DDF5]/25 text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Tandai Sudah Dibaca {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </button>
          <button
            type="button"
            onClick={fetchNotifications}
            disabled={loading}
            title="Refresh notifikasi"
            className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white px-3 py-2 rounded-xl font-bold text-xs border border-white/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="relative flex-1 sm:flex-initial">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#B8DDF5] hover:bg-white text-[#1F5E88] px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <Filter size={14} />
              Filter
              <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 z-20 min-w-[240px] bg-[#1F5E88] border border-white/15 rounded-xl shadow-2xl overflow-hidden py-1">
                {Object.entries(filterLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setFilter(key);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-white/10 cursor-pointer ${
                      filter === key ? 'text-[#B8DDF5] bg-white/5' : 'text-white/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-white/40 -mt-4">Filter aktif: {filterLabels[filter]}</p>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-white/50 space-y-3">
          <Bell size={40} className="mx-auto opacity-40" />
          <p className="font-semibold">Belum ada notifikasi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const style = BADGE_STYLES[notif.badge] || BADGE_STYLES.grey;
            const Icon = notif.category === 'sync' ? CloudCog : style.icon;
            const isUnread = isNotificationUnread(notif);
            const checked = selectedIds.includes(notif.id);

            return (
              <div
                key={notif.id}
                className={`flex items-stretch gap-0 rounded-xl sm:rounded-2xl border transition-all overflow-hidden ${
                  isUnread
                    ? 'bg-white/8 border-[#69C3FF]/25 shadow-[0_0_20px_rgba(105,195,255,0.08)]'
                    : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}
              >
                <div className="flex flex-1 items-center gap-4 p-3.5 px-4 min-w-0">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isUnread 
                        ? `${style.bg} ${style.border}` 
                        : 'bg-white/[0.02] border-white/10'
                    }`}
                  >
                    <Icon size={20} className={isUnread ? style.text : 'text-white/30'} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-bold ${isUnread ? style.text : 'text-white/40'}`}>{notif.type}</h3>
                      {isUnread && (
                        <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-[#4AA9FF]/20 text-[#4AA9FF]">
                          Baru
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm font-semibold truncate mt-0.5 ${isUnread ? 'text-white/80' : 'text-white/30'}`}>
                      {notif.message}
                    </p>
                    {notif.amount != null && notif.amount > 0 && (
                      <p
                        className={`text-xs font-black mt-1 ${
                          isUnread
                            ? (notif.is_refund ? 'text-red-400' : 'text-green-400')
                            : 'text-white/30'
                        }`}
                      >
                        {notif.is_refund ? '-' : '+'}
                        {formatIDR(notif.amount)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-white/40 font-bold shrink-0 hidden sm:block">{notif.time_ago}</span>
                </div>
                {isUnread ? (
                  <label
                    className="flex items-center justify-center px-4 border-l border-[#69C3FF]/20 bg-white/5 cursor-pointer shrink-0"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelect(notif.id)}
                      className="w-4 h-4 rounded accent-[#69C3FF] cursor-pointer"
                      aria-label="Pilih notifikasi"
                    />
                  </label>
                ) : (
                  <div
                    className="px-4 border-l border-white/5 bg-transparent shrink-0 w-[53px]"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        count={selectedIds.length}
        onConfirm={handleBulkMarkRead}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default NotificationsPage;
