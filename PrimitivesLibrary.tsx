import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Box, Circle, Cylinder as CylinderIcon, Layers } from 'lucide-react';

interface PrimitivesLibraryProps {
  onAddPrimitive: (type: 'cube' | 'sphere' | 'cylinder' | 'plane') => void;
}

const primitives = [
  { type: 'cube' as const, name: 'Cube', icon: Box, description: 'Basic cube shape' },
  { type: 'sphere' as const, name: 'Sphere', icon: Circle, description: 'Spherical shape' },
  { type: 'cylinder' as const, name: 'Cylinder', icon: CylinderIcon, description: 'Cylindrical shape' },
  { type: 'plane' as const, name: 'Plane', icon: Layers, description: 'Flat plane' },
];

export function PrimitivesLibrary({ onAddPrimitive }: PrimitivesLibraryProps) {
  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Primitives</h3>
          <p className="text-xs text-muted-foreground">
            Click to add basic shapes to your design
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid grid-cols-2 gap-3">
            {primitives.map((primitive) => (
              <Button
                key={primitive.type}
                variant="outline"
                className="h-auto flex flex-col items-center gap-2 p-4 hover:border-primary hover:bg-primary/5"
                onClick={() => onAddPrimitive(primitive.type)}
              >
                <primitive.icon className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold text-sm">{primitive.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {primitive.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-2">Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use primitives to build complex parts</li>
            <li>• Combine shapes for robotic components</li>
            <li>• Adjust scale for perfect fit</li>
            <li>• Save combinations as templates</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
