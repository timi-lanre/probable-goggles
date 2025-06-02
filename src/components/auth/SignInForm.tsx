
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface SignInFormProps {
  onForgotPassword: () => void;
}

export function SignInForm({ onForgotPassword }: SignInFormProps) {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent a verification code to your email address.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center font-semibold text-gray-900">
          Sign In
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Enter your credentials to continue
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-black focus:ring-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onForgotPassword}
              className="text-sm text-black hover:text-gray-800"
              type="button"
            >
              Forgot your password?
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
