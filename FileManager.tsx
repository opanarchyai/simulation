import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, File, Trash2, Eye, EyeOff, FolderOpen, Save, Cloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Model3D } from './ThreeJSEditor';

interface FileManagerProps {
  models: Model3D[];
  selectedModelId: string | null;
  onModelSelect: (id: string | null) => void;
  onModelDelete: (id: string) => void;
  onModelVisibilityToggle: (id: string) => void;
  onFileImport: (file: File) => Promise<void>;
  onSaveToCloud: () => Promise<void>;
  onLoadFromCloud: (designId: string) => Promise<void>;
}

interface SavedDesign {
  id: string;
  title: string;
  created_at: string;
  thumbnail_url: string | null;
}

export function FileManager({
  models,
  selectedModelId,
  onModelSelect,
  onModelDelete,
  onModelVisibilityToggle,
  onFileImport,
  onSaveToCloud,
  onLoadFromCloud
}: FileManagerProps) {
  const { user } = useAuth();
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const validExtensions = ['.stl', '.obj', '.glb', '.gltf'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error(`Invalid file type: ${file.name}. Supported: STL, OBJ, GLB, GLTF`);
        continue;
      }

      await onFileImport(file);
    }
  };

  const loadSavedDesigns = async () => {
    if (!user) {
      toast.error('Please login to view saved designs');
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('robot_designs')
      .select('id, title, created_at, thumbnail_url')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load designs');
      console.error(error);
    } else {
      setSavedDesigns(data || []);
    }
    setIsLoading(false);
  };

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur">
      <Tabs defaultValue="workspace" className="h-full flex flex-col">
        <TabsList className="m-4 grid w-[calc(100%-2rem)] grid-cols-2">
          <TabsTrigger value="workspace">
            <FolderOpen className="h-4 w-4 mr-2" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="cloud" onClick={loadSavedDesigns}>
            <Cloud className="h-4 w-4 mr-2" />
            Cloud
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="flex-1 px-4 pb-4">
          <div className="space-y-4">
            {/* Import Files */}
            <div>
              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import 3D Files
                </Button>
              </label>
              <Input
                id="file-upload"
                type="file"
                accept=".stl,.obj,.glb,.gltf"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supports: STL, OBJ, GLB, GLTF
              </p>
            </div>

            {/* File List */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Models ({models.length})</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                        selectedModelId === model.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => onModelSelect(model.id)}
                    >
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm truncate">{model.name}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onModelVisibilityToggle(model.id);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onModelDelete(model.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {models.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No models in workspace. Import or add primitives to start.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Save to Cloud */}
            {user && models.length > 0 && (
              <Button
                className="w-full"
                onClick={onSaveToCloud}
              >
                <Save className="h-4 w-4 mr-2" />
                Save to Cloud
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cloud" className="flex-1 px-4 pb-4">
          <ScrollArea className="h-[500px]">
            {!user ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Login to save and load designs from cloud
                </p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Loading designs...</p>
              </div>
            ) : savedDesigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No saved designs yet. Save your first design!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => onLoadFromCloud(design.id)}
                  >
                    <h4 className="text-sm font-semibold">{design.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(design.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
