"""Build and validate state routing snapshots from processed OSM extracts."""

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTRACTS = ROOT / "datasets" / "processed" / "osm"
RUNTIME = ROOT / "backend" / "data"
IMPORTER = ROOT / "backend" / "scripts" / "import_osm.py"
VALIDATOR = ROOT / "backend" / "scripts" / "verify_runtime_graph.py"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="Build one state snapshot, e.g. assam")
    args = parser.parse_args()
    extracts = sorted(EXTRACTS.glob("*-roads.osm"))
    if args.only:
        extracts = [path for path in extracts if path.stem == f"{args.only}-roads"]
    if not extracts:
        raise SystemExit("No processed OSM road extracts found")

    for extract in extracts:
        name = extract.stem.removesuffix("-roads")
        output = RUNTIME / f"osm-{name}.json"
        subprocess.run(
            [
                sys.executable,
                str(IMPORTER),
                "--xml",
                str(extract),
                "--name",
                name,
                "--output",
                str(output),
            ],
            cwd=ROOT,
            check=True,
        )
        subprocess.run(
            [sys.executable, str(VALIDATOR), str(output)],
            cwd=ROOT,
            check=True,
        )


if __name__ == "__main__":
    main()