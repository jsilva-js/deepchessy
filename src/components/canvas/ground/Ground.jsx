'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Character } from '../character/Character'
import { GridSquare } from './GridSquare'

const Ground = ({ size = 8, tileSize = 1 }) => {
  const { raycaster, mouse, camera } = useThree()
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
    const intersects = raycaster.intersectObject(groundRef.current)

    if (intersects.length > 0) {
      const [gridX, gridZ] = getGridPosition(intersects[0].point.x, intersects[0].point.z)
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

    const intersects = raycaster.intersectObject(groundRef.current)

    if (intersects.length > 0) {
      const [gridX, gridZ] = getGridPosition(intersects[0].point.x, intersects[0].point.z)

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
        const position = [(x - size / 2 + 0.5) * tileSize, 0.01, (size - 1 - z - size / 2 + 0.5) * tileSize]
        let color = 'black'
        if (x === characterPosition[0] && z === characterPosition[1]) color = 'green'
        if (selectedPosition && x === selectedPosition[0] && z === selectedPosition[1]) color = 'yellow'
        if (hoveredSquare && x === hoveredSquare[0] && z === hoveredSquare[1]) color = 'gray'

        squaresArray.push(<GridSquare key={`${x}-${z}`} position={position} size={tileSize} color={color} />)
      }
    }
    return squaresArray
  }, [size, tileSize, characterPosition, selectedPosition, hoveredSquare])

  const getWorldPosition = (gridPosition) => [
    (gridPosition[0] - size / 2 + 0.5) * tileSize,
    0,
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
    <group userData={{ isGround: true }}>
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={handleClick}>
        <planeGeometry args={[size * tileSize, size * tileSize]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {squares}
      <Character position={characterWorldPosition} targetPosition={targetWorldPosition} />
    </group>
  )
}

export default Ground
