import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store';

/**
 * NoorWorld: Luminous celestial moonlight, slow drifting clouds, and subtle stars.
 * Colors: Deep black (#030407), Midnight blue (#071426), Glowing blue (#39A9FF), Pure white (#FFFFFF).
 */
export const NoorWorld: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const interactionIntensity = useAppStore((state) => state.interactionIntensity);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030407);
    scene.fog = new THREE.FogExp2(0x071426, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

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
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
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
    const cloudCount = 20;
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

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Star twinkle and slow rotation
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;

      // Cloud drift
      cloudGroup.children.forEach((cloud, idx) => {
        cloud.position.x += 0.04 * (idx % 2 === 0 ? 1 : -0.7);
        if (cloud.position.x > 250) cloud.position.x = -250;
        if (cloud.position.x < -250) cloud.position.x = 250;
      });

      // Subtle light pulse on interaction
      const intensity = mountRef.current ? Number(mountRef.current.dataset.intensity || 0) : 0;
      halo.scale.set(1 + intensity * 0.3, 1 + intensity * 0.3, 1);
      haloMat.opacity = 0.25 + intensity * 0.35;

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
      moonGeo.dispose();
      moonMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
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
export default NoorWorld;
