import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Activity, MapPin, BarChart3, Brain, Zap, ShieldAlert, Cpu } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'gis-map', label: 'GIS Map', icon: MapPin },
    { id: 'eda', label: 'EDA Studio', icon: BarChart3 },
    { id: 'models', label: 'Benchmarks', icon: Cpu },
    { id: 'shap', label: 'Explainable AI', icon: Brain },
    { id: 'simulator', label: 'Simulator', icon: Zap },
    { id: 'advisory', label: 'Health Alert', icon: ShieldAlert },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-xl px-3 py-2 flex items-center justify-between gap-3 max-w-6xl w-full rounded-2xl sm:rounded-full border border-black/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.12)] transition-all">
        
        {/* Brand Logo & Title */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-black/[0.04] transition-all text-left flex-shrink-0 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#E34A32] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(227,74,50,0.35)] group-hover:scale-105 transition-transform flex-shrink-0">
            <Flame className="w-4 h-4 fill-white text-white" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#171719] text-sm tracking-tight whitespace-nowrap">
              LandfillPlume<span className="text-[#E34A32]">AI</span>
            </span>
            <span className="hidden xl:inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#E34A32]/10 text-[#E34A32] rounded-full border border-[#E34A32]/20">
              Ghazipur
            </span>
          </div>
        </button>

        {/* Desktop Navigation Tabs (Horizontal Centered Strip - Fixed Natural Width) */}
        <div className="hidden lg:flex items-center gap-1 bg-[#F4F5F7] p-1 rounded-full border border-black/[0.04]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap select-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#5A5C63] hover:text-[#171719] hover:bg-black/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#171719] rounded-full shadow-[0_2px_8px_rgba(23,23,25,0.25)] z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#FF7A59]' : 'text-[#7D8087]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Stream Status Pill */}
        <div className="flex items-center flex-shrink-0 pl-1">
          <div className="bg-[#F8F9FA] border border-black/[0.06] rounded-full px-2.5 sm:px-3 py-1.5 flex items-center gap-2 text-[11px] font-medium text-[#4A4D53]">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="whitespace-nowrap font-medium text-[#1E2024]">
              <span className="hidden sm:inline">DPCC: </span>
              <strong className="text-emerald-600 font-semibold">Active</strong>
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-4 left-3 right-3 pointer-events-auto bg-white/95 backdrop-blur-xl p-1.5 flex justify-between items-center z-50 rounded-2xl border border-black/10 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2 rounded-xl relative transition-all flex flex-col items-center flex-1 ${
                isActive ? 'text-white' : 'text-[#64676E]'
              }`}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavTabMobile"
                  className="absolute inset-0 bg-[#171719] rounded-xl shadow-sm z-[-1]"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF7A59]' : ''}`} />
            </button>
          );
        })}
      </div>
    </header>
  );
};
