import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LayoutDashboard, Wrench, CalendarDays, CalendarRange, Boxes, Radio,
  FlaskConical, BarChart3, FileCheck2, Network, Train, AlertTriangle,
  CheckCircle2, XCircle, Clock, Activity, GitBranch, Brain, Gauge,
  TrendingUp, ShieldCheck, ShieldAlert, Zap, RefreshCw, PlayCircle,
  ChevronRight, ChevronDown, ChevronLeft, X, Database, Server, Cpu,
  GitMerge, Users, ClipboardCheck, PieChart, LineChart as LineChartIcon,
  Signal, MapPin, ArrowRight, ArrowDown, Info, Settings2, Layers,
  Search, Bell, ThumbsUp, Edit3, History, MonitorCheck, Route as RouteIcon,
  Combine, Waypoints, CircleDot, Dot, Filter, Sparkles, AlertOctagon,
  PauseCircle, TimerReset, ListChecks, GaugeCircle, Container, CloudCog,
  Workflow, SplitSquareHorizontal, Link2, CircleAlert, ArrowLeftRight,
  Hourglass, CalendarClock, ListTree, ServerCog, FolderKanban,
  CloudRain, CloudDrizzle, Sun, Wind, Droplets, Thermometer, CloudSun,
  Radar, BellRing, CalendarPlus, Lightbulb, SquareArrowOutUpRight,
  HardHat, CirclePlay, CircleCheck, CirclePause, Timer, ClipboardList,
  FileText, UserCheck, TrendingDown, Repeat
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart as RPieChart, Pie, Cell, AreaChart, Area
} from "recharts";

