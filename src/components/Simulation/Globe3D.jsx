import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

/* ──────────────────────────────────────────────────────────────────────
 * NASA Blue Marble Earth Texture URL (public domain)
 * ────────────────────────────────────────────────────────────────────── */
const EARTH_TEXTURE_URL =
  'https://unpkg.com/three-globe@2.37.1/example/img/earth-blue-marble.jpg';
const EARTH_TOPO_URL =
  'https://unpkg.com/three-globe@2.37.1/example/img/earth-topology.png';

/* ──────────────────────────────────────────────────────────────────────
 * Utility: lat/lng → 3D position on sphere
 * ────────────────────────────────────────────────────────────────────── */
function latLngToVector3(lat, lng, radius = 1.008) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Deep Space Starfield (Crisp, visible stars like reference image)
 * ────────────────────────────────────────────────────────────────────── */
function Starfield() {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const count = 2200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#FFFFFF'), // Pure bright white
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#E0F2FE'), // Ice blue
      new THREE.Color('#BAE6FD'), // Soft cyan
      new THREE.Color('#FEF08A'), // Warm twinkle
      new THREE.Color('#00F0FF'), // Neon cyan
    ];

    for (let i = 0; i < count; i++) {
      // Distribute stars on outer sphere shell (radius 30 to 75)
      const radius = 30 + Math.random() * 45;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      pos[i * 3] = radius * sinPhi * Math.cos(theta);
      pos[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, []);

  // Soft circular glow star texture created programmatically
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(224, 242, 254, 0.9)');
    grad.addColorStop(0.55, 'rgba(0, 240, 255, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
      pointsRef.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.85}
        sizeAttenuation={true}
        map={starTexture}
        transparent={true}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Earth Sphere with NASA Blue Marble
 * ────────────────────────────────────────────────────────────────────── */
function EarthMesh() {
  const dayMap = useLoader(THREE.TextureLoader, EARTH_TEXTURE_URL);
  const topoMap = useLoader(THREE.TextureLoader, EARTH_TOPO_URL);

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={dayMap}
        bumpMap={topoMap}
        bumpScale={0.035}
        specularMap={topoMap}
        specular={new THREE.Color('#1e4976')}
        shininess={12}
      />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Atmospheric Glow Shells
 * ────────────────────────────────────────────────────────────────────── */
function AtmosphereGlow() {
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <>
      {/* Inner atmospheric rim */}
      <mesh scale={[1.018, 1.018, 1.018]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
              gl_FragColor = vec4(0.05, 0.65, 1.0, 1.0) * intensity * 0.9;
            }
          `}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
      {/* Outer atmospheric haze */}
      <mesh scale={[1.11, 1.11, 1.11]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.8);
              gl_FragColor = vec4(0.1, 0.55, 1.0, 1.0) * intensity * 0.45;
            }
          `}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Nagaland NH-29 Beacon Marker (Pulsing Radar + HTML Badge)
 * ────────────────────────────────────────────────────────────────────── */
function BeaconMarker({ lat, lng, riskScore, isZooming }) {
  const ringRef = useRef();
  const pos = useMemo(() => latLngToVector3(lat, lng, 1.012), [lat, lng]);
  const isCritical = riskScore >= 85;
  const color = isCritical ? '#FF2A55' : riskScore > 60 ? '#F97316' : '#00F0FF';

  useFrame(() => {
    if (ringRef.current) {
      const speed = isCritical ? 0.006 : 0.0035;
      const time = performance.now() * speed;
      const t = (Math.sin(time) + 1) / 2;
      const scaleAmp = isCritical ? 1.2 : 0.7;
      ringRef.current.scale.setScalar(1 + t * scaleAmp);
      ringRef.current.material.opacity = isCritical ? (0.95 - t * 0.6) : (0.85 - t * 0.7);
    }
  });

  return (
    <group position={pos}>
      {/* Core glowing marker */}
      <mesh>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Radar pulse ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.028, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating HUD Label */}
      {!isZooming && (
        <Html
          position={[0.045, 0.035, 0]}
          distanceFactor={2.4}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(6, 15, 31, 0.92)',
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${color}`,
              borderRadius: '8px',
              padding: '6px 12px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#fff',
              whiteSpace: 'nowrap',
              boxShadow: `0 0 16px ${color}55, 0 4px 14px rgba(0,0,0,0.7)`,
              userSelect: 'none',
              transform: 'translate3d(0,0,0)',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '2px', letterSpacing: '0.04em' }}>
              NH-29 Nagaland, India
            </div>
            <div style={{ color, fontWeight: 600, fontSize: '9px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
              SLOPE RISK: {Math.round(riskScore)}% ● ACTIVE
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Earth Group (Rotates as a cohesive whole with beacon attached)
 * ────────────────────────────────────────────────────────────────────── */
const EarthGroup = React.forwardRef(({ autoRotate, isZooming, riskScore }, ref) => {
  useFrame((_, delta) => {
    // Gentle rotation unless zooming in
    if (ref.current && autoRotate && !isZooming) {
      ref.current.rotation.y += delta * 0.04;
    }
  });

  return (
    // Initial rotation Y aligns India and Nagaland facing forward
    <group ref={ref} rotation={[0.1, -0.65, 0]}>
      <EarthMesh />
      <AtmosphereGlow />
      <BeaconMarker
        lat={25.66}
        lng={94.10}
        riskScore={riskScore}
        isZooming={isZooming}
      />
    </group>
  );
});

/* ──────────────────────────────────────────────────────────────────────
 * Cinematic Zoom Controller (Dives camera into Nagaland corridor on Inspect)
 * ────────────────────────────────────────────────────────────────────── */
function ZoomController({ isZooming, earthGroupRef, onComplete }) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  const startCamPos = useRef(new THREE.Vector3());
  const initialFov = useRef(45);

  useEffect(() => {
    if (isZooming) {
      startCamPos.current.copy(camera.position);
      initialFov.current = camera.fov;
      progressRef.current = 0;
    }
  }, [isZooming, camera]);

  useFrame((_, delta) => {
    if (!isZooming) return;

    // Fast cinematic dive over ~1.3 seconds
    progressRef.current = Math.min(1, progressRef.current + delta * 0.85);
    const p = progressRef.current;

    // Smooth accelerating ease curve (dive into terrain)
    const ease = p * p * (3 - 2 * p);
    const diveEase = Math.pow(p, 2.2);

    // Compute current world position of Nagaland beacon
    const beaconLocal = latLngToVector3(25.66, 94.10, 1.008);
    const beaconWorld = beaconLocal.clone();
    if (earthGroupRef.current) {
      beaconWorld.applyMatrix4(earthGroupRef.current.matrixWorld);
    }

    // Camera target position: hovering just above the corridor terrain (1.06 radius)
    const targetCamPos = beaconWorld.clone().normalize().multiplyScalar(1.06);

    // Move camera towards Nagaland
    camera.position.lerpVectors(startCamPos.current, targetCamPos, diveEase);
    camera.lookAt(beaconWorld);

    // Dynamic FOV zoom for speed dive sensation
    camera.fov = initialFov.current - ease * 16;
    camera.updateProjectionMatrix();

    if (p >= 1) {
      onComplete();
    }
  });

  return null;
}

/* ──────────────────────────────────────────────────────────────────────
 * Loading Placeholder
 * ────────────────────────────────────────────────────────────────────── */
function LoadingFallback() {
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#00F0FF',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(0, 240, 255, 0.2)',
            borderTopColor: '#00F0FF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
          INITIALIZING SATELLITE TELEMETRY...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Main Globe3D Component
 * ────────────────────────────────────────────────────────────────────── */
export default function Globe3D({ riskScore = 0, onZoomIn }) {
  const earthGroupRef = useRef();
  const [isZooming, setIsZooming] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleInspectClick = () => {
    if (isZooming) return;
    setIsZooming(true);
  };

  const handleZoomComplete = () => {
    setFlash(true);
    setTimeout(() => {
      onZoomIn();
    }, 200);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, #0c1c38 0%, #060e1e 40%, #02050e 100%)',
        cursor: isZooming ? 'wait' : 'grab',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0.2, 3.8],
          fov: 45,
          near: 0.1,
          far: 250,
        }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Crisp space illumination: visible vibrant Earth like reference image */}
        <ambientLight intensity={0.8} color="#dbeafe" />
        <directionalLight position={[8, 5, 8]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-8, -3, -8]} intensity={0.65} color="#38bdf8" />
        <pointLight position={[0, 0, 4]} intensity={0.4} color="#93c5fd" />

        {/* Crisp starfield with hundreds of bright glowing stars */}
        <Starfield />

        <Suspense fallback={<LoadingFallback />}>
          {/* Rotating Earth group with linked Nagaland beacon */}
          <EarthGroup
            ref={earthGroupRef}
            autoRotate={true}
            isZooming={isZooming}
            riskScore={riskScore}
          />

          {/* Camera zoom-in dive controller */}
          <ZoomController
            isZooming={isZooming}
            earthGroupRef={earthGroupRef}
            onComplete={handleZoomComplete}
          />
        </Suspense>

        {/* Orbit controls (disabled during zoom animation) */}
        <OrbitControls
          enabled={!isZooming}
          enableZoom={!isZooming}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          minDistance={1.8}
          maxDistance={8}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* ── Top HUD Badges ───────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '8px',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: 'rgba(6, 15, 31, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '20px',
            padding: '5px 12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#00F0FF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#00F0FF',
              boxShadow: '0 0 8px #00F0FF',
              display: 'inline-block',
            }}
          />
          3D GLOBAL ORBIT
        </div>

        {isZooming && (
          <div
            style={{
              background: 'rgba(0, 240, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #00F0FF',
              borderRadius: '20px',
              padding: '5px 12px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#00F0FF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'pulse 1s infinite alternate',
            }}
          >
            <span>🚀 TARGETING NH-29 CORRIDOR...</span>
          </div>
        )}
      </div>

      {/* ── Bottom Action Button ─────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          right: '14px',
          zIndex: 10,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleInspectClick}
          disabled={isZooming}
          style={{
            background: isZooming
              ? 'rgba(0, 240, 255, 0.2)'
              : 'linear-gradient(135deg, #00F0FF 0%, #0080FF 100%)',
            color: isZooming ? '#00F0FF' : '#040914',
            border: isZooming ? '1px solid #00F0FF' : 'none',
            padding: '9px 20px',
            borderRadius: '8px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: isZooming ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isZooming
              ? '0 0 20px rgba(0, 240, 255, 0.4)'
              : '0 0 24px rgba(0, 240, 255, 0.45), 0 4px 14px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.25s ease',
          }}
        >
          {isZooming ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>🌀</span>
              <span>Diving into Corridor...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Inspect NH-29 Corridor</span>
            </>
          )}
        </button>
      </div>

      {/* ── Hyperspace Flash Transition Overlay ───────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.45) 0%, rgba(6, 15, 31, 0.95) 75%)',
          opacity: flash ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease-in-out',
          zIndex: 50,
        }}
      />
    </div>
  );
}
