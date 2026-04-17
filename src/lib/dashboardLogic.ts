import type { AttendanceData, SubjectMark, Assignment } from "@/data/dashboardData";

export type AttendanceStatus = "safe" | "risk" | "low";

export interface AttendancePrediction {
  current: number; // current %
  status: AttendanceStatus;
  classesToAttend: number; // to reach target
  classesCanMiss: number; // while staying at/above target
  message: string;
}

export function predictAttendance(data: AttendanceData): AttendancePrediction {
  const { total, attended, target } = data;
  const current = total === 0 ? 0 : (attended / total) * 100;

  // To reach target: (attended + x) / (total + x) >= target/100
  // x >= (target*total - 100*attended) / (100 - target)
  let classesToAttend = 0;
  if (current < target && target < 100) {
    classesToAttend = Math.ceil((target * total - 100 * attended) / (100 - target));
    if (classesToAttend < 0) classesToAttend = 0;
  }

  // Classes can miss: attended / (total + y) >= target/100
  // y <= (100*attended - target*total) / target
  let classesCanMiss = 0;
  if (current >= target && target > 0) {
    classesCanMiss = Math.floor((100 * attended - target * total) / target);
    if (classesCanMiss < 0) classesCanMiss = 0;
  }

  let status: AttendanceStatus = "safe";
  if (current < target - 10) status = "low";
  else if (current < target) status = "risk";

  let message = "";
  if (status === "safe") {
    message = `You can miss ${classesCanMiss} more class${classesCanMiss === 1 ? "" : "es"} safely.`;
  } else {
    message = `Attend the next ${classesToAttend} class${classesToAttend === 1 ? "" : "es"} to reach ${target}%.`;
  }

  return {
    current: Math.round(current * 10) / 10,
    status,
    classesToAttend,
    classesCanMiss,
    message,
  };
}

export interface Insight {
  id: string;
  type: "warning" | "info" | "danger" | "success";
  title: string;
  body: string;
}

export function generateInsights(
  attendance: AttendancePrediction,
  marks: SubjectMark[],
  assignments: Assignment[]
): Insight[] {
  const insights: Insight[] = [];

  if (attendance.status === "low") {
    insights.push({
      id: "i-att-low",
      type: "danger",
      title: "Attendance critically low",
      body: `You're at ${attendance.current}%. Attend ${attendance.classesToAttend} classes to recover.`,
    });
  } else if (attendance.status === "risk") {
    insights.push({
      id: "i-att-risk",
      type: "warning",
      title: "Your attendance is risky this week",
      body: `Just ${100 - attendance.current}% off — don't skip the next few sessions.`,
    });
  } else {
    insights.push({
      id: "i-att-safe",
      type: "success",
      title: "Attendance on track",
      body: `Great pace at ${attendance.current}%. Keep showing up.`,
    });
  }

  marks.forEach((m) => {
    if (m.midterm < 50) {
      insights.push({
        id: `i-marks-${m.subject}`,
        type: "warning",
        title: `Focus on ${m.subject} theory`,
        body: `Mid-term score ${m.midterm}%. Review fundamentals before finals.`,
      });
    }
  });

  const pendingHigh = assignments.filter(
    (a) => a.status === "pending" && a.priority === "high"
  );
  if (pendingHigh.length) {
    insights.push({
      id: "i-assign-high",
      type: "info",
      title: `${pendingHigh.length} high-priority assignment${pendingHigh.length === 1 ? "" : "s"} pending`,
      body: `Tackle "${pendingHigh[0].title}" first — it's due soonest.`,
    });
  }

  const overdue = assignments.filter(
    (a) => a.status === "pending" && new Date(a.dueDate).getTime() < Date.now()
  );
  if (overdue.length) {
    insights.push({
      id: "i-overdue",
      type: "danger",
      title: "Overdue work detected",
      body: `${overdue.length} assignment${overdue.length === 1 ? " is" : "s are"} past due. Submit ASAP.`,
    });
  }

  return insights.slice(0, 5);
}

export function formatCountdown(iso: string): {
  text: string;
  tone: "danger" | "warning" | "success" | "muted";
} {
  const diff = new Date(iso).getTime() - Date.now();
  const absDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
  const absHours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));

  if (diff < 0) {
    if (absDays === 0) return { text: `Overdue by ${absHours}h`, tone: "danger" };
    return { text: `Overdue by ${absDays}d`, tone: "muted" };
  }
  if (absHours < 24) return { text: `Due in ${absHours}h`, tone: "danger" };
  if (absDays <= 2) return { text: `Due in ${absDays}d`, tone: "warning" };
  return { text: `Due in ${absDays}d`, tone: "success" };
}
