# SchemaCraft AI: Scope Document

**Hackathon Track:** Devpost "Build With AI: Basics"  
**Project:** SchemaCraft AI — Zero-Backend 3NF Relational Schema Architect & Mock API Sandbox  
**Architect:** Principal Full-Stack & Database Systems Architect  
**Status:** Approved for Implementation

---

## 1. Executive Summary & Core Mission
Modern developers and hackathon teams waste crucial early hours manually architecting SQL tables, configuring ORMs, designing foreign key relationships, building TypeScript type definitions, and crafting synthetic seed data just to get an MVP off the ground.

**SchemaCraft AI** solves this bottleneck with a **zero-backend, deterministic relational schema synthesis engine and interactive mock API sandbox**. It ingests high-level natural language domain prompts (e.g. "Hospital emergency triage with patients, doctors, triage assessments, vitals, and bed assignments") and instantly compiles them into:
1. Normalized 3rd Normal Form (3NF) relational entity graphs with referential integrity.
2. Valid, production-grade PostgreSQL DDL scripts (with UUID primary keys, cascading foreign keys, check constraints, and B-tree indexes).
3. Production Prisma schema models with native 1-to-many and many-to-many relations.
4. Strongly typed TypeScript data transfer interfaces.
5. In-browser mock REST sandbox running seeded in-memory endpoints with live JSON inspection.
6. 1-click bundle export (`schema.prisma`, `init.sql`, TS types, mock JSON).

---

## 2. In-Scope Deliverables

### A. Natural Language Intent Parsing & Domain Heuristics
- Deterministic semantic tokenizer and domain classifier supporting diverse archetypes:
  - Healthcare & Clinical Triage
  - B2B Multi-tenant SaaS with Role-Based Access Control (RBAC)
  - E-Commerce Marketplace & Multi-stage Fulfillment
  - FinTech Escrow, Wallets & Double-Entry Ledger
  - Custom user-entered freeform domain prompts
- Automatic relationship extraction (1:N parent-child, M:N association tables).

### B. Relational AST & 3NF Normalization
- Transformation of domain entities into an Abstract Syntax Tree (AST).
- Elimination of repeating groups (1NF), enforcement of full functional dependency on primary keys (2NF), and removal of transitive dependencies (3NF).
- Primary Key (PK) generation (UUIDv4) and Foreign Key (FK) constraint mapping with `ON DELETE CASCADE` or `SET NULL`.
- Standard audit trails (`created_at`, `updated_at`, `status`).

### C. Multi-Target Code & DDL Compilers
- **PostgreSQL DDL Generator**: Valid SQL dialect with `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`, proper ANSI types (`UUID`, `VARCHAR`, `TEXT`, `NUMERIC`, `BOOLEAN`, `TIMESTAMP WITH TIME ZONE`), explicit `CONSTRAINT` clauses, and indexed foreign keys.
- **Prisma Schema Generator**: Complete `schema.prisma` file including `datasource db`, `generator client`, model decorators (`@id`, `@default(uuid())`, `@unique`, `@updatedAt`), and `@relation` links.
- **TypeScript Interface Generator**: Exportable `.d.ts`/`.ts` definitions with strict typing and nested relational navigation properties.

### D. In-Memory Mock REST Sandbox
- Zero-backend, zero-latency HTTP simulator running directly in client state.
- Interactive endpoints (e.g., `GET /api/v1/patients`, `GET /api/v1/triage_assessments`, `GET /api/v1/beds`).
- Real-time JSON response viewer with syntax highlighting, search/filter, HTTP status code badge (200 OK), response latency simulator (<15ms), and copy-to-clipboard functionality.

### E. Developer Experience (DX) & Export Bundle
- Responsive dark-themed studio UI with real-time visual entity cards, badges, and relational connection indicators.
- 1-Click download actions for:
  - `init.sql` (PostgreSQL DDL)
  - `schema.prisma` (Prisma schema)
  - `types.ts` (TypeScript interfaces)
  - `seed.json` (Relational mock data fixture)

---

## 3. Out-of-Scope Boundaries (Strict Non-Goals)

To guarantee zero external friction, immediate zero-config execution, and offline reliability, the following items are intentionally excluded:
- **Direct Cloud Database Migrations**: No direct wire connections to live AWS RDS, Supabase, or Neon instances during the hackathon demo. SchemaCraft produces the exact DDL and Prisma migrations for the user to run.
- **User Authentication & Multi-User Accounts**: No sign-in or session storage required. All state lives client-side in memory and local storage.
- **Live Stateful Remote API Hosting**: The mock sandbox executes in-memory within the browser engine rather than provisioning cloud serverless endpoints.
- **Proprietary LLM API Key Dependency**: The core engine uses a deterministic, rule-based semantic compiler so the tool works 100% offline without requiring paid OpenAI or Anthropic API keys.

---

## 4. Success Metrics & Performance Criteria

| Metric | Target | Verification Method |
|---|---|---|
| **Synthesis Latency** | < 100 ms | Deterministic client-side AST compilation |
| **SQL Syntax Validity** | 100% Valid PostgreSQL | Verified against PostgreSQL 15+ parser standards |
| **Prisma Schema Validity** | 100% Valid Prisma 5+ syntax | Validated model definitions, `@relation`, and field types |
| **Referential Integrity** | 0 Orphan FKs | Every FK references an existing PK in topological dependency order |
| **Offline Reliability** | 100% Functional Offline | Operates with zero network requests or backend servers |
| **UX Responsiveness** | 60 FPS UI | Pure Tailwind CSS + React 18 client state |
