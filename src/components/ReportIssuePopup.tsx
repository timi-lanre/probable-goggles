
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdvisorInfo } from '@/components/ReportIssue/AdvisorInfo';
import { ReportIssueForm } from '@/components/ReportIssue/ReportIssueForm';
import { useReportIssue } from '@/hooks/useReportIssue';

interface Advisor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  firm: string | null;
  branch: string | null;
  team_name: string | null;
  city: string | null;
  province: string | null;
  email: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  address: string | null;
  postal_code: string | null;
  business_phone: string | null;
  mobile_phone: string | null;
}

interface ReportIssuePopupProps {
  advisor: Advisor;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportIssuePopup({ advisor, isOpen, onClose }: ReportIssuePopupProps) {
  const { submitReport, isSubmitting } = useReportIssue(advisor.id, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Report Issue
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <AdvisorInfo advisor={advisor} />
          <ReportIssueForm
            onSubmit={submitReport}
            isSubmitting={isSubmitting}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
