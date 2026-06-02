import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Shield, ShoppingBag, ExternalLink } from 'lucide-react';
import { anomalyService } from '../../api/anomalies';
import { formatIDR } from '../../utils/transactions';

const RISK_COLORS = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-blue-300',
};

const SuspiciousActivityModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('security');
  const [securityIncidents, setSecurityIncidents] = useState([]);
  const [transactionIncidents, setTransactionIncidents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [incidentStatus, setIncidentStatus] = useState('Open');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoading(true);
      try {
        const [sec, tx] = await Promise.all([
          anomalyService.getIncidents('security'),
          anomalyService.getIncidents('transaction'),
        ]);
        setSecurityIncidents(sec.incidents || []);
        setTransactionIncidents(tx.incidents || []);
        const first = (sec.incidents || [])[0];
        if (first) {
          setSelectedId(first.id);
          setIncidentStatus(first.status || 'Open');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open]);

  if (!open) return null;

  const incidents = activeTab === 'security' ? securityIncidents : transactionIncidents;
  const selected = incidents.find((i) => i.id === selectedId) || incidents[0];

  const selectRow = (inc) => {
    setSelectedId(inc.id);
    setIncidentStatus(inc.status || 'Open');
  };

  const handleAction = async (status) => {
    if (!selected?.id) return;
    setIncidentStatus(status);
    try {
      await anomalyService.updateStatus(selected.id, status);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#112D42] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-white">
        <div className="flex justify-between items-start gap-4 p-6 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-400 shrink-0" size={24} />
            <div>
              <h3 className="text-xl font-bold">Log Aktivitas Mencurigakan</h3>
              <p className="text-xs text-white/60 mt-1">
                Pilih insiden pada tabel — info & aksi cepat di bawah menyesuaikan baris terpilih.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4 shrink-0">
          {[
            { id: 'security', label: 'Keamanan', icon: Shield },
            { id: 'transaction', label: 'Transaksi', icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                const list = tab.id === 'security' ? securityIncidents : transactionIncidents;
                if (list[0]) selectRow(list[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#4C92C3] text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            <p className="text-center text-white/50 py-12 text-sm">Memuat data ancaman...</p>
          ) : activeTab === 'security' ? (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/60 text-xs uppercase">
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Aktivitas</th>
                  <th className="py-3 px-3">Lokasi / IP</th>
                  <th className="py-3 px-3">Rekomendasi AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {securityIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => selectRow(inc)}
                    className={`cursor-pointer transition-colors ${
                      selectedId === inc.id ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-3.5 px-3 font-mono text-xs text-blue-300">{inc.time}</td>
                    <td className={`py-3.5 px-3 font-bold ${RISK_COLORS[inc.risk_level]}`}>{inc.activity}</td>
                    <td className="py-3.5 px-3 font-mono text-xs">{inc.location}</td>
                    <td className="py-3.5 px-3 text-xs italic text-yellow-200/90 leading-relaxed">{inc.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/60 text-xs uppercase">
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Kasus / Aktivitas</th>
                  <th className="py-3 px-3">Marketplace</th>
                  <th className="py-3 px-3">Nominal</th>
                  <th className="py-3 px-3">Rekomendasi AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactionIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => selectRow(inc)}
                    className={`cursor-pointer transition-colors ${
                      selectedId === inc.id ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-3.5 px-3 font-mono text-xs text-blue-300">{inc.time}</td>
                    <td className={`py-3.5 px-3 font-bold ${RISK_COLORS[inc.risk_level]}`}>{inc.activity}</td>
                    <td className="py-3.5 px-3 text-[#69C3FF] font-semibold">{inc.marketplace}</td>
                    <td className="py-3.5 px-3 font-bold text-white">
                      {inc.amount > 0 ? formatIDR(inc.amount) : '—'}
                    </td>
                    <td className="py-3.5 px-3 text-xs italic text-yellow-200/90 leading-relaxed">{inc.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="mx-6 mb-4 p-4 bg-white/5 border border-white/10 rounded-xl text-xs space-y-2 shrink-0">
            <div className="flex justify-between gap-2">
              <span className="text-white/70">Insiden dipilih:</span>
              <span className="font-semibold text-white text-right">
                {selected.activity}
                {selected.marketplace ? ` · ${selected.marketplace}` : ''}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-white/70">Status insiden:</span>
              <span className="font-semibold text-blue-300">{incidentStatus}</span>
            </div>
          </div>
        )}

        <div className="px-6 pb-6 pt-2 border-t border-white/10 flex flex-wrap gap-2 shrink-0">
          {activeTab === 'security' ? (
            <>
              <button
                type="button"
                onClick={() => handleAction('Mitigasi Diterapkan')}
                className="px-4 py-2.5 bg-red-500/25 hover:bg-red-500/35 text-red-100 border border-red-500/40 rounded-xl text-xs font-bold cursor-pointer"
              >
                🔴 Blokir IP / Akun
              </button>
              <button
                type="button"
                onClick={() => handleAction('In Review')}
                className="px-4 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 border border-yellow-500/30 rounded-xl text-xs font-bold cursor-pointer"
              >
                🟡 Mark as Review
              </button>
              <button
                type="button"
                onClick={() => handleAction('Ignored')}
                className="px-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-100 border border-green-500/30 rounded-xl text-xs font-bold cursor-pointer"
              >
                🟢 Abaikan
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="px-4 py-2.5 bg-[#4C92C3]/30 hover:bg-[#4C92C3]/50 text-white border border-[#69C3FF]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink size={14} />
                🔗 Buka Toko Marketplace
              </button>
              <button
                type="button"
                onClick={() => handleAction('In Review')}
                className="px-4 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 border border-yellow-500/30 rounded-xl text-xs font-bold cursor-pointer"
              >
                🟡 Mark as Review
              </button>
              <button
                type="button"
                onClick={() => handleAction('Ignored')}
                className="px-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-100 border border-green-500/30 rounded-xl text-xs font-bold cursor-pointer"
              >
                🟢 Abaikan
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspiciousActivityModal;
