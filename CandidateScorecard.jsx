import { useState } from "react";

// ─── Scorecard Schema ─────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "react_fundamentals",
    title: "React Fundamentals",
    icon: "⚛️",
    weight: 25,
    criteria: [
      {
        id: "hooks",
        label: "Hooks Usage",
        desc: "Correct use of useState, useEffect lifecycle and dependency arrays",
        max: 5,
      },
      {
        id: "component_design",
        label: "Component Architecture",
        desc: "Meaningful decomposition (ScoreRing, CheckRow, PreviewCard as separate components)",
        max: 5,
      },
      {
        id: "state_mgmt",
        label: "State Management",
        desc: "No Redux used; clean local state with hooks only",
        max: 5,
      },
      {
        id: "derived_state",
        label: "Derived State & Memoization",
        desc: "Avoids redundant state; computes score from text without storing both",
        max: 5,
      },
    ],
  },
  {
    id: "async_js",
    title: "Async & Data Handling",
    icon: "🔄",
    weight: 20,
    criteria: [
      {
        id: "async_sim",
        label: "Async Simulation",
        desc: "fetchTransactions() returns a Promise via setTimeout correctly",
        max: 5,
      },
      {
        id: "loading_state",
        label: "Loading / Error States",
        desc: "UI shows spinner/skeleton during fetch; handles error gracefully",
        max: 5,
      },
      {
        id: "useeffect_cleanup",
        label: "useEffect Correctness",
        desc: "Fetch called on mount; dependencies correct; no stale closure issues",
        max: 5,
      },
      {
        id: "data_transform",
        label: "Data Transformation",
        desc: "processTransactions() logic is clean, correct, and side-effect-free",
        max: 5,
      },
    ],
  },
  {
    id: "code_quality",
    title: "Code Quality",
    icon: "🧹",
    weight: 20,
    criteria: [
      {
        id: "readability",
        label: "Readability & Naming",
        desc: "Clear variable/function names, logical file structure, no magic numbers",
        max: 5,
      },
      {
        id: "pure_functions",
        label: "Pure Functions",
        desc: "calculatePoints() is pure — no side effects, deterministic output",
        max: 5,
      },
      {
        id: "dry",
        label: "DRY Principle",
        desc: "No copy-pasted logic; shared helpers extracted appropriately",
        max: 5,
      },
      {
        id: "comments",
        label: "Comments & Documentation",
        desc: "Key decisions explained; no over-commenting trivial lines",
        max: 5,
      },
    ],
  },
  {
    id: "ui_ux",
    title: "UI / UX Execution",
    icon: "🎨",
    weight: 20,
    criteria: [
      {
        id: "visual_design",
        label: "Visual Design Quality",
        desc: "Consistent spacing, color, typography — doesn't look default",
        max: 5,
      },
      {
        id: "responsive",
        label: "Responsive / Layout",
        desc: "Layout adapts; no overflow issues at common screen sizes",
        max: 5,
      },
      {
        id: "feedback",
        label: "User Feedback",
        desc: "Loading, empty, and error states all handled with clear messaging",
        max: 5,
      },
      {
        id: "interactivity",
        label: "Interactivity & Micro-interactions",
        desc: "Animations, transitions, hover states add polish without distraction",
        max: 5,
      },
    ],
  },
  {
    id: "bonus",
    title: "Bonus Criteria",
    icon: "⭐",
    weight: 15,
    criteria: [
      {
        id: "sorting",
        label: "Sort by Total Points",
        desc: "Customers sorted descending; re-sorts dynamically if data changes",
        max: 5,
      },
      {
        id: "top_earner",
        label: "Top Earner Highlighted",
        desc: "Visual distinction (badge, color, icon) for #1 customer",
        max: 5,
      },
      {
        id: "error_handling",
        label: "Error Handling",
        desc: "Simulated fetch rejection caught and displayed to user",
        max: 5,
      },
      {
        id: "creativity",
        label: "Creative / Extra Polish",
        desc: "Went beyond requirements: custom hook, animation, accessibility, tests, etc.",
        max: 5,
      },
    ],
  },
];

