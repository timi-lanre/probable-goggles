
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportFormData {
  columnName: string;
  issueDescription: string;
}

export function useReportIssue(advisorId: string, onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitReport = async (data: ReportFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to report issues.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('issue_reports')
        .insert({
          advisor_id: advisorId,
          user_id: user.id,
          column_name: data.columnName,
          issue_description: data.issueDescription,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Issue reported successfully",
        description: "Thank you for your feedback. We'll review this issue.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error reporting issue:', error);
      toast({
        title: "Error reporting issue",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReport,
    isSubmitting,
  };
}
