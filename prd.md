# SchemaCraft AI: Product Requirements Document (PRD)

**Project Name:** SchemaCraft AI  
**Event:** Devpost "Build With AI: Basics" Hackathon  
**Target Release:** Production-Grade MVP / Demo  
**Audience:** Technical Judges, Hackathon Participants, Full-Stack Engineers, System Architects

---

## 1. Problem Statement & Market Opportunity
During hackathons and early-stage startup sprints, software engineers spend 4–8 hours drafting foundational database architectures before writing a single line of business logic:
- Manually designing relational tables, determining primary/foreign keys, and normalizing data to 3NF.
- Writing redundant PostgreSQL DDL scripts, constraints, indices, and foreign key cascades.
- Re-transcribing database models into Prisma schemas (`schema.prisma`) and TypeScript interfaces.
- Crafting mock seed data and dummy JSON mock servers to unblock frontend developers.

Any subsequent schema adjustment requires updating SQL files, Prisma schemas, TypeScript models, and mock fixtures simultaneously, frequently introducing synchronization bugs and foreign key constraint errors.

**SchemaCraft AI** automates this entire pipeline into a single, sub-100ms compilation step from natural language prompts, delivering an instant in-memory API sandbox and clean code exports.

---

## 2. Target User Persona

### Primary Persona: Alex (Full-Stack Engineer & Hackathon Builder)
- **Role:** Lead Engineer at an early-stage venture or competitive hackathon builder.
- **Pain Point:** Wants to start building the frontend and API routes immediately, but gets bogged down designing database tables, writing SQL migrations, and setting up Mockoon or mock servers.
- **Goal:** Enter a single plain English prompt like *"B2B SaaS with Organizations, Users, Roles, Subscriptions, and Audit Logs"* and instantly receive production-ready Prisma schemas, PostgreSQL DDL, TypeScript types, and live mock API endpoints.

### Secondary Persona: Morgan (Database Architect & Technical Founder)
- **Role:** Technical Co-founder or Systems Architect evaluating data models.
- **Pain Point:** Junior engineers often create unnormalized schemas with repeating arrays, duplicate records, missing foreign key indexes, and unconstrained relationships.
- **Goal:** Ensure data models follow strict 3rd Normal Form (3NF) relational integrity with proper cascading delete behaviors and optimal indexing strategies.

---

## 3. End-to-End User Journeys

```
[1. Prompt Input / Preset Selection]
               │
               ▼
[2. Deterministic Semantic Synthesis Engine]
   ├─ Entity Detection & Attribute Inference
   ├─ Relational Normalization (1NF -> 2NF -> 3NF)
   ├─ Topological Dependency Sorting (DAG)
   └─ Seed Data Generation with FK Consistency
               │
               ▼
[3. SchemaStudio Multi-View Experience]
   ├─ Tab 1: Visual Relational ERD & Entity Cards
   ├─ Tab 2: Validated Prisma Schema Viewer
   ├─ Tab 3: Production PostgreSQL DDL Viewer
   └─ Tab 4: Interactive In-Memory Mock REST Sandbox
               │
               ▼
[4. 1-Click Code & Artifact Export]
   ├─ schema.prisma
   ├─ init.sql
   ├─ types.ts
   └─ seed.json
```

### Detailed Journey Steps:
1. **Prompt Entry & Inspiration**:
   - The user opens SchemaCraft Studio.
   - User types a custom prompt or clicks one of the instant starter presets:
     - *Clinical Emergency Triage System* (Patients, Doctors, Triage Assessments, Beds, Medical Alerts)
     - *Multi-Tenant B2B SaaS Platform* (Workspaces, Users, Role Bindings, Plans, Subscriptions, Audit Events)
     - *Autonomous Logistics & E-Commerce* (Customers, Warehouses, Products, Orders, Order Items, Shipments)
     - *FinTech Escrow & Ledger* (Accounts, Ledgers, Transactions, Escrow Contracts, Wallets)
   - User clicks **"Synthesize Architecture"** (or hits Enter).
2. **Instant AST Compilation (< 50ms)**:
   - The relational synthesizer parses the input, generates 3NF entities, infers optimal types (UUID, VARCHAR, NUMERIC, TIMESTAMP), binds foreign keys, and seeds 3–5 realistic mock records per entity.
3. **Multi-Tab Exploration**:
   - **ERD & Models:** Interactive cards displaying field names, types, primary key (`PK`) badges, foreign key (`FK -> Table.field`) reference badges, and nullability.
   - **Prisma Schema:** Highlighted `schema.prisma` with syntax formatting, copy button, and download button.
   - **PostgreSQL DDL:** Formatted ANSI SQL with `CREATE EXTENSION`, `CREATE TABLE`, `REFERENCES ... ON DELETE CASCADE`, and `CREATE INDEX` on foreign key columns.
   - **In-Memory Mock API:** Live sandbox with endpoint selector (e.g. `GET /api/v1/patients`), realistic response payload viewer, status code indicator (`200 OK`), response latency metric, and copy button.
4. **1-Click Export**:
   - User can download individual artifacts (`init.sql`, `schema.prisma`, `types.ts`, `seed.json`) or copy snippets directly into their project repository.

---

## 4. Edge-Case Handling & Robustness

1. **Vague or Short Prompts**:
   - If user enters something generic like *"blog"* or *"cars"*, the engine intelligently matches the core domain and supplies a complete, normalized relational architecture (e.g., Authors, Posts, Categories, Comments, Tags).
2. **Cyclic Foreign Key Dependencies**:
   - The compiler performs a Directed Acyclic Graph (DAG) topological sort on entity creation. If circular references exist (e.g. User points to Org, Org points to User), the compiler defers the secondary constraint as an `ALTER TABLE ... ADD CONSTRAINT` in SQL, and marks the field optional in Prisma to avoid infinite migration deadlock.
3. **Seed Data Referential Consistency**:
   - When generating mock records for child entities, foreign key fields always reference primary key UUIDs that actually exist in the parent mock records.
4. **Case Insensitivity & Pluralization**:
   - Handles singular/plural terms (`patient` vs `patients`) uniformly, creating PascalCase models for Prisma and snake_case tables for PostgreSQL.
5. **Offline-First Resilience**:
   - Zero reliance on external network calls or remote third-party AI APIs. Operates with 100% deterministic fidelity on any air-gapped machine.

---

## 5. Non-Functional Requirements

- **Speed:** Full schema compilation must take under 100 milliseconds.
- **Portability:** Generated SQL must be executable on any standard PostgreSQL instance (v13–v17).
- **Usability:** Responsive layout with dark mode palette (`slate-950`, `emerald-500`, `indigo-500`, `amber-500`) optimized for developer ergonomics.
- **Accessibility:** High contrast text, clear visual badges, and keyboard accessibility for prompt entry.
