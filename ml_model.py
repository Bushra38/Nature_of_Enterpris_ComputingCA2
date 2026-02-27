import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

FILE_PATH = "machinelearning.csv"  # must be in same folder

# --- robust load (tries tab first, then comma) ---
try:
    df = pd.read_csv(FILE_PATH, sep="\t")
    if len(df.columns) == 1:
        raise ValueError("Looks not tab-separated")
except Exception:
    df = pd.read_csv(FILE_PATH)

# clean column names
df.columns = df.columns.str.strip()

# Keep ONLY the raw columns you actually need
needed = ["Age", "BodyweightKg", "BestSquatKg", "BestBenchKg", "BestDeadliftKg", "TotalKg", "Wilks"]
df = df[[c for c in needed if c in df.columns]].copy()

# Convert to numeric (your CSV has blanks in some rows)
for c in df.columns:
    df[c] = pd.to_numeric(df[c], errors="coerce")

# Drop rows missing target
df = df.dropna(subset=["Wilks"])

# Features + Target
X = df.drop(columns=["Wilks"])
y = df["Wilks"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Linear Regression pipeline (impute missing values + scale + linear regression)
pipe = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", LinearRegression())
])

pipe.fit(X_train, y_train)
pred = pipe.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, pred)
r2 = r2_score(y_test, pred)

print("=== LINEAR REGRESSION (Predict Wilks) ===")
print("Rows used:", len(df))
print("Features:", list(X.columns))
print(f"MAE (Wilks): {mae:.2f}")
print(f"R^2: {r2:.3f}")

# --- CHART 1: Actual vs Predicted ---
plt.figure()
plt.scatter(y_test, pred)
plt.xlabel("Actual Wilks")
plt.ylabel("Predicted Wilks")
plt.title("Actual vs Predicted Wilks (Linear Regression)")
plt.tight_layout()
plt.savefig("actual_vs_predicted.png")
plt.close()
print("Saved chart: actual_vs_predicted.png")

# --- CHART 2: Residuals Histogram ---
residuals = y_test - pred
plt.figure()
plt.hist(residuals, bins=20)
plt.xlabel("Residual (Actual - Predicted)")
plt.ylabel("Count")
plt.title("Residuals Histogram (Linear Regression)")
plt.tight_layout()
plt.savefig("residuals_hist.png")
plt.close()
print("Saved chart: residuals_hist.png")

# --- Sample prediction example ---
sample = X_test.iloc[[0]].copy()
sample_pred = pipe.predict(sample)

print("\nSample input:")
print(sample)
print("Predicted Wilks:", sample_pred)
print("Actual Wilks:", y_test.iloc[0])
# ---------------------------------
# CHART 3: Linear Regression Coefficients
# ---------------------------------

import numpy as np

# Get the trained linear model from the pipeline
linear_model = pipe.named_steps["model"]

# Get feature names
feature_names = X.columns

# Get coefficients
coefficients = linear_model.coef_

coef_df = pd.DataFrame({
    "Feature": feature_names,
    "Coefficient": coefficients
}).sort_values(by="Coefficient")

print("\nLinear Regression Coefficients:")
print(coef_df)

# Plot coefficients
plt.figure()
plt.barh(coef_df["Feature"], coef_df["Coefficient"])
plt.xlabel("Coefficient Value")
plt.title("Linear Regression Feature Coefficients")
plt.tight_layout()
plt.savefig("linear_coefficients.png")
plt.close()

print("Saved chart: linear_coefficients.png")
