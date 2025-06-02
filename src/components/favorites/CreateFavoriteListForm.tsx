
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateFavoriteListFormProps {
  onSubmit: (name: string, description: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CreateFavoriteListForm({ onSubmit, onCancel, isLoading }: CreateFavoriteListFormProps) {
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newListName, newListDescription);
    setNewListName('');
    setNewListDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="listName">List Name *</Label>
        <Input
          id="listName"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name..."
          required
        />
      </div>
      <div>
        <Label htmlFor="listDescription">Description</Label>
        <Textarea
          id="listDescription"
          value={newListDescription}
          onChange={(e) => setNewListDescription(e.target.value)}
          placeholder="Optional description..."
          rows={3}
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          type="submit" 
          disabled={!newListName.trim() || isLoading}
          className="flex-1"
        >
          Create & Add
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
