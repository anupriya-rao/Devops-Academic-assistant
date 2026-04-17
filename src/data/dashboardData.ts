export type AlertType = "warning" | "info" | "danger" | "success";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO
  status: "pending" | "submitted";
  priority: "high" | "medium" | "low";
}

export interface SubjectMark {
  subject: string;
  score: number; // 0-100
  midterm: number;
}

export interface AttendanceData {
  total: number;
  attended: number;
  target: number; // percent
}

export const initialAttendance: AttendanceData = {
  total: 11,
  attended: 5,
  target: 75,
};

export const initialAlerts: Alert[] = [
  {
    id: "a1",
    type: "warning",
    title: "Attendance below 75%",
    message: "You're at 70% in DevOps. Attend the next 3 classes to stay safe.",
  },
  {
    id: "a2",
    type: "info",
    title: "Assignment 3 due today",
    message: "Kubernetes Lab Report — submit before 11:59 PM.",
  },
  {
    id: "a3",
    type: "danger",
    title: "Upcoming deadline in 2 days",
    message: "CI/CD Pipeline Project final submission on Friday.",
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: "as1",
    title: "Kubernetes Lab Report",
    subject: "DevOps",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    status: "pending",
    priority: "high",
  },
  {
    id: "as2",
    title: "CI/CD Pipeline Project",
    subject: "DevOps",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "pending",
    priority: "high",
  },
  {
    id: "as3",
    title: "Linux Shell Scripting Assignment",
    subject: "Operating Systems",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "pending",
    priority: "medium",
  },
  {
    id: "as4",
    title: "Database Normalization Worksheet",
    subject: "DBMS",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "submitted",
    priority: "low",
  },
  {
    id: "as5",
    title: "Docker Compose Mini Project",
    subject: "DevOps",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    status: "submitted",
    priority: "medium",
  },
  {
    id: "as6",
    title: "Cloud Computing Case Study",
    subject: "Cloud",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
    status: "pending",
    priority: "low",
  },
];

export const initialMarks: SubjectMark[] = [
  { subject: "DevOps", score: 68, midterm: 42 },
  { subject: "DBMS", score: 82, midterm: 78 },
  { subject: "Operating Systems", score: 74, midterm: 70 },
  { subject: "Cloud Computing", score: 88, midterm: 85 },
  { subject: "Computer Networks", score: 56, midterm: 48 },
];
