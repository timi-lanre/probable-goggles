
import { useState } from 'react';

export interface AuthFlowState {
  showForgotPassword: boolean;
  setShowForgotPassword: (show: boolean) => void;
}

export function useAuthFlow(): AuthFlowState {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return {
    showForgotPassword,
    setShowForgotPassword
  };
}
