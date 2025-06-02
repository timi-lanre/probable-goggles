
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export function TwoFactorForm() {
  const { userEmail, verify2FACode, resend2FACode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 4) {
      toast({
        title: "Invalid code",
        description: "Please enter a 4-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error, isAdmin } = await verify2FACode(userEmail!, verificationCode);
      
      if (error) {
        toast({
          title: "Verification failed",
          description: error.message || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Login successful.",
        });
        
        // Redirect based on user role with a small delay to ensure auth state is updated
        console.log('TwoFactorForm: Redirecting user, isAdmin:', isAdmin);
        setTimeout(() => {
          if (isAdmin) {
            console.log('TwoFactorForm: Redirecting to admin dashboard');
            navigate('/admin', { replace: true });
          } else {
            console.log('TwoFactorForm: Redirecting to user dashboard');
            navigate('/dashboard', { replace: true });
          }
        }, 100);
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setVerificationCode('');
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    const { error } = await resend2FACode();
    if (error) {
      toast({
        title: "Failed to resend code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email address.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center font-semibold text-gray-900">
          Verification Required
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          We've sent a verification code to {userEmail}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleVerify2FA} className="space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-black" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Please enter the 4-digit verification code we sent to your email address.
            </p>
          </div>
          
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={verificationCode}
              onChange={(value) => setVerificationCode(value)}
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot 
                  index={0} 
                  className="w-14 h-14 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-black focus:ring-black" 
                />
                <InputOTPSlot 
                  index={1} 
                  className="w-14 h-14 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-black focus:ring-black" 
                />
                <InputOTPSlot 
                  index={2} 
                  className="w-14 h-14 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-black focus:ring-black" 
                />
                <InputOTPSlot 
                  index={3} 
                  className="w-14 h-14 text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-black focus:ring-black" 
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button 
            disabled={loading} 
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors" 
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
          
          <div className="text-center space-y-3">
            <Button 
              variant="link" 
              onClick={handleResendCode} 
              disabled={loading} 
              className="text-black hover:text-gray-800 text-sm"
            >
              {loading ? 'Resending...' : 'Resend Code'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')} 
              className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
