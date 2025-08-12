'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei'
import * as THREE from 'three'

function GLTFObject({ url }: { url: string }) {
  // Lazy import to avoid SSR issues
  const { useGLTF } = require('@react-three/drei') as typeof import('@react-three/drei')
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene} />
}

export function Viewer3D({ meshUrl }: { meshUrl?: string }) {
  return (
    <Canvas camera={{ position: [200, 200, 200], fov: 50 }} style={{ height: '60vh' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} />
      <Grid args={[500, 50]} />
      <axesHelper args={[50]} />
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      {meshUrl && (
        <Suspense fallback={null}>
          <GLTFObject url={meshUrl} />
        </Suspense>
      )}
    </Canvas>
  )
}


