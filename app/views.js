// RumahBudget — hash-router pages. Each view is a function of the live
// state (transactions, budgets, bills), so every control that changes state
// re-renders the page it is on and the totals everywhere stay consistent.

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

function kpiCard(label, value, sub, tone) {
  return '<div class="card kpi ' + (tone || "") + '"><div class="kpi-label">' + label + '</div>' +
    '<div class="kpi-value">' + value + '</div><div class="kpi-sub">' + sub + '</div></div>';
}

function categoryOptions(selected) {
  var opts = '<option value="">All categories</option>';
  DATA.categories.forEach(function (c) {
    opts += '<option value="' + c.key + '"' + (selected === c.key ? " selected" : "") + '>' + c.name + '</option>';
  });
  return opts + '<option value="income"' + (selected === "income" ? " selected" : "") + '>Income</option>' +
    '<option value="savings"' + (selected === "savings" ? " selected" : "") + '>Savings</option>';
}

// ---- Overview dashboard -------------------------------------------------
function viewOverview(state) {
  var spent = sumAmounts(state.transactions.filter(function (t) { return t.type === "expense"; }));
  var income = sumAmounts(state.transactions.filter(function (t) { return t.type === "income"; }));
  var saved = income - spent;
  var rate = Math.round((saved / income) * 100);
  var slices = DATA.categories.map(function (c) {
    return { name: c.name, value: categorySpent(state.transactions, c.key), color: c.color };
  });
  var pending = state.bills.filter(function (b) { return !b.paid; });
  var recent = state.transactions.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 5);
  var health = rate >= 20 ? "Healthy — saving above the 20% guide" : "Tight — saving below the 20% guide";
  return '<section class="page-head"><h1>November 2026 at a glance</h1>' +
    '<p class="lede">The Santoso household in Bandung: two salaries, two children, one shared pot. ' +
    'Income ' + formatRupiah(income) + ' · spending ' + formatRupiah(spent) + ' · saved ' + formatRupiah(saved) + '.</p></section>' +
    '<div class="kpi-grid">' +
    kpiCard("Household income", formatRupiah(income), "November 2026 · 2 salaries + freelance", "good") +
    kpiCard("Total spending", formatRupiah(spent), "Across 7 categories · plan was " + formatRupiah(DATA.totalPlannedSpending), "") +
    kpiCard("Saved this month", formatRupiah(saved), "Savings rate " + rate + "% of income", "good") +
    kpiCard("Budget health", rate + "% saved", health, rate >= 20 ? "good" : "warn") +
    '</div>' +
    '<div class="two-col">' +
    '<div class="card"><h2>Where the money went</h2>' + donutChart(slices, 220) +
    '<p class="note">Housing and food are two thirds of spending — rent and the weekly market shop. ' +
    'Every slice adds up to the ' + formatRupiah(spent) + ' in the ledger.</p></div>' +
    '<div class="card"><h2>Upcoming bills</h2>' + upcomingBillsHtml(pending) +
    '<p><a class="btn" href="#/bills">See all bills &amp; subscriptions →</a></p>' +
    '<h2 class="mt">Latest transactions</h2>' + miniLedgerHtml(recent) +
    '<p><a class="btn" href="#/transactions">Open the full ledger →</a></p></div>' +
    '</div>' +
    '<div class="card"><h2>Savings goals — November</h2><p class="lede">This month’s ' + formatRupiah(saved) +
    ' of savings is split across four goals: emergency fund ' + formatRupiah(1000000) + ', children’s education ' +
    formatRupiah(800000) + ', family holiday ' + formatRupiah(500000) + ', new motorcycle ' + formatRupiah(400000) +
    '. <a href="#/goals">Track the goals →</a></p></div>';
}

