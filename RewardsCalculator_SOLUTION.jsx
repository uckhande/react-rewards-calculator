/**
 * ============================================================
 *  SOLUTION — Customer Rewards Calculator
 *  (Reference implementation — do not share with candidates)
 * ============================================================
 */

import { useState, useEffect } from "react";

// ─── Sample Data ────────────────────────────────────────────
const SAMPLE_DATA = [
  { customerId: 1, customerName: "Alice Morgan",  transactionDate: "2024-01-05", amount: 120 },
  { customerId: 1, customerName: "Alice Morgan",  transactionDate: "2024-01-22", amount: 75  },
  { customerId: 1, customerName: "Alice Morgan",  transactionDate: "2024-02-14", amount: 210 },
  { customerId: 1, customerName: "Alice Morgan",  transactionDate: "2024-03-09", amount: 55  },
  { customerId: 2, customerName: "Bob Chen",      transactionDate: "2024-01-11", amount: 95  },
  { customerId: 2, customerName: "Bob Chen",      transactionDate: "2024-02-03", amount: 150 },
  { customerId: 2, customerName: "Bob Chen",      transactionDate: "2024-02-27", amount: 30  },
  { customerId: 2, customerName: "Bob Chen",      transactionDate: "2024-03-15", amount: 175 },
  { customerId: 3, customerName: "Carmen Rivera", transactionDate: "2024-01-18", amount: 200 },
  { customerId: 3, customerName: "Carmen Rivera", transactionDate: "2024-02-08", amount: 45  },
  { customerId: 3, customerName: "Carmen Rivera", transactionDate: "2024-03-21", amount: 130 },
  { customerId: 3, customerName: "Carmen Rivera", transactionDate: "2024-03-30", amount: 88  },
];

// ─── Points Logic ────────────────────────────────────────────
// $120 → (20×2) + (50×1) = 90 pts
// $75  → (25×1)           = 25 pts
// $30  → 0 pts
function calculatePoints(amount) {
  let points = 0;
  if (amount > 100) points += (Math.floor(amount) - 100) * 2;
  if (amount > 50)  points += (Math.min(Math.floor(amount), 100) - 50) * 1;
  return points;
}

// ─── Simulated Async Fetch ───────────────────────────────────
function fetchTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(SAMPLE_DATA), 1500);
  });
}

// ─── Data Processing ─────────────────────────────────────────
const MONTH_NAMES = ["Jan", "Feb", "Mar"];

function processTransactions(transactions) {
  const customerMap = {};

  transactions.forEach(({ customerId, customerName, transactionDate, amount }) => {
    const monthIndex = new Date(transactionDate).getMonth(); // 0 = Jan
    const pts = calculatePoints(amount);

    if (!customerMap[customerId]) {
      customerMap[customerId] = {
        customerId,
        customerName,
        monthlyPoints: { 0: 0, 1: 0, 2: 0 },
        totalPoints: 0,
      };
    }

    customerMap[customerId].monthlyPoints[monthIndex] += pts;
    customerMap[customerId].totalPoints += pts;
  });

  // Sort descending by total (bonus requirement)
  return Object.values(customerMap).sort((a, b) => b.totalPoints - a.totalPoints);
}

// ─── Styles ──────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: 24,
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: "36px 40px",
    maxWidth: 700,
    width: "100%",
    color: "#f0f0f0",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  },
  heading: {
    margin: "0 0 4px",
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "#fff",
  },
  sub: { margin: "0 0 28px", color: "rgba(255,255,255,0.45)", fontSize: 14 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.4)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  td: {
    padding: "12px 14px",
    fontSize: 15,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  tdNum: {
    padding: "12px 14px",
    fontSize: 15,
    textAlign: "right",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.65)",
    fontVariantNumeric: "tabular-nums",
  },
  totalCell: {
    padding: "12px 14px",
    fontSize: 15,
    textAlign: "right",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontWeight: 700,
    color: "#a78bfa",
    fontVariantNumeric: "tabular-nums",
  },
  topBadge: {
    display: "inline-block",
    background: "rgba(167,139,250,0.2)",
    color: "#a78bfa",
    borderRadius: 6,
    fontSize: 11,
    padding: "1px 7px",
    marginLeft: 8,
    verticalAlign: "middle",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  loading: {
    textAlign: "center",
    padding: "60px 0",
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
  },
  dot: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#a78bfa",
    margin: "0 3px",
    animation: "bounce 1.2s infinite",
  },
};

// ─── Component ───────────────────────────────────────────────
export default function RewardsCalculator() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        setCustomers(processTransactions(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40%          { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-anim { animation: fadeIn 0.4s ease both; }
      `}</style>

      <div style={styles.card}>
        <h1 style={styles.heading}>Rewards Calculator</h1>
        <p style={styles.sub}>Points earned per customer · Jan – Mar 2024</p>

        {loading && (
          <div style={styles.loading}>
            <div>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <p style={{ marginTop: 14 }}>Fetching transactions…</p>
          </div>
        )}

        {error && (
          <p style={{ color: "#f87171", textAlign: "center" }}>Error: {error}</p>
        )}

        {!loading && !error && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                {MONTH_NAMES.map((m) => (
                  <th key={m} style={{ ...styles.th, textAlign: "right" }}>{m}</th>
                ))}
                <th style={{ ...styles.th, textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr key={c.customerId} className="row-anim"
                    style={{ animationDelay: `${idx * 0.08}s` }}>
                  <td style={styles.td}>
                    {c.customerName}
                    {idx === 0 && <span style={styles.topBadge}>TOP</span>}
                  </td>
                  {[0, 1, 2].map((m) => (
                    <td key={m} style={styles.tdNum}>
                      {c.monthlyPoints[m] || 0}
                    </td>
                  ))}
                  <td style={styles.totalCell}>{c.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
