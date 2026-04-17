import { BarChart2, Table2 } from "lucide-react";

interface MarkEntry {
  label: string;
  obtained: number | null;
  total: number;
  note?: string;
}

interface Props {
  entries?: MarkEntry[];
}

// ✅ You can edit or keep null
const defaultEntries: MarkEntry[] = [
  {
    label: "Mid Term Marks",
    obtained: 18, // ← change or keep null
    total: 30,
    note: "Will be scaled internally",
  },
  { label: "End Sem Marks",   obtained: null, total: 60 },
  { label: "Practical Marks", obtained: 12, total: 15 },
  { label: "CAP Marks",       obtained: 8, total: 10 },
];

export const MarksCard = ({ entries = defaultEntries }: Props) => {
  const totalObtained = entries.reduce((s, e) => s + (e.obtained ?? 0), 0);
  const grandTotal    = entries.reduce((s, e) => s + e.total, 0);

  return (
    <article className="rounded-2xl border border-border bg-white shadow-card overflow-hidden animate-fade-in-up hover-lift">
      
      {/* 🔥 PURPLE GRADIENT HEADER */}
      <div className="flex items-center gap-2.5 bg-gradient-primary px-5 py-3.5">
        <BarChart2 className="h-4 w-4 text-primary-foreground" />
        <h2 className="text-sm font-semibold text-primary-foreground">
          Mid / End Sem Marks
        </h2>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-border">
        {entries.map((entry) => (
          <li
            key={entry.label}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0">
              <span className="text-sm text-foreground">{entry.label}</span>
              {entry.note && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {entry.note}
                </p>
              )}
            </div>

            <span className="shrink-0 rounded-md border border-border bg-muted px-3 py-1 text-xs text-muted-foreground tabular-nums min-w-[64px] text-center">
              {entry.obtained !== null ? entry.obtained : "–"} / {entry.total}
            </span>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="flex items-center justify-between gap-4 bg-muted/50 px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Table2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            Total Marks
          </span>
        </div>

        <span className="text-sm font-bold text-primary tabular-nums">
          {totalObtained} / {grandTotal}
        </span>
      </div>
    </article>
  );
};