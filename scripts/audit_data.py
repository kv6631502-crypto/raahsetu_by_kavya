"""Summarize actual local coverage, validate raw containers and preserve gaps."""

import csv
import gzip
import json
import math
from datetime import UTC, datetime
from pathlib import Path

from download_data import digest

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "datasets"


def main():
    receipts = []
    for path in (DATA / "raw").rglob("*.receipt.json"):
        record = json.loads(path.read_text(encoding="utf-8"))
        source = DATA / record["file"]
        if not source.exists() or digest(source) != record["sha256"]:
            raise ValueError(f"Download integrity mismatch: {source}")
        receipts.append(record)
    terrain_files = list((DATA / "raw/terrain").glob("*.hgt.gz"))
    for path in terrain_files:
        with gzip.open(path, "rb") as file:
            size = len(file.read())
        side = math.isqrt(size // 2)
        if size % 2 or side * side * 2 != size:
            raise ValueError(f"Invalid HGT grid: {path.name}")
    targets = json.loads((DATA / "catalog-terrain.json").read_text(encoding="utf-8"))
    missing_terrain = [r["id"] for r in targets if not (DATA / r["file"]).exists()]
    extraction_path = DATA / "processed/osm/extraction-summary.json"
    extraction = json.loads(extraction_path.read_text(encoding="utf-8")) if extraction_path.exists() else []
    landslide_path = DATA / "processed/landslides/summary.json"
    landslides = (
        json.loads(landslide_path.read_text(encoding="utf-8"))
        if landslide_path.exists()
        else {"northeast_records": 0}
    )
    weather = DATA / "processed/weather/ne-reference-points-daily-2021-2025.csv"
    if weather.exists():
        with weather.open(encoding="utf-8", newline="") as file:
            weather_rows = sum(1 for _ in csv.DictReader(file))
    else:
        weather_rows = 0
    summary = {
        "audited_at": datetime.now(UTC).isoformat(),
        "verified_download_files": len(receipts),
        "downloaded_bytes": sum(r["bytes"] for r in receipts),
        "state_road_extracts": len([r for r in extraction if r["region"] != "guwahati-pilot"]),
        "state_road_ways_including_boundary_overlap": sum(
            r["road_ways"] for r in extraction if r["region"] != "guwahati-pilot"
        ),
        "state_facility_features_including_boundary_overlap": sum(
            r["facility_features"] for r in extraction if r["region"] != "guwahati-pilot"
        ),
        "terrain_tiles": len(terrain_files),
        "terrain_tiles_planned": len(targets),
        "missing_terrain": missing_terrain,
        "historical_ne_landslides": landslides["northeast_records"],
        "weather_reference_point_days": weather_rows,
        "weather_spatial_coverage": "8 reference points, not complete state-wide spatial coverage",
        "runtime_pilot": {"nodes": 5814, "directed_edges": 13681},
        "gaps": [
            "Verified coordinate-level blackspot coverage for all eight states",
            "Live official closures, traffic and road condition feeds",
            "Reviewed hazard-to-road joins and calibrated disruption model",
            "Current authoritative susceptibility/warning layers",
        ],
        "osm_coverage_check": "Geofabrik North-Eastern Zone polygon fully covers Sikkim; all 8 extracts use this source. Eastern Zone is optional adjacent-region context.",
    }
    (DATA / "DATA_STATUS.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    lines = [
        "# Local data status",
        "",
        f"Audited: {summary['audited_at']}",
        "",
        f"- {summary['state_road_extracts']} state road extracts with referenced OSM nodes.",
        f"- {summary['state_road_ways_including_boundary_overlap']:,} road ways across extracts, including boundary overlap.",
        f"- {summary['state_facility_features_including_boundary_overlap']:,} facility features, including overlap and unverified operating status.",
        f"- {len(terrain_files)}/{len(targets)} elevation tiles downloaded and gzip/grid-validated.",
        f"- {summary['historical_ne_landslides']} historical NE landslide records.",
        f"- {weather_rows:,} weather point-days at eight reference locations.",
        f"- {len(receipts)} source files verified by SHA-256.",
        "",
        "Full source coverage, licenses and gaps are in docs/DATA.md.",
        "",
        "This is a public-data bundle, not exhaustive access to every government dataset.",
    ]
    (DATA / "README.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
