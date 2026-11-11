import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SakinaWorld - DARK ORGANIC SERENITY: Sakina
 * Dark olive atmosphere (#777B5A / #141612), soft ivory light (#E9E2D3), slow peaceful floating particles
 */
export const SakinaWorld: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x131511, 0.002);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Slow peaceful ivory particles
    const count = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const driftSpeed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      driftSpeed[i] = 0.08 + Math.random() * 0.15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Warm ivory light particles (#E9E2D3)
    const material = new THREE.PointsMaterial({
      color: 0xe9e2d3,
      size: 1.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Muted olive ambient lighting (#777B5A)
    const ambientLight = new THREE.AmbientLight(0x23271c, 1.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xe9e2d3, 1.3, 280);
    pointLight.position.set(0, 0, 45);
    scene.add(pointLight);

    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.006;

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(clock + i) * driftSpeed[i] * 0.2;
        pos[i * 3] += Math.cos(clock * 0.3 + i) * driftSpeed[i] * 0.1;
      }
      geometry.attributes.position.needsUpdate = true;

      particles.rotation.y = clock * 0.01;
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
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#131511] via-[#1b1e17] to-[#10120e]"
    />
  );
};
