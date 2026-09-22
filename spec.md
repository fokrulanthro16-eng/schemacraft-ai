# SchemaCraft AI: Technical Specification

**System Architecture & Implementation Specification**  
**Version:** 1.0.0-PROD  
**Framework:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind CSS 3.4

---

## 1. System Architecture Overview

SchemaCraft AI is built as a zero-backend, client-side relational compiler and simulation engine. It converts natural language prompts into normalized relational schemas, multi-target code generators, and an interactive in-memory REST sandbox.

```
┌─────────────────────────────────────────────────────────────┐
│                    SchemaCraft Studio UI                    │
│    (Prompt Bar, Preset Chips, Multi-tab Viewer, Exporter)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Deterministic Synthesis Engine                 │
│                                                             │
│   ┌────────────────────────┐      ┌─────────────────────┐   │
│   │ Semantic Tokenizer     │ ───► │ Domain Graph Parser │   │
│   └────────────────────────┘      └──────────┬──────────┘   │
│                                              ▼              │
│   ┌────────────────────────┐      ┌─────────────────────┐   │
│   │ 3NF Normalization Unit │ ◄─── │ Relational AST Gen  │   │
│   └──────────┬─────────────┘      └─────────────────────┘   │
│              ▼                                               │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Referential Integrity & DAG Topological Sorter     │   │
│   └──────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────┘
                               │
       ┌───────────────────────┼──────────────────────┐
       ▼                       ▼                      ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  PostgreSQL  │       │    Prisma    │       │  TypeScript  │
│ DDL Compiler │       │   Compiler   │       │ Type Emitter │
└──────────────┘       └──────────────┘       └──────────────┘
                               │
                               ▼
               ┌──────────────────────────────┐
               │    In-Memory REST Sandbox    │
               │ (Seed Fixtures & Mock Runner)│
               └──────────────────────────────┘
```

---

## 2. Core Data Structures (`types/schema.ts`)

The compiler uses a strictly-typed AST representation of relational database components:

### Data Types:
- Supported column types: `uuid`, `string`, `text`, `integer`, `float`, `boolean`, `timestamp`, `json`, `enum`.

### Field Definition (`FieldDefinition`):
- `name`: string (e.g. `patient_id`, `assigned_at`)
- `type`: `DataType`
- `isPrimaryKey`: boolean
- `isForeignKey`: boolean
- `isUnique`: boolean
- `isNullable`: boolean
- `defaultValue`?: string
- `references`?: `{ table: string; field: string; onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" }`
- `description`: string

### Entity Definition (`EntityDefinition`):
- `name`: string (singular, PascalCase, e.g. `Patient`)
- `tableName`: string (plural, snake_case, e.g. `patients`)
- `description`: string
- `fields`: `FieldDefinition[]`
- `indexes`: `{ name: string; fields: string[]; isUnique?: boolean }[]`
- `seedRecords`: `Record<string, unknown>[]`

### Schema Architecture (`SchemaArchitecture`):
- `domainName`: string
- `description`: string
- `entities`: `EntityDefinition[]`
- `postgresDDL`: string
- `prismaSchema`: string
- `typescriptDefs`: string
- `endpoints`: `MockEndpoint[]`

### Mock Endpoint Definition (`MockEndpoint`):
- `path`: string (e.g. `/api/v1/patients`)
- `method`: `"GET" | "POST"`
- `entityName`: string
- `summary`: string
- `mockResponse`: { status: number; count: number; data: unknown[] }

---

## 3. Relational Compiler Pipeline (`lib/engine.ts`)

### Stage 1: Semantic Tokenization & Domain Classification
- Scans input prompts for architectural keywords (e.g., triage, patients, doctor, vitals, tenant, organization, subscription, invoice, product, warehouse, ledger, wallet).
- If recognized, binds domain heuristics and templates with extensible variations.
- If an uncatalogued domain is entered, dynamically splits entity candidates based on nouns and verbs, assigning normalized attributes (UUID PK, descriptive strings, timestamps, relational parent pointers).

### Stage 2: 3NF Normalization Rules
- **1NF:** Every column contains atomic values; repeating arrays are extracted into distinct child tables with foreign key pointers.
- **2NF:** Every non-key attribute is fully functionally dependent on the primary key (enforced via surrogate UUID PKs).
- **3NF:** No transitive dependencies between non-key fields. Related attributes (e.g., Doctors and Departments) are decoupled into relational foreign key joins.

### Stage 3: DAG Ordering & Referential Constraint Resolution
- Entities are sorted topologically according to their dependency graph so that parent tables (`organizations`, `users`, `patients`) are created before child tables (`triage_assessments`, `subscriptions`, `order_items`).
- Cascading delete behaviors (`ON DELETE CASCADE`) are automatically assigned to child entity foreign keys.

### Stage 4: Code Generation Engines
1. **PostgreSQL DDL Generator**:
   - Emits `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
   - Emits ANSI-compliant `CREATE TABLE "table_name" (...)`
   - Emits foreign key constraints with explicit foreign table references and `ON DELETE CASCADE`.
   - Emits `CREATE INDEX idx_... ON ...` for all foreign key columns.
2. **Prisma Schema Generator**:
   - Sets up `datasource db { provider = "postgresql" ... }` and `generator client { provider = "prisma-client-js" }`.
   - Formats PascalCase models with mapped `@@map("table_name")`.
   - Generates `@relation(fields: [foreign_id], references: [id])` and reciprocal collection arrays.
3. **TypeScript Type Emitter**:
   - Generates exportable interfaces with strict type annotations, optional relational navigation properties, and creation payload types.
4. **Mock Fixture Engine & HTTP Sandbox**:
   - Synthesizes realistic contextual seed records (e.g. valid names, medical symptoms, acuity levels, pricing amounts, ISO timestamps).
   - Simulates `GET /api/v1/:entity` with live payload filtering, copyable JSON formatting, and response latency statistics.

---

## 4. Component & UI Architecture (`components/SchemaStudio.tsx`)

### Layout Components:
- **StudioHeader**: Brand title, tagline, statistics counter (entities count, relations count), and quick download buttons (`schema.prisma`, `init.sql`, `seed.json`).
- **PromptBar**: Text input with real-time suggestion pills/chips for quick synthesis (Healthcare Triage, Multi-Tenant B2B, E-Commerce Logistics, FinTech Ledger).
- **NavigationTabs**:
  - `Tab 1: Relational ERD & Models` (Visual card grid, PK/FK badges, field details)
  - `Tab 2: Prisma Schema` (Syntax-highlighted schema view with copy button)
  - `Tab 3: PostgreSQL DDL` (Complete SQL migration script with syntax highlighting and copy button)
  - `Tab 4: In-Memory Mock API` (REST endpoint selector, simulated HTTP console, live JSON response inspection)
- **StatusBar**: Visual indicators for 3NF compliance, compilation time (<20ms), and zero-backend status.
