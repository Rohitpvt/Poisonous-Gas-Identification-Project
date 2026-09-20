"""
src/data_loader.py
Data Ingestion and Preprocessing Pipeline
- Loads 23 satellite methane (CH4) plume files (EMIT & EnMAP) for Delhi landfills.
- Loads 70,000+ records of DPCC Anand Vihar continuous air quality & meteorological monitoring data.
- Cleans column names, datetimes, handles missing values, and merges dataset sources.
"""

import os
import glob
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DPCC_FILE = os.path.join(BASE_DIR, "del-anand-vihar-dpcc-2024-25.csv")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

# Known Coordinates (Latitude, Longitude)
LANDFILL_COORDINATES = {
    "Ghazipur": {"lat": 28.6238, "lon": 77.3284, "type": "Solid Waste Landfill"},
    "Bhalswa": {"lat": 28.7422, "lon": 77.1556, "type": "Solid Waste Landfill"},
    "Okhla": {"lat": 28.5113, "lon": 77.2848, "type": "Solid Waste Landfill"},
    "Bandhwari": {"lat": 28.4024, "lon": 77.1644, "type": "Solid Waste Landfill"},
    "Anand_Vihar_Station": {"lat": 28.6469, "lon": 77.3160, "type": "Monitoring Station"}
}

def load_satellite_plumes(base_dir=BASE_DIR) -> pd.DataFrame:
    """Loads and aggregates all satellite plume CSVs into a standardized DataFrame."""
    raw_dir_candidates = [
        os.path.join(base_dir, "Raw Files", "Delhi - Copy"),
        os.path.join(base_dir, "Raw Files"),
        os.path.join(base_dir, "Delhi - Copy"),
        base_dir
    ]
    plume_files = []
    for d in raw_dir_candidates:
        if os.path.exists(d):
            found = glob.glob(os.path.join(d, "**", "*plume*.csv"), recursive=True)
            if found:
                plume_files = found
                break
    
    if not plume_files:
        plume_files = glob.glob(os.path.join(base_dir, "**", "*plume*.csv"), recursive=True)
    
    records = []
    for f in plume_files:
        try:
            df = pd.read_csv(f)
            records.append(df)
        except Exception as e:
            print(f"Warning: Could not read {f}: {e}")
            
    df_raw = pd.concat(records, ignore_index=True)
    
    df_clean = pd.DataFrame({
        'datetime': pd.to_datetime(df_raw['datetime'], errors='coerce'),
        'landfill_site': df_raw['name'],
        'ch4_emission_kg_hr': df_raw['emission'].round(2),
        'latitude': df_raw['plume_latitude'].round(6),
        'longitude': df_raw['plume_longitude'].round(6),
        'wind_speed': df_raw['wind_speed'].round(2),
        'wind_direction': df_raw['wind_direction'].round(2),
        'instrument': df_raw['instrument'],
        'ipcc_sector': df_raw['ipcc_sector'],
        'gas': df_raw['gas']
    }).sort_values('datetime').reset_index(drop=True)
    
    print(f"[DataLoader] Successfully loaded {len(df_clean)} satellite plume observations across {df_clean['landfill_site'].nunique()} landfill sites.")
    return df_clean