/* ============================================================================
   DESIGN TOKENS
   Palette: operations console — deep signal-navy chrome, cool neutral canvas,
   rail-blue for primary action, and the amber/green/red of a real interlocking
   panel for state. Two type families: Inter (UI/body) + IBM Plex Mono
   (codes, IDs, timers, readouts — the "departure board" register).
============================================================================ */
const T = {
  navy: "#0B1526",
  navyLight: "#122241",
  ink: "#0F172A",
  slate: "#5B6B85",
  slateLight: "#8996AC",
  line: "#E2E6ED",
  canvas: "#F4F6F9",
  panel: "#FFFFFF",
  blue: "#1D5DE8",
  blueDeep: "#12409E",
  cyan: "#0EA5C7",
  green: "#12805C",
  greenSoft: "#E4F5EE",
  amber: "#B4690E",
  amberSoft: "#FBF0DE",
  red: "#C22A2A",
  redSoft: "#FBE7E7",
  purple: "#6D4AC7",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
    .rb-root { font-family: 'Inter', system-ui, sans-serif; color: ${T.ink}; }
    .rb-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    .rb-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
    .rb-scrollbar::-webkit-scrollbar-thumb { background: #CBD3E0; border-radius: 4px; }
    @keyframes rb-move-train { from { left: -6%; } to { left: 106%; } }
    @keyframes rb-pulse-dot { 0%,100% { opacity:1; transform:scale(1);} 50% { opacity:.5; transform:scale(1.2);} }
    @keyframes rb-fade-up { from { opacity:0; transform: translateY(5px);} to { opacity:1; transform: translateY(0);} }
    @keyframes rb-fade-in { from { opacity:0;} to { opacity:1;} }
    @keyframes rb-scan { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }
    @keyframes rb-blink { 0%,100% { opacity:1;} 50% { opacity:.4;} }
    @keyframes rb-pulse-soft { 0%,100% { opacity:1;} 50% { opacity:.55;} }
    @keyframes rb-grow-x { from { transform: scaleX(0);} to { transform: scaleX(1);} }
    .rb-anim-fadeup { animation: rb-fade-up .4s cubic-bezier(.2,.6,.3,1) both; }
    .rb-anim-fadein { animation: rb-fade-in .4s ease both; }
    .rb-anim-blink { animation: rb-blink 1.8s ease-in-out infinite; }
    .rb-anim-pulse-soft { animation: rb-pulse-soft 1.8s ease-in-out infinite; }
    .rb-train-token { animation: rb-move-train linear infinite; transition: filter .3s; }
    .rb-track-line { position:relative; overflow:hidden; }
  `}</style>
);

/* ============================================================================
   MOCK DATA MODEL
============================================================================ */
const CORRIDORS = ["C-12", "C-14", "C-15", "C-18"];
const DEPARTMENTS = [
  { id: "ENG", name: "Engineering", color: T.blue, icon: Wrench },
  { id: "SNT", name: "S&T", color: T.purple, icon: Signal },
  { id: "TRD", name: "Traction", color: T.cyan, icon: Zap },
];
const STATIONS = ["Amravati Jn.", "Belapur Rd.", "Chandpur", "Devgarh", "Ellora Cross"];

const SEVERITY_STYLE = {
  Critical: { bg: T.redSoft, fg: T.red },
  High: { bg: T.amberSoft, fg: T.amber },
  Medium: { bg: "#EAF1FE", fg: T.blueDeep },
  Low: { bg: "#EEF1F6", fg: T.slate },
};
const PRIORITY_STYLE = {
  "VERY HIGH": { bg: T.redSoft, fg: T.red },
  HIGH: { bg: T.amberSoft, fg: T.amber },
  MEDIUM: { bg: "#EAF1FE", fg: T.blueDeep },
  LOW: { bg: "#EEF1F6", fg: T.slate },
};

const TASKS = [
  {
    id: "TRK-1042", dept: "ENG", asset: "Rail Panel — KM 214/6", corridor: "C-12",
    type: "Rail Crack Repair", severity: "Critical", criticality: 9, urgency: 10,
    due: "12 Sep", duration: 3, status: "Pending Plan", assetRisk: 87,
    opImpact: 9, source: "TMS",
    risk: { age: 14, prevFailures: 3, defects: 5, overdueDays: 6, usage: "High", history: "3 repairs in 18 months" },
    contributors: [
      { label: "Previous failures", v: 0.86 },
      { label: "Recent defects", v: 0.74 },
      { label: "Overdue maintenance", v: 0.63 },
      { label: "Asset age", v: 0.48 },
    ],
  },
  {
    id: "SIG-203", dept: "SNT", asset: "Point Machine — PM-14", corridor: "C-12",
    type: "Signal Interlocking Inspection", severity: "High", criticality: 7, urgency: 6,
    due: "13 Sep", duration: 2, status: "Pending Plan", assetRisk: 61,
    opImpact: 6, source: "SMMS",
    risk: { age: 9, prevFailures: 1, defects: 2, overdueDays: 2, usage: "High", history: "Minor fault Jun 2026" },
    contributors: [
      { label: "Previous failures", v: 0.32 },
      { label: "Recent defects", v: 0.44 },
      { label: "Overdue maintenance", v: 0.28 },
      { label: "Asset age", v: 0.35 },
    ],
  },
  {
    id: "OHE-117", dept: "TRD", asset: "OHE Mast — M-88", corridor: "C-15",
    type: "OHE Tension Adjustment", severity: "Medium", criticality: 5, urgency: 5,
    due: "18 Sep", duration: 4, status: "Pending Plan", assetRisk: 39,
    opImpact: 4, source: "TDMS",
    risk: { age: 11, prevFailures: 0, defects: 1, overdueDays: 0, usage: "Medium", history: "No recent faults" },
    contributors: [
      { label: "Previous failures", v: 0.08 },
      { label: "Recent defects", v: 0.22 },
      { label: "Overdue maintenance", v: 0.05 },
      { label: "Asset age", v: 0.31 },
    ],
  },
  {
    id: "TRK-1055", dept: "ENG", asset: "Track Formation — KM 88/2", corridor: "C-18",
    type: "Ballast Renewal", severity: "High", criticality: 8, urgency: 7,
    due: "14 Sep", duration: 5, status: "Pending Plan", assetRisk: 72,
    opImpact: 7, source: "TMS",
    risk: { age: 19, prevFailures: 2, defects: 4, overdueDays: 9, usage: "High", history: "Overdue since Aug 2026" },
    contributors: [
      { label: "Previous failures", v: 0.58 },
      { label: "Recent defects", v: 0.61 },
      { label: "Overdue maintenance", v: 0.77 },
      { label: "Asset age", v: 0.66 },
    ],
  },
  {
    id: "SIG-210", dept: "SNT", asset: "Axle Counter — AC-6", corridor: "C-14",
    type: "Signal Cable Health Check", severity: "Low", criticality: 3, urgency: 3,
    due: "22 Sep", duration: 2, status: "Pending Plan", assetRisk: 21,
    opImpact: 3, source: "SMMS",
    risk: { age: 5, prevFailures: 0, defects: 0, overdueDays: 0, usage: "Low", history: "Routine cycle" },
    contributors: [
      { label: "Previous failures", v: 0.05 },
      { label: "Recent defects", v: 0.06 },
      { label: "Overdue maintenance", v: 0.02 },
      { label: "Asset age", v: 0.14 },
    ],
  },
  {
    id: "OHE-120", dept: "TRD", asset: "Feeder Cable — F-22", corridor: "C-12",
    type: "OHE Feeder Inspection", severity: "Medium", criticality: 6, urgency: 6,
    due: "12 Sep", duration: 2, status: "Pending Plan", assetRisk: 54,
    opImpact: 5, source: "TDMS",
    risk: { age: 13, prevFailures: 1, defects: 2, overdueDays: 3, usage: "High", history: "Flagged in Aug audit" },
    contributors: [
      { label: "Previous failures", v: 0.34 },
      { label: "Recent defects", v: 0.4 },
      { label: "Overdue maintenance", v: 0.36 },
      { label: "Asset age", v: 0.4 },
    ],
  },
  {
    id: "TRK-1061", dept: "ENG", asset: "Rail Weld — W-402", corridor: "C-15",
    type: "Weld Inspection", severity: "Medium", criticality: 4, urgency: 4,
    due: "20 Sep", duration: 2, status: "Pending Plan", assetRisk: 33,
    opImpact: 3, source: "TMS",
    risk: { age: 7, prevFailures: 0, defects: 1, overdueDays: 0, usage: "Medium", history: "Preventive cycle" },
    contributors: [
      { label: "Previous failures", v: 0.1 },
      { label: "Recent defects", v: 0.18 },
      { label: "Overdue maintenance", v: 0.04 },
      { label: "Asset age", v: 0.2 },
    ],
  },
];

function priorityScoreOf(t) {
  const s = t.criticality * 0.3 + t.urgency * 0.25 + (t.assetRisk / 10) * 0.25 + t.opImpact * 0.2;
  return Math.round(s * 10) / 10;
}
function priorityLabelOf(score) {
  if (score >= 8.5) return "VERY HIGH";
  if (score >= 6.5) return "HIGH";
  if (score >= 4) return "MEDIUM";
  return "LOW";
}
TASKS.forEach((t) => { t.priorityScore = priorityScoreOf(t); t.priority = priorityLabelOf(t.priorityScore); });

const TRAINS = [
  { id: "T-204", name: "Deccan Express", eta: "14:10", corridor: "C-12", status: "On Time", speed: 22 },
  { id: "T-305", name: "Konkan Mail", eta: "16:40", corridor: "C-14", status: "Delayed +18 min", speed: 26 },
  { id: "T-118", name: "Intercity SF", eta: "12:55", corridor: "C-15", status: "On Time", speed: 19 },
  { id: "T-410", name: "Freight 410", eta: "19:05", corridor: "C-18", status: "On Time", speed: 30 },
];

// Monthly plan blocks across a 30 day (Sept 2026) horizon
function genMonthlyBlocks() {
  const raw = [
    { id: "BLK-201", corridor: "C-12", startDay: 3, span: 2, taskIds: ["TRK-1042", "SIG-203"], window: "14:00–17:00", trains: ["T-204"] },
    { id: "BLK-202", corridor: "C-12", startDay: 9, span: 1, taskIds: ["OHE-120"], window: "11:00–13:00", trains: [] },
    { id: "BLK-203", corridor: "C-14", startDay: 6, span: 1, taskIds: ["SIG-210"], window: "22:30–00:30", trains: [] },
    { id: "BLK-204", corridor: "C-15", startDay: 12, span: 2, taskIds: ["OHE-117", "TRK-1061"], window: "13:00–17:00", trains: ["T-118"] },
    { id: "BLK-205", corridor: "C-18", startDay: 5, span: 3, taskIds: ["TRK-1055"], window: "09:00–14:00", trains: ["T-410"] },
    { id: "BLK-206", corridor: "C-12", startDay: 18, span: 1, taskIds: ["SIG-203"], window: "23:00–01:00", trains: [] },
    { id: "BLK-207", corridor: "C-15", startDay: 21, span: 2, taskIds: ["TRK-1061"], window: "10:00–13:00", trains: [] },
    { id: "BLK-208", corridor: "C-14", startDay: 24, span: 1, taskIds: ["SIG-210"], window: "12:00–14:00", trains: [] },
    { id: "BLK-209", corridor: "C-18", startDay: 27, span: 2, taskIds: ["TRK-1055"], window: "15:00–19:00", trains: ["T-410"] },
    { id: "BLK-210", corridor: "C-12", startDay: 15, span: 1, taskIds: ["OHE-120"], window: "20:00–22:00", trains: [] },
  ];
  return raw.map((b) => {
    const tasks = b.taskIds.map((id) => TASKS.find((t) => t.id === id));
    const priority = tasks.reduce((acc, t) => (priorityScoreOf(t) > acc.score ? { score: priorityScoreOf(t), label: t.priority } : acc), { score: 0, label: "LOW" });
    return { ...b, tasks, duration: `${b.span} hr${b.span > 1 ? "s" : ""}`, priority: priority.label, status: "Planned", impact: b.trains.length === 0 ? "LOW" : b.trains.length === 1 ? "LOW" : "MEDIUM" };
  });
}
const MONTHLY_BLOCKS = genMonthlyBlocks();

// Seed lifecycle state so Block Plans / Weekly Planner / Live Operations open with a
// realistic mix of history — some blocks already executed, some approved and scheduled,
// most still awaiting a planner decision. BLK-204 is left "recommended" so the demo
// flow (approve it, then see it live) has somewhere to start.
const INITIAL_BLOCK_STATE = {
  "BLK-201": { status: "completed", approvedAt: "5 Sep, 09:40", approvedBy: "R. Iyer, Section Controller" },
  "BLK-203": { status: "completed", approvedAt: "6 Sep, 21:10", approvedBy: "R. Iyer, Section Controller" },
  "BLK-202": { status: "approved", approvedAt: "6 Sep, 11:05", approvedBy: "S. Deshmukh, Operations Planner" },
  "BLK-205": { status: "approved", approvedAt: "4 Sep, 16:20", approvedBy: "S. Deshmukh, Operations Planner" },
};
const INITIAL_BLOCKS = MONTHLY_BLOCKS.map((b) => ({
  ...b,
  status: (INITIAL_BLOCK_STATE[b.id] && INITIAL_BLOCK_STATE[b.id].status) || "recommended",
  approvedAt: (INITIAL_BLOCK_STATE[b.id] && INITIAL_BLOCK_STATE[b.id].approvedAt) || null,
  approvedBy: (INITIAL_BLOCK_STATE[b.id] && INITIAL_BLOCK_STATE[b.id].approvedBy) || null,
}));

/* ----------------------------------------------------------------------------
   FEATURE 1 — PREDICTIVE MAINTENANCE
   Derived from historical asset maintenance records. The "prediction" here is
   pre-computed sample data shaped exactly like a Spring Boot response would be,
   so these objects can later be swapped for a real API payload without any UI
   changes. Each entry carries the evidence behind the recommendation, not just
   the verdict — the planner has to be able to see why.
---------------------------------------------------------------------------- */
const PREDICTIONS = [
  {
    assetId: "S-204", assetName: "Signal System S-204", assetType: "Signal & Interlocking",
    dept: "SNT", corridor: "C-12", risk: "High", confidence: 88,
    windowStart: "18 Sep", windowEnd: "22 Sep", daysAway: 3,
    avgInterval: 30, lastMaintenance: "21 Aug", eventCount: 9, avgDuration: 2.5,
    defects: 3, criticality: "High", suggestedDuration: 3,
    drivers: [
      { label: "Days since last service", detail: "27 of 30-day average interval", v: 0.9 },
      { label: "Defect reports since service", detail: "3 logged, 1 repeat fault", v: 0.72 },
      { label: "Maintenance frequency trend", detail: "Interval shortening over 4 cycles", v: 0.64 },
      { label: "Asset criticality", detail: "Interlocking on a high-traffic corridor", v: 0.8 },
    ],
  },
  {
    assetId: "T-102", assetName: "Track Section T-102", assetType: "Permanent Way",
    dept: "ENG", corridor: "C-14", risk: "Medium", confidence: 71,
    windowStart: "22 Sep", windowEnd: "27 Sep", daysAway: 7,
    avgInterval: 45, lastMaintenance: "12 Aug", eventCount: 6, avgDuration: 3,
    defects: 1, criticality: "Medium", suggestedDuration: 3,
    drivers: [
      { label: "Days since last service", detail: "34 of 45-day average interval", v: 0.61 },
      { label: "Defect reports since service", detail: "1 minor geometry deviation", v: 0.34 },
      { label: "Maintenance frequency trend", detail: "Stable across last 3 cycles", v: 0.22 },
      { label: "Asset criticality", detail: "Moderate traffic density", v: 0.45 },
    ],
  },
  {
    assetId: "OHE-88", assetName: "OHE Mast Run M-88", assetType: "Traction Distribution",
    dept: "TRD", corridor: "C-15", risk: "Low", confidence: 64,
    windowStart: "29 Sep", windowEnd: "04 Oct", daysAway: 14,
    avgInterval: 60, lastMaintenance: "01 Aug", eventCount: 4, avgDuration: 4,
    defects: 0, criticality: "Low", suggestedDuration: 4,
    drivers: [
      { label: "Days since last service", detail: "45 of 60-day average interval", v: 0.44 },
      { label: "Defect reports since service", detail: "None logged", v: 0.06 },
      { label: "Maintenance frequency trend", detail: "Lengthening — asset stable", v: 0.14 },
      { label: "Asset criticality", detail: "Redundant feed available", v: 0.2 },
    ],
  },
  {
    assetId: "BRG-31", assetName: "Bridge Girder Span B-31", assetType: "Bridge & Structures",
    dept: "ENG", corridor: "C-18", risk: "Medium", confidence: 74,
    windowStart: "25 Sep", windowEnd: "30 Sep", daysAway: 10,
    avgInterval: 90, lastMaintenance: "30 Jul", eventCount: 3, avgDuration: 4.3,
    defects: 2, criticality: "High", suggestedDuration: 5,
    drivers: [
      { label: "Days since last service", detail: "47 of 90-day average interval", v: 0.52 },
      { label: "Defect reports since service", detail: "2 logged at last girder inspection", v: 0.68 },
      { label: "Maintenance frequency trend", detail: "Defect count rising across cycles", v: 0.58 },
      { label: "Asset criticality", detail: "Single structure, no diversionary route", v: 0.82 },
    ],
  },
];
const RISK_STYLE = {
  High: { bg: T.redSoft, fg: T.red },
  Medium: { bg: T.amberSoft, fg: T.amber },
  Low: { bg: T.greenSoft, fg: T.green },
};
const SUITABILITY_STYLE = {
  Excellent: { bg: T.greenSoft, fg: T.green },
  Good: { bg: T.greenSoft, fg: T.green },
  Moderate: { bg: T.amberSoft, fg: T.amber },
  Poor: { bg: T.redSoft, fg: T.red },
};

// Per-asset service history, used to draw the maintenance timeline and to make the
// "approaching its historical interval" claim inspectable rather than asserted.
const MAINTENANCE_HISTORY = {
  "S-204": [
    { date: "12 Apr 2026", type: "Interlocking inspection", durationHrs: 2.5, defectsFound: 0 },
    { date: "19 May 2026", type: "Relay replacement", durationHrs: 3, defectsFound: 1 },
    { date: "21 Jun 2026", type: "Interlocking inspection", durationHrs: 2, defectsFound: 1 },
    { date: "22 Jul 2026", type: "Point machine service", durationHrs: 3, defectsFound: 2 },
    { date: "21 Aug 2026", type: "Interlocking inspection", durationHrs: 2.5, defectsFound: 1 },
  ],
  "T-102": [
    { date: "02 Mar 2026", type: "Track geometry survey", durationHrs: 3, defectsFound: 0 },
    { date: "18 Apr 2026", type: "Rail grinding", durationHrs: 4, defectsFound: 1 },
    { date: "10 Jun 2026", type: "Track geometry survey", durationHrs: 3, defectsFound: 0 },
    { date: "28 Aug 2026", type: "Ballast packing", durationHrs: 3, defectsFound: 1 },
  ],
  "OHE-88": [
    { date: "15 Feb 2026", type: "OHE tension check", durationHrs: 4, defectsFound: 0 },
    { date: "20 Apr 2026", type: "Insulator cleaning", durationHrs: 3.5, defectsFound: 0 },
    { date: "01 Aug 2026", type: "OHE tension check", durationHrs: 4, defectsFound: 0 },
  ],
  "BRG-31": [
    { date: "05 Jan 2026", type: "Girder inspection", durationHrs: 5, defectsFound: 1 },
    { date: "14 Apr 2026", type: "Bearing lubrication", durationHrs: 3, defectsFound: 0 },
    { date: "30 Jul 2026", type: "Girder inspection", durationHrs: 5, defectsFound: 2 },
  ],
};

/* ----------------------------------------------------------------------------
   FEATURE 2 — WEATHER-AWARE WINDOW RECOMMENDATION
   Weather is a planning *preference*, never a hard constraint. Each candidate
   window is scored for weather risk and an expected duration penalty; the
   optimizer still owns feasibility (train paths, corridor availability, safety).
---------------------------------------------------------------------------- */
const WEATHER_TASK = {
  label: "Track Inspection", assetId: "T-102", corridor: "C-14",
  date: "22 September 2026", requiredDuration: 3,
};
const WEATHER_WINDOWS = [
  {
    window: "10:00–13:00", condition: "Heavy rain expected", icon: "rain-heavy",
    risk: "High", precip: 82, tempC: 24, windKph: 28, durationImpactMin: 40,
    note: "Reduced visibility and standing water on the formation; inspection accuracy and worker efficiency both drop.",
  },
  {
    window: "14:00–17:00", condition: "Light rain", icon: "rain-light",
    risk: "Medium", precip: 46, tempC: 26, windKph: 17, durationImpactMin: 15,
    note: "Workable, but intermittent showers are likely to extend the activity slightly.",
  },
  {
    window: "18:00–21:00", condition: "Clear conditions", icon: "clear",
    risk: "Low", precip: 8, tempC: 23, windKph: 9, durationImpactMin: 0,
    recommended: true,
    note: "Clear weather is expected during this window, reducing the likelihood of weather-related maintenance delays.",
  },
];

/* ----------------------------------------------------------------------------
   15-DAY WEATHER OUTLOOK (Weather Impact Prediction page)
   Shaped like a forecast-API response: each day carries raw conditions only.
   The weather-to-maintenance conversion (duration penalty, risk, suitability)
   is computed in deriveImpact() below, so swapping in a real weather API means
   replacing this array and nothing else.
---------------------------------------------------------------------------- */
const FORECAST_15 = [
  { date: "16 Sep", dow: "Wed", condition: "Clear",      icon: "clear",       precip: 5,  tempC: 29, windKph: 11 },
  { date: "17 Sep", dow: "Thu", condition: "Cloudy",     icon: "partly",      precip: 20, tempC: 28, windKph: 14 },
  { date: "18 Sep", dow: "Fri", condition: "Rain",       icon: "rain-light",  precip: 72, tempC: 25, windKph: 22 },
  { date: "19 Sep", dow: "Sat", condition: "Heavy rain", icon: "rain-heavy",  precip: 84, tempC: 24, windKph: 31 },
  { date: "20 Sep", dow: "Sun", condition: "Cloudy",     icon: "partly",      precip: 30, tempC: 27, windKph: 16 },
  { date: "21 Sep", dow: "Mon", condition: "Clear",      icon: "clear",       precip: 8,  tempC: 28, windKph: 9  },
  { date: "22 Sep", dow: "Tue", condition: "Clear",      icon: "clear",       precip: 12, tempC: 29, windKph: 12 },
  { date: "23 Sep", dow: "Wed", condition: "Cloudy",     icon: "partly",      precip: 38, tempC: 27, windKph: 18 },
  { date: "24 Sep", dow: "Thu", condition: "Rain",       icon: "rain-light",  precip: 66, tempC: 25, windKph: 24 },
  { date: "25 Sep", dow: "Fri", condition: "Heavy rain", icon: "rain-heavy",  precip: 88, tempC: 23, windKph: 34 },
  { date: "26 Sep", dow: "Sat", condition: "Rain",       icon: "rain-light",  precip: 58, tempC: 24, windKph: 21 },
  { date: "27 Sep", dow: "Sun", condition: "Cloudy",     icon: "partly",      precip: 26, tempC: 27, windKph: 15 },
  { date: "28 Sep", dow: "Mon", condition: "Clear",      icon: "clear",       precip: 10, tempC: 28, windKph: 10 },
  { date: "29 Sep", dow: "Tue", condition: "Clear",      icon: "clear",       precip: 6,  tempC: 30, windKph: 8  },
  { date: "30 Sep", dow: "Wed", condition: "Cloudy",     icon: "partly",      precip: 34, tempC: 28, windKph: 17 },
];

// Weather → maintenance impact. Duration penalty scales with the base duration of
// the activity, so a 5-hour job absorbs more weather delay than a 2-hour one.
const CONDITION_FACTOR = {
  "Clear":      { pct: 0.00, label: "Minimal" },
  "Cloudy":     { pct: 0.06, label: "Minimal" },
  "Rain":       { pct: 0.25, label: "Moderate" },
  "Heavy rain": { pct: 0.40, label: "Significant" },
};
function deriveImpact(day, baseHours) {
  const f = CONDITION_FACTOR[day.condition] || CONDITION_FACTOR.Clear;
  // Precipitation probability and high wind both nudge the penalty upward.
  const precipWeight = day.precip / 100;
  const windPenalty = day.windKph >= 30 ? 0.06 : day.windKph >= 22 ? 0.03 : 0;
  const pct = f.pct * (0.6 + 0.4 * precipWeight) + windPenalty;
  const extraMin = Math.round((baseHours * 60 * pct) / 5) * 5;
  const risk = day.precip >= 65 || day.condition === "Heavy rain" ? "High"
             : day.precip >= 28 ? "Medium" : "Low";
  const suitability = risk === "High" ? "Poor" : risk === "Medium" ? "Moderate"
                    : day.precip <= 10 ? "Excellent" : "Good";
  const recommendation = risk === "High" ? "Avoid if an alternative window is available"
                       : risk === "Medium" ? "Workable — allow buffer time"
                       : "Suitable for planned maintenance";
  return { ...day, extraMin, risk, suitability, recommendation, impactLabel: f.label, baseHours };
}
function fmtDuration(totalMin) {
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
const WEATHER_DURATION_EXAMPLE = [
  { condition: "Clear", icon: "clear" },
  { condition: "Cloudy", icon: "partly" },
  { condition: "Rain", icon: "rain-light" },
  { condition: "Heavy rain", icon: "rain-heavy" },
];

/* ----------------------------------------------------------------------------
   BLOCK EXECUTION
   Lifecycle: Approved → Scheduled → In Progress → Completed, with Delayed as a
   branch off Scheduled/In Progress. Every record keeps planned vs actual side by
   side, because the variance is what feeds back into future predictions.
   Shaped like a Spring Boot execution-record payload.
---------------------------------------------------------------------------- */
const EXEC_STATUS = {
  scheduled:   { label: "Scheduled",   color: T.blue,  bg: "#EAF1FE", icon: CalendarClock },
  inprogress:  { label: "In Progress", color: T.amber, bg: T.amberSoft, icon: CirclePlay },
  completed:   { label: "Completed",   color: T.green, bg: T.greenSoft, icon: CircleCheck },
  delayed:     { label: "Delayed",     color: T.red,   bg: T.redSoft,   icon: AlertTriangle },
};
const COMPLETION_RESULTS = [
  "Successfully Completed",
  "Completed With Minor Issues",
  "Partially Completed",
  "Could Not Be Completed",
];
const DELAY_REASONS = [
  "Weather",
  "Unexpected Asset Condition",
  "Extended Maintenance",
  "Resource Unavailability",
  "Operational Constraint",
  "Other",
];
const RESULT_STYLE = {
  "Successfully Completed": { bg: T.greenSoft, fg: T.green },
  "Completed With Minor Issues": { bg: T.amberSoft, fg: T.amber },
  "Partially Completed": { bg: T.amberSoft, fg: T.amber },
  "Could Not Be Completed": { bg: T.redSoft, fg: T.red },
};

// Minutes helpers — execution times are stored as "HH:MM" strings so they read
// like an operations log, and converted only when arithmetic is needed.
function toMin(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(min) {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
function parseWindow(win) {
  const [a, b] = win.split("–");
  return { start: a.trim(), end: b ? b.trim() : a.trim() };
}

const EXEC_BLOCKS = [
  {
    id: "BLK-2026-018", assetId: "S-204", asset: "Signal System S-204", assetType: "Signal & Interlocking",
    dept: "SNT", corridor: "C-12", task: "Interlocking inspection",
    date: "21 Sep 2026", window: "09:00–12:00", plannedHrs: 3,
    priority: "VERY HIGH", risk: "High", team: "S&T Gang 4", weather: "Clear",
    status: "scheduled",
  },
  {
    id: "BLK-2026-019", assetId: "T-102", asset: "Track Section T-102", assetType: "Permanent Way",
    dept: "ENG", corridor: "C-14", task: "Track geometry survey",
    date: "22 Sep 2026", window: "10:00–13:00", plannedHrs: 3,
    priority: "HIGH", risk: "Medium", team: "PW Gang 2", weather: "Clear",
    status: "scheduled",
  },
  {
    id: "BLK-2026-020", assetId: "OHE-88", asset: "OHE Mast Run M-88", assetType: "Traction Distribution",
    dept: "TRD", corridor: "C-15", task: "OHE tension adjustment",
    date: "23 Sep 2026", window: "22:00–02:00", plannedHrs: 4,
    priority: "MEDIUM", risk: "Low", team: "TRD Gang 1", weather: "Cloudy",
    status: "scheduled",
  },
  {
    id: "BLK-2026-016", assetId: "TRK-1042", asset: "Rail Panel KM 214/6", assetType: "Permanent Way",
    dept: "ENG", corridor: "C-12", task: "Rail crack repair",
    date: "15 Sep 2026", window: "14:00–17:00", plannedHrs: 3,
    priority: "VERY HIGH", risk: "High", team: "PW Gang 1", weather: "Clear",
    status: "inprogress", actualStart: "14:06", startedBy: "A. Kulkarni (PW Gang 1)", elapsedMin: 117,
  },
  {
    id: "BLK-2026-017", assetId: "SIG-210", asset: "Axle Counter AC-6", assetType: "Signal & Interlocking",
    dept: "SNT", corridor: "C-14", task: "Signal cable health check",
    date: "15 Sep 2026", window: "11:00–13:00", plannedHrs: 2,
    priority: "MEDIUM", risk: "Low", team: "S&T Gang 2", weather: "Cloudy",
    status: "inprogress", actualStart: "11:12", startedBy: "M. Sharma (S&T Gang 2)", elapsedMin: 74,
  },
  {
    id: "BLK-2026-012", assetId: "S-204", asset: "Signal System S-204", assetType: "Signal & Interlocking",
    dept: "SNT", corridor: "C-12", task: "Interlocking inspection",
    date: "21 Aug 2026", window: "09:00–12:00", plannedHrs: 3,
    priority: "HIGH", risk: "Medium", team: "S&T Gang 4", weather: "Clear",
    status: "completed", actualStart: "09:07", actualEnd: "11:52", startedBy: "M. Sharma (S&T Gang 4)",
    result: "Successfully Completed", issues: "", notes: "Relay contacts cleaned as precaution.",
  },
  {
    id: "BLK-2026-009", assetId: "S-204", asset: "Signal System S-204", assetType: "Signal & Interlocking",
    dept: "SNT", corridor: "C-12", task: "Point machine service",
    date: "22 Jul 2026", window: "09:00–12:00", plannedHrs: 3,
    priority: "HIGH", risk: "Medium", team: "S&T Gang 4", weather: "Rain",
    status: "completed", actualStart: "09:15", actualEnd: "12:55", startedBy: "M. Sharma (S&T Gang 4)",
    result: "Completed With Minor Issues", issues: "Intermittent showers slowed cable termination work.",
    notes: "Recommend scheduling this activity in a drier window next cycle.",
  },
  {
    id: "BLK-2026-011", assetId: "T-102", asset: "Track Section T-102", assetType: "Permanent Way",
    dept: "ENG", corridor: "C-14", task: "Ballast packing",
    date: "28 Aug 2026", window: "10:00–13:00", plannedHrs: 3,
    priority: "MEDIUM", risk: "Low", team: "PW Gang 2", weather: "Clear",
    status: "completed", actualStart: "10:04", actualEnd: "12:49", startedBy: "A. Kulkarni (PW Gang 2)",
    result: "Successfully Completed", issues: "", notes: "",
  },
  {
    id: "BLK-2026-014", assetId: "OHE-88", asset: "OHE Mast Run M-88", assetType: "Traction Distribution",
    dept: "TRD", corridor: "C-15", task: "Insulator cleaning",
    date: "01 Sep 2026", window: "22:00–01:30", plannedHrs: 3.5,
    priority: "MEDIUM", risk: "Low", team: "TRD Gang 1", weather: "Clear",
    status: "completed", actualStart: "22:08", actualEnd: "01:20", startedBy: "R. Menon (TRD Gang 1)",
    result: "Successfully Completed", issues: "", notes: "",
  },
  {
    id: "BLK-2026-010", assetId: "S-204", asset: "Signal System S-204", assetType: "Signal & Interlocking",
    dept: "SNT", corridor: "C-12", task: "Relay replacement",
    date: "19 Aug 2026", window: "09:00–12:00", plannedHrs: 3,
    priority: "HIGH", risk: "High", team: "S&T Gang 4", weather: "Heavy rain",
    status: "delayed", actualStart: "09:22", startedBy: "M. Sharma (S&T Gang 4)",
    delayReason: "Weather", delayMinutes: 60,
    notes: "Heavy rain forced a stand-down; remaining work carried to the next available block.",
  },
  {
    id: "BLK-2026-013", assetId: "BRG-31", asset: "Bridge Girder Span B-31", assetType: "Bridge & Structures",
    dept: "ENG", corridor: "C-18", task: "Girder inspection",
    date: "30 Jul 2026", window: "09:00–14:00", plannedHrs: 5,
    priority: "HIGH", risk: "Medium", team: "Bridge Unit 1", weather: "Cloudy",
    status: "delayed", actualStart: "09:10", startedBy: "S. Patil (Bridge Unit 1)",
    delayReason: "Unexpected Asset Condition", delayMinutes: 45,
    notes: "Corrosion found on bearing plate; additional inspection scope required.",
  },
];

// Derived actual duration in minutes, handling windows that cross midnight.
function actualDurationMin(b) {
  if (!b.actualStart || !b.actualEnd) return null;
  let d = toMin(b.actualEnd) - toMin(b.actualStart);
  if (d < 0) d += 1440;
  return d;
}
function plannedMin(b) { return Math.round(b.plannedHrs * 60); }
function varianceMin(b) {
  const a = actualDurationMin(b);
  return a == null ? null : a - plannedMin(b);
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "predictive", label: "Predictive Maintenance", icon: Radar },
  { id: "weather", label: "Weather Impact", icon: CloudSun },
  { id: "monthly", label: "Monthly Planner", icon: CalendarRange },
  { id: "weekly", label: "Weekly Planner", icon: CalendarDays },
  { id: "blocks", label: "Block Plans", icon: Boxes },
  { id: "execution", label: "Block Execution", icon: HardHat },
  { id: "live", label: "Live Operations", icon: Radio },
  { id: "whatif", label: "What-if Simulation", icon: FlaskConical },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

/* ============================================================================
   SHARED UI PRIMITIVES
============================================================================ */
function Badge({ children, bg, fg, mono, size = "sm" }) {
  return (
    <span
      className={mono ? "rb-mono" : ""}
      style={{
        background: bg, color: fg, fontWeight: 700,
        fontSize: size === "sm" ? 11 : 12, padding: size === "sm" ? "3px 8px" : "4px 10px",
        borderRadius: 5, letterSpacing: 0.2, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4,
      }}
    >
      {children}
    </span>
  );
}

function SeverityBadge({ level }) {
  const s = SEVERITY_STYLE[level] || SEVERITY_STYLE.Low;
  return <Badge bg={s.bg} fg={s.fg}>{level}</Badge>;
}
function PriorityBadge({ level }) {
  const s = PRIORITY_STYLE[level] || PRIORITY_STYLE.LOW;
  return <Badge bg={s.bg} fg={s.fg}>{level}</Badge>;
}
function DeptTag({ id }) {
  const d = DEPARTMENTS.find((x) => x.id === id);
  if (!d) return null;
  const Icon = d.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: d.color }}>
      <Icon size={13} strokeWidth={2.3} /> {d.name}
    </span>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div
      className={className}
      style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, ...style }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ icon: Icon, children, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        {Icon && <Icon size={15} strokeWidth={2.2} color={T.slate} />}
        <h3 style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: "-0.005em" }}>{children}</h3>
      </div>
      {right}
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub, tone = "default", demo }) {
  const toneColor = { default: T.ink, green: T.green, amber: T.amber, red: T.red, blue: T.blue }[tone];
  return (
    <Card style={{ padding: "16px 18px", flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: T.slate, textTransform: "none" }}>{label}</span>
        <Icon size={15} color={T.slateLight} strokeWidth={2} />
      </div>
      <div className="rb-mono" style={{ fontSize: 26, fontWeight: 700, color: toneColor, marginTop: 6, lineHeight: 1 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11.5, color: T.slateLight }}>{sub}</span>
        {demo && <span style={{ fontSize: 9.5, color: T.slateLight, fontStyle: "italic" }}>simulated</span>}
      </div>
    </Card>
  );
}

function ProgressBar({ value, max = 100, color = T.blue, height = 6, bg = "#EAEDF3" }) {
  return (
    <div style={{ height, background: bg, borderRadius: 99, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function StepFlow({ steps, active, orientation = "vertical" }) {
  // steps: [{label, icon}]
  const isRow = orientation === "horizontal";
  return (
    <div style={{ display: "flex", flexDirection: isRow ? "row" : "column", alignItems: isRow ? "center" : "stretch", gap: isRow ? 4 : 2 }}>
      {steps.map((s, i) => {
        const state = i < active ? "done" : i === active ? "active" : "pending";
        const color = state === "done" ? T.green : state === "active" ? T.blue : T.slateLight;
        const bg = state === "done" ? T.greenSoft : state === "active" ? "#EAF1FE" : "#F4F6F9";
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, background: state === "pending" ? "transparent" : bg, transition: "all .3s" }}>
              {state === "done" ? <CheckCircle2 size={14} color={color} /> : state === "active" ? <div className="rb-anim-blink"><CircleDot size={14} color={color} /></div> : <Dot size={14} color={color} />}
              <span style={{ fontSize: 12.5, fontWeight: state === "pending" ? 500 : 700, color: state === "pending" ? T.slateLight : T.ink }}>{s}</span>
            </div>
            {i < steps.length - 1 && (isRow ? <ArrowRight size={12} color={T.slateLight} /> : null)}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Modal({ open, onClose, children, width = 640 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(11,21,38,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div className="rb-anim-fadeup rb-scrollbar" style={{ background: T.panel, borderRadius: 14, width, maxWidth: "94vw", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(11,21,38,0.35)" }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Drawer({ open, onClose, children, width = 460 }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: open ? "auto" : "none" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(11,21,38,0.45)", opacity: open ? 1 : 0, transition: "opacity .25s" }} />
      <div className="rb-scrollbar" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width, maxWidth: "92vw", background: T.panel, boxShadow: "-16px 0 40px rgba(11,21,38,.25)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

function IconBtn({ icon: Icon, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{ border: `1px solid ${T.line}`, background: T.panel, borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <Icon size={15} color={T.slate} />
    </button>
  );
}

function PrimaryBtn({ children, icon: Icon, onClick, disabled, tone = "blue", full }) {
  const bg = { blue: T.blue, green: T.green, red: T.red, navy: T.navy }[tone];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        background: disabled ? "#B9C3D6" : bg, color: "#fff", border: "none", borderRadius: 8,
        padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto", boxShadow: disabled ? "none" : "0 1px 2px rgba(0,0,0,.08)",
      }}
    >
      {Icon && <Icon size={15} />} {children}
    </button>
  );
}
function GhostBtn({ children, icon: Icon, onClick, full }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#fff", color: T.ink, border: `1px solid ${T.line}`, borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: full ? "100%" : "auto" }}>
      {Icon && <Icon size={15} />} {children}
    </button>
  );
}

/* ============================================================================
   CORRIDOR / NETWORK SCHEMATIC — reused on Overview + Live Operations
============================================================================ */
function CorridorSchematic({ conflictMode, delayedTrain }) {
  // Stations across a single trunk, with one maintenance spur to represent the block.
  return (
    <div style={{ position: "relative", padding: "34px 26px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {STATIONS.map((s, i) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: 90 }}>
            <div style={{ width: 12, height: 12, borderRadius: 99, background: T.navy, border: "2px solid #fff", boxShadow: "0 0 0 2px " + T.navy }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: T.ink, marginTop: 8, textAlign: "center" }}>{s}</span>
            <span className="rb-mono" style={{ fontSize: 9, color: T.slateLight }}>{`KM ${i * 42 + 10}`}</span>
          </div>
        ))}
        {/* main trunk line */}
        <div style={{ position: "absolute", top: 5, left: 45, right: 45, height: 3, background: "repeating-linear-gradient(90deg,#B9C3D6 0 8px,transparent 8px 14px)" }} />
      </div>

      {/* maintenance spur below Chandpur (station index 2) */}
      <div style={{ position: "absolute", left: "calc(40% - 6px)", top: 46, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 2, height: 26, background: T.amber }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.amberSoft, border: `1px solid ${T.amber}55`, borderRadius: 7, padding: "5px 9px" }}>
          <Wrench size={12} color={T.amber} />
          <span className="rb-mono" style={{ fontSize: 10, fontWeight: 700, color: T.amber }}>BLK-204 · C-12</span>
        </div>
      </div>

      {/* train tokens moving across trunk */}
      <div className="rb-track-line" style={{ position: "absolute", top: -1, left: 45, right: 45, height: 14 }}>
        {TRAINS.map((tr, i) => (
          <div
            key={tr.id}
            className="rb-train-token"
            style={{
              position: "absolute", top: -5, animationDuration: `${9 + i * 2.4}s`, animationDelay: `${i * -3}s`,
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <div style={{ background: conflictMode && tr.id === delayedTrain ? T.red : T.blue, color: "#fff", borderRadius: 5, padding: "2px 6px", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 5px rgba(0,0,0,.18)" }}>
              <Train size={11} />
              <span className="rb-mono" style={{ fontSize: 9.5, fontWeight: 700 }}>{tr.id}</span>
            </div>
          </div>
        ))}
      </div>

      {conflictMode && (
        <div className="rb-anim-fadein" style={{ position: "absolute", left: "calc(40% - 30px)", top: 6, display: "flex", alignItems: "center", gap: 5, background: T.red, color: "#fff", borderRadius: 6, padding: "3px 8px" }}>
          <AlertTriangle size={12} />
          <span style={{ fontSize: 10, fontWeight: 800 }}>CONFLICT</span>
        </div>
      )}

      <div style={{ marginTop: 46, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <LegendDot color={T.blue} label="Train in motion" icon={Train} />
        <LegendDot color={T.amber} label="Active / upcoming block" icon={Wrench} />
        <LegendDot color={T.red} label="Conflict zone" icon={AlertTriangle} />
        <LegendDot color={T.navy} label="Station" icon={MapPin} />
      </div>
    </div>
  );
}
function LegendDot({ color, label, icon: Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Icon size={12} color={color} />
      <span style={{ fontSize: 11, color: T.slate, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ============================================================================
   TOP NAVIGATION + STATUS TICKER
============================================================================ */
function TopNav({ page, setPage, alerts }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ background: T.navy, padding: "0 20px", display: "flex", alignItems: "center", height: 54, gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#1D5DE8,#0EA5C7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Waypoints size={16} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 13.5, lineHeight: 1.1 }}>RailOps</div>
            <div style={{ color: "#8FA3C9", fontSize: 9, letterSpacing: 0.3, lineHeight: 1 }}>Railway Block Planning &amp; Optimization</div>
          </div>
        </div>
        <div className="rb-scrollbar" style={{ display: "flex", alignItems: "center", gap: 2, overflowX: "auto", flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 11px", borderRadius: 7,
                  background: active ? "rgba(29,93,232,0.22)" : "transparent", border: "none", cursor: "pointer",
                  color: active ? "#fff" : "#A6B3CC", fontSize: 12.5, fontWeight: active ? 700 : 500, whiteSpace: "nowrap",
                }}
              >
                <Icon size={13.5} strokeWidth={2.2} /> {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Bell size={16} color="#A6B3CC" />
            {alerts > 0 && <div style={{ position: "absolute", top: -4, right: -4, background: T.red, color: "#fff", fontSize: 8.5, fontWeight: 800, borderRadius: 99, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{alerts}</div>}
          </div>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: "#233B66", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>RP</div>
        </div>
      </div>
      <StatusTicker />
    </div>
  );
}

function StatusTicker() {
  const [clock, setClock] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: T.navyLight, padding: "6px 20px", display: "flex", alignItems: "center", gap: 22, fontSize: 11 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7FE3B4" }}>
        <div style={{ width: 6, height: 6, borderRadius: 99, background: "#3EDC91" }} className="rb-anim-blink" />
        <span style={{ fontWeight: 700 }}>SYSTEM NOMINAL</span>
      </div>
      <span style={{ color: "#7A8CB0" }}>4 corridors monitored</span>
      <span style={{ color: "#7A8CB0" }}>4 trains tracked</span>
      <span style={{ color: "#7A8CB0" }}>Last sync: 12s ago</span>
      <div style={{ marginLeft: "auto" }} className="rb-mono">
        <span style={{ color: "#C7D2EA", fontWeight: 700 }}>{clock.toLocaleTimeString("en-IN", { hour12: false })}</span>
        <span style={{ color: "#7A8CB0", marginLeft: 8 }}>IST · 07 Sep 2026</span>
      </div>
    </div>
  );
}

function PageHeader({ title, sub, icon: Icon, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 30, gap: 20, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {Icon && <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEF3FD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={19} color={T.blue} strokeWidth={1.8} /></div>}
        <div>
          <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0, color: T.ink, letterSpacing: "-0.01em" }}>{title}</h1>
          {sub && <p style={{ fontSize: 12.5, color: T.slate, margin: "4px 0 0", maxWidth: 560, lineHeight: 1.5 }}>{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ============================================================================
   AI MAINTENANCE INSIGHTS — two complementary, clearly-separated components.
   Predictive Maintenance answers "which assets should we maintain soon?"
   Weather-Aware Planning answers "when would maintenance be more suitable?"
   Neither decides the plan — both feed the optimizer, which owns feasibility.
============================================================================ */
function RiskBadge({ level }) {
  const s = RISK_STYLE[level] || RISK_STYLE.Low;
  return <Badge bg={s.bg} fg={s.fg}>{level} risk</Badge>;
}

function WeatherIcon({ kind, size = 16, color }) {
  const Icon = kind === "rain-heavy" ? CloudRain : kind === "rain-light" ? CloudDrizzle : kind === "partly" ? CloudSun : Sun;
  return <Icon size={size} color={color} strokeWidth={1.9} />;
}

function ConfidenceMeter({ value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 54 }}><ProgressBar value={value} color={T.slate} height={4} /></div>
      <span className="rb-mono" style={{ fontSize: 10.5, color: T.slate, fontWeight: 600 }}>{value}% confidence</span>
    </div>
  );
}

/* ---- Card 1: Predictive Maintenance ---- */
function PredictiveMaintenanceCard({ onRegister, onViewRecommendation, registered, goto }) {
  const attention = PREDICTIONS.filter((p) => !registered.includes(p.assetId));
  const highRisk = attention.filter((p) => p.risk === "High").length;

  return (
    <Card style={{ padding: 24, display: "flex", flexDirection: "column" }}>
      <SectionLabel icon={Radar} right={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge bg="#EEF1F6" fg={T.slate}>AI RECOMMENDATION</Badge>
          <button onClick={() => goto && goto("predictive")} style={{ fontSize: 11.5, color: T.blue, fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>Open page →</button>
        </div>
      }>
        Predictive Maintenance
      </SectionLabel>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span className="rb-mono" style={{ fontSize: 30, fontWeight: 700, color: T.ink, lineHeight: 1 }}>{attention.length}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>assets need attention</span>
      </div>
      <p style={{ fontSize: 11.5, color: T.slateLight, margin: "0 0 20px" }}>
        {highRisk} high risk · predicted from historical maintenance intervals and defect history
      </p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {attention.map((p) => (
          <div key={p.assetId} className="rb-anim-fadein" style={{ padding: "14px 0", borderTop: `1px solid ${T.line}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <span className="rb-mono" style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>{p.assetId}</span>
                  <RiskBadge level={p.risk} />
                  <DeptTag id={p.dept} />
                </div>
                <div style={{ fontSize: 12, color: T.slate, marginTop: 5 }}>
                  Maintenance expected within <b style={{ color: T.ink }}>{p.daysAway} days</b> · window {p.windowStart}–{p.windowEnd}
                </div>
                <div style={{ fontSize: 11, color: T.slateLight, marginTop: 3 }}>
                  {p.assetType} · {p.corridor} · last serviced {p.lastMaintenance} · {p.avgInterval}-day average interval
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              <ConfidenceMeter value={p.confidence} />
              <div style={{ display: "flex", gap: 8 }}>
                <GhostBtn icon={Info} onClick={() => onViewRecommendation(p)}>Why?</GhostBtn>
                {p.risk === "High"
                  ? <PrimaryBtn icon={CalendarPlus} onClick={() => onRegister(p)}>Register Block</PrimaryBtn>
                  : <GhostBtn icon={SquareArrowOutUpRight} onClick={() => onViewRecommendation(p)}>View Recommendation</GhostBtn>}
              </div>
            </div>
          </div>
        ))}
        {attention.length === 0 && (
          <div style={{ padding: "26px 0", textAlign: "center", borderTop: `1px solid ${T.line}` }}>
            <CheckCircle2 size={20} color={T.green} />
            <p style={{ fontSize: 12.5, color: T.slate, margin: "8px 0 0" }}>All predicted assets have a block registered.</p>
          </div>
        )}
      </div>

      <p style={{ fontSize: 10.5, color: T.slateLight, marginTop: 16, marginBottom: 0, lineHeight: 1.55 }}>
        These are AI recommendations based on historical patterns, not certainties. A planner decides whether to register a block.
      </p>
    </Card>
  );
}

