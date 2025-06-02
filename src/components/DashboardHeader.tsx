
import { UnifiedHeader } from './UnifiedHeader';

interface DashboardHeaderProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    role?: string;
  } | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return <UnifiedHeader profile={profile} showWelcome={true} />;
}
