import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Globe, Info, Heart, Flag } from 'lucide-react';
import { useState } from 'react';
import { AdvisorDetailPopup } from './AdvisorDetailPopup';
import { FavoritesPopup } from './FavoritesPopup';
import { ReportIssuePopup } from './ReportIssuePopup';

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

interface AdvisorTableRowProps {
  advisor: Advisor;
  index: number;
}

export function AdvisorTableRow({ advisor, index }: AdvisorTableRowProps) {
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showFavoritesPopup, setShowFavoritesPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);

  const handleEmailClick = () => {
    if (advisor.email) {
      window.open(`mailto:${advisor.email}`, '_blank');
    }
  };

  const handleLinkedInClick = () => {
    if (advisor.linkedin_url) {
      window.open(advisor.linkedin_url, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (advisor.website_url) {
      window.open(advisor.website_url, '_blank');
    }
  };

  return (
    <>
      <TableRow className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
        <TableCell className="px-3 py-1.5 text-center text-slate-500 text-sm w-12">
          {index}
        </TableCell>
        <TableCell className="px-3 py-1.5 font-medium text-slate-900 text-sm leading-tight" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
          <div className="break-words" title={advisor.first_name || ''}>
            {advisor.first_name || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5 font-medium text-slate-900 text-sm leading-tight" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
          <div className="break-words" title={advisor.last_name || ''}>
            {advisor.last_name || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5 text-slate-700 text-sm leading-tight" style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}>
          <div className="break-words" title={advisor.title || ''}>
            {advisor.title || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5 text-slate-700 text-sm leading-tight" style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>
          <div className="break-words" title={advisor.firm || ''}>
            {advisor.firm || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5 text-slate-700 text-sm leading-tight" style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}>
          <div className="break-words" title={advisor.branch || ''}>
            {advisor.branch || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5 text-slate-700 text-sm leading-tight" style={{ width: '160px', minWidth: '160px', maxWidth: '160px' }}>
          <div className="break-words" title={advisor.team_name || ''}>
            {advisor.team_name || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5 text-slate-700 text-sm leading-tight" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
          <div className="break-words" title={advisor.city || ''}>
            {advisor.city || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5 text-slate-700 text-sm leading-tight" style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}>
          <div className="break-words" title={advisor.province || ''}>
            {advisor.province || <span className="text-slate-400">-</span>}
          </div>
        </TableCell>
        <TableCell className="px-3 py-1.5" style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}>
          <div className="flex items-center justify-center gap-1 flex-nowrap">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors flex-shrink-0"
              onClick={() => setShowDetailPopup(true)}
              title="View Details"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
              onClick={() => setShowFavoritesPopup(true)}
              title="Add to Favorites"
            >
              <Heart className="h-3.5 w-3.5" />
            </Button>
            {advisor.email && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
                onClick={handleEmailClick}
                title="Send Email"
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            )}
            {advisor.linkedin_url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
                onClick={handleLinkedInClick}
                title="View LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </Button>
            )}
            {advisor.website_url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-colors flex-shrink-0"
                onClick={handleWebsiteClick}
                title="Visit Website"
              >
                <Globe className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors flex-shrink-0"
              onClick={() => setShowReportPopup(true)}
              title="Report Issue"
            >
              <Flag className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      
      <AdvisorDetailPopup
        advisor={advisor}
        isOpen={showDetailPopup}
        onClose={() => setShowDetailPopup(false)}
      />

      <FavoritesPopup
        advisor={advisor}
        isOpen={showFavoritesPopup}
        onClose={() => setShowFavoritesPopup(false)}
      />

      <ReportIssuePopup
        advisor={advisor}
        isOpen={showReportPopup}
        onClose={() => setShowReportPopup(false)}
      />
    </>
  );
}
