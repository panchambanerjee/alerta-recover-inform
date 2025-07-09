import React, { useEffect, useState } from "react";
import { monitoringApi } from "@/services/monitoring-api";

export function ProcessStatusPanel() {
  const [status, setStatus] = useState<{ running: string[]; stopped: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    monitoringApi.getProcessStatus()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading process status...</div>;
  if (!status) return <div>Error loading process status.</div>;

  return (
    <div>
      <h2>Process Status</h2>
      <div>
        <strong>Running ({status.running.length}):</strong>
        <ul>
          {status.running.map(name => <li key={name} style={{ color: "green" }}>{name}</li>)}
        </ul>
      </div>
      <div>
        <strong>Stopped ({status.stopped.length}):</strong>
        <ul>
          {status.stopped.map(name => <li key={name} style={{ color: "red" }}>{name}</li>)}
        </ul>
      </div>
    </div>
  );
}