import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Model3D } from './ThreeJSEditor';

interface ModelNodeProps {
  model: Model3D;
  onSelect: (id: string) => void;
  onGroupReady: (id: string, group: THREE.Group | null) => void;
}

// Wraps a mesh/group inside an R3F-managed group so transforms apply safely
export function ModelNode({ model, onSelect, onGroupReady }: ModelNodeProps) {
  const groupRef = useRef<THREE.Group>(null!);

  // Attach the external mesh/group to our internal group
  useEffect(() => {
    const group = groupRef.current;
    if (!group || !model.mesh) return;

    try {
      // Ensure group is empty, then add
      while (group.children.length) group.remove(group.children[0]);
      group.add(model.mesh);

      // Initial transforms from model
      const [px, py, pz] = model.position;
      const [rx, ry, rz] = model.rotation;
      const [sx, sy, sz] = model.scale;
      group.position.set(px, py, pz);
      group.rotation.set(rx, ry, rz);
      group.scale.set(sx, sy, sz);
    } catch (e) {
      console.error('ModelNode attach error:', e);
    }

    onGroupReady(model.id, group);
    return () => {
      onGroupReady(model.id, null);
      try {
        group.clear();
      } catch (_) {}
    };
  }, [model]);

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(model.id);
      }}
    />
  );
}
