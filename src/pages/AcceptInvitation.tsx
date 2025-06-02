
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link. Token is missing.');
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (error || !data) {
        console.error('Error fetching invitation:', error);
        setError('Invalid or expired invitation link.');
        setLoading(false);
        return;
      }

      // Check if invitation is expired
      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        setError('This invitation has expired. Please request a new invitation.');
        setLoading(false);
        return;
      }

      setInvitation(data);
      
      // Pre-fill form data if available
      setFormData(prev => ({
        ...prev,
        firstName: data.first_name || '',
        lastName: data.last_name || ''
      }));
      
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while validating the invitation.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Names Required",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Use the admin function to create the user account
      const { data, error } = await supabase.functions.invoke('create-invited-user', {
        body: {
          email: invitation.email,
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          role: invitation.role,
          invitationId: invitation.id,
          token: token
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account Created Successfully",
        description: `Welcome to Advisor Connect! You can now sign in with your credentials as a ${invitation.role}.`,
      });

      // Redirect to auth page with success message
      navigate('/auth?message=account-created');

    } catch (error: any) {
      console.error('Error creating account:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.message?.includes('already exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message?.includes('Admin access required')) {
        errorMessage = 'Invalid invitation token.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Account Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5D3BC] via-[#F0E6D1] to-[#E5D3BC]">
        {/* Logo positioned top left */}
        <nav className="relative z-10 flex justify-between items-center px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
              alt="Advisor Connect"
              className="h-16 w-auto object-contain"
            />
          </div>
        </nav>
        
        <div className="flex items-center justify-center py-12 px-4">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            <p className="text-slate-600">Validating invitation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5D3BC] via-[#F0E6D1] to-[#E5D3BC]">
        {/* Logo positioned top left */}
        <nav className="relative z-10 flex justify-between items-center px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
              alt="Advisor Connect"
              className="h-16 w-auto object-contain"
            />
          </div>
        </nav>
        
        <div className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-900">Invitation Invalid</CardTitle>
              <CardDescription className="text-red-700">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/auth')} 
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5D3BC] via-[#F0E6D1] to-[#E5D3BC]">
      {/* Logo positioned top left */}
      <nav className="relative z-10 flex justify-between items-center px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
            alt="Advisor Connect"
            className="h-16 w-auto object-contain"
          />
        </div>
      </nav>
      
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-gray-900">Accept Invitation</CardTitle>
            <CardDescription className="text-gray-600">
              You've been invited to join Advisor Connect as a <strong>{invitation?.role}</strong>.
              Create your account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={invitation?.email || ''}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    disabled={submitting}
                    className="border-gray-200 focus:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    disabled={submitting}
                    className="border-gray-200 focus:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  disabled={submitting}
                  minLength={6}
                  className="border-gray-200 focus:border-gray-400"
                />
                <p className="text-sm text-gray-500">Must be at least 6 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  disabled={submitting}
                  minLength={6}
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
