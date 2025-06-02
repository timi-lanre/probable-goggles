
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { UserX, Loader2 } from 'lucide-react';

interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  userEmail: string;
}

export function DeleteUserDialog({ userId, userName, userEmail }: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }

      toast({
        title: "User Deleted Successfully",
        description: `${userName} has been removed from the system`,
      });

      // Refresh the users list
      queryClient.invalidateQueries({ queryKey: ['users'] });

    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <UserX className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{userName}</strong> ({userEmail})? 
            This action cannot be undone and will permanently remove the user from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
