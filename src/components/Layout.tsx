import { ReactNode, memo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Trophy, TrendingUp, Video, User, MapPin, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { icon: Home, label: "الرئيسية", path: "/dashboard" },
  { icon: Trophy, label: "الاختبار", path: "/assessment" },
  { icon: TrendingUp, label: "التقدم", path: "/progress" },
  { icon: Video, label: "فيديوهات", path: "/videos" },
  { icon: User, label: "حسابي", path: "/profile" },
] as const;

const desktopNavItems = [
  ...navItems.slice(0, 4),
  { icon: MapPin, label: "مراكز التدريب", path: "/centers" },
  { icon: BookOpen, label: "نصائح", path: "/tips" },
  navItems[4],
] as const;

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

const NavButton = memo(function NavButton({
  item,
  isActive,
  onClick,
  variant,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  variant: "desktop" | "mobile";
}) {
  if (variant === "desktop") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold press-effect",
          isActive
            ? "gradient-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} aria-hidden="true" />
        <span>{item.label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] press-effect",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.label}
    >
      <div className={cn("relative transition-all", isActive && "scale-110")}>
        <item.icon className={cn("w-5 h-5 transition-all", isActive && "stroke-[2.5px]")} aria-hidden="true" />
        {isActive && <span className="absolute -inset-2 rounded-full bg-primary/10 -z-10" />}
      </div>
      <span className="text-[10px] font-semibold leading-none">{item.label}</span>
      {isActive && <span className="absolute -bottom-0 w-6 h-0.5 rounded-full bg-primary" />}
    </button>
  );
});

export function Layout({ children, hideNav }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = useCallback(
    (path: string) => navigate(path),
    [navigate]
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!hideNav && (
        <aside
          className="hidden md:flex flex-col w-64 border-l border-border bg-card/50 fixed inset-y-0 right-0 z-40"
          aria-label="القائمة الجانبية"
        >
          <div className="p-5 border-b border-border">
            <button onClick={() => handleNav("/dashboard")} className="flex items-center gap-2 press-effect">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <Trophy className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-foreground block leading-none">Helm</span>
                <span className="text-[9px] text-muted-foreground">اكتشف رياضة طفلك</span>
              </div>
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar" aria-label="التنقل الرئيسي">
            {desktopNavItems.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                onClick={() => handleNav(item.path)}
                variant="desktop"
              />
            ))}
          </nav>

          <div className="p-4 border-t border-border space-y-3">
            {/* Quick tip */}
            <div className="rounded-xl bg-primary/5 p-3 border border-primary/10">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <p className="text-[10px] font-bold text-foreground">نصيحة اليوم</p>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                شجّع طفلك على ممارسة 60 دقيقة نشاط بدني يومياً
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} Helm</p>
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col min-h-screen", !hideNav && "md:mr-64")}>
        <main className={cn("flex-1", !hideNav && "pb-20 md:pb-0")} role="main" id="main-content">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {!hideNav && (
        <nav
          className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border md:hidden safe-bottom"
          aria-label="القائمة الرئيسية"
        >
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => (
              <NavButton
                key={item.path}
                item={item}
                isActive={location.pathname === item.path}
                onClick={() => handleNav(item.path)}
                variant="mobile"
              />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
