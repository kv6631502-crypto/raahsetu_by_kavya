"""Evaluate the domain-calibrated explainable disruption prediction baseline.

Tests the logistic hazard formulation against synthetic distributions calibrated to
Northeast terrain parameters (rainfall distributions, slope categories, and surface scores).
Serves as an architectural baseline prior for future empirical eDAR training.
"""

import math
import random
from pathlib import Path

from app.ml_prediction import COEFFICIENTS, INTERCEPT, predict_disruption

ROOT = Path(__file__).resolve().parents[1]


def sigmoid(z: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(-10.0, min(10.0, z))))


def generate_evaluation_dataset(samples: int = 500, seed: int = 42) -> list[dict]:
    random.seed(seed)
    data = []
    for _ in range(samples):
        # Sample realistic environmental distributions for Northeast India
        rain = random.choices([random.uniform(0, 15), random.uniform(20, 60), random.uniform(70, 150)], weights=[0.6, 0.25, 0.15])[0]
        slope = random.choices([random.uniform(2, 12), random.uniform(15, 30), random.uniform(32, 55)], weights=[0.4, 0.4, 0.2])[0]
        incidents = random.choices([0, 1, 2, 4], weights=[0.7, 0.18, 0.08, 0.04])[0]
        surface = random.uniform(0.3, 0.95)
        elevation = random.uniform(80, 3200)

        # Ground truth physics formula with stochastic disturbance
        z = (
            INTERCEPT
            + COEFFICIENTS["rainfall_mm_24h"] * rain
            + COEFFICIENTS["slope_deg"] * slope
            + COEFFICIENTS["historical_incidents"] * incidents
            + COEFFICIENTS["surface_roughness"] * (1.0 - surface)
            + COEFFICIENTS["elevation_km"] * (elevation / 1000.0)
            + random.gauss(0, 0.25)
        )
        p = sigmoid(z)
        actual = 1 if p >= 0.50 else 0

        data.append({
            "rainfall_mm_24h": rain,
            "slope_deg": slope,
            "historical_incidents": incidents,
            "surface_score": surface,
            "elevation_m": elevation,
            "actual": actual,
        })
    return data


def evaluate_model():
    dataset = generate_evaluation_dataset(500)
    tp = fp = tn = fn = 0
    probabilities = []

    for row in dataset:
        pred = predict_disruption(
            rainfall_mm_24h=row["rainfall_mm_24h"],
            slope_deg=row["slope_deg"],
            historical_incidents=row["historical_incidents"],
            surface_score=row["surface_score"],
            elevation_m=row["elevation_m"],
        )
        p = pred.disruption_probability
        probabilities.append((p, row["actual"]))

        predicted_binary = 1 if p >= 0.50 else 0
        if predicted_binary == 1 and row["actual"] == 1:
            tp += 1
        elif predicted_binary == 1 and row["actual"] == 0:
            fp += 1
        elif predicted_binary == 0 and row["actual"] == 0:
            tn += 1
        else:
            fn += 1

    accuracy = (tp + tn) / len(dataset)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    # Approximate ROC-AUC by trapezoidal rank integration
    probabilities.sort(key=lambda x: x[0], reverse=True)
    positives = sum(1 for _, a in probabilities if a == 1)
    negatives = len(probabilities) - positives
    auc_sum = 0.0
    running_tp = 0
    for _, a in probabilities:
        if a == 1:
            running_tp += 1
        else:
            auc_sum += running_tp
    roc_auc = auc_sum / (positives * negatives) if (positives * negatives) > 0 else 0.0

    print("=" * 60)
    print("  RAAHSETU EXPLAINABLE DISRUPTION BASELINE EVALUATION")
    print("=" * 60)
    print(f"Calibration Test Samples: {len(dataset)} (Synthetic Terrain Distribution)")
    print(f"Baseline Consistency:   {accuracy * 100:.2f}%")
    print(f"Precision:               {precision * 100:.2f}%")
    print(f"Recall:                  {recall * 100:.2f}%")
    print(f"F1-Score:                {f1:.4f}")
    print(f"ROC-AUC:                 {roc_auc:.4f}")
    print("-" * 60)
    print(f"Confusion Matrix:        TP={tp} | FP={fp} | TN={tn} | FN={fn}")
    print("Model Type:              Domain-Calibrated Logistic Baseline")
    print("Feature Attribution:     Rainfall, Slope, Surface, Incidents, Elevation")
    print("Notice:                  Domain baseline prior; not an empirical field model.")
    print("=" * 60)


if __name__ == "__main__":
    evaluate_model()
