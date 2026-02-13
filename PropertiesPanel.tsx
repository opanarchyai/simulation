import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Model3D } from './ThreeJSEditor';
import { Ruler, Move, RotateCw, Maximize } from 'lucide-react';
import * as THREE from 'three';

interface PropertiesPanelProps {
  selectedModel: Model3D | null;
  onPropertyChange: (property: string, value: any) => void;
}

export function PropertiesPanel({ selectedModel, onPropertyChange }: PropertiesPanelProps) {
  if (!selectedModel) {
    return (
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur p-4">
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground text-center">
            Select a model to view properties
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur p-4 overflow-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Properties</h3>
          <div className="space-y-2">
            <div>
              <Label>Model Name</Label>
              <Input
                value={selectedModel.name}
                onChange={(e) => onPropertyChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <p className="text-sm capitalize">{selectedModel.type}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Position */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Move className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Position</h4>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">X</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedModel.position[0].toFixed(2)}
                  onChange={(e) =>
                    onPropertyChange('position', [
                      parseFloat(e.target.value),
                      selectedModel.position[1],
                      selectedModel.position[2],
                    ])
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Y</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedModel.position[1].toFixed(2)}
                  onChange={(e) =>
                    onPropertyChange('position', [
                      selectedModel.position[0],
                      parseFloat(e.target.value),
                      selectedModel.position[2],
                    ])
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Z</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedModel.position[2].toFixed(2)}
                  onChange={(e) =>
                    onPropertyChange('position', [
                      selectedModel.position[0],
                      selectedModel.position[1],
                      parseFloat(e.target.value),
                    ])
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rotation */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RotateCw className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Rotation (degrees)</h4>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">X</Label>
                <Input
                  type="number"
                  step="1"
                  value={((selectedModel.rotation[0] * 180) / Math.PI).toFixed(1)}
                  onChange={(e) =>
                    onPropertyChange('rotation', [
                      (parseFloat(e.target.value) * Math.PI) / 180,
                      selectedModel.rotation[1],
                      selectedModel.rotation[2],
                    ])
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Y</Label>
                <Input
                  type="number"
                  step="1"
                  value={((selectedModel.rotation[1] * 180) / Math.PI).toFixed(1)}
                  onChange={(e) =>
                    onPropertyChange('rotation', [
                      selectedModel.rotation[0],
                      (parseFloat(e.target.value) * Math.PI) / 180,
                      selectedModel.rotation[2],
                    ])
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Z</Label>
                <Input
                  type="number"
                  step="1"
                  value={((selectedModel.rotation[2] * 180) / Math.PI).toFixed(1)}
                  onChange={(e) =>
                    onPropertyChange('rotation', [
                      selectedModel.rotation[0],
                      selectedModel.rotation[1],
                      (parseFloat(e.target.value) * Math.PI) / 180,
                    ])
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Scale */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Maximize className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Scale</h4>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">X</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedModel.scale[0].toFixed(2)}
                  onChange={(e) =>
                    onPropertyChange('scale', [
                      parseFloat(e.target.value),
                      selectedModel.scale[1],
                      selectedModel.scale[2],
                    ])
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Y</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedModel.scale[1].toFixed(2)}
                  onChange={(e) =>
                    onPropertyChange('scale', [
                      selectedModel.scale[0],
                      parseFloat(e.target.value),
                      selectedModel.scale[2],
                    ])
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Z</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedModel.scale[2].toFixed(2)}
                  onChange={(e) =>
                    onPropertyChange('scale', [
                      selectedModel.scale[0],
                      selectedModel.scale[1],
                      parseFloat(e.target.value),
                    ])
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Measurements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Measurements</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vertices:</span>
              <span className="font-mono">
                {selectedModel.mesh instanceof THREE.Mesh
                  ? (selectedModel.mesh.geometry as THREE.BufferGeometry).attributes.position?.count || 0
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
