"""
Slope Sentinel — Mock Backend Server
FastAPI server providing simulated telemetry data and risk computation.
Supports both Legacy Heuristic and PIML Cascade modes.
"""

import random
import math
import json
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="Slope Sentinel API",
    description="Mock backend for landslide early warning prototype",
    version="0.2.0",
)

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Models ----------

class SimulationInput(BaseModel):
    rainfall: float  # mm/hr (0-200)
    soilMoisture: float  # % (0-100)


class TelemetryReading(BaseModel):
    station: str
    timestamp: str
    rainfall_intensity: float
    seepage_risk: float
    ground_tilt: float
    confidence_index: float
    risk_band: str


class SimulationResult(BaseModel):
    riskScore: float
    riskBand: str
    factorOfSafety: float = 1.0
    heatmapGeoJSON: dict


class PimlInput(BaseModel):
    temperature: float       # °C (-10 to 50)
    humidity: float          # % (0 to 100)
    slopeAngle: float        # degrees (15 to 60)
    elevation: float = 1500.0 # meters (200 to 3000)
    soilCohesion: float = 25.0 # kPa (5 to 50)
    ndvi: float = 0.5        # vegetation index (0.2 to 0.8)
    deforestation: float = 0.0 # % (0 to 100)


class RainfallPrediction(BaseModel):
    horizon: str             # "+6h", "+12h", "+24h"
    predicted_mm_hr: float


class PimlResult(BaseModel):
    predictedRainfall: List[RainfallPrediction]
    riskScore: float
    riskBand: str
    heatmapGeoJSON: dict
    factorOfSafety: float = 1.0


# ---------- Legacy Risk Computation ----------

def compute_risk(rainfall: float, soil_moisture: float) -> dict:
    """
    Physics-inspired risk computation.
    Combines rainfall intensity and soil moisture saturation to estimate
    a simplified Factor of Safety (FoS) and risk score.
    """
    # Normalize inputs
    r_norm = min(rainfall / 200.0, 1.0)
    s_norm = min(soil_moisture / 100.0, 1.0)

    # Factor of Safety estimation (simplified Mohr-Coulomb inspired)
    # FoS = base_strength / (gravitational_load + water_pressure)
    base_strength = 2.5  # Nominal cohesion factor
    gravity_load = 1.0
    water_pressure = r_norm * 1.2 + s_norm * 0.8

    fos = base_strength / (gravity_load + water_pressure)
    fos = round(max(0.3, min(3.0, fos)), 2)

    # Risk score (0-100, higher = more dangerous)
    risk_score = max(0, min(100,
        (r_norm ** 1.3) * 60 + (s_norm ** 1.2) * 40
    ))
    risk_score = round(risk_score, 1)

    # Risk band classification
    if risk_score < 30:
        risk_band = "LOW"
    elif risk_score < 60:
        risk_band = "MODERATE"
    elif risk_score < 85:
        risk_band = "HIGH"
    else:
        risk_band = "CRITICAL"

    return {
        "riskScore": risk_score,
        "riskBand": risk_band,
        "factorOfSafety": fos,
    }


# ---------- PIML Cascade Computation ----------

def predict_rainfall(temperature: float, humidity: float) -> List[dict]:
    """
    Stage 1 — Atmospheric Transformer (mock).
    Uses a physics-inspired dew-point / humidity saturation curve to
    predict rainfall intensity at +6h, +12h, and +24h horizons.

    Key physics:
      - Clausius-Clapeyron: saturated vapor pressure doubles every ~10°C
      - Rainfall probability rises sharply above ~70% RH
      - Warmer air holds more moisture → heavier potential rainfall
    """
    # Saturated vapor pressure (simplified Tetens formula, hPa)
    es = 6.112 * math.exp((17.67 * temperature) / (temperature + 243.5)) if temperature > -40 else 0.5
    # Actual vapor pressure
    ea = es * (humidity / 100.0)
    # Dew point depression (lower → closer to condensation)
    dew_depression = max(0, temperature - (243.5 * math.log(ea / 6.112)) / (17.67 - math.log(ea / 6.112))) if ea > 0.1 else 30.0

    # Base rainfall potential: exponential rise as humidity → 100%
    humidity_norm = min(humidity / 100.0, 1.0)
    base_potential = 200.0 * (humidity_norm ** 3.5)  # max ~200 mm/hr at 100% RH

    # Temperature amplification (warmer air → more moisture capacity)
    temp_factor = max(0.1, 0.3 + 0.7 * min(max((temperature + 10) / 60.0, 0), 1.0))

    # Rainfall at different horizons (accumulating risk over time)
    r_6h = round(min(200, base_potential * temp_factor * 0.5), 1)
    r_12h = round(min(200, base_potential * temp_factor * 0.75), 1)
    r_24h = round(min(200, base_potential * temp_factor * 1.0), 1)

    return [
        {"horizon": "+6h", "predicted_mm_hr": r_6h},
        {"horizon": "+12h", "predicted_mm_hr": r_12h},
        {"horizon": "+24h", "predicted_mm_hr": r_24h},
    ]


