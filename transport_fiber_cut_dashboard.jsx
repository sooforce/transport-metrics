import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Download, Activity, AlertTriangle, Cable, ShieldCheck, Clock3, TrendingUp, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { ResponsiveContainer, ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import jsPDF from "jspdf";

const TabsContext = createContext({ value: "", onValueChange: () => {} });

function Card({ className = "", children }) {
  return <div className={`surface-card ${className}`.trim()}>{children}</div>;
}

function CardHeader({ className = "", children }) {
  return <div className={`surface-header ${className}`.trim()}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={`surface-body ${className}`.trim()}>{children}</div>;
}

function CardTitle({ className = "", children }) {
  return <h2 className={`section-title ${className}`.trim()}>{children}</h2>;
}

function CardDescription({ className = "", children }) {
  return <p className={`section-description ${className}`.trim()}>{children}</p>;
}

function Button({ className = "", variant = "default", size = "default", type = "button", children, ...props }) {
  const variantClass = variant === "outline" ? "ui-button--outline" : "ui-button--solid";
  const sizeClass = size === "sm" ? "ui-button--sm" : "ui-button--md";

  return (
    <button
      type={type}
      className={`ui-button ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return <input className={`ui-input ${className}`.trim()} {...props} />;
}

function Badge({ className = "", variant = "default", children }) {
  const variantClass = variant === "outline" ? "ui-badge--outline" : "ui-badge--solid";

  return <span className={`ui-badge ${variantClass} ${className}`.trim()}>{children}</span>;
}

function Tabs({ value, onValueChange, children }) {
  return <TabsContext.Provider value={{ value, onValueChange }}>{children}</TabsContext.Provider>;
}

function TabsList({ className = "", children }) {
  return <div className={`tabs-list ${className}`.trim()}>{children}</div>;
}

function TabsTrigger({ value, children }) {
  const context = useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={`tabs-trigger ${isActive ? "tabs-trigger--active" : ""}`.trim()}
    >
      {children}
    </button>
  );
}

const rawIncidents = [
  { id: "FC-2026-006", date: "2026-04-01", route: "Nicosia–Larnaca", cutType: "Test incident", affectedLinks: 1, downtimeMin: 30, rerouted: true, otnProtected: true, severity: "low", site: "Segment T1", capacityGbps: 50 },
  { id: "FC-2026-001", date: "2026-03-24", route: "Nicosia–Larnaca", cutType: "Backhoe damage", affectedLinks: 2, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "high", site: "Segment A1", capacityGbps: 100 },
  { id: "FC-2026-002", date: "2026-03-20", route: "Nicosia–Limassol", cutType: "Road works", affectedLinks: 1, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "medium", site: "Segment C4", capacityGbps: 200 },
  { id: "FC-2026-003", date: "2026-03-05", route: "Larnaca–Ayia Napa", cutType: "Unknown", affectedLinks: 1, downtimeMin: 44, rerouted: false, otnProtected: false, severity: "critical", site: "Segment L2", capacityGbps: 10 },
  { id: "FC-2026-004", date: "2026-02-17", route: "Limassol–Paphos", cutType: "Construction", affectedLinks: 3, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "high", site: "Segment P7", capacityGbps: 100 },
  { id: "FC-2026-005", date: "2026-01-09", route: "Nicosia–Kyrenia", cutType: "Unauthorized digging", affectedLinks: 1, downtimeMin: 73, rerouted: false, otnProtected: false, severity: "critical", site: "Segment K3", capacityGbps: 40 },
  { id: "FC-2025-010", date: "2025-11-14", route: "Nicosia–Larnaca", cutType: "Construction", affectedLinks: 2, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "medium", site: "Segment A1", capacityGbps: 100 },
  { id: "FC-2025-011", date: "2025-08-02", route: "Limassol–Paphos", cutType: "Weather", affectedLinks: 1, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "high", site: "Segment P3", capacityGbps: 40 },
  { id: "FC-2025-012", date: "2025-04-28", route: "Nicosia–Famagusta", cutType: "Civil works", affectedLinks: 2, downtimeMin: 91, rerouted: false, otnProtected: false, severity: "critical", site: "Segment F6", capacityGbps: 10 },
  { id: "FC-2024-020", date: "2024-12-18", route: "Nicosia–Limassol", cutType: "Road works", affectedLinks: 1, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "low", site: "Segment C4", capacityGbps: 200 },
  { id: "FC-2024-021", date: "2024-09-06", route: "Larnaca–Ayia Napa", cutType: "Construction", affectedLinks: 1, downtimeMin: 35, rerouted: false, otnProtected: false, severity: "high", site: "Segment L2", capacityGbps: 10 },
  { id: "FC-2024-022", date: "2024-06-11", route: "Limassol–Paphos", cutType: "Backhoe damage", affectedLinks: 2, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "medium", site: "Segment P7", capacityGbps: 100 },
  { id: "FC-2024-023", date: "2024-02-03", route: "Nicosia–Kyrenia", cutType: "Weather", affectedLinks: 1, downtimeMin: 55, rerouted: false, otnProtected: false, severity: "critical", site: "Segment K3", capacityGbps: 40 },
  { id: "FC-2023-030", date: "2023-10-12", route: "Nicosia–Larnaca", cutType: "Construction", affectedLinks: 1, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "low", site: "Segment A1", capacityGbps: 100 },
  { id: "FC-2023-031", date: "2023-07-19", route: "Nicosia–Famagusta", cutType: "Civil works", affectedLinks: 2, downtimeMin: 47, rerouted: false, otnProtected: false, severity: "high", site: "Segment F6", capacityGbps: 10 },
  { id: "FC-2023-032", date: "2023-03-27", route: "Limassol–Paphos", cutType: "Road works", affectedLinks: 1, downtimeMin: 0, rerouted: true, otnProtected: true, severity: "medium", site: "Segment P3", capacityGbps: 40 },
];

const pieColors = ["#0f172a", "#334155", "#64748b", "#94a3b8"];
const CURRENT_DATE = new Date().toISOString();
const TOTAL_NETWORK_KM = 1200;
const emptyIncidentForm = {
  id: "",
  date: "",
  route: "",
  cutType: "",
  downtimeMin: "0",
  capacityGbps: "10",
  rerouted: "true",
  otnProtected: "true",
};

function formatMinutes(min) {
  if (!Number.isFinite(min) || min <= 0) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function getDateRange(filter) {
  const now = new Date(CURRENT_DATE);
  const start = new Date(now);

  if (filter === "daily") {
    start.setDate(now.getDate() - 30);
  } else if (filter === "monthly") {
    start.setMonth(now.getMonth() - 12);
  } else if (filter === "yearly") {
    start.setFullYear(now.getFullYear() - 1);
  } else if (filter === "all") {
    start.setFullYear(1970);
  }

  return { start, end: now };
}

function getPreviousDateRange(filter) {
  if (filter === "all") {
    return null;
  }

  const { start, end } = getDateRange(filter);
  const durationMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs);

  return { start: prevStart, end: prevEnd };
}

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

function yearLabel(dateStr) {
  return new Date(dateStr).getFullYear().toString();
}

function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function causeCategory(cutType) {
  const normalized = String(cutType || "").toLowerCase();
  if (normalized.includes("construction") || normalized.includes("road") || normalized.includes("civil") || normalized.includes("dig")) {
    return "construction";
  }
  if (normalized.includes("weather") || normalized.includes("storm")) {
    return "weather";
  }
  if (normalized.includes("backhoe") || normalized.includes("unauthorized")) {
    return "unauthorized";
  }
  if (normalized.includes("unknown")) {
    return "unknown";
  }
  return "other";
}

function buildTrendData(items, range) {
  const bucket = new Map();

  const sorted = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach((incident) => {
    const key = range === "daily"
      ? dayLabel(incident.date)
      : range === "all"
        ? yearLabel(incident.date)
        : monthLabel(incident.date);

    const category = causeCategory(incident.cutType);
    const incidentDate = new Date(incident.date);

    if (!bucket.has(key)) {
      bucket.set(key, {
        period: key,
        periodDate: incidentDate,
        cuts: 0,
        downtime: 0,
        construction: 0,
        weather: 0,
        unauthorized: 0,
        unknown: 0,
        other: 0,
        routeSet: new Set(),
      });
    }

    const row = bucket.get(key);
    if (incidentDate < row.periodDate) {
      row.periodDate = incidentDate;
    }
    row.cuts += 1;
    row.downtime += incident.downtimeMin;
    row[category] += 1;
    row.routeSet.add(incident.route);
  });

  const ordered = Array.from(bucket.values()).sort((a, b) => a.periodDate - b.periodDate);

  return ordered.map((row, index, arr) => {
    const window7 = arr.slice(Math.max(0, index - 6), index + 1);
    const window30 = arr.slice(Math.max(0, index - 29), index + 1);
    const ma7Cuts = window7.reduce((sum, item) => sum + item.cuts, 0) / window7.length;
    const ma30Cuts = window30.reduce((sum, item) => sum + item.cuts, 0) / window30.length;
    const ma7Downtime = window7.reduce((sum, item) => sum + item.downtime, 0) / window7.length;
    const ma30Downtime = window30.reduce((sum, item) => sum + item.downtime, 0) / window30.length;
    const avg = ma30Cuts;
    const variance = window30.reduce((sum, item) => sum + ((item.cuts - avg) ** 2), 0) / window30.length;
    const stdDev = Math.sqrt(variance);

    return {
      period: row.period,
      periodDate: row.periodDate,
      activeRoutes: row.routeSet.size || 1,
      cuts: row.cuts,
      downtime: row.downtime,
      construction: row.construction,
      weather: row.weather,
      unauthorized: row.unauthorized,
      unknown: row.unknown,
      other: row.other,
      ma7Cuts: Math.round(ma7Cuts * 10) / 10,
      ma30Cuts: Math.round(ma30Cuts * 10) / 10,
      ma7Downtime: Math.round(ma7Downtime),
      ma30Downtime: Math.round(ma30Downtime),
      anomalyCuts: stdDev > 0 && row.cuts > avg + (2 * stdDev) ? row.cuts : null,
    };
  });
}

function buildRouteDeltaMap(currentItems, previousItems) {
  const toMap = (items) => {
    const map = new Map();
    items.forEach((item) => {
      if (!map.has(item.route)) {
        map.set(item.route, { cuts: 0, downtime: 0 });
      }
      const row = map.get(item.route);
      row.cuts += 1;
      row.downtime += item.downtimeMin;
    });
    return map;
  };

  const currentMap = toMap(currentItems);
  const previousMap = toMap(previousItems);
  const routes = new Set([...currentMap.keys(), ...previousMap.keys()]);
  const deltaMap = new Map();

  routes.forEach((route) => {
    const current = currentMap.get(route) || { cuts: 0, downtime: 0 };
    const previous = previousMap.get(route) || { cuts: 0, downtime: 0 };
    deltaMap.set(route, {
      cutsDelta: current.cuts - previous.cuts,
      downtimeDelta: current.downtime - previous.downtime,
    });
  });

  return deltaMap;
}

function buildTopRoutes(items, metric = "cuts", deltaMap = new Map()) {
  const map = new Map();
  const recentThreshold = new Date(CURRENT_DATE);
  recentThreshold.setDate(recentThreshold.getDate() - 90);

  items.forEach((incident) => {
    if (!map.has(incident.route)) {
      map.set(incident.route, {
        route: incident.route,
        cuts: 0,
        downtime: 0,
        protectedCount: 0,
        unprotectedCapacityGbps: 0,
        siteFrequency: new Map(),
      });
    }

    const row = map.get(incident.route);
    row.cuts += 1;
    row.downtime += incident.downtimeMin;
    row.protectedCount += incident.otnProtected ? 1 : 0;
    if (!incident.otnProtected) {
      row.unprotectedCapacityGbps += incident.capacityGbps;
    }

    const incidentDate = new Date(incident.date);
    if (incidentDate >= recentThreshold) {
      const current = row.siteFrequency.get(incident.site) || 0;
      row.siteFrequency.set(incident.site, current + 1);
    }
  });

  const rows = Array.from(map.values()).map((row) => {
    const repeatSites = Array.from(row.siteFrequency.values()).filter((count) => count > 1).length;
    const protectionRate = row.cuts ? Math.round((row.protectedCount / row.cuts) * 100) : 0;
    const delta = deltaMap.get(row.route) || { cutsDelta: 0, downtimeDelta: 0 };
    return {
      route: row.route,
      cuts: row.cuts,
      downtime: row.downtime,
      protectionRate,
      unprotectedCapacityGbps: row.unprotectedCapacityGbps,
      recurrence90d: repeatSites,
      cutsDelta: delta.cutsDelta,
      downtimeDelta: delta.downtimeDelta,
    };
  });

  const totalCuts = rows.reduce((sum, row) => sum + row.cuts, 0);
  const totalDowntime = rows.reduce((sum, row) => sum + row.downtime, 0);
  const maxCuts = Math.max(1, ...rows.map((row) => row.cuts));
  const maxDowntime = Math.max(1, ...rows.map((row) => row.downtime));
  const maxUnprotected = Math.max(1, ...rows.map((row) => row.unprotectedCapacityGbps));

  const enriched = rows.map((row) => {
    const risk = (
      0.45 * (row.cuts / maxCuts)
      + 0.35 * (row.downtime / maxDowntime)
      + 0.20 * (row.unprotectedCapacityGbps / maxUnprotected)
    ) * 100;

    return {
      ...row,
      contributionCuts: totalCuts ? Math.round((row.cuts / totalCuts) * 100) : 0,
      contributionDowntime: totalDowntime ? Math.round((row.downtime / totalDowntime) * 100) : 0,
      riskScore: Math.round(risk),
    };
  });

  const comparator = metric === "downtime"
    ? (a, b) => (b.downtime - a.downtime) || (b.cuts - a.cuts)
    : metric === "risk"
      ? (a, b) => (b.riskScore - a.riskScore) || (b.cuts - a.cuts)
      : (a, b) => (b.cuts - a.cuts) || (b.downtime - a.downtime);

  return enriched
    .sort(comparator)
    .slice(0, 6);
}

function buildContinuityTrend(items, range) {
  const bucket = new Map();
  const sorted = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach((incident) => {
    const key = range === "daily"
      ? dayLabel(incident.date)
      : range === "all"
        ? yearLabel(incident.date)
        : monthLabel(incident.date);

    if (!bucket.has(key)) {
      bucket.set(key, {
        period: key,
        periodDate: new Date(incident.date),
        protected: 0,
        unprotected: 0,
        rerouted: 0,
        serviceDowntime: 0,
      });
    }

    const row = bucket.get(key);
    if (new Date(incident.date) < row.periodDate) {
      row.periodDate = new Date(incident.date);
    }
    row.protected += incident.otnProtected ? 1 : 0;
    row.unprotected += incident.otnProtected ? 0 : 1;
    row.rerouted += incident.rerouted ? 1 : 0;
    row.serviceDowntime += incident.downtimeMin > 0 ? 1 : 0;
  });

  return Array.from(bucket.values()).sort((a, b) => a.periodDate - b.periodDate);
}

function buildSeverityRerouteData(items) {
  const severities = ["critical", "high", "medium", "low"];
  return severities.map((severity) => {
    const scoped = items.filter((item) => item.severity === severity);
    const rerouted = scoped.filter((item) => item.rerouted).length;
    const rate = scoped.length ? Math.round((rerouted / scoped.length) * 100) : 0;
    return {
      severity,
      incidents: scoped.length,
      rerouted,
      rerouteRate: rate,
    };
  });
}

function calculateConfidence(items) {
  if (items.length === 0) {
    return { score: 100, label: "High" };
  }

  const missingCore = items.filter((item) => !item.route || !item.site || !item.cutType || !item.date).length;
  const unknownCause = items.filter((item) => String(item.cutType || "").toLowerCase().includes("unknown")).length;
  const missingRatio = missingCore / items.length;
  const unknownRatio = unknownCause / items.length;
  const score = Math.max(0, Math.round(100 - (missingRatio * 60) - (unknownRatio * 40)));
  const label = score >= 85 ? "High" : score >= 65 ? "Medium" : "Low";

  return { score, label };
}

function formatDelta(current, previous) {
  if (previous === null || previous === undefined) {
    return "N/A";
  }
  const diff = current - previous;
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff}`;
}

function withTrendNormalization(data, viewMode) {
  if (viewMode === "absolute") {
    return data;
  }

  const networkFactor = 100 / TOTAL_NETWORK_KM;
  const normalize = (value, activeRoutes) => {
    if (viewMode === "perRoute") {
      return Math.round((value / Math.max(1, activeRoutes)) * 10) / 10;
    }
    return Math.round((value * networkFactor) * 10) / 10;
  };

  return data.map((row) => ({
    ...row,
    cuts: normalize(row.cuts, row.activeRoutes),
    downtime: normalize(row.downtime, row.activeRoutes),
    ma7Cuts: normalize(row.ma7Cuts, row.activeRoutes),
    ma30Cuts: normalize(row.ma30Cuts, row.activeRoutes),
    anomalyCuts: row.anomalyCuts === null ? null : normalize(row.anomalyCuts, row.activeRoutes),
    construction: normalize(row.construction, row.activeRoutes),
    weather: normalize(row.weather, row.activeRoutes),
    unauthorized: normalize(row.unauthorized, row.activeRoutes),
    unknown: normalize(row.unknown, row.activeRoutes),
  }));
}

function buildRouteForecast(items, method = "sma") {
  const now = new Date(CURRENT_DATE);
  const windowDays = 90;
  const windowStart = new Date(now);
  windowStart.setDate(now.getDate() - windowDays);
  const alpha = 0.35;

  const dateKey = (date) => date.toISOString().slice(0, 10);
  const smoothSeries = (values) => {
    if (values.length === 0) return 0;
    let level = values[0];
    for (let i = 1; i < values.length; i += 1) {
      level = alpha * values[i] + (1 - alpha) * level;
    }
    return level;
  };

  const routeMap = new Map();

  items.forEach((incident) => {
    if (!routeMap.has(incident.route)) {
      routeMap.set(incident.route, []);
    }
    routeMap.get(incident.route).push(incident);
  });

  return Array.from(routeMap.entries())
    .map(([route, routeIncidents]) => {
      const recent = routeIncidents.filter((item) => {
        const date = new Date(item.date);
        return date >= windowStart && date <= now;
      });

      const dayBuckets = new Map();
      recent.forEach((item) => {
        const key = dateKey(new Date(item.date));
        if (!dayBuckets.has(key)) {
          dayBuckets.set(key, { cuts: 0, downtime: 0 });
        }
        const row = dayBuckets.get(key);
        row.cuts += 1;
        row.downtime += item.downtimeMin;
      });

      const dailyCuts = [];
      const dailyDowntime = [];
      for (let offset = windowDays - 1; offset >= 0; offset -= 1) {
        const day = new Date(now);
        day.setDate(now.getDate() - offset);
        const key = dateKey(day);
        const row = dayBuckets.get(key) || { cuts: 0, downtime: 0 };
        dailyCuts.push(row.cuts);
        dailyDowntime.push(row.downtime);
      }

      const avgCutsPerDay = dailyCuts.reduce((sum, value) => sum + value, 0) / windowDays;
      const avgDowntimePerDay = dailyDowntime.reduce((sum, value) => sum + value, 0) / windowDays;
      const esCutsPerDay = smoothSeries(dailyCuts);
      const esDowntimePerDay = smoothSeries(dailyDowntime);

      const cutsPerDay = method === "exp" ? esCutsPerDay : avgCutsPerDay;
      const downtimePerDay = method === "exp" ? esDowntimePerDay : avgDowntimePerDay;

      return {
        route,
        forecastCuts30: Math.round(cutsPerDay * 30 * 10) / 10,
        forecastCuts90: Math.round(cutsPerDay * 90 * 10) / 10,
        forecastDowntime30: Math.round(downtimePerDay * 30),
        forecastDowntime90: Math.round(downtimePerDay * 90),
      };
    })
    .sort((a, b) => (b.forecastCuts90 - a.forecastCuts90) || (b.forecastDowntime90 - a.forecastDowntime90));
}

function calculateSummary(items) {
  const totalCuts = items.length;
  const totalDowntimeMin = items.reduce((sum, item) => sum + item.downtimeMin, 0);
  const actualDowntimeMin = items.filter((item) => !item.rerouted).reduce((sum, item) => sum + item.downtimeMin, 0);
  const reroutedCount = items.filter((item) => item.rerouted).length;
  const withDowntime = items.filter((item) => item.downtimeMin > 0 && !item.rerouted && !item.otnProtected).length;
  const protectedCount = items.filter((item) => item.otnProtected).length;
  const affectedLinks = items.reduce((sum, item) => sum + item.affectedLinks, 0);
  const avoidedDowntime = items.filter((item) => item.rerouted && item.downtimeMin === 0 && !item.otnProtected).length;

  return {
    totalCuts,
    totalDowntimeMin,
    actualDowntimeMin,
    reroutedCount,
    withDowntime,
    protectedCount,
    affectedLinks,
    avoidedDowntime,
    rerouteRate: totalCuts ? Math.round((reroutedCount / totalCuts) * 100) : 0,
    protectionRate: totalCuts ? Math.round((protectedCount / totalCuts) * 100) : 0,
  };
}

function generateNextId(allIncidents) {
  const year = new Date(CURRENT_DATE).getFullYear();
  const nums = allIncidents.map((item) => {
    const match = item.id.match(/^FC-\d{4}-(\d+)$/);
    return match ? Number.parseInt(match[1], 10) : 0;
  });
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `FC-${year}-${String(max + 1).padStart(3, "0")}`;
}

function filterIncidents(items, range, search, routeFilter) {
  const { start, end } = getDateRange(range);
  const query = search.trim().toLowerCase();

  return items.filter((incident) => {
    const date = new Date(incident.date);
    const inRange = date >= start && date <= end;
    const searchableText = [
      incident.id,
      incident.date,
      incident.route,
      incident.cutType,
      incident.site,
      incident.severity,
      incident.rerouted ? "rerouted" : "not rerouted",
      incident.otnProtected ? "protected" : "unprotected",
      `${incident.downtimeMin}min`,
      `${incident.capacityGbps}gbps`,
      `${incident.affectedLinks} links`,
    ].join(" ").toLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const matchesRoute = routeFilter === "all" || incident.route === routeFilter;

    return inRange && matchesSearch && matchesRoute;
  });
}

function runSelfTests() {
  const tests = [
    {
      name: "formatMinutes handles zero",
      test: () => formatMinutes(0) === "0m",
    },
    {
      name: "formatMinutes handles mixed hours and minutes",
      test: () => formatMinutes(73) === "1h 13m",
    },
    {
      name: "yearly range covers roughly one year",
      test: () => {
        const { start, end } = getDateRange("yearly");
        return end.getFullYear() - start.getFullYear() <= 1;
      },
    },
    {
      name: "filterIncidents finds route matches",
      test: () => filterIncidents(rawIncidents, "all", "paphos", "all").length > 0,
    },
    {
      name: "calculateSummary counts rerouted incidents",
      test: () => calculateSummary(rawIncidents).reroutedCount > 0,
    },
    {
      name: "calculateSummary total downtime sums all incidents",
      test: () => {
        const testData = [
          { downtimeMin: 30, rerouted: true, otnProtected: true, affectedLinks: 1 },
          { downtimeMin: 50, rerouted: false, otnProtected: false, affectedLinks: 1 },
        ];
        return calculateSummary(testData).totalDowntimeMin === 80;
      },
    },
    {
      name: "calculateSummary actual downtime excludes rerouted",
      test: () => {
        const testData = [
          { downtimeMin: 30, rerouted: true, otnProtected: true, affectedLinks: 1 },
          { downtimeMin: 50, rerouted: false, otnProtected: false, affectedLinks: 1 },
        ];
        return calculateSummary(testData).actualDowntimeMin === 50;
      },
    },
    {
      name: "buildTopRoutes returns at most six rows",
      test: () => buildTopRoutes(rawIncidents).length <= 6,
    },
    {
      name: "buildRouteForecast returns rows for routes",
      test: () => buildRouteForecast(rawIncidents, "sma").length > 0,
    },
    {
      name: "buildRouteForecast exponential mode returns rows for routes",
      test: () => buildRouteForecast(rawIncidents, "exp").length > 0,
    },
  ];

  const failures = tests.filter((t) => !t.test());
  if (failures.length > 0) {
    console.error("Self-tests failed:", failures.map((f) => f.name));
  } else {
    console.info("All dashboard self-tests passed.");
  }
}

// localStorage key for persisting incidents
const STORAGE_KEY = 'transport_metrics_incidents';

// Load incidents from localStorage or use defaults
const loadIncidents = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load incidents from localStorage:', e);
  }
  return rawIncidents;
};

// Save incidents to localStorage
const saveIncidents = (incidents) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (e) {
    console.warn('Failed to save incidents to localStorage:', e);
  }
};

