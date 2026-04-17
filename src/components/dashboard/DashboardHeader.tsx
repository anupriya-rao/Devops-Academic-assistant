import { useEffect, useState } from "react";
import { GraduationCap, Bell, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active || !user) return;
      setEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (active) {
        setDisplayName(
          profile?.display_name ||
            (user.user_metadata as any)?.display_name ||
            (user.user_metadata as any)?.full_name ||
            user.email?.split("@")[0] ||
            "Student"
        );
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const initials = (displayName || email || "S")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth", { replace: true });
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            DevOps
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">{today}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative h-11 w-11 rounded-2xl bg-card border border-border grid place-items-center shadow-card hover-lift"
        >
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger animate-pulse-glow" />
        </button>
        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              {displayName || "Student"}
            </p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-hero grid place-items-center text-primary-foreground font-semibold">
            {initials || "S"}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          className="h-11 w-11 rounded-2xl bg-card border border-border grid place-items-center shadow-card hover-lift"
        >
          <LogOut className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </header>
  );
};
