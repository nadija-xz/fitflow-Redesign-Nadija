# Proposed FitFlow technology stack

**Status:** Coursework architecture, not a deployed application.

- iOS/Android and web: React Native / Expo + TypeScript (React DOM where useful for web accessibility).
- Application API: NestJS (Node.js), modular REST plus Socket.IO events.
- AI: FastAPI/Python inference, optional TensorFlow Lite on device after feasibility testing.
- Primary data: managed PostgreSQL; option for explicit RLS plus API authorization.
- Identity: Amazon Cognito with server-side ownership and group checks.
- Optional managed Redis: ephemeral rate limiting/cache only, no retained PHI.
- Media: private short-lived object storage; approved meals saved without requiring long-lived photos.

The original case study uses React Native, Node/Express, Firebase and TensorFlow Lite. This proposal preserves React Native/Node and evaluates a PostgreSQL+scoped-WebSocket alternative to Firebase to meet relational data/control needs. See ADR-001.

**Security caveat:** No vendor or architecture is automatically HIPAA/GDPR compliant. Assess applicability, sign required BAAs and verify the exact in-scope services/configurations before storing protected health information.
