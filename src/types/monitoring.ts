export interface SystemStatus {
  idmc: {
    secureAgents: number;
    running: number;
    status: "online" | "warning" | "critical" | "offline";
  };
  powerCenter: {
    services: number;
    workflows: number;
    status: "online" | "warning" | "critical" | "offline";
  };
  coordinator: {
    status: "online" | "warning" | "critical" | "offline";
    lastHeartbeat: string;
  };
}

export interface Alert {
  id: string;
  timestamp: string;
  source: string;
  type: "IDMC" | "PowerCenter" | "System";
  severity: "critical" | "warning" | "info";
  message: string;
  status: "active" | "recovering" | "resolved";
  recoveryAttempts: number;
}

export interface Escalation {
  id: string;
  timestamp: string;
  alertId: string;
  level: number;
  levelName: string;
  recipients: string[];
  status: "sent" | "failed" | "acknowledged";
  reason: string;
}

export interface Metrics {
  timestamp: string;
  totalAlertsToday: number;
  criticalAlerts: number;
  warningAlerts: number;
  recoverySuccessRate: number;
  avgResponseTime: number;
  systemUptime: number;
}