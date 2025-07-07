# Informatica Monitoring Dashboard API Integration

## Overview
This document outlines the API endpoints your Python monitoring system should call to update the dashboard with real-time data.

## API Endpoints to Implement

### 1. System Status Updates
**POST** `/api/system-status`

Updates the overall system health status.

```json
{
  "timestamp": "2024-01-15T14:30:22Z",
  "idmc": {
    "secureAgents": 8,
    "running": 7,
    "status": "warning"
  },
  "powerCenter": {
    "services": 12,
    "workflows": 45,
    "status": "online"
  },
  "coordinator": {
    "status": "online",
    "lastHeartbeat": "2024-01-15T14:30:22Z"
  }
}
```

### 2. Alert Management
**POST** `/api/alerts`

Creates new alerts or updates existing ones.

```json
{
  "id": "alert-001",
  "timestamp": "2024-01-15T14:30:22Z",
  "source": "PROD-AGENT-01",
  "type": "IDMC", // "IDMC" | "PowerCenter" | "System"
  "severity": "critical", // "critical" | "warning" | "info"
  "message": "Secure Agent connection lost - attempting reconnection",
  "status": "active", // "active" | "recovering" | "resolved"
  "recoveryAttempts": 0
}
```

**PUT** `/api/alerts/{alertId}`

Updates alert status (e.g., when recovery is attempted).

```json
{
  "status": "recovering",
  "recoveryAttempts": 2,
  "lastRecoveryAttempt": "2024-01-15T14:32:00Z"
}
```

### 3. Escalation Events
**POST** `/api/escalations`

Records escalation events.

```json
{
  "id": "esc-001",
  "timestamp": "2024-01-15T14:35:00Z",
  "alertId": "alert-001",
  "level": 2,
  "levelName": "On-Call + Manager",
  "recipients": ["oncall@company.com", "manager@company.com"],
  "status": "sent", // "sent" | "failed" | "acknowledged"
  "reason": "Automatic recovery failed after 3 attempts"
}
```

### 4. Metrics Updates
**POST** `/api/metrics`

Updates dashboard metrics.

```json
{
  "timestamp": "2024-01-15T14:30:22Z",
  "totalAlertsToday": 15,
  "criticalAlerts": 3,
  "warningAlerts": 8,
  "recoverySuccessRate": 87,
  "avgResponseTime": 2.3,
  "systemUptime": 99.8
}
```

## Integration Points in Your Python Code

### 1. In your `system_monitor.py`
```python
import requests
import json

class DashboardAPI:
    def __init__(self, dashboard_url):
        self.base_url = dashboard_url
    
    def update_system_status(self, status_data):
        response = requests.post(
            f"{self.base_url}/api/system-status",
            json=status_data,
            headers={"Content-Type": "application/json"}
        )
        return response.status_code == 200
    
    def create_alert(self, alert_data):
        response = requests.post(
            f"{self.base_url}/api/alerts",
            json=alert_data,
            headers={"Content-Type": "application/json"}
        )
        return response.status_code == 200

# Usage in your monitor
dashboard_api = DashboardAPI("http://your-dashboard-url")

# When you detect an issue
alert_data = {
    "id": f"alert-{timestamp}",
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "source": agent_name,
    "type": "IDMC",
    "severity": "critical",
    "message": "Secure Agent connection lost",
    "status": "active",
    "recoveryAttempts": 0
}
dashboard_api.create_alert(alert_data)
```

### 2. In your `coordinator.py`
```python
# When starting recovery
dashboard_api.update_alert(alert_id, {
    "status": "recovering",
    "recoveryAttempts": attempt_count
})

# When escalating
escalation_data = {
    "id": f"esc-{timestamp}",
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "alertId": alert_id,
    "level": escalation_level,
    "levelName": escalation_config[escalation_level]["name"],
    "recipients": recipients,
    "status": "sent",
    "reason": escalation_reason
}
dashboard_api.create_escalation(escalation_data)
```

### 3. Periodic Status Updates
```python
# Run this every 30 seconds
def send_heartbeat():
    status_data = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "idmc": get_idmc_status(),
        "powerCenter": get_powerCenter_status(),
        "coordinator": {
            "status": "online",
            "lastHeartbeat": datetime.utcnow().isoformat() + "Z"
        }
    }
    dashboard_api.update_system_status(status_data)
```

## WebSocket Integration (Optional)
For real-time updates, consider implementing WebSocket connections:

```python
import websocket

class RealtimeDashboard:
    def __init__(self, ws_url):
        self.ws = websocket.WebSocket()
        self.ws.connect(ws_url)
    
    def send_realtime_update(self, event_type, data):
        message = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        self.ws.send(json.dumps(message))
```

## Error Handling
```python
def safe_api_call(func, *args, **kwargs):
    try:
        return func(*args, **kwargs)
    except requests.exceptions.RequestException as e:
        logging.error(f"Dashboard API call failed: {e}")
        # Store locally for retry later
        return False
```

## Configuration
Add to your Python configuration:

```python
# config.py
DASHBOARD_CONFIG = {
    "base_url": "http://your-dashboard-domain.com",
    "api_key": "your-api-key",  # If authentication is needed
    "timeout": 5,
    "retry_attempts": 3
}
```

This API design allows your Python monitoring system to feed real-time data to the dashboard while maintaining loose coupling between the systems.