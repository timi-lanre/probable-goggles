
import { Heart } from 'lucide-react';
import { FavoriteListCard } from '@/components/FavoriteListCard';

interface FavoriteList {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface FavoriteListsViewProps {
  favoriteLists: FavoriteList[];
  listCounts: Record<string, number>;
  onSelectList: (listId: string) => void;
}

export function FavoriteListsView({ favoriteLists, listCounts, onSelectList }: FavoriteListsViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="text-3xl font-bold text-slate-900">My Favorite Lists</h1>
      </div>
      
      {favoriteLists.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No favorite lists yet</h3>
          <p className="text-slate-600">Start by adding advisors to favorites from the dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteLists.map((list) => (
            <FavoriteListCard
              key={list.id}
              favoriteList={list}
              itemCount={listCounts[list.id] || 0}
              onSelect={onSelectList}
            />
          ))}
        </div>
      )}
    </div>
  );
}
