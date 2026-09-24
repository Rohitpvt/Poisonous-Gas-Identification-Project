import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export interface PageDescriptionProps {
  pageTitle: string;
  badgeText?: string;
  objective: string;
  methodology: {
    title: string;
    details: string;
  }[];
  howToInterpret: string[];
  actionableInsights: string[];
  dataSources: string[];
}

export const PageDescriptionCard: React.FC<PageDescriptionProps> = ({
  pageTitle,
  badgeText = 'Comprehensive Technical Breakdown & Page Reference',
  objective,
  methodology,
  howToInterpret,
  actionableInsights,
  dataSources,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="card-elevated p-6 sm:p-7 bg-gradient-to-br from-surface-card via-surface-light/90 to-surface-card border border-border-light shadow-md mt-10 rounded-3xl transition-all">
      {/* Header with Title & Collapse Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-light/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <span>{pageTitle}</span>
            <span className="text-xs font-serif-italic font-normal text-brand-primary hidden md:inline">
              — Architectural & Scientific Context
            </span>
          </h3>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-text-secondary hover:text-text-primary border border-border-light shadow-sm transition-all self-start sm:self-auto"
        >
          <span>{isExpanded ? 'Collapse Guide' : 'Expand Detailed Guide'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-5 animate-fade-in text-xs sm:text-sm">
          {/* 1. Core Purpose & Objective */}
          <div className="p-4 rounded-2xl bg-surface-light/80 border border-border-light/70 space-y-1.5">
            <div className="font-bold text-text-primary flex items-center gap-2 text-xs uppercase tracking-wider text-brand-primary">
              <Sparkles className="w-4 h-4" />
              <span>Core Purpose & What This Page Represents</span>
            </div>
            <p className="text-text-secondary leading-relaxed text-xs sm:text-sm">
              {objective}
            </p>
          </div>

          {/* 2. Scientific & ML Methodology Grid */}
          <div className="space-y-2.5">
            <div className="font-bold text-text-primary flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted">
              <Layers className="w-4 h-4 text-brand-primary" />
              <span>Scientific Foundation & Methodological Architecture</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {methodology.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/70 border border-border-light/80 space-y-1 shadow-2xs"
                >
                  <div className="font-bold text-text-primary text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>{m.title}</span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {m.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Two-Column Breakdown: How to Interpret & Actionable Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* How to Read & Interpret */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
              <div className="font-bold text-sky-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>How to Read & Interpret Visuals</span>
              </div>
              <ul className="space-y-2 text-xs text-sky-950">
                {howToInterpret.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Insights & Key Takeaways */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Actionable Insights & Decision Impact</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                {actionableInsights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Underlying Data Sources & Provenance Footer */}
          <div className="pt-3 border-t border-border-light/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-text-secondary flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Verified Data Sources:</span>
              </span>
              {dataSources.map((source, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-surface-light border border-border-light text-text-secondary font-mono text-[10px]"
                >
                  {source}
                </span>
              ))}
            </div>

            <div className="text-text-secondary flex items-center gap-1 font-mono text-[10px]">
              <span>Christ University ML Research</span>
              <span>• Ghazipur Landfill Case Study</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
