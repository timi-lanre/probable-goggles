
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuthFlow } from './hooks/useAuthFlow';
import { AuthFormSelector } from './components/AuthFormSelector';

export default function Auth() {
  const { user, pending2FA } = useAuth();
  const authFlow = useAuthFlow();

  // Redirect authenticated users
  if (user && !pending2FA) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <AuthFormSelector authFlow={authFlow} />
    </AuthLayout>
  );
}
