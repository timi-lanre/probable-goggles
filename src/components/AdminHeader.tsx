
import { UnifiedHeader } from './UnifiedHeader';

interface AdminHeaderProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    role: string;
  } | null;
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  return <UnifiedHeader profile={profile} showWelcome={true} />;
}