const RATING_LABELS = ["—", "Poor", "Below Avg", "Average", "Good", "Excellent"];
const RATING_COLORS = ["#334155", "#ef4444", "#f97316", "#eab308", "#3b82f6", "#10b981"];

// ─── Verdict Logic ────────────────────────────────────────────────────────────
function getVerdict(pct) {
  if (pct >= 85) return { label: "Strong Hire", color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "🚀" };
  if (pct >= 70) return { label: "Hire", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: "✅" };
  if (pct >= 55) return { label: "Maybe — Review Needed", color: "#eab308", bg: "rgba(234,179,8,0.12)", icon: "🤔" };
  return { label: "No Hire", color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: "❌" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RatingPips({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const active = n <= (hover || value);
        const col = active ? RATING_COLORS[hover || value] : "#1e293b";
        return (
          <button
            key={n}
            onClick={() => onChange(n === value ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            title={RATING_LABELS[n]}
            style={{
              width: 28, height: 28, borderRadius: 6,
              border: `2px solid ${active ? col : "#1e293b"}`,
              background: active ? col : "transparent",
              color: active ? "#fff" : "#475569",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              transition: "all 0.15s",
              transform: active ? "scale(1.1)" : "scale(1)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {n}
          </button>
        );
      })}
      {(hover || value) > 0 && (
        <span style={{ fontSize: 11, color: RATING_COLORS[hover || value], marginLeft: 4, fontWeight: 600, minWidth: 70 }}>
          {RATING_LABELS[hover || value]}
        </span>
      )}
    </div>
  );
}

function SectionCard({ section, scores, onChange, index }) {
  const earned = section.criteria.reduce((s, c) => s + (scores[c.id] || 0), 0);
  const maxPossible = section.criteria.reduce((s, c) => s + c.max, 0);
  const pct = maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0;
  const col = pct >= 80 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct >= 40 ? "#eab308" : "#ef4444";

  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      overflow: "hidden",
      animation: `fadeUp 0.4s ease ${index * 0.07}s both`,
    }}>
      {/* Section header */}
      <div style={{
        padding: "16px 22px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>{section.icon}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#f1f5f9" }}>
              {section.title}
            </h3>
            <span style={{ fontSize: 11, color: "#475569" }}>Weight: {section.weight}% of total</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: col, fontFamily: "'DM Mono', monospace" }}>
            {earned}<span style={{ fontSize: 13, color: "#475569" }}>/{maxPossible}</span>
          </div>
          <div style={{
            height: 4, width: 80, background: "#0f172a", borderRadius: 99,
            marginTop: 4, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: col, borderRadius: 99,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Criteria rows */}
      <div style={{ padding: "8px 0" }}>
        {section.criteria.map((criterion, ci) => (
          <div
            key={criterion.id}
            style={{
              padding: "14px 22px",
              borderBottom: ci < section.criteria.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16, alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Syne', sans-serif" }}>
                {criterion.label}
              </div>
              <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{criterion.desc}</div>
            </div>
            <RatingPips
              value={scores[criterion.id] || 0}
              onChange={(v) => onChange(criterion.id, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ sections, scores }) {
  const cx = 120, cy = 120, r = 90;
  const n = sections.length;
  const points = sections.map((sec, i) => {
    const earned = sec.criteria.reduce((s, c) => s + (scores[c.id] || 0), 0);
    const max = sec.criteria.reduce((s, c) => s + c.max, 0);
    const ratio = max > 0 ? earned / max : 0;
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
      label: sec.title,
      icon: sec.icon,
      lx: cx + (r + 22) * Math.cos(angle),
      ly: cy + (r + 22) * Math.sin(angle),
    };
  });

  const gridPoints = (ratio) =>
    sections.map((_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${cx + r * ratio * Math.cos(angle)},${cy + r * ratio * Math.sin(angle)}`;
    }).join(" ");

  const polyPath = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 240 240" style={{ width: "100%", maxWidth: 240 }}>
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon key={ratio} points={gridPoints(ratio)}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {sections.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line key={i}
            x1={cx} y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          />
        );
      })}
      <polygon points={polyPath}
        fill="rgba(99,102,241,0.2)"
        stroke="#6366f1" strokeWidth="2" strokeLinejoin="round"
        style={{ transition: "all 0.4s ease" }}
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#6366f1" />
          <text x={p.lx} y={p.ly + 4} textAnchor="middle"
            fontSize="9" fill="#64748b" fontFamily="'DM Sans', sans-serif">
            {p.icon}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ScorecardApp() {
  const [candidateName, setCandidateName] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [notes, setNotes] = useState("");
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleScore = (id, val) => setScores((prev) => ({ ...prev, [id]: val }));

  // Weighted total
  const totalMax = SECTIONS.reduce((s, sec) => s + sec.criteria.reduce((a, c) => a + c.max, 0), 0);
  const totalEarned = SECTIONS.reduce((s, sec) => s + sec.criteria.reduce((a, c) => a + (scores[c.id] || 0), 0), 0);
  const rawPct = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  // Weighted percentage
  const weightedPct = Math.round(
    SECTIONS.reduce((sum, sec) => {
      const earned = sec.criteria.reduce((s, c) => s + (scores[c.id] || 0), 0);
      const max = sec.criteria.reduce((s, c) => s + c.max, 0);
      return sum + (max > 0 ? (earned / max) * sec.weight : 0);
    }, 0)
  );

  const verdict = getVerdict(weightedPct);
  const filledCount = Object.values(scores).filter((v) => v > 0).length;
  const totalCriteria = SECTIONS.reduce((s, sec) => s + sec.criteria.length, 0);
  const completeness = Math.round((filledCount / totalCriteria) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04080f",
      backgroundImage: `
        radial-gradient(ellipse 70% 50% at 10% 0%, rgba(99,102,241,0.08) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 90% 100%, rgba(16,185,129,0.06) 0%, transparent 55%)
      `,
      fontFamily: "'DM Sans', sans-serif",
      color: "#f1f5f9",
      paddingBottom: 80,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        input, textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f1f5f9;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus, textarea:focus { border-color: #6366f1; }
        input::placeholder, textarea::placeholder { color: #334155; }
        .submit-btn {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none; color: #fff;
          padding: 14px 36px; border-radius: 12px;
          font-size: 15px; font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer; letter-spacing: 0.03em;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.45); }
        .reset-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; padding: 14px 28px;
          border-radius: 12px; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .reset-btn:hover { border-color: #ef4444; color: #ef4444; }
      `}</style>

      {/* ── Top Bar ── */}
      <div style={{
        background: "rgba(4,8,15,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "18px 40px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
        animation: "fadeUp 0.35s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 0 20px rgba(99,102,241,0.4)",
          }}>📋</div>
          <div>
            <h1 style={{ fontSize: 17, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.3px" }}>
              Candidate Scorecard
            </h1>
            <p style={{ fontSize: 12, color: "#475569", marginTop: 1 }}>Frontend React Engineer · Assignment Review</p>
          </div>
        </div>
        {/* Completeness pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "8px 16px",
        }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>Completion</div>
          <div style={{
            width: 80, height: 6, background: "#0f172a", borderRadius: 99, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${completeness}%`,
              background: completeness === 100 ? "#10b981" : "#6366f1",
              borderRadius: 99, transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: completeness === 100 ? "#10b981" : "#6366f1", fontFamily: "'DM Mono', monospace" }}>
            {completeness}%
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28, alignItems: "start" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Candidate Info */}
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "22px 24px",
              animation: "fadeUp 0.35s ease 0.05s both",
            }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Syne', sans-serif" }}>
                Candidate Info
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#475569", display: "block", marginBottom: 6 }}>Candidate Name</label>
                  <input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="e.g. Jane Smith" />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#475569", display: "block", marginBottom: 6 }}>Reviewer / Interviewer</label>
                  <input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="e.g. Alex (Engineering Lead)" />
                </div>
              </div>
            </div>

            {/* Section Cards */}
            {SECTIONS.map((section, i) => (
              <SectionCard
                key={section.id}
                section={section}
                scores={scores}
                onChange={handleScore}
                index={i + 1}
              />
            ))}

            {/* Notes */}
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "22px 24px",
              animation: "fadeUp 0.4s ease 0.4s both",
            }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontFamily: "'Syne', sans-serif" }}>
                Reviewer Notes
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observations, red flags, standout moments, follow-up questions…"
                rows={5}
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, animation: "fadeUp 0.4s ease 0.5s both" }}>
              <button className="submit-btn" onClick={() => setSubmitted(true)}>
                Submit Scorecard →
              </button>
              <button className="reset-btn" onClick={() => {
                setScores({}); setCandidateName(""); setInterviewer(""); setNotes(""); setSubmitted(false);
              }}>
                Reset
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ── */}
          <div style={{ position: "sticky", top: 90, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Live Score Card */}
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "24px 20px",
              animation: "fadeUp 0.4s ease 0.15s both",
            }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, fontFamily: "'Syne', sans-serif" }}>
                Live Score
              </h3>

              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 56, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: verdict.color, lineHeight: 1 }}>
                  {weightedPct}
                </div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>weighted score</div>
              </div>

              {/* Verdict */}
              <div style={{
                background: verdict.bg, border: `1px solid ${verdict.color}30`,
                borderRadius: 10, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
                animation: submitted ? "popIn 0.4s ease" : "none",
              }}>
                <span style={{ fontSize: 20 }}>{verdict.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: verdict.color, fontFamily: "'Syne', sans-serif" }}>
                    {verdict.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>
                    {totalEarned}/{totalMax} raw points
                  </div>
                </div>
              </div>

              {/* Per-section bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SECTIONS.map((sec) => {
                  const e = sec.criteria.reduce((s, c) => s + (scores[c.id] || 0), 0);
                  const m = sec.criteria.reduce((s, c) => s + c.max, 0);
                  const p = m > 0 ? Math.round((e / m) * 100) : 0;
                  const col = p >= 80 ? "#10b981" : p >= 60 ? "#6366f1" : p >= 40 ? "#eab308" : "#ef4444";
                  return (
                    <div key={sec.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{sec.icon} {sec.title}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: col, fontFamily: "'DM Mono', monospace" }}>{e}/{m}</span>
                      </div>
                      <div style={{ height: 5, background: "#0f172a", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${p}%`,
                          background: col, borderRadius: 99,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Radar Chart */}
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px",
              display: "flex", flexDirection: "column", alignItems: "center",
              animation: "fadeUp 0.4s ease 0.25s both",
            }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, alignSelf: "flex-start", fontFamily: "'Syne', sans-serif" }}>
                Skill Radar
              </h3>
              <RadarChart sections={SECTIONS} scores={scores} />
            </div>

            {/* Legend */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12, padding: "14px 16px",
              animation: "fadeUp 0.4s ease 0.3s both",
            }}>
              <div style={{ fontSize: 11, color: "#334155", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Rating Scale
              </div>
              {RATING_LABELS.slice(1).map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5,
                    background: RATING_COLORS[i + 1],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: "#fff",
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Submission Toast ── */}
      {submitted && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "#0f172a", border: "1px solid rgba(99,102,241,0.4)",
          borderRadius: 14, padding: "16px 28px",
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          animation: "popIn 0.35s ease",
          zIndex: 200,
        }}>
          <span style={{ fontSize: 24 }}>{verdict.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>
              Scorecard submitted — {candidateName || "Candidate"}: {verdict.label}
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
              Weighted score: {weightedPct}/100 · {totalEarned}/{totalMax} raw points
            </div>
          </div>
          <button onClick={() => setSubmitted(false)} style={{
            background: "none", border: "none", color: "#475569",
            cursor: "pointer", fontSize: 18, marginLeft: 8,
          }}>✕</button>
        </div>
      )}
    </div>
  );
}