function upcomingBillsHtml(pending) {
  if (!pending.length) return '<p class="note">Nothing outstanding — every bill is paid. 🎉</p>';
  return '<ul class="bill-list">' + pending.map(function (b) {
    return '<li><div><b>' + escapeHtml(b.name) + '</b><span>' + escapeHtml(b.detail) + '</span></div>' +
      '<div class="bill-right"><b>' + formatRupiah(b.amount) + '</b><span class="due">due ' + escapeHtml(b.due) + '</span></div></li>';
  }).join("") + '</ul>';
}

function miniLedgerHtml(rows) {
  return '<table class="mini-table"><thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead><tbody>' +
    rows.map(function (t) {
      return '<tr><td>' + t.date.slice(5) + '</td><td>' + escapeHtml(t.description) + '</td>' +
        '<td class="num ' + (t.type === "income" ? "in" : "out") + '">' + (t.type === "income" ? "+" : "−") + formatRupiah(t.amount) + '</td></tr>';
    }).join("") + '</tbody></table>';
}

// ---- Budget planner ------------------------------------------------------
function viewPlanner(state) {
  var rows = DATA.categories.map(function (c) {
    var actual = categorySpent(state.transactions, c.key);
    var planned = state.budgets[c.key];
    var remaining = planned - actual;
    var pct = Math.round((actual / planned) * 100);
    return '<article class="card budget-card"><div class="budget-head">' +
      '<h3><span class="swatch" style="background:' + c.color + '"></span>' + c.name + '</h3>' +
      '<span class="pill ' + (remaining < 0 ? "over" : "under") + '">' + (remaining < 0 ? "Over by " + formatRupiah(-remaining) : formatRupiah(remaining) + " left") + '</span></div>' +
      '<label class="budget-edit">Monthly budget <input type="number" min="0" step="50000" value="' + planned +
      '" data-budget="' + c.key + '" aria-label="Monthly budget for ' + c.name + '"> </label>' +
      budgetBars(planned, actual) +
      '<p class="note">' + pct + '% of the plan used · ' + formatRupiah(actual) + ' spent in November 2026.</p></article>';
  }).join("");
  var totalPlanned = Object.keys(state.budgets).reduce(function (s, k) { return s + state.budgets[k]; }, 0);
  var totalSpent = sumAmounts(state.transactions.filter(function (t) { return t.type === "expense"; }));
  return '<section class="page-head"><h1>Budget planner — November 2026</h1>' +
    '<p class="lede">Set a monthly budget for each category and watch the bars move. ' +
    'Edit any amount below — the bars, the remaining amounts and the totals update straight away. ' +
    'Spent figures come from the real transaction ledger, so the plan and the truth always match.</p></section>' +
    '<div class="kpi-grid">' +
    kpiCard("Total planned", formatRupiah(totalPlanned), "Across 7 spending categories", "") +
    kpiCard("Total spent", formatRupiah(totalSpent), "From " + state.transactions.filter(function (t) { return t.type === "expense"; }).length + " expense entries", "") +
    kpiCard("Still to spend", formatRupiah(totalPlanned - totalSpent), totalPlanned - totalSpent >= 0 ? "Under plan overall — well done" : "Over plan overall — tighten up", totalPlanned - totalSpent >= 0 ? "good" : "warn") +
    '</div>' +
    '<div class="budget-grid">' + rows + '</div>' +
    '<div class="card"><h2>How the planner works</h2><p class="lede">1. Type a new budget for a category and press Enter — the bar redraws. ' +
    '2. Add spending in the <a href="#/transactions">transactions ledger</a> and the “Spent” bar grows here too. ' +
    '3. A red “Over by” pill means that category needs a smaller plan next month or less spending this week.</p></div>';
}

