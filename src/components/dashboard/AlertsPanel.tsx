import { AlertTriangle, Info, AlertCircle, CheckCircle2, X } from "lucide-react";
import type { Alert } from "@/data/dashboardData";

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const ICONS = {
  warning: AlertTriangle,
  info: Info,
  danger: AlertCircle,
  success: CheckCircle2,
};

const STYLES: Record<Alert["type"], { card: string; iconWrap: string; icon: string }> = {
  warning: {
    card: "bg-warning-soft border-warning/30",
    iconWrap: "bg-warning/15",
    icon: "text-warning",
  },
  info: {
    card: "bg-info-soft border-info/30",
    iconWrap: "bg-info/15",
    icon: "text-info",
  },
  danger: {
    card: "bg-danger-soft border-danger/30",
    iconWrap: "bg-danger/15",
    icon: "text-danger",
  },
  success: {
    card: "bg-success-soft border-success/30",
    iconWrap: "bg-success/15",
    icon: "text-success",
  },
};

export const AlertsPanel = ({ alerts, onDismiss }: AlertsPanelProps) => {
  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl bg-success-soft border border-success/30 p-4 flex items-center gap-3 animate-fade-in-up">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <p className="text-sm font-medium text-foreground">All clear — no active alerts.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {alerts.map((a, i) => {
        const Icon = ICONS[a.type];
        const s = STYLES[a.type];
        return (
          <article
            key={a.id}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`relative rounded-2xl border ${s.card} p-4 shadow-sm hover-lift animate-slide-in-right`}
          >
            <button
              onClick={() => onDismiss(a.id)}
              aria-label={`Dismiss ${a.title}`}
              className="absolute top-3 right-3 h-7 w-7 rounded-lg grid place-items-center text-muted-foreground hover:bg-foreground/5 transition-smooth"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <div className={`h-9 w-9 shrink-0 rounded-xl grid place-items-center ${s.iconWrap}`}>
                <Icon className={`h-5 w-5 ${s.icon}`} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{a.message}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
