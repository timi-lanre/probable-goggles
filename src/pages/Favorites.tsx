
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { FavoritesHeader } from '@/components/FavoritesHeader';
import { FavoriteListsView } from '@/components/FavoriteListsView';
import { FavoriteAdvisorsView } from '@/components/FavoriteAdvisorsView';

export default function Favorites() {
  const { user } = useAuth();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedListName, setSelectedListName] = useState<string>('');

  // Fetch user's favorite lists
  const { data: favoriteLists = [] } = useQuery({
    queryKey: ['favorite-lists', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      console.log('Fetching favorite lists for user:', user.id);
      
      const { data, error } = await supabase
        .from('favorite_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching favorite lists:', error);
        throw error;
      }
      
      console.log('Fetched favorite lists:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch count for each list
  const { data: listCounts = {} } = useQuery({
    queryKey: ['favorite-list-counts', favoriteLists.map(l => l.id)],
    queryFn: async () => {
      console.log('Fetching counts for lists:', favoriteLists);
      const counts: Record<string, number> = {};
      
      for (const list of favoriteLists) {
        console.log('Fetching count for list:', list.id, list.name);
        
        const { count, error } = await supabase
          .from('favorite_list_items')
          .select('*', { count: 'exact', head: true })
          .eq('favorite_list_id', list.id);
        
        if (error) {
          console.error('Error fetching count for list', list.id, ':', error);
        } else {
          console.log('Count for list', list.name, ':', count);
          counts[list.id] = count || 0;
        }
      }
      
      console.log('Final list counts:', counts);
      return counts;
    },
    enabled: favoriteLists.length > 0,
  });

  // Fetch advisors for selected list
  const { data: favoriteAdvisors = [], isLoading: isLoadingAdvisors, error: advisorsError } = useQuery({
    queryKey: ['favorite-list-items', selectedListId],
    queryFn: async () => {
      if (!selectedListId) return [];
      
      console.log('Fetching advisors for favorite list:', selectedListId);
      
      const { data, error } = await supabase
        .from('favorite_list_items')
        .select(`
          id,
          advisor_id,
          advisors!favorite_list_items_advisor_id_fkey (
            id,
            first_name,
            last_name,
            title,
            firm,
            branch,
            team_name,
            city,
            province,
            email,
            linkedin_url,
            website_url,
            address,
            postal_code,
            business_phone,
            mobile_phone
          )
        `)
        .eq('favorite_list_id', selectedListId)
        .order('added_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching favorite advisors:', error);
        throw error;
      }
      
      console.log('Fetched favorite list items:', data);
      console.log('Number of items returned:', data?.length || 0);
      
      // Check for missing advisor data
      const itemsWithMissingAdvisors = data?.filter(item => !item.advisors) || [];
      if (itemsWithMissingAdvisors.length > 0) {
        console.warn('Items with missing advisor data:', itemsWithMissingAdvisors);
      }
      
      return data || [];
    },
    enabled: !!selectedListId,
  });

  const handleSelectList = (listId: string) => {
    const list = favoriteLists.find(l => l.id === listId);
    console.log('Selected favorite list:', list);
    setSelectedListId(listId);
    setSelectedListName(list?.name || '');
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
    setSelectedListName('');
  };

  return (
    <div className="min-h-screen bg-[#E5D3BC]">
      <FavoritesHeader />

      {/* Main Content */}
      <main className="px-2 lg:px-4 py-8">
        <div className="w-full max-w-none">
          {!selectedListId ? (
            <FavoriteListsView
              favoriteLists={favoriteLists}
              listCounts={listCounts}
              onSelectList={handleSelectList}
            />
          ) : (
            <FavoriteAdvisorsView
              selectedListId={selectedListId}
              selectedListName={selectedListName}
              favoriteAdvisors={favoriteAdvisors}
              onBackToLists={handleBackToLists}
              isLoading={isLoadingAdvisors}
              error={advisorsError}
            />
          )}
        </div>
      </main>
    </div>
  );
}
