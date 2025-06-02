
import { FileText } from 'lucide-react';
import { ReportCard } from '@/components/ReportCard';

interface Report {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  advisor_ids: string[];
}

interface ReportListsViewProps {
  reports: Report[];
  onSelectReport: (reportId: string) => void;
}

export function ReportListsView({ reports, onSelectReport }: ReportListsViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports yet</h3>
          <p className="text-slate-600">Start by saving filtered advisor lists as reports from the dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onSelect={onSelectReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
