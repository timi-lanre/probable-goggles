
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  pending2FA: boolean;
  userEmail: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  send2FACode: (email: string) => Promise<{ error: any }>;
  verify2FACode: (email: string, code: string) => Promise<{ error: any; isAdmin?: boolean }>;
  resend2FACode: () => Promise<{ error: any }>;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  pending2FA: boolean;
  userEmail: string | null;
  tempPassword: string | null;
}
