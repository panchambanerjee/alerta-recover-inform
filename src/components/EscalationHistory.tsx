import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Mail, Users } from "lucide-react";

interface EscalationEvent {
  id: string;
  timestamp: string;
  alertId: string;
  level: number;
  levelName: string;
  recipients: string[];
  status: "sent" | "failed" | "acknowledged";
  reason: string;
}

interface EscalationHistoryProps {
  escalations: EscalationEvent[];
}

export function EscalationHistory({ escalations }: EscalationHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "success";
      case "failed": return "destructive";
      case "acknowledged": return "info";
      default: return "secondary";
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "info";
      case 2: return "warning";
      case 3: return "destructive";
      case 4: return "critical";
      default: return "secondary";
    }
  };

  return (
    <Card className="bg-monitoring-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Escalation History
          <Badge variant="secondary" className="ml-auto">
            {escalations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {escalations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No escalations recorded
              </div>
            ) : (
              escalations.map((escalation) => (
                <div key={escalation.id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getLevelColor(escalation.level)} className="text-xs">
                        Level {escalation.level}
                      </Badge>
                      <span className="text-sm font-medium">{escalation.levelName}</span>
                    </div>
                    <Badge variant={getStatusColor(escalation.status)} className="text-xs">
                      {escalation.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{escalation.reason}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {escalation.timestamp}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {escalation.recipients.length} recipients
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Alert ID: {escalation.alertId}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}