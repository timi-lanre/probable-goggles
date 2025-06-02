
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface IssueReport {
  id: string;
  advisor_id: string;
  user_id: string;
  column_name: string;
  issue_description: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  advisors: {
    first_name: string | null;
    last_name: string | null;
    firm: string | null;
  };
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

export function useIssueReports(isAdmin: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: issueReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['issue-reports'],
    queryFn: async () => {
      console.log('Fetching issue reports...');
      const { data, error } = await supabase
        .from('issue_reports')
        .select(`
          *,
          advisors!advisor_id (
            first_name,
            last_name,
            firm
          ),
          profiles!user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching issue reports:', error);
        throw error;
      }
      console.log('Fetched issue reports:', data?.length);
      return data as IssueReport[];
    },
    enabled: isAdmin,
  });

  const resolveIssueMutation = useMutation({
    mutationFn: async (issueId: string) => {
      console.log('Resolving issue:', issueId);
      const { error } = await supabase
        .from('issue_reports')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id,
        })
        .eq('id', issueId);

      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Issue resolved successfully');
      toast({
        title: "Issue resolved",
        description: "The issue has been marked as resolved.",
      });
      queryClient.invalidateQueries({ queryKey: ['issue-reports'] });
    },
    onError: (error) => {
      console.error('Error resolving issue:', error);
      toast({
        title: "Error resolving issue",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    issueReports,
    reportsLoading,
    resolveIssueMutation,
  };
}
