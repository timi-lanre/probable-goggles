
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SaveReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  isLoading?: boolean;
}

export function SaveReportDialog({ isOpen, onClose, onSave, isLoading }: SaveReportDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save as Report</DialogTitle>
          <DialogDescription>
            Save your current filtered results as a report for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter report name..."
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter report description..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
