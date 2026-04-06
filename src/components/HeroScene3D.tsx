import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Torus, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ════════════════════════════════════════════
   SPORTS EQUIPMENT — 3D Geometry Shapes
   ════════════════════════════════════════════ */

// ─── Dumbbell ───
function Dumbbell({ position, color = "#2E9E6E", speed = 1 }: { position: [number, number, number]; color?: string; speed?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.3;
      group.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
    }
  });

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.4} floatIntensity={1.5} floatingRange={[-0.2, 0.2]}>
      <group ref={group} position={position} scale={0.6}>
        {/* Bar */}
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 12]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Weight plates — left */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Weight plates — right */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Football / Soccer Ball ───
function Football({ position, color = "#f5f5f5", speed = 1, size = 0.35 }: { position: [number, number, number]; color?: string; speed?: number; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6 * speed;
    }
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.6} floatIntensity={1.8} floatingRange={[-0.3, 0.3]}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} flatShading />
      </mesh>
    </Float>
  );
}

// ─── Swimming Goggles ───
function SwimmingGoggles({ position, color = "#3B82F6", speed = 1 }: { position: [number, number, number]; color?: string; speed?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.4;
      group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2 * speed) * 0.15;
    }
  });

  return (
    <Float speed={1.3 * speed} rotationIntensity={0.3} floatIntensity={1.2}>
      <group ref={group} position={position} scale={0.55}>
        {/* Left lens */}
        <mesh position={[-0.35, 0, 0]}>
          <torusGeometry args={[0.25, 0.08, 12, 24]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.2} transparent opacity={0.8} />
        </mesh>
        {/* Left glass */}
        <mesh position={[-0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 24]} />
          <meshStandardMaterial color="#87CEEB" metalness={0.5} roughness={0.1} transparent opacity={0.4} />
        </mesh>
        {/* Right lens */}
        <mesh position={[0.35, 0, 0]}>
          <torusGeometry args={[0.25, 0.08, 12, 24]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.2} transparent opacity={0.8} />
        </mesh>
        {/* Right glass */}
        <mesh position={[0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 24]} />
          <meshStandardMaterial color="#87CEEB" metalness={0.5} roughness={0.1} transparent opacity={0.4} />
        </mesh>
        {/* Bridge */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.18, 0.06, 0.06]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.3} />
        </mesh>
        {/* Strap — left */}
        <mesh position={[-0.65, 0, 0.05]}>
          <boxGeometry args={[0.12, 0.05, 0.04]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        {/* Strap — right */}
        <mesh position={[0.65, 0, 0.05]}>
          <boxGeometry args={[0.12, 0.05, 0.04]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Tennis Racket ───
function TennisRacket({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.25;
      group.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={1.1 * speed} rotationIntensity={0.5} floatIntensity={1.4}>
      <group ref={group} position={position} scale={0.5}>
        {/* Head — oval ring */}
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.35, 0.04, 8, 24]} />
          <meshStandardMaterial color="#22c55e" metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Net — simple disc */}
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.32, 24]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.15} wireframe />
        </mesh>
        {/* Handle */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#8B4513" metalness={0.2} roughness={0.6} />
        </mesh>
        {/* Grip */}
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.15, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Basketball ───
function Basketball({ position, speed = 1, size = 0.3 }: { position: [number, number, number]; speed?: number; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.35 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.25 * speed;
    }
  });

  return (
    <Float speed={1.4 * speed} rotationIntensity={0.7} floatIntensity={2} floatingRange={[-0.25, 0.25]}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial color="#f97316" roughness={0.5} metalness={0.1} distort={0.08} speed={1.5} />
      </mesh>
    </Float>
  );
}

// ─── Medal / Trophy star ───
function Medal({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.5 * speed;
    }
  });

  return (
    <Float speed={1.6 * speed} rotationIntensity={0.3} floatIntensity={1.3}>
      <group ref={group} position={position} scale={0.45}>
        {/* Ribbon */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.15, 0.35, 0.02]} />
          <meshStandardMaterial color="#ef4444" metalness={0.2} roughness={0.5} />
        </mesh>
        {/* Medal disc */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.15} />
        </mesh>
        {/* Star emboss */}
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 5]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Whistle ───
function Whistle({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 * speed) * 0.3;
    }
  });

  return (
    <Float speed={1.2 * speed} rotationIntensity={0.4} floatIntensity={1.6}>
      <group ref={group} position={position} scale={0.5}>
        {/* Body */}
        <RoundedBox args={[0.5, 0.25, 0.2]} radius={0.06} position={[0, 0, 0]}>
          <meshStandardMaterial color="#a3a3a3" metalness={0.7} roughness={0.2} />
        </RoundedBox>
        {/* Mouthpiece */}
        <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.04, 0.25, 8]} />
          <meshStandardMaterial color="#a3a3a3" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Ring */}
        <Torus args={[0.08, 0.02, 8, 16]} position={[0.3, 0.15, 0]}>
          <meshStandardMaterial color="#d4d4d4" metalness={0.8} roughness={0.15} />
        </Torus>
      </group>
    </Float>
  );
}

// ─── Particles ───
function Particles({ count = 50 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#2E9E6E" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ════════════════════════════════════════════
   SCENE — Layout all sports equipment
   ════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} color="#ffffff" />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#66d9a0" />
      <pointLight position={[0, 0, 4]} intensity={0.3} color="#f5a623" />

      {/* ── Top-right: Dumbbell ── */}
      <Dumbbell position={[4.2, 2, -1]} color="#2E9E6E" speed={0.7} />

      {/* ── Top-left: Swimming Goggles ── */}
      <SwimmingGoggles position={[-4, 1.8, 0]} color="#3B82F6" speed={0.8} />

      {/* ── Right-center: Football ── */}
      <Football position={[4.8, -0.5, -0.5]} color="#f5f5f5" speed={1} size={0.35} />

      {/* ── Left-bottom: Basketball ── */}
      <Basketball position={[-4.5, -1.5, 0.5]} speed={0.9} size={0.3} />

      {/* ── Bottom-right: Tennis Racket ── */}
      <TennisRacket position={[3.5, -2.2, -1]} speed={0.6} />

      {/* ── Top-center-left: Medal ── */}
      <Medal position={[-2.5, 2.5, -1.5]} speed={1.1} />

      {/* ── Bottom-left: Whistle ── */}
      <Whistle position={[-3, -2.5, 0]} speed={0.7} />

      {/* ── Far right small football ── */}
      <Football position={[5.5, 1, -2]} color="#fbbf24" speed={1.3} size={0.2} />

      {/* Particles */}
      <Particles count={60} />
    </>
  );
}

export default function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-[1]" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
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