def compute_piml_risk(
    predicted_rainfall_24h: float,
    slope_angle: float,
    elevation: float = 1500.0,
    soil_cohesion: float = 25.0,
    ndvi: float = 0.5,
    deforestation: float = 0.0,
) -> dict:
    """
    Stage 2 — Multi-Factor XGBoost Landslide Risk Model.
    Directly fuses the 7 environmental & geotechnical inputs without FoS:
      1. Predicted rainfall (+24h)
      2. Slope angle
      3. Elevation
      4. Soil properties (cohesion)
      5. NDVI vegetation cover
      6. Deforestation / Land cover change
      7. Historical landslide data prior (127 events)
    """
    # 1. Predicted Rainfall intensity feature (0–200 mm/hr)
    r_norm = min(predicted_rainfall_24h / 200.0, 1.0)
    rain_feature = r_norm ** 1.2

    # 2. Slope angle feature (15°–60°)
    slope_norm = min(max((slope_angle - 15.0) / 45.0, 0.0), 1.0)
    slope_feature = slope_norm ** 1.1

    # 3. Elevation feature (200m–3000m)
    elev_norm = min(max((elevation - 200.0) / 2800.0, 0.0), 1.0)

    # 4. Soil cohesion (5–50 kPa; lower cohesion = higher vulnerability)
    soil_norm = min(max((50.0 - soil_cohesion) / 45.0, 0.0), 1.0)

    # 5. NDVI vegetation cover (0.2–0.8; lower NDVI = barren slope)
    veg_norm = min(max((0.8 - ndvi) / 0.6, 0.0), 1.0)

    # 6. Deforestation (0–100%; higher loss = higher vulnerability)
    deforest_norm = min(max(deforestation / 100.0, 0.0), 1.0)

    # 7. Historical landslide data prior (spatial recurrence baseline for NH-29 corridor, 127 events)
    history_prior = 0.45

    # Multi-factor gradient boosting logit combination
    logit = (
        rain_feature * 3.2
        + slope_feature * 2.6
        + soil_norm * 1.8
        + deforest_norm * 1.6
        + elev_norm * 1.2
        + veg_norm * 1.1
        + history_prior * 0.8
        - 3.4  # model calibration bias
    )

    # Sigmoid activation mapping logit to Landslide Probability (0–100%)
    probability = 1.0 / (1.0 + math.exp(-logit))
    risk_score = round(min(100.0, max(0.0, probability * 100.0)), 1)

    # Risk band classification
    if risk_score < 30:
        risk_band = "LOW"
    elif risk_score < 60:
        risk_band = "MODERATE"
    elif risk_score < 85:
        risk_band = "HIGH"
    else:
        risk_band = "CRITICAL"

    return {
        "riskScore": risk_score,
        "riskBand": risk_band,
        "factorOfSafety": 1.0,
    }


def generate_heatmap_geojson(rainfall: float, soil_moisture: float) -> dict:
    """
    Generate a GeoJSON FeatureCollection of risk zones along NH-29 corridor.
    """
    intensity = (rainfall / 200) * 0.6 + (soil_moisture / 100) * 0.4

    vulnerable_zones = [
        {"lat": 25.6820, "lng": 93.7500, "factor": 1.2},
        {"lat": 25.7000, "lng": 93.7800, "factor": 1.5},
        {"lat": 25.7200, "lng": 93.8050, "factor": 0.8},
        {"lat": 25.7500, "lng": 93.8300, "factor": 1.8},
        {"lat": 25.7750, "lng": 93.8560, "factor": 1.0},
    ]

    features = []
    for zone in vulnerable_zones:
        num_points = int(3 + intensity * 15 * zone["factor"])
        spread = 0.005 + intensity * 0.015 * zone["factor"]

        for _ in range(num_points):
            lat = zone["lat"] + (random.random() - 0.5) * spread * 2
            lng = zone["lng"] + (random.random() - 0.5) * spread * 2
            point_intensity = min(1.0, intensity * (0.5 + random.random() * 0.5) * zone["factor"])

            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [round(lng, 6), round(lat, 6)]
                },
                "properties": {
                    "intensity": round(point_intensity, 3),
                    "radius": round(6 + point_intensity * (4 + rainfall / 200 * 12), 1),
                }
            })

    return {
        "type": "FeatureCollection",
        "features": features,
    }


