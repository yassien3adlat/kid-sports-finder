import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy, Users, Target, TrendingUp, MapPin, BookOpen, ChevronLeft,
  Sparkles, Shield, Star, Quote, CheckCircle2, ArrowLeft, Zap, Heart,
  ChevronDown, MessageSquare, Award, Rocket, Clock,
} from "lucide-react";
import heroImage from "@/assets/hero-kids-sports.jpg";
import { cn } from "@/lib/utils";

const features = [
  { icon: Users, title: "تسجيل الأطفال", description: "سجّل بيانات أطفالك بسهولة وتابع تطورهم الرياضي مع ملفات شخصية متكاملة", color: "from-primary to-emerald-500" },
  { icon: Target, title: "اختبار القدرات", description: "27 سؤال ذكي يحلل 8 قدرات بدنية وذهنية لطفلك بدقة عالية", color: "from-secondary to-amber-400" },
  { icon: Trophy, title: "اقتراح الرياضة", description: "توصيات مبنية على تحليل علمي شامل مع نسب التوافق لـ 11 رياضة", color: "from-primary to-teal-500" },
  { icon: TrendingUp, title: "متابعة التقدم", description: "رسوم بيانية أسبوعية وتقييمات أداء لتتبع تطور مهارات طفلك", color: "from-accent to-blue-400" },
  { icon: MapPin, title: "أماكن التدريب", description: "اكتشف الأندية ومراكز التدريب القريبة مع التقييمات والموقع على الخريطة", color: "from-secondary to-orange-400" },
  { icon: BookOpen, title: "نصائح متخصصة", description: "إرشادات غذائية وذهنية ولياقية مصنّفة من خبراء رياضة الأطفال", color: "from-primary to-green-500" },
];

const stats = [
  { value: "27", label: "سؤال تحليلي", icon: Target },
  { value: "11", label: "رياضة مدعومة", icon: Zap },
  { value: "50+", label: "مركز تدريب", icon: MapPin },
  { value: "8", label: "قدرات تحليلية", icon: Award },
];

const steps = [
  { step: "١", title: "سجّل حسابك", desc: "أنشئ حساباً مجانياً في ثوانٍ باستخدام بريدك أو Google", icon: Rocket },
  { step: "٢", title: "أضف طفلك", desc: "أدخل بيانات الطفل: العمر، الطول، الوزن، الجنس", icon: Users },
  { step: "٣", title: "اختبار القدرات", desc: "أجب على 27 سؤال عن قدرات طفلك البدنية وتفضيلاته", icon: Target },
  { step: "٤", title: "ابدأ الرحلة", desc: "احصل على توصيات مفصلة وتابع تقدمه أسبوعياً", icon: Trophy },
];

const testimonials = [
  { name: "أم محمد", text: "ساعدني التطبيق في اكتشاف أن ابني لديه موهبة في السباحة! الآن هو بطل النادي. الاختبار كان دقيق جداً.", rating: 5, sport: "السباحة", location: "القاهرة" },
  { name: "أبو سارة", text: "اختبار القدرات دقيق جداً. اقترح كرة السلة لابنتي وفعلاً أبدعت فيها. أنصح كل أب وأم بتجربته.", rating: 5, sport: "كرة السلة", location: "جدة" },
  { name: "أم خالد", text: "أحب متابعة تقدم أطفالي الأسبوعي. التطبيق سهل ومفيد جداً للعائلة. الرسوم البيانية رائعة.", rating: 5, sport: "الكاراتيه", location: "الرياض" },
  { name: "أبو عمر", text: "كنت محتار أسجل ابني في أي رياضة. التطبيق حلل قدراته واقترح التنس وفعلاً كان اختيار ممتاز!", rating: 5, sport: "التنس", location: "دبي" },
];

const benefits = [
  "اختبار علمي يحلل 8 قدرات بدنية وذهنية",
  "أسئلة تفضيلات تراعي ما يحبه ويكرهه طفلك",
  "توصيات مخصصة لـ 11 رياضة مع نسب التوافق",
  "متابعة أسبوعية مع رسوم بيانية تفاعلية",
  "دليل شامل لمراكز التدريب مع GPS",
  "نصائح تغذية ولياقة وصحة نفسية",
  "تسجيل دخول سريع عبر Google",
  "يعمل على كل الأجهزة (PWA)",
];

