"use client";

import React, { useState, useTransition } from "react";
import {
  Database,
  Terminal,
  FileCode2,
  Table2,
  Download,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Key,
  Link2,
  Layers,
  Send,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Zap,
  Cpu,
  Activity,
  Server,
} from "lucide-react";
import { SchemaArchitecture, EntityDefinition, MockEndpoint } from "@/types/schema";
import { synthesizeArchitecture } from "@/lib/engine";

const PRESET_PROMPTS = [
  {
    label: "Healthcare Triage",
    badge: "Clinical 3NF",
    prompt:
      "Hospital emergency triage department with patients, attending doctors, triage evaluations (ESI 1-5), bed occupancy, and medical telemetry alerts",
  },
  {
    label: "B2B SaaS Platform",
    badge: "RBAC & Billing",
    prompt:
      "Multi-tenant SaaS platform with organizations, roles, users, Stripe subscriptions, seat licenses, and immutable audit logs",
  },
  {
    label: "E-Commerce Market",
    badge: "Supply Chain",
    prompt:
      "Autonomous supply chain and e-commerce with customers, regional warehouses, products, orders, normalized order items, and multi-carrier shipments",
  },
  {
    label: "Ride-Sharing Fleet",
    badge: "Mobility & Telemetry",
    prompt:
      "Urban ride-sharing mobility platform with drivers, registered vehicles, riders, booked trips, GPS telemetry pings, and dynamic fare surge pricing",
  },
];

