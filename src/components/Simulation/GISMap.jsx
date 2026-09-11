import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import Globe3D from './Globe3D';
import 'leaflet/dist/leaflet.css';

/* 8 North-Eastern Region (NER) state boundary anchor points */
const nerStates = [
  { name: 'Sikkim', code: 'SK', pos: [27.52, 88.50] },
  { name: 'Assam', code: 'AS', pos: [26.40, 92.50] },
  { name: 'Arunachal Pradesh', code: 'AR', pos: [28.15, 94.40] },
  { name: 'Nagaland (NH-29)', code: 'NL', pos: [25.92, 94.28], isPilot: true },
  { name: 'Meghalaya', code: 'ML', pos: [25.40, 91.00] },
  { name: 'Manipur', code: 'MN', pos: [24.62, 94.12] },
  { name: 'Mizoram', code: 'MZ', pos: [23.15, 92.85] },
  { name: 'Tripura', code: 'TR', pos: [23.65, 91.45] },
];

/* Highway NH-29 corridor points (Kohima-Dimapur, Nagaland) */
const corridorPoints = [
  [25.6700, 93.7200],
  [25.6750, 93.7350],
  [25.6820, 93.7500],
  [25.6900, 93.7650],
  [25.7000, 93.7800],
  [25.7100, 93.7920],
  [25.7200, 93.8050],
  [25.7350, 93.8180],
  [25.7500, 93.8300],
  [25.7600, 93.8420],
  [25.7750, 93.8560],
  [25.7900, 93.8700],
];

/* Primary sensor stations (NH-29 corridor — active) */
const sensorStations = [
  { pos: [25.6750, 93.7350], name: 'Station Alpha', sector: 'NH-29 Km 12' },
  { pos: [25.7100, 93.7920], name: 'Station Beta', sector: 'NH-29 Km 28' },
  { pos: [25.7500, 93.8300], name: 'Station Gamma', sector: 'NH-29 Km 45' },
  { pos: [25.7900, 93.8700], name: 'Station Delta', sector: 'NH-29 Km 62' },
];

/* 12 Macro NER sensor markers (standby across North-East India) */
const nerSensors = [
  { pos: [27.3314, 88.6138], name: 'Gangtok-S1', state: 'Sikkim' },
  { pos: [27.1500, 88.5000], name: 'Namchi-S2', state: 'Sikkim' },
  { pos: [26.1445, 91.7362], name: 'Guwahati-S3', state: 'Assam' },
  { pos: [26.7500, 93.8600], name: 'Golaghat-S4', state: 'Assam' },
  { pos: [25.5788, 91.8933], name: 'Shillong-S5', state: 'Meghalaya' },
  { pos: [25.3000, 91.5800], name: 'Cherrapunji-S6', state: 'Meghalaya' },
  { pos: [23.7271, 92.7176], name: 'Aizawl-S7', state: 'Mizoram' },
  { pos: [23.8400, 92.6200], name: 'Lunglei-S8', state: 'Mizoram' },
  { pos: [24.8170, 93.9368], name: 'Imphal-S9', state: 'Manipur' },
  { pos: [23.9408, 91.9882], name: 'Agartala-S10', state: 'Tripura' },
  { pos: [27.1000, 93.6200], name: 'Itanagar-S11', state: 'Arunachal Pradesh' },
  { pos: [27.4800, 94.5600], name: 'Along-S12', state: 'Arunachal Pradesh' },
];

/* Vulnerable zones along the corridor for heatmap */
const vulnerableZones = [
  { center: [25.6820, 93.7500], spreadFactor: 1.2 },
  { center: [25.7000, 93.7800], spreadFactor: 1.5 },
  { center: [25.7200, 93.8050], spreadFactor: 0.8 },
  { center: [25.7500, 93.8300], spreadFactor: 1.8 },
  { center: [25.7750, 93.8560], spreadFactor: 1.0 },
];

function generateHeatPoints(rainfall, soilMoisture) {
  const points = [];
  const intensity = (rainfall / 200) * 0.6 + (soilMoisture / 100) * 0.4;
  
  vulnerableZones.forEach(zone => {
    const numPoints = Math.floor(5 + intensity * 20 * zone.spreadFactor);
    const spread = 0.005 + intensity * 0.015 * zone.spreadFactor;
    
    for (let i = 0; i < numPoints; i++) {
      const lat = zone.center[0] + (Math.random() - 0.5) * spread * 2;
      const lng = zone.center[1] + (Math.random() - 0.5) * spread * 2;
      const pointIntensity = intensity * (0.5 + Math.random() * 0.5) * zone.spreadFactor;
      points.push({ lat, lng, intensity: Math.min(1, pointIntensity) });
    }
  });

  return points;
}

