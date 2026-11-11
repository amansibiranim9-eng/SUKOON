import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store';

/**
 * SakinaWorld: Floating tranquil particles, soft atmospheric wind waves, and serene environmental lighting.
 * Colors: Deep black (#030407), Midnight blue (#071426), Electric blue (#168BFF), Glowing blue (#39A9FF).
 */
export const SakinaWorld: React.FC = () => {
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
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Serene floating particles (nature-like tranquil drift)
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
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

    // Ambient floating rings representing tranquil soundwaves / wind
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

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Swaying drifting motion
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const phase = particlePhases[i];
        positions[i * 3] += Math.sin(elapsed * 0.8 + phase) * 0.3;
        positions[i * 3 + 1] += Math.cos(elapsed * 0.5 + phase) * 0.25;

        // Reset if drifted too far
        if (positions[i * 3 + 1] > 200) positions[i * 3 + 1] = -200;
        if (positions[i * 3] > 250) positions[i * 3] = -250;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Gentle torus rotation
      ring.rotation.z += 0.002;
      ring.rotation.y += 0.001;

      // Interaction intensity pulse
      const intensity = mountRef.current ? Number(mountRef.current.dataset.intensity || 0) : 0;
      pointLight.intensity = 1.8 + intensity * 3.5;
      ringMat.opacity = 0.2 + intensity * 0.4;

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
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (mountRef.current) {
      mountRef.current.dataset.intensity = interactionIntensity.toString();
    }
  }, [interactionIntensity]);

  return <div ref={mountRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};
export default SakinaWorld;
