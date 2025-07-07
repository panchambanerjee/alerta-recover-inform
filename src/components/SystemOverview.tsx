import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { Activity, Database, Settings } from "lucide-react";

interface SystemStatus {
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

interface SystemOverviewProps {
  systemStatus: SystemStatus;
}

export function SystemOverview({ systemStatus }: SystemOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-monitoring-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">IDMC Secure Agents</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <StatusIndicator 
              status={systemStatus.idmc.status} 
              label={`${systemStatus.idmc.running}/${systemStatus.idmc.secureAgents} Running`}
            />
            <p className="text-xs text-muted-foreground">
              {systemStatus.idmc.running} of {systemStatus.idmc.secureAgents} agents operational
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-monitoring-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PowerCenter</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <StatusIndicator 
              status={systemStatus.powerCenter.status} 
              label={`${systemStatus.powerCenter.services} Services`}
            />
            <p className="text-xs text-muted-foreground">
              {systemStatus.powerCenter.workflows} workflows monitored
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-monitoring-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recovery Coordinator</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <StatusIndicator 
              status={systemStatus.coordinator.status} 
              label="Coordinator Active"
            />
            <p className="text-xs text-muted-foreground">
              Last heartbeat: {systemStatus.coordinator.lastHeartbeat}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}