// ---- Transactions ledger --------------------------------------------------
function viewTransactions(state) {
  var rows = state.transactions.slice();
  if (state.filter) rows = rows.filter(function (t) { return t.category === state.filter; });
  if (state.search) {
    var q = state.search.toLowerCase();
    rows = rows.filter(function (t) { return t.description.toLowerCase().indexOf(q) !== -1; });
  }
  var dir = state.sortDir === "desc" ? -1 : 1;
  rows.sort(function (a, b) {
    var k = state.sortKey;
    if (k === "amount") return (a.amount - b.amount) * dir;
    if (k === "date") return a.date.localeCompare(b.date) * dir;
    return String(a[k]).localeCompare(String(b[k])) * dir;
  });
  var spent = sumAmounts(rows.filter(function (t) { return t.type === "expense"; }));
  var earned = sumAmounts(rows.filter(function (t) { return t.type === "income"; }));
  return '<section class="page-head"><h1>Transactions — November 2026</h1>' +
    '<p class="lede">Every rupiah in and out this month: ' + state.transactions.length + ' entries. ' +
    'Search, filter by category, or click a column heading to sort. Add a new entry below and the totals update at once.</p></section>' +
    '<div class="card"><div class="ledger-tools">' +
    '<label>Search <input id="tx-search" type="search" placeholder="e.g. groceries, fuel, school…" value="' + escapeHtml(state.search) + '"></label>' +
    '<label>Category <select id="tx-filter">' + categoryOptions(state.filter) + '</select></label>' +
    '<span class="ledger-count">' + rows.length + ' shown · in ' + formatRupiah(earned) + ' · out ' + formatRupiah(spent) + '</span>' +
    '</div>' +
    '<div class="table-scroll"><table class="ledger"><thead><tr>' +
    th("date", "Date", state) + th("description", "Description", state) + th("category", "Category", state) + th("amount", "Amount", state) +
    '</tr></thead><tbody>' +
    (rows.length ? rows.map(function (t) {
      return '<tr><td>' + t.date + '</td><td>' + escapeHtml(t.description) + '</td><td>' + categoryName(t.category) + '</td>' +
        '<td class="num ' + (t.type === "income" ? "in" : "out") + '">' + (t.type === "income" ? "+" : "−") + formatRupiah(t.amount) + '</td></tr>';
    }).join("") : '<tr><td colspan="4" class="empty">No transactions match — try a different search or category.</td></tr>') +
    '</tbody></table></div></div>' +
    '<div class="card"><h2>Add a transaction</h2>' +
    '<form id="tx-form" class="add-form">' +
    '<label>Date <input name="date" type="date" value="2026-11-27" required></label>' +
    '<label>Description <input name="description" type="text" placeholder="e.g. Groceries — market" maxlength="80" required></label>' +
    '<label>Category <select name="category">' + DATA.categories.map(function (c) { return '<option value="' + c.key + '">' + c.name + '</option>'; }).join("") +
    '<option value="income">Income</option><option value="savings">Savings</option></select></label>' +
    '<label>Amount (Rp) <input name="amount" type="number" min="1000" step="1000" placeholder="150000" required></label>' +
    '<button type="submit" class="btn primary">Add transaction</button>' +
    '</form><p class="note" id="tx-added"></p></div>';
}

function th(key, label, state) {
  var arrow = state.sortKey === key ? (state.sortDir === "asc" ? " ▲" : " ▼") : "";
  return '<th><button class="sort-btn" data-sort="' + key + '">' + label + arrow + '</button></th>';
}

function categoryName(key) {
  if (key === "income") return "Income";
  if (key === "savings") return "Savings";
  var found = DATA.categories.filter(function (c) { return c.key === key; })[0];
  return found ? found.name : key;
}

