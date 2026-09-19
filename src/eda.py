"""
src/eda.py
Exploratory Data Analysis (EDA) Module
- Generates statistical summaries for pollutants and meteorology.
- Performs wind dispersion correlation analysis (Ghazipur downwind effect).
- Creates publication-quality charts (correlation heatmap, diurnal trends, site comparison, wind rose distribution).
- Exports summary metrics and charts for reports and dashboard.
"""

import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
FIGURES_DIR = os.path.join(BASE_DIR, "outputs", "figures")
os.makedirs(FIGURES_DIR, exist_ok=True)

# Set visual style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['figure.dpi'] = 150

def run_eda():
    print("[EDA] Starting Exploratory Data Analysis...")
    df_dpcc = pd.read_csv(os.path.join(PROCESSED_DIR, "cleaned_dpcc_ground_data.csv"))
    df_plumes = pd.read_csv(os.path.join(PROCESSED_DIR, "cleaned_satellite_plumes.csv"))
    
    df_dpcc["timestamp"] = pd.to_datetime(df_dpcc["timestamp"])
    df_dpcc["hour"] = df_dpcc["timestamp"].dt.hour
    df_dpcc["month"] = df_dpcc["timestamp"].dt.month
    
    # 1. Satellite Plumes by Landfill Site
    fig, ax = plt.subplots(figsize=(8, 5))
    site_counts = df_plumes['landfill_site'].value_counts()
    colors = ['#e63946', '#f4a261', '#2a9d8f', '#457b9d']
    sns.barplot(x=site_counts.index, y=site_counts.values, palette=colors, ax=ax, hue=site_counts.index, legend=False)
    ax.set_title("Satellite Methane (CH4) Plume Detections by Delhi Landfill", fontsize=12, fontweight='bold', pad=10)
    ax.set_ylabel("Plume Observation Count")
    ax.set_xlabel("Landfill Site")
    for p in ax.patches:
        ax.annotate(f"{int(p.get_height())}", (p.get_x() + p.get_width() / 2., p.get_height()),
                    ha='center', va='center', xytext=(0, 5), textcoords='offset points', fontweight='bold')
    plt.tight_layout()
    fig.savefig(os.path.join(FIGURES_DIR, "satellite_plumes_by_site.png"))
    plt.close()
    
    # 2. Correlation Heatmap of Pollutants & Meteorology
    pollutant_cols = ['pm2_5', 'pm10', 'nh3', 'co', 'no2', 'nox', 'so2', 'benzene', 'temp', 'humidity', 'wind_speed', 'solar_radiation']
    available_pollutants = [c for c in pollutant_cols if c in df_dpcc.columns]
    
    corr = df_dpcc[available_pollutants].corr()
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", center=0, ax=ax, linewidths=0.5, cbar_kws={'label': 'Correlation Coefficient'})
    ax.set_title("Correlation Matrix: Landfill Pollutants & Meteorological Factors", fontsize=12, fontweight='bold', pad=12)
    plt.tight_layout()
    fig.savefig(os.path.join(FIGURES_DIR, "correlation_matrix.png"))
    plt.close()
    
    # 3. Diurnal Cycle of Toxic Gases (NH3, CO, PM2.5, Benzene)
    fig, axes = plt.subplots(2, 2, figsize=(12, 8), sharex=True)
    targets = [('nh3', 'Ammonia (NH3) [µg/m³]', '#e76f51'),
               ('co', 'Carbon Monoxide (CO) [mg/m³]', '#f4a261'),
               ('pm2_5', 'PM2.5 [µg/m³]', '#2a9d8f'),
               ('benzene', 'Benzene [µg/m³]', '#264653')]
    
    hourly_stats = df_dpcc.groupby('hour')[['nh3', 'co', 'pm2_5', 'benzene']].agg(['mean', 'std'])
    
    for ax, (col, label, color) in zip(axes.flatten(), targets):
        mean_vals = hourly_stats[(col, 'mean')]
        std_vals = hourly_stats[(col, 'std')]
        ax.plot(mean_vals.index, mean_vals.values, color=color, linewidth=2.5, marker='o', label='Mean')
        ax.fill_between(mean_vals.index, mean_vals - 0.5 * std_vals, mean_vals + 0.5 * std_vals, color=color, alpha=0.2)
        ax.set_title(f"Diurnal Trend: {label}", fontweight='bold', fontsize=11)
        ax.set_xlabel("Hour of Day (24-Hour)")
        ax.set_ylabel("Concentration")
        ax.set_xticks(range(0, 24, 2))
        ax.grid(True, linestyle='--', alpha=0.6)
    
    plt.tight_layout()
    fig.savefig(os.path.join(FIGURES_DIR, "diurnal_pollutant_trends.png"))
    plt.close()
    
    # 4. Ghazipur Downwind Dispersion Impact (Wind Direction vs NH3 & CO)
    # Ghazipur is located ~East/South-East of Anand Vihar (~100°-160° wind angle carries dump gas to Anand Vihar)
    df_dpcc['is_ghazipur_downwind'] = df_dpcc['wind_direction'].between(100, 160)
    
    downwind_stats = df_dpcc.groupby('is_ghazipur_downwind')[['nh3', 'co', 'pm2_5', 'benzene']].mean()
    downwind_stats.index = ['Other Wind Sectors', 'Ghazipur Plume Direct Path (100°-160°)']
    
    fig, ax = plt.subplots(figsize=(9, 5))
    downwind_stats[['nh3', 'co', 'benzene']].plot(kind='bar', ax=ax, colormap='Spectral', width=0.6)
    ax.set_title("Downwind Landfill Dispersion: Toxic Gas Concentrations at Anand Vihar", fontsize=12, fontweight='bold', pad=12)
    ax.set_ylabel("Mean Concentration")
    ax.set_xlabel("Wind Alignment with Ghazipur Dump Yard")
    plt.xticks(rotation=0, fontweight='bold')
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    fig.savefig(os.path.join(FIGURES_DIR, "ghazipur_downwind_impact.png"))
    plt.close()

    print(f"[EDA] Visualizations and statistical reports generated in {FIGURES_DIR}")


if __name__ == "__main__":
    run_eda()
