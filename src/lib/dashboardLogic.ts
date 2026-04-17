import type { AttendanceData, SubjectMark, Assignment } from "@/data/dashboardData";

export type AttendanceStatus = "safe" | "risk" | "low";

export interface AttendancePrediction {
  current: number;
  status: AttendanceStatus;
  classesToAttend: number;
  classesCanMiss: number;
  message: string;
}

export function predictAttendance(data: AttendanceData): AttendancePrediction {
  const { total, attended, target } = data;
  const current = total === 0 ? 0 : (attended / total) * 100;

  let classesToAttend = 0;
  if (current < target && target < 100) {
    classesToAttend = Math.ceil((target * total - 100 * attended) / (100 - target));
    if (classesToAttend < 0) classesToAttend = 0;
  }

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
    message = `You're doing well. You can still miss ${classesCanMiss} class${classesCanMiss === 1 ? "" : "es"} safely.`;
  } else if (status === "risk") {
    message = "Your attendance is close to the limit. Try not to miss upcoming classes.";
  } else {
    message = `Your attendance is low. Attend the next ${classesToAttend} class${classesToAttend === 1 ? "" : "es"} to recover.`;
  }

  return {
    current: Math.round(current * 10) / 10,
    status,
    classesToAttend,
    classesCanMiss,
    message,
  };
}

// ---------------- INSIGHTS ----------------

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

  // 🎯 Attendance Insights
  if (attendance.status === "low") {
    insights.push({
      id: "i-att-low",
      type: "danger",
      title: "Attendance critically low",
      body: `Your attendance is at ${attendance.current}%. Start attending classes regularly to avoid issues.`,
    });
  } else if (attendance.status === "risk") {
    insights.push({
      id: "i-att-risk",
      type: "warning",
      title: "Attendance needs attention",
      body: "You're close to falling below the safe limit. Avoid skipping classes.",
    });
  } else {
    insights.push({
      id: "i-att-safe",
      type: "success",
      title: "Attendance on track",
      body: "You're maintaining good attendance. Keep it consistent.",
    });
  }

  // 🎯 Academic Performance Insights (CLEANED)
  const lowSubjects = marks.filter((m) => m.midterm < 50);

  if (lowSubjects.length > 0) {
    insights.push({
      id: "i-academic",
      type: "warning",
      title: "Academic performance needs focus",
      body: "Some subjects need more attention. Revise key concepts and stay consistent.",
    });
  } else {
    insights.push({
      id: "i-academic-good",
      type: "success",
      title: "Good academic performance",
      body: "You're performing well across subjects. Keep up the momentum.",
    });
  }

  // 🎯 Assignments - High Priority
  const pendingHigh = assignments.filter(
    (a) => a.status === "pending" && a.priority === "high"
  );

  if (pendingHigh.length) {
    insights.push({
      id: "i-assign-high",
      type: "info",
      title: "High-priority tasks pending",
      body: "You have important assignments pending. Try to complete them soon.",
    });
  }

  // 🎯 Overdue Assignments
  const overdue = assignments.filter(
    (a) => a.status === "pending" && new Date(a.dueDate).getTime() < Date.now()
  );

  if (overdue.length) {
    insights.push({
      id: "i-overdue",
      type: "danger",
      title: "Overdue work detected",
      body: "Some assignments are past their deadline. Submit them as soon as possible.",
    });
  }

  // 🎯 Motivation Insight (NEW ✨)
  if (insights.length < 3) {
    insights.push({
      id: "i-motivation",
      type: "info",
      title: "Stay consistent",
      body: "Small daily efforts lead to big results. Keep going!",
    });
  }

  return insights.slice(0, 5);
}

// ---------------- COUNTDOWN ----------------

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