def clean_dpcc_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Standardizes DPCC column names cleanly based on substring pattern matching."""
    new_cols = []
    for col in df.columns:
        c = str(col).strip()
        if "PM2.5" in c:
            new_cols.append("pm2_5")
        elif "PM10" in c:
            new_cols.append("pm10")
        elif "NO2" in c:
            new_cols.append("no2")
        elif "NOx" in c:
            new_cols.append("nox")
        elif c.startswith("NO ") or c.startswith("NO ("):
            new_cols.append("no")
        elif "NH3" in c:
            new_cols.append("nh3")
        elif "SO2" in c:
            new_cols.append("so2")
        elif c.startswith("CO ") or c.startswith("CO ("):
            new_cols.append("co")
        elif "Ozone" in c:
            new_cols.append("ozone")
        elif "Benzene" in c and "Eth" not in c:
            new_cols.append("benzene")
        elif "Toluene" in c:
            new_cols.append("toluene")
        elif "Eth-Benzene" in c:
            new_cols.append("eth_benzene")
        elif "MP-Xylene" in c:
            new_cols.append("mp_xylene")
        elif "O Xylene" in c:
            new_cols.append("o_xylene")
        elif "Xylene" in c:
            new_cols.append("xylene")
        elif c.startswith("AT ") or c.startswith("AT ("):
            new_cols.append("temp")
        elif c.startswith("RH ") or c.startswith("RH ("):
            new_cols.append("humidity")
        elif c.startswith("WS ") or c.startswith("WS ("):
            new_cols.append("wind_speed")
        elif c.startswith("WD ") or c.startswith("WD ("):
            new_cols.append("wind_direction")
        elif c.startswith("SR ") or c.startswith("SR ("):
            new_cols.append("solar_radiation")
        elif c.startswith("BP ") or c.startswith("BP ("):
            new_cols.append("barometric_pressure")
        elif "TOT-RF" in c:
            new_cols.append("rainfall")
        elif c.startswith("RF ") or c.startswith("RF ("):
            new_cols.append("rf_mm")
        elif "VWS" in c:
            new_cols.append("vws")
        elif "Timestamp" in c:
            new_cols.append("timestamp")
        elif "Station ID" in c:
            new_cols.append("station_id")
        elif "Station Name" in c:
            new_cols.append("station_name")
        elif "State" in c:
            new_cols.append("state")
        elif "City" in c:
            new_cols.append("city")
        else:
            new_cols.append(c.lower().replace(" ", "_").replace("(", "").replace(")", ""))
            
    df.columns = new_cols
    
    # Drop columns where all values are null
    cols_to_drop = [c for c in df.columns if int(df[c].isna().sum()) == len(df)]
    df = df.drop(columns=cols_to_drop)
    return df


def load_ground_dpcc(file_path=DPCC_FILE) -> pd.DataFrame:
    """Loads and preprocesses continuous ground monitoring data from DPCC Anand Vihar."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"DPCC file not found at: {file_path}")
        
    df = pd.read_csv(file_path, low_memory=False)
    df = clean_dpcc_columns(df)
    
    # Clean timestamps
    df = df.dropna(subset=["timestamp"]).copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df = df.dropna(subset=["timestamp"]).sort_values(by="timestamp").reset_index(drop=True)
    
    # Forward and backward fill numeric time-series gaps
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].interpolate(method="linear", limit=16).bfill().ffill()
    
    print(f"[DataLoader] Successfully loaded {len(df):,} ground monitoring records from Anand Vihar DPCC ({df['timestamp'].min().strftime('%Y-%m-%d')} to {df['timestamp'].max().strftime('%Y-%m-%d')}).")
    return df


def generate_merged_dataset(save_to_disk=True):
    """Integrates Ground DPCC data with Landfill plume features and saves clean copies."""
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    
    df_plumes = load_satellite_plumes()
    df_dpcc = load_ground_dpcc()
    
    if save_to_disk:
        plumes_out = os.path.join(PROCESSED_DIR, "cleaned_satellite_plumes.csv")
        dpcc_out = os.path.join(PROCESSED_DIR, "cleaned_dpcc_ground_data.csv")
        df_plumes.to_csv(plumes_out, index=False)
        df_dpcc.to_csv(dpcc_out, index=False)
        print(f"[DataLoader] Cleaned files successfully written to {PROCESSED_DIR}")
    
    return df_dpcc, df_plumes


if __name__ == "__main__":
    df_dpcc, df_plumes = generate_merged_dataset()
    print("Columns in cleaned DPCC:", df_dpcc.columns.tolist())
    print("Dataset ingestion and cleaning completed successfully!")
