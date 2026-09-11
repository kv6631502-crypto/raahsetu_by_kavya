from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient

from app.auth import AuthUser, require_reviewer, require_user
from app.main import app, get_field_report_store
from app.models import FieldReport


@pytest.fixture
def client(monkeypatch):
    monkeypatch.delenv("DATASET_PATH", raising=False)
    app.dependency_overrides[require_user] = lambda: AuthUser(
        id="22222222-2222-2222-2222-222222222222", role="field_official"
    )
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def test_full_journey(client):
    assert client.get("/health").status_code == 200
    boot = client.get("/api/v1/bootstrap").json()
    network = client.get("/api/v1/network").json()
    assert len(network["features"]) == boot["counts"]["edges"]
    assert network["metadata"]["returned_features"] == len(network["features"])
    result = client.post(
        "/api/v1/routes/compare",
        json={
            "origin": {"node_id": boot["dataset"]["default_origin"]},
            "destination": {"node_id": boot["dataset"]["default_destination"]},
        },
    )
    assert result.status_code == 200
    assert len(result.json()["routes"]) == 2
    assert result.json()["dataset_version"] == boot["dataset_version"]


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"origin": {"node_id": "unknown"}, "destination": {"node_id": "n2_6"}},
        {"origin": {"lat": 26}, "destination": {"node_id": "n2_6"}},
        {"origin": {"node_id": "n2_0"}, "destination": {"node_id": "n2_6"}, "risk_aversion": -1},
        {"origin": {"node_id": "n2_0"}, "destination": {"node_id": "n2_6"}, "vehicle": "spaceship"},
    ],
)
def test_invalid_input_returns_422(client, payload):
    assert client.post("/api/v1/routes/compare", json=payload).status_code == 422


def test_cors_restricted(client):
    response = client.options(
        "/api/v1/routes/compare",
        headers={"Origin": "https://unrelated.invalid", "Access-Control-Request-Method": "POST"},
    )
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers


def test_unknown_dataset_and_weather(client):
    assert client.get("/api/v1/bootstrap?dataset=../../etc").status_code == 404
    assert client.get("/api/v1/network?weather=invalid").status_code == 422
    assert client.get("/api/v1/terrain?dataset=demo").json() is None
    assert client.get("/api/v1/network?focus_node=unknown").status_code == 422


def test_accessibility_events_are_empty_in_demo_mode(client, monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    response = client.get("/api/v1/accessibility-events?region_code=assam")
    assert response.status_code == 200
    assert response.json() == {"events": []}


def test_data_status_is_safe_and_operationally_useful(client):
    response = client.get("/api/v1/data-status")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] in {"demo_only", "ready"}
    assert isinstance(payload["runtime_snapshots"], list)
    assert isinstance(payload["gaps"], list)


def test_fleet_position_validates_coordinates_before_store(client):
    response = client.post(
        "/api/v1/fleet/positions",
        json={
            "vehicle_id": "not-a-vehicle",
            "recorded_at": "2026-09-07T06:00:00Z",
            "lon": 181,
            "lat": 26,
        },
    )
    assert response.status_code == 422


def test_fleet_routes_require_authenticated_user():
    app.dependency_overrides.clear()
    try:
        with TestClient(app) as unauthenticated:
            assert unauthenticated.get("/api/v1/fleet/positions").status_code == 401
            assert unauthenticated.get("/api/v1/deliveries").status_code == 401
    finally:
        app.dependency_overrides.clear()


def test_network_response_is_bounded(client):
    response = client.get("/api/v1/network?limit=100").json()
    assert len(response["features"]) <= 100
    assert response["metadata"]["total_features"] >= len(response["features"])


class MemoryFieldReports:
    def __init__(self):
        self.reports = []

    def create(self, report, reporter_id):
        if self.reports:
            return self.reports[0]
        stored = FieldReport(
            id="11111111-1111-1111-1111-111111111111",
            **report.model_dump(),
            submitted_at=datetime.now(UTC),
            review_status="pending",
        )
        self.reports.append(stored)
        return stored

    def list(self, region_code, limit):
        matches = [r for r in self.reports if region_code is None or r.region_code == region_code]
        return matches[:limit]

    def review(self, report_id, review, reviewer_id):
        report = self.reports[0]
        updated = report.model_copy(update={"review_status": review.decision})
        self.reports[0] = updated
        return updated


def test_field_report_offline_idempotency_and_listing(client):
    store = MemoryFieldReports()
    app.dependency_overrides[get_field_report_store] = lambda: store
    payload = {
        "client_report_id": "device-17:report-001",
        "region_code": "assam",
        "district": "Kamrup Metropolitan",
        "place_name": "Jalukbari",
        "kind": "flood",
        "accessibility_status": "restricted",
        "severity": 0.7,
        "lon": 91.68,
        "lat": 26.16,
        "description": "Waterlogging restricts one carriageway.",
        "observed_at": "2026-09-07T06:00:00Z",
        "offline_created_at": "2026-09-07T06:01:00Z",
    }
    try:
        first = client.post("/api/v1/field-reports", json=payload)
        duplicate = client.post("/api/v1/field-reports", json=payload)
        listing = client.get("/api/v1/field-reports?region_code=assam")
    finally:
        app.dependency_overrides.pop(get_field_report_store, None)
    assert first.status_code == 201
    assert duplicate.json()["id"] == first.json()["id"]
    assert len(listing.json()) == 1


def test_field_report_rejects_future_or_invalid_coordinates(client):
    payload = {
        "client_report_id": "device-17:report-002",
        "region_code": "assam",
        "kind": "landslide",
        "accessibility_status": "blocked",
        "severity": 1,
        "lon": 200,
        "lat": 26,
        "description": "Road fully blocked by debris.",
        "observed_at": "2099-01-01T00:00:00Z",
    }
    assert client.post("/api/v1/field-reports", json=payload).status_code == 422


def test_review_requires_reviewer_and_updates_pending_report(client):
    store = MemoryFieldReports()
    app.dependency_overrides[get_field_report_store] = lambda: store
    app.dependency_overrides[require_reviewer] = lambda: AuthUser(
        id="33333333-3333-3333-3333-333333333333", role="reviewer"
    )
    payload = {
        "client_report_id": "device-17:report-003",
        "region_code": "assam",
        "kind": "landslide",
        "accessibility_status": "blocked",
        "severity": 0.9,
        "lon": 91.7,
        "lat": 26.1,
        "description": "Fresh debris blocks the full carriageway.",
        "observed_at": "2026-09-07T06:00:00Z",
    }
    try:
        created = client.post("/api/v1/field-reports", json=payload).json()
        reviewed = client.patch(
            f"/api/v1/field-reports/{created['id']}/review",
            json={
                "decision": "accepted",
                "review_note": "Coordinates and photo verified.",
                "dataset_id": "osm-guwahati",
                "edge_id": "edge-verified",
            },
        )
    finally:
        app.dependency_overrides.pop(get_field_report_store, None)
        app.dependency_overrides.pop(require_reviewer, None)
    assert reviewed.status_code == 200
    assert reviewed.json()["review_status"] == "accepted"


def test_demo_otp_endpoints_are_retired(client: TestClient) -> None:
    for path in ("/api/v1/auth/request-code", "/api/v1/auth/verify-code"):
        response = client.post(path, json={"email": "driver@raahsetu.in", "code": "000000"})
        assert response.status_code == 410
        assert response.json()["detail"] == "Demo OTP is retired. Use Supabase Auth."
