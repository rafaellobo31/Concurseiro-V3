import { Crown } from 'lucide-react';

interface ProFeatureBadgeProps {
  className?: string;
}

export function ProFeatureBadge({ className = '' }: ProFeatureBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200 ${className}`}>
      <Crown className="w-3 h-3" />
      Pro
    </span>
  );
}
