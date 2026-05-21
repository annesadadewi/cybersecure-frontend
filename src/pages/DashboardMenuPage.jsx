import React from 'react';
import { Activity, ShieldAlert, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theme } from '../Theme';

const dataGrafik = [
  { name: 'Senin', jumlah: 4 }, { name: 'Selasa', jumlah: 7 },
  { name: 'Rabu', jumlah: 5 }, { name: 'Kamis', jumlah: 12 },
  { name: 'Jumat', jumlah: 8 }, { name: 'Sabtu', jumlah: 15 }, { name: 'Minggu', jumlah: 10 },
];

const DashboardPage = ({ setActiveMenu }) => (
  <div className="space-y-8 animate-fadeIn">
    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
      {[
        { icon: Activity, text: 'Total Integrasi', val: '12 Akun', color: '#2A65E8', action: () => setActiveMenu('Total Integrasi') },
        { icon: ShieldAlert, text: 'Anomali Terdeteksi', val: '24 Kasus', color: '#EF4444', action: () => setActiveMenu('Anomali Terdeteksi') },
        { icon: CheckCircle, text: 'System Integrity', val: '99.9%', color: '#10B981', action: () => setActiveMenu('System Integrity') },
      ].map((card, i) => (
        <div 
          key={i} 
          onClick={card.action}
          className="p-6 rounded-3xl hover:scale-[1.02] transition-all flex flex-col justify-between h-44 shadow-xl border border-white/20 cursor-pointer" 
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="p-3 w-fit rounded-xl" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
            <card.icon size={26} />
          </div>
          <div>
            <p style={{ color: theme.textDim }} className="text-sm font-bold uppercase">{card.text}</p>
            <h3 style={{ color: theme.textMain }} className="text-3xl font-black mt-1">{card.val}</h3>
          </div>
        </div>
      ))}
    </div>
    
    <div className="p-8 rounded-3xl shadow-xl" style={{ backgroundColor: 'rgb(199, 231, 253)' }}>
      <h3 className="text-xl font-bold mb-6" style={{ color: theme.textMain }}>Threat Analysis</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataGrafik}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="jumlah" stroke={theme.sidebar} strokeWidth={4} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default DashboardPage;