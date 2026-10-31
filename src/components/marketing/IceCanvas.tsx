import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Mesh, Points } from 'three';

const SNOW_COUNT = 48;

function Crystal() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.y += delta * 0.16;
    mesh.rotation.x += delta * 0.04;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.15, 0]} />
      <meshPhysicalMaterial
        color="#d7ecff"
        roughness={0.18}
        metalness={0.04}
        clearcoat={1}
        clearcoatRoughness={0.12}
        iridescence={0.85}
        iridescenceIOR={1.3}
      />
    </mesh>
  );
}

function FrostShell() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.y -= delta * 0.07;
    mesh.rotation.z += delta * 0.02;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.48, 1]} />
      <meshBasicMaterial color="#8fb8ff" wireframe transparent opacity={0.32} />
    </mesh>
  );
}

function Snow() {
  const positions = useMemo(() => {
    const values = new Float32Array(SNOW_COUNT * 3);
    for (let index = 0; index < SNOW_COUNT; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 7;
      values[index * 3 + 1] = (Math.random() - 0.5) * 7;
      values[index * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return values;
  }, []);
  const ref = useRef<Points>(null);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) return;
    const attribute = points.geometry.getAttribute('position');
    for (let index = 0; index < SNOW_COUNT; index += 1) {
      let y = attribute.getY(index) - delta * 0.11;
      if (y < -3.4) y = 3.4;
      attribute.setY(index, y);
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#cfe9ff"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <hemisphereLight args={['#cfe9ff', '#05070d', 0.55]} />
      <directionalLight position={[4, 3, 5]} intensity={2.1} color="#f4fbff" />
      <directionalLight position={[-3, -1, -2]} intensity={0.7} color="#7dd3fc" />
      <Crystal />
      <FrostShell />
      <Snow />
    </>
  );
}

interface IceCanvasProps {
  active: boolean;
}

export function IceCanvas({ active }: IceCanvasProps) {
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');

  useEffect(() => {
    const onChange = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 4.4], fov: 35 }}
      frameloop={active && pageVisible ? 'always' : 'never'}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Scene />
    </Canvas>
  );
}
