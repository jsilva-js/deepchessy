import { useGLTF } from '@react-three/drei'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function Character({ position, targetPosition }) {
  const { scene } = useGLTF('/duck.glb')
  const duckRef = useRef()

  useFrame((state, delta) => {
    if (duckRef.current) {
      duckRef.current.rotation.y += delta
      duckRef.current.position.x += (targetPosition[0] - duckRef.current.position.x) * 0.1
      duckRef.current.position.z += (targetPosition[2] - duckRef.current.position.z) * 0.1
    }
  })

  return <primitive ref={duckRef} object={scene} position={position} scale={[0.5, 0.5, 0.5]} />
}
