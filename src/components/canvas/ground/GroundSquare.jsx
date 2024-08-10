'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'

export const GridSquare = ({ position, size, color }) => {
  const geometry = useMemo(() => new THREE.PlaneGeometry(size, size), [size])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geometry} receiveShadow>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color='white' linewidth={2} />
      </lineSegments>
    </group>
  )
}
