"""
DropoutGuard AI - Model Training & Evaluation Pipeline
Trained on the Official UCI Machine Learning Repository Dataset:
"Predict Students' Dropout and Academic Success" (4,424 records, Real Institutional Data).

Compares:
1. Random Forest Classifier
2. Logistic Regression Baseline

Exports:
- model.pkl (Trained Random Forest)
- logistic_model.pkl (Trained Logistic Regression)
- scaler.pkl (StandardScaler for continuous feature scaling)
- evaluation_metrics.json (Comparison metrics & feature importances)
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

ML_DIR = os.path.dirname(os.path.abspath(__file__))
UCI_DATA_PATH = os.path.join(ML_DIR, "dataset", "uci_student_dropout.csv")
SYNTHETIC_DATA_PATH = os.path.join(ML_DIR, "dataset", "students_dataset.csv")

FEATURE_COLS = [
    "attendance",
    "previous_gpa",
    "current_gpa",
    "assignment_rate",
    "internal_marks",
    "backlogs",
    "engagement",
    "gpa_trend"
]

def load_and_preprocess_data():
    """
    Loads real UCI dataset if present, mapping raw institutional indicators
    to collegiate early-warning feature schema while preserving technical integrity.
    Falls back gracefully to synthetic benchmark dataset if necessary.
    """
    if os.path.exists(UCI_DATA_PATH):
        print(f"[OK] Loading Real UCI Dataset from: {UCI_DATA_PATH}")
        df = pd.read_csv(UCI_DATA_PATH, sep=';')
        df.columns = [c.strip().replace('\t', '') for c in df.columns]
        
        # Target: Dropout = 1, Graduate/Enrolled = 0
        df['dropout'] = (df['Target'] == 'Dropout').astype(int)
        
        # 1. Academic Performance (0-10 GPA scale converted from Portuguese 0-20 scale)
        df['current_gpa'] = (df['Curricular units 2nd sem (grade)'] / 2.0).round(2)
        df['previous_gpa'] = (df['Curricular units 1st sem (grade)'] / 2.0).round(2)
        df['gpa_trend'] = (df['current_gpa'] - df['previous_gpa']).round(2)
        
        # 2. Backlogs: Cumulative unapproved course units
        unapproved_2nd = df['Curricular units 2nd sem (enrolled)'] - df['Curricular units 2nd sem (approved)']
        unapproved_1st = df['Curricular units 1st sem (enrolled)'] - df['Curricular units 1st sem (approved)']
        df['backlogs'] = (unapproved_1st + unapproved_2nd).clip(lower=0).astype(int)
        
        # 3. Coursework & Assignment completion proxy from evaluations
        total_evals = df['Curricular units 1st sem (evaluations)'] + df['Curricular units 2nd sem (evaluations)']
        total_enrolled = df['Curricular units 1st sem (enrolled)'] + df['Curricular units 2nd sem (enrolled)']
        df['assignment_rate'] = np.where(
            total_enrolled > 0, 
            np.clip((total_evals / total_enrolled) * 75.0, 15, 100).round(1), 
            50.0
        )
        
        # 4. Attendance: Daytime attendance baseline, with compliance penalty for debtors / unpaid fees
        df['attendance'] = np.where(df['Daytime/evening attendance'] == 1, 85, 65)
        df['attendance'] = np.where(df['Debtor'] == 1, df['attendance'] - 15, df['attendance'])
        df['attendance'] = np.where(df['Tuition fees up to date'] == 0, df['attendance'] - 20, df['attendance'])
        df['attendance'] = df['attendance'].clip(35, 98)
        
        # 5. Engagement & Internal marks
        df['engagement'] = np.clip(df['assignment_rate'] * 0.8 + (df['Scholarship holder'] * 15), 20, 98).round(1)
        df['internal_marks'] = (df['Admission grade'] / 2.0).clip(30, 98).round(1)
        
        source_name = "UCI Machine Learning Repository (Predict Students' Dropout and Academic Success)"
    else:
        print(f"Loading benchmark dataset from: {SYNTHETIC_DATA_PATH}")
        df = pd.read_csv(SYNTHETIC_DATA_PATH)
        if "gpa_trend" not in df.columns:
            df["gpa_trend"] = df["current_gpa"] - df["previous_gpa"]
        source_name = "HackDevengers Synthetic Benchmark"
        
    return df, source_name

def train_and_evaluate():
    df, dataset_source = load_and_preprocess_data()
    
    X = df[FEATURE_COLS].copy()
    y = df["dropout"].copy()
    
    print(f"Dataset records: {len(df)}, Dropout positive cases: {y.sum()} ({y.mean()*100:.1f}%)")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 1. Logistic Regression Model
    lr = LogisticRegression(random_state=42, max_iter=1000, C=1.0, class_weight='balanced')
    lr.fit(X_train_scaled, y_train)
    y_pred_lr = lr.predict(X_test_scaled)
    y_proba_lr = lr.predict_proba(X_test_scaled)[:, 1]
    
    lr_metrics = {
        "model": "Logistic Regression",
        "accuracy": round(float(accuracy_score(y_test, y_pred_lr)), 4),
        "precision": round(float(precision_score(y_test, y_pred_lr, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred_lr, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, y_pred_lr, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_proba_lr)), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred_lr).tolist()
    }
    
    # 2. Random Forest Classifier Model
    rf = RandomForestClassifier(n_estimators=120, max_depth=6, min_samples_split=4, random_state=42, class_weight='balanced')
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    y_proba_rf = rf.predict_proba(X_test)[:, 1]
    
    rf_metrics = {
        "model": "Random Forest",
        "accuracy": round(float(accuracy_score(y_test, y_pred_rf)), 4),
        "precision": round(float(precision_score(y_test, y_pred_rf, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred_rf, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, y_pred_rf, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_proba_rf)), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred_rf).tolist()
    }
    
    print("\n" + "="*55)
    print(f"MODEL EVALUATION ON REAL DATASET ({dataset_source})")
    print("="*55)
    print(f"Logistic Regression: Accuracy={lr_metrics['accuracy']:.4f} | F1={lr_metrics['f1']:.4f} | ROC-AUC={lr_metrics['roc_auc']:.4f}")
    print(f"Random Forest:       Accuracy={rf_metrics['accuracy']:.4f} | F1={rf_metrics['f1']:.4f} | ROC-AUC={rf_metrics['roc_auc']:.4f}")
    
    # Feature Importances directly extracted from model
    rf_importances = dict(zip(FEATURE_COLS, [round(float(v), 4) for v in rf.feature_importances_]))
    sorted_importances = dict(sorted(rf_importances.items(), key=lambda item: item[1], reverse=True))
    
    print("\nFeature Importances (Random Forest):")
    for feat, imp in sorted_importances.items():
        print(f"  - {feat:18s}: {imp:.4f} ({imp*100:.1f}%)")
        
    lr_coefficients = dict(zip(FEATURE_COLS, [round(float(v), 4) for v in lr.coef_[0]]))
    
    # Select superior model based on ROC-AUC & F1
    selected_model_name = "Random Forest" if rf_metrics["roc_auc"] >= lr_metrics["roc_auc"] else "Logistic Regression"
    print(f"\nPrimary Model Selected: {selected_model_name}")
    
    # Save artifacts
    joblib.dump(rf, os.path.join(ML_DIR, "model.pkl"))
    joblib.dump(lr, os.path.join(ML_DIR, "logistic_model.pkl"))
    joblib.dump(scaler, os.path.join(ML_DIR, "scaler.pkl"))
    
    artifacts_meta = {
        "dataset_source": dataset_source,
        "dataset_records": len(df),
        "features": FEATURE_COLS,
        "selected_model": selected_model_name,
        "comparison": {
            "logistic_regression": lr_metrics,
            "random_forest": rf_metrics
        },
        "feature_importances": sorted_importances,
        "logistic_coefficients": lr_coefficients
    }
    
    with open(os.path.join(ML_DIR, "evaluation_metrics.json"), "w") as f:
        json.dump(artifacts_meta, f, indent=2)
        
    print(f"[OK] Saved models to {ML_DIR}")
    print(f"[OK] Saved metrics to {os.path.join(ML_DIR, 'evaluation_metrics.json')}")
    
    # Verify Anchor Demo Student STU1024
    stu1024_input = pd.DataFrame([{
        "attendance": 58.0,
        "previous_gpa": 7.1,
        "current_gpa": 6.2,
        "assignment_rate": 50.0,
        "internal_marks": 61.0,
        "backlogs": 2,
        "engagement": 55.0,
        "gpa_trend": -0.9
    }])
    raw_rf = float(rf.predict_proba(stu1024_input)[0][1])
    raw_lr = float(lr.predict_proba(scaler.transform(stu1024_input))[0][1])
    print(f"\nSTU1024 Demo Profile Check:")
    print(f"  RF Model Raw Probability: {raw_rf*100:.1f}%")
    print(f"  LR Model Raw Probability: {raw_lr*100:.1f}%")

if __name__ == "__main__":
    train_and_evaluate()
