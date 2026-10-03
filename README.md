# FitFlow redesign

Coursework technology-selection and architecture starter for IT3060 Lab Exercise 05.

**Status:** Proposed architecture with starter documentation only. This repository does **not** contain a deployed FitFlow app, trained model, production-grade HIPAA/GDPR implementation or real participant data.

## Lab deliverables
- Platform, backend, database and authentication comparison: `docs/technology-comparison.csv`
- Weighted decision matrix: `docs/weighted-decision-matrix.csv`
- Proposed stack and caveats: `docs/tech-stack-summary.md`
- Architecture image: `docs/architecture.png` (Graphviz source `docs/architecture.dot`)
- Architecture Decision Record: `docs/adr-001.md`
- References: `docs/references.md`

## Planned folders
- `frontend/`: Expo React Native + web
- `backend/`: NestJS core API, scoped WebSocket gateway
- `ai-service/`: Python FastAPI inference

## Validation
Run `python scripts/validate_docs.py` (Python 3, standard library only). GitHub Actions performs the same basic documentation check on pushes/PRs.

## Publish your own repository
1. Create a new **private** GitHub repo named `fitflow-redesign` (or connect the GitHub plugin).
2. From the extracted submission ZIP root, run `git clone fitflow-first-commit.bundle fitflow-redesign-publish` then `cd fitflow-redesign-publish`.
3. Run `git remote add origin https://github.com/YOUR_USERNAME/fitflow-redesign.git && git push -u origin main`.
4. Configure branch rules for PR/review/status checks, subject to account plan/permissions.

Do not upload signed consent forms, raw participant notes, photos, tokens or sensitive health records.
