import { useState, useEffect } from "react";
import { SystemOverview } from "@/components/SystemOverview";
import { AlertsPanel } from "@/components/AlertsPanel";
import { EscalationHistory } from "@/components/EscalationHistory";
import { MetricsCard } from "@/components/MetricsCard";
import { Activity, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { monitoringApi } from "@/services/monitoring-api";
import { SystemStatus, Alert, Escalation, Metrics } from "@/types/monitoring";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statusData, alertsData, escalationsData, metricsData] = await Promise.all([
          monitoringApi.getSystemStatus(),
          monitoringApi.getAlerts(),
          monitoringApi.getEscalations(),
          monitoringApi.getMetrics(),
        ]);

        setSystemStatus(statusData);
        setAlerts(alertsData);
        setEscalations(escalationsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to monitoring backend. Using offline mode.",
          variant: "destructive",
        });
        
        // Fallback to mock data if API fails
        setSystemStatus({
          idmc: { secureAgents: 8, running: 7, status: "warning" },
          powerCenter: { services: 12, workflows: 45, status: "online" },
          coordinator: { status: "offline", lastHeartbeat: "Connection lost" }
        });
        setAlerts([]);
        setEscalations([]);
        setMetrics({
          timestamp: new Date().toISOString(),
          totalAlertsToday: 0,
          criticalAlerts: 0,
          warningAlerts: 0,
          recoverySuccessRate: 0,
          avgResponseTime: 0,
          systemUptime: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [statusData, alertsData, escalationsData, metricsData] = await Promise.all([
          monitoringApi.getSystemStatus(),
          monitoringApi.getAlerts(),
          monitoringApi.getEscalations(),
          monitoringApi.getMetrics(),
        ]);

        setSystemStatus(statusData);
        setAlerts(alertsData);
        setEscalations(escalationsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to refresh data:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-monitoring-bg p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

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
        {systemStatus && <SystemOverview systemStatus={systemStatus} />}

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Alerts Today"
            value={metrics?.totalAlertsToday || 0}
            description={`${metrics?.criticalAlerts || 0} critical, ${metrics?.warningAlerts || 0} warnings`}
            icon={AlertTriangle}
            trend={{ value: -12, label: "vs yesterday", positive: true }}
          />
          <MetricsCard
            title="Recovery Success Rate"
            value={`${metrics?.recoverySuccessRate || 0}%`}
            description="Last 24 hours"
            icon={CheckCircle}
            trend={{ value: 5, label: "vs last week", positive: true }}
          />
          <MetricsCard
            title="Avg Response Time"
            value={`${metrics?.avgResponseTime || 0}min`}
            description="Alert to recovery"
            icon={Clock}
            trend={{ value: -8, label: "vs last week", positive: true }}
          />
          <MetricsCard
            title="System Uptime"
            value={`${metrics?.systemUptime || 0}%`}
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