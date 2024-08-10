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
      // Rotate the duck
      duckRef.current.rotation.y += delta

      // Move the duck smoothly towards the target position
      duckRef.current.position.x += (targetPosition[0] - duckRef.current.position.x) * 0.1
      duckRef.current.position.z += (targetPosition[2] - duckRef.current.position.z) * 0.1
    }
  })

  return <primitive ref={duckRef} object={scene} position={position} scale={[0.5, 0.5, 0.5]} />
}

const GridSquare = ({ position, size, gridX, gridZ, onClick, isCharacterHere, isSelected }) => {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const { raycaster } = useThree()

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
    onClick(gridX, gridZ)
  }

  const color = isSelected ? 'yellow' : isCharacterHere ? 'green' : hovered ? 'gray' : 'black'

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]} onClick={handleClick}>
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
  const { raycaster, mouse, camera } = useThree()
  const [characterPosition, setCharacterPosition] = useState([0, 0])
  const [targetPosition, setTargetPosition] = useState([0, 0])
  const [selectedPosition, setSelectedPosition] = useState(null)

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera)
  })

  const handleSquareClick = (x, z) => {
    console.log('Clicked:', x, z)
    console.log('Character at:', characterPosition)
    console.log('Selected:', selectedPosition)

    if (selectedPosition) {
      // Set target position for smooth movement
      setTargetPosition([x, z])
      setSelectedPosition(null)
    } else if (x === characterPosition[0] && z === characterPosition[1]) {
      // Select character
      setSelectedPosition([x, z])
    } else {
      // Deselect if clicking elsewhere
      setSelectedPosition(null)
    }
  }

  const squares = useMemo(() => {
    const squaresArray = []
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const position = [(x - size / 2 + 0.5) * tileSize, 0, (z - size / 2 + 0.5) * tileSize]
        squaresArray.push(
          <GridSquare
            key={`${x}-${z}`}
            position={position}
            size={tileSize}
            gridX={x}
            gridZ={z}
            onClick={handleSquareClick}
            isCharacterHere={x === characterPosition[0] && z === characterPosition[1]}
            isSelected={selectedPosition && x === selectedPosition[0] && z === selectedPosition[1]}
          />,
        )
      }
    }
    return squaresArray
  }, [size, tileSize, characterPosition, selectedPosition])

  const characterWorldPosition = [
    (characterPosition[0] - size / 2 + 0.5) * tileSize,
    0.5,
    (characterPosition[1] - size / 2 + 0.5) * tileSize,
  ]

  const targetWorldPosition = [
    (targetPosition[0] - size / 2 + 0.5) * tileSize,
    0.5,
    (targetPosition[1] - size / 2 + 0.5) * tileSize,
  ]

  useFrame(() => {
    // Update character position based on target position
    const newX = characterPosition[0] + (targetPosition[0] - characterPosition[0]) * 0.1
    const newZ = characterPosition[1] + (targetPosition[1] - characterPosition[1]) * 0.1

    if (Math.abs(newX - targetPosition[0]) < 0.01 && Math.abs(newZ - targetPosition[1]) < 0.01) {
      setCharacterPosition(targetPosition)
    } else {
      setCharacterPosition([newX, newZ])
    }
  })

  return (
    <group userData={{ isGround: true }}>
      {squares}
      <Duck position={characterWorldPosition} targetPosition={targetWorldPosition} />
    </group>
  )
}

export default Ground
