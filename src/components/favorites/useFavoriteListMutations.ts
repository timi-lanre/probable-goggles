
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Enhanced retry configuration
const retryConfig = {
  retry: (failureCount: number, error: any) => {
    // Don't retry on authentication errors
    if (error?.status === 401 || error?.status === 403) {
      return false;
    }
    // Don't retry on client errors (4xx)
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    // Retry up to 2 times for network/server errors
    return failureCount < 2;
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
};

export function useFavoriteListMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's favorite lists with improved error handling
  const { data: favoriteLists = [], error: listsError } = useQuery({
    queryKey: ['favorite-lists', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('favorite_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching favorite lists:', error);
        throw new Error('Failed to load favorite lists. Please check your connection and try again.');
      }
      
      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...retryConfig,
  });

  // Create new favorite list with enhanced error handling
  const createListMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!user?.id) {
        throw new Error('You must be logged in to create a favorite list');
      }
      
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error('List name is required');
      }
      
      if (trimmedName.length > 100) {
        throw new Error('List name must be less than 100 characters');
      }

      const { data, error } = await supabase
        .from('favorite_lists')
        .insert({
          user_id: user.id,
          name: trimmedName,
          description: description.trim() || null,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating favorite list:', error);
        if (error.code === '23505') {
          throw new Error('A list with this name already exists');
        }
        throw new Error('Failed to create favorite list. Please try again.');
      }
      
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        // Invalidate all favorite-related queries
        queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
        queryClient.invalidateQueries({ queryKey: ['user-lists-filter'] });
        queryClient.invalidateQueries({ queryKey: ['user-lists-combined'] });
        queryClient.invalidateQueries({ queryKey: ['filter-options-optimized'] });
        queryClient.invalidateQueries({ queryKey: ['filter-options'] });
        
        toast.success('Favorite list created successfully!');
      }
    },
    onError: (error: Error) => {
      console.error('Create list mutation error:', error);
      toast.error(error.message || 'Failed to create favorite list');
    },
    ...retryConfig,
  });

  // Add advisor to favorite list with enhanced error handling
  const addToListMutation = useMutation({
    mutationFn: async ({ listId, advisorId }: { listId: string; advisorId: string }) => {
      if (!listId || !advisorId) {
        throw new Error('Invalid list or advisor ID');
      }

      // Check if advisor is already in the list
      const { data: existingItem, error: checkError } = await supabase
        .from('favorite_list_items')
        .select('id')
        .eq('favorite_list_id', listId)
        .eq('advisor_id', advisorId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing favorite:', checkError);
        throw new Error('Failed to verify advisor status in list');
      }

      if (existingItem) {
        throw new Error('This advisor is already in your favorites list');
      }

      const { error } = await supabase
        .from('favorite_list_items')
        .insert({
          favorite_list_id: listId,
          advisor_id: advisorId,
        });
      
      if (error) {
        console.error('Error adding to favorite list:', error);
        if (error.code === '23503') {
          throw new Error('The selected advisor or list no longer exists');
        }
        throw new Error('Failed to add advisor to favorites. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate all favorite-related queries to ensure filter panel updates
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-list-items'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-list-counts'] });
      queryClient.invalidateQueries({ queryKey: ['user-lists-filter'] });
      queryClient.invalidateQueries({ queryKey: ['user-lists-combined'] });
      queryClient.invalidateQueries({ queryKey: ['filter-options-optimized'] });
      queryClient.invalidateQueries({ queryKey: ['filter-options'] });
      
      toast.success('Advisor added to favorites!');
    },
    onError: (error: Error) => {
      console.error('Add to list mutation error:', error);
      toast.error(error.message || 'Failed to add advisor to favorites');
    },
    ...retryConfig,
  });

  return {
    favoriteLists,
    listsError,
    createListMutation,
    addToListMutation,
  };
}
