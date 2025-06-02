
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Report {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  advisor_ids: string[];
}

interface ReportCardProps {
  report: Report;
  onSelect: (reportId: string) => void;
}

export function ReportCard({ report, onSelect }: ReportCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', report.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete report');
    },
  });

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onSelect(report.id)}>
            <CardTitle className="text-lg font-semibold text-slate-900 hover:text-slate-700">
              {report.name}
            </CardTitle>
            {report.description && (
              <CardDescription className="mt-1">
                {report.description}
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
            title="Delete report"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0" onClick={() => onSelect(report.id)}>
        <div className="flex items-center text-sm text-slate-500">
          <Users className="h-4 w-4 mr-1" />
          {report.advisor_ids.length} advisor{report.advisor_ids.length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
}