export default function SchemaStudio() {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0].prompt);
  const [architecture, setArchitecture] = useState<SchemaArchitecture>(() =>
    synthesizeArchitecture(PRESET_PROMPTS[0].prompt)
  );
  const [activeTab, setActiveTab] = useState<
    "erd" | "prisma" | "postgres" | "mock-api" | "typescript"
  >("erd");
  const [selectedEndpointPath, setSelectedEndpointPath] = useState<string>("/api/v1/patients");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSynthesizing, startSynthesizing] = useTransition();
  const [mockApiSearch, setMockApiSearch] = useState("");
  const [isSimulatingRequest, setIsSimulatingRequest] = useState(false);
  const [lastSimulatedTime, setLastSimulatedTime] = useState<number>(4);

  // Trigger synthesis
  const handleSynthesize = (targetPrompt?: string) => {
    const text = targetPrompt ?? prompt;
    if (!text.trim()) return;

    startSynthesizing(() => {
      const result = synthesizeArchitecture(text);
      setArchitecture(result);
      if (result.endpoints.length > 0) {
        setSelectedEndpointPath(result.endpoints[0].path);
      }
    });
  };

  // Preset selector
  const handleSelectPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    handleSynthesize(presetPrompt);
  };

  // Copy to clipboard helper with 2-second feedback
  const handleCopy = (content: string, key: string, label: string = "Code") => {
    navigator.clipboard.writeText(content);
    setCopiedSection(key);
    setToastMessage(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedSection((current) => (current === key ? null : current));
      setToastMessage(null);
    }, 2000);
  };

  // Download file helper
  const handleDownload = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simulate mock API send request
  const handleRunMockRequest = () => {
    setIsSimulatingRequest(true);
    const latency = Math.floor(Math.random() * 4) + 3; // simulated 3-6ms
    setTimeout(() => {
      setLastSimulatedTime(latency);
      setIsSimulatingRequest(false);
    }, 160);
  };

  const selectedEndpoint: MockEndpoint | undefined =
    architecture.endpoints.find((ep) => ep.path === selectedEndpointPath) ||
    architecture.endpoints[0];

  // Filter seed records in Mock API if user enters a search term
  const filteredSeedRecords = selectedEndpoint
    ? selectedEndpoint.mockResponse.data.filter((record) => {
        if (!mockApiSearch.trim()) return true;
        return JSON.stringify(record).toLowerCase().includes(mockApiSearch.toLowerCase());
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative">
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER & 1-CLICK EXPORTS */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                SchemaCraft AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded-full">
                Zero-Backend 3NF
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous Relational Schema Architect & In-Memory Mock API Sandbox
            </p>
          </div>
        </div>

        {/* Action Controls & Downloads */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              handleDownload("schema.prisma", architecture.prismaSchema, "text/plain")
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Download Prisma Schema"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>schema.prisma</span>
          </button>

          <button
            onClick={() =>
              handleDownload("init.sql", architecture.postgresDDL, "text/plain")
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Download PostgreSQL DDL"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>init.sql</span>
          </button>

          <button
            onClick={() =>
              handleDownload(
                "seed_fixtures.json",
                JSON.stringify(architecture.endpoints.map((e) => ({ endpoint: e.path, records: e.mockResponse.data })), null, 2),
                "application/json"
              )
            }
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Download Mock Seed JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>seed.json</span>
          </button>
        </div>
      </header>

      {/* 2. PROMPT BAR & QUICK DOMAIN PRESETS */}
      <section className="px-4 lg:px-8 py-5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSynthesize()}
                placeholder="Describe your domain (e.g. ICU triage, B2B SaaS multi-tenant, logistics, ride-sharing)..."
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:ring-1 focus:ring-cyan-500/50"
              />
              <span className="absolute right-3 top-3 text-[11px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hidden sm:inline-block">
                Press Enter
              </span>
            </div>

            <button
              onClick={() => handleSynthesize()}
              disabled={isSynthesizing}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isSynthesizing ? "Synthesizing..." : "Synthesize Architecture"}</span>
            </button>
          </div>

          {/* Quick Domain Presets (Clickable Badge Pills) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Quick Domain Presets:
            </span>
            {PRESET_PROMPTS.map((preset, idx) => {
              const isSelected = prompt === preset.prompt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.prompt)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg border transition flex items-center gap-2 cursor-pointer shadow-sm ${
                    isSelected
                      ? "bg-cyan-950/80 border-cyan-500 text-cyan-300 font-semibold ring-1 ring-cyan-500/40"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected
                        ? "bg-cyan-900/80 text-cyan-200"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {preset.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Synthesis Architecture Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">{architecture.domainName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 hidden md:inline">{architecture.description}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                3NF Validated
              </span>
              <span>
                <strong className="text-slate-200">{architecture.entities.length}</strong> Tables
              </span>
              <span>
                Latency: <strong className="text-cyan-400">{architecture.compilationTimeMs}ms</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STUDIO NAVIGATION TABS */}
      <div className="border-b border-slate-800 px-4 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("erd")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "erd"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Table2 className="w-4 h-4" />
            Relational ERD & Models
            <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-800 text-slate-300 rounded-full">
              {architecture.entities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("prisma")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "prisma"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Prisma Schema
          </button>

          <button
            onClick={() => setActiveTab("postgres")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "postgres"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Database className="w-4 h-4" />
            PostgreSQL DDL
          </button>

          <button
            onClick={() => setActiveTab("typescript")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "typescript"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Code2 className="w-4 h-4" />
            TypeScript Interfaces
          </button>

          <button
            onClick={() => setActiveTab("mock-api")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === "mock-api"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Terminal className="w-4 h-4" />
            In-Memory Mock API
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE VIEWPORT */}
      <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* TAB 1: RELATIONAL ERD & MODELS */}
        {activeTab === "erd" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-200">
                  Relational Entity Graph (3NF Normalized)
                </h2>
                <p className="text-xs text-slate-400">
                  Every entity is equipped with a UUID primary key, indexed foreign keys, and cascading integrity constraints.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Key className="w-3.5 h-3.5" /> Primary Key
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-cyan-400 font-medium">
                  <Link2 className="w-3.5 h-3.5" /> Foreign Key (Cascade)
                </span>
              </div>
            </div>

            {/* Entity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {architecture.entities.map((entity: EntityDefinition) => (
                <div
                  key={entity.name}
                  className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col"
                >
                  {/* Entity Header */}
                  <div className="px-4 py-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{entity.name}</span>
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          {entity.tableName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[260px] mt-0.5">
                        {entity.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      {entity.fields.length} cols
                    </span>
                  </div>

                  {/* Columns List */}
                  <div className="p-3 space-y-1.5 flex-1 divide-y divide-slate-800/40">
                    {entity.fields.map((field) => (
                      <div
                        key={field.name}
                        className="pt-1.5 first:pt-0 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {field.isPrimaryKey ? (
                            <span
                              className="p-1 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40"
                              title="Primary Key"
                            >
                              <Key className="w-3 h-3" />
                            </span>
                          ) : field.isForeignKey ? (
                            <span
                              className="p-1 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40"
                              title="Foreign Key"
                            >
                              <Link2 className="w-3 h-3" />
                            </span>
                          ) : (
                            <div className="w-5 h-5 flex items-center justify-center text-slate-600">
                              •
                            </div>
                          )}

                          <span
                            className={`font-mono truncate ${
                              field.isPrimaryKey
                                ? "text-amber-300 font-semibold"
                                : field.isForeignKey
                                ? "text-cyan-300 font-semibold"
                                : "text-slate-300"
                            }`}
                          >
                            {field.name}
                          </span>
                        </div>

                        {/* Column Metadata & Types */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {field.references && (
                            <span className="flex items-center gap-0.5 text-[10px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-cyan-900/60">
                              <ArrowRight className="w-2.5 h-2.5" />
                              {field.references.targetEntity}
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {field.type}
                          </span>
                          {!field.isNullable && (
                            <span className="text-[9px] font-bold text-slate-500 uppercase">
                              Req
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Entity Footer / Indexes info */}
                  {entity.indexes.length > 0 && (
                    <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="font-medium text-slate-500">Indexes:</span>
                      <div className="flex flex-wrap gap-1">
                        {entity.indexes.map((idx) => (
                          <span
                            key={idx.name}
                            className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-slate-400"
                          >
                            {idx.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRISMA SCHEMA */}
        {activeTab === "prisma" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-200">Prisma Schema (schema.prisma)</h2>
                <p className="text-xs text-slate-400">
                  Ready-to-use Prisma 5+ schema definition with bidirectional relations and cascade behaviors.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* ONE-CLICK COPY CODE BUTTON WITH TOAST FEEDBACK */}
                <button
                  onClick={() => handleCopy(architecture.prismaSchema, "prisma", "Prisma Schema")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                    copiedSection === "prisma"
                      ? "bg-emerald-950 border-emerald-500/70 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:text-white"
                  }`}
                  title="Copy Prisma Schema"
                >
                  {copiedSection === "prisma" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    handleDownload("schema.prisma", architecture.prismaSchema, "text/plain")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/80 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
              <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">schema.prisma</span>
                <span>PostgreSQL Client Provider</span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[640px]">
                {architecture.prismaSchema}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: POSTGRESQL DDL */}
        {activeTab === "postgres" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-200">PostgreSQL DDL (init.sql)</h2>
                <p className="text-xs text-slate-400">
                  Executable SQL script with ANSI constraints, foreign key cascades, and optimal indexing.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* ONE-CLICK COPY CODE BUTTON WITH TOAST FEEDBACK */}
                <button
                  onClick={() => handleCopy(architecture.postgresDDL, "postgres", "PostgreSQL DDL")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                    copiedSection === "postgres"
                      ? "bg-emerald-950 border-emerald-500/70 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:text-white"
                  }`}
                  title="Copy PostgreSQL DDL"
                >
                  {copiedSection === "postgres" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    handleDownload("init.sql", architecture.postgresDDL, "text/plain")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800/60 hover:bg-blue-900/80 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SQL</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
              <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">init.sql</span>
                <span>PostgreSQL 14+ Dialect</span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[640px]">
                {architecture.postgresDDL}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: TYPESCRIPT INTERFACES */}
        {activeTab === "typescript" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-200">TypeScript Type Definitions</h2>
                <p className="text-xs text-slate-400">
                  Strictly typed interfaces and CRUD input type helpers for end-to-end type safety.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(architecture.typescriptDefs, "ts", "TypeScript Types")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                    copiedSection === "ts"
                      ? "bg-emerald-950 border-emerald-500/70 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:text-white"
                  }`}
                >
                  {copiedSection === "ts" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() =>
                    handleDownload("types.ts", architecture.typescriptDefs, "text/plain")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
              <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">types.ts</span>
                <span>TypeScript 5.x</span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[640px]">
                {architecture.typescriptDefs}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: IN-MEMORY MOCK API SANDBOX WITH LIVE DEVELOPER METRICS */}
        {activeTab === "mock-api" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-200">
                In-Memory Mock REST Sandbox
              </h2>
              <p className="text-xs text-slate-400">
                Zero-backend mock HTTP runner delivering relational seed data with referential integrity.
              </p>
            </div>

            {/* LIVE DEVELOPER METRICS STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Status
                  </div>
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    200 OK
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Latency
                  </div>
                  <div className="text-xs font-bold text-cyan-300 font-mono">
                    {lastSimulatedTime}ms
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-purple-950 text-purple-400 border border-purple-800/40">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Memory
                  </div>
                  <div className="text-xs font-bold text-purple-300 font-mono">
                    Local Edge AST
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-800/40">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Execution
                  </div>
                  <div className="text-xs font-bold text-amber-300 font-mono">
                    Zero-Backend Client
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Endpoints selector */}
              <div className="lg:col-span-4 bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Available Simulated Endpoints
                </h3>

                <div className="space-y-2">
                  {architecture.endpoints.map((ep) => {
                    const isSelected = ep.path === selectedEndpointPath;
                    return (
                      <button
                        key={ep.path}
                        onClick={() => setSelectedEndpointPath(ep.path)}
                        className={`w-full text-left p-3 rounded-lg border transition flex flex-col gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-slate-800/90 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/20"
                            : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                              {ep.method}
                            </span>
                            <span className="font-mono text-xs font-semibold text-slate-200">
                              {ep.path}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {ep.mockResponse.count} records
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{ep.summary}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                  <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    Zero-Backend Sandbox
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    This mock API executes completely in-browser inside the local memory state without external network calls.
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Sandbox Runner */}
              <div className="lg:col-span-8 bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
                {/* Console Request Bar */}
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                    <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      GET
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={selectedEndpoint?.path || ""}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs font-mono text-cyan-300 w-full outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunMockRequest}
                      disabled={isSimulatingRequest}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                    >
                      {isSimulatingRequest ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Send Request</span>
                    </button>

                    <button
                      onClick={() =>
                        selectedEndpoint &&
                        handleCopy(
                          JSON.stringify(selectedEndpoint.mockResponse, null, 2),
                          "json",
                          "JSON Response"
                        )
                      }
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer"
                      title="Copy JSON Payload"
                    >
                      {copiedSection === "json" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* HTTP Status & Live Metrics Telemetry Bar */}
                <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      Status: 200 OK
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="font-mono">
                      Latency: <strong className="text-cyan-400">{lastSimulatedTime}ms</strong>
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="font-mono">
                      Memory: <strong className="text-purple-300">Local Edge AST</strong>
                    </span>
                    <span className="text-slate-700">•</span>
                    <span>
                      Count: <strong className="text-slate-200">{filteredSeedRecords.length}</strong>
                    </span>
                  </div>

                  {/* Filter Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={mockApiSearch}
                      onChange={(e) => setMockApiSearch(e.target.value)}
                      placeholder="Filter response JSON..."
                      className="bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-md pl-7 pr-3 py-1 text-[11px] text-slate-200 outline-none w-44"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-1.5" />
                  </div>
                </div>

                {/* JSON Body Viewport */}
                <div className="p-4 bg-slate-950/90 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
                  {isSimulatingRequest ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                      <span>Executing in-memory simulated request...</span>
                    </div>
                  ) : (
                    <pre className="text-emerald-300">
                      {JSON.stringify(
                        {
                          status: 200,
                          statusText: "OK",
                          endpoint: selectedEndpoint?.path,
                          entity: selectedEndpoint?.entityName,
                          matchedRecords: filteredSeedRecords.length,
                          timestamp: selectedEndpoint?.mockResponse.timestamp,
                          data: filteredSeedRecords,
                        },
                        null,
                        2
                      )}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 lg:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>SchemaCraft AI • Devpost "Build With AI: Basics" Hackathon</span>
          <span className="text-slate-700">|</span>
          <span className="text-cyan-500 font-medium">Production-Grade POC</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>100% Client-Side Engine</span>
          <span>•</span>
          <span>PostgreSQL 14+</span>
          <span>•</span>
          <span>Prisma 5+</span>
        </div>
      </footer>
    </div>
  );
}
