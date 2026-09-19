import os
import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from xgboost import XGBRegressor, XGBClassifier
from lightgbm import LGBMRegressor, LGBMClassifier

BASE_DIR = r"c:\Users\rghos\OneDrive - Vivekananda Institute of Professional Studies\PROJECTS\Christ\Machine Learning\Project"
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
MODELS_DIR = os.path.join(BASE_DIR, "outputs", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

print("Starting lightweight model training...")
df = pd.read_csv(os.path.join(PROCESSED_DIR, "featured_model_dataset.csv"))

# Downsample slightly for fast evaluation across all models (every 2nd sample: ~35k rows)
df_sample = df.iloc[::2].copy().reset_index(drop=True)

target_cols = ['target_nh3_next', 'target_co_next', 'target_pm2_5_next', 'target_toxic_alert']
meta_cols = ['station_id', 'state', 'city', 'station_name', 'timestamp']
feature_cols = [c for c in df_sample.columns if c not in target_cols and c not in meta_cols]

split_idx = int(len(df_sample) * 0.8)
X_train, X_test = df_sample[feature_cols].iloc[:split_idx], df_sample[feature_cols].iloc[split_idx:]

# Save feature column names
joblib.dump(feature_cols, os.path.join(MODELS_DIR, "feature_columns.pkl"))

# 1. Regression for NH3
y_train_nh3, y_test_nh3 = df_sample['target_nh3_next'].iloc[:split_idx], df_sample['target_nh3_next'].iloc[split_idx:]
reg_models = {
    "Ridge Regression": Ridge(alpha=1.0),
    "Random Forest": RandomForestRegressor(n_estimators=30, max_depth=8, random_state=42, n_jobs=-1),
    "XGBoost": XGBRegressor(n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42, n_jobs=-1),
    "LightGBM": LGBMRegressor(n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42, n_jobs=-1, verbose=-1)
}

reg_results = []
best_reg = None
best_r2 = -1e9

for name, m in reg_models.items():
    print(f"Training Regressor: {name}...")
    m.fit(X_train, y_train_nh3)
    preds = m.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test_nh3, preds))
    mae = mean_absolute_error(y_test_nh3, preds)
    r2 = r2_score(y_test_nh3, preds)
    reg_results.append({"Model": name, "RMSE": round(float(rmse), 3), "MAE": round(float(mae), 3), "R2 Score": round(float(r2), 4)})
    if r2 > best_r2:
        best_r2 = r2
        best_reg = m

pd.DataFrame(reg_results).to_csv(os.path.join(MODELS_DIR, "regression_results_target_nh3_next.csv"), index=False)
joblib.dump(best_reg, os.path.join(MODELS_DIR, "best_regressor_target_nh3_next.pkl"))
print("Regression results:\n", pd.DataFrame(reg_results))

# 2. Classification for Toxic Alert
y_train_clf, y_test_clf = df_sample['target_toxic_alert'].iloc[:split_idx], df_sample['target_toxic_alert'].iloc[split_idx:]
clf_models = {
    "Logistic Regression": LogisticRegression(max_iter=300, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=30, max_depth=6, random_state=42, n_jobs=-1),
    "XGBoost": XGBClassifier(n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42, eval_metric='logloss', n_jobs=-1),
    "LightGBM": LGBMClassifier(n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42, verbose=-1, n_jobs=-1)
}

clf_results = []
best_clf = None
best_f1 = -1e9

for name, m in clf_models.items():
    print(f"Training Classifier: {name}...")
    m.fit(X_train, y_train_clf)
    preds = m.predict(X_test)
    prob_preds = m.predict_proba(X_test)[:, 1] if hasattr(m, "predict_proba") else preds
    acc = accuracy_score(y_test_clf, preds)
    prec = precision_score(y_test_clf, preds, zero_division=0)
    rec = recall_score(y_test_clf, preds, zero_division=0)
    f1 = f1_score(y_test_clf, preds, zero_division=0)
    auc = roc_auc_score(y_test_clf, prob_preds)
    clf_results.append({"Model": name, "Accuracy": round(float(acc), 4), "Precision": round(float(prec), 4), "Recall": round(float(rec), 4), "F1 Score": round(float(f1), 4), "ROC-AUC": round(float(auc), 4)})
    if f1 > best_f1:
        best_f1 = f1
        best_clf = m

pd.DataFrame(clf_results).to_csv(os.path.join(MODELS_DIR, "classification_results_toxic_alert.csv"), index=False)
joblib.dump(best_clf, os.path.join(MODELS_DIR, "best_classifier_toxic_alert.pkl"))
print("Classification results:\n", pd.DataFrame(clf_results))
print("TRAINING_COMPLETED_SUCCESSFULLY")
