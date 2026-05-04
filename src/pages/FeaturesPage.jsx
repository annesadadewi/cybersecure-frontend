import React from 'react';
import { Brain, Shield, Bot, ChevronRight } from 'lucide-react';
import { theme } from '../Theme';

const FeaturesPage = () => {
  const features = [
    {
      title: 'Setup API',
      desc: 'Cara integrasi marketplace.',
      icon: Brain,
      color: '#B8DDF5'
    },
    {
      title: 'Log Analisis',
      desc: 'Membaca pola ancaman.',
      icon: Shield,
      color: '#B8DDF5'
    },
    {
      title: 'Bot Config',
      desc: 'Otomasi deteksi bot.',
      icon: Bot,
      color: '#B8DDF5'
    }
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Features Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="p-8 rounded-[40px] transition-all duration-300 hover:scale-[1.03] shadow-2xl border border-white/5 group"
            style={{ backgroundColor: '#164E75' }}
          >
            {/* Icon Container */}
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg"
              style={{ backgroundColor: feature.color }}
            >
              <feature.icon size={40} className="text-[#1F5E88]" strokeWidth={2} />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              {feature.desc}
            </p>

            {/* Link */}
            <div className="flex items-center gap-2 text-[#B8DDF5] font-bold text-lg cursor-pointer group-hover:translate-x-2 transition-transform">
              <span>Baca Tutorial</span>
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
