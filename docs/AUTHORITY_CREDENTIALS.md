# RaahSetu (राहसेतु) — Official Authority Credentials & RBAC Roles

> **For SIH 2026 Grand Finale Evaluation & Role-Based Access Control (RBAC) Proof**

| Role | Official Email | Demo Password | Official Name & Designation | Region / Corridor |
|---|---|---|---|---|
| **`REVIEWER`** | `sdrf.arunachal@raahsetu.in` | `Sdrf@Arunachal2026!` | Insp. Tenzing Norbu (State Disaster Response Force (SDRF) - West Kameng Div) | arunachal-pradesh |
| **`REVIEWER`** | `pwd.assam@raahsetu.in` | `Pwd@Assam2026!` | Er. Bhupen Barman (Executive Engineer, National Highway Division, Assam PWD) | assam |
| **`DISPATCHER`** | `dispatcher.ner@raahsetu.in` | `Dispatcher@Ner2026!` | Rajesh Sharma (Regional Essential Freight Logistics Controller) | assam |
| **`DRIVER`** | `driver.anup@raahsetu.in` | `Driver@Truck4821!` | Ranjit Gogoi (Senior Commercial Freight Captain (Vehicle: AS-01-GB-4821)) | assam |
| **`ADMIN`** | `admin@raahsetu.in` | `Admin@RaahSetu2026!` | State Emergency Control Officer (Platform Operations Administrator) | All 8 NE States |

---

## Role Permission Matrix (Enforced by PostGIS Row Level Security)

| Capability | `driver` | `reviewer` (SDRF/PWD) | `dispatcher` | `admin` |
|---|:---:|:---:|:---:|:---:|
| Calculate Route (Fastest vs Risk-A*) | ✅ | ✅ | ✅ | ✅ |
| View Live Weather & Microclimate | ✅ | ✅ | ✅ | ✅ |
| Submit Field Report (Pending State) | ✅ | ✅ | ✅ | ✅ |
| Stream Real Hardware GPS Telemetry | ✅ | ❌ | ❌ | ✅ |
| **Authority Verify Field Report (Close / Penalize Edge)** | ❌ | ✅ | ❌ | ✅ |
| **Broadcast Emergency Driver Dispatch Alert** | ❌ | ❌ | ✅ | ✅ |
| Manage Fleet Delivery Allocations | ❌ | ❌ | ✅ | ✅ |
| Access Cross-Regional Data Across All 8 States | ❌ | ❌ (Own State Only) | ✅ | ✅ |

---

## 1-Click UI Quick Login
In the web dashboard, clicking **'Quick Login'** allows the presenter to switch between **SDRF Reviewer**, **Fleet Dispatcher**, and **Driver** in 1 click without manual typing.