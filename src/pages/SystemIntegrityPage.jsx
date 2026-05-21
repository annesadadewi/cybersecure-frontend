import React from 'react';
import { theme } from '../Theme';
import { CheckCircle, ShieldCheck, Activity, Cpu } from 'lucide-react';

const SystemIntegrityPage = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-green-500/20" style={{ backgroundColor: theme.sidebar }}>
        <div className="p-4 bg-green-500/20 rounded-2xl">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">System Integrity: 99.9%</h2>
          <p className="text-green-200 mt-1">Status kesehatan menyeluruh dari sistem keamanan Anda beroperasi dengan optimal</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center">
          <div className="p-4 bg-green-500/10 rounded-full mb-4">
            <ShieldCheck size={32} className="text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Firewall Status</h3>
          <p className="text-green-300 font-bold text-2xl">Active</p>
          <p className="text-gray-400 text-xs mt-2">Diverting 45 malicious requests/min</p>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center">
          <div className="p-4 bg-blue-500/10 rounded-full mb-4">
            <Cpu size={32} className="text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Server Load</h3>
          <p className="text-white font-bold text-2xl">14%</p>
          <p className="text-gray-400 text-xs mt-2">Normal operating capacity</p>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center">
          <div className="p-4 bg-purple-500/10 rounded-full mb-4">
            <Activity size={32} className="text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Uptime</h3>
          <p className="text-white font-bold text-2xl">99.99%</p>
          <p className="text-gray-400 text-xs mt-2">Last downtime: 4 months ago</p>
        </div>
      </div>
    </div>
  );
};

export default SystemIntegrityPage;