/* ---- Card 2: Weather-Aware Planning ---- */
function WeatherAwareCard({ onUseWindow, appliedWindow, goto }) {
  const best = WEATHER_WINDOWS.find((w) => w.recommended);
  const overall = WEATHER_WINDOWS.some((w) => w.risk === "High") ? "Medium" : "Low";

  return (
    <Card style={{ padding: 24, display: "flex", flexDirection: "column" }}>
      <SectionLabel icon={CloudSun} right={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge bg="#EEF1F6" fg={T.slate}>PLANNING PREFERENCE</Badge>
          <button onClick={() => goto && goto("weather")} style={{ fontSize: 11.5, color: T.blue, fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>15-day analysis →</button>
        </div>
      }>
        Weather-Aware Planning
      </SectionLabel>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: overall === "Medium" ? T.amber : T.green, lineHeight: 1 }}>Weather impact: {overall}</span>
      </div>
      <p style={{ fontSize: 11.5, color: T.slateLight, margin: "0 0 18px" }}>
        {WEATHER_TASK.label} — {WEATHER_TASK.assetId} · {WEATHER_TASK.corridor} · {WEATHER_TASK.date} · {WEATHER_TASK.requiredDuration} hrs required
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {WEATHER_WINDOWS.map((w) => {
          const rs = RISK_STYLE[w.risk];
          const isBest = w.recommended;
          return (
            <div key={w.window} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 9,
              background: isBest ? T.greenSoft : T.canvas,
              boxShadow: isBest ? `inset 0 0 0 1.5px ${T.green}44` : "none",
            }}>
              <WeatherIcon kind={w.icon} size={18} color={rs.fg} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <span className="rb-mono" style={{ fontSize: 12.5, fontWeight: 800, color: T.ink }}>{w.window}</span>
                  {isBest && <Badge bg="#fff" fg={T.green}><CheckCircle2 size={10} /> RECOMMENDED</Badge>}
                </div>
                <div style={{ fontSize: 11.5, color: T.slate, marginTop: 3 }}>{w.condition}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <Badge bg={rs.bg} fg={rs.fg}>{w.risk}</Badge>
                <div className="rb-mono" style={{ fontSize: 10.5, color: w.durationImpactMin > 0 ? T.amber : T.green, marginTop: 5, fontWeight: 600 }}>
                  {w.durationImpactMin > 0 ? `+${w.durationImpactMin} min` : "no delay"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Window comparison strip — precipitation probability across the day */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.slateLight, marginBottom: 8 }}>PRECIPITATION PROBABILITY</div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 44 }}>
          {WEATHER_WINDOWS.map((w) => (
            <div key={w.window} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: "100%", height: 32, background: "#EEF1F6", borderRadius: 4, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                <div style={{ width: "100%", height: `${w.precip}%`, background: RISK_STYLE[w.risk].fg, opacity: w.recommended ? 1 : 0.55, borderRadius: 4, transition: "height .5s cubic-bezier(.4,0,.2,1)" }} />
              </div>
              <span className="rb-mono" style={{ fontSize: 9.5, color: T.slateLight }}>{w.precip}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: T.canvas, borderRadius: 9, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.slateLight, marginBottom: 6 }}>RECOMMENDED MAINTENANCE WINDOW</div>
        <div className="rb-mono" style={{ fontSize: 18, fontWeight: 800, color: T.green, marginBottom: 6 }}>{best.window}</div>
        <p style={{ fontSize: 11.5, color: T.slate, margin: 0, lineHeight: 1.55 }}>{best.note}</p>
      </div>

      {appliedWindow === best.window ? (
        <div className="rb-anim-fadeup" style={{ display: "flex", alignItems: "center", gap: 9, background: T.greenSoft, borderRadius: 8, padding: "11px 14px" }}>
          <CheckCircle2 size={15} color={T.green} />
          <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>Added as a planning preference for {WEATHER_TASK.assetId}.</span>
        </div>
      ) : (
        <PrimaryBtn icon={ThumbsUp} onClick={() => onUseWindow(best)} full>Use Recommended Window</PrimaryBtn>
      )}

      <p style={{ fontSize: 10.5, color: T.slateLight, marginTop: 14, marginBottom: 0, lineHeight: 1.55 }}>
        Weather is treated as a soft preference. Train movements, corridor availability, safety and duration constraints are still enforced by the optimizer and are never overridden.
      </p>
    </Card>
  );
}

/* ---- The dashboard section wrapping both cards ---- */
function AIMaintenanceInsights({ onRegister, onViewRecommendation, onUseWindow, registered, appliedWindow, goto }) {
  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Brain size={16} color={T.blue} strokeWidth={2} />
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: T.ink }}>AI Maintenance Insights</h2>
      </div>
      <p style={{ fontSize: 12, color: T.slate, margin: "0 0 20px", maxWidth: 680, lineHeight: 1.55 }}>
        Proactive inputs to the planning process — surfacing maintenance needs before a department raises them, and flagging when conditions favour one window over another.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        <PredictiveMaintenanceCard onRegister={onRegister} onViewRecommendation={onViewRecommendation} registered={registered} goto={goto} />
        <WeatherAwareCard onUseWindow={onUseWindow} appliedWindow={appliedWindow} goto={goto} />
      </div>
    </div>
  );
}

