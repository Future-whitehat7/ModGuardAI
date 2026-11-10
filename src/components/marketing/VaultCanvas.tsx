import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const MONOLITH_TEXTURE = '/textures/monolith-obsidian-lattice.webp';

const motion = {
  x: 0,
  y: 0,
  scale: 1,
};

function useSlotTexture() {
  const [map, setMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const load = async () => {
      try {
        const response = await fetch(MONOLITH_TEXTURE, { method: 'HEAD' });
        if (!response.ok) return;
        const texture = await loader.loadAsync(MONOLITH_TEXTURE);
        if (cancelled) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setMap(texture);
      } catch {
        // A missing file keeps the solid obsidian material.
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return map;
}

function MonolithMesh() {
  const group = useRef<THREE.Group>(null);
  const map = useSlotTexture();
  const shell = useMemo(() => {
    if (map) {
      return new THREE.MeshStandardMaterial({ map, metalness: 0.45, roughness: 0.4 });
    }
    return new THREE.MeshStandardMaterial({ color: '#0A0A0A', metalness: 0.35, roughness: 0.55 });
  }, [map]);

  useEffect(() => () => {
    shell.dispose();
    map?.dispose();
  }, [shell, map]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += delta * 0.28;
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, motion.y * 0.4, 0.08);
    node.rotation.z = THREE.MathUtils.lerp(node.rotation.z, -motion.x * 0.25, 0.08);
    motion.scale = THREE.MathUtils.lerp(motion.scale, 1, 0.04);
    const scale = THREE.MathUtils.lerp(node.scale.x, motion.scale, 0.12);
    node.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <mesh material={shell}>
        <boxGeometry args={[1.05, 1.62, 1.05]} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.78, 0]} />
        <meshBasicMaterial color="#1F5BFF" wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function bindMotion(root: HTMLElement, mobile: boolean) {
  let lastY = window.scrollY;
  let lastTime = performance.now();
  const onScroll = () => {
    const now = performance.now();
    const delta = Math.abs(window.scrollY - lastY);
    const elapsed = Math.max(16, now - lastTime);
    motion.scale = THREE.MathUtils.clamp(1 - (delta / elapsed) * 0.85, 0.84, 1);
    lastY = window.scrollY;
    lastTime = now;
  };
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const rect = root.getBoundingClientRect();
    motion.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    motion.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (!mobile) window.addEventListener('pointermove', onPointer, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointer);
  };
}

export function VaultCanvas({ onFail }: { onFail: () => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  useEffect(() => {
    const node = stage.current;
    if (!node) return undefined;
    const unbind = bindMotion(node, mobile);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(Boolean(entry?.isIntersecting));
    });
    observer.observe(node);
    return () => {
      unbind();
      observer.disconnect();
    };
  }, [mobile]);

  return (
    <div ref={stage} className="vault-fill">
      <Canvas
        dpr={mobile ? 1 : [1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 3.4], fov: 35 }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            onFail();
          });
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 3, 4]} intensity={1.1} />
        <MonolithMesh />
      </Canvas>
    </div>
  );
}
