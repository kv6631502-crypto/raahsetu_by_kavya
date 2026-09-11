from __future__ import annotations

import os
from typing import Protocol

import psycopg
from psycopg.rows import dict_row

from .models import Alert, ConnectivitySummary


class AlertStore(Protocol):
    def list_alerts(self, region_code: str | None, limit: int) -> list[Alert]: ...
    def connectivity(self, region_code: str | None) -> list[ConnectivitySummary]: ...


class PostgresAlertStore:
    def __init__(self, database_url: str | None = None):
        self.database_url = database_url or os.getenv("DATABASE_URL")

    def _connect(self):
        if not self.database_url:
            raise RuntimeError("Alerts require DATABASE_URL")
        return psycopg.connect(self.database_url, sslmode="require", row_factory=dict_row)

    def list_alerts(self, region_code: str | None, limit: int) -> list[Alert]:
        with self._connect() as conn:
            if region_code:
                rows = conn.execute("""select a.id::text,a.event_id::text,e.region_code,a.alert_type,a.severity,a.title,a.message_key,a.message_params,a.created_at,a.expires_at
                    from alerts a join accessibility_events e on e.id=a.event_id
                    where e.region_code=%s and (a.expires_at is null or a.expires_at>now())
                    order by a.created_at desc limit %s""", (region_code, limit)).fetchall()
            else:
                rows = conn.execute("""select a.id::text,a.event_id::text,e.region_code,a.alert_type,a.severity,a.title,a.message_key,a.message_params,a.created_at,a.expires_at
                    from alerts a join accessibility_events e on e.id=a.event_id
                    where a.expires_at is null or a.expires_at>now() order by a.created_at desc limit %s""", (limit,)).fetchall()
            return [Alert.model_validate(row) for row in rows]

    def connectivity(self, region_code: str | None) -> list[ConnectivitySummary]:
        with self._connect() as conn:
            params = (region_code,) if region_code else ()
            where = "where r.code=%s" if region_code else ""
            rows = conn.execute(f"""select r.code region_code,r.state_name,
                count(e.id)::int active_events,
                count(e.id) filter (where e.accessibility_status='blocked')::int blocked_events,
                count(e.id) filter (where e.accessibility_status='restricted')::int restricted_events,
                case when count(e.id)=0 then 'open' when count(e.id) filter (where e.accessibility_status='blocked')>0 then 'blocked' else 'restricted' end status,
                max(e.starts_at) last_event_at
                from region_catalog r left join accessibility_events e on e.region_code=r.code
                and e.starts_at<=now() and (e.ends_at is null or e.ends_at>now()) {where}
                group by r.code,r.state_name order by r.state_name""", (*params,)).fetchall()
            return [ConnectivitySummary.model_validate(row) for row in rows]


