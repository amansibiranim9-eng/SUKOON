import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store';
import { setupWorldBase } from '../setupWorldBase';

/**
 * SakinaWorld: Floating tranquil particles, cloud glow at tap point, wind rings, Heart Orb, and Sky of Dhikr.
 * Colors: Deep black (#030407), Midnight blue (#071426), Electric blue (#168BFF), Glowing blue (#39A9FF).
 */
export const SakinaWorld: React.FC = () => {
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

    // Serene floating particles
    const maxParticleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(maxParticleCount * 3);
    const particlePhases = new Float32Array(maxParticleCount);

    for (let i = 0; i < maxParticleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 500;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 350;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x39a9ff,
      size: 2.2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Tranquil wind rings
    const ringGeo = new THREE.TorusGeometry(80, 0.4, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x168bff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    const ambientLight = new THREE.AmbientLight(0x071426, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x168bff, 2, 350);
    pointLight.position.set(0, 20, 80);
    scene.add(pointLight);

    let animationFrameId: number;
    let clock = new THREE.Clock();
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

      const elapsed = clock.getElapsedTime();
      const scaleFactor = getParticleScaleFactor();
      const activeCount = Math.floor(maxParticleCount * scaleFactor);
      particleGeo.setDrawRange(0, activeCount);

      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < activeCount; i++) {
        const phase = particlePhases[i];
        positions[i * 3] += Math.sin(elapsed * 0.8 + phase) * 0.3;
        positions[i * 3 + 1] += Math.cos(elapsed * 0.5 + phase) * 0.25;

        if (positions[i * 3 + 1] > 200) positions[i * 3 + 1] = -200;
        if (positions[i * 3] > 250) positions[i * 3] = -250;
      }
      particleGeo.attributes.position.needsUpdate = true;

      ring.rotation.z += 0.002;
      ring.rotation.y += 0.001;

      const currentIntensity = Number(mountRef.current?.dataset.intensity || 0);
      pointLight.intensity = 1.8 + currentIntensity * 3.5;
      ringMat.opacity = 0.2 + currentIntensity * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    (mountRef.current as unknown as { __base: typeof base }).__base = base;

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);

      particleGeo.dispose();
      particleMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      base.dispose();
    };
  }, []);

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
export default SakinaWorld;
