'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const GridSquare = ({ position, size, gridX, gridZ }) => {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const { camera, raycaster } = useThree()

  const geometry = useMemo(() => new THREE.PlaneGeometry(size, size), [size])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  useFrame(() => {
    if (meshRef.current) {
      const intersects = raycaster.intersectObject(meshRef.current)
      if (intersects.length > 0) {
        if (!hovered) setHovered(true)
      } else if (hovered) {
        setHovered(false)
      }
    }
  })

  const handleClick = (event) => {
    event.stopPropagation()
    console.log(`Clicked square at grid position: (${gridX}, ${gridZ})`)
    console.log(`World position: (${position[0]}, ${position[1]}, ${position[2]})`)
  }

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]} onClick={handleClick}>
      <mesh ref={meshRef} geometry={geometry} receiveShadow>
        <meshBasicMaterial color={hovered ? 'gray' : 'black'} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color='white' linewidth={2} />
      </lineSegments>
    </group>
  )
}

const Ground = ({ size = 8, tileSize = 1 }) => {
  const { raycaster, mouse, camera } = useThree()

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera)
  })

  const squares = useMemo(() => {
    const squaresArray = []
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        squaresArray.push(
          <GridSquare
            key={`${x}-${z}`}
            position={[(x - size / 2 + 0.5) * tileSize, 0, (z - size / 2 + 0.5) * tileSize]}
            size={tileSize}
            gridX={x}
            gridZ={z}
          />,
        )
      }
    }
    return squaresArray
  }, [size, tileSize])

  return <group userData={{ isGround: true }}>{squares}</group>
}

export default Ground
