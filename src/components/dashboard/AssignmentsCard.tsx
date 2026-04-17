import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, ClipboardList, Flag, Paperclip, Upload, X } from "lucide-react";
import type { Assignment } from "@/data/dashboardData";
import { formatCountdown } from "@/lib/dashboardLogic";

interface Props {
  assignments: Assignment[];
  onToggle: (id: string) => void;
  onSubmit?: (id: string, file: File) => Promise<void>;
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

export const AssignmentsCard = ({ assignments, onToggle, onSubmit }: Props) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const filtered = useMemo(() => {
    const list = filter === "all" ? assignments : assignments.filter((a) => a.status === filter);
    return [...list].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [assignments, filter]);

  const counts = {
    all: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [id]: file }));
      setUploadingId(id);
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (uploadingId === id) setUploadingId(null);
    if (fileInputRefs.current[id]) fileInputRefs.current[id]!.value = "";
  };

  const handleSubmit = async (id: string) => {
    const file = selectedFiles[id];
    if (!file) return;
    setSubmittingId(id);
    try {
      if (onSubmit) {
        await onSubmit(id, file);
      } else {
        // fallback: just toggle as submitted if no onSubmit prop
        await new Promise((r) => setTimeout(r, 800));
        onToggle(id);
      }
      handleRemoveFile(id);
      setUploadingId(null);
    } finally {
      setSubmittingId(null);
    }
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
            <p className="text-xs text-muted-foreground">
              {counts.pending} pending · {counts.submitted} submitted
            </p>
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

      <ul className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <li className="text-center py-8 text-sm text-muted-foreground">No assignments here.</li>
        )}
        {filtered.map((a) => {
          const cd = formatCountdown(a.dueDate);
          const done = a.status === "submitted";
          const file = selectedFiles[a.id];
          const isSubmitting = submittingId === a.id;

          return (
            <li
              key={a.id}
              className={`group flex flex-col gap-2.5 p-3 rounded-2xl border border-border bg-background transition-smooth hover:border-primary/30 hover:bg-primary-soft/40 ${
                done ? "opacity-70" : ""
              }`}
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
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
                    <h3 className={`text-sm font-semibold text-foreground ${done ? "line-through" : ""}`}>
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
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${TONE_STYLES[cd.tone]}`}>
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
              </div>

              {/* Upload + Submit row — only for pending */}
              {!done && (
                <div className="pl-8 flex flex-col gap-2">
                  {!file ? (
                    // Upload trigger
                    <label
                      htmlFor={`file-${a.id}`}
                      className="flex items-center gap-2 w-fit cursor-pointer px-3 py-1.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-smooth"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      Attach file
                      <input
                        id={`file-${a.id}`}
                        type="file"
                        className="sr-only"
                        ref={(el) => { fileInputRefs.current[a.id] = el; }}
                        onChange={(e) => handleFileChange(a.id, e)}
                        accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                      />
                    </label>
                  ) : (
                    // File preview + submit
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-soft border border-primary/20 text-xs text-primary font-medium max-w-[200px]">
                        <Paperclip className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(a.id)}
                          className="ml-1 shrink-0 hover:text-danger transition-colors"
                          aria-label="Remove file"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleSubmit(a.id)}
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-smooth disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {isSubmitting ? "Submitting…" : "Submit"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
};