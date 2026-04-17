import { CalendarCheck, BookOpen, Bell, Flame } from "lucide-react";

interface TodayStatusProps {
  classesToday: number;
  pendingAssignments: number;
  alertsCount: number;
  streak: number;
}

export const TodayStatusCard = ({
  classesToday,
  pendingAssignments,
  alertsCount,
  streak,
}: TodayStatusProps) => {
  const stats = [
    { label: "Classes today", value: classesToday, Icon: CalendarCheck },
    { label: "Pending tasks", value: pendingAssignments, Icon: BookOpen },
    { label: "Active alerts", value: alertsCount, Icon: Bell },
    { label: "Day streak", value: streak, Icon: Flame },
  ];

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 md:p-8 shadow-card-lg animate-fade-in-up"
      aria-labelledby="today-heading"
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="relative">
        <p className="text-primary-foreground/80 text-sm font-medium">Good morning, Aarav 👋</p>
        <h2 id="today-heading" className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mt-1">
          Here's your day at a glance
        </h2>
        <p className="text-primary-foreground/80 mt-2 max-w-xl text-sm md:text-base">
          You're doing great. Stay sharp on the high-priority items below.
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="rounded-2xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 p-4 transition-smooth hover:bg-primary-foreground/20"
            >
              <Icon className="h-5 w-5 text-primary-foreground/90 mb-2" />
              <p className="font-display text-2xl md:text-3xl font-bold text-primary-foreground leading-none">
                {value}
              </p>
              <p className="text-xs md:text-sm text-primary-foreground/80 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
