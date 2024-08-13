import React, { useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Character } from '../character/Character'
import { GridSquare } from './GridSquare'

const Ground = ({ size = 8, tileSize = 1 }) => {
  const [characters, setCharacters] = useState([
    { position: [0, 0], targetPosition: [0, 0], id: 12311 },
    { position: [7, 7], targetPosition: [7, 7], id: 212313 },
    // Add more characters as needed
  ])

  const { raycaster, mouse, camera } = useThree()
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)
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

      if (gridX >= 0 && gridX < size && gridZ >= 0 && gridZ < size) {
        if (selectedCharacterId !== null) {
          setCharacters((prevCharacters) =>
            prevCharacters.map((char) =>
              char.id === selectedCharacterId ? { ...char, targetPosition: [gridX, gridZ] } : char,
            ),
          )
          setSelectedCharacterId(null)
        } else {
          const clickedCharacter = characters.find((char) => char.position[0] === gridX && char.position[1] === gridZ)
          if (clickedCharacter) {
            setSelectedCharacterId(clickedCharacter.id)
          } else {
            setSelectedCharacterId(null)
          }
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
        const characterOnSquare = characters.find((char) => char.position[0] === x && char.position[1] === z)
        if (characterOnSquare) {
          color = characterOnSquare.id === selectedCharacterId ? 'yellow' : 'green'
        }
        if (hoveredSquare && x === hoveredSquare[0] && z === hoveredSquare[1]) color = 'gray'

        squaresArray.push(<GridSquare key={`${x}-${z}`} position={position} size={tileSize} color={color} />)
      }
    }
    return squaresArray
  }, [size, tileSize, characters, selectedCharacterId, hoveredSquare])

  const getWorldPosition = (gridPosition) => [
    (gridPosition[0] - size / 2 + 0.5) * tileSize,
    0,
    (size - 1 - gridPosition[1] - size / 2 + 0.5) * tileSize,
  ]

  useFrame(() => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((char) => {
        const newX = char.position[0] + (char.targetPosition[0] - char.position[0]) * 0.1
        const newZ = char.position[1] + (char.targetPosition[1] - char.position[1]) * 0.1

        if (Math.abs(newX - char.targetPosition[0]) < 0.01 && Math.abs(newZ - char.targetPosition[1]) < 0.01) {
          return { ...char, position: char.targetPosition }
        } else {
          return { ...char, position: [newX, newZ] }
        }
      }),
    )
  })

  return (
    <group userData={{ isGround: true }}>
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={handleClick}>
        <planeGeometry args={[size * tileSize, size * tileSize]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {squares}
      {characters.map((char, i) => {
        const charWorldPosition = getWorldPosition(char.position)
        const charTargetWorldPosition = getWorldPosition(char.targetPosition)
        return (
          <Character idx={i + 1} key={char.id} position={charWorldPosition} targetPosition={charTargetWorldPosition} />
        )
      })}
    </group>
  )
}

export default Ground
