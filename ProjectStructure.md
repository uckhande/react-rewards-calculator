Project Structure
Repository layout, setup instructions, and contribution guide for the React Rewards Calculator assignment.

Repository Structure
rewards-calculator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MetricCard.jsx
│   │   ├── RewardsTable.jsx
│   │   └── TierBadge.jsx
│   ├── data/
│   │   └── transactions.js
│   ├── utils/
│   │   └── calcPoints.js
│   ├── App.jsx
│   └── index.js
├── .gitignore
├── package.json
└── README.md

File Responsibilities

src/data/transactions.js	- Sample dataset — 20 transactions across 5 customers and 3 months

src/utils/calcPoints.js - 	Pure function implementing the two-tier points calculation rule

src/components/MetricCard.jsx - 	Displays a single summary metric (label + value)

src/components/TierBadge.jsx	- Renders a colour-coded High / Mid / Low badge based on point total

src/components/RewardsTable.jsx - 	Tabular view — accepts 'summary' | 'monthly' | 'transactions' prop

src/App.jsx	- Root component: async fetch, useEffect/useState, tab switching

src/index.js- 	React DOM entry point


Setup & Run
Prerequisites: Node.js ≥ 18, npm ≥ 9
