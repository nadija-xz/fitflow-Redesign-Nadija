"""Check that coursework starter documentation is present and matrix weights are valid."""
from pathlib import Path
import csv
ROOT = Path(__file__).resolve().parents[1]
required = [
    "README.md", ".gitignore", "docs/architecture.png", "docs/architecture.dot",
    "docs/adr-001.md", "docs/technology-comparison.csv",
    "docs/weighted-decision-matrix.csv", "docs/tech-stack-summary.md",
    "docs/references.md", "frontend/README.md", "backend/README.md", "ai-service/README.md"
]
missing=[s for s in required if not (ROOT/s).is_file() or (ROOT/s).stat().st_size == 0]
assert not missing, f"Missing/empty files: {missing}"
with (ROOT/"docs/weighted-decision-matrix.csv").open(newline="") as f:
    rows=list(csv.reader(f))
weights=[int(x) for x in rows[1][1:]]
assert sum(weights)==100, f"Weights total {sum(weights)} instead of 100"
for row in rows[3:]:
    ratings=[int(x) for x in row[1:1+len(weights)]]
    calculated=sum(r*w for r,w in zip(ratings,weights))/100
    assert abs(calculated-float(row[-2]))<0.011, (row[0],calculated)
print(f"PASS: {len(required)} files; {len(weights)} weights sum to 100; {len(rows)-3} candidates match scores.")
