from __future__ import annotations

import os
from typing import Protocol

import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb

from .models import (
    DeliveryCreate,
    DeliveryJob,
    DeliveryUpdate,
    PositionCreate,
    VehicleAsset,
    VehiclePosition,
    VehicleSummary,
)


class FleetStore(Protocol):
    def vehicles(self, operator_id: str) -> list[VehicleAsset]: ...
    def positions(self, region_code: str | None, limit: int) -> list[VehicleSummary]: ...
    def record_position(self, payload: PositionCreate, operator_id: str) -> VehiclePosition: ...
    def deliveries(self, region_code: str | None, limit: int) -> list[DeliveryJob]: ...
    def create_delivery(self, payload: DeliveryCreate, operator_id: str) -> DeliveryJob: ...
    def update_delivery(self, delivery_id: str, payload: DeliveryUpdate, operator_id: str, admin: bool) -> DeliveryJob: ...


class PostgresFleetStore:
    def __init__(self, database_url: str | None = None):
        self.database_url = database_url or os.getenv("DATABASE_URL")

    def _connect(self):
        if not self.database_url:
            raise RuntimeError("Fleet tracking requires DATABASE_URL")
        return psycopg.connect(self.database_url, sslmode="require", row_factory=dict_row)

    def positions(self, region_code: str | None, limit: int) -> list[VehicleSummary]:
        where, params = "", []
        if region_code:
            where, params = "where v.region_code=%s", [region_code]
        with self._connect() as conn:
            rows = conn.execute(f"""select v.id::text vehicle_id,v.region_code,v.registration,v.vehicle_type,
                p.recorded_at,st_x(p.geom) lon,st_y(p.geom) lat,p.speed_kph,p.heading,p.status,p.accuracy_m
                from vehicle_assets v join lateral (select * from vehicle_positions p where p.vehicle_id=v.id
                order by p.recorded_at desc limit 1) p on true {where} and v.active order by p.recorded_at desc limit %s""",
                (*params, limit)).fetchall()
            return [VehicleSummary.model_validate(row) for row in rows]

    def vehicles(self, operator_id: str) -> list[VehicleAsset]:
        with self._connect() as conn:
            rows = conn.execute("""select id::text,region_code,registration,vehicle_type,active,metadata
                from vehicle_assets where operator_id=%s and active order by registration""", (operator_id,)).fetchall()
            return [VehicleAsset.model_validate(row) for row in rows]

    def record_position(self, payload: PositionCreate, operator_id: str) -> VehiclePosition:
        with self._connect() as conn:
            row = conn.execute("""insert into vehicle_positions(vehicle_id,recorded_at,geom,speed_kph,heading,status,accuracy_m,metadata)
                select id,%(recorded_at)s,st_setsrid(st_makepoint(%(lon)s,%(lat)s),4326),%(speed_kph)s,%(heading)s,%(status)s,%(accuracy_m)s,%(metadata)s
                from vehicle_assets where id=%(vehicle_id)s and operator_id=%(operator_id)s and active
                on conflict(vehicle_id,recorded_at) do update set metadata=excluded.metadata
                returning id::text,vehicle_id::text,recorded_at,st_x(geom) lon,st_y(geom) lat,speed_kph,heading,status,accuracy_m,metadata""",
                {**payload.model_dump(), "operator_id": operator_id, "metadata": Jsonb(payload.metadata)}).fetchone()
            if not row:
                raise LookupError("Vehicle is not assigned to this operator")
            return VehiclePosition.model_validate(row)

    def deliveries(self, region_code: str | None, limit: int) -> list[DeliveryJob]:
        with self._connect() as conn:
            if region_code:
                rows = conn.execute("select id::text,vehicle_id::text,region_code,commodity,origin_name,destination_name,status,eta_at,delivered_at,created_at,metadata from delivery_jobs where region_code=%s order by created_at desc limit %s", (region_code, limit)).fetchall()
            else:
                rows = conn.execute("select id::text,vehicle_id::text,region_code,commodity,origin_name,destination_name,status,eta_at,delivered_at,created_at,metadata from delivery_jobs order by created_at desc limit %s", (limit,)).fetchall()
            return [DeliveryJob.model_validate(row) for row in rows]

    def create_delivery(self, payload: DeliveryCreate, operator_id: str) -> DeliveryJob:
        with self._connect() as conn:
            row = conn.execute("""insert into delivery_jobs(vehicle_id,region_code,commodity,origin_name,destination_name,eta_at,metadata)
                select v.id,%(region_code)s,%(commodity)s,%(origin_name)s,%(destination_name)s,%(eta_at)s,%(metadata)s
                from vehicle_assets v where v.id=%(vehicle_id)s and v.operator_id=%(operator_id)s and v.active
                returning id::text,vehicle_id::text,region_code,commodity,origin_name,destination_name,status,eta_at,delivered_at,created_at,metadata""",
                {**payload.model_dump(), "operator_id": operator_id, "metadata": Jsonb(payload.metadata)}).fetchone()
            if not row:
                raise LookupError("Vehicle is not assigned to this operator")
            return DeliveryJob.model_validate(row)

    def update_delivery(self, delivery_id: str, payload: DeliveryUpdate, operator_id: str, admin: bool) -> DeliveryJob:
        with self._connect() as conn:
            row = conn.execute("""update delivery_jobs d set status=%s,eta_at=%s,
                delivered_at=case when %s='delivered' then now() else delivered_at end
                where d.id=%s and (%s or exists(select 1 from vehicle_assets v where v.id=d.vehicle_id and v.operator_id=%s))
                returning d.id::text,d.vehicle_id::text,d.region_code,d.commodity,d.origin_name,d.destination_name,d.status,d.eta_at,d.delivered_at,d.created_at,d.metadata""",
                (payload.status, payload.eta_at, payload.status, delivery_id, admin, operator_id)).fetchone()
            if not row:
                raise LookupError("Delivery is not available to this operator")
            return DeliveryJob.model_validate(row)


