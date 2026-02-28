import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore - GLTFLoader types not properly exported
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Origami3DLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    origami?: THREE.Group;
    particles: THREE.Points[];
    animationId?: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 🔥 Protection contre le double mount de StrictMode
    let isMounted = true;
    const currentMount = mountRef.current;

    // Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Vérifie qu'on est toujours monté avant d'ajouter le canvas
    if (!isMounted) {
      renderer.dispose();
      return;
    }
    
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x6366f1, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    directionalLight2.position.set(-5, -5, 5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0x06b6d4, 1, 100);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles: []
    };

    // ========================================
    // LOAD GLB MODEL (INSIDE useEffect!)
    // ========================================
    const loader = new GLTFLoader();
    
    // Fonction pour créer et configurer l'origami
    const setupOrigami = (origamiModel: THREE.Group) => {
      // Center the model
      const box = new THREE.Box3().setFromObject(origamiModel);
      const center = box.getCenter(new THREE.Vector3());
      origamiModel.position.sub(center);
      
      // Auto-scale based on model size
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      origamiModel.scale.set(scale, scale, scale);
      
      // Enable transparency for fade-out effect
      origamiModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            // Clone le matériau pour éviter les conflits
            if (Array.isArray(child.material)) {
              child.material = child.material.map(mat => mat.clone());
              child.material.forEach((mat: any) => {
                mat.transparent = true;
                mat.opacity = 1;
              });
            } else {
              child.material = child.material.clone();
              child.material.transparent = true;
              child.material.opacity = 1;
            }
          }
        }
      });
      
      scene.add(origamiModel);
      if (sceneRef.current) {
        sceneRef.current.origami = origamiModel;
      }
    };
    
    loader.load(
      'models/3d_origami_crane.glb',
      (gltf: any) => {
        console.log('✅ Origami GLB loaded successfully!');
        console.log('Model info:', gltf.scene);
        setupOrigami(gltf.scene);
      },
      (progress: any) => {
        if (progress.total > 0) {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading GLB: ${percent.toFixed(1)}%`);
        }
      },
      (error: any) => {
        console.error('❌ Error loading GLB:', error);
        console.log('Trying fallback geometry...');
        createFallbackOrigami(scene);
      }
    );

    // Create particles
    createParticles(scene);

    // Animation
    let startTime = Date.now();
    const duration = 3500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setLoadingProgress(Math.floor(progress * 100));

      if (sceneRef.current?.origami) {
        const origami = sceneRef.current.origami;
        
        // Rotation continue
        origami.rotation.y += 0.01;
        origami.rotation.x = Math.sin(elapsed * 0.001) * 0.2;

        // Dépliage progressif (scale et morph)
        if (progress < 0.7) {
          const unfoldProgress = progress / 0.7;
          origami.scale.set(
            1 + unfoldProgress * 0.5,
            1 + unfoldProgress * 0.5,
            1 - unfoldProgress * 0.3
          );
        } else {
          // Explosion finale
          const explosionProgress = (progress - 0.7) / 0.3;
          origami.scale.set(
            1.5 + explosionProgress * 2,
            1.5 + explosionProgress * 2,
            0.7 - explosionProgress * 0.7
          );
          
          // Fade out
          origami.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const material = child.material as THREE.MeshPhongMaterial;
              material.opacity = 1 - explosionProgress;
            }
          });
        }
      }

      // Animate particles
      sceneRef.current?.particles.forEach((particleSystem, index) => {
        particleSystem.rotation.y += 0.001 * (index + 1);
        particleSystem.rotation.x += 0.0005 * (index + 1);
        
        if (progress > 0.6) {
          const explosionProgress = (progress - 0.6) / 0.4;
          const positions = particleSystem.geometry.attributes.position.array as Float32Array;
          const originalPositions = (particleSystem.userData as any).originalPositions as Float32Array;
          
          for (let i = 0; i < positions.length; i += 3) {
            const distance = explosionProgress * 15;
            const angle = (i / positions.length) * Math.PI * 2 + elapsed * 0.001;
            positions[i] = originalPositions[i] + Math.cos(angle) * distance;
            positions[i + 1] = originalPositions[i + 1] + Math.sin(angle) * distance;
            positions[i + 2] = originalPositions[i + 2] + (Math.random() - 0.5) * distance;
          }
          
          particleSystem.geometry.attributes.position.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);

      if (progress < 1) {
        sceneRef.current!.animationId = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, 300);
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // 🔥 Cleanup complet pour éviter les doublons
      isMounted = false;
      
      window.removeEventListener("resize", handleResize);
      
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (sceneRef.current?.renderer) {
        // Retire le canvas DOM
        if (currentMount && sceneRef.current.renderer.domElement.parentNode === currentMount) {
          currentMount.removeChild(sceneRef.current.renderer.domElement);
        }
        
        // Dispose Three.js resources
        sceneRef.current.renderer.dispose();
      }
      
      // Cleanup Three.js scene
      if (sceneRef.current?.scene) {
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [onComplete]);

  const createFallbackOrigami = (scene: THREE.Scene) => {
    console.log('⚠️ Using fallback geometry');
    const origamiGroup = new THREE.Group();

    const bodyGeometry = new THREE.ConeGeometry(0.8, 1.5, 4);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      shininess: 100,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 4;
    origamiGroup.add(body);

    const wingGeometry = new THREE.ConeGeometry(0.6, 1.2, 3);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      shininess: 100,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-1, 0.2, 0);
    leftWing.rotation.z = Math.PI / 3;
    origamiGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial.clone());
    rightWing.position.set(1, 0.2, 0);
    rightWing.rotation.z = -Math.PI / 3;
    origamiGroup.add(rightWing);

    const headGeometry = new THREE.ConeGeometry(0.3, 0.6, 4);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      shininess: 100,
      transparent: true,
      opacity: 1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 1, 0);
    origamiGroup.add(head);

    const tailGeometry = new THREE.ConeGeometry(0.2, 1, 4);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial.clone());
    tail.position.set(0, -1.2, 0);
    tail.rotation.x = Math.PI;
    origamiGroup.add(tail);

    scene.add(origamiGroup);
    if (sceneRef.current) {
      sceneRef.current.origami = origamiGroup;
    }
  };

  const createParticles = (scene: THREE.Scene) => {
    const particleCount = 1000;
    
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let j = 0; j < particleCount; j++) {
        const radius = 3 + i;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        const color = i === 0 ? 0x6366f1 : i === 1 ? 0x8b5cf6 : 0x06b6d4;
        const c = new THREE.Color(color);
        colors[j * 3] = c.r;
        colors[j * 3 + 1] = c.g;
        colors[j * 3 + 2] = c.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(geometry, material);
      particles.userData.originalPositions = new Float32Array(positions);
      scene.add(particles);
      
      if (sceneRef.current) {
        sceneRef.current.particles.push(particles);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900">
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-pulse">
            {loadingProgress}%
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-mono font-bold text-white tracking-widest">
              {loadingProgress < 30 ? "INITIALIZING" : 
               loadingProgress < 70 ? "UNFOLDING" : 
               "LAUNCHING"}
            </h1>
            
            <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-150" />
      </div>
    </div>
  );
};

export const AppLoader = ({ onComplete }: { onComplete: () => void }) => {
  return <Origami3DLoader onComplete={onComplete} />;
};