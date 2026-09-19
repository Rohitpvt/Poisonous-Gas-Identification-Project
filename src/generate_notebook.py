import os
import json

notebook_path = r"c:\Users\rghos\OneDrive - Vivekananda Institute of Professional Studies\PROJECTS\Christ\Machine Learning\Project\notebooks\01_eda_and_modeling.ipynb"

notebook_dict = {
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# LandfillPlume-AI: Ghazipur Dump Yard Hazardous Gas Analysis & Forecasting\n",
    "### Spatio-Temporal Integration of NASA/ESA Satellite Methane Super-Emitters & DPCC Ground Monitoring\n",
    "\n",
    "**Course**: Machine Learning  \n",
    "**Institution**: Christ University  \n",
    "**Focus Region**: Ghazipur Landfill Site & Anand Vihar Monitoring Station, Delhi NCR"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "import glob\n",
    "import pandas as pd\n",
    "import numpy as np\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "\n",
    "sns.set_theme(style='whitegrid')\n",
    "plt.rcParams['figure.dpi'] = 120\n",
    "print('Libraries successfully imported!')"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Data Ingestion & Preprocessing\n",
    "We load two primary datasets:\n",
    "1. **Satellite Methane ($CH_4$) Plumes**: EMIT and EnMAP hyperspectral super-emitter observations for Delhi dumpsites (Ghazipur, Bhalswa, Okhla, Bandhwari).\n",
    "2. **Continuous Ground Station Data (DPCC Anand Vihar)**: 70,000+ records of $NH_3, CO, Benzene, PM_{2.5}$ with meteorological factors."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "df_plumes = pd.read_csv('../data/processed/cleaned_satellite_plumes.csv')\n",
    "df_dpcc = pd.read_csv('../data/processed/cleaned_dpcc_ground_data.csv')\n",
    "df_dpcc['timestamp'] = pd.to_datetime(df_dpcc['timestamp'])\n",
    "\n",
    "print(f'Satellite Plumes: {len(df_plumes)} records across sites: {df_plumes[\"landfill_site\"].unique().tolist()}')\n",
    "print(f'Ground Station Records: {len(df_dpcc):,} continuous readings.')\n",
    "df_dpcc.head(3)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Exploratory Data Analysis & Ghazipur Downwind Dispersion\n",
    "Examining Ghazipur landfill direct wind alignment (100° - 160°) vs. toxic air concentration spikes at Anand Vihar station."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "df_dpcc['is_ghazipur_downwind'] = df_dpcc['wind_direction'].between(100, 160)\n",
    "downwind_stats = df_dpcc.groupby('is_ghazipur_downwind')[['nh3', 'co', 'pm2_5', 'benzene']].mean()\n",
    "downwind_stats.index = ['Other Wind Sectors', 'Ghazipur Direct Path (100°-160°)']\n",
    "downwind_stats"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "plt.figure(figsize=(8, 4))\n",
    "downwind_stats[['nh3', 'co', 'benzene']].plot(kind='bar', colormap='Spectral')\n",
    "plt.title('Impact of Wind Blowing from Ghazipur Landfill on Anand Vihar Air Quality')\n",
    "plt.ylabel('Mean Concentration')\n",
    "plt.xticks(rotation=0)\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. Multi-Model Performance Benchmarking\n",
    "Comparison of Linear/Ridge Regression, Random Forest, XGBoost, and LightGBM for both continuous gas forecasting and toxic episode classification."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "df_reg_nh3 = pd.read_csv('../outputs/models/regression_results_target_nh3_next.csv')\n",
    "df_reg_co = pd.read_csv('../outputs/models/regression_results_target_co_next.csv')\n",
    "df_clf = pd.read_csv('../outputs/models/classification_results_toxic_alert.csv')\n",
    "\n",
    "print('--- NH3 Forecasting Regression Benchmark ---')\n",
    "print(df_reg_nh3.to_string(index=False))\n",
    "\n",
    "print('\\n--- CO Forecasting Regression Benchmark ---')\n",
    "print(df_reg_co.to_string(index=False))\n",
    "\n",
    "print('\\n--- Toxic Episode Classification Benchmark ---')\n",
    "print(df_clf.to_string(index=False))"
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(notebook_dict, f, indent=2)

print("Jupyter Notebook created successfully at:", notebook_path)
