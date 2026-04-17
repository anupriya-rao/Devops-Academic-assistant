import { useMemo, useState } from "react";
import { CheckCircle2, Circle, ClipboardList, Flag } from "lucide-react";
import type { Assignment } from "@/data/dashboardData";
import { formatCountdown } from "@/lib/dashboardLogic";

interface Props {
  assignments: Assignment[];
  onToggle: (id: string) => void;
}

type Filter = "all" | "pending" | "submitted";

const PRIORITY_STYLES: Record<Assignment["priority"], string> = {
  high: "bg-danger-soft text-danger border-danger/30",
  medium: "bg-warning-soft text-warning border-warning/40",
  low: "bg-info-soft text-info border-info/30",
};

const TONE_STYLES = {
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
  muted: "bg-muted text-muted-foreground",
};

export const AssignmentsCard = ({ assignments, onToggle }: Props) => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const list = filter === "all" ? assignments : assignments.filter((a) => a.status === filter);
    return [...list].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [assignments, filter]);

  const counts = {
    all: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
  };

  return (
    <article className="rounded-3xl bg-card border border-border p-6 shadow-card hover-lift animate-fade-in-up">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary-soft grid place-items-center">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Assignments</h2>
            <p className="text-xs text-muted-foreground">{counts.pending} pending · {counts.submitted} submitted</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 p-1 bg-muted rounded-xl">
        {(["all", "pending", "submitted"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-smooth ${
              filter === f
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f} <span className="opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      <ul className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <li className="text-center py-8 text-sm text-muted-foreground">No assignments here.</li>
        )}
        {filtered.map((a) => {
          const cd = formatCountdown(a.dueDate);
          const done = a.status === "submitted";
          return (
            <li
              key={a.id}
              className={`group flex items-start gap-3 p-3 rounded-2xl border border-border bg-background transition-smooth hover:border-primary/30 hover:bg-primary-soft/40 ${
                done ? "opacity-70" : ""
              }`}
            >
              <button
                onClick={() => onToggle(a.id)}
                aria-label={done ? "Mark pending" : "Mark submitted"}
                className="mt-0.5 shrink-0 transition-spring hover:scale-110"
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`text-sm font-semibold text-foreground ${
                      done ? "line-through" : ""
                    }`}
                  >
                    {a.title}
                  </h3>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${PRIORITY_STYLES[a.priority]}`}
                  >
                    <Flag className="h-2.5 w-2.5" />
                    {a.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground">{a.subject}</span>
                  {!done && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${TONE_STYLES[cd.tone]}`}
                    >
                      {cd.text}
                    </span>
                  )}
                  {done && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-success-soft text-success">
                      Submitted
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
};