const faqs = [
  { q: "هل التطبيق مجاني بالكامل؟", a: "نعم، التطبيق مجاني 100% ولا يتطلب أي اشتراك أو دفع. جميع الميزات متاحة لجميع المستخدمين." },
  { q: "كم عمر الطفل المناسب للاختبار؟", a: "الاختبار مناسب للأطفال من عمر 3 إلى 18 سنة. الأسئلة مصممة لتناسب جميع الفئات العمرية." },
  { q: "كيف يتم تحليل قدرات الطفل؟", a: "نستخدم 27 سؤالاً لتحليل 8 قدرات أساسية (السرعة، التحمل، التركيز، ردة الفعل، العمل الجماعي، الدقة، المرونة، القوة) بالإضافة لأسئلة تفضيلات شخصية." },
  { q: "هل يمكنني إضافة أكثر من طفل؟", a: "نعم، يمكنك إضافة عدد غير محدود من الأطفال ومتابعة تقدم كل طفل بشكل مستقل." },
  { q: "هل بياناتي آمنة؟", a: "نعم، جميع البيانات مشفرة ومحمية بتقنية SSL/TLS ولا تتم مشاركتها مع أي طرف خارجي." },
];

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CountUp({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const numericTarget = parseInt(target.replace(/\D/g, ""));
  const hasPlus = target.includes("+");

  useEffect(() => {
    if (!isInView || !numericTarget) return;
    let current = 0;
    const increment = Math.max(1, Math.floor(numericTarget / 30));
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [isInView, numericTarget]);

  return <span ref={ref}>{count}{hasPlus ? "+" : ""}{suffix}</span>;
}

function FAQItem({ faq, isOpen, toggle }: { faq: { q: string; a: string }; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden transition-all">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 text-right hover:bg-muted/30 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-foreground text-sm">{faq.q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 mr-3", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-top" role="navigation" aria-label="التنقل الرئيسي">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black text-foreground">Helm</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              size="sm"
              className="rounded-xl border-border/50 hidden sm:flex"
            >
              تسجيل الدخول
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              size="sm"
              className="gradient-primary text-primary-foreground rounded-xl press-effect shadow-soft"
            >
              ابدأ الآن
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center" aria-labelledby="hero-heading">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="أطفال يمارسون الرياضة بسعادة"
            className="w-full h-full object-cover"
            width={1920}
            height={1024}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40" />
        </div>

        <div className="relative container mx-auto px-6 pt-28 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>اكتشف موهبة طفلك الرياضية — مجاناً</span>
          </div>

          <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground mb-5 animate-slide-up leading-tight text-balance">
            اكتشف الرياضة
            <br />
            <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
              المناسبة لطفلك
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-slide-up leading-relaxed text-balance">
            نحلل 8 قدرات بدنية وذهنية لطفلك ونقترح الرياضة الأنسب من 11 رياضة مع متابعة تطوره خطوة بخطوة
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="gradient-primary text-primary-foreground text-lg px-10 py-7 shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] rounded-2xl press-effect"
            >
              ابدأ الآن مجاناً
              <ChevronLeft className="w-5 h-5 mr-1" aria-hidden="true" />
            </Button>
            <Button
              onClick={() => {
                document.getElementById("features-heading")?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-7 rounded-2xl border-border/50 hover:bg-muted/50 press-effect"
            >
              تعرّف على المزيد
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 animate-fade-in max-w-3xl mx-auto" role="list" aria-label="إحصائيات">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-border/30" role="listitem">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <p className="text-3xl md:text-4xl font-black text-foreground">
                    <CountUp target={stat.value} />
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-8 text-xs text-muted-foreground animate-fade-in">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-primary" /> بيانات مشفرة</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> 8 دقائق فقط</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> مجاني 100%</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20" aria-labelledby="features-heading">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Target className="w-3.5 h-3.5" /> المميزات
          </span>
          <h2 id="features-heading" className="text-3xl md:text-4xl font-black text-foreground mb-3 text-balance">
            كل ما يحتاجه طفلك في مكان واحد
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            نظام متكامل لاكتشاف المواهب الرياضية وتطويرها بطريقة علمية ومدروسة
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 border-border/50 group overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <feature.icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-20" aria-labelledby="steps-heading">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" /> كيف يعمل
            </span>
            <h2 id="steps-heading" className="text-3xl font-black text-foreground">
              4 خطوات بسيطة لاكتشاف موهبة طفلك
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {steps.map((item, i) => (
              <AnimatedSection key={i} delay={i * 150} className="text-center group">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-black text-2xl group-hover:scale-110 transition-transform shadow-soft">
                    {item.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 -left-3 w-6 h-[2px] bg-border" />
                  )}
                </div>
                <h3 className="font-bold text-foreground mb-1.5 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits checklist */}
      <section className="container mx-auto px-6 py-20" aria-labelledby="benefits-heading">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Heart className="w-3.5 h-3.5" /> لماذا Helm؟
            </span>
            <h2 id="benefits-heading" className="text-3xl font-black text-foreground mb-6 text-balance">
              كل ما تحتاجه لدعم رحلة طفلك الرياضية
            </h2>
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-foreground font-medium text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "27", label: "سؤال ذكي", sub: "في الاختبار", color: "gradient-primary" },
                { val: "8", label: "قدرات", sub: "تحليلية", color: "gradient-secondary" },
                { val: "11", label: "رياضة", sub: "مقترحة", color: "gradient-hero" },
                { val: "100%", label: "مجاني", sub: "بالكامل", color: "gradient-primary" },
              ].map((item, i) => (
                <Card key={i} className="shadow-card border-border/50 overflow-hidden hover:shadow-elevated transition-all">
                  <CardContent className="p-5 text-center">
                    <p className="text-3xl font-black text-primary mb-1">{item.val}</p>
                    <p className="text-sm font-bold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-20" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Star className="w-3.5 h-3.5" /> آراء المستخدمين
            </span>
            <h2 id="testimonials-heading" className="text-3xl font-black text-foreground mb-2">
              ماذا يقول أولياء الأمور؟
            </h2>
            <p className="text-muted-foreground text-sm">أكثر من 500 عائلة استفادت من Helm</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <Card className="shadow-card border-border/50 h-full hover:shadow-elevated transition-all hover:-translate-y-1">
                  <CardContent className="p-5">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={cn("w-3.5 h-3.5", j < t.rating ? "text-amber-500 fill-amber-500" : "text-muted")} />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-primary/20 mb-2" />
                    <p className="text-foreground text-sm leading-relaxed mb-4">{t.text}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div>
                        <p className="font-bold text-foreground text-sm">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground">{t.location} • {t.sport}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{t.sport}</span>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-20" aria-labelledby="faq-heading">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> أسئلة شائعة
          </span>
          <h2 id="faq-heading" className="text-3xl font-black text-foreground">
            الأسئلة الأكثر شيوعاً
          </h2>
        </AnimatedSection>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <FAQItem faq={faq} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-20" aria-labelledby="cta-heading">
        <AnimatedSection className="container mx-auto px-6 text-center">
          <Shield className="w-14 h-14 text-primary-foreground/80 mx-auto mb-5" aria-hidden="true" />
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-black text-primary-foreground mb-4 text-balance">
            جاهز تكتشف رياضة طفلك؟
          </h2>
          <p className="text-primary-foreground/80 mb-6 text-lg max-w-md mx-auto">
            سجّل الآن مجاناً وابدأ رحلة اكتشاف موهبة طفلك الرياضية
          </p>
          <div className="flex items-center justify-center gap-6 text-primary-foreground/60 text-xs mb-10">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> مجاني بالكامل</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> بدون بطاقة ائتمان</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 8 دقائق فقط</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-background text-primary hover:bg-background/90 text-lg px-10 py-7 shadow-elevated hover:scale-[1.02] transition-all rounded-2xl font-bold press-effect"
            >
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12" role="contentinfo">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                </div>
                <span className="font-black text-foreground text-lg">Helm</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                تطبيق ذكي لاكتشاف المواهب الرياضية للأطفال ومتابعة تطورهم بطريقة علمية ومدروسة
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-3 text-sm">الخدمات</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>اختبار القدرات الرياضية (27 سؤال)</li>
                <li>متابعة التقدم الأسبوعي</li>
                <li>دليل مراكز التدريب (50+)</li>
                <li>نصائح وإرشادات متخصصة</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-3 text-sm">التطبيق</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>مجاني بالكامل — بدون إعلانات</li>
                <li>يعمل على جميع الأجهزة</li>
                <li>متاح كتطبيق PWA</li>
                <li>آمن وخاص — تشفير SSL/TLS</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Helm. جميع الحقوق محفوظة
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> بيانات مشفرة</span>
              <span>🇸🇦 صنع بحب</span>
            </div>
          </div>
        </div>
      </footer>

      {/* JSON-LD for FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
};

export default Index;
