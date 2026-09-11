# RaahSetu (राहसेतु) — Comprehensive Security & Compliance Audit

> **Classification**: SIH 2026 Production Security Review  
> **Status**: Verified & Enforced  
> **Scope**: Backend API, Database Row-Level Security, Frontend PWA, Evidence Storage, and Telematics  

---

## 1. Threat Model & Security Architecture

```mermaid
graph TD
    Driver["Commercial Driver (Client)"] -->|Unauthenticated / Offline| IDB["Browser IndexedDB Queue"]
    Driver -->|JWT Authenticated (Role: driver)| API["FastAPI Gateway (:8000)"]
    Reviewer["SDRF / PWD Officer (Role: reviewer)"] -->|JWT Authenticated| API
    Dispatcher["Logistics Dispatcher (Role: dispatcher)"] -->|JWT Authenticated| API
    
    API -->|Security Headers + Validation| PG["Supabase PostGIS with RLS"]
    API -->|Read-Only Graph Search| NX["In-Memory Immutable RoadGraph"]
    
    subgraph "PostGIS Row Level Security (RLS)"
        RLS1["field_reports: Drivers Insert, Reviewers Update Status"]
        RLS2["vehicle_positions: Drivers Insert Own Vehicle Only"]
        RLS3["accessibility_events: Read-only to Drivers, Admin/Reviewer Manage"]
    end
```

---

## 2. Row Level Security (RLS) Policy Matrix

All PostGIS tables enforce strict PostgreSQL Row-Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`):

| Table | Operations | Allowed Role | RLS Policy Condition |
|---|---|---|---|
| `field_reports` | `SELECT` | `public` / All Authenticated | Anyone can view caution advisories. |
| `field_reports` | `INSERT` | `driver`, `reviewer`, `admin` | Users can only insert with their own `user.id`. |
| `field_reports` | `UPDATE` | `reviewer`, `admin` | **Strict RBAC**: Only authenticated SDRF/PWD officers with `role = 'reviewer'` can update `review_status` to `accepted`. Drivers are blocked by PostgreSQL RLS. |
| `vehicle_assets` | `SELECT` | `operator`, `dispatcher`, `admin` | Operators only see active vehicles assigned to their tenant. |
| `vehicle_positions` | `INSERT` | `driver`, `system-telematics` | Telemetry must match assigned `vehicle_id`. |
| `delivery_jobs` | `UPDATE` | `dispatcher`, `admin` | Drivers cannot reschedule deliveries; only update status to `delivered`. |
| `accessibility_events`| `INSERT / UPDATE`| `reviewer`, `admin` | Automatically populated when a reviewer accepts a verified report. |

---

## 3. Authentication & Session Security

- **Cryptographic Token Verification**: All protected endpoints (`/api/v1/fleet/*`, `/api/v1/field-reports/*/review`) verify Supabase Auth JWT signatures.
- **Zero Token Bypass**: Client-side demo token fallbacks (`demo-token`, `demo-driver-token`) have been completely removed.
- **Client Offline Storage**: In cellular dead zones, reports are cached in browser `IndexedDB` (`rs_queued_reports`) with client timestamps and synced once authenticated online.

---

## 4. Evidence Upload Security & File Handling

- **MIME Type Whitelist**: Only `image/jpeg`, `image/png`, and `image/webp` are permitted. Executables, scripts, and SVGs are rejected with HTTP 415.
- **File Size Limit**: Strictly enforced at **10 MB** (HTTP 413 on breach).
- **Cryptographic Integrity**: Every uploaded image is hashed with **SHA-256** prior to storage.
- **Isolated Storage Bucket**: Uploaded evidence is stored in a private Supabase Storage bucket (`field-report-evidence`) with paths namespaced by `user_id/report_id/sha256`.

---

## 5. Network & HTTP Hardening

The FastAPI gateway automatically injects security headers across all responses:
- `X-Content-Type-Options: nosniff` (Prevents MIME-type sniffing attacks)
- `X-Frame-Options: DENY` (Mitigates clickjacking attacks)
- `Referrer-Policy: strict-origin-when-cross-origin` (Protects sensitive corridor URLs)
- `CORS`: Whitelisted strictly to local UI origins (`http://localhost:5173,http://127.0.0.1:5173`).

---

## 6. Denial-of-Service & State-Poisoning Defenses

- **Immutable Read-Only Graph**: The NetworkX road network graph snapshot is frozen in memory during request traversal. Route calculations are request-scoped; no scenario can corrupt the shared graph for subsequent requests.
- **Strict Vehicle Constraint Validation**: All vehicle requests are validated against strict Pydantic schemas (`extra="forbid"`, `allow_inf_nan=False`), eliminating buffer overflow and type confusion exploits.
- **Proximity Filtering**: AIS-140 telematics and route queries enforce geographic bounding boxes to prevent unbounded spatial queries.
