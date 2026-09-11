# 🏔️ Slope Sentinel — AI-Powered Landslide Early Warning System (LEWS)

> **Smart India Hackathon (SIH) 2026 Prototype**  
> An end-to-end Early Warning System fusing **Time-Series Transformer Pre-Rainfall Forecasting** with **Multi-Factor Machine Learning (XGBoost / LightGBM)** and **Interactive Web GIS** to predict slope failures before they fracture (Demonstrated on **NH-29 Kohima–Dimapur, Nagaland, North-East India**).

---

## 📑 Table of Contents
1. [Executive Summary & Problem Fit](#-executive-summary--problem-fit)
2. [Key Innovations (Slide 2 Alignment)](#-key-innovations-slide-2-alignment)
3. [The 8-Stage Implementation Workflow (Slides 3 & 5)](#-the-8-stage-implementation-workflow-slides-3--5)
4. [Live Simulation Command Center (50/50 Split Layout)](#-live-simulation-command-center-5050-split-layout)
5. [Multi-Factor Machine Learning Risk Engine (XGBoost / LightGBM)](#-multi-factor-machine-learning-risk-engine-xgboost--lightgbm)
6. [Interactive Web GIS Map & 8 NER State HUD](#-interactive-web-gis-map--8-ner-state-hud)
7. [Feasibility, Risks & Mitigation (Slide 4)](#-feasibility-risks--mitigation-slide-4)
8. [Target Stakeholders & Multi-Dimensional Benefits (Slide 5)](#-target-stakeholders--multi-dimensional-benefits-slide-5)
9. [Technology Stack & Frameworks](#-technology-stack--frameworks)
10. [Repository Folder & File Structure](#-repository-folder--file-structure)
11. [Quick Start & Local Setup](#-quick-start--local-setup)
12. [Hackathon Viva & Presentation Pitch Sheet](#-hackathon-viva--presentation-pitch-sheet)

---

## ⚡ Executive Summary & Problem Fit

Mountainous regions in **North-East India (NER)**—such as Nagaland, Sikkim, Meghalaya, and Assam—face catastrophic monsoon landslides that sever strategic highways (e.g., **NH-29** and **NH-10**), isolate communities, and cause tragic loss of life.

### Traditional Early Warning Flaws:
* **Reactive & Blunt:** Conventional systems rely purely on static, delayed rainfall gauge thresholds *after* heavy downpours have already saturated the mountain.
* **Lack of Geospatial Context:** They treat entire districts uniformly, ignoring local slope angles, elevation gradients, deforestation, and soil shear resistance.

### The Slope Sentinel Solution:
Slope Sentinel introduces a **modular, two-stage early-warning framework**:
1. **Pre-Rainfall Intelligence:** Uses ambient temperature and relative humidity time-series data with a **Transformer model** to estimate rainfall probability **6, 12, and 24 hours in advance**—giving authorities vital pre-storm lead time.
2. **Context-Aware Risk Prediction:** Fuses predicted rainfall with digital elevation models (**Slope Angle**, **Elevation**), soil properties (**Cohesion $c'$**), satellite vegetation (**NDVI**), **Deforestation / Land Cover Change**, and **Historical Landslide Records** via **XGBoost / LightGBM** to compute localized 0–100% failure probabilities.

---

## 💡 Key Innovations (Slide 2 Alignment)

| Innovation Pillar | Computational Pipeline | Strategic Impact |
|---|---|---|
| **Pre-Rainfall Intelligence** | $\text{Temp} + \text{Humidity} \xrightarrow{\text{Transformer (Time-Series ML)}} P(\text{Rainfall in 6/12/24h})$ | Extends evacuation lead time hours before precipitation actually begins. |
| **Context-Aware Risk** | $\text{Rain} + \text{Terrain} + \text{Vegetation} + \text{History} \xrightarrow{\text{XGBoost / LightGBM}} P(\text{Failure})$ | Replaces blunt rainfall thresholds with physics-guided, multi-factor machine learning. |
| **Measurable Early Warning** | $\text{Increased Lead Time} + \text{Higher F1-Score} + \text{Lower False Alarms}$ | Prevents false alarm fatigue while providing reliable, verified emergency alerts. |

---

## 🔄 The 8-Stage Implementation Workflow (Slides 3 & 5)

The platform is structured into a perfectly symmetrical **8-stage end-to-end workflow (4 × 2 Grid)**:

```
┌───────────────────────────────────────  DATA & AI PIPELINE  ───────────────────────────────────────┐
│ [01] Data Collection  ➔  [02] Data Preprocessing  ➔  [03] Rainfall Prediction  ➔  [04] Landslide Risk     │
│      (Multi-Source)            (Cleaning & Fusion)           (Transformer ML)            (XGBoost / LightGBM) │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                  ▼
┌────────────────────────────────────  ACTION & RESILIENCE PIPELINE  ─────────────────────────────────┐
│ [05] Risk Mapping     ➔  [06] Alert Dissemination  ➔  [07] Continuous Testing  ➔  [08] Safer Communities  │
│      (Web GIS Dashboard)       (Multi-Channel Broadcast)     (Model Updates)             (Disaster Resilience)│
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Stage 1 — Data Collection (`Multi-Source Telemetry`):**
   * *Atmospheric:* Real-time and historical ambient temperature and relative humidity.
   * *Terrain & Geospatial:* Slope angle, elevation (DEM), soil geology, shear strength.
   * *Land Cover & Vegetation:* Satellite NDVI vegetation index, deforestation / land cover changes.
   * *Historical Records:* Past landslide occurrence catalog (e.g., 127 events along NH-29).
2. **Stage 2 — Data Preprocessing (`Cleaning & Fusion`):**
   * Missing value imputation, outlier filtering, feature normalization, and spatio-temporal alignment across satellite intervals and ground stations.
3. **Stage 3 — Rainfall Prediction (`Transformer (Time-Series ML)`):**
   * Evaluates atmospheric humidity saturation and vapor pressure dynamics to forecast rainfall probability for **+6h**, **+12h**, and **+24h** horizons.
4. **Stage 4 — Landslide Risk Prediction (`XGBoost / LightGBM`):**
   * Combines forecasted rainfall with slope, elevation, soil cohesion, NDVI, deforestation, and historical event frequency into a calibrated 0–100% failure probability.
5. **Stage 5 — Risk Mapping & Visualization (`Web GIS Dashboard`):**
   * Translates ML output into location-specific danger classifications (**Low**, **Medium**, and **High Risk Zones**) on an interactive map.
6. **Stage 6 — Alert Generation & Dissemination (`Multi-Channel Broadcast`):**
   * Dispatches automated alerts via Common Alerting Protocol (**CAP v1.2**), mobile app push, SMS broadcasts, email, and public sirens.
7. **Stage 7 — Testing, Deployment & Monitoring (`Continuous Model Update`):**
   * Benchmarks predictions against historical disaster events and recalibrates model weights in a continuous closed-loop feedback cycle.
8. **Stage 8 — Safer Communities & Action (`Disaster Resilience`):**
   * Empowers district emergency operators (DEOC/NDMA), transport authorities, and local NER residents with actionable lead time for evacuations and proactive highway closures.

---

## 🔬 Live Simulation Command Center (50/50 Split Layout)

The dashboard uses a permanent **50/50 split-screen command center aesthetic** ([Simulation.jsx](file:///c:/Users/ayush/OneDrive/Desktop/LANDSLIDE%20SIH/PROTOTYPE/src/components/Simulation/Simulation.jsx)):
* **Left Panel:** Scrollable parameter controls for Stage 1 (Pre-Rainfall) and Stage 2 (Context-Aware Risk).
* **Right Panel:** Sticky pinned Web GIS Map with instant visual cause-and-effect feedback.

```
┌───────────────────────────────────────────────┬───────────────────────────────────────────────┐
│           LEFT: CONTROL PANEL                 │             RIGHT: PINNED MAP                 │
│                                               │                                               │
│  [ Engine Mode: AI Cascade (ML) / Legacy ]    │  [ GIS VIEW: 🗺️ NH-29 Corridor / 🌍 3D Earth ]│
│                                               │                                               │
│  STAGE 01: Pre-Rainfall Intelligence          │  🛰️ Satellite Imagery (Esri World Imagery)    │
│  • Ambient Temperature (-10°C to 50°C)        │  ⚡ 4-Layer Glowing Highway Polyline          │
│  • Relative Humidity (0% to 100%)             │     (Cyan = Safe ➔ Fiery Red = Critical)      │
│  • Output Chips: +6h, +12h, +24h Prob (%)     │  📍 8 NER State Badges (Sikkim, Assam, etc.)  │
│                                               │  📡 Active Telemetry Beacons (Alpha - Delta)  │
│  AUTO-BIND CONNECTOR ▼                        │  🔥 Dynamic Risk Heatmap Overlays             │
│                                               │                                               │
│  STAGE 02: Context-Aware Risk (XGBoost)       │  [ CRITICAL ALERT BADGES (CAP v1.2) ]         │
│  • Predicted Rain (+24h auto-bound)           │  📱 SMS DISPATCHED  🔊 SIREN ACTIVE           │
│  • Historical Landslide Records (127 events)  │                                               │
│  • Slope (DEM) (15° to 60°)                   │  RISK GAUGE (0 - 100%)                        │
│  • Elevation (DEM) (200m to 3000m)            │  Needle Arc: Low / Medium / High / Critical   │
│  • Soil Cohesion c' (5 to 50 kPa)             │                                               │
│  • Vegetation Cover NDVI (0.20 to 0.80)       │  SYSTEM TELEMETRY TERMINAL                    │
│  • Deforestation % (0% to 100% with tooltip)  │  Live timestamped decision stream             │
└───────────────────────────────────────────────┴───────────────────────────────────────────────┘
```

---

## 🤖 Multi-Factor Machine Learning Risk Engine (XGBoost / LightGBM)

Our system leverages **Multi-Factor Gradient Boosting (XGBoost / LightGBM)** to synthesize multiple real-world data dimensions into a verified **0–100% Landslide Failure Probability**, matching our Smart India Hackathon pipeline:

> [!IMPORTANT]
> **Pure Multi-Factor ML Pipeline (No FoS):**  
> In accordance with our updated SIH 2026 architecture, the empirical Factor of Safety (FoS) calculation has been eliminated. The pipeline directly feeds the **7 core environmental, terrain, and historical features** into the gradient boosting decision logit:
> $$\text{Transformer (Temp + RH)} \longrightarrow \text{Predicted Rainfall (+24h)} \longrightarrow \text{XGBoost (7 Features)} \longrightarrow \text{Landslide Risk Score (0–100\%)}$$

### The 7 Feature Vectors Fed into the XGBoost Model:
1. **Predicted Rainfall (+24h Forecast):** Anticipated precipitation intensity (0–200 mm/hr) auto-bound from the Stage 1 Transformer.
2. **Slope Angle ($15^\circ - 60^\circ$ from DEM):** Quantifies gravitational shear stress along steep hill slopes.
3. **Elevation ($200\text{m} - 3000\text{m}$ from DEM):** Accounts for orographic cloud accumulation and hydraulic potential.
4. **Soil Properties & Shear Resistance ($c'$ $5 - 50\text{ kPa}$):** Represents geological cohesion of regional soils (e.g., weathered Daling/Disang shales).
5. **Vegetation Cover (NDVI $0.20 - 0.80$):** Satellite-derived Normalized Difference Vegetation Index measuring root network tensile reinforcement.
6. **Deforestation & Land Cover Change (LULC $0\% - 100\%$):** Quantifies vegetation removal and slope destabilization along infrastructure corridors.
7. **Historical Landslide Data (Spatial Prior):** Recurrence weighting derived from 127 documented historical failure events (2015–2025).

### Standardized Risk Zone Classification:
* **$0\% - 29\%$ ➔ `Low Risk Zone` (Safe Cyan `#00F0FF`):** Normal baseline conditions; standard routine monitoring.
* **$30\% - 59\%$ ➔ `Medium Risk Zone` (Warning Amber `#FBBF24`):** Elevated risk; enhanced monitoring intervals active.
* **$60\% - 84\%$ ➔ `High Risk Zone` (Alert Orange `#F97316`):** Dangerous conditions; pre-emptive advisories sent to transport authorities.
* **$85\% - 100\%$ ➔ `Critical Risk Zone` (Emergency Red `#EF4444`):** Imminent slope failure; triggers automatic **CAP v1.2** SMS dispatch, public sirens, and evacuation alerts.

---

## 🗺️ Interactive Web GIS Map & 8 NER State HUD

The pinned GIS Map ([GISMap.jsx](file:///c:/Users/ayush/OneDrive/Desktop/LANDSLIDE%20SIH/PROTOTYPE/src/components/Simulation/GISMap.jsx)) provides situational awareness across North-East India:

### 1. 📍 8 North-Eastern Region (NER) State Badges:
Permanent, dark-glassmorphic HUD badges pinned to state geographic coordinates:
* **Sikkim** (`[27.52, 88.50]`)
* **Assam** (`[26.40, 92.50]`)
* **Arunachal Pradesh** (`[28.15, 94.40]`)
* **Nagaland (NH-29)** (`[25.92, 94.28]` highlighted with active radar pulse)
* **Meghalaya** (`[25.40, 91.00]`)
* **Manipur** (`[24.62, 94.12]`)
* **Mizoram** (`[23.15, 92.85]`)
* **Tripura** (`[23.65, 91.45]`)

### 2. ⚡ Highway NH-29 Glowing Vector Corridor:
* 4-layer stacked polyline (wide ambient aura + mid halo + neon core + animated pulse beam) along Kohima–Dimapur.
* Dynamically shifts from **Safe Cyan (`#00F0FF`)** ➔ **Warning Amber (`#FBBF24`)** ➔ **Critical Red (`#FF2A55`)** as risk escalates.

### 3. 🌍 3D Earth Globe Mode:
* Toggle seamlessly into a full **Three.js WebGL 3D Globe** with NASA Blue Marble textures, starfield (2,200 stars), atmospheric glow, and camera transition.

### 4. 🚫 Clean Tactical HUD (Zero Watermarks):
* The Leaflet attribution text at the bottom has been cleanly removed for an uncluttered command-center aesthetic.

---

## 🛡️ Feasibility, Risks & Mitigation (Slide 4)

### Feasibility & Viability:
* **Data Availability:** Readily available weather time-series (IMD), satellite DEM (Copernicus/SRTM), vegetation indices (Sentinel-2 NDVI), and historical landslide inventories support robust model training.
* **Software-Based Prototype:** Built with open-source Python, PyTorch, Scikit-Learn, and React.js without requiring expensive physical sensor deployments for validation.
* **Modular Architecture:** The decoupling of rainfall prediction (Transformer) and slope stability (XGBoost) allows independent testing, benchmarking, and continuous model upgrades.
* **NER Regional Problem Fit:** Targeted specifically at vulnerable Himalayan and Indo-Burma hill corridors (NH-29).

### Challenges & Mitigation Strategies:
1. **Rainfall Prediction Uncertainty ➔ Model Comparison:** Benchmarks the Transformer against LSTM, GRU, and baseline ARIMA models to ensure maximum forecasting accuracy.
2. **Data Gaps & Noise ➔ Multi-Source Data Fusion:** Merges weather radar, ground weather stations, and satellite telemetry to eliminate single-point failure.
3. **Spatio-Temporal Mismatch ➔ Robust Preprocessing:** Handles missing values, normalizes features, and harmonizes differing spatial resolutions through spatio-temporal interpolation.
4. **False Alarm Fatigue ➔ Uncertainty Threshold Tuning:** Calibrated confidence bounds and multi-tier thresholds (Low / Medium / High) protect public trust.
5. **Evolving Terrain ➔ Continuous Model Validation:** Re-evaluates predictions using precision, recall, F1-score, and warning lead time against newly observed events.

---

## 🎯 Target Stakeholders & Multi-Dimensional Benefits (Slide 5)

### Impact on Target Stakeholders:
* **🏘️ NER Communities:** Provides earlier localized warning windows, granting residents vital lead time to evacuate safely.
* **🏛️ Disaster Management Authorities (SDMA / DEOC):** Delivers clear GIS-based risk maps and probability matrices for faster, evidence-based decision-making.
* **🚨 Emergency Responders (NDRF / SDRF):** Prioritizes rescue team deployment and equipment staging based on high-risk zones.
* **🌲 Forest & Environment Departments:** Enables slope vegetation loss and deforestation monitoring for preventive afforestation.
* **🛣️ Infrastructure & Transport Authorities (NHIDCL / BRO):** Highlights vulnerable road sectors for early traffic diversions and rock-fall barrier maintenance.

### Broader Multi-Dimensional Benefits:
* **Social Benefits:** Minimizes loss of human life and protects highland settlements.
* **Economic Benefits:** Prevents long-term supply chain shutdowns along critical lifelines like NH-29.
* **Environmental Benefits:** Incorporates ecological forest preservation into geotechnical stability assessments.
* **Technological Benefits:** Demonstrates modern combination of Time-Series Transformers, Gradient Boosting, and Web GIS.
* **Research Benefits:** Quantifies the measurable gain in warning lead time compared to conventional post-rain monitoring.

---

## 🛠️ Technology Stack & Frameworks

| Domain | Technology / Library | Role in System |
|---|---|---|
| **Frontend UI** | **React.js (v18+)** | Reactive component-driven dashboard |
| **Animation** | **Framer Motion** | Smooth interactive transitions & entrances |
| **Web GIS Mapping** | **Leaflet & React-Leaflet** | High-performance satellite tile rendering & overlays |
| **3D Graphics** | **Three.js & React Three Fiber** | 3D interactive Earth globe with atmospheric glow |
| **Styling** | **Vanilla CSS (Custom Tokens)** | Ultra-fast, responsive dark-mode glassmorphic HUD |
| **Backend API** | **FastAPI (Python 3.9+)** | High-throughput asynchronous REST calculation engine |
| **AI Engine** | **PyTorch & XGBoost / LightGBM** | Time-Series Transformers & multi-factor classifiers |
| **Data Processing**| **Pandas, NumPy, GeoPandas** | Spatial coordinate reprojection & dataset normalization |
| **Spatial Database**| **PostgreSQL + PostGIS** | Geospatial queries & regional historical catalogs |
| **Dissemination** | **CAP v1.2 Broadcast APIs** | Standardized Common Alerting Protocol SMS & sirens |

---

## 📁 Repository Folder & File Structure

```text
LANDSLIDE SIH/
├── 📁 PROTOTYPE/                      # Primary Working Development Directory
│   ├── 📜 package.json                # Frontend dependencies & build scripts
│   ├── 📜 index.html                  # Main HTML template
│   ├── 📜 tsconfig.json               # TypeScript / React compiler options
│   ├── 📜 PROJECT_EXPLANATION.md      # Comprehensive viva & technical study guide
│   ├── 📜 README.md                   # Complete architectural reference (This file)
│   │
│   ├── 🚀 1-Click Launch Scripts (Windows)
│   │   ├── run_all.bat                # Concurrently launches Vite frontend & FastAPI backend
│   │   ├── run_dashboard.bat          # Launches Vite dev server (http://localhost:5173/)
│   │   └── run_backend.bat            # Launches FastAPI Uvicorn server (http://localhost:8000/)
│   │
│   ├── 🐍 backend/                    # Python Computational Engine
│   │   ├── main.py                    # FastAPI endpoints: Transformer & 7-Feature XGBoost
│   │   └── requirements.txt           # Backend dependencies (fastapi, uvicorn, pydantic)
│   │
│   ├── ⚛️ src/                        # Clean Frontend Application Source
│   │   ├── main.jsx                   # React entry point
│   │   ├── App.jsx                    # Master layout assembler
│   │   ├── index.css                  # Global design tokens (HUD styling & colors)
│   │   │
│   │   └── 🧩 components/
│   │       ├── 🧭 Navbar/             # Top sticky navigation bar & SIH 2026 branding
│   │       ├── ⚡ Hero/               # Headline & live telemetry HUD card
│   │       ├── 💡 Innovation/         # 3 Slide-2 Innovation Cards (Pre-Rain, Context, Lead Time)
│   │       ├── 🔄 Pipeline/           # Symmetrical 8-Stage Implementation Workflow (4 × 2 Grid)
│   │       │
│   │       ├── 🔬 Simulation/         # 50/50 SPLIT COMMAND CENTER (ZERO FoS)
│   │       │   ├── Simulation.jsx     # State coordinator & 7-Factor XGBoost decision engine
│   │       │   ├── ControlPanel.jsx   # Sliders: Temp, Humidity, Slope, Elevation, Cohesion, NDVI, Deforestation
│   │       │   ├── GISMap.jsx         # 2D Satellite map with 8 NER State Badges & NH-29 Corridor
│   │       │   ├── Globe3D.jsx        # 3D Three.js WebGL globe with Nagaland locator beacon
│   │       │   ├── RiskGauge.jsx      # Semicircular SVG needle meter (0-100% Failure Probability)
│   │       │   ├── SystemLog.jsx      # Real-time timestamped terminal feed
│   │       │   └── Simulation.css     # Tactical military/GIS command center stylesheet
│   │       │
│   │       ├── 🛠️ TechStack/          # Frameworks aligned with Slide 3
│   │       ├── 🛡️ Impact/             # Feasibility & Stakeholders aligned with Slides 4 & 5
│   │       └── 📑 Footer/             # SIH prototype credits & copyright notice
│   │
│   └── 📦 archive/                    # Archived legacy backups, themes & discarded experiments
│
└── 📁 SLOPE_SENTINEL_FINAL/           # Clean Standalone Final Code Package (Export / Submission)
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **Python** (v3.9 or higher)

### Method 1: 1-Click Launch (Windows)
Simply double-click:
```bash
run_all.bat
```
This automatically starts both the React frontend and the Python backend in parallel.

### Method 2: Manual Terminal Launch

**1. Start the React Frontend:**
```bash
# In the PROTOTYPE root directory:
npm install
npm run dev
```
Open **`http://localhost:5173/`** (or **`http://localhost:5174/`**) in your browser.

**2. Start the Python Backend (Optional for standalone mock mode):**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Interactive Swagger API documentation: **`http://localhost:8000/docs`**.

---

## 🏆 Hackathon Viva & Presentation Pitch Sheet

### 30-Second Elevator Pitch:
> *"Respected Judges, current landslide warning systems are dangerously reactive—they only measure rain after it pours down. Slope Sentinel fundamentally shifts this paradigm. For vulnerable highways like NH-29 in North-East India, our two-stage pipeline first uses a Time-Series Transformer to forecast rainfall 6 to 24 hours in advance, then feeds this into an XGBoost/LightGBM classifier combining slope, elevation, soil cohesion, deforestation, and historical events. This gives district authorities verifiable evacuation lead times before slopes fracture."*

### Key Viva Q&A Quick Answers:
* **Q: Why separate rainfall prediction from landslide risk?**  
  *A: Modularity. Meteorological dynamics follow atmospheric time-series laws (best suited for Transformers), while geotechnical failure follows shear resistance and spatial terrain laws (best suited for Gradient Boosting).*
* **Q: How does the Multi-Factor ML model predict landslide risk?**  
  *A: The system uses an XGBoost/LightGBM classifier combining forecasted rainfall from the Transformer with terrain slope, elevation, soil cohesion, NDVI vegetation, deforestation, and historical landslide data to output a calibrated 0–100% landslide failure probability categorized into Low, Medium, High, and Critical Risk Zones.*
* **Q: How does deforestation affect landslide risk?**  
  *A: Deforestation removes root tensile reinforcement, degrading natural soil cohesion and accelerating rainfall infiltration, making steep slopes significantly more vulnerable to failure.*
* **Q: How do alerts reach remote areas when mobile networks fail?**  
  *A: The system supports Common Alerting Protocol (CAP v1.2) payloads dispatched over multi-channel emergency broadcast networks, offline DEOC local caches, SMS, and solar-powered siren hubs.*

---
© 2026 **Slope Sentinel** — Built for Smart India Hackathon (SIH 2026).
