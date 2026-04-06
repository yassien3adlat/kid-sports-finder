import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Trophy, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, XCircle, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function PasswordStrength({ password }: { password: string }) {
  const analysis = useMemo(() => {
    const checks = [
      { label: "8 أحرف على الأقل", pass: password.length >= 8 },
      { label: "حرف كبير", pass: /[A-Z]/.test(password) },
      { label: "رقم", pass: /\d/.test(password) },
      { label: "رمز خاص", pass: /[^A-Za-z0-9]/.test(password) },
    ];
    const score = checks.filter((c) => c.pass).length;
    return { checks, score };
  }, [password]);

  if (!password) return null;

  const colors = ["bg-destructive", "bg-destructive", "bg-secondary", "bg-primary", "bg-primary"];
  const labels = ["ضعيفة جداً", "ضعيفة", "متوسطة", "قوية", "ممتازة"];

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i < analysis.score ? colors[analysis.score] : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className={cn("text-[10px] font-semibold", analysis.score <= 1 ? "text-destructive" : analysis.score === 2 ? "text-secondary" : "text-primary")}>
          {labels[analysis.score]}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {analysis.checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1">
            {check.pass ? (
              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            )}
            <span className={cn("text-[10px]", check.pass ? "text-foreground" : "text-muted-foreground")}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (user) { navigate("/dashboard", { replace: true }); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
        setIsForgot(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) {
          if (error.message.includes("Invalid login")) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          }
          throw error;
        }
        toast.success("تم تسجيل الدخول بنجاح! 🎉");
        navigate("/dashboard");
      } else {
        if (form.password.length < 8) {
          throw new Error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
        }
        const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        toast.success("تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني ✉️");
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) { toast.error("فشل تسجيل الدخول بـ Google"); return; }
      if (result.redirected) return;
      navigate("/dashboard");
    } catch (error: any) { toast.error(error.message || "حدث خطأ"); }
    finally { setGoogleLoading(false); }
  };

  const title = isForgot ? "نسيت كلمة المرور" : isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد";
  const subtitle = isForgot ? "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين" : isLogin ? "مرحباً بعودتك! سجّل دخولك للمتابعة" : "أنشئ حسابك المجاني وابدأ رحلة اكتشاف موهبة طفلك";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

      {/* Floating orbs */}
      <div className="orb orb-primary w-80 h-80 -top-20 -right-20 animate-float-slow" />
      <div className="orb orb-accent w-56 h-56 bottom-20 -left-10 animate-float-delayed" />
      <div className="orb orb-secondary w-40 h-40 top-1/3 left-10 animate-float" style={{ animationDelay: '3s' }} />

      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-48 h-48 rounded-full border border-primary-foreground/[0.04] hidden md:block" />
      <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full border border-primary-foreground/[0.04] hidden md:block" />

      <div className="w-full max-w-md animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-lg)] border border-primary-foreground/10">
            <Trophy className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">{subtitle}</p>
        </div>

        <Card className="shadow-[var(--shadow-2xl)] border-border/30 backdrop-blur-sm bg-card/95">
          <CardContent className="p-6 space-y-5">
            {!isForgot && (
              <>
                <Button variant="outline" onClick={handleGoogleLogin} disabled={googleLoading}
                  className="w-full rounded-xl py-6 text-sm font-semibold border-border/50 hover:bg-muted/50 press-effect hover:border-primary/20 transition-all bg-card/80 backdrop-blur-sm">
                  {googleLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : (
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  المتابعة مع Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">أو</span></div>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isForgot && (
                <div className="relative group">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input placeholder="الاسم الكامل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pr-10 rounded-xl py-6 bg-muted/20 border-border/40 focus-visible:bg-background" required />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pr-10 rounded-xl py-6 bg-muted/20 border-border/40 focus-visible:bg-background" required dir="ltr" />
              </div>
              {!isForgot && (
                <>
                  <div className="relative group">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input type={showPassword ? "text" : "password"} placeholder="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pr-10 pl-10 rounded-xl py-6 bg-muted/20 border-border/40 focus-visible:bg-background" required minLength={6} dir="ltr" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!isLogin && <PasswordStrength password={form.password} />}
                </>
              )}
              {isLogin && !isForgot && (
                <button type="button" onClick={() => setIsForgot(true)} className="text-xs text-primary hover:underline block font-medium">نسيت كلمة المرور؟</button>
              )}
              <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground rounded-xl py-6 text-base press-effect shine-effect shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] transition-shadow">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isForgot ? "إرسال رابط إعادة التعيين" : isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
              </Button>
            </form>

            {/* Security note */}
            {!isForgot && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/20 rounded-xl px-3.5 py-2.5 border border-border/30">
                <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>بياناتك محمية بتشفير عالي المستوى ولن تتم مشاركتها</span>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {isForgot ? (
                <button onClick={() => setIsForgot(false)} className="text-primary font-semibold hover:underline">العودة لتسجيل الدخول</button>
              ) : isLogin ? (
                <>ليس لديك حساب؟ <button onClick={() => setIsLogin(false)} className="text-primary font-semibold hover:underline">سجّل الآن</button></>
              ) : (
                <>لديك حساب بالفعل؟ <button onClick={() => setIsLogin(true)} className="text-primary font-semibold hover:underline">تسجيل الدخول</button></>
              )}
            </p>
          </CardContent>
        </Card>
        <button onClick={() => navigate("/")} className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto block press-effect">العودة للصفحة الرئيسية</button>
      </div>
    </div>
  );
};

export default Auth;
