import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { anomalyService } from '../../api/anomalies';

const RISK_COLORS = {
  'High Risk': '#EF4444',
  'Medium Risk': '#EAB308',
  'Low Risk': '#60A5FA',
};

const AnomalyRiskChart = () => {
  const [metrics, setMetrics] = useState({ high_risk: 0, medium_risk: 0, low_risk: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await anomalyService.getMetrics();
        setMetrics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: 'High Risk', value: metrics.high_risk || 0 },
    { name: 'Medium Risk', value: metrics.medium_risk || 0 },
    { name: 'Low Risk', value: metrics.low_risk || 0 },
  ].filter((d) => d.value > 0);

  const hasData = chartData.length > 0;

  return (
    <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col border border-white/10 bg-gradient-to-b from-[#B8DDF5]/15 to-[#B8DDF5]/5 backdrop-blur-md min-h-[320px]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-0.5">Distribusi Risiko Anomali</h3>
          <p className="text-white/60 text-xs sm:text-sm">
            Monitoring real-time — proporsi ancaman keamanan & transaksi ({metrics.total || 0} kasus)
          </p>
        </div>
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-[#69C3FF] bg-[#69C3FF]/10 px-2 py-1 rounded-lg border border-[#69C3FF]/20">
          Live
        </span>
      </div>

      <div className="flex-1 h-64 sm:h-72 w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            <RefreshCw className="animate-spin mr-2" size={24} />
            Memuat...
          </div>
        ) : !hasData ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
            Tidak ada data anomali terdeteksi.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="78%"
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={RISK_COLORS[entry.name]} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F5E88',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value, name) => [`${value} kasus`, name]}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => (
                  <span className="text-white/80 text-xs font-semibold">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'High', val: metrics.high_risk, color: '#EF4444' },
          { label: 'Medium', val: metrics.medium_risk, color: '#EAB308' },
          { label: 'Low', val: metrics.low_risk, color: '#60A5FA' },
        ].map((item) => (
          <div key={item.label} className="py-2 rounded-lg bg-white/5 border border-white/5">
            <p className="text-[9px] uppercase font-bold text-white/50">{item.label}</p>
            <p className="text-sm font-black" style={{ color: item.color }}>
              {item.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyRiskChart;
