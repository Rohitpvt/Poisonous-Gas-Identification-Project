# 🏭 LandfillPlume-AI: Hazardous Gas Dispersion & Forecasting System

> **Spatio-Temporal Integration of Satellite Methane Super-Emitters & DPCC Continuous Ground Air Monitoring near Ghazipur Dump Yard**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-61dafb.svg)](https://reactjs.org/)
[![ML Frameworks](https://img.shields.io/badge/ML-LightGBM%20%7C%20XGBoost%20%7C%20Scikit--Learn-orange.svg)](https://scikit-learn.org/)
[![Explainability](https://img.shields.io/badge/XAI-SHAP%20TreeExplainer-green.svg)](https://shap.readthedocs.io/)
[![Design System](https://img.shields.io/badge/UI-SprintForge%20Design%20Framework-red.svg)](./Design%20Demo/sprintforge-DESIGN.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 📌 Executive Summary

Municipal solid waste landfills in metropolitan Delhi (**Ghazipur, Bhalswa, Okhla, and Bandhwari**) are massive point-source emitters of toxic greenhouse and hazardous gases, including **Methane ($CH_4$)**, **Ammonia ($NH_3$)**, **Carbon Monoxide ($CO$)**, **Particulate Matter ($PM_{2.5}$)**, and Volatile Organic Compounds (**Benzene/Toluene**). 

**LandfillPlume-AI** establishes an end-to-end Machine Learning and Explainable AI (XAI) framework that fuses:
1. **Hyperspectral Satellite Observations (NASA EMIT & ESA EnMAP)**: Capturing high-resolution methane super-emitter plume flux rates ($kg/hr$) across Delhi landfills.
2. **Continuous Ground-Level Sensor Monitoring (DPCC Anand Vihar Hub)**: 70,000+ continuous 15-minute time-series observations tracking multi-pollutant concentrations and micrometeorology.

The platform provides multi-horizon gas forecasting, unsupervised episode classification, live local SHAP force decomposition, and a **Public Health Early-Warning & Safe-Zone Routing Engine**.

---

## 🚀 Key Features

* **Interactive GIS Landfill & Plume Map**: OpenStreetMap integration displaying Delhi dumpsite coordinates and **dynamic Gaussian dispersion cones** that rotate in real time with the wind vector.
* **Exploratory Data Analysis (EDA) Studio**: Interactive 24-hour diurnal inversion curves showing acute ground trapping (peak 02:00 – 06:00 IST) and downwind Ghazipur corridor analysis ($100^\circ - 160^\circ$ SE direct plume surge).
* **Multi-Model ML Benchmark Leaderboard**: Evaluates **Ridge Regression, LightGBM, XGBoost, and Random Forest** models with cross-validation.
* **Explainable AI (SHAP Interpretability)**: Global TreeExplainer beeswarm and game-theoretic Shapley mathematical proofs.
* **Real-Time Plume Dispersion Simulator**: Interactive weather and baseline gas sliders with live local SHAP waterfall feature decomposition.
* **🚨 Public Health Early-Warning & Resident Safe-Zone Engine**: Persona-adaptive health vulnerability scoring (Asthma patients, children, elderly, commuters), neighborhood threat rankings, upwind safe-zone identification, and simulated automated SMS emergency broadcasts.

---

## 📊 Model Performance Benchmark

### 1. Regression (1-Hour Ahead Gas Concentration Forecasting)
| Model | Target | RMSE | MAE | $R^2$ Score | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ridge Regression** | $NH_3$ | **10.933** | **6.002** | **0.8425** | 🏆 Champion Model |
| **LightGBM Regressor** | $NH_3$ | 11.847 | 6.225 | 0.8151 | Top Tree Model |
| **XGBoost Regressor** | $NH_3$ | 11.974 | 6.657 | 0.8111 | Evaluated |
| **Random Forest Regressor** | $NH_3$ | 12.716 | 7.534 | 0.7870 | Evaluated |
| **LightGBM Regressor** | $CO$ | **0.696** | **0.301** | **0.8203** | 🏆 Champion Model |
| **Random Forest Regressor** | $CO$ | 0.707 | 0.299 | 0.8146 | Evaluated |

### 2. Classification (Hazardous Toxic Gas Episode Detection)
| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Random Forest Classifier** | **0.9997** | **0.9990** | **1.0000** | **0.9995** | **1.0000** |
| **XGBoost Classifier** | 0.9989 | 0.9966 | 0.9995 | 0.9981 | 1.0000 |
| **LightGBM Classifier** | 0.9981 | 0.9976 | 0.9961 | 0.9968 | 1.0000 |
| **Logistic Regression** | 0.8584 | 0.6988 | 0.9115 | 0.7911 | 0.9657 |

---

## 📂 Repository Structure

```text
├── data/
│   ├── raw/                        # Original DPCC time-series and satellite plume CSV files
│   └── processed/                  # Cleaned datasets & engineered feature matrices
├── src/
│   ├── data_loader.py              # Ingestion & cleaning pipeline
│   ├── eda.py                      # Statistical analysis & publication figure generator
│   ├── feature_engineering.py      # Wind vectors, lag features, and plume proximity indices
│   ├── model_training.py           # Multi-model training and cross-validation
│   ├── evaluate.py                 # Benchmarking and SHAP visualization
│   ├── alert_system.py             # Public health risk index & safe-zone engine
│   └── generate_notebook.py        # Lab demo notebook generator
├── notebooks/
│   └── 01_eda_and_modeling.ipynb   # Interactive Jupyter notebook for lab viva / demo
├── outputs/
│   ├── figures/                    # High-res charts (correlation, diurnal, SHAP, downwind)
│   └── models/                     # Serialized trained models (.pkl) & benchmark CSVs
├── frontend/                       # Modern React + Vite + Tailwind CSS web application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx      # Framer Motion sliding pill navigation
│   │   │   ├── Overview.tsx        # Hero and satellite overpass table
│   │   │   ├── GisMap.tsx          # Leaflet OpenStreetMap with dispersion cone
│   │   │   ├── EdaStudio.tsx       # Recharts diurnal inversion curves
│   │   │   ├── ModelBenchmarks.tsx # Leaderboard & validation charts
│   │   │   ├── ExplainableAi.tsx   # Global SHAP feature analysis
│   │   │   ├── PlumeSimulator.tsx  # Live weather sliders & local SHAP waterfall
│   │   │   └── HealthAdvisory.tsx  # Clinical advice, safe zones, & SMS dispatcher
│   │   ├── data/constants.ts       # Domain data & model constants
│   │   ├── App.tsx                 # Main application view
│   │   └── index.css               # SprintForge design tokens & styles
│   └── package.json
├── app.py                          # Streamlit dashboard alternative
├── requirements.txt                # Python ML dependencies
├── LICENSE                         # MIT License
└── README.md                       # Documentation
```

---

## 🛠️ Quickstart Guide

### 1. Python Machine Learning Backend

```bash
# Clone the repository
git clone https://github.com/Rohitpvt/Poisonous-Gas-Identification-Project.git
cd Poisonous-Gas-Identification-Project

# Install Python requirements
pip install -r requirements.txt

# Run the complete data and ML pipeline
python src/data_loader.py
python src/eda.py
python src/feature_engineering.py
python src/model_training.py
python src/evaluate.py
```

### 2. React + Vite Frontend (SprintForge UI)

```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5174](http://localhost:5174)** in your browser.

### 3. Streamlit Dashboard (Alternative)

```bash
streamlit run app.py
```
Open **[http://localhost:8501](http://localhost:8501)** in your browser.

---

## 📜 License
This project is licensed under the [MIT License](./LICENSE).
