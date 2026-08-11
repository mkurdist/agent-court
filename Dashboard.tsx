import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Github,
  Wallet,
  Gavel,
  Users,
  Activity,
  Sparkles,
  Clock,
  AlertTriangle,
  Zap,
  Lock,
  FileCheck,
  Radio,
  Plus,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Link2,
  ChevronRight,
  CircleDot,
  BadgeCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// AgentCourt Protocol — Dashboard
// A trustless dispute resolution & settlement UI for autonomous AI agents,
// built on GenLayer's non-deterministic web access + LLM equivalence consensus.
// ---------------------------------------------------------------------------

// ---- Mock validator set (GenLayer consensus nodes) -------------------------
const VALIDATORS = [
  { id: "v1", addr: "0x71C7...9e3F" },
  { id: "v2", addr: "0x4A2B...c118" },
  { id: "v3", addr: "0x9F0e...7Ad2" },
  { id: "v4", addr: "0x1Dab...44Bc" },
  { id: "v5", addr: "0x8e21...F0a9" },
];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const uid = () => Math.random().toString(36).slice(2, 9);

// A preloaded, already-settled case so the dashboard tells a story on first load.
const DEMO_CASE = {
  id: "CASE-02",
  title: "Ship rate-limiter middleware + docs",
  amount: 1000,
  state: "SETTLED", // IDLE | CREATED | FUNDED | DELIVERED | ADJUDICATING | SETTLED
  requirements: [
    { id: "R1", text: "Passes full CI/CD test suite", weight: 40 },
    { id: "R2", text: "API p95 latency under 200ms", weight: 30 },
    { id: "R3", text: "Docs cover all public endpoints", weight: 30 },
  ],
  evidence: {
    repo: "github.com/nova-agent/rate-limiter/pull/48",
    endpoint: "api.novaagent.dev/v1/health",
    note: "CI green on merge commit 7f3a9c1. Load-tested at 4x expected traffic.",
  },
  verdict: {
    results: { R1: true, R2: true, R3: false },
    votes: { R1: [1, 1, 1, 1, 0], R2: [1, 1, 0, 1, 1], R3: [0, 1, 0, 0, 0] },
    convergence: 87,
    payout: 700,
    refund: 300,
  },
};

const nextCaseId = (id) => {
  const n = parseInt(id.split("-")[1], 10) || 1;
  return `CASE-${String(n + 1).padStart(2, "0")}`;
};

// ---- State pill styling -----------------------------------------------------
const STATE_STYLES = {
  IDLE: { label: "AWAITING CASE", dot: "bg-slate-500", text: "text-slate-300", ring: "ring-slate-600/40" },
  CREATED: { label: "CREATED", dot: "bg-sky-400", text: "text-sky-300", ring: "ring-sky-500/30" },
  FUNDED: { label: "ESCROW FUNDED", dot: "bg-cyan-400", text: "text-cyan-300", ring: "ring-cyan-500/30" },
  DELIVERED: { label: "AWAITING ADJUDICATION", dot: "bg-violet-400", text: "text-violet-300", ring: "ring-violet-500/30" },
  ADJUDICATING: { label: "ADJUDICATING", dot: "bg-amber-400 animate-pulse", text: "text-amber-300", ring: "ring-amber-500/30" },
  SETTLED: { label: "SETTLED", dot: "bg-emerald-400", text: "text-emerald-300", ring: "ring-emerald-500/30" },
};