class InMemoryFleetStore:
    """In-memory store providing vehicle assets, GPS telemetry, and deliveries when PostgreSQL is not configured."""

    def __init__(self):
        import uuid
        from datetime import UTC, datetime, timedelta

        now = datetime.now(UTC)

        self._vehicles: list[VehicleAsset] = [
            VehicleAsset(
                id="AS-01-GB-4821",
                region_code="assam",
                registration="AS-01-GB-4821",
                vehicle_type="heavy",
                active=True,
                metadata={
                    "make": "Tata Prima 2830.K",
                    "load_capacity_t": 28.0,
                    "max_height_m": 4.0,
                    "commodity": "Critical Medicines & Vaccines",
                    "driver_name": "Ranjit Gogoi",
                    "driver_phone": "+91-94350-12345",
                    "assigned_corridor": "Guwahati-Imphal Lifeline",
                },
            ),
            VehicleAsset(
                id="NL-07-A-3210",
                region_code="nagaland",
                registration="NL-07-A-3210",
                vehicle_type="heavy",
                active=True,
                metadata={
                    "make": "BharatBenz 2823R",
                    "load_capacity_t": 28.0,
                    "max_height_m": 4.0,
                    "commodity": "PDS Essential Foodgrain",
                    "driver_name": "Temjen Ao",
                    "driver_phone": "+91-98620-54321",
                    "assigned_corridor": "Dimapur-Kohima-Imphal",
                },
            ),
            VehicleAsset(
                id="MN-01-E-9042",
                region_code="manipur",
                registration="MN-01-E-9042",
                vehicle_type="emergency",
                active=True,
                metadata={
                    "make": "Force Traveller 4x4",
                    "load_capacity_t": 3.5,
                    "max_height_m": 2.8,
                    "commodity": "Emergency Medical Relief",
                    "driver_name": "Ibomcha Singh",
                    "driver_phone": "+91-98560-67890",
                    "assigned_corridor": "Imphal District Network",
                },
            ),
            VehicleAsset(
                id="SK-02-L-1105",
                region_code="sikkim",
                registration="SK-02-L-1105",
                vehicle_type="light",
                active=True,
                metadata={
                    "make": "Mahindra Bolero Camper 4WD",
                    "load_capacity_t": 2.5,
                    "max_height_m": 2.2,
                    "commodity": "Remote Hill Logistics",
                    "driver_name": "Pemba Bhutia",
                    "driver_phone": "+91-97330-98765",
                    "assigned_corridor": "Gangtok-Chungthang",
                },
            ),
        ]

        self._positions: dict[str, VehiclePosition] = {
            "AS-01-GB-4821": VehiclePosition(
                id=str(uuid.uuid4()),
                vehicle_id="AS-01-GB-4821",
                recorded_at=now,
                lon=91.7362,
                lat=26.1445,
                speed_kph=52.0,
                heading=88.0,
                status="en_route",
                accuracy_m=8.5,
                metadata={"current_road": "NH-27 Guwahati East Expressway", "fuel_pct": 78},
            ),
            "NL-07-A-3210": VehiclePosition(
                id=str(uuid.uuid4()),
                vehicle_id="NL-07-A-3210",
                recorded_at=now,
                lon=93.7258,
                lat=25.9083,
                speed_kph=38.0,
                heading=145.0,
                status="en_route",
                accuracy_m=12.0,
                metadata={"current_road": "NH-29 Chumukedima Hill Section", "fuel_pct": 65},
            ),
            "MN-01-E-9042": VehiclePosition(
                id=str(uuid.uuid4()),
                vehicle_id="MN-01-E-9042",
                recorded_at=now,
                lon=93.9368,
                lat=24.8170,
                speed_kph=44.0,
                heading=12.0,
                status="en_route",
                accuracy_m=6.0,
                metadata={"current_road": "NH-102 Imphal West Boulevard", "fuel_pct": 82},
            ),
            "SK-02-L-1105": VehiclePosition(
                id=str(uuid.uuid4()),
                vehicle_id="SK-02-L-1105",
                recorded_at=now,
                lon=88.6065,
                lat=27.3389,
                speed_kph=32.0,
                heading=20.0,
                status="en_route",
                accuracy_m=10.0,
                metadata={"current_road": "NH-10 Indira Bypass Gangtok", "fuel_pct": 90},
            ),
        }

        self._deliveries: list[DeliveryJob] = [
            DeliveryJob(
                id="00000000-0000-0000-0000-000000000001",
                vehicle_id="AS-01-GB-4821",
                region_code="assam",
                commodity="Critical Medicines & Vaccine Consignment",
                origin_name="Guwahati Medical Depot",
                destination_name="Imphal Regional Hospital",
                status="en_route",
                eta_at=now + timedelta(hours=8, minutes=30),
                delivered_at=None,
                created_at=now - timedelta(hours=2),
                metadata={"priority": "HIGH", "cargo_value_inr": 2500000},
            ),
            DeliveryJob(
                id="00000000-0000-0000-0000-000000000002",
                vehicle_id="NL-07-A-3210",
                region_code="nagaland",
                commodity="PDS Grain & Pulses",
                origin_name="Dimapur Central Godown",
                destination_name="Kohima Relief Distribution Center",
                status="en_route",
                eta_at=now + timedelta(hours=3, minutes=15),
                delivered_at=None,
                created_at=now - timedelta(hours=1),
                metadata={"priority": "CRITICAL", "cargo_weight_t": 22.0},
            ),
        ]

    def vehicles(self, operator_id: str) -> list[VehicleAsset]:
        return [v for v in self._vehicles if v.active]

    def positions(self, region_code: str | None, limit: int) -> list[VehicleSummary]:
        results: list[VehicleSummary] = []
        vehicle_map = {v.id: v for v in self._vehicles}
        for vid, pos in self._positions.items():
            veh = vehicle_map.get(vid)
            if not veh or not veh.active:
                continue
            if region_code and veh.region_code != region_code:
                continue
            results.append(
                VehicleSummary(
                    id=pos.id,
                    vehicle_id=pos.vehicle_id,
                    recorded_at=pos.recorded_at,
                    lon=pos.lon,
                    lat=pos.lat,
                    speed_kph=pos.speed_kph,
                    heading=pos.heading,
                    status=pos.status,
                    accuracy_m=pos.accuracy_m,
                    metadata=pos.metadata,
                    region_code=veh.region_code,
                    registration=veh.registration,
                    vehicle_type=veh.vehicle_type,
                )
            )
        results.sort(key=lambda x: x.recorded_at, reverse=True)
        return results[:limit]

    def record_position(self, payload: PositionCreate, operator_id: str) -> VehiclePosition:
        import uuid
        pos = VehiclePosition(
            id=str(uuid.uuid4()),
            vehicle_id=payload.vehicle_id,
            recorded_at=payload.recorded_at,
            lon=payload.lon,
            lat=payload.lat,
            speed_kph=payload.speed_kph,
            heading=payload.heading,
            status=payload.status,
            accuracy_m=payload.accuracy_m,
            metadata=payload.metadata,
        )
        self._positions[payload.vehicle_id] = pos
        return pos

    def deliveries(self, region_code: str | None, limit: int) -> list[DeliveryJob]:
        matches = [
            d for d in self._deliveries
            if region_code is None or d.region_code == region_code
        ]
        matches.sort(key=lambda x: x.created_at, reverse=True)
        return matches[:limit]

    def create_delivery(self, payload: DeliveryCreate, operator_id: str) -> DeliveryJob:
        import uuid
        from datetime import UTC, datetime

        job = DeliveryJob(
            id=str(uuid.uuid4()),
            vehicle_id=payload.vehicle_id,
            region_code=payload.region_code,
            commodity=payload.commodity,
            origin_name=payload.origin_name,
            destination_name=payload.destination_name,
            status="planned",
            eta_at=payload.eta_at,
            delivered_at=None,
            created_at=datetime.now(UTC),
            metadata=payload.metadata,
        )
        self._deliveries.insert(0, job)
        return job

    def update_delivery(self, delivery_id: str, payload: DeliveryUpdate, operator_id: str, admin: bool) -> DeliveryJob:
        from datetime import UTC, datetime

        for idx, job in enumerate(self._deliveries):
            if job.id == delivery_id:
                delivered_at = datetime.now(UTC) if payload.status == "delivered" else job.delivered_at
                updated = job.model_copy(
                    update={
                        "status": payload.status,
                        "eta_at": payload.eta_at or job.eta_at,
                        "delivered_at": delivered_at,
                    }
                )
                self._deliveries[idx] = updated
                return updated
        raise LookupError("Delivery is not available to this operator")
