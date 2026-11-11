import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * NoorWorld - DARK ORGANIC SERENITY: Noor
 * Deep warm black environment (#171713), warm golden illumination (#C6A66A), elegant floating light particles
 */
export const NoorWorld: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x171713, 0.002);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Warm golden light particles
    const particleCount = 950;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const floatSpeed = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      floatSpeed[i] = 0.15 + Math.random() * 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft gold particles (#C6A66A)
    const material = new THREE.PointsMaterial({
      color: 0xc6a66a,
      size: 2.0,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Warm golden ambient illumination (#C6A66A / #8E6E45)
    const pointLight = new THREE.PointLight(0xc6a66a, 1.8, 320);
    pointLight.position.set(0, 0, 40);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x211e18, 0.8);
    scene.add(ambientLight);

    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.008;

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(clock + i) * floatSpeed[i] * 0.3;
        pos[i * 3] += Math.cos(clock * 0.4 + i) * 0.1;
      }
      geometry.attributes.position.needsUpdate = true;

      particles.rotation.y = clock * 0.015;
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
      className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#171713] via-[#1f1e18] to-[#12130f]"
    />
  );
};
