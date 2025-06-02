
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFavoriteListMutations } from './favorites/useFavoriteListMutations';
import { CreateFavoriteListForm } from './favorites/CreateFavoriteListForm';
import { ExistingListSelector } from './favorites/ExistingListSelector';

interface Advisor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  firm: string | null;
  branch: string | null;
  team_name: string | null;
  city: string | null;
  province: string | null;
  email: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  address: string | null;
  postal_code: string | null;
  business_phone: string | null;
  mobile_phone: string | null;
}

interface FavoritesPopupProps {
  advisor: Advisor;
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesPopup({ advisor, isOpen, onClose }: FavoritesPopupProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>('');

  const { favoriteLists, createListMutation, addToListMutation } = useFavoriteListMutations();

  const handleCreateAndAdd = (name: string, description: string) => {
    createListMutation.mutate(
      { name, description },
      {
        onSuccess: (data) => {
          if (data) {
            setSelectedListId(data.id);
            setShowCreateForm(false);
            addToListMutation.mutate(
              { listId: data.id, advisorId: advisor.id },
              { onSuccess: () => onClose() }
            );
          }
        }
      }
    );
  };

  const handleAddToExisting = () => {
    if (selectedListId) {
      addToListMutation.mutate(
        { listId: selectedListId, advisorId: advisor.id },
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Favorites</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            Adding: <span className="font-medium">{advisor.first_name} {advisor.last_name}</span>
          </div>

          {!showCreateForm ? (
            <ExistingListSelector
              favoriteLists={favoriteLists}
              selectedListId={selectedListId}
              onSelectList={setSelectedListId}
              onAddToSelected={handleAddToExisting}
              onCreateNew={() => setShowCreateForm(true)}
              isLoading={addToListMutation.isPending}
            />
          ) : (
            <CreateFavoriteListForm
              onSubmit={handleCreateAndAdd}
              onCancel={() => setShowCreateForm(false)}
              isLoading={createListMutation.isPending}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
