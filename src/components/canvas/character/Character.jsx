import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import * as THREE from 'three'
import './styles.css'

export function Character({ position, idx, targetPosition, ...props }) {
  const group = useRef()
  const { nodes, animations, materials } = useGLTF('/test' + idx + '.glb')
  const { actions } = useAnimations(animations, group)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { camera, raycaster, pointer } = useThree()

  // Create quaternions for base orientation and rotation
  const baseOrientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
  const rotationQuaternion = new THREE.Quaternion()

  const boundingSphere = useMemo(() => {
    const sphere = new THREE.Sphere()
    const box = new THREE.Box3()
    if (group.current) {
      box.setFromObject(group.current)
      box.getBoundingSphere(sphere)
    }

    return sphere
  }, [])

  useEffect(() => {
    if (actions.idle) actions.idle.play()
  }, [actions])

  useFrame((state, delta) => {
    if (group.current) {
      // Update position
      group.current.position.lerp(new THREE.Vector3(position[0], position[1], position[2]), 0.1)
      const box = new THREE.Box3().setFromObject(group.current)
      box.getBoundingSphere(boundingSphere)
      boundingSphere.radius = Math.max(boundingSphere.radius, 0.6) // Set a minimum radius

      if (targetPosition) {
        const direction = new THREE.Vector3(targetPosition[0] - position[0], 0, targetPosition[2] - position[2])

        if (direction.length() > 0.1) {
          // Calculate rotation based on direction
          const angle = Math.atan2(direction.x, direction.z)
          rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle)

          // Combine base orientation with rotation
          const finalQuaternion = new THREE.Quaternion().multiplyQuaternions(rotationQuaternion, baseOrientation)

          // Apply smooth rotation
          group.current.quaternion.slerp(finalQuaternion, 0.1)

          // Switch to walking animation if it exists
          if (actions.run && !actions.run.isRunning()) {
            actions.idle.stop()
            actions.run.play()
          }
        } else {
          // If not moving, only apply base orientation
          group.current.quaternion.slerp(baseOrientation, 0.1)

          // Switch back to idle animation
          if (actions.idle && !actions.idle.isRunning()) {
            actions.run?.stop()
            actions.idle.play()
          }
        }
      }
      // Raycasting
      raycaster.setFromCamera(pointer, camera)

      const intersects = raycaster.ray.intersectSphere(boundingSphere, new THREE.Vector3())

      if (intersects) {
        if (!hovered) {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }
        // Apply highlight effect
        group.current.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x00ff00)
            child.material.emissiveIntensity = 0.5
          }
        })
      } else if (hovered) {
        setHovered(false)
        document.body.style.cursor = 'default'
        // Reset highlight effect
        group.current.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x000000)
            child.material.emissiveIntensity = 0
          }
        })
      }
    }
  })

  const handleClick = (event) => {
    event.stopPropagation()
    setClicked(!clicked)
  }

  return (
    <group ref={group} {...props} scale={0.007} onClick={handleClick}>
      {clicked && (
        <Html distanceFactor={10}>
          <div className='content'>
            hello <br />
            world
          </div>
        </Html>
      )}
      <primitive object={nodes.mixamorigHips} />
      <skinnedMesh
        geometry={nodes.Beta_Joints.geometry}
        skeleton={nodes.Beta_Joints.skeleton}
        material={materials.Beta_Joints_MAT1}
      />
      <skinnedMesh
        geometry={nodes.Beta_Surface.geometry}
        skeleton={nodes.Beta_Surface.skeleton}
        material={materials.Beta_HighLimbsGeoSG3}
      />
    </group>
  )
}

useGLTF.preload('/test.glb')