export default function TransportFiberCutDashboard() {
  const [incidents, setIncidents] = useState(loadIncidents);
  const [range, setRange] = useState("monthly");
  const [forecastMethod, setForecastMethod] = useState("sma");
  const [topRouteMetric, setTopRouteMetric] = useState("cuts");
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [exportError, setExportError] = useState("");
  const [formMode, setFormMode] = useState("add");
  const [editingIncidentId, setEditingIncidentId] = useState("");
  const [formData, setFormData] = useState(emptyIncidentForm);
  const [formError, setFormError] = useState("");

  // Save incidents to localStorage whenever they change
  useEffect(() => {
    saveIncidents(incidents);
  }, [incidents]);

  useEffect(() => {
    runSelfTests();
  }, []);

  const routes = useMemo(() => ["all", ...Array.from(new Set(incidents.map((item) => item.route)))], [incidents]);

  const filtered = useMemo(
    () => filterIncidents(incidents, range, search, routeFilter),
    [incidents, range, search, routeFilter],
  );

  const summary = useMemo(() => calculateSummary(filtered), [filtered]);

  const previousFiltered = useMemo(() => {
    const previousRange = getPreviousDateRange(range);
    if (!previousRange) {
      return [];
    }

    const query = search.trim().toLowerCase();
    return incidents.filter((incident) => {
      const date = new Date(incident.date);
      const inRange = date >= previousRange.start && date <= previousRange.end;
      const searchableText = [
        incident.id,
        incident.date,
        incident.route,
        incident.cutType,
        incident.site,
        incident.severity,
        incident.rerouted ? "rerouted" : "not rerouted",
        incident.otnProtected ? "protected" : "unprotected",
        `${incident.downtimeMin}min`,
        `${incident.capacityGbps}gbps`,
        `${incident.affectedLinks} links`,
      ].join(" ").toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      const matchesRoute = routeFilter === "all" || incident.route === routeFilter;
      return inRange && matchesSearch && matchesRoute;
    });
  }, [incidents, range, search, routeFilter]);

  const trendData = useMemo(() => buildTrendData(filtered, range), [filtered, range]);

  const rerouteData = useMemo(() => ([
    { name: "Rerouted via OTN/MPLS", value: filtered.filter((item) => item.rerouted).length },
    { name: "Service downtime", value: filtered.filter((item) => item.downtimeMin > 0 && !item.otnProtected && !item.rerouted).length },
    { name: "Protected paths", value: filtered.filter((item) => item.otnProtected).length },
    { name: "Unprotected", value: filtered.filter((item) => !item.otnProtected).length },
  ]), [filtered]);

  const routeDeltaMap = useMemo(
    () => buildRouteDeltaMap(filtered, previousFiltered),
    [filtered, previousFiltered],
  );

  const topRoutes = useMemo(
    () => buildTopRoutes(filtered, topRouteMetric, routeDeltaMap),
    [filtered, topRouteMetric, routeDeltaMap],
  );

  const forecastSource = useMemo(
    () => filterIncidents(incidents, "all", search, routeFilter),
    [incidents, search, routeFilter],
  );

  const routeForecast = useMemo(
    () => buildRouteForecast(forecastSource, forecastMethod),
    [forecastSource, forecastMethod],
  );

  const resetFormToAdd = () => {
    setFormMode("add");
    setEditingIncidentId("");
    setFormData(emptyIncidentForm);
    setFormError("");
  };

  const buildIncidentFromForm = (id) => ({
    id,
    date: formData.date,
    route: formData.route.trim(),
    cutType: formData.cutType.trim(),
    downtimeMin: Number.parseInt(formData.downtimeMin, 10),
    capacityGbps: Number.parseInt(formData.capacityGbps, 10),
    rerouted: formData.rerouted === "true",
    otnProtected: formData.otnProtected === "true",
  });

  const validateForm = (candidate) => {
    if (!candidate.date || !candidate.route || !candidate.cutType) {
      return "Please fill all required fields.";
    }

    if (![candidate.downtimeMin, candidate.capacityGbps].every((value) => Number.isFinite(value) && value >= 0)) {
      return "Downtime and capacity must be zero or positive numbers.";
    }

    if (formMode === "add" && incidents.some((item) => item.id === candidate.id)) {
      return "Incident ID already exists. Use a unique ID.";
    }

    return "";
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const id = formMode === "add" ? generateNextId(incidents) : formData.id;
    const candidate = buildIncidentFromForm(id);
    const validationError = validateForm(candidate);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (formMode === "edit") {
      setIncidents((current) => current.map((item) => (item.id === editingIncidentId ? candidate : item)));
      resetFormToAdd();
      return;
    }

    setIncidents((current) => [candidate, ...current]);
    setFormData(emptyIncidentForm);
    setFormError("");
  };

  const startEditIncident = (incident) => {
    setFormMode("edit");
    setEditingIncidentId(incident.id);
    setFormError("");
    setFormData({
      id: incident.id,
      date: incident.date,
      route: incident.route,
      cutType: incident.cutType,
      downtimeMin: String(incident.downtimeMin),
      capacityGbps: String(incident.capacityGbps),
      rerouted: String(incident.rerouted),
      otnProtected: String(incident.otnProtected),
    });
  };

  const deleteIncident = (incidentId) => {
    setIncidents((current) => current.filter((item) => item.id !== incidentId));
    if (editingIncidentId === incidentId) {
      resetFormToAdd();
    }
  };

  const exportPdf = () => {
    try {
      setExportError("");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const left = 14;
      const right = pageWidth - 14;
      const bottom = pageHeight - 14;
      let y = 16;

      const addPageIfNeeded = (requiredHeight = 8) => {
        if (y + requiredHeight > bottom) {
          pdf.addPage();
          y = 16;
        }
      };

      const writeLine = (text, options = {}) => {
        const {
          size = 10,
          weight = "normal",
          indent = 0,
          gapAfter = 5,
        } = options;

        pdf.setFont("helvetica", weight);
        pdf.setFontSize(size);
        const lines = pdf.splitTextToSize(String(text), right - left - indent);
        const lineHeight = size * 0.45 + 2;
        addPageIfNeeded(lines.length * lineHeight + gapAfter);
        pdf.text(lines, left + indent, y);
        y += lines.length * lineHeight + gapAfter;
      };

      const drawRule = () => {
        addPageIfNeeded(4);
        pdf.setDrawColor(180);
        pdf.line(left, y, right, y);
        y += 5;
      };

      pdf.setProperties({
        title: `Fiber Cut Dashboard - ${range}`,
        subject: "Transport resilience and fiber cut metrics",
        author: "Transport Metrics Dashboard",
      });

      writeLine("Transport Metrics Report", { size: 18, weight: "bold", gapAfter: 2 });
      writeLine("Fiber cuts, downtime exposure, and transport protection value", { size: 11, gapAfter: 6 });
      writeLine(`Reporting view: ${range.toUpperCase()}`, { size: 10, weight: "bold", gapAfter: 1 });
      writeLine(`Generated on ${new Date(CURRENT_DATE).toLocaleDateString("en-GB")}`, { size: 9, gapAfter: 6 });

      drawRule();
      writeLine("Key Metrics", { size: 13, weight: "bold", gapAfter: 3 });
      writeLine(`Fiber cuts: ${summary.totalCuts}`);
      writeLine(`Total downtime: ${formatMinutes(summary.totalDowntimeMin)}`);
      writeLine(`Actual downtime: ${formatMinutes(summary.actualDowntimeMin)}`);
      writeLine(`Reroute success: ${summary.rerouteRate}% (${summary.reroutedCount} incidents)`);
      writeLine(`Incidents with downtime: ${summary.withDowntime}`);

      drawRule();
      writeLine("Service Continuity Profile", { size: 13, weight: "bold", gapAfter: 3 });
      rerouteData.forEach((item) => {
        writeLine(`${item.name}: ${item.value}`);
      });

      drawRule();
      writeLine("Incidents in Selected Timeframe", { size: 13, weight: "bold", gapAfter: 3 });
      if (filtered.length === 0) {
        writeLine("No incidents found for the selected filters.");
      } else {
        filtered.forEach((incident) => {
          writeLine(`${incident.id} | ${incident.date} | ${incident.route} | ${incident.cutType} | Downtime: ${formatMinutes(incident.downtimeMin)} | ${incident.rerouted ? "Rerouted" : "Not rerouted"} | ${incident.otnProtected ? "Protected" : "Unprotected"}`);
        });
      }

      pdf.save(`fiber-cut-dashboard-${range}.pdf`);
    } catch (error) {
      console.error(error);
      setExportError("PDF export failed. The dashboard remains usable, but the export step could not complete.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <div className="hero-panel">
          <div className="hero-layout">
            <div className="hero-copy">
              <div className="hero-badges">
                <Badge>Transport Resilience Dashboard</Badge>
                <Badge variant="outline">Fiber Cut Analytics</Badge>
              </div>
              <h1 className="hero-title">Transport Metrics</h1>
              <p className="hero-subtitle">
                Track fiber cuts, downtime exposure, protected versus unprotected routes, reroute success, and service continuity metrics to justify transport platform investment.
              </p>
            </div>
            <div className="hero-tools">
              <div className="search-field">
                <Search className="search-icon" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="       Search route, site, incident..."
                  className="search-input"
                />
              </div>
              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="ui-select route-select"
              >
                {routes.map((route) => (
                  <option key={route} value={route}>
                    {route === "all" ? "All routes" : route}
                  </option>
                ))}
              </select>
              <Button onClick={exportPdf} className="button-with-icon">
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>

          <div className="range-row">
            <Tabs value={range} onValueChange={setRange}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="all">All time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {exportError ? (
            <div className="feedback feedback--error">
              {exportError}
            </div>
          ) : null}
        </div>

        <div className="metrics-grid">
          <MetricCard title="Fiber cuts" value={summary.totalCuts} description="Total incidents in selected range" icon={AlertTriangle} />
          <MetricCard title="Total downtime" value={formatMinutes(summary.totalDowntimeMin)} description="Sum of all fiber cut downtime" icon={Clock3} />
          <MetricCard title="Actual downtime" value={formatMinutes(summary.actualDowntimeMin)} description="Downtime from non-rerouted incidents only" icon={Clock3} />
          <MetricCard title="Reroute success" value={`${summary.rerouteRate}%`} description={`${summary.reroutedCount} incidents rerouted through transport`} icon={ShieldCheck} />
          <MetricCard title="Incidents with downtime" value={summary.withDowntime} description="Incidents that caused actual service downtime" icon={Cable} />
          <MetricCard title="Gain from OTN" value={formatMinutes(summary.totalDowntimeMin - summary.actualDowntimeMin)} description="Downtime avoided via OTN transport rerouting" icon={TrendingUp} />
        </div>

        <div className="content-grid content-grid--three">
          <Card className="chart-card chart-card--wide">
            <CardHeader>
              <CardTitle className="title-with-icon"><TrendingUp className="h-5 w-5" /> Incident trend and downtime</CardTitle>
              <CardDescription>Resilience over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-frame">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cuts" name="Fiber cuts" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    <Area yAxisId="right" type="monotone" dataKey="downtime" name="Downtime (min)" fill="#94a3b8" fillOpacity={0.3} stroke="#64748b" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="chart-card">
            <CardHeader>
              <CardTitle className="title-with-icon"><Activity className="h-5 w-5" /> Service continuity profile</CardTitle>
              <CardDescription>Protected versus unprotected outcome mix.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-frame">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={rerouteData} dataKey="value" nameKey="name" outerRadius={105} label>
                      {rerouteData.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Top routes by cut frequency</CardTitle>
            <CardDescription>Rank routes by cuts, downtime, or weighted risk with recurrence and protection context.</CardDescription>
            <div className="action-group">
              <Button
                type="button"
                size="sm"
                variant={topRouteMetric === "cuts" ? "default" : "outline"}
                onClick={() => setTopRouteMetric("cuts")}
              >
                Rank by cuts
              </Button>
              <Button
                type="button"
                size="sm"
                variant={topRouteMetric === "downtime" ? "default" : "outline"}
                onClick={() => setTopRouteMetric("downtime")}
              >
                Rank by downtime
              </Button>
              <Button
                type="button"
                size="sm"
                variant={topRouteMetric === "risk" ? "default" : "outline"}
                onClick={() => setTopRouteMetric("risk")}
              >
                Rank by risk
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="table-wrap">
              <table className="incident-table">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Cuts</th>
                    <th>Downtime</th>
                    <th>Risk</th>
                    <th>Trend</th>
                    <th>Recurrence 90d</th>
                    <th>Protected %</th>
                    <th>Unprotected Gbps</th>
                    <th>Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {topRoutes.map((row) => (
                    <tr key={row.route}>
                      <td className="cell-strong">{row.route}</td>
                      <td>{row.cuts}</td>
                      <td>{formatMinutes(row.downtime)}</td>
                      <td>{row.riskScore}</td>
                      <td>{`${row.cutsDelta >= 0 ? "+" : ""}${row.cutsDelta} cuts / ${row.downtimeDelta >= 0 ? "+" : ""}${row.downtimeDelta}m`}</td>
                      <td>{row.recurrence90d}</td>
                      <td>{row.protectionRate}%</td>
                      <td>{row.unprotectedCapacityGbps}</td>
                      <td>{`${row.contributionCuts}% cuts | ${row.contributionDowntime}% downtime`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Route forecast layer (30/90 days)</CardTitle>
            <CardDescription>
              {forecastMethod === "sma"
                ? "Simple moving average forecast based on the most recent 90 days per route."
                : "Exponential smoothing forecast (alpha 0.35) with higher weight on recent daily behavior."}
            </CardDescription>
            <div className="action-group">
              <Button
                type="button"
                size="sm"
                variant={forecastMethod === "sma" ? "default" : "outline"}
                onClick={() => setForecastMethod("sma")}
              >
                Simple moving average
              </Button>
              <Button
                type="button"
                size="sm"
                variant={forecastMethod === "exp" ? "default" : "outline"}
                onClick={() => setForecastMethod("exp")}
              >
                Exponential smoothing
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="table-wrap">
              <table className="incident-table">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Cuts (next 30d)</th>
                    <th>Cuts (next 90d)</th>
                    <th>Downtime (next 30d)</th>
                    <th>Downtime (next 90d)</th>
                  </tr>
                </thead>
                <tbody>
                  {routeForecast.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No route forecast available for the current filters.</td>
                    </tr>
                  ) : routeForecast.map((item) => (
                    <tr key={item.route}>
                      <td className="cell-strong">{item.route}</td>
                      <td>{item.forecastCuts30}</td>
                      <td>{item.forecastCuts90}</td>
                      <td>{formatMinutes(item.forecastDowntime30)}</td>
                      <td>{formatMinutes(item.forecastDowntime90)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="register-card">
          <CardHeader>
            <CardTitle>Incident register</CardTitle>
            <CardDescription>Each record should come from your fault management, NMS, OTN alarms, and field repair reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="incident-form">
              <div className="form-head">
                <p className="form-title">
                  {formMode === "edit" ? `Editing incident ${editingIncidentId}` : "Add new incident"}
                </p>
                {formMode === "edit" ? (
                  <Button type="button" variant="outline" onClick={resetFormToAdd}>Cancel Edit</Button>
                ) : null}
              </div>

              <div className="form-grid">
                {formMode === "edit" ? (
                  <Input
                    value={formData.id}
                    readOnly
                    placeholder="Incident ID"
                  />
                ) : null}
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((current) => ({ ...current, date: e.target.value }))}
                  required
                />
                <Input
                  value={formData.route}
                  onChange={(e) => setFormData((current) => ({ ...current, route: e.target.value }))}
                  placeholder="Route"
                  required
                />
                <Input
                  value={formData.cutType}
                  onChange={(e) => setFormData((current) => ({ ...current, cutType: e.target.value }))}
                  placeholder="Cause"
                  required
                />
                <Input
                  type="number"
                  min="0"
                  value={formData.downtimeMin}
                  onChange={(e) => setFormData((current) => ({ ...current, downtimeMin: e.target.value }))}
                  placeholder="Downtime (min)"
                  required
                />
                <Input
                  type="number"
                  min="0"
                  value={formData.capacityGbps}
                  onChange={(e) => setFormData((current) => ({ ...current, capacityGbps: e.target.value }))}
                  placeholder="Capacity (Gbps)"
                  required
                />
                <select
                  value={formData.rerouted}
                  onChange={(e) => setFormData((current) => ({ ...current, rerouted: e.target.value }))}
                  className="ui-select"
                >
                  <option value="true">Rerouted: Yes</option>
                  <option value="false">Rerouted: No</option>
                </select>
                <select
                  value={formData.otnProtected}
                  onChange={(e) => setFormData((current) => ({ ...current, otnProtected: e.target.value }))}
                  className="ui-select"
                >
                  <option value="true">Protected</option>
                  <option value="false">Unprotected</option>
                </select>
              </div>

              {formError ? <p className="feedback feedback--error">{formError}</p> : null}

              <div className="form-actions">
                <Button type="submit" className="button-with-icon">
                  {formMode === "edit" ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {formMode === "edit" ? "Save changes" : "Add incident"}
                </Button>
              </div>
            </form>

            <div className="table-wrap">
              <table className="incident-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Incident</th>
                    <th>Route</th>
                    <th>Downtime</th>
                    <th>Rerouted</th>
                    <th>Protection</th>
                    <th>Capacity</th>
                    <th>Cause</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td className="cell-strong">{item.id}</td>
                      <td>{item.route}</td>
                      <td>{formatMinutes(item.downtimeMin)}</td>
                      <td>{item.rerouted ? "Yes" : "No"}</td>
                      <td>{item.otnProtected ? "Protected" : "Unprotected"}</td>
                      <td>{item.capacityGbps}G</td>
                      <td>{item.cutType}</td>
                      <td>
                        <div className="action-group">
                          <Button type="button" variant="outline" size="sm" onClick={() => startEditIncident(item)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="button-danger" onClick={() => deleteIncident(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, description, icon: Icon }) {
  return (
    <Card className="metric-card">
      <CardContent>
        <div className="metric-row">
          <div>
            <p className="metric-label">{title}</p>
            <p className="metric-value">{value}</p>
            <p className="metric-description">{description}</p>
          </div>
          <div className="metric-icon-wrap">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
