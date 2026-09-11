"""Open-Meteo weather ingestion and freshness policy for Northeast corridors."""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from typing import Any

import httpx

logger = logging.getLogger("raahsetu.weather")

NE_STATIONS: dict[str, dict[str, Any]] = {
    "assam": {"name": "Guwahati", "lat": 26.1445, "lon": 91.7362, "elevation_m": 55},
    "arunachal-pradesh": {"name": "Itanagar", "lat": 27.0844, "lon": 93.6053, "elevation_m": 320},
    "meghalaya": {"name": "Shillong", "lat": 25.5788, "lon": 91.8933, "elevation_m": 1525},
    "manipur": {"name": "Imphal", "lat": 24.8170, "lon": 93.9368, "elevation_m": 786},
    "nagaland": {"name": "Kohima", "lat": 25.6751, "lon": 94.1086, "elevation_m": 1444},
    "mizoram": {"name": "Aizawl", "lat": 23.7271, "lon": 92.7176, "elevation_m": 1132},
    "sikkim": {"name": "Gangtok", "lat": 27.3389, "lon": 88.6065, "elevation_m": 1650},
    "tripura": {"name": "Agartala", "lat": 23.8315, "lon": 91.2868, "elevation_m": 15},
}

_weather_cache: dict[str, dict[str, Any]] = {}
CACHE_TTL_SECONDS = 3600  # 60-minute freshness policy


def get_station_weather(region_code: str) -> dict[str, Any]:
    """Retrieve weather for a state station respecting the 60-minute freshness policy."""
    station = NE_STATIONS.get(region_code, NE_STATIONS["assam"])
    cached = _weather_cache.get(region_code)
    now = datetime.now(UTC)

    if cached and (now - cached["fetched_at"]).total_seconds() < CACHE_TTL_SECONDS:
        return cached

    # Attempt live fetch from Open-Meteo archive/forecast API
    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={station['lat']}&longitude={station['lon']}"
        "&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m"
        "&daily=precipitation_sum,rain_sum&timezone=Asia%2FKolkata&forecast_days=1"
    )

    try:
        response = httpx.get(url, timeout=4.0)
        if response.status_code == 200:
            data = response.json()
            current = data.get("current", {})
            daily = data.get("daily", {})
            precip_mm = daily.get("precipitation_sum", [0.0])[0] or current.get("precipitation", 0.0)

            is_heavy = precip_mm >= 50.0
            condition = "heavy_rain" if is_heavy else "rain" if precip_mm > 5.0 else "normal"

            weather_data = {
                "region_code": region_code,
                "station": station["name"],
                "lat": station["lat"],
                "lon": station["lon"],
                "temperature_c": current.get("temperature_2m", 24.0),
                "humidity_pct": current.get("relative_humidity_2m", 75),
                "precipitation_mm_24h": round(precip_mm, 1),
                "wind_kph": current.get("wind_speed_10m", 12.0),
                "condition": condition,
                "heavy_rain_warning": is_heavy,
                "fetched_at": now,
                "fresh": True,
                "stale": False,
                "source": "Open-Meteo forecast API",
            }
            _weather_cache[region_code] = weather_data
            return weather_data
    except (httpx.HTTPError, OSError, ValueError, KeyError) as exc:
        logger.warning("Live weather fetch failed for %s: %s; using calibrated baseline", region_code, exc)

    # Fallback to calibrated seasonal reference if live fetch fails or is offline
    baseline = {
        "region_code": region_code,
        "station": station["name"],
        "lat": station["lat"],
        "lon": station["lon"],
        "temperature_c": 22.5,
        "humidity_pct": 78,
        "precipitation_mm_24h": 12.5,
        "wind_kph": 10.0,
        "condition": "normal",
        "heavy_rain_warning": False,
        "fetched_at": now,
        "fresh": False,
        "stale": True,
        "source": "Calibrated Northeast Seasonal Reference",
    }
    _weather_cache[region_code] = baseline
    return baseline


def get_all_live_weather() -> list[dict[str, Any]]:
    """Return weather telemetry for all 8 Northeast state stations."""
    results = []
    for region in NE_STATIONS:
        w = dict(get_station_weather(region))
        w["fetched_at"] = w["fetched_at"].isoformat()
        results.append(w)
    return results
