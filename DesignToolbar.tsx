import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Move,
  RotateCw,
  Maximize,
  Upload,
  Download,
  Save,
  Eye,
  Grid3x3,
  Globe,
  Code
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DesignToolbarProps {
  transformMode: 'translate' | 'rotate' | 'scale';
  onTransformModeChange: (mode: 'translate' | 'rotate' | 'scale') => void;
  onExport: (format: 'stl' | 'gltf') => void;
  onPublish: () => void;
  onToggleCodeEditor: () => void;
  showCodeEditor: boolean;
  hasUnsavedChanges: boolean;
}

export function DesignToolbar({
  transformMode,
  onTransformModeChange,
  onExport,
  onPublish,
  onToggleCodeEditor,
  showCodeEditor,
  hasUnsavedChanges
}: DesignToolbarProps) {
  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Transform Tools */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium mr-2">Transform:</span>
            <Button
              size="sm"
              variant={transformMode === 'translate' ? 'default' : 'outline'}
              onClick={() => onTransformModeChange('translate')}
            >
              <Move className="h-4 w-4 mr-2" />
              Move
            </Button>
            <Button
              size="sm"
              variant={transformMode === 'rotate' ? 'default' : 'outline'}
              onClick={() => onTransformModeChange('rotate')}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate
            </Button>
            <Button
              size="sm"
              variant={transformMode === 'scale' ? 'default' : 'outline'}
              onClick={() => onTransformModeChange('scale')}
            >
              <Maximize className="h-4 w-4 mr-2" />
              Scale
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Button
              size="sm"
              variant={showCodeEditor ? 'default' : 'outline'}
              onClick={onToggleCodeEditor}
            >
              <Code className="h-4 w-4 mr-2" />
              Code
            </Button>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="mr-2">
                Unsaved Changes
              </Badge>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('stl')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export STL
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('gltf')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export GLTF
            </Button>
            <Button
              size="sm"
              className="gradient-bg"
              onClick={onPublish}
            >
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