def generate_piml_heatmap_geojson(predicted_rainfall: float, slope_angle: float, ndvi: float) -> dict:
    """
    Generate heatmap GeoJSON for PIML mode using predicted rainfall
    and geospatial parameters instead of raw sensor readings.
    """
    r_norm = min(predicted_rainfall / 200.0, 1.0)
    slope_norm = min(slope_angle / 60.0, 1.0)
    veg_penalty = max(0, 1.0 - ((ndvi - 0.2) / 0.6))
    intensity = r_norm * 0.5 + slope_norm * 0.3 + veg_penalty * 0.2

    vulnerable_zones = [
        {"lat": 25.6820, "lng": 93.7500, "factor": 1.2},
        {"lat": 25.7000, "lng": 93.7800, "factor": 1.5},
        {"lat": 25.7200, "lng": 93.8050, "factor": 0.8},
        {"lat": 25.7500, "lng": 93.8300, "factor": 1.8},
        {"lat": 25.7750, "lng": 93.8560, "factor": 1.0},
    ]

    features = []
    for zone in vulnerable_zones:
        num_points = int(3 + intensity * 15 * zone["factor"])
        spread = 0.005 + intensity * 0.015 * zone["factor"]

        for _ in range(num_points):
            lat = zone["lat"] + (random.random() - 0.5) * spread * 2
            lng = zone["lng"] + (random.random() - 0.5) * spread * 2
            point_intensity = min(1.0, intensity * (0.5 + random.random() * 0.5) * zone["factor"])

            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [round(lng, 6), round(lat, 6)]
                },
                "properties": {
                    "intensity": round(point_intensity, 3),
                    "radius": round(6 + point_intensity * (4 + r_norm * 12), 1),
                }
            })

    return {
        "type": "FeatureCollection",
        "features": features,
    }


# ---------- Endpoints ----------

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "slope-sentinel-backend", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/telemetry", response_model=TelemetryReading)
def get_telemetry():
    """Return simulated sensor readings for NH-10 Sector A."""
    rainfall = round(12.4 + (random.random() - 0.5) * 6, 1)
    seepage = round(18.7 + (random.random() - 0.5) * 8, 1)
    tilt = round(0.03 + (random.random() - 0.5) * 0.02, 3)
    confidence = round(min(99, max(80, 94 + (random.random() - 0.5) * 6)), 1)

    if confidence >= 85:
        band = "LOW"
    elif confidence >= 60:
        band = "MODERATE"
    elif confidence >= 35:
        band = "HIGH"
    else:
        band = "CRITICAL"

    return TelemetryReading(
        station="NH-10 Sector A",
        timestamp=datetime.utcnow().isoformat(),
        rainfall_intensity=rainfall,
        seepage_risk=seepage,
        ground_tilt=tilt,
        confidence_index=confidence,
        risk_band=band,
    )


@app.post("/api/simulate", response_model=SimulationResult)
def run_simulation(data: SimulationInput):
    """Legacy mode: Accept slider values and return computed risk + heatmap GeoJSON."""
    risk = compute_risk(data.rainfall, data.soilMoisture)
    heatmap = generate_heatmap_geojson(data.rainfall, data.soilMoisture)

    return SimulationResult(
        riskScore=risk["riskScore"],
        riskBand=risk["riskBand"],
        factorOfSafety=risk["factorOfSafety"],
        heatmapGeoJSON=heatmap,
    )


@app.post("/api/piml-simulate", response_model=PimlResult)
def run_piml_simulation(data: PimlInput):
    """
    PIML Cascade mode: Run two-stage prediction pipeline.
    Stage 1: Atmospheric Transformer predicts rainfall from temp + humidity.
    Stage 2: Geotechnical XGBoost computes FoS-informed failure probability.
    """
    # Stage 1: Predict rainfall
    rainfall_predictions = predict_rainfall(data.temperature, data.humidity)
    predicted_24h = rainfall_predictions[2]["predicted_mm_hr"]  # +24h horizon

    # Stage 2: Compute multi-factor risk
    risk = compute_piml_risk(
        predicted_rainfall_24h=predicted_24h,
        slope_angle=data.slopeAngle,
        elevation=data.elevation,
        soil_cohesion=data.soilCohesion,
        ndvi=data.ndvi,
        deforestation=data.deforestation,
    )

    # Generate heatmap using PIML parameters
    heatmap = generate_piml_heatmap_geojson(predicted_24h, data.slopeAngle, data.ndvi)

    return PimlResult(
        predictedRainfall=[
            RainfallPrediction(horizon=r["horizon"], predicted_mm_hr=r["predicted_mm_hr"])
            for r in rainfall_predictions
        ],
        riskScore=risk["riskScore"],
        riskBand=risk["riskBand"],
        heatmapGeoJSON=heatmap,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
