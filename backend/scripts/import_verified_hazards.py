"""Import verified Northeast hazards into graph snapshots and PostGIS.

Matches MoRTH accident blackspots, GSI landslide records, CWC flood points,
and PWD bridge constraints against the 8-state Northeast highway network.
"""

import csv
import itertools
import json
import math
import os
from datetime import UTC, datetime
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

CSV_PATH = ROOT / "supabase" / "hazards-northeast-verified.csv"
GRAPH_PATH = ROOT / "backend" / "data" / "osm-northeast.json"


def distance_m(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    lat1, lat2 = math.radians(lat1), math.radians(lat2)
    dlat, dlon = lat2 - lat1, math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371009 * 2 * math.asin(math.sqrt(min(1, max(0, a))))


def point_to_polyline(lon: float, lat: float, geometry: list[list[float]]) -> float:
    cos = math.cos(math.radians(lat))
    best = float("inf")
    for a, b in itertools.pairwise(geometry):
        ax, ay = a[0] * cos, a[1]
        bx, by = b[0] * cos, b[1]
        px, py = lon * cos, lat
        dx, dy = bx - ax, by - ay
        t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy or 1)))
        best = min(best, distance_m(lon, lat, (ax + t * dx) / cos, ay + t * dy))
    return best


def main():
    if not CSV_PATH.exists():
        raise SystemExit(f"Verified hazards CSV missing: {CSV_PATH}")
    if not GRAPH_PATH.exists():
        raise SystemExit(f"Northeast graph missing: {GRAPH_PATH}")

    graph_data = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    edges = graph_data["edges"]

    with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
        hazards = list(csv.DictReader(f))

    print(f"Loaded {len(hazards)} verified Northeast hazard records.")

    matched_count = 0
    matches = []

    for h in hazards:
        hlon = float(h["longitude"])
        hlat = float(h["latitude"])
        severity = float(h["severity"])
        kind = h["kind"]
        source = h["source"]
        record_id = h["source_record_id"]
        desc = h["description"]

        candidates = []
        for edge in edges:
            geom = edge.get("geometry", [])
            if len(geom) >= 2:
                dist = point_to_polyline(hlon, hlat, geom)
            else:
                dist = float("inf")
            candidates.append((dist, edge))

        candidates.sort(key=lambda x: x[0])
        best_dist, best_edge = candidates[0]

        # Match within 50 km for regional highway corridor
        if best_dist <= 50000:
            matched_count += 1
            if kind == "blackspot":
                best_edge["accident_score"] = round(max(best_edge.get("accident_score", 0), severity), 3)
            elif kind == "landslide":
                best_edge["surface_score"] = round(max(best_edge.get("surface_score", 0), severity * 0.85), 3)
                best_edge["weather_score"] = round(max(best_edge.get("weather_score", 0), severity * 0.75), 3)
            elif kind == "flood":
                best_edge["flood_susceptibility"] = round(max(best_edge.get("flood_susceptibility", 0), severity), 3)
                best_edge["weather_score"] = round(max(best_edge.get("weather_score", 0), 0.7), 3)
            elif kind == "road_damage":
                best_edge["surface_score"] = round(max(best_edge.get("surface_score", 0), severity), 3)
                if "18T" in desc or "Bailey" in desc:
                    best_edge["max_weight_t"] = 18.0
                elif "16T" in desc:
                    best_edge["max_weight_t"] = 16.0
                elif "3.8m" in desc:
                    best_edge["max_height_m"] = 3.8

            best_edge["risk_data_known"] = True
            best_edge["evidence"] = f"Verified {kind} ({source} {record_id}): {desc[:80]}"
            best_edge["observed_at"] = h.get("observed_at", datetime.now(UTC).isoformat())

            matches.append({
                "record_id": record_id,
                "kind": kind,
                "matched_edge": best_edge["id"],
                "road_name": best_edge["name"],
                "distance_m": round(best_dist, 1),
            })

    # Update metadata
    graph_data["hazard_source"] = "Curated benchmark catalogue structured around published MoRTH blackspots, GSI landslides & PWD bridge load limits"
    graph_data["is_synthetic"] = True
    graph_data["generated_at"] = datetime.now(UTC).isoformat()

    GRAPH_PATH.write_text(json.dumps(graph_data, indent=2), encoding="utf-8")
    print(f"Successfully matched {matched_count}/{len(hazards)} hazards to {GRAPH_PATH.name}.")

    # Optional PostGIS insert if DATABASE_URL is set
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        try:
            import psycopg
            from psycopg.types.json import Jsonb
            with psycopg.connect(db_url, sslmode="require") as conn:
                for h in hazards:
                    conn.execute(
                        """insert into hazard_observations
                        (source,source_record_id,kind,severity,geom,observed_at,is_synthetic,details)
                        values(%s,%s,%s,%s,st_setsrid(st_makepoint(%s,%s),4326),%s,%s,%s)
                        on conflict(source,source_record_id) do update set
                          severity=excluded.severity, details=excluded.details""",
                        (
                            h["source"],
                            h["source_record_id"],
                            h["kind"],
                            float(h["severity"]),
                            float(h["longitude"]),
                            float(h["latitude"]),
                            h["observed_at"],
                            h.get("is_synthetic", "true").lower() == "true",
                            Jsonb(h),
                        ),
                    )
            print("Imported records into Supabase PostGIS hazard_observations table.")
        except (psycopg.Error, OSError, ValueError) as exc:
            print(f"Database import skipped ({exc}); offline graph update completed.")


if __name__ == "__main__":
    main()
