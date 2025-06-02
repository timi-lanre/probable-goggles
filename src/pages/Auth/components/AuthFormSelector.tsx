
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SignInForm } from '@/components/auth/SignInForm';
import { TwoFactorForm } from '@/components/auth/TwoFactorForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { AuthFlowState } from '../hooks/useAuthFlow';

interface AuthFormSelectorProps {
  authFlow: AuthFlowState;
}

export function AuthFormSelector({ authFlow }: AuthFormSelectorProps) {
  const { pending2FA } = useAuth();
  const { showForgotPassword, setShowForgotPassword } = authFlow;

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm 
        onBackToSignIn={() => setShowForgotPassword(false)} 
      />
    );
  }
  
  if (pending2FA) {
    return <TwoFactorForm />;
  }
  
  return (
    <SignInForm 
      onForgotPassword={() => setShowForgotPassword(true)} 
    />
  );
}
