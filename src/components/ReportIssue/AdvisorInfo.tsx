
interface Advisor {
  first_name: string | null;
  last_name: string | null;
  firm: string | null;
}

interface AdvisorInfoProps {
  advisor: Advisor;
}

export function AdvisorInfo({ advisor }: AdvisorInfoProps) {
  return (
    <div className="bg-slate-50 p-3 rounded-lg">
      <p className="text-sm text-slate-600 mb-1">Reporting issue for:</p>
      <p className="font-medium text-slate-900">
        {advisor.first_name} {advisor.last_name}
      </p>
      {advisor.firm && (
        <p className="text-sm text-slate-600">{advisor.firm}</p>
      )}
    </div>
  );
}