function getHeatColor(intensity) {
  if (intensity < 0.35) return 'rgba(0, 240, 255, 0.7)';
  if (intensity < 0.6) return 'rgba(0, 240, 255, 0.85)';
  if (intensity < 0.8) return 'rgba(255, 77, 77, 0.8)';
  return 'rgba(255, 26, 60, 0.95)';
}

function getHeatRadius(intensity, rainfall) {
  const base = 6;
  const scale = 4 + (rainfall / 200) * 12;
  return base + intensity * scale;
}

/* Component to render the heatmap overlay using CircleMarkers */
function HeatmapLayer({ rainfall, soilMoisture }) {
  const points = useMemo(
    () => generateHeatPoints(rainfall, soilMoisture),
    [rainfall, soilMoisture]
  );

  if (rainfall < 10 && soilMoisture < 15) return null;

  return (
    <>
      {points.map((p, i) => (
        <CircleMarker
          key={`heat-${i}`}
          center={[p.lat, p.lng]}
          radius={getHeatRadius(p.intensity, rainfall)}
          pathOptions={{
            fillColor: getHeatColor(p.intensity),
            fillOpacity: 0.85,
            color: p.intensity > 0.6 ? '#FF2A55' : '#00F0FF',
            weight: 1.5,
            opacity: 0.95,
            className: p.intensity > 0.6 ? 'heat-marker-critical' : 'heat-marker-active',
          }}
        />
      ))}
    </>
  );
}

/* Recenter map utility and zoom-out trigger to 3D Globe */
function MapController({ onZoomOutLimit }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    const handleZoom = () => {
      if (map.getZoom() <= 3) {
        onZoomOutLimit();
      }
    };
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map, onZoomOutLimit]);

  return null;
}

