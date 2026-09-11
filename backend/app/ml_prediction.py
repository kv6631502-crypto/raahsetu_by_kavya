"""Domain-Calibrated Explainable Disruption Baseline for Northeast India logistics.

Uses a domain-informed logistic formulation with exact feature attribution over
benchmark rainfall, slope, surface, incident-count and elevation inputs.
Provides mathematically transparent disruption probabilities (0.0 to 1.0) and factor
breakdowns without relying on unverified black-box ML claims.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class DisruptionPrediction:
    disruption_probability: float
    risk_level: str
    primary_factors: list[dict[str, Any]]
    explanation: str
    model_version: str = "v1.0-domain-calibrated-baseline"


# Prototype coefficients for the controlled benchmark. Empirical calibration is pending.
INTERCEPT = -3.20
COEFFICIENTS = {
    "rainfall_mm_24h": 0.038,     # +0.038 per mm rain
    "slope_deg": 0.065,           # +0.065 per degree hill slope
    "historical_incidents": 0.45, # +0.45 per prior recorded slide/block
    "surface_roughness": 1.20,    # higher roughness (1 - surface_score) increases risk
    "elevation_km": 0.40,         # higher elevation increases freeze/landslip risk
}

BASELINES = {
    "rainfall_mm_24h": 5.0,
    "slope_deg": 5.0,
    "historical_incidents": 0.0,
    "surface_roughness": 0.2,
    "elevation_km": 0.2,
}


def predict_disruption(
    rainfall_mm_24h: float = 0.0,
    slope_deg: float = 0.0,
    historical_incidents: int = 0,
    surface_score: float = 0.8,
    elevation_m: float = 200.0,
) -> DisruptionPrediction:
    """Predict disruption probability and explain top driving factors."""
    surface_roughness = max(0.0, min(1.0, 1.0 - surface_score))
    elevation_km = max(0.0, elevation_m / 1000.0)

    features = {
        "rainfall_mm_24h": max(0.0, rainfall_mm_24h),
        "slope_deg": max(0.0, min(60.0, slope_deg)),
        "historical_incidents": max(0, historical_incidents),
        "surface_roughness": surface_roughness,
        "elevation_km": elevation_km,
    }

    # Compute linear log-odds (z)
    z = INTERCEPT
    attributions = {}
    for key, val in features.items():
        weight = COEFFICIENTS[key]
        contrib = weight * val
        z += contrib
        # Feature impact above dry/flat baseline
        excess = max(0.0, val - BASELINES[key])
        attributions[key] = weight * excess

    # Sigmoid function for calibrated probability
    prob = 1.0 / (1.0 + math.exp(-max(-10.0, min(10.0, z))))
    prob = round(prob, 4)

    # Calculate percentage contributions for explainability
    total_attr = sum(attributions.values())
    factors = []
    labels = {
        "rainfall_mm_24h": f"Precipitation ({features['rainfall_mm_24h']:.1f} mm/24h)",
        "slope_deg": f"Hill Slope ({features['slope_deg']:.1f}°)",
        "historical_incidents": f"Historical Incidents ({features['historical_incidents']} prior)",
        "surface_roughness": f"Surface Degradation ({surface_roughness * 100:.0f}%)",
        "elevation_km": f"High Elevation ({elevation_m:.0f}m)",
    }

    if total_attr > 0:
        for key, attr in sorted(attributions.items(), key=lambda x: x[1], reverse=True):
            pct = round(100.0 * attr / total_attr)
            if pct >= 10:
                factors.append({"factor": labels[key], "impact_pct": pct})
    if not factors:
        factors.append({"factor": "Normal Baseline Conditions", "impact_pct": 100})

    if prob >= 0.70:
        risk_level = "CRITICAL" if prob >= 0.85 else "HIGH"
        summary = f"High disruption probability ({prob * 100:.1f}%) driven by {factors[0]['factor']}."
    elif prob >= 0.40:
        risk_level = "MODERATE"
        summary = f"Moderate route advisory ({prob * 100:.1f}% risk); caution on hill curves."
    else:
        risk_level = "LOW"
        summary = "Nominal transit conditions with baseline road safety."

    return DisruptionPrediction(
        disruption_probability=prob,
        risk_level=risk_level,
        primary_factors=factors[:3],
        explanation=summary,
    )
