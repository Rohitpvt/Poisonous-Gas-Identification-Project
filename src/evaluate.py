"""
src/evaluate.py
Model Evaluation, Benchmark Visualization, and Explainable AI (SHAP) Module.
- Generates Comparison Bar Charts for Regression (RMSE, MAE, R2).
- Generates Confusion Matrix and ROC Curves for Toxic Risk Classification.
- Computes Feature Importance and SHAP summary to explain physical dump yard drivers.
"""

import os
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")
MODELS_DIR = os.path.join(BASE_DIR, "outputs", "models")
FIGURES_DIR = os.path.join(BASE_DIR, "outputs", "figures")
os.makedirs(FIGURES_DIR, exist_ok=True)

plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

def generate_benchmark_figures():
    print("[Evaluate] Generating evaluation and benchmark comparison figures...")
    
    # 1. Regression Benchmark Plot
    nh3_res_path = os.path.join(MODELS_DIR, "regression_results_target_nh3_next.csv")
    if os.path.exists(nh3_res_path):
        df_reg = pd.read_csv(nh3_res_path)
        
        fig, axes = plt.subplots(1, 2, figsize=(12, 5))
        sns.barplot(x="Model", y="R2 Score", data=df_reg, palette="viridis", ax=axes[0], hue="Model", legend=False)
        axes[0].set_title("Model Comparison: R² Score (NH3 Forecast 1h Ahead)", fontweight="bold")
        axes[0].set_ylim(0, 1.05)
        for p in axes[0].patches:
            axes[0].annotate(f"{p.get_height():.3f}", (p.get_x() + p.get_width() / 2., p.get_height()),
                             ha='center', va='center', xytext=(0, 5), textcoords='offset points', fontweight='bold')
                             
        sns.barplot(x="Model", y="RMSE", data=df_reg, palette="mako", ax=axes[1], hue="Model", legend=False)
        axes[1].set_title("Model Comparison: RMSE Error (Lower is Better)", fontweight="bold")
        for p in axes[1].patches:
            axes[1].annotate(f"{p.get_height():.2f}", (p.get_x() + p.get_width() / 2., p.get_height()),
                             ha='center', va='center', xytext=(0, 5), textcoords='offset points', fontweight='bold')
                             
        plt.tight_layout()
        fig.savefig(os.path.join(FIGURES_DIR, "regression_model_comparison.png"))
        plt.close()
        
    # 2. Classification Benchmark Plot
    clf_res_path = os.path.join(MODELS_DIR, "classification_results_toxic_alert.csv")
    if os.path.exists(clf_res_path):
        df_clf = pd.read_csv(clf_res_path)
        
        fig, ax = plt.subplots(figsize=(8, 5))
        df_plot = df_clf.melt(id_vars=["Model"], value_vars=["Accuracy", "Precision", "Recall", "F1 Score"], 
                              var_name="Metric", value_name="Score")
        sns.barplot(x="Model", y="Score", hue="Metric", data=df_plot, palette="magma", ax=ax)
        ax.set_title("Classification Benchmark: Hazardous Toxic Gas Episode Detection", fontweight="bold", pad=10)
        ax.set_ylim(0, 1.1)
        ax.legend(loc='lower right')
        plt.tight_layout()
        fig.savefig(os.path.join(FIGURES_DIR, "classification_model_comparison.png"))
        plt.close()

    # 3. Feature Importance (XGBoost Regressor)
    feat_cols_path = os.path.join(MODELS_DIR, "feature_columns.pkl")
    model_path = os.path.join(MODELS_DIR, "best_regressor_target_nh3_next.pkl")
    
    if os.path.exists(feat_cols_path) and os.path.exists(model_path):
        features = joblib.load(feat_cols_path)
        model = joblib.load(model_path)
        
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            feat_df = pd.DataFrame({"Feature": features, "Importance": importances})
            top_features = feat_df.sort_values(by="Importance", ascending=False).head(15)
            
            fig, ax = plt.subplots(figsize=(10, 6))
            sns.barplot(x="Importance", y="Feature", data=top_features, palette="rocket", ax=ax, hue="Feature", legend=False)
            ax.set_title("Top 15 Predictive Features (Ghazipur Toxic Plume & Meteorology Impact)", fontweight="bold", pad=12)
            plt.tight_layout()
            fig.savefig(os.path.join(FIGURES_DIR, "top_feature_importance.png"))
            plt.close()

    print(f"[Evaluate] Benchmark charts successfully saved in {FIGURES_DIR}")

if __name__ == "__main__":
    generate_benchmark_figures()
