import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodayStatusCard } from "@/components/dashboard/TodayStatusCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { AttendanceCard } from "@/components/dashboard/AttendanceCard";
import { AssignmentsCard } from "@/components/dashboard/AssignmentsCard";
import { MarksCard } from "@/components/dashboard/MarksCard";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import {
  initialAlerts,
  initialAssignments,
  initialAttendance,
  initialMarks,
  type Alert,
  type Assignment,
  type AttendanceData,
} from "@/data/dashboardData";
import { generateInsights, predictAttendance } from "@/lib/dashboardLogic";

const Index = () => {
  const [attendance, setAttendance] = useState<AttendanceData>(initialAttendance);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [marks] = useState(initialMarks);

  const prediction = useMemo(() => predictAttendance(attendance), [attendance]);
  const insights = useMemo(
    () => generateInsights(prediction, marks, assignments),
    [prediction, marks, assignments]
  );

  const dismissAlert = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  const toggleAssignment = (id: string) =>
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "submitted" ? "pending" : "submitted" }
          : a
      )
    );

  const pendingCount = assignments.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <DashboardHeader />

        <main className="space-y-6 md:space-y-8">
          <TodayStatusCard
            classesToday={5}
            pendingAssignments={pendingCount}
            alertsCount={alerts.length}
            streak={12}
          />

          <section aria-label="Smart alerts">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-foreground">Smart Alerts</h2>
              {alerts.length > 0 && (
                <button
                  onClick={() => setAlerts([])}
                  className="text-xs font-semibold text-primary hover:text-primary-glow transition-smooth"
                >
                  Dismiss all
                </button>
              )}
            </div>
            <AlertsPanel alerts={alerts} onDismiss={dismissAlert} />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <AttendanceCard data={attendance} onChange={setAttendance} />
            </div>
            <div className="lg:col-span-2">
              <AssignmentsCard assignments={assignments} onToggle={toggleAssignment} />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <MarksCard marks={marks} />
            <InsightsCard insights={insights} />
          </section>

          <footer className="pt-4 pb-2 text-center text-xs text-muted-foreground">
            StudyOps · Your smart academic assistant
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
