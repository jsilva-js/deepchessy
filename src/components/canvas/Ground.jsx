'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Duck({ position, targetPosition }) {
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

const GridSquare = ({ position, size, isCharacterHere, isSelected, isHovered }) => {
  const meshRef = useRef()
  const geometry = useMemo(() => new THREE.PlaneGeometry(size, size), [size])
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])

  const color = isSelected ? 'yellow' : isCharacterHere ? 'green' : isHovered ? 'gray' : 'black'

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry} receiveShadow>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color='white' linewidth={2} />
      </lineSegments>
    </group>
  )
}

const Ground = ({ size = 8, tileSize = 1 }) => {
  const { raycaster, mouse, camera, scene } = useThree()
  const [characterPosition, setCharacterPosition] = useState([0, 0])
  const [targetPosition, setTargetPosition] = useState([0, 0])
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [hoveredSquare, setHoveredSquare] = useState(null)

  const groundRef = useRef()

  const getGridPosition = (worldX, worldZ) => {
    const gridX = Math.floor((worldX + (size * tileSize) / 2) / tileSize)
    const gridZ = size - 1 - Math.floor((worldZ + (size * tileSize) / 2) / tileSize)
    return [gridX, gridZ]
  }

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    const planeIntersect = intersects.find((intersect) => intersect.object.parent?.parent === groundRef.current)

    if (planeIntersect) {
      const [gridX, gridZ] = getGridPosition(planeIntersect.point.x, planeIntersect.point.z)
      if (gridX >= 0 && gridX < size && gridZ >= 0 && gridZ < size) {
        setHoveredSquare([gridX, gridZ])
      } else {
        setHoveredSquare(null)
      }
    } else {
      setHoveredSquare(null)
    }
  })

  const handleClick = (event) => {
    event.stopPropagation()

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    const planeIntersect = intersects.find((intersect) => intersect.object.parent?.parent === groundRef.current)

    if (planeIntersect) {
      const [gridX, gridZ] = getGridPosition(planeIntersect.point.x, planeIntersect.point.z)

      console.log('Clicked:', gridX, gridZ)
      console.log('Character at:', characterPosition)
      console.log('Selected:', selectedPosition)

      if (gridX >= 0 && gridX < size && gridZ >= 0 && gridZ < size) {
        if (selectedPosition) {
          setTargetPosition([gridX, gridZ])
          setSelectedPosition(null)
        } else if (gridX === characterPosition[0] && gridZ === characterPosition[1]) {
          setSelectedPosition([gridX, gridZ])
        } else {
          setSelectedPosition(null)
        }
      }
    }
  }

  const squares = useMemo(() => {
    const squaresArray = []
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const position = [(x - size / 2 + 0.5) * tileSize, 0, (size - 1 - z - size / 2 + 0.5) * tileSize]
        squaresArray.push(
          <GridSquare
            key={`${x}-${z}`}
            position={position}
            size={tileSize}
            isCharacterHere={x === characterPosition[0] && z === characterPosition[1]}
            isSelected={selectedPosition && x === selectedPosition[0] && z === selectedPosition[1]}
            isHovered={hoveredSquare && x === hoveredSquare[0] && z === hoveredSquare[1]}
          />,
        )
      }
    }
    return squaresArray
  }, [size, tileSize, characterPosition, selectedPosition, hoveredSquare])

  const getWorldPosition = (gridPosition) => [
    (gridPosition[0] - size / 2 + 0.5) * tileSize,
    0.5,
    (size - 1 - gridPosition[1] - size / 2 + 0.5) * tileSize,
  ]

  const characterWorldPosition = getWorldPosition(characterPosition)
  const targetWorldPosition = getWorldPosition(targetPosition)

  useFrame(() => {
    const newX = characterPosition[0] + (targetPosition[0] - characterPosition[0]) * 0.1
    const newZ = characterPosition[1] + (targetPosition[1] - characterPosition[1]) * 0.1

    if (Math.abs(newX - targetPosition[0]) < 0.01 && Math.abs(newZ - targetPosition[1]) < 0.01) {
      setCharacterPosition(targetPosition)
    } else {
      setCharacterPosition([newX, newZ])
    }
  })

  return (
    <group ref={groundRef} userData={{ isGround: true }} onClick={handleClick}>
      {squares}
      <Duck position={characterWorldPosition} targetPosition={targetWorldPosition} />
    </group>
  )
}

export default Ground