export default function GISMap({ rainfall = 0, soilMoisture = 0, riskScore = 0 }) {
  const [viewMode, setViewMode] = useState('map');
  const center = [25.73, 93.80]; // Perfectly centered on NH-29 corridor (Kohima-Dimapur)

  const corridorColor = riskScore < 30
    ? '#00F0FF'
    : riskScore < 60
    ? '#00E5FF'
    : riskScore < 85
    ? '#FF6B6B'
    : '#FF2A55';

  const isCritical = riskScore >= 85;

  return (
    <div className={`gis-map ${isCritical ? 'gis-map--critical' : ''}`}>
      {/* Top Left Status Badge */}
      <div className="gis-map__overlay-info">
        <span className="gis-map__badge">
          <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill={corridorColor}/></svg>
          {viewMode === 'globe' ? 'GLOBAL 3D VIEW' : 'NH-29 Corridor'}
        </span>
        <span className="gis-map__badge gis-map__badge--risk" style={{ borderColor: corridorColor, color: corridorColor }}>
          Risk: {Math.round(riskScore)}%
        </span>
      </div>

      {/* Top Right View Switcher */}
      <div className="gis-map__view-switch">
        <button
          className={`gis-map__switch-btn ${viewMode === 'map' ? 'gis-map__switch-btn--active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          <span>🗺️</span>
          <span>Corridor (2D)</span>
        </button>
        <button
          className={`gis-map__switch-btn ${viewMode === 'globe' ? 'gis-map__switch-btn--active' : ''}`}
          onClick={() => setViewMode('globe')}
        >
          <span>🌍</span>
          <span>3D Earth</span>
        </button>
      </div>

      {/* Conditionally Render: 3D Earth Globe OR Esri Dark Gray Leaflet Map */}
      {viewMode === 'globe' ? (
        <Globe3D riskScore={riskScore} onZoomIn={() => setViewMode('map')} />
      ) : (
        <MapContainer
          center={center}
          zoom={11}
          minZoom={2}
          className="gis-map__container"
          zoomControl={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%', borderRadius: '12px', background: '#060B18' }}
        >
          <MapController onZoomOutLimit={() => setViewMode('globe')} />
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {/* NER 8 States Geographical Badges */}
          {nerStates.map((st) => (
            <CircleMarker
              key={`ner-state-${st.code}`}
              center={st.pos}
              radius={0.1}
              pathOptions={{
                opacity: 0,
                fillOpacity: 0,
              }}
            >
              <Tooltip
                permanent
                direction="center"
                className={`ner-state-label ${st.isPilot ? 'ner-state-label--pilot' : ''}`}
              >
                <span className="ner-state-label__dot" />
                <span className="ner-state-label__name">{st.name}</span>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Highway corridor polyline — wide ambient aura */}
          <Polyline
            positions={corridorPoints}
            pathOptions={{
              color: corridorColor,
              weight: 22,
              opacity: 0.28,
              lineCap: 'round',
              lineJoin: 'round',
              className: 'corridor-glow-wide',
            }}
          />
          {/* Highway corridor polyline — mid radiant halo */}
          <Polyline
            positions={corridorPoints}
            pathOptions={{
              color: corridorColor,
              weight: 12,
              opacity: 0.55,
              lineCap: 'round',
              lineJoin: 'round',
              className: 'corridor-glow-mid',
            }}
          />
          {/* Highway corridor polyline — intense neon core */}
          <Polyline
            positions={corridorPoints}
            pathOptions={{
              color: corridorColor,
              weight: 4.5,
              opacity: 1.0,
              lineCap: 'round',
              lineJoin: 'round',
              className: 'corridor-glow-core',
            }}
          />
          {/* Highway corridor polyline — flowing inner energy beam */}
          <Polyline
            positions={corridorPoints}
            pathOptions={{
              color: '#FFFFFF',
              weight: 2,
              opacity: 0.95,
              dashArray: '6, 8',
              lineCap: 'round',
              lineJoin: 'round',
              className: 'corridor-pulse-beam',
            }}
          />

          {/* Heatmap overlay */}
          <HeatmapLayer rainfall={rainfall} soilMoisture={soilMoisture} />

          {/* Primary sensor stations (NH-29) */}
          {sensorStations.map((station, i) => (
            <React.Fragment key={`station-group-${i}`}>
              {/* Outer radar pulse ring */}
              <CircleMarker
                center={station.pos}
                radius={22}
                pathOptions={{
                  fillColor: corridorColor,
                  fillOpacity: 0.12,
                  color: corridorColor,
                  weight: 1.5,
                  opacity: 0.7,
                  className: 'sensor-radar-ring',
                }}
              />
              {/* Mid luminous halo */}
              <CircleMarker
                center={station.pos}
                radius={12}
                pathOptions={{
                  fillColor: corridorColor,
                  fillOpacity: 0.35,
                  color: '#FFFFFF',
                  weight: 1.5,
                  opacity: 0.9,
                  className: 'sensor-halo',
                }}
              />
              {/* Core telemetry beacon */}
              <CircleMarker
                center={station.pos}
                radius={6}
                pathOptions={{
                  fillColor: '#FFFFFF',
                  fillOpacity: 1.0,
                  color: corridorColor,
                  weight: 3,
                  opacity: 1.0,
                  className: 'sensor-station-core',
                }}
              >
                <Popup>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#0B1120',
                    padding: '4px',
                    lineHeight: 1.6,
                  }}>
                    <strong style={{ color: '#0284C7', fontSize: '13px' }}>{station.name}</strong><br />
                    <span style={{ color: '#475569' }}>{station.sector}</span><br />
                    <span style={{ color: '#10B981', fontWeight: 600 }}>● Active Telemetry</span>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          ))}

          {/* 12 Macro NER Sensor Markers (bright standby across North-East) */}
          {nerSensors.map((sensor, i) => (
            <React.Fragment key={`ner-${i}`}>
              {/* Luminous outer ring */}
              <CircleMarker
                center={sensor.pos}
                radius={14}
                pathOptions={{
                  fillColor: '#00F0FF',
                  fillOpacity: 0.22,
                  color: '#00F0FF',
                  weight: 1.8,
                  opacity: 0.85,
                  className: 'ner-sensor-ring',
                }}
              />
              {/* Bright center node */}
              <CircleMarker
                center={sensor.pos}
                radius={5}
                pathOptions={{
                  fillColor: '#00F0FF',
                  fillOpacity: 0.95,
                  color: '#FFFFFF',
                  weight: 2,
                  opacity: 1.0,
                  className: 'ner-sensor-dot',
                }}
              >
                <Popup>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                    color: '#0B1120',
                    padding: '4px',
                    lineHeight: 1.6,
                  }}>
                    <strong style={{ color: '#0284C7', fontSize: '13px' }}>{sensor.name}</strong><br />
                    <span style={{ color: '#475569' }}>{sensor.state}</span><br />
                    <span style={{ color: '#00F0FF', fontWeight: 600 }}>● SENSOR STANDBY</span>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          ))}
        </MapContainer>
      )}

      {/* ── CAP v1.2 Alert Row (appears when CRITICAL) ────── */}
      {isCritical && (
        <div className="cap-alert-row">
          <div className="cap-badge">
            <span className="cap-badge__icon">📱</span>
            SMS DISPATCHED
          </div>
          <div className="cap-badge">
            <span className="cap-badge__icon">🔊</span>
            SIREN ACTIVE
          </div>
          <div className="cap-badge">
            <span className="cap-badge__icon">📊</span>
            DASHBOARD LIVE
          </div>
        </div>
      )}
    </div>
  );
}