/* ---- Prediction reasoning drawer — the "show your work" view ---- */
function PredictionDrawer({ prediction, onClose, onRegister, registered }) {
  if (!prediction) return null;
  const p = prediction;
  const isRegistered = registered.includes(p.assetId);
  return (
    <Drawer open={!!prediction} onClose={onClose}>
      <div style={{ padding: "22px 24px", borderBottom: `1px solid ${T.line}`, position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
              <RiskBadge level={p.risk} />
              <DeptTag id={p.dept} />
            </div>
            <div className="rb-mono" style={{ fontSize: 17, fontWeight: 800 }}>{p.assetId}</div>
            <div style={{ fontSize: 12.5, color: T.slate, marginTop: 3 }}>{p.assetName} · {p.assetType}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F4F9", borderRadius: 7, width: 30, height: 30, cursor: "pointer", flexShrink: 0 }}><X size={14} /></button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ background: T.canvas, borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.slateLight, marginBottom: 6 }}>PREDICTED MAINTENANCE WINDOW</div>
          <div className="rb-mono" style={{ fontSize: 19, fontWeight: 800, color: T.ink, marginBottom: 8 }}>{p.windowStart} – {p.windowEnd}</div>
          <ConfidenceMeter value={p.confidence} />
          <p style={{ fontSize: 12, color: T.slate, margin: "12px 0 0", lineHeight: 1.6 }}>
            This asset is approaching its predicted maintenance window. Consider registering a block to avoid delayed maintenance or potential failure.
          </p>
        </div>

        <SectionLabel icon={Database}>Historical record</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <InfoTile label="Last maintenance" value={p.lastMaintenance} />
          <InfoTile label="Average interval" value={`${p.avgInterval} days`} />
          <InfoTile label="Maintenance events" value={p.eventCount} />
          <InfoTile label="Average duration" value={`${p.avgDuration} hrs`} />
          <InfoTile label="Defects since service" value={p.defects} />
          <InfoTile label="Criticality" value={p.criticality} />
        </div>

        <SectionLabel icon={Lightbulb}>Why this recommendation</SectionLabel>
        <div style={{ marginBottom: 24 }}>
          {p.drivers.map((d) => (
            <div key={d.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{d.label}</span>
                <span className="rb-mono" style={{ fontSize: 10.5, color: T.slateLight }}>{Math.round(d.v * 100)}</span>
              </div>
              <ProgressBar value={d.v * 100} color={d.v > 0.7 ? T.red : d.v > 0.4 ? T.amber : T.green} height={5} />
              <div style={{ fontSize: 11, color: T.slateLight, marginTop: 5 }}>{d.detail}</div>
            </div>
          ))}
        </div>

        <SectionLabel icon={Workflow}>Where this goes next</SectionLabel>
        <div style={{ marginBottom: 24 }}>
          <StepFlow steps={["Predictive analysis", "Block registered by department", "Weather-aware window analysis", "Priority engine", "CP-SAT optimization"]} active={isRegistered ? 2 : 1} />
        </div>

        {isRegistered ? (
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: T.greenSoft, borderRadius: 8, padding: "12px 14px" }}>
            <CheckCircle2 size={15} color={T.green} />
            <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>A block has been registered for this asset.</span>
          </div>
        ) : (
          <PrimaryBtn icon={CalendarPlus} onClick={() => onRegister(p)} full>Register Block</PrimaryBtn>
        )}

        <p style={{ fontSize: 10.5, color: T.slateLight, marginTop: 14, lineHeight: 1.55 }}>
          Predicted from historical maintenance patterns. This is a recommendation for planner review, not an automatic work order.
        </p>
      </div>
    </Drawer>
  );
}

/* ---- Block registration modal, pre-filled from the prediction ---- */
function RegisterBlockModal({ prediction, onClose, onSubmit }) {
  const [duration, setDuration] = useState(3);
  const [preferWeather, setPreferWeather] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prediction) {
      setDuration(prediction.suggestedDuration);
      setPreferWeather(true); setSubmitting(false); setSubmitted(false);
    }
  }, [prediction && prediction.assetId]);

  if (!prediction) return null;
  const p = prediction;
  const best = WEATHER_WINDOWS.find((w) => w.recommended);

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); onSubmit(p); }, 900);
  };

  return (
    <Modal open={!!prediction} onClose={onClose} width={580}>
      <div style={{ padding: "24px 26px 20px", borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Badge bg="#EEF1F6" fg={T.slate}>PRE-FILLED FROM PREDICTION</Badge>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 8, color: T.ink }}>Register Maintenance Block</div>
            <div style={{ fontSize: 12.5, color: T.slate, marginTop: 3 }}>{p.assetId} — {p.assetName}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F4F9", borderRadius: 7, width: 30, height: 30, cursor: "pointer", flexShrink: 0 }}><X size={14} /></button>
        </div>
      </div>

      <div style={{ padding: "22px 26px 26px" }}>
        {submitted ? (
          <div className="rb-anim-fadeup" style={{ textAlign: "center", padding: "14px 0" }}>
            <CheckCircle2 size={34} color={T.green} />
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12, color: T.ink }}>Block request registered</div>
            <p style={{ fontSize: 12.5, color: T.slate, margin: "8px auto 20px", maxWidth: 380, lineHeight: 1.6 }}>
              The request for {p.assetId} has entered the planning queue. It will be scored by the priority engine and scheduled by CP-SAT alongside existing blocks.
            </p>
            <div style={{ background: T.canvas, borderRadius: 9, padding: 16, textAlign: "left" }}>
              <StepFlow steps={["Predictive analysis", "Block registered", "Weather-aware window analysis", "Priority engine", "CP-SAT optimization"]} active={2} />
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <InfoTile label="Asset" value={p.assetId} mono />
              <InfoTile label="Department" value={DEPARTMENTS.find((d) => d.id === p.dept).name} />
              <InfoTile label="Corridor" value={p.corridor} mono />
              <InfoTile label="Asset type" value={p.assetType} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.slate, display: "block", marginBottom: 6 }}>Target window (from prediction)</label>
              <div style={{ background: T.canvas, borderRadius: 8, padding: "11px 14px" }}>
                <span className="rb-mono" style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{p.windowStart} – {p.windowEnd}</span>
                <span style={{ fontSize: 11.5, color: T.slateLight, marginLeft: 10 }}>predicted maintenance period</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.slate, display: "block", marginBottom: 8 }}>
                Estimated duration: <span className="rb-mono" style={{ color: T.ink }}>{duration} hrs</span>
                <span style={{ fontWeight: 500, color: T.slateLight, marginLeft: 8 }}>historical average {p.avgDuration} hrs</span>
              </label>
              <input type="range" min={1} max={8} value={duration} onChange={(e) => setDuration(+e.target.value)} style={{ width: "100%" }} />
            </div>

            <div
              onClick={() => setPreferWeather((v) => !v)}
              style={{ display: "flex", alignItems: "flex-start", gap: 11, background: preferWeather ? T.greenSoft : T.canvas, borderRadius: 9, padding: "13px 15px", marginBottom: 22, cursor: "pointer", transition: "background .25s" }}
            >
              <div style={{ width: 16, height: 16, borderRadius: 4, background: preferWeather ? T.green : "#fff", boxShadow: preferWeather ? "none" : `inset 0 0 0 1.5px ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                {preferWeather && <CheckCircle2 size={12} color="#fff" />}
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink }}>Apply weather-aware window preference</div>
                <div style={{ fontSize: 11, color: T.slate, marginTop: 3, lineHeight: 1.5 }}>
                  Favours {best.window} where feasible. A preference only — the optimizer still enforces train paths, corridor availability and safety constraints.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <PrimaryBtn icon={submitting ? RefreshCw : CalendarPlus} onClick={submit} disabled={submitting} full>
                {submitting ? "Registering…" : "Register Block"}
              </PrimaryBtn>
              <GhostBtn onClick={onClose} full>Cancel</GhostBtn>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}


function OverviewPage({ goto, openTask, onRegister, onViewRecommendation, onUseWindow, registered, appliedWindow, execBlocks }) {
  const critical = TASKS.filter((t) => t.severity === "Critical").length;
  const predicted = PREDICTIONS.filter((p) => !registered.includes(p.assetId)).length;
  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title="Railway Operations Command Center"
        sub="Continuously plans and optimizes maintenance blocks across Engineering, S&T and Traction — while minimizing operational disruption."
        right={<PrimaryBtn icon={Sparkles} onClick={() => goto("monthly")}>Open Monthly Planner</PrimaryBtn>}
      />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <KPICard icon={ListChecks} label="Active Maintenance Tasks" value={TASKS.length} sub="Across 3 departments" />
        <KPICard icon={AlertTriangle} label="Critical Tasks" value={critical} sub="Require priority blocks" tone="red" />
        <KPICard icon={Boxes} label="Upcoming Blocks (30d)" value={MONTHLY_BLOCKS.length} sub="From monthly plan" tone="blue" />
        <KPICard icon={ShieldCheck} label="Asset Availability" value="96.4%" sub="Rolling 30-day" tone="green" demo />
        <KPICard icon={Clock} label="Planned Block Hours" value="47 hrs" sub="This month" demo />
        <KPICard icon={Train} label="Train Impact" value="Low" sub="Weighted disruption score" tone="green" demo />
        <KPICard icon={AlertOctagon} label="Conflicts Detected" value="1" sub="Live — see Live Operations" tone="amber" />
        <KPICard icon={Radar} label="Predicted Maintenance" value={predicted} sub="Assets flagged by AI" tone="blue" demo />
      </div>

      <Card>
        <div style={{ padding: "20px 22px 8px" }}>
          <SectionLabel icon={RouteIcon} right={<Badge bg={T.greenSoft} fg={T.green}>LIVE SCHEMATIC · SIMULATED</Badge>}>Corridor &amp; Block Network</SectionLabel>
        </div>
        <CorridorSchematic />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
        <Card style={{ padding: 22 }}>
          <SectionLabel icon={AlertTriangle} right={<button onClick={() => goto("maintenance")} style={{ fontSize: 11.5, color: T.blue, fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>View all →</button>}>
            Highest-priority pending tasks
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...TASKS].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 4).map((t) => (
              <div key={t.id} onClick={() => openTask(t)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", border: `1px solid ${T.line}`, borderRadius: 8, cursor: "pointer" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="rb-mono" style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>{t.id}</span>
                    <DeptTag id={t.dept} />
                  </div>
                  <div style={{ fontSize: 12, color: T.slate, marginTop: 2 }}>{t.type} · {t.corridor}</div>
                </div>
                <PriorityBadge level={t.priority} />
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 22 }}>
          <SectionLabel icon={CalendarClock}>Planning hierarchy</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Monthly Plan", sub: "~30 day strategic horizon", page: "monthly", icon: CalendarRange },
              { label: "Weekly Plan", sub: "Refined from monthly, next 7 days", page: "weekly", icon: CalendarDays },
              { label: "Near-term Plan", sub: "Optimized block schedule", page: "blocks", icon: Boxes },
              { label: "Real-time Adaptation", sub: "Live conflict detection & re-optimization", page: "live", icon: Radio },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div onClick={() => goto(row.page)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 4px", cursor: "pointer" }}>
                  <row.icon size={15} color={T.blue} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: T.slateLight }}>{row.sub}</div>
                  </div>
                  <ChevronRight size={14} color={T.slateLight} />
                </div>
                {i < arr.length - 1 && <div style={{ marginLeft: 7, width: 1, height: 12, background: T.line }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <AIMaintenanceInsights
        onRegister={onRegister}
        onViewRecommendation={onViewRecommendation}
        onUseWindow={onUseWindow}
        registered={registered}
        appliedWindow={appliedWindow}
        goto={goto}
      />

      <ExecutionStatusStrip execBlocks={execBlocks} goto={goto} />
    </div>
  );
}

/* ---- Compact execution status summary for the dashboard ---- */
function ExecutionStatusStrip({ execBlocks, goto }) {
  const counts = {
    scheduled: execBlocks.filter((b) => b.status === "scheduled").length,
    inprogress: execBlocks.filter((b) => b.status === "inprogress").length,
    completed: execBlocks.filter((b) => b.status === "completed").length,
    delayed: execBlocks.filter((b) => b.status === "delayed").length,
  };
  const active = execBlocks.filter((b) => b.status === "inprogress");
  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <HardHat size={16} color={T.blue} strokeWidth={2} />
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: T.ink }}>Block Execution Status</h2>
        </div>
        <button onClick={() => goto("execution")} style={{ fontSize: 12, color: T.blue, fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>
          View Block Execution →
        </button>
      </div>
      <p style={{ fontSize: 12, color: T.slate, margin: "0 0 20px", maxWidth: 680, lineHeight: 1.55 }}>
        Approved blocks as they move through execution. Actual durations recorded here feed back into future predictions.
      </p>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { k: "scheduled", label: "Scheduled", sub: "Not yet started" },
            { k: "inprogress", label: "In Progress", sub: "Work underway" },
            { k: "completed", label: "Completed", sub: "Execution recorded" },
            { k: "delayed", label: "Delayed", sub: "Outside planned window" },
          ].map((row, i) => {
            const m = EXEC_STATUS[row.k];
            const Icon = m.icon;
            return (
              <div key={row.k} onClick={() => goto("execution")}
                style={{ padding: "20px 22px", cursor: "pointer", borderRight: i < 3 ? `1px solid ${T.line}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Icon size={14} color={m.color} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: T.slate }}>{row.label}</span>
                </div>
                <div className="rb-mono" style={{ fontSize: 26, fontWeight: 700, color: m.color, lineHeight: 1 }}>{counts[row.k]}</div>
                <div style={{ fontSize: 11, color: T.slateLight, marginTop: 6 }}>{row.sub}</div>
              </div>
            );
          })}
        </div>
        {active.length > 0 && (
          <div style={{ borderTop: `1px solid ${T.line}`, padding: "16px 22px", background: "#FCFDFE" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.slateLight, marginBottom: 12 }}>CURRENTLY EXECUTING</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {active.map((b) => {
                const pMin = plannedMin(b);
                const pct = Math.min(100, Math.round(((b.elapsedMin || 0) / pMin) * 100));
                return (
                  <div key={b.id} onClick={() => goto("execution")} style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 10, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span className="rb-mono" style={{ fontSize: 11.5, fontWeight: 800, color: T.ink }}>{b.id}</span>
                        <span style={{ fontSize: 11.5, color: T.slate }}>{b.task} · {b.corridor}</span>
                        <DeptTag id={b.dept} />
                      </div>
                      <span className="rb-mono" style={{ fontSize: 11, color: T.slate }}>{pct}% of {fmtDuration(pMin)}</span>
                    </div>
                    <ProgressBar value={pct} color={pct > 100 ? T.red : T.amber} height={5} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================================================================
   PAGE: MAINTENANCE TASKS + TASK DRAWER (Details / Asset Risk / Priority)
============================================================================ */
function MaintenancePage({ openTask }) {
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const filtered = TASKS.filter((t) => (deptFilter === "ALL" || t.dept === deptFilter) && (t.id + t.type + t.asset).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader icon={Wrench} title="Maintenance Tasks" sub="Unified feed from TMS, SMMS and TDMS — normalized and scored before planning." />


      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.line}`, borderRadius: 8, padding: "7px 10px", background: "#fff", flex: "0 0 240px" }}>
          <Search size={14} color={T.slateLight} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search task, asset, ID…" style={{ border: "none", outline: "none", fontSize: 12.5, width: "100%" }} />
        </div>
        {["ALL", ...DEPARTMENTS.map((d) => d.id)].map((id) => (
          <button key={id} onClick={() => setDeptFilter(id)} style={{
            border: `1px solid ${deptFilter === id ? T.blue : T.line}`, background: deptFilter === id ? "#EAF1FE" : "#fff",
            color: deptFilter === id ? T.blueDeep : T.slate, borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>
            {id === "ALL" ? "All departments" : DEPARTMENTS.find((d) => d.id === id).name}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <Badge bg="#EEF1F6" fg={T.slate}>TMS</Badge><Badge bg="#EEF1F6" fg={T.slate}>SMMS</Badge><Badge bg="#EEF1F6" fg={T.slate}>TDMS</Badge>
        </div>
      </div>

      <Card style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: T.canvas, textAlign: "left" }}>
              {["Task", "Department", "Corridor", "Severity", "Due", "Duration", "Asset Risk", "Priority", ""].map((h) => (
                <th key={h} style={{ padding: "13px 18px", fontSize: 10.5, fontWeight: 700, color: T.slate, letterSpacing: 0.3, borderBottom: `1px solid ${T.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} onClick={() => openTask(t)} style={{ cursor: "pointer", borderBottom: `1px solid ${T.line}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "14px 18px" }}>
                  <div className="rb-mono" style={{ fontWeight: 700, color: T.ink }}>{t.id}</div>
                  <div style={{ color: T.slate, fontSize: 11.5 }}>{t.type}</div>
                </td>
                <td style={{ padding: "14px 18px" }}><DeptTag id={t.dept} /></td>
                <td className="rb-mono" style={{ padding: "14px 18px", fontWeight: 600 }}>{t.corridor}</td>
                <td style={{ padding: "14px 18px" }}><SeverityBadge level={t.severity} /></td>
                <td style={{ padding: "14px 18px", color: T.slate }}>{t.due}</td>
                <td style={{ padding: "14px 18px", color: T.slate }}>{t.duration} hrs</td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 44 }}><ProgressBar value={t.assetRisk} color={t.assetRisk > 70 ? T.red : t.assetRisk > 45 ? T.amber : T.green} /></div>
                    <span className="rb-mono" style={{ fontSize: 11, fontWeight: 700 }}>{t.assetRisk}%</span>
                  </div>
                </td>
                <td style={{ padding: "14px 18px" }}><PriorityBadge level={t.priority} /></td>
                <td style={{ padding: "14px 18px" }}><ChevronRight size={14} color={T.slateLight} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function RiskBar({ label, v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11.5, color: T.slate, width: 150, flexShrink: 0 }}>{label}</span>
      <ProgressBar value={v * 100} color={T.red} />
      <span className="rb-mono" style={{ fontSize: 11, width: 34, textAlign: "right", color: T.ink, fontWeight: 700 }}>{Math.round(v * 100)}</span>
    </div>
  );
}

function TaskDrawer({ task, onClose }) {
  const [tab, setTab] = useState("details");
  useEffect(() => { setTab("details"); }, [task && task.id]);
  if (!task) return null;
  const t = task;
  return (
    <Drawer open={!!task} onClose={onClose}>
      <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.line}`, position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="rb-mono" style={{ fontSize: 15, fontWeight: 800 }}>{t.id}</span>
              <DeptTag id={t.dept} />
            </div>
            <div style={{ fontSize: 13, color: T.slate, marginTop: 2 }}>{t.type}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F4F9", borderRadius: 7, width: 28, height: 28, cursor: "pointer" }}><X size={14} /></button>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[{ id: "details", label: "Details", icon: ListChecks }, { id: "risk", label: "Asset Risk (ML)", icon: Brain }, { id: "priority", label: "Priority Engine", icon: Gauge }].map((x) => (
            <button key={x.id} onClick={() => setTab(x.id)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${tab === x.id ? T.blue : T.line}`, background: tab === x.id ? "#EAF1FE" : "#fff", color: tab === x.id ? T.blueDeep : T.slate,
            }}><x.icon size={12.5} /> {x.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {tab === "details" && (
          <div className="rb-anim-fadein">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <InfoTile label="Corridor" value={t.corridor} mono />
              <InfoTile label="Asset" value={t.asset} />
              <InfoTile label="Severity" value={<SeverityBadge level={t.severity} />} />
              <InfoTile label="Status" value={t.status} />
              <InfoTile label="Due date" value={t.due} />
              <InfoTile label="Duration" value={`${t.duration} hrs`} />
              <InfoTile label="Source system" value={t.source} mono />
              <InfoTile label="Criticality" value={`${t.criticality}/10`} />
            </div>
            <SectionLabel icon={Info}>Maintenance history</SectionLabel>
            <p style={{ fontSize: 12.5, color: T.slate, lineHeight: 1.6 }}>{t.risk.history}. Reported {t.risk.defects} open defect(s), {t.risk.overdueDays} day(s) overdue against schedule.</p>
          </div>
        )}

        {tab === "risk" && (
          <div className="rb-anim-fadein">
            <StepFlow steps={["Historical Asset Data", "Random Forest Model", "Failure Risk Prediction", "Asset Risk Score"]} active={4} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
              <InfoTile label="Asset age" value={`${t.risk.age} yrs`} />
              <InfoTile label="Previous failures" value={t.risk.prevFailures} />
              <InfoTile label="Open defects" value={t.risk.defects} />
              <InfoTile label="Overdue" value={`${t.risk.overdueDays} days`} />
              <InfoTile label="Usage intensity" value={t.risk.usage} />
              <InfoTile label="Model" value="Random Forest" mono />
            </div>
            <Card style={{ padding: 16, textAlign: "center", background: t.assetRisk > 70 ? T.redSoft : t.assetRisk > 45 ? T.amberSoft : T.greenSoft, border: "none", marginBottom: 16 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: T.slate, letterSpacing: 0.4 }}>PREDICTED FAILURE RISK</div>
              <div className="rb-mono" style={{ fontSize: 40, fontWeight: 800, color: t.assetRisk > 70 ? T.red : t.assetRisk > 45 ? T.amber : T.green, lineHeight: 1.1 }}>{t.assetRisk}%</div>
              <Badge bg="#fff" fg={t.assetRisk > 70 ? T.red : t.assetRisk > 45 ? T.amber : T.green}>{t.assetRisk > 70 ? "HIGH RISK" : t.assetRisk > 45 ? "MODERATE RISK" : "LOW RISK"}</Badge>
            </Card>
            <SectionLabel icon={GaugeCircle}>Why? Risk contributors</SectionLabel>
            {t.contributors.map((c) => <RiskBar key={c.label} label={c.label} v={c.v} />)}
            <p style={{ fontSize: 11, color: T.slateLight, marginTop: 10, lineHeight: 1.5 }}>Random Forest estimates failure likelihood from historical asset data. It does not schedule maintenance — that is the Priority Engine's role.</p>
          </div>
        )}

        {tab === "priority" && <PriorityTabContent t={t} />}
      </div>
    </Drawer>
  );
}

function InfoTile({ label, value, mono }) {
  return (
    <div style={{ border: `1px solid ${T.line}`, borderRadius: 8, padding: "8px 10px" }}>
      <div style={{ fontSize: 10, color: T.slateLight, fontWeight: 600 }}>{label}</div>
      <div className={mono ? "rb-mono" : ""} style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function PriorityTabContent({ t }) {
  const rows = [
    { label: "Criticality", v: t.criticality, max: 10 },
    { label: "Urgency", v: t.urgency, max: 10 },
    { label: "Asset Risk", v: Math.round(t.assetRisk / 10 * 10) / 10, max: 10 },
    { label: "Operational Impact", v: t.opImpact, max: 10 },
  ];
  return (
    <div className="rb-anim-fadein">
      <StepFlow steps={["Criticality + Urgency + Asset Risk + Operational Impact", "Priority Engine", "Priority Score"]} active={3} />
      <div style={{ margin: "16px 0" }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
            <span style={{ fontSize: 12, color: T.slate, width: 140, flexShrink: 0, fontWeight: 600 }}>{r.label}</span>
            <ProgressBar value={r.v} max={r.max} color={T.blue} />
            <span className="rb-mono" style={{ fontSize: 11.5, width: 46, textAlign: "right", fontWeight: 700 }}>{r.v}/{r.max}</span>
          </div>
        ))}
      </div>
      <Card style={{ padding: 16, textAlign: "center", background: PRIORITY_STYLE[t.priority].bg, border: "none", marginBottom: 14 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.slate, letterSpacing: 0.4 }}>PRIORITY SCORE</div>
        <div className="rb-mono" style={{ fontSize: 34, fontWeight: 800, color: PRIORITY_STYLE[t.priority].fg }}>{t.priorityScore}</div>
        <Badge bg="#fff" fg={PRIORITY_STYLE[t.priority].fg}>{t.priority}</Badge>
      </Card>
      <div style={{ display: "flex", gap: 8, padding: 12, background: "#F8FAFC", borderRadius: 8, border: `1px solid ${T.line}` }}>
        <Info size={15} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.6, margin: 0 }}>
          This task is prioritized because the asset is {t.criticality >= 8 ? "highly critical" : "moderately critical"}{t.risk.overdueDays > 0 ? ", overdue" : ""}, has {t.assetRisk > 60 ? "elevated" : "moderate"} predicted failure risk, and affects a {t.opImpact >= 7 ? "heavily used" : "moderately used"} corridor.
        </p>
      </div>
      <p style={{ fontSize: 11, color: T.slateLight, marginTop: 10 }}>Random Forest predicts risk. The Priority Engine combines it with criticality, urgency and operational impact to determine maintenance priority.</p>
    </div>
  );
}

/* ============================================================================
   PAGE: PREDICTIVE MAINTENANCE (standalone)
   Answers: "Which assets should we maintain soon?"
============================================================================ */
function MaintenanceHistoryTimeline({ assetId, prediction }) {
  const history = MAINTENANCE_HISTORY[assetId] || [];
  if (history.length === 0) return null;
  // Lay events out evenly and append the predicted window as a distinct future marker.
  const points = [...history.map((h) => ({ ...h, kind: "past" })), { date: `${prediction.windowStart}–${prediction.windowEnd}`, type: "Predicted maintenance", kind: "predicted" }];
  return (
    <div>
      <div style={{ position: "relative", height: 2, background: T.line, margin: "26px 8px 0" }}>
        {points.map((p, i) => {
          const left = (i / (points.length - 1)) * 100;
          const isPred = p.kind === "predicted";
          return (
            <div key={i} style={{ position: "absolute", left: `${left}%`, top: 0, transform: "translate(-50%,-50%)" }}>
              <div style={{
                width: isPred ? 13 : 10, height: isPred ? 13 : 10, borderRadius: 99,
                background: isPred ? "#fff" : T.blue,
                boxShadow: isPred ? `inset 0 0 0 2.5px ${T.amber}` : "none",
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: 14 }}>
        {points.map((p, i) => (
          <div key={i} style={{ flex: 1, textAlign: i === 0 ? "left" : i === points.length - 1 ? "right" : "center", padding: "0 3px" }}>
            <div className="rb-mono" style={{ fontSize: 9.5, fontWeight: 700, color: p.kind === "predicted" ? T.amber : T.ink }}>{p.date}</div>
            <div style={{ fontSize: 9.5, color: T.slateLight, marginTop: 3, lineHeight: 1.35 }}>{p.type}</div>
            {p.kind === "past" && (
              <div className="rb-mono" style={{ fontSize: 9, color: T.slateLight, marginTop: 2 }}>
                {p.durationHrs}h{p.defectsFound > 0 ? ` · ${p.defectsFound} defect${p.defectsFound > 1 ? "s" : ""}` : ""}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <LegendDot color={T.blue} label="Completed maintenance" icon={CircleDot} />
        <LegendDot color={T.amber} label="Predicted window" icon={Radar} />
      </div>
    </div>
  );
}

function PredictiveMaintenancePage({ onRegister, onViewAsset, registered }) {
  const [riskFilter, setRiskFilter] = useState("ALL");
  const pending = PREDICTIONS.filter((p) => !registered.includes(p.assetId));
  const rows = PREDICTIONS.filter((p) => riskFilter === "ALL" || p.risk === riskFilter);
  const highRisk = pending.filter((p) => p.risk === "High").length;
  const within7 = pending.filter((p) => p.daysAway <= 7).length;
  const avgInterval = Math.round(PREDICTIONS.reduce((a, p) => a + p.avgInterval, 0) / PREDICTIONS.length);

  return (
    <div>
      <PageHeader icon={Radar} title="Predictive Maintenance"
        sub="AI-powered asset maintenance predictions based on historical maintenance patterns."
      />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
        <KPICard icon={ListChecks} label="Assets Requiring Attention" value={pending.length} sub="Blocks not yet registered" tone="blue" demo />
        <KPICard icon={AlertTriangle} label="High Risk Assets" value={highRisk} sub="Register a block promptly" tone="red" demo />
        <KPICard icon={CalendarClock} label="Upcoming Maintenance" value={within7} sub="Predicted within 7 days" tone="amber" demo />
        <KPICard icon={TimerReset} label="Avg Predicted Interval" value={`${avgInterval} d`} sub="Across monitored assets" demo />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {["ALL", "High", "Medium", "Low"].map((r) => (
          <button key={r} onClick={() => setRiskFilter(r)} style={{
            border: `1px solid ${riskFilter === r ? T.blue : T.line}`, background: riskFilter === r ? "#EAF1FE" : "#fff",
            color: riskFilter === r ? T.blueDeep : T.slate, borderRadius: 8, padding: "7px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>{r === "ALL" ? "All risk levels" : `${r} risk`}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: T.slateLight }}>Predicted from historical maintenance records · demo data</span>
      </div>

      <Card style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: T.canvas, textAlign: "left" }}>
              {["Asset", "Department", "Last Maintenance", "Predicted Window", "Risk", "Confidence", "Action"].map((h) => (
                <th key={h} style={{ padding: "13px 18px", fontSize: 10, fontWeight: 700, color: T.slateLight, letterSpacing: 0.3, borderBottom: `1px solid ${T.line}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const isRegistered = registered.includes(p.assetId);
              return (
                <tr key={p.assetId} onClick={() => onViewAsset(p)} style={{ cursor: "pointer", borderBottom: `1px solid ${T.line}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "15px 18px" }}>
                    <div className="rb-mono" style={{ fontWeight: 800, color: T.ink, fontSize: 12.5 }}>{p.assetId}</div>
                    <div style={{ color: T.slate, fontSize: 11.5, marginTop: 2 }}>{p.assetName}</div>
                    <div style={{ color: T.slateLight, fontSize: 10.5, marginTop: 2 }}>{p.assetType} · {p.corridor}</div>
                  </td>
                  <td style={{ padding: "15px 18px" }}><DeptTag id={p.dept} /></td>
                  <td style={{ padding: "15px 18px", color: T.slate }}>
                    {p.lastMaintenance} 2026
                    <div className="rb-mono" style={{ fontSize: 10.5, color: T.slateLight, marginTop: 2 }}>{p.avgInterval}-day cycle</div>
                  </td>
                  <td className="rb-mono" style={{ padding: "15px 18px", fontWeight: 700, color: T.ink }}>
                    {p.windowStart}–{p.windowEnd}
                    <div style={{ fontSize: 10.5, color: T.slateLight, fontWeight: 400, marginTop: 2 }}>in {p.daysAway} days</div>
                  </td>
                  <td style={{ padding: "15px 18px" }}><RiskBadge level={p.risk} /></td>
                  <td style={{ padding: "15px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 40 }}><ProgressBar value={p.confidence} color={T.slate} height={5} /></div>
                      <span className="rb-mono" style={{ fontSize: 11, fontWeight: 700 }}>{p.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "15px 18px" }} onClick={(e) => e.stopPropagation()}>
                    {isRegistered ? (
                      <Badge bg={T.greenSoft} fg={T.green}><CheckCircle2 size={10} /> Block registered</Badge>
                    ) : p.risk === "High" ? (
                      <PrimaryBtn icon={CalendarPlus} onClick={() => onRegister(p)}>Register Block</PrimaryBtn>
                    ) : (
                      <GhostBtn icon={SquareArrowOutUpRight} onClick={() => onViewAsset(p)}>View Prediction</GhostBtn>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card style={{ padding: 22, marginTop: 24 }}>
        <SectionLabel icon={Workflow}>How this feeds the block planner</SectionLabel>
        <StepFlow orientation="horizontal" steps={["Historical asset data", "Predictive analysis", "Block registered", "Weather-aware window", "CP-SAT optimization"]} active={2} />
        <p style={{ fontSize: 11.5, color: T.slateLight, marginTop: 16, marginBottom: 0, lineHeight: 1.6 }}>
          Predictions identify candidates for maintenance. They do not schedule work — a planner registers the block, and the optimizer decides where it can actually be placed within train, corridor and safety constraints.
        </p>
      </Card>
    </div>
  );
}

/* ---- Asset detail drawer for the predictive page ---- */
function AssetPredictionDrawer({ prediction, onClose, onRegister, registered }) {
  if (!prediction) return null;
  const p = prediction;
  const history = MAINTENANCE_HISTORY[p.assetId] || [];
  const isRegistered = registered.includes(p.assetId);
  const avgDefects = history.length ? (history.reduce((a, h) => a + h.defectsFound, 0) / history.length).toFixed(1) : "0";

  return (
    <Drawer open={!!prediction} onClose={onClose} width={620}>
      <div style={{ padding: "22px 26px", borderBottom: `1px solid ${T.line}`, position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
              <RiskBadge level={p.risk} />
              <DeptTag id={p.dept} />
            </div>
            <div className="rb-mono" style={{ fontSize: 18, fontWeight: 800 }}>{p.assetId}</div>
            <div style={{ fontSize: 12.5, color: T.slate, marginTop: 3 }}>{p.assetName} · {p.assetType} · {p.corridor}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F4F9", borderRadius: 7, width: 30, height: 30, cursor: "pointer", flexShrink: 0 }}><X size={14} /></button>
        </div>
      </div>

      <div style={{ padding: 26 }}>
        <div style={{ background: T.canvas, borderRadius: 10, padding: "18px 20px", marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.slateLight, marginBottom: 7 }}>PREDICTED MAINTENANCE WINDOW</div>
          <div className="rb-mono" style={{ fontSize: 21, fontWeight: 800, color: T.ink, marginBottom: 10 }}>{p.windowStart} – {p.windowEnd} 2026</div>
          <ConfidenceMeter value={p.confidence} />
        </div>

        <SectionLabel icon={Database}>Asset information</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          <InfoTile label="Last maintenance" value={`${p.lastMaintenance} 2026`} />
          <InfoTile label="Average interval" value={`${p.avgInterval} days`} />
          <InfoTile label="Maintenance events" value={p.eventCount} />
          <InfoTile label="Average duration" value={`${p.avgDuration} hrs`} />
          <InfoTile label="Defects since service" value={p.defects} />
          <InfoTile label="Avg defects per cycle" value={avgDefects} />
          <InfoTile label="Criticality" value={p.criticality} />
          <InfoTile label="Risk level" value={p.risk} />
        </div>

        <SectionLabel icon={History}>Maintenance history &amp; prediction</SectionLabel>
        <div style={{ marginBottom: 28 }}>
          <MaintenanceHistoryTimeline assetId={p.assetId} prediction={p} />
        </div>

        <SectionLabel icon={Lightbulb}>Why is this recommended?</SectionLabel>
        <div style={{ display: "flex", gap: 10, background: "#F8FAFC", borderRadius: 9, padding: "14px 16px", marginBottom: 18 }}>
          <Info size={15} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12.5, color: T.ink, margin: 0, lineHeight: 1.65 }}>
            This asset is approaching its historical maintenance interval of {p.avgInterval} days
            {p.defects > 0 ? `, and ${p.defects} defect${p.defects > 1 ? "s have" : " has"} been reported since the last service` : ""}
            {p.criticality === "High" ? ". It also sits on a high-criticality section, so deferring work carries greater operational consequence" : ""}.
          </p>
        </div>
        <div style={{ marginBottom: 28 }}>
          {p.drivers.map((d) => (
            <div key={d.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{d.label}</span>
                <span className="rb-mono" style={{ fontSize: 10.5, color: T.slateLight }}>{Math.round(d.v * 100)}</span>
              </div>
              <ProgressBar value={d.v * 100} color={d.v > 0.7 ? T.red : d.v > 0.4 ? T.amber : T.green} height={5} />
              <div style={{ fontSize: 11, color: T.slateLight, marginTop: 5 }}>{d.detail}</div>
            </div>
          ))}
        </div>

        {isRegistered ? (
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: T.greenSoft, borderRadius: 8, padding: "12px 15px" }}>
            <CheckCircle2 size={15} color={T.green} />
            <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>A maintenance block has been registered for this asset.</span>
          </div>
        ) : (
          <PrimaryBtn icon={CalendarPlus} onClick={() => onRegister(p)} full>Register Maintenance Block</PrimaryBtn>
        )}

        <p style={{ fontSize: 10.5, color: T.slateLight, marginTop: 14, lineHeight: 1.55 }}>
          Predicted from historical maintenance patterns. This is a recommendation for planner review, not an automatic work order.
        </p>
      </div>
    </Drawer>
  );
}


/* ============================================================================
   PAGE: WEATHER IMPACT PREDICTION (standalone)
   Answers: "Which upcoming days/windows are better or worse for maintenance?"
   Converts forecast conditions into maintenance impact — not a weather widget.
============================================================================ */
const WX_STEPS = ["Fetching forecast", "Scoring conditions", "Estimating duration impact", "Ranking windows", "Analysis ready"];
const WX_CAPTIONS = [
  "Retrieving the 15-day outlook for the selected corridor.",
  "Converting precipitation, temperature and wind into weather risk.",
  "Estimating how each day would extend the planned activity.",
  "Ranking candidate windows by suitability.",
  "Weather impact analysis complete.",
];

function WeatherDayCard({ d, selected, onClick }) {
  const rs = RISK_STYLE[d.risk];
  return (
    <div
      onClick={onClick}
      className="rb-anim-fadeup"
      style={{
        minWidth: 92, flex: "0 0 92px", padding: "12px 10px", borderRadius: 10, cursor: "pointer",
        background: selected ? "#EAF1FE" : T.canvas,
        boxShadow: selected ? `inset 0 0 0 1.5px ${T.blue}` : "none",
        textAlign: "center", transition: "background .2s",
      }}
    >
      <div className="rb-mono" style={{ fontSize: 10, color: T.slateLight, fontWeight: 600 }}>{d.dow}</div>
      <div className="rb-mono" style={{ fontSize: 11.5, fontWeight: 800, color: T.ink, marginBottom: 8 }}>{d.date}</div>
      <WeatherIcon kind={d.icon} size={19} color={rs.fg} />
      <div className="rb-mono" style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 8 }}>{d.tempC}°</div>
      <div className="rb-mono" style={{ fontSize: 10, color: T.slate, marginTop: 2 }}>{d.precip}%</div>
      <div style={{ marginTop: 8 }}>
        <span style={{ display: "inline-block", width: "100%", fontSize: 9.5, fontWeight: 700, color: rs.fg, background: rs.bg, borderRadius: 4, padding: "3px 0" }}>{d.risk}</span>
      </div>
      <div className="rb-mono" style={{ fontSize: 9.5, color: d.extraMin > 0 ? T.amber : T.green, marginTop: 6, fontWeight: 600 }}>
        {d.extraMin > 0 ? `+${d.extraMin}m` : "on time"}
      </div>
    </div>
  );
}

function WeatherImpactPage({ onUseWindow, appliedWindow }) {
  const [corridor, setCorridor] = useState("C-12");
  const [dept, setDept] = useState("ENG");
  const [asset, setAsset] = useState("T-102");
  const [maintType, setMaintType] = useState("Track Inspection");
  const [baseHours, setBaseHours] = useState(3);
  const { running, active, done, run } = useStepRunner(WX_STEPS, 620);
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => { if (done) setAnalyzed(true); }, [done]);

  // Recomputed whenever the duration input changes, so impact numbers always
  // reflect the activity the planner actually specified.
  const days = useMemo(() => FORECAST_15.map((d) => deriveImpact(d, baseHours)), [baseHours]);
  const best = useMemo(() => [...days].sort((a, b) => a.extraMin - b.extraMin || a.precip - b.precip)[0], [days]);
  const selected = days.find((d) => d.date === selectedDate) || null;
  const baseMin = baseHours * 60;

  // Three candidate windows for comparison: worst, best, and a middling day.
  const candidates = useMemo(() => {
    const worst = [...days].sort((a, b) => b.extraMin - a.extraMin)[0];
    const mid = [...days].sort((a, b) => Math.abs(a.precip - 38) - Math.abs(b.precip - 38))[0];
    const picks = [worst, best, mid].filter((d, i, arr) => arr.findIndex((x) => x.date === d.date) === i);
    return picks.map((d, i) => ({ ...d, time: i === 2 ? "14:00–17:00" : "09:00–12:00" }));
  }, [days, best]);

  const riskTrend = days.map((d) => ({ date: d.date.replace(" Sep", ""), risk: d.risk === "High" ? 3 : d.risk === "Medium" ? 2 : 1, precip: d.precip, extra: d.extraMin }));

  return (
    <div>
      <PageHeader icon={CloudSun} title="Weather Impact Prediction"
        sub="Analyze upcoming weather conditions to identify maintenance windows with lower weather-related risk."
      />

      <Card style={{ padding: 22, marginBottom: 28 }}>
        <SectionLabel icon={Filter}>Analysis parameters</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, alignItems: "end" }}>
          <WxField label="Corridor">
            <select value={corridor} onChange={(e) => setCorridor(e.target.value)} style={wxSelect}>
              {CORRIDORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </WxField>
          <WxField label="Department">
            <select value={dept} onChange={(e) => setDept(e.target.value)} style={wxSelect}>
              {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </WxField>
          <WxField label="Asset">
            <select value={asset} onChange={(e) => setAsset(e.target.value)} style={wxSelect}>
              {PREDICTIONS.map((p) => <option key={p.assetId} value={p.assetId}>{p.assetId}</option>)}
            </select>
          </WxField>
          <WxField label="Maintenance type">
            <select value={maintType} onChange={(e) => setMaintType(e.target.value)} style={wxSelect}>
              {["Track Inspection", "Rail Grinding", "Signal Inspection", "OHE Maintenance", "Girder Inspection"].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </WxField>
          <WxField label={`Required duration: ${baseHours} hrs`}>
            <input type="range" min={1} max={8} value={baseHours} onChange={(e) => setBaseHours(+e.target.value)} style={{ width: "100%", marginBottom: 6 }} />
          </WxField>
        </div>
        <div style={{ marginTop: 20 }}>
          <PrimaryBtn icon={running ? RefreshCw : Radar} onClick={run} disabled={running}>
            {running ? "Analyzing weather patterns…" : analyzed ? "Re-run Weather Analysis" : "Predict Weather Impact"}
          </PrimaryBtn>
        </div>
      </Card>

      {running && (
        <Card className="rb-anim-fadeup" style={{ padding: "26px 32px", marginBottom: 28, background: T.navy, border: "none" }}>
          <PipelineTracker steps={WX_STEPS} active={active} caption={WX_CAPTIONS[Math.min(active, WX_CAPTIONS.length - 1)]} tone="dark" />
        </Card>
      )}

      {!analyzed && !running && (
        <Card style={{ padding: "56px 24px", textAlign: "center" }}>
          <CloudSun size={26} color={T.slateLight} />
          <p style={{ fontSize: 13, color: T.slate, margin: "12px auto 0", maxWidth: 440, lineHeight: 1.6 }}>
            Set your parameters above and run the analysis to see a 15-day maintenance weather outlook, expected duration impact, and the most suitable window.
          </p>
        </Card>
      )}

      {analyzed && (
        <div className="rb-anim-fadeup">
          <Card style={{ padding: 22, marginBottom: 28 }}>
            <SectionLabel icon={CalendarRange} right={<span style={{ fontSize: 11, color: T.slateLight }}>{maintType} · {asset} · {corridor} · {baseHours} hrs</span>}>
              15-Day Maintenance Weather Outlook
            </SectionLabel>
            <div className="rb-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
              {days.map((d) => (
                <WeatherDayCard key={d.date} d={d} selected={selectedDate === d.date} onClick={() => setSelectedDate(d.date === selectedDate ? null : d.date)} />
              ))}
            </div>
            <p style={{ fontSize: 11, color: T.slateLight, marginTop: 14, marginBottom: 0 }}>Select any day to see how weather would affect the planned activity.</p>
          </Card>

          {selected && (
            <Card className="rb-anim-fadeup" style={{ padding: 24, marginBottom: 28 }}>
              <SectionLabel icon={Workflow}>Maintenance impact analysis — {selected.date}</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, alignItems: "stretch" }}>
                <WxStage label="Weather condition" icon={<WeatherIcon kind={selected.icon} size={17} color={RISK_STYLE[selected.risk].fg} />}
                  value={selected.condition} sub={`${selected.precip}% precipitation · ${selected.tempC}°C · ${selected.windKph} km/h wind`} />
                <WxStage label="Expected impact" icon={<Activity size={16} color={T.slate} />}
                  value={selected.impactLabel} sub="On worker efficiency and activity progress" />
                <WxStage label="Estimated duration" icon={<Hourglass size={16} color={T.slate} />}
                  value={<span className="rb-mono">{fmtDuration(baseMin)} → {fmtDuration(baseMin + selected.extraMin)}</span>}
                  sub={selected.extraMin > 0 ? `+${selected.extraMin} minutes expected` : "No weather-related delay expected"} />
                <WxStage label="Maintenance suitability" icon={<ShieldCheck size={16} color={SUITABILITY_STYLE[selected.suitability].fg} />}
                  value={<Badge bg={SUITABILITY_STYLE[selected.suitability].bg} fg={SUITABILITY_STYLE[selected.suitability].fg} size="md">{selected.suitability}</Badge>}
                  sub={selected.recommendation} last />
              </div>
            </Card>
          )}

          <Card style={{ padding: 24, marginBottom: 28 }}>
            <SectionLabel icon={Sparkles} right={<Badge bg="#EEF1F6" fg={T.slate}>PLANNING PREFERENCE</Badge>}>AI Recommended Window</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24, alignItems: "center" }}>
              <div style={{ background: T.greenSoft, borderRadius: 10, padding: "20px 22px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 8 }}>MOST SUITABLE WINDOW</div>
                <div className="rb-mono" style={{ fontSize: 22, fontWeight: 800, color: T.ink, lineHeight: 1.2 }}>{best.date} 2026</div>
                <div className="rb-mono" style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginTop: 2 }}>09:00 – 12:00</div>
                <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                  <Badge bg="#fff" fg={T.green}>{best.condition}</Badge>
                  <Badge bg="#fff" fg={T.slate}>{best.precip}% precipitation</Badge>
                  <Badge bg="#fff" fg={SUITABILITY_STYLE[best.suitability].fg}>{best.suitability}</Badge>
                </div>
              </div>
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <InfoTile label="Expected weather impact" value={best.impactLabel} />
                  <InfoTile label="Weather-adjusted duration" value={fmtDuration(baseMin + best.extraMin)} mono />
                </div>
                <p style={{ fontSize: 12, color: T.slate, lineHeight: 1.65, margin: "0 0 16px" }}>
                  Clear weather and low precipitation probability make this window more suitable for the planned maintenance activity and reduce the likelihood of weather-related delays.
                </p>
                {appliedWindow === best.date ? (
                  <div className="rb-anim-fadeup" style={{ display: "flex", alignItems: "center", gap: 9, background: T.greenSoft, borderRadius: 8, padding: "11px 14px" }}>
                    <CheckCircle2 size={15} color={T.green} />
                    <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>Sent to the block planner as a preferred window.</span>
                  </div>
                ) : (
                  <PrimaryBtn icon={ThumbsUp} onClick={() => onUseWindow({ window: best.date, time: "09:00–12:00", asset })} full>Use Recommended Window</PrimaryBtn>
                )}
              </div>
            </div>
            <p style={{ fontSize: 10.5, color: T.slateLight, marginTop: 18, marginBottom: 0, lineHeight: 1.55 }}>
              Weather is an additional planning preference. Train movements, corridor availability, safety constraints, maintenance duration, department compatibility and existing blocks are all still enforced by the optimizer and are never overridden.
            </p>
          </Card>

          <Card style={{ padding: 24, marginBottom: 28 }}>
            <SectionLabel icon={ArrowLeftRight}>Compare Maintenance Windows</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {candidates.map((c) => {
                const isBest = c.date === best.date;
                return (
                  <div key={c.date} style={{
                    borderRadius: 10, padding: 18,
                    background: isBest ? T.greenSoft : T.canvas,
                    boxShadow: isBest ? `inset 0 0 0 1.5px ${T.green}66` : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <div className="rb-mono" style={{ fontSize: 13, fontWeight: 800, color: T.ink }}>{c.date}</div>
                        <div className="rb-mono" style={{ fontSize: 11.5, color: T.slate, marginTop: 2 }}>{c.time}</div>
                      </div>
                      <WeatherIcon kind={c.icon} size={20} color={RISK_STYLE[c.risk].fg} />
                    </div>
                    {isBest && <div style={{ marginBottom: 12 }}><Badge bg="#fff" fg={T.green}><CheckCircle2 size={10} /> AI RECOMMENDED</Badge></div>}
                    <WxCompareRow label="Weather risk" value={<Badge bg={RISK_STYLE[c.risk].bg} fg={RISK_STYLE[c.risk].fg}>{c.risk}</Badge>} />
                    <WxCompareRow label="Expected duration" value={<span className="rb-mono" style={{ fontWeight: 700, fontSize: 12 }}>{fmtDuration(baseMin + c.extraMin)}</span>} />
                    <WxCompareRow label="Delay vs plan" value={<span className="rb-mono" style={{ fontWeight: 700, fontSize: 12, color: c.extraMin > 0 ? T.amber : T.green }}>{c.extraMin > 0 ? `+${c.extraMin} min` : "none"}</span>} />
                    <WxCompareRow label="Suitability" value={<Badge bg={SUITABILITY_STYLE[c.suitability].bg} fg={SUITABILITY_STYLE[c.suitability].fg}>{c.suitability}</Badge>} last />
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            <Card style={{ padding: 24 }}>
              <SectionLabel icon={TrendingUp}>Weather Risk Trend</SectionLabel>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={riskTrend}>
                  <defs><linearGradient id="wxrisk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.amber} stopOpacity={0.35} /><stop offset="100%" stopColor={T.amber} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.slate }} axisLine={{ stroke: T.line }} tickLine={false} />
                  <YAxis domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={(v) => ({ 1: "Low", 2: "Med", 3: "High" }[v] || "")} tick={{ fontSize: 10, fill: T.slate }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => ({ 1: "Low", 2: "Medium", 3: "High" }[v] || v)} />
                  <Area type="stepAfter" dataKey="risk" stroke={T.amber} fill="url(#wxrisk)" strokeWidth={2.2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card style={{ padding: 24 }}>
              <SectionLabel icon={Droplets}>Precipitation Probability</SectionLabel>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={riskTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.slate }} axisLine={{ stroke: T.line }} tickLine={false} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: T.slate }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="precip" name="Precipitation" radius={[4, 4, 0, 0]}>
                    {riskTrend.map((d, i) => <Cell key={i} fill={d.precip >= 65 ? T.red : d.precip >= 28 ? T.amber : T.blue} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card style={{ padding: 24 }}>
            <SectionLabel icon={Hourglass} right={<span style={{ fontSize: 11, color: T.slateLight }}>Normal duration: {baseHours} hrs</span>}>
              Expected Maintenance Duration by Condition
            </SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {WEATHER_DURATION_EXAMPLE.map((w) => {
                const sample = days.find((d) => d.condition === w.condition) || deriveImpact({ ...FORECAST_15[0], condition: w.condition, precip: 50, windKph: 15 }, baseHours);
                const rs = RISK_STYLE[sample.risk];
                return (
                  <div key={w.condition} style={{ background: T.canvas, borderRadius: 10, padding: 18 }}>
                    <WeatherIcon kind={w.icon} size={19} color={rs.fg} />
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, marginTop: 10 }}>{w.condition}</div>
                    <div className="rb-mono" style={{ fontSize: 17, fontWeight: 800, color: T.ink, marginTop: 8 }}>{fmtDuration(baseMin + sample.extraMin)}</div>
                    <div className="rb-mono" style={{ fontSize: 10.5, color: sample.extraMin > 0 ? T.amber : T.green, marginTop: 4, fontWeight: 600 }}>
                      {sample.extraMin > 0 ? `+${sample.extraMin} min vs plan` : "no delay"}
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <ProgressBar value={sample.extraMin} max={baseMin * 0.5} color={rs.fg} height={5} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 10.5, color: T.slateLight, marginTop: 18, marginBottom: 0, lineHeight: 1.55 }}>
              Duration impact scales with the planned activity length, so longer activities absorb proportionally more weather delay. Estimates are illustrative demo values.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

const wxSelect = { width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${T.line}`, fontSize: 12.5, background: "#fff", color: T.ink };
function WxField({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 10.5, fontWeight: 700, color: T.slate, display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
function WxStage({ label, icon, value, sub, last }) {
  return (
    <div style={{ padding: "0 18px", borderRight: last ? "none" : `1px solid ${T.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 700, color: T.slateLight }}>{label.toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 11, color: T.slateLight, lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}
function WxCompareRow({ label, value, last }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: last ? "none" : `1px solid ${T.line}88` }}>
      <span style={{ fontSize: 11.5, color: T.slate }}>{label}</span>
      {value}
    </div>
  );
}

/* ============================================================================
   PAGE: MONTHLY PLANNER
============================================================================ */
const GEN_STEPS = ["Maintenance data", "Operational constraints", "Priority analysis", "Optimization", "Feasible plan"];
const GEN_CAPTIONS = [
  "Gathering pending maintenance requirements from TMS, SMMS and TDMS.",
  "Reading train timetables and current corridor availability.",
  "Scoring tasks by criticality, urgency and predicted asset risk.",
  "Searching for a feasible block schedule with CP-SAT.",
  "Monthly plan ready for review.",
];

function useStepRunner(steps, delay = 650) {
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);
  const run = () => {
    setDone(false); setRunning(true); setActive(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i >= steps.length) { clearInterval(iv); setRunning(false); setDone(true); setActive(steps.length); }
      else setActive(i);
    }, delay);
  };
  return { running, active, done, run };
}

// A calm, connected progress tracker — used for plan generation, refinement and
// re-optimization sequences. Deliberately understated: one filling line, numbered
// stages, a single caption describing what's happening right now.
function PipelineTracker({ steps, active, caption, tone = "light" }) {
  const dark = tone === "dark";
  const pct = Math.max(0, Math.min(100, (active / steps.length) * 100));
  return (
    <div>
      <div style={{ position: "relative", height: 3, borderRadius: 99, background: dark ? "rgba(255,255,255,.09)" : "#E7EBF1", marginBottom: 20 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, borderRadius: 99, background: dark ? "#3E7BFA" : T.blue, transition: "width .55s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
        {steps.map((s, i) => {
          const state = i < active ? "done" : i === active ? "active" : "pending";
          const labelColor = dark ? (state === "pending" ? "#5B6B85" : "#E7ECF7") : (state === "pending" ? T.slateLight : T.ink);
          return (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flex: 1, transition: "opacity .4s", opacity: state === "pending" ? 0.55 : 1 }}>
              <div className={state === "active" ? "rb-anim-pulse-soft" : ""} style={{
                width: 22, height: 22, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: state === "done" ? (dark ? "rgba(62,220,145,.18)" : T.greenSoft) : state === "active" ? (dark ? "rgba(62,124,250,.22)" : "#EAF1FE") : (dark ? "rgba(255,255,255,.06)" : "#F1F4F9"),
                transition: "background .4s",
              }}>
                {state === "done" ? <CheckCircle2 size={12} color={dark ? "#3EDC91" : T.green} /> : <span className="rb-mono" style={{ fontSize: 10, fontWeight: 700, color: labelColor }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 11, fontWeight: state === "active" ? 700 : 500, color: labelColor, textAlign: "center", lineHeight: 1.3 }}>{s}</span>
            </div>
          );
        })}
      </div>
      {caption && (
        <p key={active} className="rb-anim-fadein" style={{ fontSize: 11.5, color: dark ? "#9FADC9" : T.slateLight, textAlign: "center", marginTop: 16, marginBottom: 0 }}>{caption}</p>
      )}
    </div>
  );
}

function MonthlyGantt({ blocks, onBlockClick, days = 30 }) {
  const dayArr = Array.from({ length: days }, (_, i) => i + 1);
  return (
    <div className="rb-scrollbar" style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 900 }}>
        <div style={{ display: "grid", gridTemplateColumns: `90px repeat(${days}, minmax(28px,1fr))`, borderBottom: `1px solid ${T.line}` }}>
          <div />
          {dayArr.map((d) => (
            <div key={d} className="rb-mono" style={{ textAlign: "center", fontSize: 9.5, color: (d === 6 || d === 7 || d === 13 || d === 14 || d === 20 || d === 21 || d === 27 || d === 28) ? T.slateLight : T.slate, fontWeight: 600, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        {CORRIDORS.map((c) => (
          <div key={c} style={{ display: "grid", gridTemplateColumns: `90px repeat(${days}, minmax(28px,1fr))`, borderBottom: `1px solid ${T.line}`, alignItems: "center", minHeight: 40 }}>
            <div className="rb-mono" style={{ fontSize: 11.5, fontWeight: 700, color: T.ink, paddingLeft: 4 }}>{c}</div>
            <div style={{ gridColumn: `2 / span ${days}`, position: "relative", height: 26 }}>
              {blocks.filter((b) => b.corridor === c).map((b) => (
                <div
                  key={b.id}
                  onClick={() => onBlockClick(b)}
                  className="rb-anim-fadeup"
                  title={`${b.id} · ${b.tasks.map((t) => t.type).join(", ")}`}
                  style={{
                    position: "absolute", left: `${((b.startDay - 1) / days) * 100}%`, width: `${(b.span / days) * 100}%`,
                    top: 2, height: 22, borderRadius: 5, cursor: "pointer",
                    background: b.priority === "VERY HIGH" ? T.red : b.priority === "HIGH" ? T.amber : T.blue,
                    opacity: b.status === "completed" ? 0.45 : b.status === "rejected" ? 0.3 : 1,
                    display: "flex", alignItems: "center", gap: 4, padding: "0 6px", overflow: "hidden", minWidth: 20,
                    boxShadow: "0 1px 2px rgba(0,0,0,.1)",
                  }}
                >
                  {b.status === "approved" && <CheckCircle2 size={9} color="#fff" style={{ flexShrink: 0 }} />}
                  <span className="rb-mono" style={{ color: "#fff", fontSize: 9.5, fontWeight: 700, whiteSpace: "nowrap" }}>{b.id}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyPlannerPage({ blocks, onOpenBlock }) {
  const { running, active, done, run } = useStepRunner(GEN_STEPS, 700);
  const [generated, setGenerated] = useState(false);
  useEffect(() => { if (done) setGenerated(true); }, [done]);

  return (
    <div>
      <PageHeader icon={CalendarRange} title="Monthly Planner"
        sub="Strategic ~30-day horizon. Generates a plan from pending maintenance requirements, train timetables and corridor availability."
        right={<PrimaryBtn icon={running ? RefreshCw : Sparkles} onClick={run} disabled={running}>{running ? "Generating…" : "Generate Monthly Plan"}</PrimaryBtn>}
      />

      {running && (
        <Card className="rb-anim-fadeup" style={{ padding: "26px 32px", marginBottom: 28, background: T.navy, border: "none" }}>
          <PipelineTracker steps={GEN_STEPS} active={active} caption={GEN_CAPTIONS[Math.min(active, GEN_CAPTIONS.length - 1)]} tone="dark" />
        </Card>
      )}

      <Card style={{ padding: "22px 24px", marginBottom: 28 }}>
        <SectionLabel icon={CalendarRange} right={<span className="rb-mono" style={{ fontSize: 11, color: T.slateLight }}>SEPTEMBER 2026</span>}>
          30-day corridor timeline
        </SectionLabel>
        {generated ? (
          <MonthlyGantt blocks={blocks} onBlockClick={onOpenBlock} />
        ) : (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <CalendarRange size={24} color={T.slateLight} style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 12.5, color: T.slateLight, margin: 0 }}>No monthly plan generated yet. Click <b>Generate Monthly Plan</b> to run the pipeline.</p>
          </div>
        )}
      </Card>

      {generated && (
        <div className="rb-anim-fadeup" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <KPICard icon={Boxes} label="Blocks planned" value={blocks.length} sub="Across 4 corridors" />
          <KPICard icon={Clock} label="Total block hours" value="17 hrs" sub="This month" demo />
          <KPICard icon={Combine} label="Coordinated blocks" value="2" sub="Multi-department" tone="blue" demo />
          <KPICard icon={Train} label="Trains affected" value="3" sub="Non-critical windows" tone="green" demo />
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   PAGE: WEEKLY PLANNER
============================================================================ */
const REFINE_STEPS = ["Monthly plan", "Operational updates", "Refinement", "Weekly plan"];
const REFINE_CAPTIONS = [
  "Loading the current monthly plan as a baseline.",
  "Pulling newer maintenance reports and timetable changes.",
  "Re-checking feasibility and re-sequencing where needed.",
  "Weekly plan refined and ready.",
];
const WEEK_DAYS = ["Mon 7", "Tue 8", "Wed 9", "Thu 10", "Fri 11", "Sat 12", "Sun 13"];

function WeeklyPlannerPage({ blocks, onOpenBlock, onRefine }) {
  const { running, active, done, run } = useStepRunner(REFINE_STEPS, 700);
  const [refined, setRefined] = useState(false);
  useEffect(() => { if (done) { setRefined(true); onRefine(); } }, [done]);
  const weekBlocks = blocks.filter((b) => b.startDay <= 13 && b.status !== "rejected");

  return (
    <div>
      <PageHeader icon={CalendarDays} title="Weekly Planner" sub="Refines the monthly plan using newer maintenance and operational information for the next 7 days."
        right={<PrimaryBtn icon={RefreshCw} onClick={run} disabled={running}>{running ? "Refining…" : "Refine from Monthly Plan"}</PrimaryBtn>}
      />

      {running ? (
        <Card className="rb-anim-fadeup" style={{ padding: "26px 32px", marginBottom: 28, background: T.navy, border: "none" }}>
          <PipelineTracker steps={REFINE_STEPS} active={active} caption={REFINE_CAPTIONS[Math.min(active, REFINE_CAPTIONS.length - 1)]} tone="dark" />
        </Card>
      ) : (
        <Card style={{ padding: "18px 24px", marginBottom: 28 }}>
          <StepFlow orientation="horizontal" steps={REFINE_STEPS} active={refined ? 4 : 1} />
        </Card>
      )}

      <Card style={{ padding: "22px 24px", marginBottom: 28 }}>
        <SectionLabel icon={CalendarDays} right={<span className="rb-mono" style={{ fontSize: 11, color: T.slateLight }}>7–13 SEP 2026</span>}>Weekly schedule</SectionLabel>
        <div className="rb-scrollbar" style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 760 }}>
            <div style={{ display: "grid", gridTemplateColumns: `90px repeat(7,1fr)`, borderBottom: `1px solid ${T.line}` }}>
              <div />
              {WEEK_DAYS.map((d) => <div key={d} className="rb-mono" style={{ textAlign: "center", fontSize: 10.5, color: T.slate, fontWeight: 700, padding: "8px 0" }}>{d}</div>)}
            </div>
            {CORRIDORS.map((c) => (
              <div key={c} style={{ display: "grid", gridTemplateColumns: `90px repeat(7,1fr)`, borderBottom: `1px solid ${T.line}`, minHeight: 52, alignItems: "center" }}>
                <div className="rb-mono" style={{ fontSize: 11.5, fontWeight: 700, paddingLeft: 4 }}>{c}</div>
                {WEEK_DAYS.map((_, di) => {
                  const day = di + 7;
                  const b = weekBlocks.find((x) => x.corridor === c && day >= x.startDay && day < x.startDay + x.span);
                  return (
                    <div key={di} style={{ padding: "5px 5px" }}>
                      {b && day === b.startDay && (
                        <div onClick={() => onOpenBlock(b)} className="rb-anim-fadeup" style={{ background: b.priority === "VERY HIGH" ? T.redSoft : b.priority === "HIGH" ? T.amberSoft : "#EAF1FE", borderRadius: 6, padding: "6px 8px", cursor: "pointer" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {b.status === "approved" && <CheckCircle2 size={9} color={T.green} />}
                            <span className="rb-mono" style={{ fontSize: 10, fontWeight: 800, color: b.priority === "VERY HIGH" ? T.red : b.priority === "HIGH" ? T.amber : T.blueDeep }}>{b.id}</span>
                          </div>
                          <div style={{ fontSize: 9.5, color: T.slate, marginTop: 1 }}>{b.window}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {refined && (
        <Card className="rb-anim-fadeup" style={{ padding: 22 }}>
          <SectionLabel icon={GitMerge}>What changed in this refinement</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {[
              { icon: ArrowLeftRight, label: "2 blocks moved", detail: "BLK-202, BLK-204 shifted to avoid a newly reported conflict" },
              { icon: TrendingUp, label: "1 task reprioritized", detail: "SIG-203 raised after a new defect report" },
              { icon: Combine, label: "1 activity combined", detail: "Engineering + S&T merged into a shared block window" },
              { icon: ShieldCheck, label: "3 train conflicts avoided", detail: "Re-sequenced around updated timetable" },
            ].map((x) => (
              <div key={x.label} style={{ padding: "4px 2px" }}>
                <x.icon size={16} color={T.blue} />
                <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 8 }}>{x.label}</div>
                <div style={{ fontSize: 11, color: T.slateLight, marginTop: 3, lineHeight: 1.5 }}>{x.detail}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================================================================
   PAGE: BLOCK PLANS — lifecycle: recommended → approved → completed
============================================================================ */
const BLOCK_STATUS_META = {
  recommended: { label: "Recommended", color: T.amber, bg: T.amberSoft, icon: Hourglass, desc: "Awaiting planner decision" },
  approved: { label: "Approved", color: T.green, bg: T.greenSoft, icon: CheckCircle2, desc: "Confirmed by planner" },
  completed: { label: "Completed", color: T.slate, bg: "#EEF0F4", icon: CheckCircle2, desc: "Maintenance executed" },
};
function StatusPill({ status }) {
  const m = BLOCK_STATUS_META[status];
  const Icon = m.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: m.color, background: m.bg, padding: "4px 10px", borderRadius: 99 }}>
      <Icon size={11.5} /> {m.label}
    </span>
  );
}
function sepDate(day) { return `${day} September 2026`; }

function BlockRow({ b, onOpenBlock, onApprove, onReject, compact }) {
  const depts = [...new Set(b.tasks.map((t) => t.dept))];
  return (
    <div
      onClick={() => onOpenBlock(b)}
      className="rb-anim-fadeup"
      style={{
        display: "flex", alignItems: "center", gap: 18, padding: "16px 18px",
        borderBottom: `1px solid ${T.line}`, cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ width: 96, flexShrink: 0 }}>
        <div className="rb-mono" style={{ fontWeight: 800, fontSize: 13, color: T.ink }}>{b.id}</div>
        <div className="rb-mono" style={{ fontSize: 11, color: T.slateLight, marginTop: 2 }}>{b.corridor}</div>
      </div>
      <div style={{ width: 150, flexShrink: 0 }}>
        <div style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{sepDate(b.startDay)}</div>
        <div className="rb-mono" style={{ fontSize: 11, color: T.slateLight, marginTop: 2 }}>{b.window}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.tasks.map((t) => t.type).join(" + ")}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 4, alignItems: "center" }}>
          {depts.map((d) => <DeptTag key={d} id={d} />)}
          {b.origin && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 600, color: T.slate, background: "#EEF1F6", borderRadius: 99, padding: "2px 8px" }}>
              <Radar size={10} /> {b.origin}
            </span>
          )}
        </div>
      </div>
      <div style={{ width: 90, flexShrink: 0 }}><PriorityBadge level={b.priority} /></div>
      <div style={{ width: 96, flexShrink: 0, fontSize: 11.5, color: T.slate }}>
        <Train size={11} style={{ verticalAlign: -1, marginRight: 4 }} color={T.slateLight} />
        {b.trains.length} train{b.trains.length !== 1 ? "s" : ""}
      </div>
      <div style={{ width: 128, flexShrink: 0 }}><StatusPill status={b.status} /></div>
      {!compact && (
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          {b.status === "recommended" ? (
            <>
              <button onClick={() => onApprove(b.id)} title="Approve" style={{ border: "none", background: T.greenSoft, color: T.green, borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ThumbsUp size={13} /></button>
              <button onClick={() => onReject(b.id)} title="Reject" style={{ border: "none", background: "#F1F4F9", color: T.slate, borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><XCircle size={13} /></button>
            </>
          ) : (
            <ChevronRight size={15} color={T.slateLight} />
          )}
        </div>
      )}
    </div>
  );
}

function BlockPlansPage({ blocks, onOpenBlock, onApprove, onReject }) {
  const [tab, setTab] = useState("recommended");
  const groups = {
    recommended: blocks.filter((b) => b.status === "recommended"),
    approved: blocks.filter((b) => b.status === "approved"),
    completed: blocks.filter((b) => b.status === "completed"),
  };
  const tabs = [
    { id: "recommended", label: "Recommended", count: groups.recommended.length },
    { id: "approved", label: "Approved", count: groups.approved.length },
    { id: "completed", label: "Completed", count: groups.completed.length },
  ];
  const list = groups[tab];

  return (
    <div>
      <PageHeader icon={Boxes} title="Block Plans" sub="Optimized maintenance blocks, from recommendation through planner approval to execution." />

      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${T.line}` }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 4px", marginRight: 26, border: "none", background: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === t.id ? T.blue : "transparent"}`, marginBottom: -1,
          }}>
            <span style={{ fontSize: 13, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? T.ink : T.slate }}>{t.label}</span>
            <span className="rb-mono" style={{ fontSize: 10.5, fontWeight: 700, color: tab === t.id ? T.blue : T.slateLight, background: tab === t.id ? "#EAF1FE" : "#F1F4F9", borderRadius: 99, padding: "1px 7px" }}>{t.count}</span>
          </button>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 18px", borderBottom: `1px solid ${T.line}`, background: T.canvas }}>
          <div style={{ width: 96, fontSize: 10, fontWeight: 700, color: T.slateLight }}>BLOCK</div>
          <div style={{ width: 150, fontSize: 10, fontWeight: 700, color: T.slateLight }}>DATE &amp; TIME</div>
          <div style={{ flex: 1, fontSize: 10, fontWeight: 700, color: T.slateLight }}>ACTIVITIES</div>
          <div style={{ width: 90, fontSize: 10, fontWeight: 700, color: T.slateLight }}>PRIORITY</div>
          <div style={{ width: 96, fontSize: 10, fontWeight: 700, color: T.slateLight }}>IMPACT</div>
          <div style={{ width: 128, fontSize: 10, fontWeight: 700, color: T.slateLight }}>STATUS</div>
          <div style={{ width: 68, fontSize: 10, fontWeight: 700, color: T.slateLight }}>ACTIONS</div>
        </div>
        {list.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <BLOCK_EMPTY_ICON tab={tab} />
            <p style={{ fontSize: 12.5, color: T.slateLight, margin: "10px 0 0" }}>
              {tab === "recommended" ? "Nothing awaiting review — all blocks have been actioned." : tab === "approved" ? "No approved blocks yet. Approve a recommendation to see it here." : "No completed blocks in this window."}
            </p>
          </div>
        ) : (
          list.map((b) => <BlockRow key={b.id} b={b} onOpenBlock={onOpenBlock} onApprove={onApprove} onReject={onReject} compact={tab !== "recommended"} />)
        )}
      </Card>
    </div>
  );
}
function BLOCK_EMPTY_ICON({ tab }) {
  const Icon = tab === "recommended" ? CheckCircle2 : tab === "approved" ? FileCheck2 : ListChecks;
  return <Icon size={22} color={T.slateLight} />;
}

function LifecycleTracker({ status }) {
  const stages = ["Generated", "Recommended", "Approved", "Completed"];
  const active = status === "recommended" ? 2 : status === "approved" ? 3 : 4;
  return <StepFlow orientation="horizontal" steps={stages} active={active} />;
}

function BlockDetailsModal({ block, onClose, onApprove, onReject }) {
  const [confirming, setConfirming] = useState(false);
  const [justApproved, setJustApproved] = useState(false);
  useEffect(() => { setConfirming(false); setJustApproved(false); }, [block && block.id]);
  if (!block) return null;
  const b = block;
  const depts = [...new Set(b.tasks.map((t) => t.dept))];
  const meta = BLOCK_STATUS_META[b.status];

  const handleApprove = () => {
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setJustApproved(true); onApprove(b.id); }, 800);
  };

  return (
    <Modal open={!!block} onClose={onClose} width={640}>
      <div style={{ padding: "24px 26px 20px", borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <StatusPill status={b.status} />
              <PriorityBadge level={b.priority} />
            </div>
            <div className="rb-mono" style={{ fontSize: 20, fontWeight: 800, color: T.ink }}>BLOCK {b.id}</div>
            <div style={{ fontSize: 13, color: T.slate, marginTop: 4 }}>{b.corridor} · {sepDate(b.startDay)} · <span className="rb-mono">{b.window}</span></div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F4F9", borderRadius: 7, width: 30, height: 30, cursor: "pointer", flexShrink: 0 }}><X size={14} /></button>
        </div>
        <div style={{ marginTop: 18 }}><LifecycleTracker status={justApproved ? "approved" : b.status} /></div>
      </div>

      <div style={{ padding: "22px 26px 26px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
          <InfoTile label="Duration" value={b.duration} />
          <InfoTile label="Affected trains" value={b.trains.length} />
          <InfoTile label="Operational impact" value={b.impact} />
        </div>

        <SectionLabel icon={ListChecks}>Maintenance activities</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {b.tasks.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderBottom: `1px solid ${T.line}` }}>
              <CheckCircle2 size={15} color={T.green} />
              <div style={{ flex: 1 }}>
                <span className="rb-mono" style={{ fontWeight: 700, fontSize: 12 }}>{t.id}</span>
                <span style={{ fontSize: 12.5, color: T.slate, marginLeft: 8 }}>{t.type}</span>
              </div>
              <DeptTag id={t.dept} />
            </div>
          ))}
        </div>

        {depts.length > 1 && (
          <>
            <SectionLabel icon={Combine}>Coordinated activities</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.canvas, borderRadius: 8, padding: "10px 14px", marginBottom: 22, flexWrap: "wrap" }}>
              {depts.map((d, i) => (
                <React.Fragment key={d}>
                  <DeptTag id={d} />
                  {i < depts.length - 1 && <span style={{ color: T.slateLight }}>+</span>}
                </React.Fragment>
              ))}
              <span style={{ fontSize: 11.5, color: T.slate, marginLeft: 6 }}>coordinated in the same block window</span>
            </div>
          </>
        )}

        <SectionLabel icon={ShieldCheck}>Why this block</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {[
            ...(b.origin ? ["Raised proactively from a predictive maintenance recommendation"] : ["High-priority maintenance"]),
            "Corridor available in this window",
            "No critical train conflict",
            depts.length > 1 ? "Compatible multi-department activity" : "Single-department activity — no coordination required",
            `Estimated operational impact: ${b.impact}`,
          ].map((r) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: T.ink }}><CheckCircle2 size={13} color={T.green} />{r}</div>
          ))}
        </div>

        {b.origin && (
          <div style={{ display: "flex", gap: 10, background: T.canvas, borderRadius: 9, padding: "13px 15px", marginBottom: 22 }}>
            <CloudSun size={15} color={T.slate} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11.5, color: T.slate, margin: 0, lineHeight: 1.6 }}>
              A weather-aware window preference was applied when this request was registered. Weather influenced the preferred slot only — train paths, corridor availability, duration and safety constraints were enforced by the optimizer.
            </p>
          </div>
        )}

        {(b.status === "approved" || b.status === "completed" || justApproved) && (
          <div className="rb-anim-fadein" style={{ background: T.greenSoft, borderRadius: 10, padding: "14px 16px", marginBottom: 6 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: T.green, marginBottom: 8 }}>APPROVAL RECORD</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10.5, color: T.slateLight }}>Approved</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink }}>{b.approvedAt || (justApproved ? "Just now" : "—")}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: T.slateLight }}>Approved by</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink }}>{b.approvedBy || (justApproved ? "Operations Planner" : "—")}</div>
              </div>
            </div>
          </div>
        )}

        {b.status === "recommended" && !justApproved && (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <PrimaryBtn icon={confirming ? RefreshCw : ThumbsUp} tone="green" onClick={handleApprove} disabled={confirming} full>
              {confirming ? "Confirming…" : "Approve block"}
            </PrimaryBtn>
            <GhostBtn icon={Edit3} full>Modify</GhostBtn>
            <GhostBtn icon={XCircle} onClick={() => { onReject(b.id); onClose(); }} full>Reject</GhostBtn>
          </div>
        )}

        {justApproved && (
          <div className="rb-anim-fadeup" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, background: T.greenSoft, borderRadius: 8, padding: "10px 14px" }}>
            <CheckCircle2 size={16} color={T.green} />
            <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>Confirmed. This block has moved to Approved Blocks.</span>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ============================================================================
   PAGE: BLOCK EXECUTION
   Closes the loop: approved blocks are executed here, and the planned-vs-actual
   record produced becomes the historical data the predictors learn from.
