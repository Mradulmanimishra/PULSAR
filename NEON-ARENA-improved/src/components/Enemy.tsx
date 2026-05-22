/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, useRapier, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, EnemyData } from '../store';
import { Text } from '@react-three/drei';

const ENEMY_SPEED    = 3;
const CHASE_DIST     = 15;
const SHOOT_DIST     = 15;
const SHOOT_COOLDOWN = 3500;

export function Enemy({ data }: { data: EnemyData }) {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const { world, rapier } = useRapier();

  const gameState  = useGameStore(state => state.gameState);
  const playerState = useGameStore(state => state.playerState);
  const hitPlayer  = useGameStore(state => state.hitPlayer);
  const addLaser   = useGameStore(state => state.addLaser);
  const addParticles = useGameStore(state => state.addParticles);

  const lastShootTime   = useRef(0);
  const patrolTarget    = useRef(new THREE.Vector3());
  const lastPatrolChange = useRef(0);
  const aiState         = useRef<'patrol' | 'chase'>('patrol');
  const groupRef        = useRef<THREE.Group>(null);

  useMemo(() => {
    patrolTarget.current.set(
      data.position[0] + (Math.random() - 0.5) * 10,
      data.position[1],
      data.position[2] + (Math.random() - 0.5) * 10
    );
  }, [data.position]);

  useFrame(() => {
    if (!body.current || gameState !== 'playing' || data.state === 'disabled') {
      if (body.current) {
        body.current.setLinvel({ x: 0, y: body.current.linvel().y, z: 0 }, true);
      }
      return;
    }

    const pos = body.current.translation();
    const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);

    // FIX: bots only care about the local player — not other bots.
    // Previously they would chase/shoot each other, creating chaotic friendly-fire.
    let targetPos: THREE.Vector3 | null = null;
    let distToTarget = CHASE_DIST;

    if (playerState === 'active') {
      const playerPos = camera.position.clone();
      playerPos.y = pos.y; // flatten to ignore height diff
      const d = currentPos.distanceTo(playerPos);
      if (d < distToTarget) {
        distToTarget = d;
        targetPos = playerPos;
      }
    }

    // Update AI state
    if (targetPos) {
      aiState.current = 'chase';
    } else if (aiState.current === 'chase') {
      aiState.current = 'patrol';
      patrolTarget.current.set(
        currentPos.x + (Math.random() - 0.5) * 40,
        currentPos.y,
        currentPos.z + (Math.random() - 0.5) * 40
      );
      lastPatrolChange.current = Date.now();
    }

    const direction = new THREE.Vector3();

    if (aiState.current === 'chase' && targetPos) {
      direction.subVectors(targetPos, currentPos).normalize();

      // Shoot the player if close enough and cooled down
      const now = Date.now();
      if (distToTarget < SHOOT_DIST && now - lastShootTime.current > SHOOT_COOLDOWN) {
        const rayDir = direction.clone();

        // Add spread so they miss occasionally
        const spread = 0.15;
        rayDir.x += (Math.random() - 0.5) * spread;
        rayDir.y += (Math.random() - 0.5) * spread;
        rayDir.z += (Math.random() - 0.5) * spread;
        rayDir.normalize();

        const startPos = new THREE.Vector3(currentPos.x, currentPos.y + 0.5, currentPos.z)
          .add(rayDir.clone().multiplyScalar(1.5));

        const ray = new rapier.Ray(startPos, rayDir);
        const hit = world.castRay(ray, SHOOT_DIST, true);

        const laserStart: [number, number, number] = [startPos.x, startPos.y, startPos.z];

        if (hit) {
          const rb = hit.collider.parent();
          const hitPt = ray.pointAt(hit.timeOfImpact);
          const hitPos: [number, number, number] = [hitPt.x, hitPt.y, hitPt.z];

          if (rb?.userData && (rb.userData as { name?: string }).name === 'player') {
            hitPlayer();
            addParticles([camera.position.x, camera.position.y, camera.position.z], '#ff0000');
            addLaser(laserStart, [camera.position.x, camera.position.y, camera.position.z], '#ff0000');
          } else {
            // Hit a wall or obstacle — still show laser
            addParticles(hitPos, '#ff0000');
            addLaser(laserStart, hitPos, '#ff0000');
          }
          lastShootTime.current = now;
        }
      }
    } else {
      // Patrol
      const now = Date.now();
      if (
        currentPos.distanceTo(patrolTarget.current) < 2 ||
        now - lastPatrolChange.current > 4000
      ) {
        patrolTarget.current.set(
          currentPos.x + (Math.random() - 0.5) * 60,
          currentPos.y,
          currentPos.z + (Math.random() - 0.5) * 60
        );
        lastPatrolChange.current = now;
      }
      direction.subVectors(patrolTarget.current, currentPos).normalize();
    }

    // Move
    const velocity = body.current.linvel();
    body.current.setLinvel(
      { x: direction.x * ENEMY_SPEED, y: velocity.y, z: direction.z * ENEMY_SPEED },
      true
    );

    // Rotate to face movement direction
    if (groupRef.current && direction.lengthSq() > 0.1) {
      const targetRotation = Math.atan2(direction.x, direction.z);
      let diff = targetRotation - groupRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.1;
    }
  });

  const color = data.state === 'disabled' ? '#444' : '#ff0055';

  return (
    <RigidBody
      ref={body}
      colliders={false}
      mass={1}
      type="dynamic"
      position={data.position}
      enabledRotations={[false, false, false]}
      userData={{ name: data.id }}
    >
      <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
      <group ref={groupRef}>
        {/* Body */}
        <mesh castShadow position={[0, 1, 0]}>
          <capsuleGeometry args={[0.5, 1]} />
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={data.state === 'disabled' ? 0 : 0.4}
          />
        </mesh>

        {/* Eye / visor */}
        <mesh position={[0, 1.6, 0.45]}>
          <boxGeometry args={[0.6, 0.2, 0.2]} />
          <meshBasicMaterial color={data.state === 'disabled' ? '#111' : '#00ffff'} />
        </mesh>

        {/* Name label */}
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color={data.state === 'active' ? '#ff0055' : '#666666'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {data.id}
        </Text>
      </group>
    </RigidBody>
  );
}
