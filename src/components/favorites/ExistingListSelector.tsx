
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FavoriteList {
  id: string;
  name: string;
}

interface ExistingListSelectorProps {
  favoriteLists: FavoriteList[];
  selectedListId: string;
  onSelectList: (listId: string) => void;
  onAddToSelected: () => void;
  onCreateNew: () => void;
  isLoading: boolean;
}

export function ExistingListSelector({ 
  favoriteLists, 
  selectedListId, 
  onSelectList, 
  onAddToSelected, 
  onCreateNew,
  isLoading 
}: ExistingListSelectorProps) {
  return (
    <>
      {favoriteLists.length > 0 && (
        <div className="space-y-3">
          <Label>Select existing list:</Label>
          <Select value={selectedListId} onValueChange={onSelectList}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a favorite list..." />
            </SelectTrigger>
            <SelectContent>
              {favoriteLists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  {list.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={onAddToSelected} 
            disabled={!selectedListId || isLoading}
            className="w-full"
          >
            Add to Selected List
          </Button>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <Button 
          onClick={onCreateNew}
          variant="outline"
          className="w-full"
        >
          Create New List
        </Button>
      </div>
    </>
  );
}
