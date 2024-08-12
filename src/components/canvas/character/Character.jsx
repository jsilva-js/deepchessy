import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

export function Character({ position, targetPosition, ...props }) {
  const group = useRef()
  const { nodes, animations } = useGLTF('/test.glb')
  const { actions } = useAnimations(animations, group)

  // Create quaternions for base orientation and rotation
  const baseOrientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
  const rotationQuaternion = new THREE.Quaternion()

  useEffect(() => {
    if (actions.idle) actions.idle.play()
  }, [actions])

  useFrame((state, delta) => {
    if (group.current) {
      // Update position
      group.current.position.lerp(new THREE.Vector3(position[0], position[1], position[2]), 0.1)

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
    }
  })

  return (
    <group ref={group} {...props} scale={0.007}>
      <primitive object={nodes.mixamorigHips} />
      <skinnedMesh geometry={nodes.Beta_Joints.geometry} skeleton={nodes.Beta_Joints.skeleton} />
      <skinnedMesh geometry={nodes.Beta_Surface.geometry} skeleton={nodes.Beta_Surface.skeleton} />
    </group>
  )
}
