import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backTo?: string;
  children?: ReactNode;
  compact?: boolean;
}

export function PageHeader({ title, backTo = "/dashboard", children, compact }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`gradient-hero text-primary-foreground ${compact ? "p-4" : "p-6"}`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(backTo)}
            className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            aria-label="الرجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold truncate">{title}</h1>
        </div>
        {children}
      </div>
    </header>
  );
}
