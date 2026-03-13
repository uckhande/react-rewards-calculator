import { useState, useEffect } from "react";

const TRANSACTIONS = [
  { id: 1,  customer: "Alice Chen",   month: "January",  amount: 120 },
  { id: 2,  customer: "Alice Chen",   month: "January",  amount: 75  },
  { id: 3,  customer: "Alice Chen",   month: "February", amount: 200 },
  { id: 4,  customer: "Alice Chen",   month: "February", amount: 50  },
  { id: 5,  customer: "Alice Chen",   month: "March",    amount: 340 },
  { id: 6,  customer: "Bob Torres",   month: "January",  amount: 90  },
  { id: 7,  customer: "Bob Torres",   month: "January",  amount: 110 },
  { id: 8,  customer: "Bob Torres",   month: "February", amount: 55  },
  { id: 9,  customer: "Bob Torres",   month: "March",    amount: 460 },
  { id: 10, customer: "Bob Torres",   month: "March",    amount: 30  },
  { id: 11, customer: "Carol Wright", month: "January",  amount: 500 },
  { id: 12, customer: "Carol Wright", month: "February", amount: 75  },
  { id: 13, customer: "Carol Wright", month: "February", amount: 130 },
  { id: 14, customer: "Carol Wright", month: "March",    amount: 20  },
  { id: 15, customer: "David Park",   month: "January",  amount: 60  },
  { id: 16, customer: "David Park",   month: "February", amount: 80  },
  { id: 17, customer: "David Park",   month: "March",    amount: 95  },
  { id: 18, customer: "Eva Nguyen",   month: "January",  amount: 310 },
  { id: 19, customer: "Eva Nguyen",   month: "February", amount: 220 },
  { id: 20, customer: "Eva Nguyen",   month: "March",    amount: 175 },
];

const MONTHS = ["January", "February", "March"];

// Points rule:
//   $0–$50   → 0 pts
//   $51–$100 → 1 pt per dollar over $50
//   $100+    → 2 pts per dollar over $100 (+ 50 from first tier)
function calcPoints(amount) {
  if (amount <= 50) return 0;
  if (amount <= 100) return amount - 50;
  return (amount - 100) * 2 + 50;
}

// Simulated async API call
function fetchTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(TRANSACTIONS), 900);
  });
}

function buildCustomerSummary(data) {
  const customers = {};
  data.forEach((t) => {
    if (!customers[t.customer]) {
      customers[t.customer] = { total: 0, months: {} };
      MONTHS.forEach((m) => (customers[t.customer].months[m] = 0));
    }
    const pts = calcPoints(t.amount);
    customers[t.customer].total += pts;
    customers[t.customer].months[t.month] += pts;
  });
  return customers;
}

function buildMonthSummary(data) {
  const months = {};
  MONTHS.forEach((m) => (months[m] = { pts: 0, tx: 0, amt: 0 }));
  data.forEach((t) => {
    months[t.month].pts += calcPoints(t.amount);
    months[t.month].tx += 1;
    months[t.month].amt += t.amount;
  });
  return months;
}

function TierBadge({ pts }) {
  if (pts >= 500) return <span style={styles.badgeHigh}>High</span>;
  if (pts >= 100) return <span style={styles.badgeMid}>Mid</span>;
  return <span style={styles.badgeLow}>Low</span>;
}

function MetricCard({ label, value }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>{value}</div>
    </div>
  );
}

