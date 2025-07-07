import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "./StatusIndicator";
import { Clock, AlertTriangle } from "lucide-react";

interface Alert {
  id: string;
  timestamp: string;
  source: string;
  type: "IDMC" | "PowerCenter" | "System";
  severity: "critical" | "warning" | "info";
  message: string;
  status: "active" | "recovering" | "resolved";
  recoveryAttempts: number;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "warning": return "warning";
      case "info": return "info";
      default: return "secondary";
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active": return "critical";
      case "recovering": return "warning";
      case "resolved": return "online";
      default: return "offline";
    }
  };

  return (
    <Card className="bg-monitoring-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Active Alerts
          <Badge variant="secondary" className="ml-auto">
            {alerts.filter(a => a.status === "active").length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active alerts
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIndicator 
                      status={getStatusIndicator(alert.status)} 
                      label={alert.source}
                    />
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {alert.timestamp}
                  </div>
                </div>
                <p className="text-sm">{alert.message}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Type: {alert.type}</span>
                  <span>Recovery attempts: {alert.recoveryAttempts}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}