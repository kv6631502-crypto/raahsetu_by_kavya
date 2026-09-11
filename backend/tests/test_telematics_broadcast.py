"""Tests for AIS-140 Telematics, Alert Broadcast, and Official Live Feeds."""

from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_alert_providers_endpoint():
    res = client.get("/api/v1/alerts/providers")
    assert res.status_code == 200
    data = res.json()
    assert "active_provider" in data
    assert "gateways" in data
    assert "provider_ready_simulator" in data["gateways"]
    assert "en" in data["supported_languages"]


def test_hazards_live_feeds_endpoint():
    res = client.get("/api/v1/hazards/live-feeds")
    assert res.status_code == 200
    data = res.json()
    assert "sources" in data
    assert len(data["sources"]) >= 3
    assert "active_advisories" in data
    assert any("IMD" in s["agency"] for s in data["sources"])


def test_broadcast_alert_endpoint():
    payload = {
        "corridor": "Guwahati-Tawang Corridor (NH-13)",
        "template_type": "hazard_alert",
        "language": "hi",
        "recipients": ["+91-94350-12345 (AS-01-GB-4821)"],
        "template_params": {
            "corridor": "NH-13 Sela Pass",
            "incident": "बर्फबारी और भूस्खलन",
        },
    }
    res = client.post("/api/v1/alerts/broadcast", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["broadcast_id"].startswith("bc-")
    assert data["language"] == "hi"
    assert "भूस्खलन" in data["message_body"]
    assert data["recipient_count"] == 1
    assert data["deliveries"][0]["status"] in {"SIMULATED_SUCCESS", "DELIVERED"}


def test_ais140_telemetry_ingestion():
    packet = {
        "imei": "868204041234567",
        "vehicle_registration": "AS-01-GB-4821",
        "timestamp": datetime.now(UTC).isoformat(),
        "latitude": 26.1445,
        "longitude": 91.7362,
        "speed_kph": 52.0,
        "heading_deg": 88.0,
        "altitude_m": 65.0,
        "gps_fix": True,
        "ignition_on": True,
        "emergency_state": False,
        "tamper_alert": False,
        "metadata": {"source": "AIS-140 Hardware Test"},
    }
    res = client.post("/api/v1/fleet/telemetry/ais140", json=packet)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in {"ingested", "warning"}
    assert data["vehicle_id"] == "AS-01-GB-4821"
    assert data["speed_kph"] == 52.0


def test_ais140_proximity_warning():
    # Coords close to Sela Pass (27.50, 92.10)
    packet = {
        "imei": "868204041234567",
        "vehicle_registration": "AS-01-GB-4821",
        "timestamp": datetime.now(UTC).isoformat(),
        "latitude": 27.501,
        "longitude": 92.101,
        "speed_kph": 30.0,
        "heading_deg": 45.0,
        "altitude_m": 4100.0,
        "gps_fix": True,
        "ignition_on": True,
        "emergency_state": False,
    }
    res = client.post("/api/v1/fleet/telemetry/ais140", json=packet)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "warning"
    assert len(data["proximity_hazards"]) > 0
    assert "Sela Pass" in data["proximity_hazards"][0]["title"]