class InMemoryAlertStore:
    """In-memory alert store providing regional alerts and connectivity summaries when PostgreSQL is unavailable."""

    def __init__(self):
        from datetime import UTC, datetime, timedelta
        now = datetime.now(UTC)

        self._alerts: list[Alert] = [
            Alert(
                id="alert-001",
                event_id="00000000-0000-0000-0000-000000000101",
                region_code="arunachal-pradesh",
                alert_type="blocked_route",
                severity=0.92,
                title="NH-13 Sela Pass Blocked",
                message_key="route.blocked",
                message_params={
                    "place": "Sela Pass",
                    "district": "West Kameng",
                    "reason": "Sub-zero ice drift & fresh landslide on old pass; detour via Sela Tunnel active",
                },
                created_at=now - timedelta(hours=3),
                expires_at=now + timedelta(hours=24),
            ),
            Alert(
                id="alert-002",
                event_id="00000000-0000-0000-0000-000000000102",
                region_code="nagaland",
                alert_type="blocked_route",
                severity=0.86,
                title="NH-29 Phesama Sinking Zone",
                message_key="route.blocked",
                message_params={
                    "place": "Phesama Sinking Zone",
                    "district": "Kohima",
                    "reason": "Tectonic roadbed subsidence; heavy freight diverted to secondary bypass",
                },
                created_at=now - timedelta(hours=5),
                expires_at=now + timedelta(hours=18),
            ),
            Alert(
                id="alert-003",
                event_id="00000000-0000-0000-0000-000000000103",
                region_code="meghalaya",
                alert_type="high_risk",
                severity=0.88,
                title="NH-6 Sonapur Tunnel Mudflow Caution",
                message_key="route.restricted",
                message_params={
                    "place": "Sonapur Tunnel Approach",
                    "district": "East Jaintia Hills",
                    "reason": "Intense rain triggered slope slurry; single alternating lane",
                },
                created_at=now - timedelta(hours=2),
                expires_at=now + timedelta(hours=12),
            ),
            Alert(
                id="alert-004",
                event_id="00000000-0000-0000-0000-000000000104",
                region_code="assam",
                alert_type="high_risk",
                severity=0.78,
                title="NH-715 Kaziranga High Water Advisory",
                message_key="route.restricted",
                message_params={
                    "place": "Kaziranga Southern Corridor",
                    "district": "Golaghat",
                    "reason": "Brahmaputra high water table; animal corridor 20km/h speed limit",
                },
                created_at=now - timedelta(hours=6),
                expires_at=now + timedelta(hours=30),
            ),
            Alert(
                id="alert-005",
                event_id="00000000-0000-0000-0000-000000000105",
                region_code="sikkim",
                alert_type="high_risk",
                severity=0.85,
                title="North Sikkim Highway Flash Flood Watch",
                message_key="route.restricted",
                message_params={
                    "place": "Mangan-Chungthang Section",
                    "district": "Mangan",
                    "reason": "Teesta river surge; caution on riverbank cuts",
                },
                created_at=now - timedelta(hours=4),
                expires_at=now + timedelta(hours=20),
            ),
        ]
        self._connectivity: list[dict] = [
            {"code": "arunachal-pradesh", "name": "Arunachal Pradesh", "active": 2, "blocked": 1, "restricted": 1, "status": "blocked"},
            {"code": "assam", "name": "Assam", "active": 1, "blocked": 0, "restricted": 1, "status": "restricted"},
            {"code": "manipur", "name": "Manipur", "active": 0, "blocked": 0, "restricted": 0, "status": "open"},
            {"code": "meghalaya", "name": "Meghalaya", "active": 1, "blocked": 0, "restricted": 1, "status": "restricted"},
            {"code": "mizoram", "name": "Mizoram", "active": 0, "blocked": 0, "restricted": 0, "status": "open"},
            {"code": "nagaland", "name": "Nagaland", "active": 1, "blocked": 1, "restricted": 0, "status": "blocked"},
            {"code": "sikkim", "name": "Sikkim", "active": 1, "blocked": 0, "restricted": 1, "status": "restricted"},
            {"code": "tripura", "name": "Tripura", "active": 0, "blocked": 0, "restricted": 0, "status": "open"},
        ]

    def list_alerts(self, region_code: str | None, limit: int) -> list[Alert]:
        matches = [
            a for a in self._alerts
            if region_code is None or a.region_code == region_code
        ]
        return matches[:limit]

    def connectivity(self, region_code: str | None) -> list[ConnectivitySummary]:
        from datetime import UTC, datetime
        now = datetime.now(UTC)

        items = [
            c for c in self._connectivity
            if region_code is None or c["code"] == region_code
        ]
        return [
            ConnectivitySummary(
                region_code=c["code"],
                state_name=c["name"],
                active_events=c["active"],
                blocked_events=c["blocked"],
                restricted_events=c["restricted"],
                status=c["status"],
                last_event_at=now if c["active"] > 0 else None,
            )
            for c in items
        ]
