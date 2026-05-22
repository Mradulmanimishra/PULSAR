/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { RigidBody } from '@react-three/rapier';
import { Grid, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

// Seeded PRNG for consistent multiplayer obstacle generation
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Arena() {
  const isMobile = useIsMobile();

  const obstacles = useMemo(() => {
    const count = isMobile ? 60 : 150;
    const rng = mulberry32(12345);
    return Array.from({ length: count })
      .map(() => {
        const x = (rng() - 0.5) * 170;
        const z = (rng() - 0.5) * 170;

        // Keep center clear
        if (Math.abs(x) < 20 && Math.abs(z) < 20) return null;

        const height = rng() * 8 + 6;
        const isHorizontal = rng() > 0.5;
        const width = isHorizontal ? rng() * 25 + 10 : rng() * 3 + 1;
        const depth = isHorizontal ? rng() * 3 + 1 : rng() * 25 + 10;
        const color = rng() > 0.5 ? '#00ffff' : '#ff00ff';

        return {
          position: [x, height / 2 - 0.5, z] as [number, number, number],
          size: [width, height, depth] as [number, number, number],
          color,
        };
      })
      .filter(Boolean);
  }, [isMobile]);

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" name="floor" friction={0}>
        <mesh receiveShadow={!isMobile} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#050510" roughness={0.2} metalness={0.8} />
        </mesh>
      </RigidBody>
      <Grid
        position={[0, -0.49, 0]}
        args={[200, 200]}
        cellColor="#ff00ff"
        sectionColor="#00ffff"
        fadeDistance={100}
        cellThickness={0.5}
        sectionThickness={1.5}
      />

      {/* Ceiling */}
      <RigidBody type="fixed" name="ceiling">
        <mesh receiveShadow={!isMobile} position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#000000" roughness={1} />
        </mesh>
      </RigidBody>

      {/* Atmosphere */}
      {!isMobile && (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
          <AmbientParticles />
        </>
      )}

      {/* Walls */}
      <Wall name="wall-n" position={[0, 5, -100]}  rotation={[0, 0, 0]}           isMobile={isMobile} />
      <Wall name="wall-s" position={[0, 5, 100]}   rotation={[0, Math.PI, 0]}     isMobile={isMobile} />
      <Wall name="wall-e" position={[100, 5, 0]}   rotation={[0, -Math.PI / 2, 0]} isMobile={isMobile} />
      <Wall name="wall-w" position={[-100, 5, 0]}  rotation={[0, Math.PI / 2, 0]} isMobile={isMobile} />

      {/* Obstacles */}
      {obstacles.map((obs, i) => {
        if (!obs) return null;
        return (
          <RigidBody
            key={i}
            type="fixed"
            colliders="hull"
            name={`obstacle-${i}`}
            position={obs.position}
            rotation={[0, 0, 0]}
          >
            <mesh receiveShadow={!isMobile} castShadow={!isMobile}>
              <boxGeometry args={obs.size} />
              <meshStandardMaterial color="#1a1a2e" roughness={0.6} metalness={0.5} />

              {/* Neon top accent */}
              <mesh position={[0, obs.size[1] / 2 - 0.5, 0]}>
                <boxGeometry args={[obs.size[0] + 0.1, 0.2, obs.size[2] + 0.1]} />
                <meshBasicMaterial color={obs.color} toneMapped={false} />
              </mesh>
            </mesh>
          </RigidBody>
        );
      })}
    </group>
  );
}

function Wall({
  name,
  position,
  rotation,
  isMobile,
}: {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isMobile: boolean;
}) {
  return (
    <RigidBody type="fixed" name={name} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[200, 10, 1]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Glowing base strip */}
      <mesh position={[0, -4.5, 0.51]}>
        <planeGeometry args={[200, 1]} />
        <meshBasicMaterial color="#ff00ff" toneMapped={false} />
      </mesh>
      {/* Glowing top strip */}
      <mesh position={[0, 4.5, 0.51]}>
        <planeGeometry args={[200, 1]} />
        <meshBasicMaterial color="#00ffff" toneMapped={false} />
      </mesh>
    </RigidBody>
  );
}

function AmbientParticles() {
  const count = 1500;
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      sizes[i] = Math.random() * 0.8 + 0.4;
    }
    return [positions, sizes];
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color('#ffffff') } }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize"    count={count} array={sizes}     itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          attribute float aSize;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            pos.y += uTime * 0.5;
            pos.x += sin(uTime * 0.2 + pos.y) * 2.0;
            pos.z += cos(uTime * 0.2 + pos.y) * 2.0;
            pos.y = mod(pos.y, 40.0);
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize * (300.0 / -mvPosition.z);
            vAlpha = smoothstep(0.0, 5.0, pos.y) * smoothstep(40.0, 35.0, pos.y);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float alpha = smoothstep(0.5, 0.1, d) * 0.5 * vAlpha;
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
}
