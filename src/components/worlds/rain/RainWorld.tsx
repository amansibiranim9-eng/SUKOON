import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * RainWorld - DARK ORGANIC SERENITY: Rain
 * Dark charcoal atmosphere (#10110F), realistic rain-inspired motion, silver highlights
 */
export const RainWorld: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    // Dark charcoal fog
    scene.fog = new THREE.FogExp2(0x10110f, 0.0025);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Rain drop streaks with silver highlights
    const rainCount = 1400;
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = Math.random() * 400 - 150;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      velocities[i] = 1.6 + Math.random() * 2.0;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Silver rain particles with soft opacity
    const rainMaterial = new THREE.PointsMaterial({
      color: 0xd1d5db, // Silver highlights
      size: 1.4,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const rainParticles = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rainParticles);

    // Subtle dark warm charcoal ambient light
    const ambientLight = new THREE.AmbientLight(0x1f211d, 1.0);
    scene.add(ambientLight);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const pos = rainGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        pos[i * 3 + 1] -= velocities[i];
        if (pos[i * 3 + 1] < -200) {
          pos[i * 3 + 1] = 200;
        }
      }
      rainGeometry.attributes.position.needsUpdate = true;
      rainParticles.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      rainGeometry.dispose();
      rainMaterial.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#10110F] via-[#151713] to-[#10110F]"
    />
  );
};
