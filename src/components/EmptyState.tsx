import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4 relative">
        <Icon className="w-10 h-10 text-muted-foreground" />
        <span className="absolute -inset-1 rounded-2xl bg-primary/5 -z-10" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4 gradient-primary text-primary-foreground rounded-xl press-effect">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
