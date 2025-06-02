
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { IssueStatusBadge } from './IssueStatusBadge';
import { IssueActionButtons } from './IssueActionButtons';
import { formatDate, columnLabels } from '@/utils/issueReportsUtils';

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

interface IssueReportsTableProps {
  issueReports: IssueReport[];
  isResolving: boolean;
  onResolve: (id: string) => void;
}

export function IssueReportsTable({
  issueReports,
  isResolving,
  onResolve,
}: IssueReportsTableProps) {
  if (!issueReports || issueReports.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No issues found for the selected filter.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Advisor</TableHead>
            <TableHead>Column</TableHead>
            <TableHead>Issue Description</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issueReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <IssueStatusBadge status={report.status} />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {report.advisors.first_name} {report.advisors.last_name}
                  </div>
                  {report.advisors.firm && (
                    <div className="text-sm text-slate-500">
                      {report.advisors.firm}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {columnLabels[report.column_name] || report.column_name}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={report.issue_description}>
                  {report.issue_description}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">
                    {report.profiles.first_name} {report.profiles.last_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {report.profiles.email}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-500">
                {formatDate(report.created_at)}
              </TableCell>
              <TableCell>
                <IssueActionButtons
                  status={report.status}
                  issueId={report.id}
                  resolvedAt={report.resolved_at}
                  isResolving={isResolving}
                  onResolve={onResolve}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
