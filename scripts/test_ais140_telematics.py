"""AIS-140 Telematics Demonstration & Verification Script.

Streams 5 simulated AIS-140 standard commercial vehicle telemetry packets
along the Guwahati ➔ Tawang strategic highway corridor into the RaahSetu API.
"""

from __future__ import annotations

import time
from datetime import UTC, datetime

import httpx

API_BASE = "http://127.0.0.1:8000"

WAYPOINTS = [
    {"name": "Guwahati Logistics Hub (Kamrup)", "lat": 26.1445, "lon": 91.7362, "speed": 55.0, "heading": 80.0},
    {"name": "Tezpur Bypass Bridge Approach", "lat": 26.6528, "lon": 92.7926, "speed": 50.0, "heading": 65.0},
    {"name": "Bhalukpong Foothills (Arunachal Border)", "lat": 27.0142, "lon": 92.6418, "speed": 38.0, "heading": 340.0},
    {"name": "Bomdila Pass Climb (2,400m)", "lat": 27.2644, "lon": 92.4159, "speed": 32.0, "heading": 315.0},
    {"name": "Sela Tunnel Approach (13,000 ft)", "lat": 27.5012, "lon": 92.1025, "speed": 28.0, "heading": 300.0},
]


def stream_ais140_telemetry():
    print("=" * 70)
    print("RaahSetu — AIS-140 Commercial Freight Telematics Demonstration")
    print("Vehicle: AS-01-GB-4821 (Tata Prima 2830.K Heavy Freight)")
    print("Standard: MoRTH AIS-140 Telematics Protocol")
    print("=" * 70)

    for i, wp in enumerate(WAYPOINTS, start=1):
        packet = {
            "imei": "868204041234567",
            "vehicle_registration": "AS-01-GB-4821",
            "timestamp": datetime.now(UTC).isoformat(),
            "latitude": wp["lat"],
            "longitude": wp["lon"],
            "speed_kph": wp["speed"],
            "heading_deg": wp["heading"],
            "altitude_m": 50.0 + i * 800.0,
            "gps_fix": True,
            "ignition_on": True,
            "emergency_state": False,
            "metadata": {
                "waypoint_name": wp["name"],
                "packet_sequence": i,
                "fuel_pct": max(20, 85 - i * 8),
            },
        }

        try:
            res = httpx.post(f"{API_BASE}/api/v1/fleet/telemetry/ais140", json=packet, timeout=5.0)
            if res.status_code == 200:
                data = res.json()
                status_badge = "⚠️ PROXIMITY ALERT" if data["status"] == "warning" else "✅ INGESTED"
                print(f"[{i}/5] {wp['name']:<42} {status_badge} ({wp['speed']} km/h)")
                if data["proximity_hazards"]:
                    for h in data["proximity_hazards"]:
                        print(f"      ↳ Nearby Hazard: {h['title']} ({h['distance_m']}m away)")
            else:
                print(f"[{i}/5] Telematics response code: {res.status_code} ({res.text})")
        except Exception as e:
            print(f"[{i}/5] Could not reach {API_BASE} ({e}). Ensure backend is running.")

        time.sleep(0.5)

    print("\nAIS-140 Telemetry demonstration complete.")


if __name__ == "__main__":
    stream_ais140_telemetry()
