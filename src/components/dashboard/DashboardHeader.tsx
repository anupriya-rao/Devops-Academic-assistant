import { GraduationCap, Bell, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth", { replace: true });
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-8 animate-fade-in-up">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {getGreeting()} , Welcome Back to DevOps world ! 
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Notification */}
        <button
          aria-label="Notifications"
          className="relative h-11 w-11 rounded-2xl bg-card border border-border grid place-items-center shadow-card hover-lift"
        >
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger animate-pulse-glow" />
        </button>

        {/* Removed email + "classes pending" completely */}

        {/* Logout */}
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