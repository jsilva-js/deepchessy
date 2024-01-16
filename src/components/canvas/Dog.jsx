'use client'

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 dog.glb 
*/

import { useGLTF, AccumulativeShadows, RandomizedLight } from '@react-three/drei'

export function Dog(props) {
  const { nodes, materials } = useGLTF('/dog.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.character_dog.geometry}
        material={materials['Beige.017']}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.character_dogArmLeft.geometry}
          material={materials['Beige.017']}
          position={[0.204, 0, -0.634]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.character_dogArmRight.geometry}
          material={materials['Beige.017']}
          position={[-0.204, 0, -0.634]}
        />
        <group position={[0, 0, -0.704]}>
          <mesh castShadow receiveShadow geometry={nodes.Cube1339.geometry} material={materials['Beige.017']} />
          <mesh castShadow receiveShadow geometry={nodes.Cube1339_1.geometry} material={materials['Red.034']} />
          <mesh castShadow receiveShadow geometry={nodes.Cube1339_2.geometry} material={materials['Black.026']} />
        </group>
      </mesh>

      <AccumulativeShadows temporal frames={100}>
        <RandomizedLight position={[5, 5, 5]} radius={5} />
      </AccumulativeShadows>
    </group>
  )
}

useGLTF.preload('/dog.glb')
