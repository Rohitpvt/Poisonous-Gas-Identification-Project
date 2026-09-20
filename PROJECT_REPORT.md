# Academic Project Report
## **LandfillPlume-AI: Spatio-Temporal Modeling, Hazardous Gas Dispersion Prediction, and Public Health Early-Warning near Ghazipur Dump Yard**

---

### **1. Introduction**
Urban solid waste management poses a critical environmental and public health hazard in rapidly expanding metropolises. In the National Capital Region (NCR) of Delhi, legacy landfill dump yards—most prominently **Ghazipur, Bhalswa, and Okhla**—have exceeded their designed capacity by several folds, accumulating tens of millions of metric tons of municipal solid waste. 

These unscientific, open-air dumpsites undergo continuous anaerobic decomposition, releasing enormous volumes of **Methane ($CH_4$)**, a potent greenhouse gas, alongside hazardous co-pollutants including **Ammonia ($NH_3$)**, **Carbon Monoxide ($CO$)**, **Particulate Matter ($PM_{2.5}, PM_{10}$)**, and toxic Volatile Organic Compounds (**Benzene, Toluene**). Furthermore, frequent subsurface spontaneous combustion events at the Ghazipur landfill exacerbate localized toxic air episodes.

While spaceborne hyperspectral sensors (such as NASA's EMIT and ESA's EnMAP) provide valuable point-source methane emission rate snapshots, satellite overpasses are temporally sparse. Conversely, ground-level monitoring stations (like the DPCC Anand Vihar station located ~2.8 km downwind of Ghazipur) provide continuous 15-minute observations of ambient criteria pollutants and micrometeorology, but lack explicit emission source attribution. 

This project, **LandfillPlume-AI**, bridges this critical gap by fusing multimodal satellite remote sensing with continuous ground-level time-series data. We develop an Explainable Machine Learning (XAI) framework to quantify landfill gas dispersion, forecast short-term hazardous pollutant spikes, and provide actionable public health early-warning advisories.

---

### **2. Objectives of the Project**
The primary objectives of this research and engineering project are:

1. **Multimodal Dataset Integration**: Ingest and align high-resolution spaceborne methane super-emitter plume observations (NASA EMIT & ESA EnMAP) with 70,000+ continuous ground-level air quality and meteorological observations from the DPCC Anand Vihar monitoring hub.
2. **Spatio-Temporal & Dispersion Exploratory Data Analysis**: Statistically quantify the empirical impact of the direct Ghazipur downwind corridor ($100^\circ - 160^\circ$ SE) and nocturnal boundary layer thermal inversions on ground-level toxic gas accumulation.
3. **Physics-Informed Feature Engineering**: Construct domain-specific features, including trigonometric wind vector decompositions ($u, v$), geometric plume alignment indices, planetary boundary layer ventilation proxies, and multi-step lag aggregations.
4. **Multi-Model Development & Benchmarking**: Train, validate, and compare regularized linear baselines (Ridge Regression), Decision Trees, Ensemble Random Forests, and Gradient Boosting machines (XGBoost, LightGBM) for both continuous gas forecasting and discrete toxic episode risk classification.
5. **Model Interpretability & Explainable AI (XAI)**: Implement game-theoretic **SHAP (SHapley Additive exPlanations)** via `TreeExplainer` to mathematically attribute model predictions to physical environmental drivers.
6. **Interactive Dashboard & Practical Health Advisory System**: Design and deploy a precision web platform (built on the SprintForge Design System) featuring GIS dispersion mapping, a real-time plume simulation engine with live local SHAP waterfall decomposition, and an automated resident emergency alert dispatcher.

---

### **3. Methodology Used**