// ---- Bills & subscriptions ------------------------------------------------
function viewBills(state) {
  var paid = state.bills.filter(function (b) { return b.paid; });
  var pending = state.bills.filter(function (b) { return !b.paid; });
  var pendingTotal = sumAmounts(pending);
  var paidTotal = sumAmounts(paid);
  return '<section class="page-head"><h1>Bills &amp; subscriptions</h1>' +
    '<p class="lede">The fixed costs that repeat every month. Tap “Mark paid” when a bill is settled — ' +
    'the totals and the overview’s upcoming list update straight away.</p></section>' +
    '<div class="kpi-grid">' +
    kpiCard("Paid", formatRupiah(paidTotal), paid.length + " bills settled", "good") +
    kpiCard("Still to pay", formatRupiah(pendingTotal), pending.length + " bills outstanding", pending.length ? "warn" : "good") +
    kpiCard("Monthly fixed costs", formatRupiah(paidTotal + pendingTotal), "Rent, school, utilities &amp; streaming", "") +
    '</div>' +
    '<div class="card"><h2>All bills</h2><ul class="bill-list big">' + state.bills.map(function (b, i) {
      return '<li><div><b>' + escapeHtml(b.name) + '</b><span>' + escapeHtml(b.detail) + '</span></div>' +
        '<div class="bill-right"><b>' + formatRupiah(b.amount) + '</b><span class="due">due ' + escapeHtml(b.due) + '</span>' +
        (b.paid
          ? '<span class="pill paid">✓ Paid</span> <button class="btn small" data-bill="' + i + '">Mark unpaid</button>'
          : '<span class="pill due-pill">Pending</span> <button class="btn small primary" data-bill="' + i + '">Mark paid</button>') +
        '</div></li>';
    }).join("") + '</ul>' +
    '<p class="note">Tip: December rent, electricity, internet and school fees are already listed so nothing is forgotten at the start of next month.</p></div>';
}

// ---- Savings goals ---------------------------------------------------------
function viewGoals(state) {
  var totalSaved = sumAmounts(DATA.goals.map(function (g) { return { amount: g.saved }; }));
  var totalTarget = sumAmounts(DATA.goals.map(function (g) { return { amount: g.target }; }));
  return '<section class="page-head"><h1>Savings goals</h1>' +
    '<p class="lede">Four goals, one habit: ' + formatRupiah(DATA.totalSavings) + ' set aside every month, split ' +
    formatRupiah(1000000) + ' emergency · ' + formatRupiah(800000) + ' education · ' + formatRupiah(500000) +
    ' holiday · ' + formatRupiah(400000) + ' motorcycle. ' + formatRupiah(totalSaved) + ' saved so far of ' + formatRupiah(totalTarget) + ' in total.</p></section>' +
    '<div class="goal-grid">' + DATA.goals.map(function (g) {
      var pct = Math.round((g.saved / g.target) * 100);
      var left = g.target - g.saved;
      var months = Math.ceil(left / g.monthly);
      return '<article class="card goal-card"><h3>' + escapeHtml(g.name) + '</h3><p class="lede">' + escapeHtml(g.note) + '</p>' +
        '<div class="goal-numbers"><div><span>Saved</span><b>' + formatRupiah(g.saved) + '</b></div>' +
        '<div><span>Target</span><b>' + formatRupiah(g.target) + '</b></div>' +
        '<div><span>Monthly</span><b>' + formatRupiah(g.monthly) + '</b></div></div>' +
        progressBar(pct, "#1d5c3f") +
        '<p class="note"><b>' + pct + '%</b> there — ' + formatRupiah(left) + ' to go, about ' + months + ' more months at the current pace.</p></article>';
    }).join("") + '</div>' +
    '<div class="card"><h2>The rule the family follows</h2><p class="lede">Pay yourself first: the ' + formatRupiah(DATA.totalSavings) +
    ' moves to savings on the 2nd of the month, before any fun spending. What is left in the current account is what the family can spend — ' +
    'never the other way round.</p></div>';
}