============================================================================ */
function ExecStatusBadge({ status, size }) {
  const m = EXEC_STATUS[status];
  const Icon = m.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: size === "md" ? 12 : 11, fontWeight: 700, color: m.color, background: m.bg, padding: size === "md" ? "5px 11px" : "4px 9px", borderRadius: 99, whiteSpace: "nowrap" }}>
      <Icon size={size === "md" ? 13 : 11.5} /> {m.label}
    </span>
  );
}

// Elapsed-time ring/bar for in-progress work. Ticks forward once a minute so the
// page feels live without being distracting.
function ExecutionProgress({ elapsedMin, plannedTotalMin }) {
  const pct = Math.min(100, Math.round((elapsedMin / plannedTotalMin) * 100));
  const over = elapsedMin > plannedTotalMin;
  const remaining = plannedTotalMin - elapsedMin;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="rb-mono" style={{ fontSize: 20, fontWeight: 800, color: over ? T.red : T.amber }}>{pct}%</span>
        <span style={{ fontSize: 11.5, color: T.slate }}>of planned duration elapsed</span>
      </div>
      <div style={{ height: 8, background: "#EAEDF3", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: over ? T.red : T.amber, borderRadius: 99, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="rb-mono" style={{ fontSize: 11, color: T.slate }}>{fmtDuration(elapsedMin)} elapsed</span>
        <span className="rb-mono" style={{ fontSize: 11, color: over ? T.red : T.slate, fontWeight: over ? 700 : 400 }}>
          {over ? `${fmtDuration(-remaining)} over plan` : `${fmtDuration(remaining)} remaining`}
        </span>
      </div>
    </div>
  );
}

function PlannedVsActual({ b }) {
  const pMin = plannedMin(b);
  const aMin = actualDurationMin(b);
  if (aMin == null) return null;
  const v = aMin - pMin;
  const maxMin = Math.max(pMin, aMin);
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 11.5, color: T.slate, fontWeight: 600 }}>Planned duration</span>
          <span className="rb-mono" style={{ fontSize: 12, fontWeight: 700 }}>{fmtDuration(pMin)}</span>
        </div>
        <div style={{ height: 10, background: "#EAEDF3", borderRadius: 4 }}>
          <div style={{ width: `${(pMin / maxMin) * 100}%`, height: "100%", background: "#B9C3D6", borderRadius: 4 }} />
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 11.5, color: T.slate, fontWeight: 600 }}>Actual duration</span>
          <span className="rb-mono" style={{ fontSize: 12, fontWeight: 700, color: v <= 0 ? T.green : T.amber }}>{fmtDuration(aMin)}</span>
        </div>
        <div style={{ height: 10, background: "#EAEDF3", borderRadius: 4 }}>
          <div style={{ width: `${(aMin / maxMin) * 100}%`, height: "100%", background: v <= 0 ? T.green : T.amber, borderRadius: 4, transition: "width .6s" }} />
        </div>
      </div>
      <div style={{ marginTop: 14, background: v <= 0 ? T.greenSoft : T.amberSoft, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        {v <= 0 ? <TrendingDown size={14} color={T.green} /> : <TrendingUp size={14} color={T.amber} />}
        <span style={{ fontSize: 12, fontWeight: 600, color: v <= 0 ? T.green : T.amber }}>
          {v === 0 ? "Completed exactly within the planned duration"
            : v < 0 ? `Completed ${fmtDuration(-v)} inside the planned duration`
            : `Ran ${fmtDuration(v)} beyond the planned duration`}
        </span>
      </div>
    </div>
  );
}

