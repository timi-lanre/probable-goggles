
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/issueReportsUtils';

interface IssueActionButtonsProps {
  status: string;
  issueId: string;
  resolvedAt: string | null;
  isResolving: boolean;
  onResolve: (id: string) => void;
}

export function IssueActionButtons({
  status,
  issueId,
  resolvedAt,
  isResolving,
  onResolve,
}: IssueActionButtonsProps) {
  if (status === 'resolved') {
    return (
      <div className="flex items-center">
        <span className="text-sm text-slate-500">
          Resolved {resolvedAt && formatDate(resolvedAt)}
        </span>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      disabled={isResolving}
      className="bg-green-600 hover:bg-green-700"
      onClick={() => onResolve(issueId)}
    >
      {isResolving ? 'Resolving...' : 'Resolve'}
    </Button>
  );
}
