import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HarryPotterAuthBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    // Make canvas non-interactive
    renderer.domElement.style.pointerEvents = 'none';
    
    // Clear any existing content
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    
    // Append renderer to mount
    mountRef.current.appendChild(renderer.domElement);

    // Create some simple floating elements
    const candles: THREE.Group[] = [];
    
    for (let i = 0; i < 10; i++) {
      const group = new THREE.Group();
      
      // Simple candle
      const candleGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.4, 6);
      const candleMaterial = new THREE.MeshBasicMaterial({
        color: 0xF5DEB3,
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      
      // Simple flame
      const flameGeometry = new THREE.ConeGeometry(0.05, 0.15, 5);
      const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF9933,
        transparent: true,
        opacity: 0.7,
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.y = 0.25;
      
      group.add(candle);
      group.add(flame);
      
      // Position in a circle
      const angle = (i / 10) * Math.PI * 2;
      const radius = 6 + Math.random() * 3;
      group.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
      );
      
      candles.push(group);
      scene.add(group);
    }

    // Create simple particles
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.5,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate candles
      candles.forEach((candle, index) => {
        candle.rotation.y += 0.01;
        candle.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
      });
      
      // Rotate particles
      particles.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (rendererRef.current && mountRef.current) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Element already removed
        }
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-[#0a0618] via-[#1a0a2e] to-[#000000]"
    />
  );
};

export default HarryPotterAuthBackground;