
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

export function ForgotPasswordForm({ onBackToSignIn }: ForgotPasswordFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('forgot-password', {
        body: { email: forgotPasswordEmail }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset email sent",
          description: "If an account with that email exists, a password reset link has been sent.",
        });
        onBackToSignIn();
        setForgotPasswordEmail('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center font-semibold text-gray-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Enter your email to receive a reset link
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="forgot-email"
                placeholder="Enter your email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black"
                required
              />
            </div>
          </div>
          
          <Button 
            disabled={loading} 
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-colors" 
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onBackToSignIn} 
            className="w-full h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            type="button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </form>
      </CardContent>
    </>
  );
}
