
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [tokenProcessed, setTokenProcessed] = useState(false);
  const [resetTokens, setResetTokens] = useState<{access_token: string, refresh_token: string} | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check for password reset tokens in URL or if user came from forgot password
  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const searchParams = new URLSearchParams(location.search);
    
    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
    const type = hashParams.get('type') || searchParams.get('type');
    
    // Check if user came from forgot password flow via state or URL params
    const fromForgotPassword = location.state?.fromForgotPassword || 
                               searchParams.get('fromForgotPassword') === 'true';

    if ((accessToken && refreshToken && type === 'recovery') || fromForgotPassword) {
      setIsResetMode(true);
      setTokenProcessed(true);
      
      // Store tokens for later use but don't set session yet
      if (accessToken && refreshToken) {
        setResetTokens({ access_token: accessToken, refresh_token: refreshToken });
        console.log('Password reset tokens detected, entering reset mode');
      }
    }
  }, [location]);

  // For password reset mode, don't redirect if not logged in
  useEffect(() => {
    if (!isResetMode && !user) {
      navigate('/auth');
    }
  }, [user, navigate, isResetMode]);

  const handleHomeClick = async () => {
    if (user) {
      // Check user role and redirect accordingly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate new password
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        toast({
          title: "Invalid Password",
          description: passwordError,
          variant: "destructive",
        });
        return;
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "New password and confirmation do not match",
          variant: "destructive",
        });
        return;
      }

      if (isResetMode && resetTokens) {
        // For password reset mode, first set the session temporarily
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: resetTokens.access_token,
          refresh_token: resetTokens.refresh_token
        });

        if (sessionError) {
          toast({
            title: "Invalid Reset Link",
            description: "The password reset link is invalid or has expired. Please request a new one.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }
      }

      // Update password in Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        toast({
          title: "Password Update Failed",
          description: updateError.message,
          variant: "destructive",
        });
        return;
      }

      // Clear the password reset flag if user is logged in
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            password_reset_required: false,
            password_reset_at: null
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      toast({
        title: "Password Changed Successfully",
        description: isResetMode 
          ? "Your password has been reset. You can now sign in with your new password."
          : "Your password has been updated. You can now access your account.",
      });

      if (isResetMode) {
        // For password reset, sign out and redirect to login
        await supabase.auth.signOut();
        navigate('/auth');
      } else {
        // For regular password change, redirect based on user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user?.id)
          .single();

        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while processing reset token
  if (isResetMode && !user && !tokenProcessed) {
    return (
      <div className="min-h-screen bg-[#E5D3BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5D3BC] overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/8 rounded-full blur-xl animate-pulse delay-3000"></div>
      </div>

      {/* Navigation with Logo and Home Button */}
      <nav className="relative z-10 flex justify-between items-center px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
            alt="Advisor Connect"
            className="h-16 w-auto object-contain"
          />
        </div>
        <Button
          onClick={handleHomeClick}
          variant="outline"
          className="bg-white/20 border-white/30 text-slate-900 hover:bg-white/30"
        >
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <Card className="w-full max-w-md bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Lock className="h-12 w-12 text-slate-900" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">
              {isResetMode ? 'Reset Password' : 'Change Password'}
            </CardTitle>
            <CardDescription className="text-slate-700 text-lg">
              {isResetMode 
                ? 'Enter your new password below'
                : 'You must change your password to continue'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isResetMode && (
                <div className="space-y-2 relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="h-12 bg-white/50 border-white/30 placeholder:text-slate-600 text-slate-900 focus:bg-white/80 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              )}

              <div className="space-y-2 relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="h-12 bg-white/50 border-white/30 placeholder:text-slate-600 text-slate-900 focus:bg-white/80 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="space-y-2 relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 bg-white/50 border-white/30 placeholder:text-slate-600 text-slate-900 focus:bg-white/80 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="bg-white/30 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-slate-900 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-slate-800 hover:transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isResetMode ? 'Resetting Password...' : 'Changing Password...'}
                  </div>
                ) : (
                  isResetMode ? 'Reset Password' : 'Change Password'
                )}
              </Button>

              {isResetMode && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="text-slate-700 hover:text-slate-900 text-sm underline"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
