import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ModelNode } from './ModelNode';

interface Model3D {
  id: string;
  name: string;
  type: 'imported' | 'primitive';
  mesh: THREE.Mesh | THREE.Group;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface ThreeJSEditorProps {
  models: Model3D[];
  selectedModelId: string | null;
  onModelSelect: (id: string | null) => void;
  onModelTransform: (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
}

function Scene({ models, selectedModelId, onModelSelect, onModelTransform, transformMode }: ThreeJSEditorProps) {
  const transformControlsRef = useRef<any>(null);
  const groupRefs = useRef<Map<string, THREE.Group>>(new Map());
  const selectedGroup = useMemo(() => selectedModelId ? groupRefs.current.get(selectedModelId) || null : null, [selectedModelId]);

  const selectedModel = models.find(m => m.id === selectedModelId);

  // Validate models array
  const validModels = models.filter(model => model && model.mesh && model.id);

  useEffect(() => {
    if (transformControlsRef.current && selectedGroup) {
      const controls = transformControlsRef.current;

      const handleChange = () => {
        if (selectedModel && selectedGroup) {
          onModelTransform(
            selectedModel.id,
            [selectedGroup.position.x, selectedGroup.position.y, selectedGroup.position.z],
            [selectedGroup.rotation.x, selectedGroup.rotation.y, selectedGroup.rotation.z],
            [selectedGroup.scale.x, selectedGroup.scale.y, selectedGroup.scale.z]
          );
        }
      };

      controls.addEventListener('objectChange', handleChange);
      return () => controls.removeEventListener('objectChange', handleChange);
    }
  }, [selectedModel, selectedGroup, onModelTransform]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} />
      <OrbitControls enableDamping dampingFactor={0.05} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Helpers */}
      <axesHelper args={[5]} />

      {/* Render all models */}
      {validModels.map((model) => (
        <ModelNode
          key={model.id}
          model={model}
          onSelect={onModelSelect}
          onGroupReady={(id, group) => {
            if (group) groupRefs.current.set(id, group);
            else groupRefs.current.delete(id);
          }}
        />
      ))}

      {/* Transform Controls */}
      {selectedGroup && (
        <TransformControls
          ref={transformControlsRef}
          object={selectedGroup}
          mode={transformMode}
        />
      )}
    </>
  );
}

export function ThreeJSEditor(props: ThreeJSEditorProps) {
  return (
    <div className="w-full h-full bg-background">
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          preserveDrawingBuffer: true
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a1a', 1);
        }}
        onClick={() => props.onModelSelect(null)}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

export { STLLoader, OBJLoader, GLTFLoader };
export type { Model3D };
