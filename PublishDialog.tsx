import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: {
    title: string;
    description: string;
    tags: string[];
  }) => Promise<void>;
}

const suggestedTags = [
  'arm', 'leg', 'joint', 'sensor-mount', 'gripper',
  'actuator', 'chassis', 'wheel', 'frame', 'humanoid'
];

export function PublishDialog({ isOpen, onClose, onPublish }: PublishDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (customTag && !tags.includes(customTag) && tags.length < 10) {
      setTags([...tags, customTag]);
      setCustomTag('');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onPublish({ title, description, tags });
      setTitle('');
      setDescription('');
      setTags([]);
      onClose();
    } catch (error) {
      console.error('Publish error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish to Marketplace</DialogTitle>
          <DialogDescription>
            Share your robot design with the community. Add details to help others discover your work.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Humanoid Robot Arm v2"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your design, features, and use cases..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Tags ({tags.length}/10)</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 mb-3">
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add custom tag..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCustomTag}
                disabled={!customTag || tags.length >= 10}
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleAddTag(tag)}
                >
                  + {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            className="gradient-bg"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Design'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
