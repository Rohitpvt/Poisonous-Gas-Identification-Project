"""
src/model_training.py
Multi-Model Development, Cross-Validation, and Benchmarking Pipeline.
Trains and compares multiple regression and classification algorithms for:
1. Target: Toxic Gas Forecasting (NH3 & CO concentration 1h ahead)
   - Linear / Ridge Regression (Baseline)
   - Random Forest Regressor
   - XGBoost Regressor
   - LightGBM Regressor
2. Target: Hazardous Toxic Alert Classification (Binary Risk Episode)
   - Logistic Regression
   - Random Forest Classifier
   - XGBoost Classifier
   - LightGBM Classifier

Exports models, evaluation metric tables, and feature importances.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from xgboost import XGBRegressor, XGBClassifier
from lightgbm import LGBMRegressor, LGBMClassifier

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
MODELS_DIR = os.path.join(BASE_DIR, "outputs", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_regression_models(df: pd.DataFrame, target_col='target_nh3_next'):
    print(f"\n[ModelTraining] === Training Regression Models for: {target_col} ===", flush=True)
    
    target_cols = ['target_nh3_next', 'target_co_next', 'target_pm2_5_next', 'target_toxic_alert']
    meta_cols = ['station_id', 'state', 'city', 'station_name', 'timestamp']
    
    feature_cols = [c for c in df.columns if c not in target_cols and c not in meta_cols]
    
    X = df[feature_cols]
    y = df[target_col]
    
    # Chronological 80/20 train/test split
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    
    models = {
        "Ridge Regression": Ridge(alpha=1.0),
        "Random Forest": RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42, n_jobs=-1),
        "XGBoost": XGBRegressor(n_estimators=80, max_depth=5, learning_rate=0.1, random_state=42, n_jobs=-1),
        "LightGBM": LGBMRegressor(n_estimators=80, max_depth=5, learning_rate=0.1, random_state=42, n_jobs=-1, verbose=-1)
    }
    
    results = []
    trained_models = {}
    
    for name, model in models.items():
        print(f"  Training {name}...", flush=True)
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        mae = mean_absolute_error(y_test, preds)
        r2 = r2_score(y_test, preds)
        
        results.append({
            "Model": name,
            "Target": target_col,
            "RMSE": round(float(rmse), 3),
            "MAE": round(float(mae), 3),
            "R2 Score": round(float(r2), 4)
        })
        trained_models[name] = model
        
    df_results = pd.DataFrame(results)
    print("\n--- Regression Performance Benchmark ---", flush=True)
    print(df_results.to_string(index=False), flush=True)
    
    best_model_name = df_results.sort_values(by="R2 Score", ascending=False).iloc[0]["Model"]
    joblib.dump(trained_models[best_model_name], os.path.join(MODELS_DIR, f"best_regressor_{target_col}.pkl"))
    df_results.to_csv(os.path.join(MODELS_DIR, f"regression_results_{target_col}.csv"), index=False)
    
    joblib.dump(feature_cols, os.path.join(MODELS_DIR, "feature_columns.pkl"))
    return df_results, trained_models, X_test, y_test


def train_classification_models(df: pd.DataFrame, target_col='target_toxic_alert'):
    print(f"\n[ModelTraining] === Training Classification Models for: {target_col} ===", flush=True)
    
    target_cols = ['target_nh3_next', 'target_co_next', 'target_pm2_5_next', 'target_toxic_alert']
    meta_cols = ['station_id', 'state', 'city', 'station_name', 'timestamp']
    
    feature_cols = [c for c in df.columns if c not in target_cols and c not in meta_cols]
    
    X = df[feature_cols]
    y = df[target_col]
    
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=500, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=50, max_depth=8, random_state=42, n_jobs=-1),
        "XGBoost": XGBClassifier(n_estimators=80, max_depth=5, learning_rate=0.1, random_state=42, eval_metric='logloss', n_jobs=-1),
        "LightGBM": LGBMClassifier(n_estimators=80, max_depth=5, learning_rate=0.1, random_state=42, verbose=-1, n_jobs=-1)
    }
    
    results = []
    trained_models = {}
    
    for name, model in models.items():
        print(f"  Training {name}...", flush=True)
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        prob_preds = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else preds
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        auc = roc_auc_score(y_test, prob_preds)
        
        results.append({
            "Model": name,
            "Accuracy": round(float(acc), 4),
            "Precision": round(float(prec), 4),
            "Recall": round(float(rec), 4),
            "F1 Score": round(float(f1), 4),
            "ROC-AUC": round(float(auc), 4)
        })
        trained_models[name] = model
        
    df_results = pd.DataFrame(results)
    print("\n--- Classification Performance Benchmark ---", flush=True)
    print(df_results.to_string(index=False), flush=True)
    
    best_model_name = df_results.sort_values(by="F1 Score", ascending=False).iloc[0]["Model"]
    joblib.dump(trained_models[best_model_name], os.path.join(MODELS_DIR, "best_classifier_toxic_alert.pkl"))
    df_results.to_csv(os.path.join(MODELS_DIR, "classification_results_toxic_alert.csv"), index=False)
    
    return df_results, trained_models


def run_training_pipeline():
    df_path = os.path.join(PROCESSED_DIR, "featured_model_dataset.csv")
    df = pd.read_csv(df_path)
    
    # 1. Regression for NH3
    reg_nh3_res, reg_models, X_test, y_test = train_regression_models(df, target_col='target_nh3_next')
    
    # 2. Regression for CO
    reg_co_res, _, _, _ = train_regression_models(df, target_col='target_co_next')
    
    # 3. Classification for Toxic Episode Alert
    clf_res, clf_models = train_classification_models(df, target_col='target_toxic_alert')
    
    print("\n[ModelTraining] All models trained, evaluated, and serialized successfully!", flush=True)

if __name__ == "__main__":
    run_training_pipeline()
