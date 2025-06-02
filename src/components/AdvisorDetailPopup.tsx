
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, Globe, MapPin, Building, Users, Briefcase, User, Phone, Home } from 'lucide-react';

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

interface AdvisorDetailPopupProps {
  advisor: Advisor;
  isOpen: boolean;
  onClose: () => void;
}

export function AdvisorDetailPopup({ advisor, isOpen, onClose }: AdvisorDetailPopupProps) {
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

  const handleBusinessPhoneClick = () => {
    if (advisor.business_phone) {
      window.open(`tel:${advisor.business_phone}`, '_blank');
    }
  };

  const handleMobilePhoneClick = () => {
    if (advisor.mobile_phone) {
      window.open(`tel:${advisor.mobile_phone}`, '_blank');
    }
  };

  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return null;
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for 10-digit numbers
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Format as +X (XXX) XXX-XXXX for 11-digit numbers starting with 1
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // Return original if it doesn't match common patterns
    return phone;
  };

  const fullName = [advisor.first_name, advisor.last_name].filter(Boolean).join(' ') || 'Unknown Advisor';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        {/* Beige Header */}
        <DialogHeader className="bg-gradient-to-r from-amber-50 to-orange-50 -m-6 mb-6 p-6 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-amber-900 mb-1">
                {fullName}
              </DialogTitle>
              {advisor.title && (
                <p className="text-lg text-amber-700">{advisor.title}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Information */}
          {(advisor.firm || advisor.branch || advisor.team_name) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-gray-600" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {advisor.firm && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Firm</p>
                      <p className="text-gray-900 font-medium">{advisor.firm}</p>
                    </div>
                  </div>
                )}
                {advisor.branch && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Branch</p>
                      <p className="text-gray-900 font-medium">{advisor.branch}</p>
                    </div>
                  </div>
                )}
                {advisor.team_name && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Team</p>
                      <p className="text-gray-900 font-medium">{advisor.team_name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phone Information */}
          {(advisor.business_phone || advisor.mobile_phone) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-gray-600" />
                Phone Numbers
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {advisor.business_phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Business Phone</p>
                      <p className="text-gray-900 font-medium">{formatPhoneNumber(advisor.business_phone)}</p>
                    </div>
                    <Button
                      onClick={handleBusinessPhoneClick}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Call
                    </Button>
                  </div>
                )}
                {advisor.mobile_phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Mobile Phone</p>
                      <p className="text-gray-900 font-medium">{formatPhoneNumber(advisor.mobile_phone)}</p>
                    </div>
                    <Button
                      onClick={handleMobilePhoneClick}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Call
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Address & Location Information */}
          {(advisor.address || advisor.city || advisor.province || advisor.postal_code) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                <Home className="h-5 w-5 text-gray-600" />
                Address & Location
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {advisor.address && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Home className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-gray-900 font-medium">{advisor.address}</p>
                    </div>
                  </div>
                )}
                {(advisor.city || advisor.province) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">City & Province</p>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800 text-base py-2 px-4">
                        {[advisor.city, advisor.province].filter(Boolean).join(', ')}
                      </Badge>
                    </div>
                  </div>
                )}
                {advisor.postal_code && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Postal Code</p>
                      <p className="text-gray-900 font-medium">{advisor.postal_code}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">Contact Actions</h3>
            {(advisor.email || advisor.linkedin_url || advisor.website_url) ? (
              <div className="flex flex-wrap gap-3">
                {advisor.email && (
                  <Button
                    onClick={handleEmailClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3"
                  >
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                )}
                {advisor.linkedin_url && (
                  <Button
                    onClick={handleLinkedInClick}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center gap-2 px-6 py-3"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                )}
                {advisor.website_url && (
                  <Button
                    onClick={handleWebsiteClick}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 flex items-center gap-2 px-6 py-3"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-center italic">No contact information available</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