export default function RewardsCalculator() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    fetchTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        Loading transaction data...
      </div>
    );
  }

  const customers = buildCustomerSummary(transactions);
  const monthData = buildMonthSummary(transactions);
  const totalPts = Object.values(customers).reduce((s, c) => s + c.total, 0);
  const topCust = Object.entries(customers).sort((a, b) => b[1].total - a[1].total)[0];

  const sortedCustomers = Object.entries(customers).sort(
    (a, b) => b[1].total - a[1].total
  );

  return (
    <div style={styles.app}>
      <h1 style={styles.h1}>Rewards Calculator</h1>
      <p style={styles.subtitle}>Customer transaction points · Jan–Mar 2024</p>

      {/* Metric Cards */}
      <div style={styles.metricsGrid}>
        <MetricCard label="Total Points Issued" value={totalPts.toLocaleString()} />
        <MetricCard label="Transactions" value={transactions.length} />
        <MetricCard
          label="Top Earner"
          value={`${topCust[0].split(" ")[0]} — ${topCust[1].total.toLocaleString()} pts`}
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["summary", "monthly", "transactions"].map((tab) => (
          <button
            key={tab}
            style={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "summary" ? "By Customer" : tab === "monthly" ? "By Month" : "Transactions"}
          </button>
        ))}
      </div>

      {/* Tab: By Customer */}
      {activeTab === "summary" && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                {MONTHS.map((m) => <th key={m} style={styles.th}>{m}</th>)}
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Tier</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map(([name, d]) => (
                <tr key={name}>
                  <td style={styles.td}>{name}</td>
                  {MONTHS.map((m) => (
                    <td key={m} style={{ ...styles.td, ...styles.pts }}>
                      {d.months[m] || 0}
                    </td>
                  ))}
                  <td style={{ ...styles.td, ...styles.pts }}>{d.total.toLocaleString()}</td>
                  <td style={styles.td}><TierBadge pts={d.total} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: By Month */}
      {activeTab === "monthly" && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Month</th>
                <th style={styles.th}>Transactions</th>
                <th style={styles.th}>Revenue</th>
                <th style={styles.th}>Points Issued</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((m) => (
                <tr key={m}>
                  <td style={styles.td}>{m}</td>
                  <td style={styles.td}>{monthData[m].tx}</td>
                  <td style={styles.td}>${monthData[m].amt.toLocaleString()}</td>
                  <td style={{ ...styles.td, ...styles.pts }}>
                    {monthData[m].pts.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Transactions */}
      {activeTab === "transactions" && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Month</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Points</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ ...styles.td, color: "#888" }}>{t.id}</td>
                  <td style={styles.td}>{t.customer}</td>
                  <td style={styles.td}>{t.month}</td>
                  <td style={styles.td}>${t.amount.toLocaleString()}</td>
                  <td style={{ ...styles.td, ...styles.pts }}>{calcPoints(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { fontFamily: "sans-serif", maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" },
  h1: { fontSize: 22, fontWeight: 500, margin: "0 0 4px" },
  subtitle: { fontSize: 13, color: "#888", margin: "0 0 1.5rem" },
  loading: { display: "flex", alignItems: "center", gap: 10, padding: "3rem", color: "#888", fontSize: 14 },
  spinner: {
    width: 18, height: 18,
    border: "2px solid #ddd", borderTopColor: "#999",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "1.5rem" },
  metricCard: { background: "#f5f5f3", borderRadius: 8, padding: "1rem" },
  metricLabel: { fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 },
  metricValue: { fontSize: 20, fontWeight: 500 },
  tabs: { display: "flex", gap: 4, borderBottom: "1px solid #e5e5e5", marginBottom: "1rem" },
  tab: { padding: "6px 14px", fontSize: 13, border: "none", background: "none", cursor: "pointer", color: "#888", borderBottom: "2px solid transparent" },
  tabActive: { padding: "6px 14px", fontSize: 13, border: "none", background: "none", cursor: "pointer", color: "#111", borderBottom: "2px solid #111", fontWeight: 500 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "8px 12px", fontWeight: 500, fontSize: 12, color: "#888", borderBottom: "1px solid #e5e5e5" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f0f0f0", color: "#111" },
  pts: { fontFamily: "monospace", fontWeight: 500 },
  badgeHigh: { display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: "#EAF3DE", color: "#3B6D11" },
  badgeMid:  { display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: "#FAEEDA", color: "#854F0B" },
  badgeLow:  { display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: "#F1EFE8", color: "#5F5E5A" },
};
