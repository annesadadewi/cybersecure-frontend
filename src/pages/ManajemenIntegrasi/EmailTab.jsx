import React from 'react';
import { Mail } from 'lucide-react';

const EmailTab = ({ emailOptions, getSystemStatus, onConnect, onDisconnect, customIdByName = {} }) => {
  return (
    <div className="space-y-5">
      {emailOptions.map((mailOpt) => {
        const isCustom = Boolean(customIdByName[mailOpt]);
        const status = getSystemStatus(mailOpt);
        const isConnected = status === 'Aktif';
        return (
          <div 
            key={mailOpt}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 px-6 rounded-2xl sm:rounded-3xl shadow-md border border-white/10 transition-all duration-300 hover:scale-[1.005] hover:shadow-xl hover:brightness-105 active:scale-[0.995] bg-gradient-to-r from-[#B8DDF5] to-[#D5EEFF]"
          >
            <div className="flex items-center gap-5 sm:gap-6 mb-4 sm:mb-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#538CB4] rounded-xl flex items-center justify-center text-white shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-[#0D2C3D] block">{mailOpt} Server</span>
                {isConnected && (
                  <span className="text-sm text-[#1F5E88] font-bold block font-mono">SMTP: smtp.{mailOpt.toLowerCase().replace(' ', '')}.com</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${
                isConnected 
                  ? 'bg-[#E2FBE9] text-[#10B981] border-[#10B981]/25' 
                  : 'bg-white/60 text-slate-500 border-slate-300'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? 'bg-[#10B981]' : 'border-2 border-slate-400'
                }`}></div>
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                </span>
              </div>

              {isConnected ? (
                <button 
                  onClick={() => onDisconnect({ id: isCustom ? customIdByName[mailOpt] : 'mail', name: `${mailOpt} Server`, type: 'Mail', customTabId: isCustom ? 'email' : undefined })}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow transition-all hover:scale-105 cursor-pointer"
                >
                  Putus
                </button>
              ) : (
                <button 
                  onClick={() => onConnect({ id: isCustom ? customIdByName[mailOpt] : 'mail', name: `${mailOpt} Server`, type: 'Mail', customTabId: isCustom ? 'email' : undefined })}
                  className="bg-[#1F5E88] hover:bg-[#154666] text-white px-5 py-2 rounded-xl text-sm font-bold shadow transition-all hover:scale-105 cursor-pointer"
                >
                  Hubungkan
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmailTab;
