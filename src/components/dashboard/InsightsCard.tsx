import { Sparkles, AlertTriangle, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Insight } from "@/lib/dashboardLogic";

interface Props {
  insights: Insight[];
}

const ICONS = {
  warning: AlertTriangle,
  info: Info,
  danger: AlertCircle,
  success: CheckCircle2,
};

const STYLES: Record<Insight["type"], string> = {
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  danger: "bg-danger/10 text-danger",
  success: "bg-success/10 text-success",
};

export const InsightsCard = ({ insights }: Props) => {
  return (
    <article className="rounded-3xl bg-card border border-border p-6 shadow-card hover-lift animate-fade-in-up relative overflow-hidden">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-primary opacity-10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Smart Insights</h2>
            <p className="text-xs text-muted-foreground">Personalized for you</p>
          </div>
        </div>

        <ul className="space-y-3">
          {insights.map((i) => {
            const Icon = ICONS[i.type];
            return (
              <li
                key={i.id}
                className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border transition-smooth hover:bg-primary-soft/60"
              >
                <div className={`h-8 w-8 shrink-0 rounded-xl grid place-items-center ${STYLES[i.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{i.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{i.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
};