// ---- Reports ---------------------------------------------------------------
function viewReports(state) {
  var m = DATA.history[state.reportMonth];
  var saved = m.income - m.spending;
  var rate = Math.round((saved / m.income) * 100);
  var options = DATA.history.map(function (h, i) {
    return '<option value="' + i + '"' + (i === state.reportMonth ? " selected" : "") + '>' + h.month + '</option>';
  }).join("");
  var trendRows = DATA.categories.map(function (c) {
    var actual = categorySpent(state.transactions, c.key);
    var share = Math.round((actual / DATA.totalSpending) * 100);
    return '<tr><td><span class="swatch" style="background:' + c.color + '"></span> ' + c.name + '</td>' +
      '<td class="num">' + formatRupiah(c.planned) + '</td><td class="num">' + formatRupiah(actual) + '</td>' +
      '<td class="num">' + share + '%</td><td class="num ' + (actual <= c.planned ? "in" : "out") + '">' + (actual <= c.planned ? "Under plan ✓" : "Over plan") + '</td></tr>';
  }).join("");
  return '<section class="page-head"><h1>Reports — June to November 2026</h1>' +
    '<p class="lede">Six months of the household’s money, side by side. Pick a month to see its figures; ' +
    'the charts always show the full half-year so the trend stays visible.</p></section>' +
    '<div class="card"><label class="month-pick">Month <select id="report-month">' + options + '</select></label>' +
    '<div class="kpi-grid">' +
    kpiCard("Income — " + m.month, formatRupiah(m.income), "Household income that month", "") +
    kpiCard("Spending — " + m.month, formatRupiah(m.spending), "Everything the household spent", "") +
    kpiCard("Saved — " + m.month, formatRupiah(saved), "Savings rate " + rate + "% of income", rate >= 20 ? "good" : "warn") +
    '</div></div>' +
    '<div class="two-col"><div class="card"><h2>Income vs spending</h2>' + incomeSpendingBars(DATA.history) +
    '<p class="note">Spending has stayed under income every month since June — the household has saved every single month.</p></div>' +
    '<div class="card"><h2>Savings rate trend</h2>' + savingsRateLine(DATA.history) +
    '<p class="note">The savings rate climbed from 18% in June to 22% in November as food spending came under control.</p></div></div>' +
    '<div class="card"><h2>Category trend — November 2026 vs plan</h2>' +
    '<div class="table-scroll"><table class="ledger"><thead><tr><th>Category</th><th class="num">Planned</th><th class="num">Spent</th><th class="num">Share</th><th class="num">Verdict</th></tr></thead>' +
    '<tbody>' + trendRows + '</tbody></table></div>' +
    '<p class="note">Food came in ' + formatRupiah(150000) + ' under plan; entertainment hit its plan exactly. Nothing went over budget in November.</p></div>' +
    '<div class="card"><h2>The 50/30/20 rule, against this household</h2>' +
    DATA.rule503020.map(function (r) {
      return '<div class="rule-row"><div><b>' + r.label + '</b><p class="lede">' + r.note + '</p></div>' +
        '<div class="rule-bars">' + budgetBars(Math.round(DATA.totalIncome * r.targetPct / 100), r.actual) +
        '<p class="note">Guide ' + r.targetPct + '% · actual ' + r.actualPct + '% (' + formatRupiah(r.actual) + ')</p></div></div>';
    }).join("") +
    '<p class="note">The rule is a guide, not a law: with rent and school fees fixed, this family’s needs run at 74%. ' +
    'What matters is that savings still clear 20% — and they do, at 22%.</p></div>';
}

// ---- Router ----------------------------------------------------------------
var ROUTES = [
  { path: "overview", label: "Overview", view: viewOverview },
  { path: "planner", label: "Budget planner", view: viewPlanner },
  { path: "transactions", label: "Transactions", view: viewTransactions },
  { path: "bills", label: "Bills & subscriptions", view: viewBills },
  { path: "goals", label: "Savings goals", view: viewGoals },
  { path: "reports", label: "Reports", view: viewReports },
];

function navHtml(active) {
  return ROUTES.map(function (r) {
    return '<a href="#/' + r.path + '"' + (r.path === active ? ' class="active" aria-current="page"' : "") + '>' + r.label + '</a>';
  }).join("");
}

function routeFromHash(hash) {
  var path = (hash || "#/overview").replace(/^#\/?/, "").split("?")[0].split("/")[0];
  var found = ROUTES.filter(function (r) { return r.path === path; })[0];
  return found || ROUTES[0];
}
