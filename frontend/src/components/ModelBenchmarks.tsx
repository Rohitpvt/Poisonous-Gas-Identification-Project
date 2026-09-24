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
        visualElements={[
          {
            name: "Task Switcher Tabs & Gas Filter Dropdown",
            type: "Control",
            description: "Top control bar allowing users to switch between Regression (Continuous Forecasts) and Classification (Hazard State Detection), with an interactive gas filter dropdown.",
            axesOrEncoding: "Dropdown options: All Gases, Ammonia (NH₃), Carbon Monoxide (CO), PM2.5, PM10, Benzene, Toluene, NO2, SO2, Ozone.",
            whatItShows: "Filters the benchmark leaderboard to evaluate specific model performance across individual chemical targets."
          },
          {
            name: "Highest Achieved R² by Pollutant Bar Chart",
            type: "Chart",
            description: "A horizontal/vertical bar chart ranking all 9 pollutants by their highest achieved R² variance score across the ML suite.",
            axesOrEncoding: "X-Axis: Gas Name. Y-Axis: Best R² Score (0.00 to 1.00). Brand crimson bars with algorithm labels (e.g. LightGBM, Ridge).",
            whatItShows: "Highlights which pollutants are most predictable from meteorological-plume feature sets (PM2.5: 0.929, Benzene: 0.900, NH₃: 0.840)."
          },
          {
            name: "Regression Benchmark Leaderboard Table",
            type: "Table",
            description: "A 6-column benchmarking matrix detailing Model Algorithm, Target Gas, R² Score, RMSE, MAE, and Best Model indicator.",
            axesOrEncoding: "Columns: Model Algorithm, Target Task, R², RMSE, MAE, Best Model Badge. Green highlight rows = top performer.",
            whatItShows: "Direct empirical comparison showing Ridge Regression and LightGBM outperforming complex deep networks due to L2 regularization."
          },
          {
            name: "Classification Evaluation Radar / Bar Chart",
            type: "Chart",
            description: "Multi-metric bar chart comparing Random Forest, XGBoost, and LightGBM across Precision, Recall, and F1-Score.",
            axesOrEncoding: "X-Axis: Model Name. Y-Axis: Score (0.00 to 1.00). Teal = Precision, Orange = Recall, Crimson = F1-Score.",
            whatItShows: "Proves that ensemble classifiers achieve >99.6% recall, meaning almost zero false negatives during acute toxic surges."
          }
        ]}
        symbolsAndIcons={[
          {
            symbol: "🏆",
            label: "Best-in-Class Performer",
            category: "Badge",
            meaning: "Identifies the highest-ranked ML algorithm for a specific pollutant according to R² score or F1-Score."
          },
          {
            symbol: "✅",
            label: "Optimal Model Checkmark",
            category: "Icon",
            meaning: "Green checkmark highlighting the recommended production model row in the leaderboard table."
          },
          {
            symbol: "⚡",
            label: "Gradient Boosted Tree",
            category: "Icon",
            meaning: "Denotes decision tree ensemble algorithms (LightGBM, XGBoost, Random Forest) utilizing gradient boosting."
          },
          {
            symbol: "📉",
            label: "Linear Regularized Baseline",
            category: "Icon",
            meaning: "Represents L1/L2 penalized linear models (Ridge, LASSO, ElasticNet) evaluated as robust baseline benchmarks."
          }
        ]}
        interactiveControls={[
          {
            control: "Task Mode Toggle (Regression vs Classification)",
            type: "Tab",
            functionality: "Switches between continuous numeric concentration predictions and binary acute hazard classification benchmarks.",
            impactOnOutput: "Updates the primary leaderboard table to show R²/RMSE/MAE for Regression or Accuracy/Precision/Recall/ROC-AUC for Classification."
          },
          {
            control: "Gas Target Filter Dropdown",
            type: "Dropdown",
            functionality: "Filters the regression leaderboard to display only the selected gaseous pollutant.",
            impactOnOutput: "Isolates the 8 algorithms competing specifically on that target gas."
          }
        ]}
        metricDefinitions={[
          {
            term: "R² (R-Squared)",
            unit: "0.00 – 1.00",
            definition: "Coefficient of determination measuring the percentage of variance explained (e.g. 0.8400 means 84.0% of ground NH₃ variation is explained by model features)."
          },
          {
            term: "RMSE",
            unit: "µg/m³ or mg/m³",
            definition: "Root Mean Squared Error — penalizes large prediction outliers, measuring the standard deviation of model residuals."
          },
          {
            term: "MAE",
            unit: "µg/m³ or mg/m³",
            definition: "Mean Absolute Error — the average magnitude of absolute forecasting errors."
          },
          {
            term: "ROC-AUC",
            unit: "0.00 – 1.00",
            definition: "Area Under the Receiver Operating Characteristic Curve — evaluates classifier discrimination power across all decision thresholds."
          }
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
