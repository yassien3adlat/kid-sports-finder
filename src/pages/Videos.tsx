import { useState } from "react";
import { Layout } from "@/components/Layout";
import { AuthGuard } from "@/components/AuthGuard";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Search, Film, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoCard } from "@/components/VideoCard";
import { videos, categories } from "@/data/videos";

function VideosContent() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState("الكل");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const levels = ["الكل", "مبتدئ", "متوسط"];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = videos.filter((v) => {
    const matchCat = activeCategory === "الكل" || v.category === activeCategory;
    const matchLevel = activeLevel === "الكل" || v.level === activeLevel;
    const matchSearch = !search || v.title.includes(search) || v.category.includes(search) || v.channel.includes(search);
    const matchFav = !showFavoritesOnly || favorites.has(v.id);
    return matchCat && matchSearch && matchLevel && matchFav;
  });

  // Total duration estimate
  const totalMinutes = videos.reduce((sum, v) => {
    const parts = v.duration.split(":");
    return sum + (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
  }, 0);

  return (
    <Layout>
      <PageHeader title="فيديوهات تدريبية" backTo="/dashboard" />
      <div className="container mx-auto px-4 pb-8 space-y-4">
        {/* Hero Stats */}
        <Card className="shadow-[var(--shadow-lg)] border-border/30 overflow-hidden">
          <div className="gradient-hero p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-primary-foreground/5 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-20 h-20 rounded-full bg-primary-foreground/[0.03]" />
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-primary-foreground/10 shadow-[var(--shadow-md)] relative">
              <Film className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-black text-primary-foreground relative">مكتبة الفيديوهات</h2>
            <p className="text-primary-foreground/70 text-xs mt-1 relative">محتوى عربي حصري للأطفال</p>
          </div>
          <CardContent className="p-3">
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-lg font-black text-foreground">{videos.length}</p>
                <p className="text-[10px] text-muted-foreground">فيديو</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-lg font-black text-foreground">{categories.length - 1}</p>
                <p className="text-[10px] text-muted-foreground">تصنيف</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-lg font-black text-foreground">{Math.round(totalMinutes / 60)}+</p>
                <p className="text-[10px] text-muted-foreground">ساعة محتوى</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن فيديو أو قناة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 rounded-xl bg-muted/30 border-border/50 h-11"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((c) => {
            const catCount = c === "الكل" ? videos.length : videos.filter(v => v.category === c).length;
            return (
              <Badge
                key={c}
                variant={activeCategory === c ? "default" : "outline"}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all press-effect",
                  activeCategory === c ? "gradient-primary text-primary-foreground border-transparent shadow-sm" : "hover:bg-muted"
                )}
                onClick={() => setActiveCategory(c)}
              >
                {c} ({catCount})
              </Badge>
            );
          })}
        </div>

        {/* Level + Favorites Filter */}
        <div className="flex items-center gap-1.5">
          {levels.map((l) => (
            <Badge
              key={l}
              variant={activeLevel === l ? "default" : "outline"}
              className={cn(
                "cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all press-effect",
                activeLevel === l ? "bg-foreground text-background border-transparent" : "hover:bg-muted"
              )}
              onClick={() => setActiveLevel(l)}
            >
              {l === "الكل" ? "كل المستويات" : l}
            </Badge>
          ))}
          {favorites.size > 0 && (
            <Badge
              variant={showFavoritesOnly ? "default" : "outline"}
              className={cn(
                "cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all press-effect mr-auto",
                showFavoritesOnly ? "bg-rose-500 text-white border-transparent" : "hover:bg-muted"
              )}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Heart className="w-3 h-3 ml-1" /> المفضلة ({favorites.size})
            </Badge>
          )}
        </div>

        {/* Results */}
        <p className="text-xs text-muted-foreground">
          عرض <span className="text-foreground font-bold">{filtered.length}</span> فيديو
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((video) => (
            <div key={video.id} className="relative">
              <VideoCard video={video} />
              <button
                onClick={() => toggleFavorite(video.id)}
                className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                aria-label={favorites.has(video.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
              >
                <Heart className={cn("w-4 h-4", favorites.has(video.id) ? "text-rose-500 fill-rose-500" : "text-white")} />
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-semibold">لا توجد فيديوهات</p>
            <p className="text-xs text-muted-foreground/60 mt-1">جرب تغيير الفئة أو المستوى</p>
          </div>
        )}

        {/* Tip */}
        <div className="flex items-start gap-2 bg-primary/5 rounded-xl p-3 border border-primary/10">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">نصيحة:</strong> ابدأ بفيديوهات المستوى المبتدئ ثم انتقل للمتوسط. شاهد مع طفلك وتدرّبوا معاً!
          </p>
        </div>
      </div>
    </Layout>
  );
}

const Videos = () => (<AuthGuard><VideosContent /></AuthGuard>);
export default Videos;
