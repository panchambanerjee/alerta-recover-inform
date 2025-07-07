import { useState, useEffect } from "react";
import { SystemOverview } from "@/components/SystemOverview";
import { AlertsPanel } from "@/components/AlertsPanel";
import { EscalationHistory } from "@/components/EscalationHistory";
import { MetricsCard } from "@/components/MetricsCard";
import { Activity, Clock, CheckCircle, AlertTriangle } from "lucide-react";

// Mock data - replace with actual API calls
const mockSystemStatus = {
  idmc: {
    secureAgents: 8,
    running: 7,
    status: "warning" as const
  },
  powerCenter: {
    services: 12,
    workflows: 45,
    status: "online" as const
  },
  coordinator: {
    status: "online" as const,
    lastHeartbeat: "2 minutes ago"
  }
};

const mockAlerts = [
  {
    id: "alert-001",
    timestamp: "2024-01-15 14:30:22",
    source: "PROD-AGENT-01",
    type: "IDMC" as const,
    severity: "critical" as const,
    message: "Secure Agent connection lost - attempting reconnection",
    status: "recovering" as const,
    recoveryAttempts: 2
  },
  {
    id: "alert-002",
    timestamp: "2024-01-15 14:25:15",
    source: "ETL-WORKFLOW-05",
    type: "PowerCenter" as const,
    severity: "warning" as const,
    message: "Workflow execution time exceeding threshold (45 minutes)",
    status: "active" as const,
    recoveryAttempts: 0
  }
];

const mockEscalations = [
  {
    id: "esc-001",
    timestamp: "2024-01-15 14:35:00",
    alertId: "alert-001",
    level: 2,
    levelName: "On-Call + Manager",
    recipients: ["oncall@company.com", "manager@company.com"],
    status: "sent" as const,
    reason: "Automatic recovery failed after 3 attempts"
  }
];

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState(mockSystemStatus);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [escalations, setEscalations] = useState(mockEscalations);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update last heartbeat
      setSystemStatus(prev => ({
        ...prev,
        coordinator: {
          ...prev.coordinator,
          lastHeartbeat: Math.floor(Math.random() * 5) + 1 + " minutes ago"
        }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-monitoring-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Informatica Monitoring Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring, recovery, and escalation system
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Last Updated</div>
            <div className="text-sm font-medium">{new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* System Overview */}
        <SystemOverview systemStatus={systemStatus} />

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Alerts Today"
            value={15}
            description="3 critical, 8 warnings"
            icon={AlertTriangle}
            trend={{ value: -12, label: "vs yesterday", positive: true }}
          />
          <MetricsCard
            title="Recovery Success Rate"
            value="87%"
            description="Last 24 hours"
            icon={CheckCircle}
            trend={{ value: 5, label: "vs last week", positive: true }}
          />
          <MetricsCard
            title="Avg Response Time"
            value="2.3min"
            description="Alert to recovery"
            icon={Clock}
            trend={{ value: -8, label: "vs last week", positive: true }}
          />
          <MetricsCard
            title="System Uptime"
            value="99.8%"
            description="Last 30 days"
            icon={Activity}
            trend={{ value: 0.2, label: "vs last month", positive: true }}
          />
        </div>

        {/* Alerts and Escalation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsPanel alerts={alerts} />
          <EscalationHistory escalations={escalations} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;