import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * RainWorld - Cinematic 3D dark blue rainy atmosphere with falling rain streaks and mist
 */
export const RainWorld: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.002);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Rain drop streaks
    const rainCount = 1800;
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = Math.random() * 400 - 150;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      velocities[i] = 1.8 + Math.random() * 2.2;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom particle material with dark blue spiritual tint
    const rainMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.5,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const rainParticles = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rainParticles);

    // Subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x0f2744, 1.2);
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

      rainParticles.rotation.y += 0.0003;
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
      className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#020617] via-[#040d21] to-[#020617]"
    />
  );
};
