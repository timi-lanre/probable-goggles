
import { useState } from 'react';

export function useAuthState() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return {
    showForgotPassword,
    setShowForgotPassword,
  };
}
