"""Seed Authority Accounts & Reviewer Credentials for RaahSetu.

Creates verified official accounts for SDRF, PWD, Dispatcher, Driver, and Admin:
- In Supabase Auth (via Admin API / SQL) if credentials configured
- Generates docs/AUTHORITY_CREDENTIALS.md for presentation reference
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

AUTHORITY_ACCOUNTS = [
    {
        "email": "sdrf.arunachal@raahsetu.in",
        "password": "Sdrf@Arunachal2026!",
        "role": "reviewer",
        "region_code": "arunachal-pradesh",
        "full_name": "Insp. Tenzing Norbu",
        "designation": "State Disaster Response Force (SDRF) - West Kameng Div",
        "jurisdiction": "NH-13 Sela Pass / Tawang Corridor",
    },
    {
        "email": "pwd.assam@raahsetu.in",
        "password": "Pwd@Assam2026!",
        "role": "reviewer",
        "region_code": "assam",
        "full_name": "Er. Bhupen Barman",
        "designation": "Executive Engineer, National Highway Division, Assam PWD",
        "jurisdiction": "NH-27 / NH-715 Assam Arterial Corridors",
    },
    {
        "email": "dispatcher.ner@raahsetu.in",
        "password": "Dispatcher@Ner2026!",
        "role": "dispatcher",
        "region_code": "assam",
        "full_name": "Rajesh Sharma",
        "designation": "Regional Essential Freight Logistics Controller",
        "jurisdiction": "All 8 North-Eastern States Freight Dispatch",
    },
    {
        "email": "driver.anup@raahsetu.in",
        "password": "Driver@Truck4821!",
        "role": "driver",
        "region_code": "assam",
        "full_name": "Ranjit Gogoi",
        "designation": "Senior Commercial Freight Captain (Vehicle: AS-01-GB-4821)",
        "jurisdiction": "Guwahati-Imphal Essential Lifeline",
    },
    {
        "email": "admin@raahsetu.in",
        "password": "Admin@RaahSetu2026!",
        "role": "admin",
        "region_code": None,
        "full_name": "State Emergency Control Officer",
        "designation": "Platform Operations Administrator",
        "jurisdiction": "Full North-Eastern Region",
    },
]


def generate_credentials_doc():
    doc_path = ROOT / "docs" / "AUTHORITY_CREDENTIALS.md"
    lines = [
        "# RaahSetu (राहसेतु) — Official Authority Credentials & RBAC Roles",
        "",
        "> **For SIH 2026 Grand Finale Evaluation & Role-Based Access Control (RBAC) Proof**",
        "",
        "| Role | Official Email | Demo Password | Official Name & Designation | Region / Corridor |",
        "|---|---|---|---|---|",
    ]
    for acc in AUTHORITY_ACCOUNTS:
        region = acc["region_code"] or "All 8 NE States"
        lines.append(
            f"| **`{acc['role'].upper()}`** | `{acc['email']}` | `{acc['password']}` | {acc['full_name']} ({acc['designation']}) | {region} |"
        )
    lines.extend([
        "",
        "---",
        "",
        "## Role Permission Matrix (Enforced by PostGIS Row Level Security)",
        "",
        "| Capability | `driver` | `reviewer` (SDRF/PWD) | `dispatcher` | `admin` |",
        "|---|:---:|:---:|:---:|:---:|",
        "| Calculate Route (Fastest vs Risk-A*) | ✅ | ✅ | ✅ | ✅ |",
        "| View Live Weather & Microclimate | ✅ | ✅ | ✅ | ✅ |",
        "| Submit Field Report (Pending State) | ✅ | ✅ | ✅ | ✅ |",
        "| Stream Real Hardware GPS Telemetry | ✅ | ❌ | ❌ | ✅ |",
        "| **Authority Verify Field Report (Close / Penalize Edge)** | ❌ | ✅ | ❌ | ✅ |",
        "| **Broadcast Emergency Driver Dispatch Alert** | ❌ | ❌ | ✅ | ✅ |",
        "| Manage Fleet Delivery Allocations | ❌ | ❌ | ✅ | ✅ |",
        "| Access Cross-Regional Data Across All 8 States | ❌ | ❌ (Own State Only) | ✅ | ✅ |",
        "",
        "---",
        "",
        "## 1-Click UI Quick Login",
        "In the web dashboard, clicking **'Quick Login'** allows the presenter to switch between **SDRF Reviewer**, **Fleet Dispatcher**, and **Driver** in 1 click without manual typing.",
    ])
    doc_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {doc_path}")


def main():
    print("Seeding RaahSetu Authority Accounts...")
    generate_credentials_doc()

    # Try Supabase Auth API if SERVICE_ROLE_KEY is present
    supabase_url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if supabase_url and service_key:
        import httpx
        headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        }
        for acc in AUTHORITY_ACCOUNTS:
            try:
                res = httpx.post(
                    f"{supabase_url}/auth/v1/admin/users",
                    headers=headers,
                    json={
                        "email": acc["email"],
                        "password": acc["password"],
                        "email_confirm": True,
                        "user_metadata": {
                            "role": acc["role"],
                            "region_code": acc["region_code"],
                            "full_name": acc["full_name"],
                            "designation": acc["designation"],
                        },
                    },
                    timeout=10.0,
                )
                if res.status_code in {200, 201}:
                    print(f"Created Supabase Auth user: {acc['email']}")
                elif "already registered" in res.text:
                    print(f"User already exists: {acc['email']}")
                else:
                    print(f"Notice for {acc['email']}: {res.status_code}")
            except Exception as e:
                print(f"Skipping remote Supabase API creation ({e})")
                break
    else:
        print("Running in local/in-memory mode: Credentials documented for zero-dependency presentation.")


if __name__ == "__main__":
    main()
