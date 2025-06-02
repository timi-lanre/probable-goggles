
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FavoriteList {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface FavoriteListCardProps {
  favoriteList: FavoriteList;
  itemCount: number;
  onSelect: (listId: string) => void;
}

export function FavoriteListCard({ favoriteList, itemCount, onSelect }: FavoriteListCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('favorite_lists')
        .delete()
        .eq('id', favoriteList.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      toast.success('Favorite list deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete favorite list');
    },
  });

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onSelect(favoriteList.id)}>
            <CardTitle className="text-lg font-semibold text-slate-900 hover:text-slate-700">
              {favoriteList.name}
            </CardTitle>
            {favoriteList.description && (
              <CardDescription className="mt-1">
                {favoriteList.description}
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteMutation.mutate();
            }}
            title="Delete list"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0" onClick={() => onSelect(favoriteList.id)}>
        <div className="flex items-center text-sm text-slate-500">
          <Users className="h-4 w-4 mr-1" />
          {itemCount} advisor{itemCount !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
}
