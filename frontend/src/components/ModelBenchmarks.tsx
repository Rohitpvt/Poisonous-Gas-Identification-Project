import React, { useState } from 'react';
import { REGRESSION_METRICS, CLASSIFICATION_METRICS } from '../data/constants';
import { Cpu, Award, CheckCircle2, BarChart2, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const ModelBenchmarks: React.FC = () => {
  const [taskTab, setTaskTab] = useState<'regression' | 'classification'>('regression');

  const regChartData = [
    { name: 'Ridge Regression', r2: 0.8425, rmse: 10.933, mae: 6.002 },
    { name: 'LightGBM', r2: 0.8151, rmse: 11.847, mae: 6.225 },
    { name: 'XGBoost', r2: 0.8111, rmse: 11.974, mae: 6.657 },
    { name: 'Random Forest', r2: 0.7870, rmse: 12.716, mae: 7.534 },
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
                <span>NH₃ Forecasting Variance Explained (R² Score Comparison)</span>
              </h3>
              <span className="text-xs text-text-muted">Higher R² and lower RMSE indicate superior performance</span>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171719',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="r2" name="R² Score" fill="#171719" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="card-elevated p-6 space-y-4">
            <h4 className="text-lg font-semibold text-text-primary">Detailed Performance Metrics Table</h4>
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
                  {REGRESSION_METRICS.map((m, i) => (
                    <tr key={i} className={`hover:bg-surface-light/50 transition-colors ${m.isBest ? 'bg-emerald-50/50' : ''}`}>
                      <td className="py-3.5 px-4 font-semibold text-text-primary flex items-center gap-2">
                        {m.isBest && <Award className="w-4 h-4 text-emerald-600" />}
                        <span>{m.model}</span>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">{m.target}</td>
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
    </div>
  );
};
