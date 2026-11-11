import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store';
import { setupWorldBase } from '../setupWorldBase';

/**
 * NoorWorld: Luminous celestial moonlight, beam flares at tap point, clouds, Heart Orb, and Sky of Dhikr.
 * Colors: Deep black (#030407), Midnight blue (#071426), Glowing blue (#39A9FF), Pure white (#FFFFFF).
 */
export const NoorWorld: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const interactionIntensity = useAppStore((state) => state.interactionIntensity);
  const tier = useAppStore((state) => state.tier);
  const completedCycles = useAppStore((state) => state.session.completedCycles);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const base = setupWorldBase(currentMount, {
      accentColor: 0x39a9ff,
      glowColor: 0xffffff,
      initialCompletedCycles: completedCycles,
    });

    const { scene, camera, renderer, updateBaseVisuals, updatePerformance, getParticleScaleFactor } = base;

    // Moonlight celestial sphere
    const moonGeo = new THREE.SphereGeometry(22, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(90, 85, -80);
    scene.add(moon);

    // Soft moon halo
    const haloGeo = new THREE.RingGeometry(24, 60, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x39a9ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(90, 85, -81);
    scene.add(halo);

    // Drifting celestial stars
    const maxStarCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(maxStarCount * 3);

    for (let i = 0; i < maxStarCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 600;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Atmospheric slow moving clouds (billboards)
    const cloudCount = 18;
    const cloudGeo = new THREE.PlaneGeometry(80, 40);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0x071426,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const cloudGroup = new THREE.Group();
    for (let i = 0; i < cloudCount; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 200,
        -100 + Math.random() * 50
      );
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // Ambient light
    const pointLight = new THREE.PointLight(0x39a9ff, 1.8, 500);
    pointLight.position.set(90, 85, -30);
    scene.add(pointLight);

    let animationFrameId: number;
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

      // Star twinkle and slow rotation
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;

      // Cloud drift
      cloudGroup.children.forEach((cloud, idx) => {
        cloud.position.x += 0.04 * (idx % 2 === 0 ? 1 : -0.7);
        if (cloud.position.x > 250) cloud.position.x = -250;
        if (cloud.position.x < -250) cloud.position.x = 250;
      });

      // Reactive pulse
      const currentIntensity = Number(mountRef.current?.dataset.intensity || 0);
      halo.scale.set(1 + currentIntensity * 0.35, 1 + currentIntensity * 0.35, 1);
      haloMat.opacity = 0.25 + currentIntensity * 0.4;

      const scaleFactor = getParticleScaleFactor();
      starGeo.setDrawRange(0, Math.floor(maxStarCount * scaleFactor));

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

      moonGeo.dispose();
      moonMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
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
export default NoorWorld;
