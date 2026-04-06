import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Floating sports-themed shape
function SportBall({ position, color, speed = 1, size = 0.5 }: { position: [number, number, number]; color: string; speed?: number; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.6} floatIntensity={1.8} floatingRange={[-0.3, 0.3]}>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.3}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function FloatingRing({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.8} floatIntensity={1.5}>
      <Torus ref={meshRef} args={[0.4, 0.12, 16, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.5}
          transparent
          opacity={0.75}
        />
      </Torus>
    </Float>
  );
}

function FloatingCube({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.35 * speed;
    }
  });

  return (
    <Float speed={1.3 * speed} rotationIntensity={0.5} floatIntensity={1.2}>
      <RoundedBox ref={meshRef} args={[0.5, 0.5, 0.5]} radius={0.08} position={position}>
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.4}
          transparent
          opacity={0.7}
        />
      </RoundedBox>
    </Float>
  );
}

// Particles
function Particles({ count = 60 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#2E9E6E"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#66d9a0" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#f5a623" />

      {/* Main large ball — football-like */}
      <SportBall position={[2.2, 0.5, 0]} color="#2E9E6E" size={0.7} speed={0.7} />

      {/* Secondary balls */}
      <SportBall position={[-2.5, -0.8, -1]} color="#f5a623" size={0.45} speed={1.2} />
      <SportBall position={[-1, 1.5, -0.5]} color="#3B82F6" size={0.35} speed={0.9} />
      <SportBall position={[1.5, -1.5, 0.5]} color="#ef4444" size={0.3} speed={1.1} />

      {/* Rings — like olympic rings or hoops */}
      <FloatingRing position={[-2, 0.8, 0.5]} color="#2E9E6E" speed={0.8} />
      <FloatingRing position={[3, -0.5, -1]} color="#f5a623" speed={1.0} />

      {/* Cubes — like building blocks */}
      <FloatingCube position={[0.5, -1.2, 1]} color="#3B82F6" speed={0.6} />
      <FloatingCube position={[-3, -1.5, 0]} color="#a855f7" speed={0.9} />

      {/* Particles */}
      <Particles count={80} />
    </>
  );
}

export default function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-[1]" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
