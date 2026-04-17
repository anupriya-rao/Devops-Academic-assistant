import { BookOpenCheck } from "lucide-react";
import type { SubjectMark } from "@/data/dashboardData";

interface Props {
  marks: SubjectMark[];
}

const scoreTone = (score: number) => {
  if (score >= 75) return { bar: "bg-gradient-success", text: "text-success", label: "Excellent" };
  if (score >= 60) return { bar: "bg-gradient-primary", text: "text-primary", label: "Good" };
  if (score >= 50) return { bar: "bg-gradient-warning", text: "text-warning", label: "Average" };
  return { bar: "bg-gradient-danger", text: "text-danger", label: "Improve" };
};

export const MarksCard = ({ marks }: Props) => {
  const avg = Math.round(marks.reduce((s, m) => s + m.score, 0) / marks.length);

  return (
    <article className="rounded-3xl bg-card border border-border p-6 shadow-card hover-lift animate-fade-in-up">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary-soft grid place-items-center">
            <BookOpenCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Marks Overview</h2>
            <p className="text-xs text-muted-foreground">Average across subjects</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-primary tabular-nums leading-none">{avg}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">overall avg</p>
        </div>
      </div>

      <ul className="space-y-4">
        {marks.map((m) => {
          const tone = scoreTone(m.score);
          return (
            <li key={m.subject}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">{m.subject}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${tone.text}`}>
                    {tone.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">{m.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${tone.bar} transition-spring rounded-full`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Mid-term: {m.midterm}%</p>
            </li>
          );
        })}
      </ul>
    </article>
  );
};
