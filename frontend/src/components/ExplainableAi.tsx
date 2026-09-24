import React from 'react';
import { SHAP_FEATURE_IMPORTANCE } from '../data/constants';
import { Brain, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PageDescriptionCard } from './PageDescriptionCard';

export const ExplainableAi: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
          <Brain className="w-3.5 h-3.5" />
          <span>Game-Theoretic Shapley Value Interpretability</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
          Explainable AI <span className="font-serif-italic font-normal text-brand-primary">(SHAP)</span>
        </h2>
        <p className="text-text-secondary text-sm mt-1 max-w-2xl">
          Quantifying the exact marginal contribution of meteorological features, landfill geometry, and lag dynamics in pushing toxic gas forecasts.
        </p>
      </div>

      {/* Global Feature Importance Chart */}
      <div className="card-elevated p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <span>Mean Absolute SHAP Value (Global Impact on NH₃ Forecast)</span>
          </h3>
          <span className="text-xs text-text-muted">Calculated via TreeExplainer over 70,000 observations</span>
        </div>

        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={SHAP_FEATURE_IMPORTANCE}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={180} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171719',
                  borderRadius: '16px',
                  color: '#FFFFFF',
                  border: 'none',
                }}
              />
              <Bar dataKey="importance" name="SHAP Importance" fill="#E34A32" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Theory & Mechanism Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Math formulation */}
        <div className="card-dark p-8 space-y-4">
          <div className="flex items-center gap-2 text-brand-accent text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Shapley Game-Theoretic Formulation</span>
          </div>
          <h4 className="text-xl font-semibold text-white">Mathematical Foundation</h4>
          <p className="text-white/75 text-xs leading-relaxed">
            For any individual observation feature <code className="text-brand-accent">i</code>, the SHAP value is computed as the weighted average of its marginal contributions across all possible feature subsets:
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs text-white overflow-x-auto">
            ϕᵢ(f, x) = ∑ [ |S|! (|F| - |S| - 1)! / |F|! ] · [ f(S ∪ &#123;i&#125;) - f(S) ]
          </div>
          <p className="text-white/60 text-xs leading-relaxed">
            This guarantees additive efficiency, symmetry, and monotonicity, ensuring legally defensible environmental auditability.
          </p>
        </div>

        {/* Feature Insights */}
        <div className="card-elevated p-8 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary text-sm font-semibold">
            <Layers className="w-4 h-4" />
            <span>Physical Dump Yard Interpretations</span>
          </div>
          <h4 className="text-xl font-semibold text-text-primary">Key Behavioral Findings</h4>
          <ul className="space-y-3 text-xs text-text-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary mt-1 flex-shrink-0"></span>
              <span><strong>Ghazipur Plume Alignment:</strong> Wind vectors between 100° and 160° exhibit the highest positive Shapley push, increasing expected toxic concentrations by up to +34 µg/m³.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-surface-dark mt-1 flex-shrink-0"></span>
              <span><strong>Temperature Negative Gradient:</strong> Lower winter night temperatures strongly increase toxic accumulation via planetary boundary layer suppression.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
              <span><strong>Wind Speed Cleansing:</strong> Wind velocities &gt; 3.5 m/s produce heavy negative SHAP values, rapidly ventilating and dispersing landfill gases.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Explainable AI (XAI) & SHAP Feature Attribution Studio"
        objective="This studio breaks open the machine learning 'black box' using Shapley Game-Theoretic additive feature attributions (SHAP). It rigorously explains *why* the model predicts high toxic gas spikes for any given meteorological scenario."
        visualElements={[
          {
            name: "Global Mean |SHAP| Feature Importance Bar Chart",
            type: "Chart",
            description: "A horizontal ranking of the top 8 predictive features sorted by their mean absolute SHAP value impact on the target output.",
            axesOrEncoding: "X-Axis: Mean |SHAP Value| (average marginal impact in µg/m³). Y-Axis: Feature Name. Color-coded by feature domain.",
            whatItShows: "Proves that Wind Direction Alignment (100°–160°) and Lagged NH₃ Concentration are the twin dominant predictors of ground toxicity."
          },
          {
            name: "Shapley Game-Theoretic Formulation Box",
            type: "Diagram",
            description: "High-contrast dark card displaying the exact mathematical equation for Shapley values with combinatorial subset weighting.",
            axesOrEncoding: "Formula: ϕᵢ(f, x) = ∑ [ |S|! (|F| - |S| - 1)! / |F|! ] · [ f(S ∪ {i}) - f(S) ].",
            whatItShows: "Establishes the mathematical guarantees of efficiency, symmetry, and monotonicity required for legal/environmental auditability."
          },
          {
            name: "Physical Dumpsite Behavioral Findings Card",
            type: "Panel",
            description: "Structured card summarizing three key environmental phenomena discovered through SHAP attributions.",
            axesOrEncoding: "Pill bullet points: Ghazipur Plume Alignment (+34 µg/m³), Temperature Negative Gradient (nocturnal trapping), and Wind Speed Cleansing (>3.5 m/s dilution).",
            whatItShows: "Translates abstract game-theoretic numbers into concrete atmospheric and public health insights."
          }
        ]}
        metricDefinitions={[
          {
            term: "Mean |SHAP|",
            unit: "µg/m³",
            definition: "The average absolute magnitude of a feature's effect on model predictions across all dataset observations."
          },
          {
            term: "Coalition (S)",
            unit: "Subset",
            definition: "A specific subset of input features evaluated during combinatorial Shapley value computation."
          },
          {
            term: "Additivity",
            unit: "Property",
            definition: "The mathematical rule that the sum of all feature SHAP values equals the total deviation from base value: ∑ ϕᵢ = f(x) - E[f(x)]."
          }
        ]}
        actionableInsights={[
          "Proves to environmental regulators and judicial authorities that the ML model relies on sound atmospheric physics rather than spurious background correlation.",
          "Confirms that wind direction and nocturnal thermal stability are the twin dominant drivers of toxic community exposure.",
          "Provides municipal engineers with interpretability metrics to explain automated early warning triggers to the public."
        ]}
        dataSources={[
          "TreeSHAP & KernelSHAP Interpretability Packages",
          "Trained LightGBM & Ridge Regression Model Weights",
          "IMD Meteorological Reanalysis & DPCC Telemetry"
        ]}
      />
    </div>
  );
};
