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
        methodology={[
          {
            title: "Shapley Additive exPlanations (SHAP)",
            details: "Computes the exact marginal contribution ϕᵢ of each feature across all possible feature subsets (coalitions), guaranteeing additive efficiency and consistency."
          },
          {
            title: "TreeSHAP Polynomial Acceleration",
            details: "Applies exact tree-path conditional expectation algorithms to evaluate ensemble decision trees in polynomial time."
          },
          {
            title: "Directional SHAP Value Polarity",
            details: "Separates positive risk-forcing attributions (+SHAP pushing predictions higher) from negative dispersion factors (-SHAP cleansing ambient air)."
          },
          {
            title: "Meteorology vs Geometry Disentanglement",
            details: "Quantifies the interaction between ambient temperature gradients, wind direction alignment, and physical dumpsite elevation (65m)."
          }
        ]}
        howToInterpret={[
          "Analyze the Feature Importance Bar Chart: Features are ranked by mean |SHAP| impact on model predictions.",
          "Check Ghazipur Plume Alignment: Wind angles aligned with 100°–160° create the single largest positive SHAP force (+34 µg/m³ NH₃).",
          "Observe Temperature and Boundary Layer Effects: Cold winter nights produce high positive SHAP values due to atmospheric boundary layer inversion.",
          "Check Wind Speed SHAP Values: Higher wind speeds (>3.5 m/s) produce strong negative SHAP values, indicating rapid turbulent dilution."
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
