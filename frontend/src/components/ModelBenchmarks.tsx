import React, { useState } from 'react';
import { REGRESSION_METRICS, CLASSIFICATION_METRICS } from '../data/constants';
import { Cpu, Award, CheckCircle2, BarChart2, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { PageDescriptionCard } from './PageDescriptionCard';

export const ModelBenchmarks: React.FC = () => {
  const [taskTab, setTaskTab] = useState<'regression' | 'classification'>('regression');
  const [selectedGasFilter, setSelectedGasFilter] = useState<string>('All Gases');

  const gasSummaryChartData = [
    { name: 'PM2.5', bestR2: 0.9293, bestModel: 'LightGBM' },
    { name: 'Benzene', bestR2: 0.9002, bestModel: 'Ridge' },
    { name: 'PM10', bestR2: 0.8608, bestModel: 'LightGBM' },
    { name: 'Toluene', bestR2: 0.8531, bestModel: 'Ridge' },
    { name: 'CO', bestR2: 0.8411, bestModel: 'LightGBM' },
    { name: 'NH3', bestR2: 0.8400, bestModel: 'Ridge' },
    { name: 'NO2', bestR2: 0.8140, bestModel: 'LightGBM' },
    { name: 'SO2', bestR2: 0.6879, bestModel: 'Ridge' },
    { name: 'Ozone', bestR2: 0.5068, bestModel: 'Ridge' },
  ];

  const clfChartData = [
    { name: 'Random Forest', f1: 0.9995, accuracy: 0.9997, precision: 0.9990, recall: 1.0000 },
    { name: 'XGBoost', f1: 0.9981, accuracy: 0.9989, precision: 0.9966, recall: 0.9995 },
    { name: 'LightGBM', f1: 0.9968, accuracy: 0.9981, precision: 0.9976, recall: 0.9961 },
    { name: 'Logistic Reg', f1: 0.7911, accuracy: 0.8584, precision: 0.6988, recall: 0.9115 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Empirical Model Validation & Multi-Algorithm Benchmark</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tight">
            Machine Learning <span className="font-serif-italic font-normal text-brand-primary">Leaderboard</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">
            Chronological 80/20 train/test evaluation across regularized linear baselines, gradient boosting trees, and ensemble forests.
          </p>
        </div>

        {/* Task Switcher */}
        <div className="stat-pill p-1 flex items-center gap-1 self-start">
          <button
            onClick={() => setTaskTab('regression')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              taskTab === 'regression'
                ? 'bg-surface-dark text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Regression (1h Ahead Gas Forecasting)
          </button>
          <button
            onClick={() => setTaskTab('classification')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              taskTab === 'classification'
                ? 'bg-surface-dark text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Classification (Hazardous Risk Episodes)
          </button>
        </div>
      </div>

      {/* Regression Tab */}
      {taskTab === 'regression' && (
        <div className="space-y-6">
          {/* Visual Benchmark Chart */}
          <div className="card-elevated p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-primary" />
                <span>Multi-Gas 1h Ahead Forecasting Accuracy (R² Score by Landfill Pollutant)</span>
              </h3>
              <span className="text-xs text-text-muted">Benchmarks across all 9 continuous gases & VOCs in DPCC dataset</span>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gasSummaryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis domain={[0, 1.0]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171719',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                    formatter={(value: any, _name: any, item: any) => [
                      `R²: ${Number(value).toFixed(4)} (Champion: ${item.payload.bestModel})`,
                      'Model Accuracy',
                    ]}
                  />
                  <Bar dataKey="bestR2" name="Highest R² Score" fill="#171719" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard Table with Filter */}
          <div className="card-elevated p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-text-primary">All Landfill Gases & VOCs Performance Metrics Table</h4>
              <div className="flex items-center gap-2">
                <label className="text-xs text-text-muted font-medium">Filter Gas:</label>
                <select
                  value={selectedGasFilter}
                  onChange={(e) => setSelectedGasFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-surface-light border border-border-light text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="All Gases">All Gases ({REGRESSION_METRICS.length} evaluations)</option>
                  <option value="NH3">NH3 (Ammonia)</option>
                  <option value="CO">CO (Carbon Monoxide)</option>
                  <option value="PM2.5">PM2.5 (Fine Particulates)</option>
                  <option value="PM10">PM10 (Coarse Dust)</option>
                  <option value="NO2">NO2 (Nitrogen Dioxide)</option>
                  <option value="Benzene">Benzene (Carcinogen VOC)</option>
                  <option value="Toluene">Toluene (Solvent VOC)</option>
                  <option value="SO2">SO2 (Sulfur Dioxide)</option>
                  <option value="Ozone">Ozone (Photochemical Smog)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-light text-text-muted text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Model Algorithm</th>
                    <th className="py-3 px-4">Forecast Target</th>
                    <th className="py-3 px-4">R² Score (Variance)</th>
                    <th className="py-3 px-4">RMSE Error</th>
                    <th className="py-3 px-4">MAE Error</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {REGRESSION_METRICS.filter(
                    (m) => selectedGasFilter === 'All Gases' || m.target.startsWith(selectedGasFilter)
                  ).map((m, i) => (
                    <tr key={i} className={`hover:bg-surface-light/50 transition-colors ${m.isBest ? 'bg-emerald-50/50' : ''}`}>
                      <td className="py-3.5 px-4 font-semibold text-text-primary flex items-center gap-2">
                        {m.isBest && <Award className="w-4 h-4 text-emerald-600" />}
                        <span>{m.model}</span>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary font-medium">{m.target}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-text-primary">{m.r2Score?.toFixed(4)}</td>
                      <td className="py-3.5 px-4 font-mono text-text-secondary">{m.rmse?.toFixed(3)}</td>
                      <td className="py-3.5 px-4 font-mono text-text-secondary">{m.mae?.toFixed(3)}</td>
                      <td className="py-3.5 px-4">
                        {m.isBest ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            ★ Champion Model
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-light text-text-muted">
                            Baseline
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Classification Tab */}
      {taskTab === 'classification' && (
        <div className="space-y-6">
          <div className="card-elevated p-8 space-y-6">
            <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Classification Metrics: Hazardous Landfill Toxic Episode Alert</span>
            </h3>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clfChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0.6, 1.05]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171719',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="f1" name="F1 Score" fill="#E34A32" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="precision" name="Precision" fill="#2a9d8f" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="recall" name="Recall" fill="#f4a261" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-elevated p-6 space-y-4">
            <h4 className="text-lg font-semibold text-text-primary">Classification Benchmark Results</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-light text-text-muted text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Model Algorithm</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Precision</th>
                    <th className="py-3 px-4">Recall</th>
                    <th className="py-3 px-4">F1 Score</th>
                    <th className="py-3 px-4">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {CLASSIFICATION_METRICS.map((m, i) => (
                    <tr key={i} className={`hover:bg-surface-light/50 transition-colors ${m.isBest ? 'bg-emerald-50/50' : ''}`}>
                      <td className="py-3.5 px-4 font-semibold text-text-primary flex items-center gap-2">
                        {m.isBest && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        <span>{m.model}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{((m.accuracy || 0) * 100).toFixed(2)}%</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-text-primary">{m.precision?.toFixed(4)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-text-primary">{m.recall?.toFixed(4)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-primary">{m.f1Score?.toFixed(4)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{m.rocAuc?.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Page Breakdown Card */}
      <PageDescriptionCard
        pageTitle="Multi-Gas Machine Learning Benchmarking & Predictive Performance"
        objective="This page presents a rigorous comparative evaluation of 8 machine learning and ensemble architectures trained to predict 1-hour ahead continuous concentrations and discrete acute hazard states across 9 distinct gaseous species."
        methodology={[
          {
            title: "Multi-Target Regression Suite",
            details: "Benchmarks Ridge, LASSO, ElasticNet, Random Forest, Extra Trees, Gradient Boosting, XGBoost, and LightGBM across 9 target pollutants."
          },
          {
            title: "Acute Hazard Classification",
            details: "Evaluates threshold exceedance classification using Precision, Recall, F1-Score, and ROC-AUC to prevent false-negative public health alerts."
          },
          {
            title: "Time-Series Train/Test Splitting",
            details: "Employs strict temporal chronological splitting (80/20 train/test) to prevent look-ahead data leakage in lagged air quality predictors."
          },
          {
            title: "Hyperparameter Regularization & Tuning",
            details: "Optimizes L2 penalty terms in Ridge Regression and tree depth/subsample ratios in LightGBM via 5-fold cross-validation."
          }
        ]}
        howToInterpret={[
          "Switch Task Tabs (Continuous Regression vs Hazard Classification): Review R² (variance explained), RMSE (root mean squared error), and MAE (mean absolute error).",
          "Use the Pollutant Dropdown Filter: Filter by individual gas (e.g. Ammonia NH₃, Benzene, PM2.5, CO) to compare model performance per target.",
          "Look for Green Badges: Indicates the best-performing model algorithm for that specific pollutant or classification task.",
          "Check the Top Comparison Bar Chart: Visualizes the highest achieved R² score across all 9 pollutants (PM2.5: 0.929, Benzene: 0.900, NH₃: 0.840)."
        ]}
        actionableInsights={[
          "Demonstrates that regularized linear baselines (Ridge) and gradient boosted trees (LightGBM) provide superior generalization on lagged meteorological-plume feature sets.",
          "Achieves near-perfect classification recall (>99.6%), ensuring that severe toxic spikes are almost never missed by automated municipal alert pipelines.",
          "Validates the predictive capability needed for real-time dispatch of air purification and school outdoor activity restrictions."
        ]}
        dataSources={[
          "Scikit-Learn ML Suite",
          "XGBoost & LightGBM Gradient Boosted Frameworks",
          "27,800+ Ground CAAQMS Hourly Training Samples"
        ]}
      />
    </div>
  );
};