// =============================================================================
// Toast system
// =============================================================================
function ToastStack({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md animate-[fadeIn_0.2s_ease-out] ${
            t.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
              : t.type === "error"
              ? "bg-red-950/80 border-red-500/40 text-red-200"
              : "bg-slate-800/90 border-slate-600/50 text-slate-200"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          ) : t.type === "error" ? (
            <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
          ) : (
            <Zap size={18} className="mt-0.5 shrink-0 text-cyan-400" />
          )}
          <div className="text-sm leading-snug">
            <p className="font-medium">{t.title}</p>
            {t.desc && <p className="text-xs opacity-70 mt-0.5">{t.desc}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Small building blocks
// =============================================================================
function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-700/70 bg-slate-800/40 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ icon: Icon, children, accent = "text-cyan-400" }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className={accent} />
      <h3 className="text-xs font-semibold tracking-[0.15em] text-slate-400 uppercase">{children}</h3>
    </div>
  );
}

function PrimaryButton({ children, onClick, loading, disabled, icon: Icon, variant = "cyan", className = "" }) {
  const variants = {
    cyan: "bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30 text-slate-950",
    violet: "bg-violet-500 hover:bg-violet-400 shadow-violet-500/30 text-slate-950",
    amber: "bg-amber-400 hover:bg-amber-300 shadow-amber-500/30 text-slate-950",
    slate: "bg-slate-700 hover:bg-slate-600 shadow-none text-slate-200",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold
      transition-all duration-200 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
      ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-400 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 " +
  "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors";

// =============================================================================
// Header
// =============================================================================
function Header({ tab, setTab, netStatus }) {
  const tabs = [
    { id: "buyer", label: "Buyer Dashboard" },
    { id: "provider", label: "Provider Dashboard" },
    { id: "court", label: "Court & Consensus" },
  ];
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-slate-700">
              <Scale size={20} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-50 flex items-center gap-1.5">
                AgentCourt Protocol <span className="text-base">⚖️</span>
              </h1>
              <p className="text-[11px] text-slate-500 tracking-wide">
                Trustless Dispute Resolution &amp; Settlement on GenLayer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400">
              <CircleDot size={12} className="text-violet-400" />
              GenLayer Testnet
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {netStatus}
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors duration-200 ${
                tab === t.id ? "text-slate-50" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute left-3 right-3 -bottom-[9px] h-[2px] bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

// =============================================================================
// Case Overview Card
// =============================================================================
function CaseOverview({ kase }) {
  const style = STATE_STYLES[kase.state];
  const verdictLabel = kase.verdict
    ? kase.verdict.payout === kase.amount
      ? "Full Payout"
      : kase.verdict.payout === 0
      ? "Rejected"
      : "Partial Payout"
    : "Pending";

  return (
    <GlassCard className="p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2 relative">
        <span className="text-xs tracking-widest text-slate-500 uppercase">Active Case</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full ring-1 ${style.ring} bg-slate-900/60 px-3 py-1 text-[11px] font-semibold tracking-wide ${style.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 relative">
        <div>
          <p className="text-[11px] text-slate-500 mb-1">Case ID</p>
          <p className="font-mono text-lg text-slate-50 tracking-tight">{kase.id}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[10rem]">{kase.title}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 mb-1">Escrow Balance</p>
          <p className="text-lg text-slate-50 font-semibold">
            {kase.amount.toLocaleString()} <span className="text-xs text-slate-500 font-normal">USDC</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Lock size={10} /> {kase.state === "IDLE" || kase.state === "CREATED" ? "not locked" : "locked in contract"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 mb-1">AI Verdict</p>
          <p
            className={`text-lg font-semibold ${
              !kase.verdict
                ? "text-slate-500"
                : kase.verdict.payout === kase.amount
                ? "text-emerald-400"
                : kase.verdict.payout === 0
                ? "text-red-400"
                : "text-amber-400"
            }`}
          >
            {verdictLabel}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {kase.verdict ? `${kase.verdict.convergence}% validator convergence` : "awaiting evidence"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 mb-1">Settlement</p>
          <p className="text-lg text-slate-50 font-semibold">
            {kase.verdict ? `${kase.verdict.payout} / ${kase.amount}` : "—"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">provider payout / total escrow</p>
        </div>
      </div>
    </GlassCard>
  );
}

// =============================================================================
// Buyer Tab
// =============================================================================
function BuyerTab({ kase, onCreateCase, onFundEscrow, busy }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(1000);
  const [reqs, setReqs] = useState([
    { id: uid(), text: "Passes full CI/CD test suite", weight: 40 },
    { id: uid(), text: "API p95 latency under 200ms", weight: 30 },
    { id: uid(), text: "Docs cover all public endpoints", weight: 30 },
  ]);

  const totalWeight = reqs.reduce((s, r) => s + (Number(r.weight) || 0), 0);

  const updateReq = (id, patch) => setReqs((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addReq = () => setReqs((rs) => [...rs, { id: uid(), text: "", weight: 0 }]);
  const removeReq = (id) => setReqs((rs) => rs.filter((r) => r.id !== id));

  const canCreate = title.trim().length > 2 && amount > 0 && totalWeight === 100 && reqs.every((r) => r.text.trim());
  const canFund = kase.state === "CREATED";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Create Case ------------------------------------------------------- */}
      <GlassCard className="p-5 sm:p-6">
        <SectionLabel icon={FileCheck} accent="text-sky-400">
          Create New Case (On-Chain)
        </SectionLabel>

        <div className="space-y-4">
          <Field label="Task Title">
            <input
              className={inputClass}
              placeholder="e.g. Ship rate-limiter middleware + docs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          <Field label="Escrow Amount (USDC)">
            <input
              type="number"
              min={1}
              className={inputClass}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400">Requirements &amp; Weights</span>
              <span className={`text-[11px] font-mono ${totalWeight === 100 ? "text-emerald-400" : "text-amber-400"}`}>
                {totalWeight}/100
              </span>
            </div>
            <div className="space-y-2">
              {reqs.map((r, i) => (
                <div key={r.id} className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500 w-6 shrink-0">R{i + 1}</span>
                  <input
                    className={inputClass}
                    placeholder="Requirement description"
                    value={r.text}
                    onChange={(e) => updateReq(r.id, { text: e.target.value })}
                  />
                  <input
                    type="number"
                    className={`${inputClass} w-20 shrink-0 text-center`}
                    value={r.weight}
                    onChange={(e) => updateReq(r.id, { weight: Number(e.target.value) })}
                  />
                  <button
                    onClick={() => removeReq(r.id)}
                    className="shrink-0 text-slate-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addReq}
              className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Plus size={12} /> Add requirement
            </button>
          </div>

          <PrimaryButton
            icon={ArrowUpRight}
            loading={busy === "create"}
            disabled={!canCreate || busy}
            onClick={() => onCreateCase({ title, amount, requirements: reqs })}
            className="w-full mt-2"
          >
            Deploy Case On-Chain
          </PrimaryButton>
          {!canCreate && (
            <p className="text-[11px] text-slate-500 -mt-2">
              Requires a title, funded amount, and requirement weights totaling exactly 100.
            </p>
          )}
        </div>
      </GlassCard>

      {/* Fund Escrow -------------------------------------------------------- */}
      <GlassCard className="p-5 sm:p-6 flex flex-col">
        <SectionLabel icon={Wallet} accent="text-cyan-400">
          Fund Escrow
        </SectionLabel>

        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
            <Lock size={26} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-slate-50">
            {(kase.state === "CREATED" || kase.state === "IDLE" ? kase.amount : kase.amount).toLocaleString()}
            <span className="text-base font-normal text-slate-500 ml-1">USDC</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Funds are locked in the AgentCourt smart contract until deterministic settlement releases them.
          </p>
        </div>

        <PrimaryButton
          icon={Wallet}
          loading={busy === "fund"}
          disabled={!canFund || busy}
          onClick={onFundEscrow}
          className="w-full"
        >
          {kase.state === "CREATED" ? `Fund Escrow (${kase.amount.toLocaleString()} USDC)` : "Escrow Already Funded"}
        </PrimaryButton>
        {kase.state === "IDLE" && (
          <p className="text-[11px] text-slate-500 mt-2 text-center">Create a case above before funding escrow.</p>
        )}
      </GlassCard>
    </div>
  );
}

// =============================================================================
// Provider Tab
// =============================================================================
function ProviderTab({ kase, onSubmitDelivery, busy }) {
  const [repo, setRepo] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [note, setNote] = useState("");

  const canSubmit = kase.state === "FUNDED" && repo.trim().length > 3;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <GlassCard className="p-5 sm:p-6">
        <SectionLabel icon={Github} accent="text-violet-400">
          Submit Delivery &amp; Evidence
        </SectionLabel>

        <div className="space-y-4">
          <Field label="GitHub Commit / PR Link">
            <input
              className={inputClass}
              placeholder="github.com/org/repo/pull/48"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
          </Field>
          <Field label="Live API Test Endpoint">
            <input
              className={inputClass}
              placeholder="api.yourservice.dev/v1/health"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </Field>
          <Field label="Delivery Notes">
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Anything validators should know when fetching evidence..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>

          <PrimaryButton
            icon={ArrowUpRight}
            variant="violet"
            loading={busy === "deliver"}
            disabled={!canSubmit || busy}
            onClick={() => onSubmitDelivery({ repo, endpoint, note })}
            className="w-full mt-2"
          >
            Submit Delivery &amp; Evidence
          </PrimaryButton>
          {kase.state !== "FUNDED" && (
            <p className="text-[11px] text-slate-500 -mt-2">
              {kase.state === "IDLE" || kase.state === "CREATED"
                ? "Waiting on buyer to fund escrow before delivery can be submitted."
                : "Delivery has already been submitted for this case."}
            </p>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <SectionLabel icon={Link2} accent="text-slate-400">
          Submitted Evidence Package
        </SectionLabel>
        {kase.evidence ? (
          <div className="space-y-3">
            <EvidenceRow icon={Github} label="Repository" value={kase.evidence.repo} />
            <EvidenceRow icon={Activity} label="API Endpoint" value={kase.evidence.endpoint} />
            <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-3">
              <p className="text-[11px] text-slate-500 mb-1">Provider notes</p>
              <p className="text-sm text-slate-300">{kase.evidence.note}</p>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              Evidence hash pinned — validators will fetch this non-deterministically during adjudication.
            </p>
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-slate-500">
            No evidence submitted yet for {kase.id}.
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function EvidenceRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2.5">
      <Icon size={15} className="text-slate-500 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="text-sm text-slate-200 font-mono truncate">{value}</p>
      </div>
    </div>
  );
}

// =============================================================================
// Scales of Justice — signature visualization.
// Tilts left/right based on the weighted requirement score (0-100).
// =============================================================================
function ScalesOfJustice({ scorePct, animating }) {
  // scorePct 50 = balanced. >50 tilts toward payout (right pan down), <50 toward refund.
  const tilt = animating ? 0 : (scorePct - 50) * 0.34; // degrees, capped ~ -17..17
  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[240px] mx-auto">
      {/* base */}
      <rect x="112" y="140" width="16" height="10" rx="2" fill="#334155" />
      <rect x="90" y="148" width="60" height="6" rx="3" fill="#334155" />
      {/* pillar */}
      <rect x="117" y="40" width="6" height="102" fill="#475569" />
      {/* pivot cap */}
      <circle cx="120" cy="38" r="6" fill="#22d3ee" className={animating ? "animate-pulse" : ""} />
      {/* beam + pans, rotated around pivot */}
      <g
        style={{
          transformOrigin: "120px 38px",
          transform: `rotate(${tilt}deg)`,
          transition: animating ? "none" : "transform 900ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <line x1="40" y1="38" x2="200" y2="38" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        {/* left pan (refund) */}
        <line x1="48" y1="38" x2="48" y2="72" stroke="#475569" strokeWidth="1.5" />
        <path d="M30 72 Q48 92 66 72" stroke="#8b5cf6" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* right pan (payout) */}
        <line x1="192" y1="38" x2="192" y2="72" stroke="#475569" strokeWidth="1.5" />
        <path d="M174 72 Q192 92 210 72" stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// =============================================================================
// Court & Consensus Tab
// =============================================================================
function CourtTab({ kase, onAdjudicate, busy, liveVotes, convergenceLive }) {
  const canAdjudicate = kase.state === "DELIVERED" || kase.state === "SETTLED";
  const isRunning = busy === "adjudicate";

  const votes = isRunning ? liveVotes : kase.verdict?.votes || {};
  const requirements = kase.requirements;

  const scorePct = kase.verdict
    ? Math.round(
        (requirements.reduce((s, r) => s + (kase.verdict.results[r.id] ? r.weight : 0), 0) /
          requirements.reduce((s, r) => s + r.weight, 0)) *
          100
      )
    : 50;

  return (
    <div className="space-y-6">
      {/* Validator Consensus + Scales ------------------------------------- */}
      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="lg:col-span-3 p-5 sm:p-6">
          <SectionLabel icon={Users} accent="text-cyan-400">
            Validator Consensus
          </SectionLabel>

          <div className="space-y-2">
            {VALIDATORS.map((v, i) => {
              const req0 = requirements[0]?.id;
              const vArr = votes[req0];
              const revealed = vArr && vArr[i] !== null && vArr[i] !== undefined;
              const passed = revealed && vArr[i] === 1;
              return (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-lg bg-slate-900/50 border border-slate-700/70 px-3 py-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
                    <Radio size={12} className="text-slate-400" />
                  </div>
                  <span className="font-mono text-xs text-slate-400">{v.addr}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    {!revealed && isRunning ? (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1">
                        <Loader2 size={11} className="animate-spin" /> reasoning…
                      </span>
                    ) : revealed ? (
                      <span
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          passed ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {passed ? "PASS" : "FAIL"}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600">idle</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={12} /> Equivalence Convergence
              </span>
              <span className="font-mono text-cyan-300">
                {isRunning ? convergenceLive : kase.verdict?.convergence || 0}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ width: `${isRunning ? convergenceLive : kase.verdict?.convergence || 0}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5">
              Non-deterministic LLM reasoning across validators, reconciled via GenLayer's equivalence principle.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5 sm:p-6 flex flex-col items-center justify-between">
          <SectionLabel icon={Scale} accent="text-amber-400">
            Deterministic Balance
          </SectionLabel>
          <ScalesOfJustice scorePct={kase.verdict ? scorePct : 50} animating={isRunning} />
          <div className="flex items-center justify-between w-full max-w-[240px] text-[11px] mt-2">
            <span className="text-violet-400">◂ Refund</span>
            <span className="text-cyan-400">Payout ▸</span>
          </div>

          <PrimaryButton
            icon={Gavel}
            variant="amber"
            loading={isRunning}
            disabled={!canAdjudicate || busy}
            onClick={onAdjudicate}
            className="w-full mt-5"
          >
            {isRunning ? "Adjudicating…" : "Request AI Adjudication"}
          </PrimaryButton>
          {!canAdjudicate && !isRunning && (
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Provider must submit delivery evidence before adjudication can run.
            </p>
          )}
        </GlassCard>
      </div>

      {/* Requirement breakdown + payout math -------------------------------- */}
      <GlassCard className="p-5 sm:p-6">
        <SectionLabel icon={BadgeCheck} accent="text-emerald-400">
          Requirement Scoring &amp; Settlement Logic
        </SectionLabel>

        {!kase.verdict && !isRunning ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No verdict yet — run adjudication to compute the deterministic score breakdown.
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-5">
              {requirements.map((r) => {
                const vArr = votes[r.id];
                const revealed = kase.verdict || (vArr && vArr.every((x) => x !== null && x !== undefined));
                const result = kase.verdict ? kase.verdict.results[r.id] : vArr ? vArr.filter((x) => x === 1).length >= 3 : null;
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-lg bg-slate-900/50 border border-slate-700/70 px-4 py-3"
                  >
                    <span className="font-mono text-xs text-slate-500 w-6 shrink-0">{r.id}</span>
                    <span className="text-sm text-slate-200 flex-1 min-w-0 truncate">{r.text}</span>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">w={r.weight}</span>
                    <span className="shrink-0 w-14 text-right">
                      {result === null || result === undefined ? (
                        <Loader2 size={14} className="animate-spin text-amber-400 inline" />
                      ) : result ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-sm">
                          <CheckCircle2 size={14} /> R{r.id.slice(1)} ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-semibold text-sm">
                          <XCircle size={14} /> R{r.id.slice(1)} ✗
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {kase.verdict && (
              <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-4 sm:p-5">
                <p className="text-[11px] tracking-widest text-slate-500 uppercase mb-3">Deterministic Payout Calculation</p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-slate-300">
                  <span className="text-slate-500">payout</span>
                  <span>=</span>
                  <span className="text-cyan-300">{kase.amount}</span>
                  <span className="text-slate-500">×</span>
                  <span className="text-slate-400">
                    (
                    {requirements
                      .filter((r) => kase.verdict.results[r.id])
                      .map((r) => r.weight)
                      .join(" + ") || 0}
                    )
                  </span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">{requirements.reduce((s, r) => s + r.weight, 0)}</span>
                  <span>=</span>
                  <span className="text-emerald-400 font-bold">{kase.verdict.payout} USDC</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-[11px] text-slate-500">Released to Provider</p>
                    <p className="text-lg font-bold text-cyan-300">{kase.verdict.payout} USDC</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Refunded to Buyer</p>
                    <p className="text-lg font-bold text-violet-300">{kase.verdict.refund} USDC</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </GlassCard>
    </div>
  );
}

// =============================================================================
// Root component
// =============================================================================
export default function AgentCourtDashboard() {
  const [tab, setTab] = useState("court");
  const [kase, setKase] = useState(DEMO_CASE);
  const [busy, setBusy] = useState(null); // 'create' | 'fund' | 'deliver' | 'adjudicate' | null
  const [toasts, setToasts] = useState([]);
  const [liveVotes, setLiveVotes] = useState({});
  const [convergenceLive, setConvergenceLive] = useState(0);
  const toastTimers = useRef({});

  const pushToast = useCallback((type, title, desc) => {
    const id = uid();
    setToasts((t) => [...t, { id, type, title, desc }]);
    toastTimers.current[id] = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4200);
  }, []);
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  useEffect(() => () => Object.values(toastTimers.current).forEach(clearTimeout), []);

  // -- Buyer: create case ----------------------------------------------------
  const handleCreateCase = async ({ title, amount, requirements }) => {
    setBusy("create");
    await sleep(1100);
    setKase({
      id: nextCaseId(kase.id),
      title,
      amount,
      state: "CREATED",
      requirements: requirements.map((r, i) => ({ id: `R${i + 1}`, text: r.text, weight: Number(r.weight) })),
      evidence: null,
      verdict: null,
    });
    setBusy(null);
    pushToast("success", "Case deployed on-chain", `${nextCaseId(kase.id)} awaiting escrow funding.`);
    setTab("buyer");
  };

  // -- Buyer: fund escrow ------------------------------------------------------
  const handleFundEscrow = async () => {
    setBusy("fund");
    await sleep(1000);
    setKase((k) => ({ ...k, state: "FUNDED" }));
    setBusy(null);
    pushToast("success", "Escrow funded", `${kase.amount.toLocaleString()} USDC locked in contract.`);
  };

  // -- Provider: submit delivery ------------------------------------------------
  const handleSubmitDelivery = async (evidence) => {
    setBusy("deliver");
    await sleep(1100);
    setKase((k) => ({ ...k, state: "DELIVERED", evidence }));
    setBusy(null);
    pushToast("success", "Delivery submitted", "Evidence package pinned for validator review.");
    setTab("court");
  };

  // -- Court: run adjudication -----------------------------------------------
  const handleAdjudicate = async () => {
    setBusy("adjudicate");
    setKase((k) => ({ ...k, state: "ADJUDICATING", verdict: null }));
    pushToast("info", "Fetching web evidence…", "Validators are retrieving non-deterministic proof from external sources.");

    const requirements = kase.requirements;
    const votes = {};
    requirements.forEach((r) => (votes[r.id] = [null, null, null, null, null]));
    setLiveVotes({ ...votes });
    setConvergenceLive(0);

    // Hidden "true" outcome per requirement, biased toward pass.
    const trueResult = {};
    requirements.forEach((r) => (trueResult[r.id] = Math.random() < 0.72));

    let agreementSum = 0;
    let agreementCount = 0;

    for (let vi = 0; vi < VALIDATORS.length; vi++) {
      await sleep(650);
      requirements.forEach((r) => {
        const agrees = Math.random() < 0.85;
        const vote = agrees ? (trueResult[r.id] ? 1 : 0) : trueResult[r.id] ? 0 : 1;
        votes[r.id][vi] = vote;
        agreementSum += agrees ? 1 : 0;
        agreementCount += 1;
      });
      setLiveVotes({ ...votes, ...Object.fromEntries(Object.entries(votes).map(([k, v]) => [k, [...v]])) });
      setConvergenceLive(Math.round((agreementSum / agreementCount) * 100));
    }

    await sleep(500);

    const results = {};
    requirements.forEach((r) => {
      const passCount = votes[r.id].filter((v) => v === 1).length;
      results[r.id] = passCount >= 3; // majority of 5
    });

    const totalWeight = requirements.reduce((s, r) => s + r.weight, 0);
    const earnedWeight = requirements.reduce((s, r) => s + (results[r.id] ? r.weight : 0), 0);
    const payout = Math.round((kase.amount * earnedWeight) / totalWeight);
    const refund = kase.amount - payout;
    const convergence = Math.round((agreementSum / agreementCount) * 100);

    setKase((k) => ({
      ...k,
      state: "SETTLED",
      verdict: { results, votes, convergence, payout, refund },
    }));
    setBusy(null);
    pushToast(
      "success",
      "Consensus reached — Case Settled",
      `${payout} USDC released to provider, ${refund} USDC refunded to buyer.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 [background:radial-gradient(circle_at_20%_-10%,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_100%_10%,rgba(139,92,246,0.08),transparent_35%),#020617]">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Header tab={tab} setTab={setTab} netStatus="Network Live" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <CaseOverview kase={kase} />

        <div className="animate-[fadeIn_0.25s_ease-out]" key={tab}>
          {tab === "buyer" && (
            <BuyerTab kase={kase} onCreateCase={handleCreateCase} onFundEscrow={handleFundEscrow} busy={busy} />
          )}
          {tab === "provider" && (
            <ProviderTab kase={kase} onSubmitDelivery={handleSubmitDelivery} busy={busy} />
          )}
          {tab === "court" && (
            <CourtTab
              kase={kase}
              onAdjudicate={handleAdjudicate}
              busy={busy}
              liveVotes={liveVotes}
              convergenceLive={convergenceLive}
            />
          )}
        </div>

        <p className="text-center text-[11px] text-slate-700 pt-4 pb-2">
          AgentCourt Protocol — deterministic settlement powered by GenLayer's Optimistic Democracy consensus.
        </p>
      </main>

      <ToastStack toasts={toasts} dismiss={dismissToast} />
    </div>
  );
}
