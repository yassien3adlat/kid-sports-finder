import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, SearchX } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center animate-slide-up max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-black text-foreground mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">الصفحة غير موجودة</p>
        <Button onClick={() => navigate("/")} className="gradient-primary text-primary-foreground rounded-xl">
          <Home className="w-4 h-4 ml-1" /> العودة للرئيسية
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
