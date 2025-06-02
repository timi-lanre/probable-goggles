
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface IssueStatusBadgeProps {
  status: string;
}

export function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  if (status === 'resolved') {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Resolved
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
      <Clock className="h-3 w-3 mr-1" />
      Open
    </Badge>
  );
}
