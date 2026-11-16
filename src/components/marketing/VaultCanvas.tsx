import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const motion = { x: 0, y: 0 };

function GoldWire() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += delta * 0.22;
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, motion.y * 0.25, 0.08);
    node.rotation.z = THREE.MathUtils.lerp(node.rotation.z, -motion.x * 0.18, 0.08);
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1.05, 1.7, 1.05]} />
        <meshBasicMaterial color="#D4AF37" wireframe />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.82, 0]} />
        <meshBasicMaterial color="#1E3A8A" wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export function VaultCanvas({ onFail }: { onFail: () => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  useEffect(() => {
    const node = stage.current;
    if (!node) return undefined;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      motion.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      motion.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
    };
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(Boolean(entry?.isIntersecting));
    });
    observer.observe(node);
    if (!mobile) window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
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
          gl.setClearColor(0x000000, 0);
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            onFail();
          });
        }}
      >
        <GoldWire />
      </Canvas>
    </div>
  );
}
