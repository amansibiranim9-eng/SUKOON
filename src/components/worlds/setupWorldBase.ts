import * as THREE from 'three';
import { ProgressionTier } from '@/utils/progression';
import { visualService } from '@/services/visualService';
import { TapEventData, ClimaxEventData } from '@/types/visuals';

export interface WorldBaseScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  heartOrbGroup: THREE.Group;
  skyOfDhikrPoints: THREE.Points | null;
  dispose: () => void;
  updateBaseVisuals: (delta: number) => void;
}

export function setupWorldBase(
  container: HTMLDivElement,
  options: {
    accentColor: number;
    glowColor: number;
    initialCompletedCycles: number;
  }
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030407);
  scene.fog = new THREE.FogExp2(0x071426, 0.0018);

  const baseFov = 55;
  const camera = new THREE.PerspectiveCamera(
    baseFov,
    window.innerWidth / window.innerHeight,
    1,
    1200
  );
  camera.position.z = 240;

  // DPR capped at 2 for performance
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  // Prefers-reduced-motion detection
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Disposables collection for thorough memory leak prevention
  const disposables: { dispose: () => void }[] = [];

  // -------------------------------------------------------------
  // 1. Central "Heart Orb" (grows/brightens & gains orbiting particles per tier)
  // -------------------------------------------------------------
  const heartOrbGroup = new THREE.Group();
  scene.add(heartOrbGroup);

  // Core glowing sphere
  const orbGeo = new THREE.SphereGeometry(14, 32, 32);
  const orbMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const orbMesh = new THREE.Mesh(orbGeo, orbMat);
  heartOrbGroup.add(orbMesh);
  disposables.push(orbGeo, orbMat);

  // Inner & Outer halo rings
  const haloGeo = new THREE.RingGeometry(15, 28, 48);
  const haloMat = new THREE.MeshBasicMaterial({
    color: options.glowColor,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  heartOrbGroup.add(haloMesh);
  disposables.push(haloGeo, haloMat);

  // Orbiting particles ring 1 (Tier 1+)
  const orbitCount1 = 24;
  const orbitGeo1 = new THREE.BufferGeometry();
  const orbitPos1 = new Float32Array(orbitCount1 * 3);
  const orbitRadius1 = 28;
  for (let i = 0; i < orbitCount1; i++) {
    const angle = (i / orbitCount1) * Math.PI * 2;
    orbitPos1[i * 3] = Math.cos(angle) * orbitRadius1;
    orbitPos1[i * 3 + 1] = Math.sin(angle) * orbitRadius1 * 0.4;
    orbitPos1[i * 3 + 2] = Math.sin(angle) * orbitRadius1;
  }
  orbitGeo1.setAttribute('position', new THREE.BufferAttribute(orbitPos1, 3));
  const orbitMat1 = new THREE.PointsMaterial({
    color: 0x39a9ff,
    size: 2.2,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const orbitRing1 = new THREE.Points(orbitGeo1, orbitMat1);
  heartOrbGroup.add(orbitRing1);
  disposables.push(orbitGeo1, orbitMat1);

  // Orbiting particles ring 2 (Tier 2)
  const orbitCount2 = 36;
  const orbitGeo2 = new THREE.BufferGeometry();
  const orbitPos2 = new Float32Array(orbitCount2 * 3);
  const orbitRadius2 = 38;
  for (let i = 0; i < orbitCount2; i++) {
    const angle = (i / orbitCount2) * Math.PI * 2;
    orbitPos2[i * 3] = Math.cos(angle) * orbitRadius2 * 0.5;
    orbitPos2[i * 3 + 1] = Math.sin(angle) * orbitRadius2;
    orbitPos2[i * 3 + 2] = Math.cos(angle) * orbitRadius2 * 0.5;
  }
  orbitGeo2.setAttribute('position', new THREE.BufferAttribute(orbitPos2, 3));
  const orbitMat2 = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.8,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const orbitRing2 = new THREE.Points(orbitGeo2, orbitMat2);
  heartOrbGroup.add(orbitRing2);
  disposables.push(orbitGeo2, orbitMat2);

  // -------------------------------------------------------------
  // 2. Persistent "Sky of Dhikr" (Each completed cycle = 1 permanent star)
  // -------------------------------------------------------------
  const maxSkyStars = 500;
  const skyPositions = new Float32Array(maxSkyStars * 3);
  const skySizes = new Float32Array(maxSkyStars);
  const skyPhases = new Float32Array(maxSkyStars);

  // Seed fixed random positions for up to 500 potential stars
  for (let i = 0; i < maxSkyStars; i++) {
    skyPositions[i * 3] = (Math.sin(i * 99.7) * 450);
    skyPositions[i * 3 + 1] = (Math.cos(i * 47.3) * 350);
    skyPositions[i * 3 + 2] = -150 - (Math.abs(Math.sin(i * 13.9)) * 250);
    skySizes[i] = 1.5 + Math.abs(Math.sin(i)) * 2.5;
    skyPhases[i] = Math.sin(i * 2.3) * Math.PI * 2;
  }

  const skyGeo = new THREE.BufferGeometry();
  skyGeo.setAttribute('position', new THREE.BufferAttribute(skyPositions, 3));
  skyGeo.setDrawRange(0, Math.min(options.initialCompletedCycles, maxSkyStars));

  const skyMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.2,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const skyOfDhikrPoints = new THREE.Points(skyGeo, skyMat);
  scene.add(skyOfDhikrPoints);
  disposables.push(skyGeo, skyMat);

  // -------------------------------------------------------------
  // 3. Shockwave / Ripple Manager at exact tap point
  // -------------------------------------------------------------
  interface ActiveShockwave {
    mesh: THREE.Mesh;
    birthTime: number;
    duration: number;
    maxScale: number;
    material: THREE.MeshBasicMaterial;
    geometry: THREE.BufferGeometry;
  }
  const activeShockwaves: ActiveShockwave[] = [];

  // Shockwave creator at exact NDC (converted to unprojected 3D coordinate)
  const spawnShockwaveAtNDC = (ndcX: number, ndcY: number, scaleMultiplier: number = 1.0) => {
    // Project to world space at z = 0
    const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const spawnPos = camera.position.clone().add(dir.multiplyScalar(distance));

    const shockGeo = new THREE.RingGeometry(1, 4, 32);
    const shockMat = new THREE.MeshBasicMaterial({
      color: options.glowColor,
      transparent: true,
      opacity: 0.8 * scaleMultiplier,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const shockMesh = new THREE.Mesh(shockGeo, shockMat);
    shockMesh.position.copy(spawnPos);
    shockMesh.position.z = 10;
    scene.add(shockMesh);

    activeShockwaves.push({
      mesh: shockMesh,
      birthTime: performance.now(),
      duration: 800,
      maxScale: 28 * scaleMultiplier,
      material: shockMat,
      geometry: shockGeo,
    });
  };

  // -------------------------------------------------------------
  // 4. Climax Visuals (Slow shockwave, bloom flash, particle convergence/burst)
  // -------------------------------------------------------------
  let climaxStartTime: number = 0;
  const climaxDuration = 2600; // ms

  const climaxFlashGeo = new THREE.PlaneGeometry(1200, 1000);
  const climaxFlashMat = new THREE.MeshBasicMaterial({
    color: 0x39a9ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const climaxFlash = new THREE.Mesh(climaxFlashGeo, climaxFlashMat);
  climaxFlash.position.z = 100;
  scene.add(climaxFlash);
  disposables.push(climaxFlashGeo, climaxFlashMat);

  // Climax particle convergence burst
  const climaxBurstCount = 120;
  const climaxBurstGeo = new THREE.BufferGeometry();
  const climaxBurstPositions = new Float32Array(climaxBurstCount * 3);
  const climaxBurstVelocities = new Float32Array(climaxBurstCount * 3);

  for (let i = 0; i < climaxBurstCount; i++) {
    climaxBurstPositions[i * 3] = (Math.random() - 0.5) * 200;
    climaxBurstPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    climaxBurstPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    const speed = 1.5 + Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    climaxBurstVelocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
    climaxBurstVelocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
    climaxBurstVelocities[i * 3 + 2] = Math.cos(phi) * speed;
  }
  climaxBurstGeo.setAttribute('position', new THREE.BufferAttribute(climaxBurstPositions, 3));
  const climaxBurstMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.5,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const climaxBurstPoints = new THREE.Points(climaxBurstGeo, climaxBurstMat);
  scene.add(climaxBurstPoints);
  disposables.push(climaxBurstGeo, climaxBurstMat);

  // Listen to visualService ref events
  const unbindTap = visualService.onTap((tap: TapEventData) => {
    spawnShockwaveAtNDC(tap.ndcX, tap.ndcY, 0.8 + tap.intensity * 0.6);
  });

  const unbindClimax = visualService.onClimax((_climax: ClimaxEventData) => {
    climaxStartTime = performance.now();
    // Huge slow shockwave from center
    spawnShockwaveAtNDC(0, 0, 3.2);
  });

  // -------------------------------------------------------------
  // 5. Performance Monitoring (Rolling FPS & Dynamic Particle Scale)
  // -------------------------------------------------------------
  let lastFrameTime = performance.now();
  let frameCount = 0;
  let fpsTimer = 0;
  let particleScaleFactor = 1.0; // Automatically lower if FPS drops < 40

  const updatePerformance = (now: number): number => {
    const delta = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    frameCount++;
    fpsTimer += delta;

    if (fpsTimer >= 1.0) {
      const currentFps = frameCount / fpsTimer;
      if (currentFps < 40) {
        particleScaleFactor = Math.max(0.4, particleScaleFactor - 0.15);
      } else if (currentFps > 55 && particleScaleFactor < 1.0) {
        particleScaleFactor = Math.min(1.0, particleScaleFactor + 0.05);
      }
      frameCount = 0;
      fpsTimer = 0;
    }
    return delta;
  };

  // State caches
  let currentTier: ProgressionTier = 0;
  let currentIntensity: number = 0;
  let targetCameraZ = 240;

  const updateBaseVisuals = (_delta: number) => {
    const now = performance.now();

    // 1. Smooth Camera push-in per tier (Tier 0: 240, Tier 1: 220, Tier 2: 200)
    targetCameraZ = 240 - currentTier * 20;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.04;

    // 2. Parallax camera tilt & offset
    if (!prefersReducedMotion) {
      visualService.updateParallax(0.06);
      camera.position.x = visualService.parallaxX * 24;
      camera.position.y = visualService.parallaxY * 18;
      camera.lookAt(0, 0, 0);
    }

    // 3. Heart Orb breathing & tier scaling
    const breath = prefersReducedMotion ? 1.0 : Math.sin(now * 0.002) * 0.08 + 1.0;
    const tierOrbScale = (1.0 + currentTier * 0.28 + currentIntensity * 0.35) * breath;
    heartOrbGroup.scale.set(tierOrbScale, tierOrbScale, tierOrbScale);

    orbMat.opacity = 0.75 + currentIntensity * 0.25;
    haloMat.opacity = (0.25 + currentTier * 0.15 + currentIntensity * 0.35) * breath;

    // Orbiting rings activity by tier
    if (currentTier >= 1) {
      orbitMat1.opacity = Math.min(0.85, orbitMat1.opacity + 0.03);
      orbitRing1.rotation.y += prefersReducedMotion ? 0 : 0.015;
      orbitRing1.rotation.z += prefersReducedMotion ? 0 : 0.008;
    } else {
      orbitMat1.opacity = Math.max(0, orbitMat1.opacity - 0.03);
    }

    if (currentTier >= 2) {
      orbitMat2.opacity = Math.min(0.9, orbitMat2.opacity + 0.03);
      orbitRing2.rotation.x += prefersReducedMotion ? 0 : 0.012;
      orbitRing2.rotation.y -= prefersReducedMotion ? 0 : 0.018;
    } else {
      orbitMat2.opacity = Math.max(0, orbitMat2.opacity - 0.03);
    }

    // 4. Update shockwaves
    for (let i = activeShockwaves.length - 1; i >= 0; i--) {
      const sw = activeShockwaves[i];
      const age = now - sw.birthTime;
      const progress = age / sw.duration;

      if (progress >= 1.0) {
        scene.remove(sw.mesh);
        sw.geometry.dispose();
        sw.material.dispose();
        activeShockwaves.splice(i, 1);
      } else {
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScale = 1 + easeOut * sw.maxScale;
        sw.mesh.scale.set(currentScale, currentScale, 1);
        sw.material.opacity = Math.max(0, (1 - easeOut) * 0.75);
      }
    }

    // 5. Update climax burst and bloom flash
    if (climaxStartTime > 0) {
      const climaxElapsed = now - climaxStartTime;
      const climaxNorm = climaxElapsed / climaxDuration;

      if (climaxNorm < 1.0) {
        // Flash envelope
        if (climaxNorm < 0.2) {
          climaxFlashMat.opacity = (climaxNorm / 0.2) * 0.45;
        } else {
          climaxFlashMat.opacity = Math.max(0, (1 - (climaxNorm - 0.2) / 0.8) * 0.45);
        }

        // Particle convergence (0.0 to 0.3) then burst outward (0.3 to 1.0)
        climaxBurstMat.opacity = Math.min(1, Math.sin(climaxNorm * Math.PI));
        const positions = climaxBurstGeo.attributes.position.array as Float32Array;

        if (climaxNorm < 0.28) {
          // Inward convergence
          for (let i = 0; i < climaxBurstCount; i++) {
            positions[i * 3] *= 0.94;
            positions[i * 3 + 1] *= 0.94;
            positions[i * 3 + 2] *= 0.94;
          }
        } else {
          // Outward burst
          for (let i = 0; i < climaxBurstCount; i++) {
            positions[i * 3] += climaxBurstVelocities[i * 3] * 1.8;
            positions[i * 3 + 1] += climaxBurstVelocities[i * 3 + 1] * 1.8;
            positions[i * 3 + 2] += climaxBurstVelocities[i * 3 + 2] * 1.8;
          }
        }
        climaxBurstGeo.attributes.position.needsUpdate = true;
      } else {
        climaxStartTime = 0;
        climaxFlashMat.opacity = 0;
        climaxBurstMat.opacity = 0;
      }
    }
  };

  const updateSkyStars = (completedCycles: number) => {
    skyGeo.setDrawRange(0, Math.min(completedCycles, maxSkyStars));
  };

  const setTier = (tier: ProgressionTier) => {
    currentTier = tier;
  };

  const setIntensity = (intensity: number) => {
    currentIntensity = intensity;
  };

  const dispose = () => {
    unbindTap();
    unbindClimax();

    // Dispose active shockwaves
    activeShockwaves.forEach((sw) => {
      scene.remove(sw.mesh);
      sw.geometry.dispose();
      sw.material.dispose();
    });
    activeShockwaves.length = 0;

    // Dispose all tracked geometries & materials
    disposables.forEach((d) => {
      try {
        d.dispose();
      } catch {
        // ignore
      }
    });

    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };

  return {
    scene,
    camera,
    renderer,
    heartOrbGroup,
    skyOfDhikrPoints,
    updateBaseVisuals,
    updatePerformance,
    getParticleScaleFactor: () => particleScaleFactor,
    setTier,
    setIntensity,
    updateSkyStars,
    dispose,
  };
}
