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
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-[#FFFFFF]/90 backdrop-blur-2xl px-2.5 py-2 flex items-center justify-between gap-2 max-w-5xl w-full rounded-full border border-white/80 shadow-[0_12px_32px_-12px_rgba(23,23,25,0.18)] transition-all duration-300">
        
        {/* Brand Logo & Studio Pill */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-black/5 transition-all text-left group flex-shrink-0"
        >
          {/* High-Contrast Logo Badge */}
          <div className="w-9 h-9 rounded-full bg-[#E34A32] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(227,74,50,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover:scale-105 group-hover:bg-[#F05A3C] transition-all">
            <Flame className="w-5 h-5 fill-white text-white drop-shadow-sm" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#171719] text-sm tracking-tight leading-none">
                LandfillPlume<span className="text-[#E34A32] font-black">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E34A32]/10 text-[#E34A32] rounded-full border border-[#E34A32]/30 leading-none">
                Ghazipur
              </span>
            </div>
            <span className="text-[10px] text-[#55575c] font-medium tracking-normal mt-0.5 hidden sm:block">
              Precision Air Intelligence
            </span>
          </div>
        </button>

        {/* Animated Sliding Pill Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 bg-[#F4F5F5] p-1 rounded-full border border-black/5 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 select-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#55575c] hover:text-[#232427]'
                }`}
              >
                {/* Active Sliding Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-[#171719] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_12px_rgba(23,23,25,0.3)] z-[-1]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-brand-accent' : 'text-[#8a8c91]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Navigation for Medium Screens (Tablets / Smaller Laptops) */}
        <div className="hidden md:flex lg:hidden items-center gap-1 bg-[#F4F5F5] p-1 rounded-full border border-black/5 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative z-10 p-2 rounded-full text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-[#55575c] hover:text-[#232427]'
                }`}
                title={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTabTablet"
                    className="absolute inset-0 bg-[#171719] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] z-[-1]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-accent' : 'text-[#8a8c91]'}`} />
              </button>
            );
          })}
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 pr-1.5">
          <div className="bg-[#FFFFFF] border border-black/5 rounded-full px-3 py-1.5 flex items-center gap-2 text-[11px] font-medium text-text-secondary shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline font-medium text-text-primary">DPCC Stream: <strong className="text-emerald-600 font-semibold">Active</strong></span>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-xl p-1.5 flex justify-around items-center z-50 rounded-full border border-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2.5 rounded-full relative transition-all ${
                isActive ? 'text-white font-bold' : 'text-text-secondary'
              }`}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavTabMobile"
                  className="absolute inset-0 bg-[#171719] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] z-[-1]"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-accent' : ''}`} />
            </button>
          );
        })}
      </div>
    </header>
  );
};
