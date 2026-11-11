import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store';

/**
 * RainWorld: Cinematic rain streaks, water ripple reflections, and interaction responsiveness.
 * Colors: Deep black (#030407), Midnight blue (#071426), Electric blue (#168BFF), Glowing blue (#39A9FF).
 */
export const RainWorld: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const interactionIntensity = useAppStore((state) => state.interactionIntensity);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030407);
    scene.fog = new THREE.FogExp2(0x071426, 0.002);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Rain drop streaks
    const rainCount = 1400;
    const rainGeometry = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    const rainVelocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
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

    // Ground water ripple effect
    const rippleGeometry = new THREE.RingGeometry(2, 60, 32);
    const rippleMaterial = new THREE.MeshBasicMaterial({
      color: 0x168bff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const rippleMesh = new THREE.Mesh(rippleGeometry, rippleMaterial);
    rippleMesh.rotation.x = Math.PI / 2;
    rippleMesh.position.y = -120;
    scene.add(rippleMesh);

    // Interactive ambient light
    const pointLight = new THREE.PointLight(0x168bff, 2, 400);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    let animationFrameId: number;
    let rippleScale = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rain animation
      const positions = rainGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= rainVelocities[i];
        if (positions[i * 3 + 1] < -200) {
          positions[i * 3 + 1] = 250;
        }
      }
      rainGeometry.attributes.position.needsUpdate = true;

      // Ripple animation
      rippleScale += 0.008;
      if (rippleScale > 3) rippleScale = 0.5;
      rippleMesh.scale.set(rippleScale, rippleScale, 1);
      (rippleMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        0.25 - rippleScale * 0.07
      );

      // Pulse reactive light
      pointLight.intensity = 1.5 + (mountRef.current ? Number(mountRef.current.dataset.intensity || 0) : 0) * 3;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      rainGeometry.dispose();
      rainMaterial.dispose();
      rippleGeometry.dispose();
      rippleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Update data-intensity for 60fps render loop
  useEffect(() => {
    if (mountRef.current) {
      mountRef.current.dataset.intensity = interactionIntensity.toString();
    }
  }, [interactionIntensity]);

  return <div ref={mountRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};
export default RainWorld;
