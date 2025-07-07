import { SystemStatus, Alert, Escalation, Metrics } from "@/types/monitoring";

const API_BASE_URL = "http://localhost:8000"; // Change this to your Python backend URL

class MonitoringAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get current system status
  async getSystemStatus(): Promise<SystemStatus> {
    return this.request<SystemStatus>("/api/system-status");
  }

  // Update system status (called by your Python backend)
  async updateSystemStatus(status: SystemStatus): Promise<void> {
    await this.request("/api/system-status", {
      method: "POST",
      body: JSON.stringify(status),
    });
  }

  // Get active alerts
  async getAlerts(): Promise<Alert[]> {
    return this.request<Alert[]>("/api/alerts");
  }

  // Create new alert (called by your Python backend)
  async createAlert(alert: Alert): Promise<void> {
    await this.request("/api/alerts", {
      method: "POST",
      body: JSON.stringify(alert),
    });
  }

  // Update alert status
  async updateAlert(alertId: string, updates: Partial<Alert>): Promise<void> {
    await this.request(`/api/alerts/${alertId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Get escalation history
  async getEscalations(): Promise<Escalation[]> {
    return this.request<Escalation[]>("/api/escalations");
  }

  // Create escalation record (called by your Python backend)
  async createEscalation(escalation: Escalation): Promise<void> {
    await this.request("/api/escalations", {
      method: "POST",
      body: JSON.stringify(escalation),
    });
  }

  // Get current metrics
  async getMetrics(): Promise<Metrics> {
    return this.request<Metrics>("/api/metrics");
  }

  // Update metrics (called by your Python backend)
  async updateMetrics(metrics: Metrics): Promise<void> {
    await this.request("/api/metrics", {
      method: "POST",
      body: JSON.stringify(metrics),
    });
  }
}

export const monitoringApi = new MonitoringAPI();