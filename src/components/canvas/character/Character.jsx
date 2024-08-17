import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Character({ position, idx, targetPosition, ...props }) {
  const group = useRef()
  const meshRef = useRef()

  useEffect(() => {
    // Set initial position
    if (group.current) {
      group.current.position.set(position[0], 0.5, position[2])
    }
  }, [position])

  useFrame((state, delta) => {
    if (group.current && targetPosition) {
      // Update position
      group.current.position.lerp(new THREE.Vector3(targetPosition[0], 0.5, targetPosition[2]), 0.1)

      // Calculate rotation based on movement direction
      const direction = new THREE.Vector3(
        targetPosition[0] - group.current.position.x,
        0,
        targetPosition[2] - group.current.position.z,
      )

      if (direction.length() > 0.1) {
        const angle = Math.atan2(direction.x, direction.z)
        group.current.rotation.y = angle
      }
    }
  })

  return (
    <group ref={group} {...props}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshBasicMaterial color={`hsl(${idx * 100}, 100%, 50%)`} wireframe />
      </mesh>
    </group>
  )
}
