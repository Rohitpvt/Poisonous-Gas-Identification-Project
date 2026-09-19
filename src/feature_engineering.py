"""
src/feature_engineering.py
Feature Engineering Pipeline for Landfill Gas Forecasting and Risk Classification:
- Temporal cyclic encodings (Hour, Month, Day-of-week).
- Lagged pollutant observations (1h, 3h, 6h, 12h, 24h lags & rolling statistics).
- Meteorological Dispersion Vectors:
    - Wind direction trigonometric components: u = -WS*sin(WD), v = -WS*cos(WD)
    - Ghazipur Dump Yard Direct Plume Alignment Angle (~130° azimuth from station)
    - Thermal Inversion Proxy (Temp vs Barometric Pressure / Solar Radiation)
- Target creation for both Regression (NH3, CO, PM2.5 multi-horizon forecasting)
  and Classification (Hazardous Air Episode Alert Level).
"""

import os
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

# Station to Ghazipur Landfill approximate geometric azimuth: ~130° (South-East)
GHAZIPUR_AZIMUTH_DEG = 130.0

def build_features(df_input=None, horizon_hours=1, save_to_disk=True) -> pd.DataFrame:
    """Creates lagged features, dispersion indicators, and targets for model training."""
    if df_input is None:
        df_path = os.path.join(PROCESSED_DIR, "cleaned_dpcc_ground_data.csv")
        df = pd.read_csv(df_path)
    else:
        df = df_input.copy()
        
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values(by='timestamp').reset_index(drop=True)
    
    # 1. Temporal Cyclic Features
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Cyclic sine/cosine transformations for continuous cyclical time representation
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24.0)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24.0)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12.0)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12.0)
    
    # 2. Meteorological & Wind Dispersion Vector Engineering
    wd_rad = np.radians(df['wind_direction'].clip(0, 360))
    ws = df['wind_speed'].clip(0, 50)
    
    # Wind vector decomposition (u: East-West, v: North-South)
    df['wind_u'] = -ws * np.sin(wd_rad)
    df['wind_v'] = -ws * np.cos(wd_rad)
    
    # Ghazipur Plume Alignment Index (1.0 = direct downwind corridor, 0.0 = opposite direction)
    angle_diff = np.abs(df['wind_direction'] - GHAZIPUR_AZIMUTH_DEG)
    angle_diff = np.minimum(angle_diff, 360.0 - angle_diff)
    df['ghazipur_plume_alignment'] = np.cos(np.radians(angle_diff)).clip(0, 1)
    
    # Combined Plume Dispersion Severity (high alignment + low/moderate wind = stagnant toxic accumulation)
    df['landfill_dispersion_index'] = df['ghazipur_plume_alignment'] * np.exp(-0.25 * ws)
    
    # Atmospheric Stagnation / Boundary Layer Ventilation Index Proxy
    df['ventilation_index_proxy'] = ws * (df['temp'] + 273.15) / (df['barometric_pressure'] + 1e-5)
    
    # 3. Lag Features & Rolling Window Aggregations (15-min intervals: 4 intervals = 1 hour)
    key_pollutants = ['nh3', 'co', 'pm2_5', 'pm10', 'no2', 'benzene']
    available_pollutants = [p for p in key_pollutants if p in df.columns]
    
    # Time steps (4 = 1 hr, 12 = 3 hr, 24 = 6 hr)
    lag_steps = [1, 2, 4, 12, 24]
    
    for col in available_pollutants:
        for lag in lag_steps:
            df[f'{col}_lag_{lag}'] = df[col].shift(lag)
            
        # Rolling averages and standard deviation over 3h (12 intervals) and 6h (24 intervals)
        df[f'{col}_roll_mean_3h'] = df[col].rolling(window=12, min_periods=1).mean()
        df[f'{col}_roll_std_3h'] = df[col].rolling(window=12, min_periods=1).std().fillna(0)
        df[f'{col}_roll_mean_6h'] = df[col].rolling(window=24, min_periods=1).mean()
        
    # 4. Target Variables for Regression (Forecasting horizon: default 4 steps = 1 hour ahead)
    target_steps = int(horizon_hours * 4)
    df['target_nh3_next'] = df['nh3'].shift(-target_steps)
    df['target_co_next'] = df['co'].shift(-target_steps)
    df['target_pm2_5_next'] = df['pm2_5'].shift(-target_steps)
    
    # 5. Target Variable for Classification (Hazardous Toxic Gas Episode: NH3 > 90th percentile OR High Combined Toxicity)
    nh3_threshold = df['nh3'].quantile(0.85)
    df['target_toxic_alert'] = ((df['nh3'] > nh3_threshold) | (df['co'] > df['co'].quantile(0.85))).astype(int)
    
    # Drop rows with NaN targets due to lead/lag shifts
    df = df.dropna().reset_index(drop=True)
    
    if save_to_disk:
        out_path = os.path.join(PROCESSED_DIR, "featured_model_dataset.csv")
        df.to_csv(out_path, index=False)
        print(f"[FeatureEngineering] Engineered {df.shape[1]} features across {len(df):,} records. Saved to {out_path}")
        
    return df

if __name__ == "__main__":
    df_feat = build_features()
    print("Feature engineering pipeline completed successfully!")
