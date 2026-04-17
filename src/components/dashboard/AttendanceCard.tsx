import { useMemo, useState } from "react";
import { TrendingUp, Target, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import type { AttendanceData } from "@/data/dashboardData";
import { predictAttendance, type AttendanceStatus } from "@/lib/dashboardLogic";

interface Props {
  data: AttendanceData;
  onChange: (data: AttendanceData) => void;
}

const STATUS_META: Record<
  AttendanceStatus,
  { label: string; Icon: typeof ShieldCheck; chip: string; bar: string; ring: string }
> = {
  safe: {
    label: "Safe",
    Icon: ShieldCheck,
    chip: "bg-success-soft text-success border-success/30",
    bar: "bg-gradient-success",
    ring: "ring-success/30",
  },
  risk: {
    label: "At Risk",
    Icon: ShieldAlert,
    chip: "bg-warning-soft text-warning border-warning/40",
    bar: "bg-gradient-warning",
    ring: "ring-warning/30",
  },
  low: {
    label: "Low",
    Icon: ShieldX,
    chip: "bg-danger-soft text-danger border-danger/30",
    bar: "bg-gradient-danger",
    ring: "ring-danger/30",
  },
};

export const AttendanceCard = ({ data, onChange }: Props) => {
  const [editing, setEditing] = useState(false);

  // ✅ Always enforce valid values
  const fixedData = {
    ...data,
    total: 11,
    attended: Math.min(data.attended, 11), // prevent > 11
  };

  const prediction = useMemo(() => predictAttendance(fixedData), [fixedData]);
  const meta = STATUS_META[prediction.status];

  // ✅ Safe update function
  const update = (patch: Partial<AttendanceData>) => {
    const newAttended =
      patch.attended !== undefined
        ? Math.min(Math.max(patch.attended, 0), 11)
        : fixedData.attended;

    onChange({
      ...data,
      ...patch,
      total: 11,
      attended: newAttended,
    });
  };

  return (
    <article className="rounded-3xl bg-card border border-border p-6 shadow-card hover-lift animate-fade-in-up">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary-soft grid place-items-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Attendance Predictor
            </h2>
            <p className="text-xs text-muted-foreground">
              Plan your classes smartly
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.chip}`}>
          <meta.Icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
      </div>

      {/* Percentage */}
      <div className="flex items-end justify-between gap-4 mb-3">
        <div>
          <p className="font-display text-5xl font-bold text-foreground leading-none tabular-nums">
            {prediction.current}
            <span className="text-2xl text-muted-foreground">%</span>
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            {fixedData.attended} / 11 classes attended
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Target className="h-3.5 w-3.5" /> Target
          </p>
          <p className="font-display text-2xl font-bold text-primary tabular-nums">
            {fixedData.target}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-4">
        <div
          className={`absolute inset-y-0 left-0 ${meta.bar} transition-spring rounded-full`}
          style={{ width: `${Math.min(prediction.current, 100)}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/40"
          style={{ left: `${fixedData.target}%` }}
        />
      </div>

      {/* Message */}
      <div className={`rounded-2xl ring-1 ${meta.ring} bg-muted/40 p-4 mb-4`}>
        <p className="text-sm font-medium text-foreground">
          {prediction.message}
        </p>

        {prediction.status === "safe" ? (
          <p className="text-xs text-muted-foreground mt-1">
            You can miss{" "}
            <span className="font-semibold text-success">
              {prediction.classesCanMiss}
            </span>{" "}
            classes and still stay above {fixedData.target}%.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            Attend{" "}
            <span className="font-semibold text-primary">
              {prediction.classesToAttend}
            </span>{" "}
            classes continuously to reach {fixedData.target}%.
          </p>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setEditing((v) => !v)}
        className="w-full text-sm font-semibold text-primary hover:text-primary-glow transition-smooth"
      >
        {editing ? "Hide inputs" : "Update numbers"}
      </button>

      {/* Inputs */}
      {editing && (
        <div className="mt-4 grid grid-cols-2 gap-3 animate-fade-in-up">
          
          <Field
            label="Attended"
            value={fixedData.attended}
            min={0}
            max={11}
            onChange={(v) => update({ attended: v })}
          />

          <Field
            label="Target %"
            value={fixedData.target}
            min={1}
            max={99}
            onChange={(v) => update({ target: v })}
          />
        </div>
      )}
    </article>
  );
};

interface FieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

const Field = ({ label, value, min, max, onChange }: FieldProps) => (
  <label className="block">
    <span className="text-xs font-medium text-muted-foreground">
      {label}
    </span>

    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) =>
        onChange(Math.max(min ?? 0, Number(e.target.value) || 0))
      }
      className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
    />
  </label>
);