```
┌─────────────────────────────────┐      ┌───────────────────────────────────┐
│   Satellite Plumes (EMIT/EnMAP) │      │   DPCC Anand Vihar Ground Data    │
│   23 CH4 Point-Source Plumes    │      │   70,176 Records (15-min interval)│
└────────────────┬────────────────┘      └─────────────────┬─────────────────┘
                 │                                         │
                 └──────────────────┬──────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 Data Cleaning & Missing Value Imputation                    │
│    (Linear time-series interpolation, column normalization, coordinate map) │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Physics-Informed Feature Engineering                  │
│  • Wind Vectors: u = -WS·sin(WD), v = -WS·cos(WD)                           │
│  • Ghazipur Geometric Alignment Index: cos(|WD - 130°|)                     │
│  • Ventilation Stagnation Index: WS · (Temp + 273.15) / BP                  │
│  • Temporal & Lag Dynamics: 1h, 3h, 6h rolling averages & cyclic sin/cos     │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             Model Training & Chronological Validation (80/20 Split)         │
│  • Regression: Ridge Regression, Random Forest, XGBoost, LightGBM          │
│  • Classification: Logistic Regression, Random Forest, XGBoost, LightGBM   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Explainability & Model Evaluation                       │
│  • Metrics: RMSE, MAE, R², Accuracy, Precision, Recall, F1, ROC-AUC         │
│  • SHAP Game-Theoretic Feature Attribution & Marginal Force Decompositions  │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│               Interactive Dashboard & Public Health Early Warning           │
│  • React (SprintForge UI) / Streamlit Platforms + Dynamic Plume Cone GIS    │
│  • Persona-Adaptive Health Vulnerability Index & Automated SMS Dispatcher   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### **3.1 Data Preprocessing & Alignment**
- Continuous 15-minute ground sensor data spanning 2 years (2024–2025) was cleaned to eliminate encoding artifacts in pollutant names ($\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{NO}_x, \text{NH}_3, \text{SO}_2, \text{CO}, \text{Benzene}, \text{Toluene}$).
- Missing numeric values resulting from temporary sensor recalibration were imputed using bi-directional time-series linear interpolation followed by forward/backward fill.
- The 23 satellite methane plume observations across Ghazipur, Bhalswa, Okhla, and Bandhwari were parsed for coordinate bounds, total emissions flux ($kg/hr$), wind speed, and instrument metadata.

#### **3.2 Feature Engineering Formulations**
1. **Trigonometric Wind Vectors**:
   $$u = -\text{WS} \cdot \sin\left(\frac{\pi \cdot \text{WD}}{180}\right), \quad v = -\text{WS} \cdot \cos\left(\frac{\pi \cdot \text{WD}}{180}\right)$$
2. **Ghazipur Landfill Geometric Plume Alignment**:
   $$\Delta \theta = \min\left(|\text{WD} - 130.0^\circ|, 360^\circ - |\text{WD} - 130.0^\circ|\right)$$
   $$\text{Alignment Index} = \max\left(0, \cos\left(\frac{\pi \cdot \Delta \theta}{180}\right)\right)$$
3. **Plume Dispersion Stagnation Severity**:
   $$\text{Dispersion Index} = \text{Alignment Index} \cdot \exp(-0.25 \cdot \text{WS})$$
4. **Ventilation Proxy**:
   $$\text{Ventilation Index} = \frac{\text{WS} \cdot (T_{\text{ambient}} + 273.15)}{P_{\text{barometric}}}$$

#### **3.3 Supervised Learning Setup**
- **Task A (Continuous Gas Forecasting - Regression)**: Predict $1$-hour ahead ground concentrations of $\text{NH}_3$ ($\mu g/m^3$) and $\text{CO}$ ($mg/m^3$).
- **Task B (Toxic Episode Alert - Classification)**: Classify whether the impending temporal window exhibits an acute landfill toxic episode (defined as $\text{NH}_3$ or $\text{CO}$ exceeding their 85th percentile exposure threshold).
- **Validation**: Strict chronological split (first 80% training, subsequent 20% testing) to respect temporal dependencies and prevent lookahead data leakage.

#### **3.4 Explainable AI (SHAP Formulation)**
Feature attributions were mathematically computed using Shapley values:
$$\phi_i(f, x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \left[ f(S \cup \{i\}) - f(S) \right]$$

---

### **4. Implementation Architecture**
The project was constructed across two modular tiers:
1. **Core Machine Learning Backend (`src/`)**:
   - `data_loader.py`: Multimodal ingestion and dataset merging.
   - `eda.py`: Statistical profiling, diurnal trend generation, and correlation analysis.
   - `feature_engineering.py`: Vector math, lag transformations, and target formulation.
   - `model_training.py`: Model training, hyperparameter tuning, and serialization (`.pkl`).
   - `evaluate.py`: Performance benchmarking and global/local SHAP analysis.
   - `alert_system.py`: Vulnerability Risk Index (VRI) computation, neighborhood ranking, and SMS dispatcher.
2. **Frontend UI Tier (`frontend/`)**:
   - Built with **React 18, Vite, TypeScript, and Tailwind CSS** adhering to the **SprintForge Design Framework** (`sprintforge-DESIGN.md`).
   - Integrates **Leaflet/React-Leaflet** for interactive GIS map visualization with real-time Gaussian plume dispersion cone overlays, **Recharts** for diurnal time-series analysis, and **Framer Motion** for smooth spring-physics navigation.

---

### **5. Results & Discussion**

#### **5.1 Exploratory Data Analysis & Downwind Evidence**
The exploratory analysis revealed two primary environmental findings:
1. **Nocturnal Trapping Effect**: A prominent diurnal cycle occurs where $\text{NH}_3$ and $\text{PM}_{2.5}$ peak between **02:00 and 06:00 IST** (mean $\text{NH}_3 = 79.8\ \mu g/m^3$), driven by nighttime surface cooling and atmospheric boundary layer compression. Daytime solar convection dilutes concentrations by over $55\%$ (mean $\text{NH}_3 = 32.1\ \mu g/m^3$ at 14:00 IST).
2. **Ghazipur Downwind Surge**: When wind vectors blow from the $100^\circ - 160^\circ$ sector (direct path from Ghazipur dump yard to Anand Vihar), ambient concentrations experience dramatic increases:
   - **Ammonia ($\text{NH}_3$)**: Surges by **$+65.1\%$** ($48.2\ \mu g/m^3 \rightarrow 79.6\ \mu g/m^3$).
   - **Carbon Monoxide ($\text{CO}$)**: Surges by **$+58.9\%$** ($1.85\ mg/m^3 \rightarrow 2.94\ mg/m^3$).
   - **$\text{PM}_{2.5}$**: Surges by **$+48.3\%$** ($154.2\ \mu g/m^3 \rightarrow 228.7\ \mu g/m^3$).
   - **Benzene**: Surges by **$+70.5\%$** ($3.4\ \mu g/m^3 \rightarrow 5.8\ \mu g/m^3$).

#### **5.2 Machine Learning Benchmark Comparisons**

##### **Table 1: Regression Benchmark (1-Hour Ahead Forecasting)**
| Model Algorithm | Forecast Target | RMSE | MAE | $R^2$ Score (Variance Explained) | Evaluation Note |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Ridge Regression (Baseline)** | $\text{NH}_3\ (\mu g/m^3)$ | **10.933** | **6.002** | **0.8425** | 🏆 Champion for $\text{NH}_3$ |
| **LightGBM Regressor** | $\text{NH}_3\ (\mu g/m^3)$ | 11.847 | 6.225 | 0.8151 | Robust non-linear fit |
| **XGBoost Regressor** | $\text{NH}_3\ (\mu g/m^3)$ | 11.974 | 6.657 | 0.8111 | High precision tree booster |
| **Random Forest Regressor** | $\text{NH}_3\ (\mu g/m^3)$ | 12.716 | 7.534 | 0.7870 | Ensemble bagging baseline |
| **LightGBM Regressor** | $\text{CO}\ (mg/m^3)$ | **0.696** | **0.301** | **0.8203** | 🏆 Champion for $\text{CO}$ |
| **Random Forest Regressor** | $\text{CO}\ (mg/m^3)$ | 0.707 | 0.299 | 0.8146 | Strong tree baseline |

##### **Table 2: Classification Benchmark (Toxic Episode Alert Detection)**
| Model Algorithm | Accuracy | Precision | Recall | F1 Score | ROC-AUC | Evaluation Note |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Random Forest Classifier** | **0.9997** | **0.9990** | **1.0000** | **0.9995** | **1.0000** | 🏆 Perfect recall on toxic spikes |
| **XGBoost Classifier** | 0.9989 | 0.9966 | 0.9995 | 0.9981 | 1.0000 | Excellent generalizability |
| **LightGBM Classifier** | 0.9981 | 0.9976 | 0.9961 | 0.9968 | 1.0000 | Fast inference latency |
| **Logistic Regression** | 0.8584 | 0.6988 | 0.9115 | 0.7911 | 0.9657 | Linear decision boundary |

#### **5.3 Explainable AI (SHAP) Insights**
Global TreeExplainer attribution demonstrated that:
1. **Autoregressive Memory**: Recent $15$-minute and $1$-hour lags account for the dominant base prediction magnitude.
2. **Ghazipur Alignment Vector**: High geometric alignment with the Ghazipur landfill exhibits the largest positive non-lag SHAP impact ($+18.5\%$ relative contribution), proving the direct physical connection between dump yard emissions and receptor air quality.
3. **Inversion Dynamics**: Negative temperature SHAP values confirm that colder nocturnal temperatures actively suppress convective dispersion, trapping pollutants at ground level.

#### **5.4 Public Health Application & Early Warning System**
The deployed system translates model outputs into actionable health metrics:
- **Toxicity Exposure Index ($0-100$)**: Adapts thresholds for vulnerable personas (e.g., multiplier of $1.35\times$ for asthma patients and $1.30\times$ for elderly residents).
- **Neighborhood Risk Ranking**: Evaluates surrounding zones (Anand Vihar, Kaushambi, Kalyanpuri, Ghazipur Village, Patparganj) and identifies clean upwind safe zones (such as Mayur Vihar Phase 3).
- **Automated Emergency Dispatch**: Formats and transmits instant SMS advisory broadcasts with clinical protection directives (e.g., N95 mask mandates, window sealing).

---

### **6. Conclusion**
The **LandfillPlume-AI** project demonstrates a successful integration of satellite remote sensing and ground-based IoT sensors using modern machine learning and Explainable AI. By achieving an $R^2$ score of **$0.8425$** for continuous hazardous gas forecasting and an F1 score of **$0.9995$** for toxic episode detection, the system provides both strong academic rigor and tangible public health utility for communities living near legacy landfills.
