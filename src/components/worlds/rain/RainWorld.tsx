import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store';
import { setupWorldBase } from '../setupWorldBase';

/**
 * RainWorld: Cinematic rain streaks, water ripple reflections, tap ripples, Heart Orb, and Sky of Dhikr.
 * Colors: Deep black (#030407), Midnight blue (#071426), Electric blue (#168BFF), Glowing blue (#39A9FF).
 */
export const RainWorld: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const interactionIntensity = useAppStore((state) => state.interactionIntensity);
  const tier = useAppStore((state) => state.tier);
  const completedCycles = useAppStore((state) => state.session.completedCycles);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const base = setupWorldBase(currentMount, {
      accentColor: 0x168bff,
      glowColor: 0x39a9ff,
      initialCompletedCycles: completedCycles,
    });

    const { scene, camera, renderer, updateBaseVisuals, updatePerformance, getParticleScaleFactor } = base;

    // Rain drop streaks
    const maxRainCount = 1400;
    const rainGeometry = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(maxRainCount * 3);
    const rainVelocities = new Float32Array(maxRainCount);

    for (let i = 0; i < maxRainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 600;
      rainPositions[i * 3 + 1] = (Math.random() - 0.5) * 500;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      rainVelocities[i] = 4 + Math.random() * 5;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

    const rainMaterial = new THREE.PointsMaterial({
      color: 0x39a9ff,
      size: 1.8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const rainSystem = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rainSystem);

    // Ground puddle reflection
    const puddleGeo = new THREE.RingGeometry(2, 70, 32);
    const puddleMat = new THREE.MeshBasicMaterial({
      color: 0x168bff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const puddleMesh = new THREE.Mesh(puddleGeo, puddleMat);
    puddleMesh.rotation.x = Math.PI / 2;
    puddleMesh.position.y = -120;
    scene.add(puddleMesh);

    // Ambient light
    const pointLight = new THREE.PointLight(0x168bff, 2, 450);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    let animationFrameId: number;
    let puddleScale = 1;
    let isTabVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        animate();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (!isTabVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = updatePerformance(performance.now());
      updateBaseVisuals(delta);

      // Rain animation adjusted by performance scale factor
      const scaleFactor = getParticleScaleFactor();
      const activeCount = Math.floor(maxRainCount * scaleFactor);
      rainGeometry.setDrawRange(0, activeCount);

      const positions = rainGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < activeCount; i++) {
        positions[i * 3 + 1] -= rainVelocities[i];
        if (positions[i * 3 + 1] < -200) {
          positions[i * 3 + 1] = 250;
        }
      }
      rainGeometry.attributes.position.needsUpdate = true;

      // Puddle ripple animation
      puddleScale += 0.008;
      if (puddleScale > 3) puddleScale = 0.5;
      puddleMesh.scale.set(puddleScale, puddleScale, 1);
      puddleMat.opacity = Math.max(0, 0.22 - puddleScale * 0.06);

      // Reactive pulse
      const currentIntensity = Number(mountRef.current?.dataset.intensity || 0);
      pointLight.intensity = 1.6 + currentIntensity * 3.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store base instance on ref for outside reactive updates
    (mountRef.current as unknown as { __base: typeof base }).__base = base;

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);

      rainGeometry.dispose();
      rainMaterial.dispose();
      puddleGeo.dispose();
      puddleMat.dispose();
      base.dispose();
    };
  }, []);

  // Update Three.js loop directly via refs (no React state per frame)
  useEffect(() => {
    if (mountRef.current) {
      mountRef.current.dataset.intensity = interactionIntensity.toString();
      const base = (mountRef.current as unknown as { __base?: ReturnType<typeof setupWorldBase> }).__base;
      if (base) {
        base.setIntensity(interactionIntensity);
      }
    }
  }, [interactionIntensity]);

  useEffect(() => {
    if (mountRef.current) {
      const base = (mountRef.current as unknown as { __base?: ReturnType<typeof setupWorldBase> }).__base;
      if (base) {
        base.setTier(tier);
      }
    }
  }, [tier]);

  useEffect(() => {
    if (mountRef.current) {
      const base = (mountRef.current as unknown as { __base?: ReturnType<typeof setupWorldBase> }).__base;
      if (base) {
        base.updateSkyStars(completedCycles);
      }
    }
  }, [completedCycles]);

  return <div ref={mountRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};
export default RainWorld;
