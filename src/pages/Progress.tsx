import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { AuthGuard } from "@/components/AuthGuard";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, Star, TrendingUp, Calendar, Clock, X, BarChart3, Trash2,
  Trophy, Flame, Target, ArrowUp, ArrowDown, Minus, Sparkles, ChevronRight,
  Award, Zap, AlertTriangle,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";

interface Child { id: string; name: string; recommended_sport: string | null; }
interface ProgressEntry { id: string; week_start: string; sport: string; performance_rating: number; notes: string | null; hours_practiced: number | null; }

const motivationalMessages = [
  { min: 0, max: 2, msg: "💪 كل بداية صعبة — استمر وستشاهد نتائج مبهرة!", icon: Zap },
  { min: 2, max: 3.5, msg: "🔥 أداء جيد! مع المزيد من التدريب سيتحسن أكثر", icon: Flame },
  { min: 3.5, max: 4.5, msg: "⭐ أداء ممتاز! طفلك يتطور بسرعة رائعة!", icon: Award },
  { min: 4.5, max: 5.1, msg: "🏆 أداء استثنائي! طفلك نجم حقيقي!", icon: Trophy },
];

const ProgressContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ week_start: "", sport: "", rating: 3, notes: "", hours: "" });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("children").select("id, name, recommended_sport").then(({ data }) => {
      setChildren(data || []);
      setLoading(false);
    });
  }, []);

  const fetchProgress = async (childId: string) => {
    const { data } = await supabase.from("weekly_progress").select("*").eq("child_id", childId).order("week_start", { ascending: false });
    setEntries(data || []);
  };

  const selectChild = (child: Child) => {
    setSelectedChild(child);
    fetchProgress(child.id);
    setForm({ ...form, sport: child.recommended_sport || "" });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChild) return;
    try {
      const { error } = await supabase.from("weekly_progress").insert({
        child_id: selectedChild.id, user_id: user.id,
        week_start: form.week_start, sport: form.sport,
        performance_rating: form.rating,
        notes: form.notes || null,
        hours_practiced: form.hours ? parseFloat(form.hours) : null,
      });
      if (error) throw error;
      toast.success("تم تسجيل التقدم! 🎉");
      setShowAdd(false);
      setForm({ week_start: "", sport: selectedChild.recommended_sport || "", rating: 3, notes: "", hours: "" });
      fetchProgress(selectedChild.id);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("weekly_progress").delete().eq("id", id);
    toast.success("تم الحذف");
    setDeleteConfirm(null);
    if (selectedChild) fetchProgress(selectedChild.id);
  };

  const chartData = entries.slice(0, 12).reverse().map((e) => ({
    week: new Date(e.week_start).toLocaleDateString("ar-EG", { month: "short", day: "numeric" }),
    hours: e.hours_practiced || 0,
    rating: e.performance_rating || 0,
  }));

  const totalHours = entries.reduce((s, e) => s + (Number(e.hours_practiced) || 0), 0);
  const avgRating = entries.length
    ? (entries.reduce((s, e) => s + (e.performance_rating || 0), 0) / entries.length)
    : 0;
  const bestRating = entries.length ? Math.max(...entries.map(e => e.performance_rating || 0)) : 0;
  const totalWeeks = entries.length;

  // Streak calculation
  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    let streak = 1;
    const sorted = [...entries].sort((a, b) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime());
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = new Date(sorted[i].week_start).getTime();
      const next = new Date(sorted[i + 1].week_start).getTime();
      const diff = (curr - next) / (1000 * 60 * 60 * 24);
      if (diff >= 5 && diff <= 10) streak++;
      else break;
    }
    return streak;
  };
  const streak = calculateStreak();

  // Trend calculation
  const getTrend = () => {
    if (entries.length < 2) return "neutral";
    const recent = entries.slice(0, 3).reduce((s, e) => s + (e.performance_rating || 0), 0) / Math.min(3, entries.length);
    const older = entries.slice(-3).reduce((s, e) => s + (e.performance_rating || 0), 0) / Math.min(3, entries.length);
    if (recent > older + 0.3) return "up";
    if (recent < older - 0.3) return "down";
    return "neutral";
  };
  const trend = getTrend();

  const motivational = motivationalMessages.find(m => avgRating >= m.min && avgRating < m.max);

  if (loading) return null;

  return (
    <Layout>
      <PageHeader title="متابعة التقدم" />
      <div className="container mx-auto px-4 pb-8 max-w-lg space-y-4">
        {!selectedChild ? (
          <div className="space-y-4 animate-fade-in">
            <Card className="shadow-card border-border/50 overflow-hidden">
              <div className="gradient-hero p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-black text-primary-foreground mb-1">متابعة التقدم</h2>
                <p className="text-primary-foreground/80 text-sm">سجّل تقييم أسبوعي وتابع تطور طفلك بالأرقام</p>
              </div>
              <CardContent className="p-4 space-y-3">
                {children.length === 0 ? (
                  <EmptyState icon={TrendingUp} title="أضف طفلاً أولاً" actionLabel="إضافة طفل" onAction={() => navigate("/add-child")} />
                ) : children.map((c) => (
                  <button key={c.id} onClick={() => selectChild(c)}
                    className="w-full p-4 rounded-xl border-2 border-border hover:border-primary/30 hover:bg-primary/5 text-right transition-all flex items-center gap-3 press-effect">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 text-lg">{c.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{c.name}</p>
                      {c.recommended_sport && (
                        <p className="text-xs text-primary font-medium mt-0.5">🏅 {c.recommended_sport}</p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => { setSelectedChild(null); setEntries([]); }} className="p-2 rounded-xl hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selectedChild.name}</h2>
                  {selectedChild.recommended_sport && (
                    <p className="text-xs text-primary font-medium">🏅 {selectedChild.recommended_sport}</p>
                  )}
                </div>
              </div>
              <Button onClick={() => setShowAdd(!showAdd)} size="sm" className="gradient-primary text-primary-foreground rounded-xl press-effect">
                <Plus className="w-4 h-4 ml-1" /> تسجيل
              </Button>
            </div>

            {/* Stats Cards */}
            {entries.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="shadow-card border-border/50 overflow-hidden">
                    <div className="h-1 bg-primary/30" />
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-foreground">{totalWeeks}</p>
                          <p className="text-[10px] text-muted-foreground">أسبوع تدريب</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-card border-border/50 overflow-hidden">
                    <div className="h-1 bg-secondary/30" />
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                          <Flame className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-foreground">{totalHours.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">ساعة تدريب</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-card border-border/50 overflow-hidden">
                    <div className="h-1 bg-amber-400/30" />
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <Star className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-foreground">{avgRating.toFixed(1)}</p>
                          <p className="text-[10px] text-muted-foreground">متوسط التقييم</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-card border-border/50 overflow-hidden">
                    <div className={cn("h-1", trend === "up" ? "bg-emerald-400/30" : trend === "down" ? "bg-rose-400/30" : "bg-muted")} />
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center",
                          trend === "up" ? "bg-emerald-500/10" : trend === "down" ? "bg-rose-500/10" : "bg-muted/50"
                        )}>
                          {trend === "up" && <ArrowUp className="w-4 h-4 text-emerald-500" />}
                          {trend === "down" && <ArrowDown className="w-4 h-4 text-rose-500" />}
                          {trend === "neutral" && <Minus className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div>
                          <p className={cn("text-sm font-black",
                            trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-muted-foreground"
                          )}>
                            {trend === "up" ? "تحسّن 📈" : trend === "down" ? "تراجع 📉" : "ثابت ➡️"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">الاتجاه العام</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Streak + Best + Motivation */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="shadow-card border-border/50">
                    <CardContent className="p-3 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-foreground">{streak}🔥</p>
                        <p className="text-[10px] text-muted-foreground">أسابيع متتالية</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-card border-border/50">
                    <CardContent className="p-3 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-violet-500" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-foreground">{bestRating}⭐</p>
                        <p className="text-[10px] text-muted-foreground">أعلى تقييم</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Motivational message */}
                {motivational && (
                  <div className="flex items-center gap-2 bg-primary/5 rounded-xl p-3 border border-primary/10 animate-fade-in">
                    <motivational.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-xs text-foreground font-medium">{motivational.msg}</p>
                  </div>
                )}
              </>
            )}

            {/* Performance Chart - Area instead of Line */}
            {chartData.length > 1 && (
              <Card className="shadow-card border-border/50">
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground text-sm mb-1 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-primary" /> مسار الأداء
                  </h3>
                  <p className="text-[11px] text-muted-foreground mb-3">التقييم عبر الأسابيع</p>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 5]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Area type="monotone" dataKey="rating" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#ratingGrad)" dot={{ r: 4, fill: "hsl(var(--primary))" }} name="التقييم" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hours Chart */}
            {chartData.length > 0 && (
              <Card className="shadow-card border-border/50">
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-secondary" /> ساعات التمرين
                  </h3>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="hours" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} name="ساعات" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Form */}
            {showAdd && (
              <Card className="shadow-elevated animate-scale-in border-primary/20 overflow-hidden">
                <div className="h-1.5 gradient-primary" />
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> تسجيل أسبوع جديد
                  </h3>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> بداية الأسبوع *
                      </label>
                      <Input type="date" value={form.week_start} onChange={(e) => setForm({ ...form, week_start: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">الرياضة *</label>
                      <Input value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">التقييم الأسبوعي</label>
                      <div className="flex gap-2 justify-center py-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}
                            className="transition-transform hover:scale-110 active:scale-95 p-1">
                            <Star className={cn("w-9 h-9", r <= form.rating ? "text-amber-500 fill-amber-500" : "text-muted")} />
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-[10px] text-muted-foreground">
                        {form.rating === 1 && "يحتاج تحسين"}
                        {form.rating === 2 && "مقبول"}
                        {form.rating === 3 && "جيد"}
                        {form.rating === 4 && "ممتاز"}
                        {form.rating === 5 && "استثنائي! ⭐"}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" /> ساعات التدريب
                      </label>
                      <Input type="number" step="0.5" min="0" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="rounded-xl" placeholder="مثال: 2.5" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">ملاحظات</label>
                      <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="rounded-xl" placeholder="أي ملاحظات عن أداء الأسبوع..." />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 gradient-primary text-primary-foreground rounded-xl press-effect">حفظ التقدم</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">إلغاء</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in p-4">
                <Card className="shadow-elevated border-destructive/20 max-w-sm w-full animate-scale-in">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-7 h-7 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">حذف السجل؟</h3>
                      <p className="text-sm text-muted-foreground mt-1">لا يمكن التراجع عن هذا الإجراء</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleDelete(deleteConfirm)} variant="destructive" className="flex-1 rounded-xl">نعم، احذف</Button>
                      <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="flex-1 rounded-xl">إلغاء</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Entries List */}
            {entries.length === 0 ? (
              <Card className="shadow-card border-border/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-7 h-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-foreground font-bold mb-1">لا توجد سجلات بعد</p>
                  <p className="text-xs text-muted-foreground mb-4">أضف أول تقييم أسبوعي لتتبع تقدم طفلك</p>
                  <Button onClick={() => setShowAdd(true)} className="gradient-primary text-primary-foreground rounded-xl press-effect">
                    <Plus className="w-4 h-4 ml-1" /> أول تسجيل
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>السجلات ({entries.length})</span>
                </h3>
                {entries.map((entry, i) => {
                  const ratingLabel = entry.performance_rating >= 4.5 ? "🏆" : entry.performance_rating >= 3.5 ? "⭐" : entry.performance_rating >= 2.5 ? "👍" : "💪";
                  return (
                    <Card key={entry.id} className={cn(
                      "shadow-card border-border/50 hover:shadow-elevated transition-all",
                      i === 0 && "border-primary/20"
                    )}>
                      {i === 0 && <div className="h-0.5 gradient-primary" />}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-bold text-foreground text-sm">{entry.sport}</p>
                              {i === 0 && <span className="text-[10px] text-primary font-bold bg-primary/5 px-1.5 py-0.5 rounded-full">الأحدث</span>}
                              <span className="text-sm">{ratingLabel}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.week_start).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                          </div>
                          <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((r) => (
                              <Star key={r} className={cn("w-4 h-4", r <= (entry.performance_rating || 0) ? "text-amber-500 fill-amber-500" : "text-muted")} />
                            ))}
                          </div>
                          {entry.hours_practiced != null && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" /> {entry.hours_practiced} ساعة
                            </span>
                          )}
                        </div>
                        {entry.notes && <p className="text-xs text-muted-foreground mt-2 leading-relaxed bg-muted/30 rounded-lg p-2">{entry.notes}</p>}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

const ProgressPage = () => <AuthGuard><ProgressContent /></AuthGuard>;
export default ProgressPage;
