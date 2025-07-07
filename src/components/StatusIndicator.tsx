import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "warning" | "critical" | "offline";
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: "bg-status-online",
      text: "text-status-online",
      pulse: "animate-pulse"
    },
    warning: {
      color: "bg-status-warning",
      text: "text-status-warning",
      pulse: "animate-pulse"
    },
    critical: {
      color: "bg-status-critical",
      text: "text-status-critical",
      pulse: "animate-pulse"
    },
    offline: {
      color: "bg-status-offline",
      text: "text-status-offline",
      pulse: ""
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn("w-3 h-3 rounded-full", config.color)} />
        {status !== "offline" && (
          <div className={cn("absolute inset-0 w-3 h-3 rounded-full", config.color, "opacity-75", config.pulse)} />
        )}
      </div>
      <span className={cn("text-sm font-medium", config.text)}>{label}</span>
    </div>
  );
}