function ExecutionPage({ blocks, onOpen, onStart, onGoAnalytics }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [deptF, setDeptF] = useState("ALL");
  const [corrF, setCorrF] = useState("ALL");
  const [prioF, setPrioF] = useState("ALL");

  const counts = {
    scheduled: blocks.filter((b) => b.status === "scheduled").length,
    inprogress: blocks.filter((b) => b.status === "inprogress").length,
    completed: blocks.filter((b) => b.status === "completed").length,
    delayed: blocks.filter((b) => b.status === "delayed").length,
  };
  const tabs = [
    { id: "all", label: "All Blocks", n: blocks.length },
    { id: "scheduled", label: "Upcoming", n: counts.scheduled },
    { id: "inprogress", label: "In Progress", n: counts.inprogress },
    { id: "completed", label: "Completed", n: counts.completed },
    { id: "delayed", label: "Delayed", n: counts.delayed },
  ];

  const rows = blocks.filter((b) => {
    if (tab !== "all" && b.status !== tab) return false;
    if (deptF !== "ALL" && b.dept !== deptF) return false;
    if (corrF !== "ALL" && b.corridor !== corrF) return false;
    if (prioF !== "ALL" && b.priority !== prioF) return false;
    const hay = `${b.id} ${b.assetId} ${b.asset} ${b.corridor}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <PageHeader icon={HardHat} title="Block Execution"
        sub="Monitor scheduled maintenance blocks and track their execution status."
      />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
        <KPICard icon={CalendarClock} label="Scheduled" value={counts.scheduled} sub="Approved, not yet started" tone="blue" />
        <KPICard icon={CirclePlay} label="In Progress" value={counts.inprogress} sub="Work underway now" tone="amber" />
        <KPICard icon={CircleCheck} label="Completed" value={counts.completed} sub="Execution recorded" tone="green" />
        <KPICard icon={AlertTriangle} label="Delayed" value={counts.delayed} sub="Not completed in window" tone="red" />
      </div>

      {/* Lifecycle legend — makes the state machine explicit */}
      <Card style={{ padding: "18px 22px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: T.slateLight }}>LIFECYCLE</span>
          <Badge bg={T.greenSoft} fg={T.green}>Approved</Badge>
          <ArrowRight size={13} color={T.slateLight} />
          <ExecStatusBadge status="scheduled" />
          <ArrowRight size={13} color={T.slateLight} />
          <ExecStatusBadge status="inprogress" />
          <ArrowRight size={13} color={T.slateLight} />
          <ExecStatusBadge status="completed" />
          <span style={{ width: 1, height: 18, background: T.line, margin: "0 6px" }} />
          <span style={{ fontSize: 11, color: T.slateLight }}>or</span>
          <ExecStatusBadge status="delayed" />
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: 20, borderBottom: `1px solid ${T.line}`, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 4px", marginRight: 26, border: "none", background: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === t.id ? T.blue : "transparent"}`, marginBottom: -1,
          }}>
            <span style={{ fontSize: 13, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? T.ink : T.slate }}>{t.label}</span>
            <span className="rb-mono" style={{ fontSize: 10.5, fontWeight: 700, color: tab === t.id ? T.blue : T.slateLight, background: tab === t.id ? "#EAF1FE" : "#F1F4F9", borderRadius: 99, padding: "1px 7px" }}>{t.n}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.line}`, borderRadius: 8, padding: "7px 10px", background: "#fff", flex: "0 0 270px" }}>
          <Search size={14} color={T.slateLight} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by Block ID, asset or corridor…" style={{ border: "none", outline: "none", fontSize: 12.5, width: "100%" }} />
        </div>
        <select value={deptF} onChange={(e) => setDeptF(e.target.value)} style={{ ...wxSelect, width: "auto", minWidth: 150 }}>
          <option value="ALL">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select value={corrF} onChange={(e) => setCorrF(e.target.value)} style={{ ...wxSelect, width: "auto", minWidth: 130 }}>
          <option value="ALL">All corridors</option>
          {CORRIDORS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={prioF} onChange={(e) => setPrioF(e.target.value)} style={{ ...wxSelect, width: "auto", minWidth: 140 }}>
          <option value="ALL">All priorities</option>
          {["VERY HIGH", "HIGH", "MEDIUM", "LOW"].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <span style={{ marginLeft: "auto", fontSize: 11, color: T.slateLight }}>{rows.length} of {blocks.length} blocks</span>
      </div>

      {/* Table */}
      <Card style={{ overflow: "hidden" }}>
        <div className="rb-scrollbar" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 980 }}>
            <thead>
              <tr style={{ background: T.canvas, textAlign: "left" }}>
                {["Block ID", "Asset", "Department", "Corridor", "Planned Date", "Planned Time", "Duration", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "13px 16px", fontSize: 10, fontWeight: 700, color: T.slateLight, letterSpacing: 0.3, borderBottom: `1px solid ${T.line}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} onClick={() => onOpen(b)} style={{ cursor: "pointer", borderBottom: `1px solid ${T.line}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="rb-mono" style={{ fontWeight: 800, color: T.ink, fontSize: 12 }}>{b.id}</div>
                    <div style={{ fontSize: 10.5, color: T.slateLight, marginTop: 2 }}>{b.priority}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="rb-mono" style={{ fontWeight: 700, fontSize: 11.5 }}>{b.assetId}</div>
                    <div style={{ fontSize: 11, color: T.slate, marginTop: 2 }}>{b.task}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}><DeptTag id={b.dept} /></td>
                  <td className="rb-mono" style={{ padding: "14px 16px", fontWeight: 600 }}>{b.corridor}</td>
                  <td style={{ padding: "14px 16px", color: T.slate, whiteSpace: "nowrap" }}>{b.date}</td>
                  <td className="rb-mono" style={{ padding: "14px 16px", color: T.slate, whiteSpace: "nowrap" }}>{b.window}</td>
                  <td className="rb-mono" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    {fmtDuration(plannedMin(b))}
                    {actualDurationMin(b) != null && (
                      <div style={{ fontSize: 10.5, color: varianceMin(b) <= 0 ? T.green : T.amber, marginTop: 2 }}>
                        actual {fmtDuration(actualDurationMin(b))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}><ExecStatusBadge status={b.status} /></td>
                  <td style={{ padding: "14px 16px" }} onClick={(e) => e.stopPropagation()}>
                    {b.status === "scheduled" && <PrimaryBtn icon={CirclePlay} onClick={() => onStart(b)}>Start Work</PrimaryBtn>}
                    {b.status === "inprogress" && <GhostBtn icon={ClipboardList} onClick={() => onOpen(b)}>Open Execution</GhostBtn>}
                    {(b.status === "completed" || b.status === "delayed") && <GhostBtn icon={FileText} onClick={() => onOpen(b)}>View Record</GhostBtn>}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={9} style={{ padding: "44px 0", textAlign: "center" }}>
                  <HardHat size={22} color={T.slateLight} />
                  <p style={{ fontSize: 12.5, color: T.slateLight, margin: "10px 0 0" }}>No blocks match the current filters.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feedback loop — execution data returning to the predictors */}
      <Card style={{ padding: 24, marginTop: 28 }}>
        <SectionLabel icon={Repeat} right={
          <button onClick={onGoAnalytics} style={{ fontSize: 11.5, color: T.blue, fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>Open analytics →</button>
        }>
          Execution history feeding future predictions
        </SectionLabel>
        <p style={{ fontSize: 12, color: T.slate, margin: "0 0 18px", maxWidth: 720, lineHeight: 1.6 }}>
          Every completed block contributes a planned-vs-actual record. These become the historical inputs for asset risk prediction and weather impact estimation, so the plan improves with each cycle.
        </p>
        <div className="rb-scrollbar" style={{ overflowX: "auto", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 640 }}>
            <thead>
              <tr style={{ background: T.canvas, textAlign: "left" }}>
                {["Asset", "Block", "Planned", "Actual", "Variance", "Weather", "Result"].map((h) => (
                  <th key={h} style={{ padding: "11px 14px", fontSize: 10, fontWeight: 700, color: T.slateLight, borderBottom: `1px solid ${T.line}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blocks.filter((b) => b.status === "completed" || b.status === "delayed").map((b) => {
                const v = varianceMin(b);
                return (
                  <tr key={b.id} style={{ borderBottom: `1px solid ${T.line}` }}>
                    <td className="rb-mono" style={{ padding: "11px 14px", fontWeight: 700 }}>{b.assetId}</td>
                    <td className="rb-mono" style={{ padding: "11px 14px", color: T.slate, fontSize: 11 }}>{b.id}</td>
                    <td className="rb-mono" style={{ padding: "11px 14px" }}>{fmtDuration(plannedMin(b))}</td>
                    <td className="rb-mono" style={{ padding: "11px 14px" }}>{v == null ? "—" : fmtDuration(actualDurationMin(b))}</td>
                    <td className="rb-mono" style={{ padding: "11px 14px", fontWeight: 700, color: v == null ? T.slateLight : v <= 0 ? T.green : T.amber }}>
                      {v == null ? "—" : v === 0 ? "on plan" : v < 0 ? `−${fmtDuration(-v)}` : `+${fmtDuration(v)}`}
                    </td>
                    <td style={{ padding: "11px 14px", color: T.slate }}>{b.weather}</td>
                    <td style={{ padding: "11px 14px" }}>
                      {b.status === "delayed"
                        ? <Badge bg={T.redSoft} fg={T.red}>Delayed · {b.delayReason}</Badge>
                        : <Badge bg={RESULT_STYLE[b.result].bg} fg={RESULT_STYLE[b.result].fg}>{b.result}</Badge>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <StepFlow orientation="horizontal" steps={["Execution result", "Historical data", "AI prediction", "Block planning", "Improved plan"]} active={5} />
      </Card>
    </div>
  );
}

/* ---- Execution detail drawer: live progress, completion form, delay form ---- */
function ExecutionDrawer({ block, onClose, onStart, onComplete, onDelay }) {
  const [mode, setMode] = useState("view"); // view | complete | delay
  // Completion form state
  const [result, setResult] = useState(COMPLETION_RESULTS[0]);
  const [endTime, setEndTime] = useState("");
  const [issues, setIssues] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  // Delay form state
  const [delayReason, setDelayReason] = useState(DELAY_REASONS[0]);
  const [delayMins, setDelayMins] = useState(45);
  const [delayNotes, setDelayNotes] = useState("");

  useEffect(() => {
    if (!block) return;
    setMode("view"); setSaving(false);
    setResult(COMPLETION_RESULTS[0]); setIssues(""); setNotes("");
    setDelayReason(DELAY_REASONS[0]); setDelayMins(45); setDelayNotes("");
    // Default the completion time to now-ish relative to the recorded start.
    if (block.actualStart) {
      setEndTime(toHHMM(toMin(block.actualStart) + (block.elapsedMin || plannedMin(block))));
    }
  }, [block && block.id]);

  if (!block) return null;
  const b = block;
  const pw = parseWindow(b.window);
  const pMin = plannedMin(b);
  const aMin = actualDurationMin(b);

  const previewActual = (() => {
    if (!b.actualStart || !endTime) return null;
    let d = toMin(endTime) - toMin(b.actualStart);
    if (d < 0) d += 1440;
    return d;
  })();

  const submitCompletion = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onComplete(b.id, { result, actualEnd: endTime, issues, notes }); }, 850);
  };
  const submitDelay = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onDelay(b.id, { delayReason, delayMinutes: delayMins, notes: delayNotes }); }, 850);
  };

  return (
    <Drawer open={!!block} onClose={onClose} width={620}>
      <div style={{ padding: "22px 26px", borderBottom: `1px solid ${T.line}`, position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
              <ExecStatusBadge status={b.status} size="md" />
              <PriorityBadge level={b.priority} />
            </div>
            <div className="rb-mono" style={{ fontSize: 18, fontWeight: 800 }}>{b.id}</div>
            <div style={{ fontSize: 12.5, color: T.slate, marginTop: 3 }}>{b.task} · {b.assetId} · {b.corridor}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F4F9", borderRadius: 7, width: 30, height: 30, cursor: "pointer", flexShrink: 0 }}><X size={14} /></button>
        </div>
        <div style={{ marginTop: 18 }}>
          <StepFlow orientation="horizontal" steps={["Approved", "Scheduled", "In Progress", b.status === "delayed" ? "Delayed" : "Completed"]}
            active={b.status === "scheduled" ? 2 : b.status === "inprogress" ? 3 : 4} />
        </div>
      </div>

      <div style={{ padding: 26 }}>
        {mode === "view" && (
          <div className="rb-anim-fadein">
            {/* In-progress live panel */}
            {b.status === "inprogress" && (
              <Card style={{ padding: 20, marginBottom: 26, background: T.amberSoft, border: "none" }}>
                <SectionLabel icon={Timer}>Maintenance progress</SectionLabel>
                <ExecutionProgress elapsedMin={b.elapsedMin || 0} plannedTotalMin={pMin} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 12, color: T.ink }}>
                  <CirclePlay size={14} color={T.amber} />
                  <span>Maintenance work started at <b className="rb-mono">{b.actualStart}</b>.</span>
                </div>
              </Card>
            )}

            <SectionLabel icon={Info}>Block information</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 26 }}>
              <InfoTile label="Asset" value={b.asset} />
              <InfoTile label="Asset type" value={b.assetType} />
              <InfoTile label="Department" value={DEPARTMENTS.find((d) => d.id === b.dept).name} />
              <InfoTile label="Corridor" value={b.corridor} mono />
              <InfoTile label="Maintenance task" value={b.task} />
              <InfoTile label="Planned duration" value={fmtDuration(pMin)} mono />
              <InfoTile label="Planned start" value={pw.start} mono />
              <InfoTile label="Planned end" value={pw.end} mono />
              <InfoTile label="Priority" value={b.priority} />
              <InfoTile label="Risk level" value={b.risk} />
            </div>

            {(b.status === "inprogress" || b.status === "completed" || b.status === "delayed") && (
              <>
                <SectionLabel icon={UserCheck}>Execution information</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 26 }}>
                  <InfoTile label="Actual start" value={b.actualStart || "—"} mono />
                  <InfoTile label="Actual completion" value={b.actualEnd || "—"} mono />
                  <InfoTile label="Responsible department" value={DEPARTMENTS.find((d) => d.id === b.dept).name} />
                  <InfoTile label="Assigned team" value={b.team} />
                  <InfoTile label="Started by" value={b.startedBy || "—"} />
                  <InfoTile label="Weather at execution" value={b.weather} />
                </div>
              </>
            )}

            {/* Completed record */}
            {b.status === "completed" && (
              <>
                <SectionLabel icon={BarChart3}>Planned vs actual</SectionLabel>
                <div style={{ marginBottom: 26 }}><PlannedVsActual b={b} /></div>
                <SectionLabel icon={ClipboardCheck}>Completion record</SectionLabel>
                <div style={{ background: T.canvas, borderRadius: 9, padding: "16px 18px", marginBottom: 20 }}>
                  <div style={{ marginBottom: 12 }}>
                    <Badge bg={RESULT_STYLE[b.result].bg} fg={RESULT_STYLE[b.result].fg} size="md">{b.result}</Badge>
                  </div>
                  <ExecRow label="Planned window" value={`${pw.start} – ${pw.end}`} />
                  <ExecRow label="Actual window" value={`${b.actualStart} – ${b.actualEnd}`} />
                  <ExecRow label="Planned duration" value={fmtDuration(pMin)} />
                  <ExecRow label="Actual duration" value={fmtDuration(aMin)} />
                  <ExecRow label="Issues / observations" value={b.issues || "None recorded"} wrap />
                  <ExecRow label="Additional notes" value={b.notes || "None"} wrap last />
                </div>
              </>
            )}

            {/* Delayed record */}
            {b.status === "delayed" && (
              <>
                <SectionLabel icon={AlertTriangle}>Delay record</SectionLabel>
                <div style={{ background: T.redSoft, borderRadius: 9, padding: "16px 18px", marginBottom: 20 }}>
                  <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge bg="#fff" fg={T.red}>Reason: {b.delayReason}</Badge>
                    <Badge bg="#fff" fg={T.red}>+{b.delayMinutes} min</Badge>
                  </div>
                  <p style={{ fontSize: 12, color: T.ink, margin: 0, lineHeight: 1.6 }}>{b.notes}</p>
                </div>
                <p style={{ fontSize: 11, color: T.slateLight, marginBottom: 20, lineHeight: 1.55 }}>
                  Stored as execution data. Delay reasons are used in analytics and inform how future blocks for this asset are planned and sized.
                </p>
              </>
            )}

            {/* Actions */}
            {b.status === "scheduled" && (
              <>
                <div style={{ background: "#F8FAFC", borderRadius: 9, padding: "14px 16px", marginBottom: 18, display: "flex", gap: 10 }}>
                  <Info size={15} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: T.slate, margin: 0, lineHeight: 1.6 }}>
                    This block is approved and scheduled. Starting work records the actual start time against the plan.
                  </p>
                </div>
                <PrimaryBtn icon={CirclePlay} onClick={() => onStart(b)} full>Start Work</PrimaryBtn>
              </>
            )}
            {b.status === "inprogress" && (
              <div style={{ display: "flex", gap: 10 }}>
                <PrimaryBtn icon={CircleCheck} tone="green" onClick={() => setMode("complete")} full>Mark as Completed</PrimaryBtn>
                <GhostBtn icon={AlertTriangle} onClick={() => setMode("delay")} full>Mark as Delayed</GhostBtn>
              </div>
            )}
          </div>
        )}

        {/* ---- Completion form ---- */}
        {mode === "complete" && (
          <div className="rb-anim-fadein">
            <SectionLabel icon={ClipboardCheck}>Completion form</SectionLabel>
            <div style={{ marginBottom: 18 }}>
              <label style={exLabel}>Actual completion time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={wxSelect} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={exLabel}>Maintenance result</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {COMPLETION_RESULTS.map((r) => (
                  <button key={r} onClick={() => setResult(r)} style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    border: `1px solid ${result === r ? T.blue : T.line}`, background: result === r ? "#EAF1FE" : "#fff",
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: 99, flexShrink: 0, background: result === r ? T.blue : "#fff", boxShadow: result === r ? "none" : `inset 0 0 0 1.5px ${T.line}` }} />
                    <span style={{ fontSize: 12.5, fontWeight: result === r ? 700 : 500, color: T.ink }}>{r}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={exLabel}>Actual maintenance duration</label>
              <div style={{ background: T.canvas, borderRadius: 8, padding: "11px 14px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span className="rb-mono" style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>
                  {previewActual != null ? fmtDuration(previewActual) : "—"}
                </span>
                <span style={{ fontSize: 11.5, color: T.slateLight }}>
                  computed from {b.actualStart} → {endTime || "—"} · planned {fmtDuration(pMin)}
                </span>
                {previewActual != null && (
                  <Badge bg={previewActual <= pMin ? T.greenSoft : T.amberSoft} fg={previewActual <= pMin ? T.green : T.amber}>
                    {previewActual === pMin ? "on plan" : previewActual < pMin ? `${fmtDuration(pMin - previewActual)} under` : `${fmtDuration(previewActual - pMin)} over`}
                  </Badge>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={exLabel}>Issues / observations <span style={{ fontWeight: 400, color: T.slateLight }}>(optional)</span></label>
              <textarea value={issues} onChange={(e) => setIssues(e.target.value)} rows={3} placeholder="Anything found during the work that planners should know about…" style={exTextarea} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={exLabel}>Additional notes <span style={{ fontWeight: 400, color: T.slateLight }}>(optional)</span></label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Follow-up actions, recommendations…" style={exTextarea} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <PrimaryBtn icon={saving ? RefreshCw : CircleCheck} tone="green" onClick={submitCompletion} disabled={saving || !endTime} full>
                {saving ? "Recording…" : "Confirm Completion"}
              </PrimaryBtn>
              <GhostBtn onClick={() => setMode("view")} full>Cancel</GhostBtn>
            </div>
          </div>
        )}

        {/* ---- Delay form ---- */}
        {mode === "delay" && (
          <div className="rb-anim-fadein">
            <SectionLabel icon={AlertTriangle}>Mark as delayed</SectionLabel>
            <div style={{ marginBottom: 18 }}>
              <label style={exLabel}>Reason for delay</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {DELAY_REASONS.map((r) => (
                  <button key={r} onClick={() => setDelayReason(r)} style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    border: `1px solid ${delayReason === r ? T.blue : T.line}`, background: delayReason === r ? "#EAF1FE" : "#fff",
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: 99, flexShrink: 0, background: delayReason === r ? T.blue : "#fff", boxShadow: delayReason === r ? "none" : `inset 0 0 0 1.5px ${T.line}` }} />
                    <span style={{ fontSize: 12.5, fontWeight: delayReason === r ? 700 : 500, color: T.ink }}>{r}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={exLabel}>Estimated delay: <span className="rb-mono" style={{ color: T.ink }}>{delayMins} min</span></label>
              <input type="range" min={15} max={240} step={15} value={delayMins} onChange={(e) => setDelayMins(+e.target.value)} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={exLabel}>Notes <span style={{ fontWeight: 400, color: T.slateLight }}>(optional)</span></label>
              <textarea value={delayNotes} onChange={(e) => setDelayNotes(e.target.value)} rows={3} placeholder="e.g. Block delayed by 45 minutes due to unexpected asset damage discovered during inspection." style={exTextarea} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <PrimaryBtn icon={saving ? RefreshCw : AlertTriangle} tone="red" onClick={submitDelay} disabled={saving} full>
                {saving ? "Recording…" : "Confirm Delay"}
              </PrimaryBtn>
              <GhostBtn onClick={() => setMode("view")} full>Cancel</GhostBtn>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
const exLabel = { fontSize: 11, fontWeight: 700, color: T.slate, display: "block", marginBottom: 7 };
const exTextarea = { width: "100%", padding: "9px 11px", borderRadius: 8, border: `1px solid ${T.line}`, fontSize: 12.5, fontFamily: "inherit", resize: "vertical", outline: "none", color: T.ink, boxSizing: "border-box" };
function ExecRow({ label, value, wrap, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "7px 0", borderBottom: last ? "none" : `1px solid ${T.line}88`, alignItems: wrap ? "flex-start" : "center" }}>
      <span style={{ fontSize: 11.5, color: T.slate, flexShrink: 0 }}>{label}</span>
      <span className={wrap ? "" : "rb-mono"} style={{ fontSize: 12, fontWeight: wrap ? 400 : 700, color: T.ink, textAlign: "right", lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

/* ============================================================================
   PAGE: LIVE OPERATIONS — delay simulation, conflict detection, re-optimization
============================================================================ */
const LIVE_STEPS = ["Train approaching", "Potential conflict", "Conflict detected", "Analyzing impact", "Re-optimizing", "Revised plan"];
const LIVE_CAPTIONS = [
  "Train T-204 is running behind schedule, approaching the C-12 corridor.",
  "Its revised path is drifting toward the planned maintenance block.",
  "Train path now overlaps block BLK-204 — this needs a decision.",
  "Identifying which block and tasks are affected.",
  "Searching for a feasible alternative window with CP-SAT.",
  "A revised, conflict-free block window has been found.",
];
const ORIGINAL_BLK204_WINDOW = "14:00–17:00";
const REVISED_BLK204_WINDOW = "15:30–18:30";

function ChangeDetectionPanel({ triggered }) {
  const [open, setOpen] = useState(false);
  return (
    <Card style={{ padding: 20 }}>
      <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <SectionLabel icon={GitBranch}>Change detection logic</SectionLabel>
        {open ? <ChevronDown size={15} color={T.slateLight} /> : <ChevronRight size={15} color={T.slateLight} />}
      </div>
      {open && (
        <div className="rb-anim-fadeup">
          <p style={{ fontSize: 11.5, color: T.slate, lineHeight: 1.6, marginTop: -4 }}>The system compares every operational update against the current plan. Only changes that actually affect feasibility trigger re-optimization — not every minor update.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10, fontSize: 12 }}>
            <FlowRow label="Latest operational data" state="done" />
            <FlowRow label="Compare with current plan" state="done" />
            <FlowRow label="Did anything important change?" state={triggered ? "active" : "done"} />
            <div style={{ display: "flex", gap: 10, marginLeft: 20, marginTop: 2 }}>
              <div style={{ flex: 1, borderRadius: 7, padding: "7px 10px", opacity: triggered ? 0.4 : 1, background: !triggered ? T.greenSoft : T.canvas, transition: "all .4s" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.green }}>NO → Continue as planned</span>
              </div>
              <div style={{ flex: 1, borderRadius: 7, padding: "7px 10px", opacity: triggered ? 1 : 0.4, background: triggered ? T.redSoft : T.canvas, transition: "all .4s" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: T.red }}>YES → Impact analysis → Re-optimize</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
function FlowRow({ label, state }) {
  const color = state === "done" ? T.green : state === "active" ? T.blue : T.slateLight;
  return <div style={{ display: "flex", alignItems: "center", gap: 7 }}>{state === "done" ? <CheckCircle2 size={13} color={color} /> : <CircleDot size={13} color={color} />}<span style={{ fontWeight: 600, color: T.ink }}>{label}</span></div>;
}

function LiveOperationsPage({ blocks, onUpdateBlockWindow }) {
  const [stage, setStage] = useState(-1); // -1 idle, 0..5 progressing through LIVE_STEPS
  const running = stage >= 0 && stage < LIVE_STEPS.length;
  const conflictReached = stage >= 2;
  const resolved = stage >= LIVE_STEPS.length;
  const blk204 = blocks.find((b) => b.id === "BLK-204");

  const simulateDelay = () => {
    setStage(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i >= LIVE_STEPS.length) {
        clearInterval(iv);
        setStage(LIVE_STEPS.length);
        onUpdateBlockWindow("BLK-204", REVISED_BLK204_WINDOW);
      } else setStage(i);
    }, 850);
  };
  const reset = () => { setStage(-1); onUpdateBlockWindow("BLK-204", ORIGINAL_BLK204_WINDOW); };

  return (
    <div>
      <PageHeader icon={Radio} title="Live Operations" sub="Real-time monitoring, conflict detection and automatic re-optimization."
        right={resolved ? <GhostBtn icon={RefreshCw} onClick={reset}>Reset simulation</GhostBtn> : <PrimaryBtn icon={AlertTriangle} tone="red" onClick={simulateDelay} disabled={stage >= 0}>Simulate Train Delay</PrimaryBtn>}
      />

      <Card style={{ marginBottom: 28 }}>
        <div style={{ padding: "20px 22px 8px" }}><SectionLabel icon={RouteIcon} right={<Badge bg={T.greenSoft} fg={T.green}>LIVE · SIMULATED</Badge>}>Corridor network</SectionLabel></div>
        <CorridorSchematic conflictMode={conflictReached && !resolved} delayedTrain="T-204" />
      </Card>

      {stage >= 0 && (
        <Card className="rb-anim-fadeup" style={{ padding: "22px 26px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: conflictReached ? 20 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Train size={16} color={T.blue} />
              <span className="rb-mono" style={{ fontWeight: 800, fontSize: 13 }}>T-204</span>
              <span style={{ fontSize: 12, color: T.slate }}>Deccan Express</span>
            </div>
            <div style={{ fontSize: 12, color: T.slate }}>Original ETA <span className="rb-mono" style={{ fontWeight: 700, color: T.ink }}>14:10</span></div>
            <ArrowRight size={13} color={T.slateLight} />
            <div style={{ fontSize: 12, color: T.slate }}>Revised ETA <span className="rb-mono" style={{ fontWeight: 800, color: conflictReached ? T.red : T.amber }}>14:55</span></div>
            <Badge bg={T.amberSoft} fg={T.amber}>+45 MIN</Badge>
          </div>

          {conflictReached && (
            <div className="rb-anim-fadeup">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: T.slate, marginBottom: 6 }}>TRAIN T-204</div>
                  <div style={{ height: 14, borderRadius: 4, background: "#EAF1FE", overflow: "hidden" }}><div style={{ height: "100%", width: "72%", background: T.blue, borderRadius: 4, transition: "width .5s" }} /></div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: T.slate, marginBottom: 6 }}>BLOCK BLK-204 · {blk204 ? blk204.window : ORIGINAL_BLK204_WINDOW}</div>
                  <div style={{ height: 14, borderRadius: 4, background: T.amberSoft, overflow: "hidden" }}><div style={{ height: "100%", width: "88%", background: T.amber, borderRadius: 4, transition: "width .5s" }} /></div>
                </div>
              </div>
              {!resolved && (
                <div className="rb-anim-fadeup" style={{ display: "flex", alignItems: "center", gap: 8, background: T.redSoft, borderRadius: 8, padding: "9px 14px", marginBottom: 20 }}>
                  <AlertTriangle size={15} color={T.red} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: T.red }}>Conflict detected — revised train path overlaps planned block BLK-204</span>
                </div>
              )}

              <PipelineTracker steps={LIVE_STEPS} active={resolved ? LIVE_STEPS.length : stage} caption={LIVE_CAPTIONS[Math.min(stage, LIVE_CAPTIONS.length - 1)]} tone="light" />

              {resolved && (
                <div className="rb-anim-fadeup" style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 22, background: T.greenSoft, borderRadius: 10, padding: "16px 18px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: T.slateLight, fontWeight: 700 }}>ORIGINAL PLAN</div>
                    <div className="rb-mono" style={{ fontSize: 16, fontWeight: 700, textDecoration: "line-through", color: T.slateLight }}>{ORIGINAL_BLK204_WINDOW}</div>
                  </div>
                  <ArrowRight size={16} color={T.green} />
                  <div>
                    <div style={{ fontSize: 10.5, color: T.green, fontWeight: 700 }}>REVISED PLAN — BLK-204</div>
                    <div className="rb-mono" style={{ fontSize: 16, fontWeight: 800, color: T.green }}>{REVISED_BLK204_WINDOW}</div>
                  </div>
                  <Badge bg="#fff" fg={T.green}>Feasible · 0 conflicts</Badge>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card style={{ padding: 20 }}>
          <SectionLabel icon={MonitorCheck}>Live status</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <StatusRow icon={Train} label="Train T-204" value={stage >= 0 ? "Delayed +45 min" : "On Time"} tone={stage >= 0 ? "amber" : "green"} />
            <StatusRow icon={Train} label="Train T-305" value="Delayed +18 min" tone="amber" />
            <StatusRow icon={Boxes} label="Block BLK-204" value={`${blk204 ? blk204.status[0].toUpperCase() + blk204.status.slice(1) : ""} · ${blk204 ? blk204.window : ORIGINAL_BLK204_WINDOW}`} tone={resolved ? "blue" : "default"} highlight={resolved} />
            <StatusRow icon={Wrench} label="Task TRK-1042" value="In Progress" tone="blue" />
            <StatusRow icon={RouteIcon} label="Corridor C-12" value={conflictReached && !resolved ? "Conflict window" : "Available"} tone={conflictReached && !resolved ? "red" : "green"} />
          </div>
        </Card>
        <ChangeDetectionPanel triggered={conflictReached && !resolved} />
      </div>
    </div>
  );
}
function StatusRow({ icon: Icon, label, value, tone, highlight }) {
  const color = { default: T.ink, green: T.green, amber: T.amber, red: T.red, blue: T.blue }[tone];
  return (
    <div className={highlight ? "rb-anim-fadeup" : ""} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 12px", borderBottom: `1px solid ${T.line}`, borderLeft: highlight ? `2px solid ${T.blue}` : "2px solid transparent", background: highlight ? "#F7FAFF" : "transparent" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Icon size={14} color={T.slate} /><span style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</span></div>
      <span className="rb-mono" style={{ fontSize: 11.5, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

/* ============================================================================
   PAGE: WHAT-IF SIMULATION
============================================================================ */
const SCENARIO_TYPES = [
  { id: "delay", label: "Train delay", icon: Train },
  { id: "defect", label: "New critical defect", icon: AlertOctagon },
  { id: "overrun", label: "Maintenance overrun", icon: Hourglass },
  { id: "unavailable", label: "Corridor unavailable", icon: XCircle },
  { id: "addtask", label: "Additional maintenance task", icon: ListTree },
];

function WhatIfPage() {
  const [scenario, setScenario] = useState("delay");
  const [target, setTarget] = useState("T-204");
  const [param, setParam] = useState(45);
  const { running, active, done, run } = useStepRunner(["Current plan loaded", "Scenario applied", "Conflicts detected", "CP-SAT re-optimization", "Revised plan"], 550);

  return (
    <div>
      <PageHeader icon={FlaskConical} title="What-if Simulation" sub="Test how the plan responds to operational disruptions before they happen." />
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
        <Card style={{ padding: 22 }}>
          <SectionLabel icon={Settings2}>Scenario builder</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {SCENARIO_TYPES.map((s) => (
              <button key={s.id} onClick={() => setScenario(s.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, border: `1px solid ${scenario === s.id ? T.blue : T.line}`, background: scenario === s.id ? "#EAF1FE" : "#fff", cursor: "pointer", textAlign: "left" }}>
                <s.icon size={14} color={scenario === s.id ? T.blue : T.slate} />
                <span style={{ fontSize: 12.5, fontWeight: scenario === s.id ? 700 : 500, color: scenario === s.id ? T.blueDeep : T.ink }}>{s.label}</span>
              </button>
            ))}
          </div>
          {scenario === "delay" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.slate }}>Train</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} style={{ width: "100%", marginTop: 4, padding: "7px 8px", borderRadius: 7, border: `1px solid ${T.line}`, fontSize: 12.5 }}>
                {TRAINS.map((t) => <option key={t.id} value={t.id}>{t.id} — {t.name}</option>)}
              </select>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.slate, marginTop: 10, display: "block" }}>Delay (minutes): {param}</label>
              <input type="range" min={5} max={90} value={param} onChange={(e) => setParam(+e.target.value)} style={{ width: "100%" }} />
            </div>
          )}
          <PrimaryBtn icon={running ? RefreshCw : PlayCircle} onClick={run} disabled={running} full>{running ? "Simulating…" : "Run Simulation"}</PrimaryBtn>
        </Card>

        <Card style={{ padding: 24 }}>
          <SectionLabel icon={Workflow}>Simulation pipeline</SectionLabel>
          <StepFlow orientation="horizontal" steps={["Current Plan", "Scenario Applied", "Conflicts Detected", "CP-SAT Re-optimization", "Revised Plan"]} active={running ? active + 1 : done ? 5 : 0} />

          {done && (
            <div className="rb-anim-fadeup" style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.slate, marginBottom: 12 }}>BEFORE / AFTER — BLK-204 (C-12)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ borderRadius: 9, padding: 18, background: T.canvas }}>
                  <Badge bg="#EEF1F6" fg={T.slate}>BEFORE</Badge>
                  <div style={{ marginTop: 8 }}><InfoRow label="Block window" value="14:00–17:00" /></div>
                  <InfoRow label="Train conflicts" value="0" />
                  <InfoRow label="Priority" value="VERY HIGH" />
                </div>
                <div style={{ borderRadius: 9, padding: 18, background: T.greenSoft }}>
                  <Badge bg="#fff" fg={T.green}>AFTER</Badge>
                  <div style={{ marginTop: 8 }}><InfoRow label="Block window" value="15:30–18:30" changed /></div>
                  <InfoRow label="Train conflicts" value="0" />
                  <InfoRow label="Priority" value="VERY HIGH" />
                </div>
              </div>
              <p style={{ fontSize: 11.5, color: T.slate, marginTop: 12, lineHeight: 1.6 }}>
                With a {param}-minute delay on {target}, CP-SAT found a feasible revised window that keeps the same tasks and avoids new conflicts. This is a simulation only — no live plan is changed until a planner approves it.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
function InfoRow({ label, value, changed }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
      <span style={{ color: T.slateLight }}>{label}</span>
      <span className="rb-mono" style={{ fontWeight: 700, color: changed ? T.green : T.ink }}>{value}</span>
    </div>
  );
}

/* ============================================================================
   PAGE: ANALYTICS
============================================================================ */
const AVAILABILITY_TREND = [
  { day: "W1", availability: 93.1 }, { day: "W2", availability: 94.4 }, { day: "W3", availability: 95.2 },
  { day: "W4", availability: 96.4 }, { day: "W5", availability: 96.9 },
];
const IMPACT_COMPARE = [
  { name: "Train delay-hours", before: 34, after: 11 },
  { name: "Downtime (hrs)", before: 58, after: 39 },
  { name: "Conflicts / month", before: 14, after: 3 },
];
const DEPT_SPLIT = [
  { name: "Engineering", value: 4, color: T.blue },
  { name: "S&T", value: 2, color: T.purple },
  { name: "Traction", value: 1, color: T.cyan },
];

function AnalyticsPage({ execBlocks = [] }) {
  return (
    <div>
      <PageHeader icon={BarChart3} title="Analytics" sub="Prototype / simulated results — for demonstration purposes only." />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <KPICard icon={ShieldCheck} label="Asset availability" value="96.4%" sub="vs 91.2% pre-system" tone="green" demo />
        <KPICard icon={CheckCircle2} label="Maintenance completion" value="92%" sub="On-schedule tasks" demo />
        <KPICard icon={Boxes} label="Block utilization" value="88%" sub="Planned vs executed" demo />
        <KPICard icon={AlertOctagon} label="Conflicts avoided" value="11" sub="This month" tone="blue" demo />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 28 }}>
        <Card style={{ padding: 24 }}>
          <SectionLabel icon={TrendingUp} right={<Badge bg="#EEF1F6" fg={T.slate}>Prototype / simulated results</Badge>}>Asset availability trend</SectionLabel>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={AVAILABILITY_TREND}>
              <defs><linearGradient id="av" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.blue} stopOpacity={0.35} /><stop offset="100%" stopColor={T.blue} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.slate }} axisLine={{ stroke: T.line }} tickLine={false} />
              <YAxis domain={[88, 100]} tick={{ fontSize: 11, fill: T.slate }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="availability" stroke={T.blue} fill="url(#av)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 24 }}>
          <SectionLabel icon={PieChart}>Tasks by department</SectionLabel>
          <ResponsiveContainer width="100%" height={220}>
            <RPieChart>
              <Pie data={DEPT_SPLIT} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3}>
                {DEPT_SPLIT.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </RPieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ padding: 24 }}>
        <SectionLabel icon={BarChart3} right={<Badge bg="#EEF1F6" fg={T.slate}>Before vs after optimization · simulated</Badge>}>Optimization impact</SectionLabel>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={IMPACT_COMPARE} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.slate }} axisLine={{ stroke: T.line }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: T.slate }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="before" name="Before optimization" fill="#B9C3D6" radius={[5, 5, 0, 0]} />
            <Bar dataKey="after" name="After optimization" fill={T.blue} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <ExecutionAnalytics execBlocks={execBlocks} />
    </div>
  );
}

/* ---- Execution performance: derived entirely from recorded execution data,
   answering "did the planned maintenance actually happen as expected?" ---- */
function ExecutionAnalytics({ execBlocks }) {
  const finished = execBlocks.filter((b) => b.status === "completed" || b.status === "delayed");
  const completed = execBlocks.filter((b) => b.status === "completed");
  const delayed = execBlocks.filter((b) => b.status === "delayed");
  if (finished.length === 0) {
    return (
      <Card style={{ padding: "48px 24px", marginTop: 28, textAlign: "center" }}>
        <HardHat size={22} color={T.slateLight} />
        <p style={{ fontSize: 12.5, color: T.slateLight, margin: "10px 0 0" }}>No execution records yet. Completed blocks will appear here.</p>
      </Card>
    );
  }

  const onTime = completed.filter((b) => varianceMin(b) != null && varianceMin(b) <= 0).length;
  const onTimeRate = Math.round((onTime / Math.max(1, completed.length)) * 100);
  const weatherDelays = delayed.filter((b) => b.delayReason === "Weather").length;
  const durations = completed.filter((b) => actualDurationMin(b) != null);
  const avgActual = durations.length ? Math.round(durations.reduce((a, b) => a + actualDurationMin(b), 0) / durations.length) : 0;

  const plannedVsActual = completed.map((b) => ({
    name: b.id.replace("BLK-2026-", "#"),
    planned: +(plannedMin(b) / 60).toFixed(2),
    actual: +(actualDurationMin(b) / 60).toFixed(2),
  }));

  // Average actual duration per asset, across all completed work on that asset.
  const byAssetMap = {};
  durations.forEach((b) => {
    if (!byAssetMap[b.assetId]) byAssetMap[b.assetId] = { name: b.assetId, total: 0, n: 0, planned: 0 };
    byAssetMap[b.assetId].total += actualDurationMin(b);
    byAssetMap[b.assetId].planned += plannedMin(b);
    byAssetMap[b.assetId].n += 1;
  });
  const byAsset = Object.values(byAssetMap).map((a) => ({
    name: a.name,
    actual: +(a.total / a.n / 60).toFixed(2),
    planned: +(a.planned / a.n / 60).toFixed(2),
  }));

  // Completion performance per department.
  const byDeptMap = {};
  finished.forEach((b) => {
    const d = DEPARTMENTS.find((x) => x.id === b.dept).name;
    if (!byDeptMap[d]) byDeptMap[d] = { name: d, completed: 0, delayed: 0 };
    if (b.status === "completed") byDeptMap[d].completed += 1; else byDeptMap[d].delayed += 1;
  });
  const byDept = Object.values(byDeptMap);

  const delayReasons = {};
  delayed.forEach((b) => { delayReasons[b.delayReason] = (delayReasons[b.delayReason] || 0) + 1; });

  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <HardHat size={16} color={T.blue} strokeWidth={2} />
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: T.ink }}>Execution Performance</h2>
      </div>
      <p style={{ fontSize: 12, color: T.slate, margin: "0 0 20px", maxWidth: 680, lineHeight: 1.55 }}>
        Measured from recorded execution data — not the plan. This is how the system checks whether planned maintenance actually happened as expected.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <KPICard icon={CircleCheck} label="On-Time Completion Rate" value={`${onTimeRate}%`} sub={`${onTime} of ${completed.length} within plan`} tone="green" />
        <KPICard icon={AlertTriangle} label="Delayed Blocks" value={delayed.length} sub={`${weatherDelays} weather-related`} tone="red" />
        <KPICard icon={Timer} label="Avg Actual Duration" value={fmtDuration(avgActual)} sub="Across completed blocks" />
        <KPICard icon={ClipboardList} label="Execution Records" value={finished.length} sub="Available as training data" tone="blue" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <Card style={{ padding: 24 }}>
          <SectionLabel icon={BarChart3}>Planned vs Actual Duration</SectionLabel>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={plannedVsActual} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: T.slate }} axisLine={{ stroke: T.line }} tickLine={false} />
              <YAxis unit="h" tick={{ fontSize: 10.5, fill: T.slate }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v} h`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="planned" name="Planned" fill="#B9C3D6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill={T.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 24 }}>
          <SectionLabel icon={Layers}>Avg Duration by Asset</SectionLabel>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byAsset} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: T.slate }} axisLine={{ stroke: T.line }} tickLine={false} />
              <YAxis unit="h" tick={{ fontSize: 10.5, fill: T.slate }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v} h`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="planned" name="Planned avg" fill="#B9C3D6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual avg" fill={T.cyan} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card style={{ padding: 24 }}>
          <SectionLabel icon={Users}>Department Completion Performance</SectionLabel>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byDept} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: T.slate }} axisLine={{ stroke: T.line }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10.5, fill: T.slate }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="completed" name="Completed" fill={T.green} radius={[4, 4, 0, 0]} />
              <Bar dataKey="delayed" name="Delayed" fill={T.red} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding: 24 }}>
          <SectionLabel icon={AlertTriangle}>Delay Causes</SectionLabel>
          {Object.keys(delayReasons).length === 0 ? (
            <p style={{ fontSize: 12.5, color: T.slateLight }}>No delays recorded.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
              {Object.entries(delayReasons).sort((a, b) => b[1] - a[1]).map(([reason, n]) => (
                <div key={reason}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: T.ink, fontWeight: 600 }}>{reason}</span>
                    <span className="rb-mono" style={{ fontSize: 11.5, fontWeight: 700, color: T.slate }}>{n} block{n > 1 ? "s" : ""}</span>
                  </div>
                  <ProgressBar value={n} max={delayed.length} color={reason === "Weather" ? T.cyan : T.amber} height={6} />
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 11, color: T.slateLight, marginTop: 20, marginBottom: 0, lineHeight: 1.55 }}>
            Weather-related delays are fed back into the Weather Impact model; asset-condition delays inform predictive maintenance scope estimates.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================================
   APP SHELL
============================================================================ */
export default function App() {
  const [page, setPage] = useState("overview");
  const [taskDrawer, setTaskDrawer] = useState(null);
  const [blockModalId, setBlockModalId] = useState(null);
  const [toast, setToast] = useState(null);

  // Single source of truth for block lifecycle — shared across Monthly, Weekly,
  // Block Plans and Live Operations so an approval or re-optimization is visible everywhere.
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const blockModal = blocks.find((b) => b.id === blockModalId) || null;

  const goto = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openTask = (t) => setTaskDrawer(t);
  const openBlock = (b) => setBlockModalId(b.id);
  const closeBlock = () => setBlockModalId(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const approveBlock = (id) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, status: "approved", approvedAt: "Just now", approvedBy: "Operations Planner" } : b)));
  };
  const rejectBlock = (id) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b)));
    showToast(`Block ${id} rejected and removed from the recommended queue.`);
  };
  const refineWeeklyPlan = () => {
    setBlocks((prev) => prev.map((b) => (b.id === "BLK-202" ? { ...b, startDay: b.startDay + 1 } : b.id === "BLK-204" ? { ...b, startDay: b.startDay - 1 } : b)));
  };
  const updateBlockWindow = (id, newWindow) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, window: newWindow } : b)));
  };

  // AI Maintenance Insights state. `registered` tracks which predicted assets have
  // had a block raised; `appliedWindow` records the accepted weather preference.
  // Both are the hooks a real Spring Boot API would write into.
  const [predictionDrawer, setPredictionDrawer] = useState(null);
  const [registerTarget, setRegisterTarget] = useState(null);
  const [registered, setRegistered] = useState([]);
  const [appliedWindow, setAppliedWindow] = useState(null);

  const viewRecommendation = (p) => setPredictionDrawer(p);
  const startRegister = (p) => { setPredictionDrawer(null); setRegisterTarget(p); };
  const completeRegister = (p) => {
    if (registered.includes(p.assetId)) return; // already has a block in the queue
    setRegistered((prev) => [...prev, p.assetId]);
    const newId = `BLK-2${20 + registered.length}`;
    const seedTask = {
      id: `${p.dept === "SNT" ? "SIG" : p.dept === "ENG" ? "TRK" : "OHE"}-${p.assetId.replace(/\D/g, "")}`,
      dept: p.dept, type: `${p.assetType} — predicted maintenance`, corridor: p.corridor,
    };
    // A registered request enters the planning queue as a new recommended block,
    // so it flows through the same approval + optimization path as everything else.
    setBlocks((prev) => [
      ...prev,
      {
        id: newId, corridor: p.corridor, startDay: 18 + registered.length * 2, span: 1,
        taskIds: [seedTask.id], tasks: [seedTask],
        window: appliedWindow || "18:00–21:00",
        duration: `${p.suggestedDuration} hrs`,
        priority: p.risk === "High" ? "HIGH" : "MEDIUM",
        trains: [], impact: "LOW", status: "recommended",
        approvedAt: null, approvedBy: null, origin: "Predictive maintenance",
      },
    ]);
  };
  const useWeatherWindow = (w) => {
    setAppliedWindow(w.window);
    showToast(`${w.window} added as a planning preference for ${WEATHER_TASK.assetId}.`);
  };

  // Standalone pages: asset detail drawer, and the 15-day forecast window that
  // gets handed to the block planner as a preferred date.
  const [assetDrawer, setAssetDrawer] = useState(null);
  const [appliedForecastDate, setAppliedForecastDate] = useState(null);
  const useForecastWindow = (w) => {
    setAppliedForecastDate(w.window);
    showToast(`${w.window}, ${w.time} sent to the block planner as a preferred window for ${w.asset}.`);
  };

  // Block execution state. Kept separate from the planning `blocks` list because an
  // execution record tracks planned-vs-actual, which the planning view doesn't carry.
  const [execBlocks, setExecBlocks] = useState(EXEC_BLOCKS);
  const [execDrawerId, setExecDrawerId] = useState(null);
  const execDrawer = execBlocks.find((b) => b.id === execDrawerId) || null;

  // Tick elapsed time forward for in-progress blocks so the progress bars advance.
  useEffect(() => {
    const iv = setInterval(() => {
      setExecBlocks((prev) => prev.map((b) => (b.status === "inprogress" ? { ...b, elapsedMin: (b.elapsedMin || 0) + 1 } : b)));
    }, 60000);
    return () => clearInterval(iv);
  }, []);

  const startWork = (b) => {
    // Record the actual start a few minutes past the planned start, as happens in practice.
    const planned = parseWindow(b.window).start;
    const actualStart = toHHMM(toMin(planned) + 6);
    setExecBlocks((prev) => prev.map((x) => (x.id === b.id
      ? { ...x, status: "inprogress", actualStart, startedBy: `${x.team} lead`, elapsedMin: 0 }
      : x)));
    setExecDrawerId(b.id);
    showToast(`Maintenance work on ${b.id} started at ${actualStart}.`);
  };
  const completeWork = (id, payload) => {
    setExecBlocks((prev) => prev.map((x) => (x.id === id
      ? { ...x, status: "completed", actualEnd: payload.actualEnd, result: payload.result, issues: payload.issues, notes: payload.notes }
      : x)));
    showToast(`Block ${id} has been successfully completed.`);
  };
  const delayWork = (id, payload) => {
    setExecBlocks((prev) => prev.map((x) => (x.id === id
      ? { ...x, status: "delayed", delayReason: payload.delayReason, delayMinutes: payload.delayMinutes, notes: payload.notes }
      : x)));
    showToast(`Block ${id} marked as delayed — ${payload.delayReason}.`);
  };

  return (
    <div className="rb-root" style={{ minHeight: "100vh", background: T.canvas }}>
      <GlobalStyle />
      <TopNav page={page} setPage={goto} alerts={1} />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 24px 80px" }}>
        {page === "overview" && (
          <OverviewPage
            goto={goto} openTask={openTask}
            onRegister={startRegister} onViewRecommendation={viewRecommendation}
            onUseWindow={useWeatherWindow} registered={registered} appliedWindow={appliedWindow}
            execBlocks={execBlocks}
          />
        )}
        {page === "maintenance" && <MaintenancePage openTask={openTask} />}
        {page === "predictive" && (
          <PredictiveMaintenancePage
            onRegister={startRegister} onViewAsset={(p) => setAssetDrawer(p)} registered={registered}
          />
        )}
        {page === "weather" && <WeatherImpactPage onUseWindow={useForecastWindow} appliedWindow={appliedForecastDate} />}
        {page === "execution" && (
          <ExecutionPage
            blocks={execBlocks} onOpen={(b) => setExecDrawerId(b.id)}
            onStart={startWork} onGoAnalytics={() => goto("analytics")}
          />
        )}
        {page === "monthly" && <MonthlyPlannerPage blocks={blocks} onOpenBlock={openBlock} />}
        {page === "weekly" && <WeeklyPlannerPage blocks={blocks} onOpenBlock={openBlock} onRefine={refineWeeklyPlan} />}
        {page === "blocks" && <BlockPlansPage blocks={blocks} onOpenBlock={openBlock} onApprove={approveBlock} onReject={rejectBlock} />}
        {page === "live" && <LiveOperationsPage blocks={blocks} onUpdateBlockWindow={updateBlockWindow} />}
        {page === "whatif" && <WhatIfPage />}
        {page === "analytics" && <AnalyticsPage execBlocks={execBlocks} />}
      </div>

      <TaskDrawer task={taskDrawer} onClose={() => setTaskDrawer(null)} />
      <BlockDetailsModal block={blockModal} onClose={closeBlock} onApprove={approveBlock} onReject={rejectBlock} />
      <PredictionDrawer prediction={predictionDrawer} onClose={() => setPredictionDrawer(null)} onRegister={startRegister} registered={registered} />
      <AssetPredictionDrawer prediction={assetDrawer} onClose={() => setAssetDrawer(null)} onRegister={(p) => { setAssetDrawer(null); startRegister(p); }} registered={registered} />
      <ExecutionDrawer block={execDrawer} onClose={() => setExecDrawerId(null)} onStart={startWork} onComplete={completeWork} onDelay={delayWork} />
      <RegisterBlockModal prediction={registerTarget} onClose={() => setRegisterTarget(null)} onSubmit={completeRegister} />

      {toast && (
        <div className="rb-anim-fadeup" style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", background: T.navy, color: "#fff", padding: "12px 18px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(11,21,38,.25)", zIndex: 80 }}>
          <CheckCircle2 size={16} color="#3EDC91" />
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{toast}</span>
        </div>
      )}

      <div style={{ borderTop: `1px solid ${T.line}`, padding: "18px 20px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: T.slateLight }}>RailOps — SIH 2026 Prototype · AI-assisted decision support, not autonomous control. Metrics marked "simulated" are illustrative only.</span>
      </div>
    </div>
  );
}
