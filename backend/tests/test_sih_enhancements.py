from fastapi.testclient import TestClient

from app.auth import AuthUser, require_reviewer, require_user
from app.field_reports import InMemoryFieldReportStore
from app.main import app, get_field_report_store
from app.ml_prediction import predict_disruption


def test_in_memory_stores_fallback(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    app.dependency_overrides[require_user] = lambda: AuthUser(
        id="demo-user-1", role="admin", email="admin@raahsetu.in"
    )
    try:
        with TestClient(app) as client:
            alerts = client.get("/api/v1/alerts")
            assert alerts.status_code == 200
            assert len(alerts.json()) >= 3

            connectivity = client.get("/api/v1/connectivity")
            assert connectivity.status_code == 200
            assert len(connectivity.json()) == 8

            positions = client.get("/api/v1/fleet/positions")
            assert positions.status_code == 200
            assert len(positions.json()) >= 2

            vehicles = client.get("/api/v1/fleet/vehicles")
            assert vehicles.status_code == 200
            assert len(vehicles.json()) >= 3

            deliveries = client.get("/api/v1/deliveries")
            assert deliveries.status_code == 200
            assert len(deliveries.json()) >= 2
    finally:
        app.dependency_overrides.clear()


def test_live_weather_telemetry(monkeypatch):
    from unittest.mock import MagicMock
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "current": {"temperature_2m": 26.5, "relative_humidity_2m": 82, "precipitation": 14.2, "wind_speed_10m": 11.0},
        "daily": {"precipitation_sum": [14.2]},
    }
    monkeypatch.setattr("httpx.get", lambda *args, **kwargs: mock_resp)

    with TestClient(app) as client:
        res = client.get("/api/v1/weather/live")
        assert res.status_code == 200
        assert "stations" in res.json()
        assert len(res.json()["stations"]) == 8

        assam_weather = client.get("/api/v1/weather/live?region_code=assam").json()
        assert assam_weather["station"] == "Guwahati"
        assert assam_weather["temperature_c"] == 26.5
        assert assam_weather["precipitation_mm_24h"] == 14.2
        assert assam_weather["source"] == "Open-Meteo forecast API"
        assert assam_weather["fresh"] is True

        bootstrap = client.get("/api/v1/bootstrap?dataset=osm-northeast").json()
        northeast = next(
            dataset
            for dataset in bootstrap["available_datasets"]
            if dataset["id"] == "osm-northeast"
        )
        assert northeast["is_synthetic"] is True

def test_ml_disruption_logic():
    # Dry flat road
    benign = predict_disruption(rainfall_mm_24h=2.0, slope_deg=3.0, historical_incidents=0, surface_score=0.9)
    assert benign.disruption_probability < 0.25
    assert benign.risk_level == "LOW"

    # Extreme monsoon rainfall on steep mountain ghat with prior slides
    critical = predict_disruption(
        rainfall_mm_24h=120.0,
        slope_deg=42.0,
        historical_incidents=3,
        surface_score=0.3,
        elevation_m=2400.0,
    )
    assert critical.disruption_probability > 0.85
    assert critical.risk_level == "CRITICAL"
    assert len(critical.primary_factors) >= 2
    factor_names = [f["factor"] for f in critical.primary_factors]
    assert any("Precipitation" in f for f in factor_names)


def test_bridge_weight_filtering_in_northeast():
    with TestClient(app) as client:
        # Route comparison on Northeast graph
        res = client.post(
            "/api/v1/routes/compare",
            json={
                "dataset_id": "osm-northeast",
                "origin": {"node_id": "guwahati"},
                "destination": {"node_id": "imphal"},
                "vehicle": "heavy",
                "strict_vehicle": True,
            },
        )
        assert res.status_code == 200
        data = res.json()
        assert len(data["routes"]) == 2
        fastest = data["routes"][0]
        assert fastest["status"] == "available"


def test_hazard_verification_workflow_blocks_only_when_verified():
    # Keep this workflow test deterministic and independent of Supabase Auth
    # users.  The Postgres store requires reporter/reviewer UUIDs that exist in
    # auth.users; the endpoint path is separately covered by the live smoke
    # checks, while this test focuses on verification semantics.
    store = InMemoryFieldReportStore()
    app.dependency_overrides[get_field_report_store] = lambda: store
    # Create a report with pending status
    report_data = {
        "client_report_id": "sih-test-driver-report-01",
        "region_code": "assam",
        "district": "Kamrup",
        "place_name": "Jalukbari",
        "kind": "landslide",
        "accessibility_status": "blocked",
        "severity": 0.9,
        "lon": 91.66,
        "lat": 26.15,
        "description": "Unverified driver report of small rockfall",
        "observed_at": "2026-09-07T08:00:00Z",
    }
    app.dependency_overrides[require_user] = lambda: AuthUser(id="reporter-1", role="field_official")
    app.dependency_overrides[require_reviewer] = lambda: AuthUser(id="reviewer-1", role="reviewer")

    try:
        with TestClient(app) as client:
            created = client.post("/api/v1/field-reports", json=report_data).json()
            assert created["review_status"] in {"pending", "corroborated"}

            # Before authority verification, active_events does not contain it as authority_verified block
            active = store.active_events("assam")
            blocked_events = [e for e in active if e.get("review_status") == "authority_verified"]
            assert not any(e.get("source_report_id") == created["id"] for e in blocked_events)

            # Review and accept with SDRF edge match
            reviewed = client.patch(
                f"/api/v1/field-reports/{created['id']}/review",
                json={
                    "decision": "accepted",
                    "review_note": "SDRF verified highway debris; carriageway closed.",
                    "dataset_id": "osm-northeast",
                    "edge_id": "guwahati>dispur",
                },
            )
            assert reviewed.status_code == 200
            assert reviewed.json()["review_status"] == "authority_verified"

            # Now active_events has the verified event
            active_after = store.active_events("assam")
            assert any(e.get("review_status") == "authority_verified" for e in active_after)
    finally:
        app.dependency_overrides.clear()
