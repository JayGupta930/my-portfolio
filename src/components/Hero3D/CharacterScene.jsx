import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, MathUtils, Vector3 } from 'three';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

function Character({ modelUrl, modelYaw, progress, onReady }) {
  const { scene } = useGLTF(modelUrl);
  const group = useRef();
  const rim = useRef();
  const { camera, size, invalidate } = useThree();
  const { object, scale, center, floor } = useMemo(() => {
    const object = clone(scene);
    const bounds = new Box3().setFromObject(object);
    const dimensions = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    // A bounding sphere keeps boots/chair inside the camera at EVERY yaw angle.
    const scale = 2.9 / Math.max(dimensions.length(), 0.001);
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return { object, scale, center, floor: -dimensions.y * scale / 2 };
  }, [scene]);

  useEffect(() => {
    const verticalFov = MathUtils.degToRad(camera.fov / 2);
    const horizontalFov = Math.atan(Math.tan(verticalFov) * size.width / size.height);
    camera.position.set(0, 0, 1.68 / Math.sin(Math.min(verticalFov, horizontalFov)));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => {
    const state = progress.current;
    state.requestFrame = invalidate;
    invalidate();
    return () => { state.requestFrame = null; };
  }, [progress, invalidate]);

  useEffect(() => { onReady(); }, [onReady]);

  useFrame(() => {
    // GSAP's scrubbed playhead is the only clock: no idle/autoplay rotation.
    const p = progress.current.value;
    const reveal = Math.sin(p * Math.PI);
    group.current.rotation.y = modelYaw + (1 - Math.min(p / 0.9, 1)) * Math.PI;
    group.current.position.x = -0.065 * reveal;
    group.current.scale.setScalar(1 + 0.025 * reveal);
    rim.current.intensity = 2.2 + 1.3 * Math.sin(p * Math.PI);
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={['#ffffff', '#292929', 1]} />
      <directionalLight position={[3, 5, 5]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} shadow-normalBias={0.04} shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} />
      <directionalLight ref={rim} position={[-3, 2, -3]} intensity={2.2} />
      <directionalLight position={[-4, 1, 4]} intensity={0.8} />
      <group ref={group}>
        <group scale={scale}>
          <primitive object={object} position={[-center.x, -center.y, -center.z]} dispose={null} />
        </group>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floor - 0.05, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <shadowMaterial transparent opacity={0.24} />
      </mesh>
    </>
  );
}

export default function CharacterScene({ onFailure, ...props }) {
  const canvas = useRef(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const lost = (event) => { event.preventDefault(); onFailure(); };
    element.addEventListener('webglcontextlost', lost);
    return () => element.removeEventListener('webglcontextlost', lost);
  }, [onFailure]);

  return (
    <div className="hero3d-canvas" aria-hidden="true">
      <Canvas ref={canvas} frameloop="demand" dpr={[1, 1.5]} shadows camera={{ fov: 34, position: [0, 0, 6], near: 0.1, far: 100 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} fallback={null}>
        <Suspense fallback={null}><Character {...props} /></Suspense>
      </Canvas>
    </div>
  );
}
