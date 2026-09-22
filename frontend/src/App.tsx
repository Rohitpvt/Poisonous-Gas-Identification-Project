import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Overview } from './components/Overview';
import { GisMap } from './components/GisMap';
import { EdaStudio } from './components/EdaStudio';
import { ModelBenchmarks } from './components/ModelBenchmarks';
import { ExplainableAi } from './components/ExplainableAi';
import { PlumeSimulator } from './components/PlumeSimulator';
import { HealthAdvisory } from './components/HealthAdvisory';
import { ResearchInsights } from './components/ResearchInsights';
import { Flame } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-brand-primary selection:text-white">
      {/* Top Floating Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-16 flex-1">
        {activeTab === 'overview' && (
          <Overview
            onExploreSimulator={() => setActiveTab('simulator')}
            onExploreMap={() => setActiveTab('gis-map')}
          />
        )}
        {activeTab === 'insights' && <ResearchInsights />}
        {activeTab === 'gis-map' && <GisMap />}
        {activeTab === 'eda' && <EdaStudio />}
        {activeTab === 'models' && <ModelBenchmarks />}
        {activeTab === 'shap' && <ExplainableAi />}
        {activeTab === 'simulator' && <PlumeSimulator />}
        {activeTab === 'advisory' && <HealthAdvisory />}
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-border-light bg-surface-light/60 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white">
              <Flame className="w-3 h-3 fill-white" />
            </div>
            <span className="font-semibold text-text-primary">LandfillPlume-AI</span>
            <span>• Christ University Machine Learning Coursework</span>
          </div>

          <div className="flex items-center gap-1 text-text-secondary">
            <span>Built with precision following the</span>
            <span className="font-semibold text-text-primary">SprintForge Design Framework</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
