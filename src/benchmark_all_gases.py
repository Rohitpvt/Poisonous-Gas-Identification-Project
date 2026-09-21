import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

df_raw = pd.read_csv('data/processed/cleaned_dpcc_ground_data.csv')
df = df_raw.copy()
df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df.sort_values(by='timestamp').reset_index(drop=True)

# Cyclic
df['hour'] = df['timestamp'].dt.hour
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24.0)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24.0)
df['month'] = df['timestamp'].dt.month
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12.0)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12.0)

# Wind
wd_rad = np.radians(df['wind_direction'].clip(0, 360))
ws = df['wind_speed'].clip(0, 50)
df['wind_u'] = -ws * np.sin(wd_rad)
df['wind_v'] = -ws * np.cos(wd_rad)
angle_diff = np.abs(df['wind_direction'] - 130.0)
angle_diff = np.minimum(angle_diff, 360.0 - angle_diff)
df['ghazipur_plume_alignment'] = np.cos(np.radians(angle_diff)).clip(0, 1)
df['landfill_dispersion_index'] = df['ghazipur_plume_alignment'] * np.exp(-0.25 * ws)

gases = ['nh3', 'co', 'pm2_5', 'pm10', 'no2', 'so2', 'ozone', 'benzene', 'toluene']

for g in gases:
    for lag in [1, 2, 4, 12]:
        df[f'{g}_lag_{lag}'] = df[g].shift(lag)
    df[f'{g}_roll_mean_3h'] = df[g].rolling(window=12, min_periods=1).mean()
    df[f'{g}_roll_mean_6h'] = df[g].rolling(window=24, min_periods=1).mean()
    df[f'target_{g}_next'] = df[g].shift(-4)

df = df.dropna().reset_index(drop=True)

meta = ['station_id', 'state', 'city', 'station_name', 'timestamp']
targets = [f'target_{g}_next' for g in gases]
features = [c for c in df.columns if c not in meta and c not in targets]

split_idx = int(len(df) * 0.8)
train_df, test_df = df.iloc[:split_idx], df.iloc[split_idx:]
X_train, X_test = train_df[features], test_df[features]

all_metrics = []

for g in gases:
    y_train, y_test = train_df[f'target_{g}_next'], test_df[f'target_{g}_next']
    
    # 1. Ridge
    m_ridge = Ridge(alpha=1.0)
    m_ridge.fit(X_train, y_train)
    p_ridge = m_ridge.predict(X_test)
    all_metrics.append({
        'gas': g.upper(),
        'model': 'Ridge Regression (Baseline)',
        'r2': r2_score(y_test, p_ridge),
        'rmse': np.sqrt(mean_squared_error(y_test, p_ridge)),
        'mae': mean_absolute_error(y_test, p_ridge)
    })
    
    # 2. LightGBM
    m_lgbm = LGBMRegressor(n_estimators=80, max_depth=5, learning_rate=0.1, random_state=42, n_jobs=-1, verbose=-1)
    m_lgbm.fit(X_train, y_train)
    p_lgbm = m_lgbm.predict(X_test)
    all_metrics.append({
        'gas': g.upper(),
        'model': 'LightGBM Regressor',
        'r2': r2_score(y_test, p_lgbm),
        'rmse': np.sqrt(mean_squared_error(y_test, p_lgbm)),
        'mae': mean_absolute_error(y_test, p_lgbm)
    })
    
    # 3. XGBoost
    m_xgb = XGBRegressor(n_estimators=80, max_depth=5, learning_rate=0.1, random_state=42, n_jobs=-1)
    m_xgb.fit(X_train, y_train)
    p_xgb = m_xgb.predict(X_test)
    all_metrics.append({
        'gas': g.upper(),
        'model': 'XGBoost Regressor',
        'r2': r2_score(y_test, p_xgb),
        'rmse': np.sqrt(mean_squared_error(y_test, p_xgb)),
        'mae': mean_absolute_error(y_test, p_xgb)
    })

res_df = pd.DataFrame(all_metrics)
res_df.to_csv('outputs/models/all_gases_regression_benchmark.csv', index=False)
print("=== MULTI-GAS REGRESSION BENCHMARK RESULTS ===")
print(res_df.to_string())
