'use client'
import React, { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const GridSquare = ({ position, size }) => {
  const geometry = useMemo(() => new THREE.PlaneGeometry(size, size), [size])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geometry} receiveShadow>
        <meshBasicMaterial color='black' side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color='white' linewidth={2} />
      </lineSegments>
    </group>
  )
}

const Ground = ({ size = 8, tileSize = 1 }) => {
  const { raycaster, camera, scene } = useThree()
  const squares = useMemo(() => {
    const squaresArray = []
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        squaresArray.push(
          <GridSquare
            key={`${x}-${z}`}
            position={[(x - size / 2 + 0.5) * tileSize, 0, (z - size / 2 + 0.5) * tileSize]}
            size={tileSize}
          />,
        )
      }
    }
    return squaresArray
  }, [size, tileSize])

  const getIntersectingSquare = (x, y) => {
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    const intersects = raycaster.intersectObjects(scene.children, true)
    return intersects.find((intersect) => intersect.object.parent?.userData?.isGridSquare)?.object.parent
  }

  return (
    <group
      userData={{ isGround: true }}
      onClick={(event) => {
        event.stopPropagation()
        const square = getIntersectingSquare(event.clientX, event.clientY)
        if (square) {
          console.log('Clicked square at:', square.position)
          // You can add more logic here, like moving a character
        }
      }}
    >
      {squares}
    </group>
  )
}

export default Ground
