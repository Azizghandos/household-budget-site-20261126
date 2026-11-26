// RumahBudget — data for the Santoso household, November 2026.
// A fictional Indonesian family of four (Budi, Sari and two children) living
// in a rented house in Bandung. Every figure below is internally consistent:
// income Rp 12,500,000 = spending Rp 9,800,000 + savings Rp 2,700,000, and
// every category total equals the sum of its transactions in TRANSACTIONS.
// Amounts are rounded to the nearest Rp 5,000; nothing here is a real person.

const DATA = {
  household: {
    name: "The Santoso Family",
    city: "Bandung, West Java",
    members: "Budi (office admin) · Sari (school teacher) · two children",
    month: "November 2026",
    currency: "IDR",
  },

  // Monthly income: two salaries plus one freelance job.
  income: [
    { label: "Salary — Budi, office admin", amount: 8500000 },
    { label: "Salary — Sari, school teacher", amount: 3200000 },
    { label: "Freelance design work — Sari", amount: 800000 },
  ],
  totalIncome: 12500000,

  // Monthly budget per category. "planned" is what the family set aside at
  // the start of November; "actual" is what they really spent, and it is
  // exactly the sum of the matching transactions below.
  categories: [
    { key: "housing",      name: "Housing",           color: "#1d5c3f", planned: 2500000, actual: 2500000 },
    { key: "food",        name: "Food & Groceries",  color: "#d97706", planned: 3000000, actual: 2850000 },
    { key: "transport",   name: "Transport",         color: "#2563eb", planned: 1200000, actual: 1150000 },
    { key: "utilities",   name: "Utilities",         color: "#7c3aed", planned: 900000,  actual: 850000 },
    { key: "education",   name: "Education",         color: "#0891b2", planned: 1500000, actual: 1400000 },
    { key: "health",      name: "Health",            color: "#db2777", planned: 600000,  actual: 550000 },
    { key: "entertainment", name: "Entertainment",   color: "#65a30d", planned: 500000,  actual: 500000 },
  ],
  totalPlannedSpending: 10200000,
  totalSpending: 9800000,
  totalSavings: 2700000,

  // Full November 2026 ledger. Type is "income", "expense" or "savings".
  // Category totals: housing 2,500,000 · food 2,850,000 · transport 1,150,000
  // utilities 850,000 · education 1,400,000 · health 550,000
  // entertainment 500,000 · savings 2,700,000 · income 12,500,000.
  transactions: [
    { date: "2026-11-01", description: "Salary — Budi, office admin", category: "income", type: "income", amount: 8500000 },
    { date: "2026-11-01", description: "Salary — Sari, school teacher", category: "income", type: "income", amount: 3200000 },
    { date: "2026-11-01", description: "House rent — November", category: "housing", type: "expense", amount: 2500000 },
    { date: "2026-11-01", description: "School fees (SPP) — two children", category: "education", type: "expense", amount: 850000 },
    { date: "2026-11-02", description: "Transfer to savings account", category: "savings", type: "savings", amount: 2700000 },
    { date: "2026-11-02", description: "Groceries — Pasar Tradisional Cihapit", category: "food", type: "expense", amount: 420000 },
    { date: "2026-11-03", description: "Fuel — Pertalite, motorcycle", category: "transport", type: "expense", amount: 200000 },
    { date: "2026-11-04", description: "Weekly shop — supermarket", category: "food", type: "expense", amount: 385000 },
    { date: "2026-11-05", description: "Electricity token — PLN prepaid", category: "utilities", type: "expense", amount: 300000 },
    { date: "2026-11-06", description: "Ride-hailing to the office", category: "transport", type: "expense", amount: 45000 },
    { date: "2026-11-07", description: "Groceries — Pasar Tradisional Cihapit", category: "food", type: "expense", amount: 310000 },
    { date: "2026-11-07", description: "Pharmacy — vitamins and medicine", category: "health", type: "expense", amount: 150000 },
    { date: "2026-11-08", description: "Internet & TV — monthly package", category: "utilities", type: "expense", amount: 250000 },
    { date: "2026-11-09", description: "Rice & cooking oil — bulk buy", category: "food", type: "expense", amount: 265000 },
    { date: "2026-11-09", description: "Streaming subscriptions — video & music", category: "entertainment", type: "expense", amount: 150000 },
    { date: "2026-11-10", description: "Fuel — Pertalite, motorcycle", category: "transport", type: "expense", amount: 200000 },
    { date: "2026-11-11", description: "Private tutoring — mathematics", category: "education", type: "expense", amount: 350000 },
    { date: "2026-11-12", description: "Weekly shop — supermarket", category: "food", type: "expense", amount: 340000 },
    { date: "2026-11-13", description: "Toll & parking", category: "transport", type: "expense", amount: 120000 },
    { date: "2026-11-14", description: "Water bill — PDAM", category: "utilities", type: "expense", amount: 120000 },
    { date: "2026-11-15", description: "Freelance design work — Sari", category: "income", type: "income", amount: 800000 },
    { date: "2026-11-15", description: "Groceries — Pasar Tradisional Cihapit", category: "food", type: "expense", amount: 295000 },
    { date: "2026-11-16", description: "Books & stationery — school supplies", category: "education", type: "expense", amount: 200000 },
    { date: "2026-11-17", description: "Fuel — Pertalite, motorcycle", category: "transport", type: "expense", amount: 200000 },
    { date: "2026-11-18", description: "Family dinner out — warung makan", category: "food", type: "expense", amount: 180000 },
    { date: "2026-11-19", description: "Electricity token top-up — PLN prepaid", category: "utilities", type: "expense", amount: 180000 },
    { date: "2026-11-20", description: "Ride-hailing to the office", category: "transport", type: "expense", amount: 55000 },
    { date: "2026-11-21", description: "Weekly shop — supermarket", category: "food", type: "expense", amount: 355000 },
    { date: "2026-11-22", description: "Dental check-up — Sari", category: "health", type: "expense", amount: 400000 },
    { date: "2026-11-23", description: "Family movie night — cinema tickets", category: "entertainment", type: "expense", amount: 200000 },
    { date: "2026-11-24", description: "Fuel — Pertalite, motorcycle", category: "transport", type: "expense", amount: 200000 },
    { date: "2026-11-25", description: "Groceries — Pasar Tradisional Cihapit", category: "food", type: "expense", amount: 300000 },
    { date: "2026-11-26", description: "Family picnic supplies — weekend outing", category: "entertainment", type: "expense", amount: 150000 },
    { date: "2026-11-27", description: "Motorcycle service — oil & brakes", category: "transport", type: "expense", amount: 130000 },
  ],

  // Recurring bills. November bills match transactions above; December bills
  // are the next ones coming due and start as pending.
  bills: [
    { name: "House rent", detail: "Monthly rent, paid by bank transfer", amount: 2500000, due: "1 Nov 2026", paid: true },
    { name: "School fees (SPP)", detail: "Two children, paid to the school", amount: 850000, due: "1 Nov 2026", paid: true },
    { name: "Electricity token", detail: "PLN prepaid token", amount: 300000, due: "5 Nov 2026", paid: true },
    { name: "Internet & TV", detail: "Monthly home package", amount: 250000, due: "8 Nov 2026", paid: true },
    { name: "Streaming subscriptions", detail: "Video & music apps", amount: 150000, due: "9 Nov 2026", paid: true },
    { name: "Water bill (PDAM)", detail: "Metered household water", amount: 120000, due: "14 Nov 2026", paid: true },
    { name: "House rent — December", detail: "Monthly rent, due at the start of the month", amount: 2500000, due: "1 Dec 2026", paid: false },
    { name: "Electricity token — December", detail: "PLN prepaid token", amount: 300000, due: "5 Dec 2026", paid: false },
    { name: "Internet & TV — December", detail: "Monthly home package", amount: 250000, due: "8 Dec 2026", paid: false },
    { name: "School fees (SPP) — December", detail: "Two children, paid to the school", amount: 850000, due: "1 Dec 2026", paid: false },
  ],

  // Savings goals. Monthly contributions add up to November's Rp 2,700,000
  // of savings: 1,000,000 + 800,000 + 500,000 + 400,000.
  goals: [
    { name: "Emergency fund", note: "Six months of essential spending, kept in a separate account.", target: 15000000, saved: 9000000, monthly: 1000000 },
    { name: "Children's education", note: "School fees and university savings for two children.", target: 25000000, saved: 8500000, monthly: 800000 },
    { name: "Family holiday", note: "A week by the sea in Yogyakarta next school holiday.", target: 6000000, saved: 3600000, monthly: 500000 },
    { name: "New motorcycle", note: "Replacing the old bike before it needs another big repair.", target: 18000000, saved: 5400000, monthly: 400000 },
  ],

  // Six months of history for the Reports page (Jun–Nov 2026).
  history: [
    { month: "Jun 2026", income: 12300000, spending: 10100000 },
    { month: "Jul 2026", income: 12400000, spending: 10300000 },
    { month: "Aug 2026", income: 12500000, spending: 9900000 },
    { month: "Sep 2026", income: 12500000, spending: 10200000 },
    { month: "Oct 2026", income: 12600000, spending: 9700000 },
    { month: "Nov 2026", income: 12500000, spending: 9800000 },
  ],

  // The 50/30/20 rule against this household's real November split.
  // Needs: housing + food + transport + utilities + education + health.
  // Wants: entertainment. Savings: the Rp 2,700,000 set aside.
  rule503020: [
    { label: "Needs — 50% target", targetPct: 50, actualPct: 74, actual: 9300000, note: "Rent, food, transport, utilities, school and health come to Rp 9,300,000 — well above the 50% guide, because rent and school fees are fixed." },
    { label: "Wants — 30% target", targetPct: 30, actualPct: 4, actual: 500000, note: "Only Rp 500,000 went to fun: streaming, a movie night and a picnic. The family keeps wants small on purpose." },
    { label: "Savings — 20% target", targetPct: 20, actualPct: 22, actual: 2700000, note: "Rp 2,700,000 saved — above the 20% guide. The surplus from small wants goes straight to the goals." },
  ],
};

// Format an amount as Indonesian rupiah, e.g. Rp 12,500,000.
function formatRupiah(amount) {
  return "Rp " + Number(amount).toLocaleString("en-US");
}

// Short form for chart labels, e.g. 2.5 jt (jutaan = millions).
function formatShort(amount) {
  return (amount / 1000000).toFixed(1).replace(/\.0$/, "") + " jt";
}

// Sum the amounts of a list of transactions.
function sumAmounts(rows) {
  return rows.reduce(function (total, row) { return total + row.amount; }, 0);
}

// Total spent in one category, from the live transaction list.
function categorySpent(rows, key) {
  return sumAmounts(rows.filter(function (row) { return row.category === key && row.type === "expense"; }));
}
