// RumahBudget — boot and controls. State lives in memory, seeded from
// data.js; there is no localStorage, so every load starts from the same
// figures and screenshots stay reproducible.

// Fresh, mutable copy of the seed data for this session.
function freshState() {
  return {
    transactions: DATA.transactions.map(function (t) { return Object.assign({}, t); }),
    budgets: DATA.categories.reduce(function (acc, c) { acc[c.key] = c.planned; return acc; }, {}),
    bills: DATA.bills.map(function (b) { return Object.assign({}, b); }),
    search: "",
    filter: "",
    sortKey: "date",
    sortDir: "desc",
    reportMonth: 5,
  };
}

var state = freshState();

function currentRoute() {
  return routeFromHash(window.location.hash);
}

function render() {
  var route = currentRoute();
  var nav = document.getElementById("main-nav");
  if (nav) nav.innerHTML = navHtml(route.path);
  var app = document.getElementById("app");
  if (app) app.innerHTML = route.view(state);
  var title = document.getElementById("page-title");
  if (title) title.textContent = "RumahBudget — " + route.label;
  // Every render replaces the page's DOM, so the controls are wired here,
  // every time, including after a search keystroke re-renders the ledger.
  bindControls();
}

function renderKeepFocus() {
  var active = document.activeElement;
  var id = active && active.id ? active.id : null;
  var value = active && "value" in active ? active.value : null;
  var selStart = active && typeof active.selectionStart === "number" ? active.selectionStart : null;
  render();
  if (id) {
    var el = document.getElementById(id);
    if (el) {
      el.focus();
      if (value !== null && "value" in el) el.value = value;
      if (selStart !== null && typeof el.setSelectionRange === "function") {
        try { el.setSelectionRange(selStart, selStart); } catch (e) { /* not a text field */ }
      }
    }
  }
}

function bindControls() {
  var app = document.getElementById("app");
  if (!app) return;

  // Transaction search (live, keeps the caret where it was).
  var search = document.getElementById("tx-search");
  if (search) {
    search.addEventListener("input", function () {
      state.search = search.value;
      renderKeepFocus();
    });
  }

  // Category filter.
  var filter = document.getElementById("tx-filter");
  if (filter) {
    filter.addEventListener("change", function () {
      state.filter = filter.value;
      render();
    });
  }

  // Column sort buttons.
  app.querySelectorAll("[data-sort]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-sort");
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = key;
        state.sortDir = key === "amount" ? "desc" : "asc";
      }
      render();
    });
  });

  // Add a transaction: appends a live row and updates every total.
  var form = document.getElementById("tx-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var category = String(data.get("category") || "food");
      var type = category === "income" ? "income" : category === "savings" ? "savings" : "expense";
      state.transactions.push({
        date: String(data.get("date") || "2026-11-27"),
        description: String(data.get("description") || "New transaction").trim() || "New transaction",
        category: category,
        type: type,
        amount: Math.max(0, Math.round(Number(data.get("amount")) || 0)),
      });
      var note = document.getElementById("tx-added");
      render();
      var after = document.getElementById("tx-added");
      if (after) after.textContent = "Added — the ledger and all totals now include it.";
    });
  }

  // Editable budget amounts on the planner page.
  app.querySelectorAll("[data-budget]").forEach(function (input) {
    input.addEventListener("change", function () {
      var key = input.getAttribute("data-budget");
      var value = Math.max(0, Math.round(Number(input.value) || 0));
      state.budgets[key] = value;
      render();
    });
  });

  // Mark a bill paid / unpaid.
  app.querySelectorAll("[data-bill]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var index = Number(btn.getAttribute("data-bill"));
      if (state.bills[index]) {
        state.bills[index].paid = !state.bills[index].paid;
        render();
      }
    });
  });

  // Month selector on the reports page.
  var month = document.getElementById("report-month");
  if (month) {
    month.addEventListener("change", function () {
      state.reportMonth = Number(month.value);
      render();
    });
  }
}

// Re-render after every navigation (render also re-wires the controls).
window.addEventListener("hashchange", function () { render(); });

document.addEventListener("DOMContentLoaded", function () {
  render();
});

// Screenshot scenes (shots.js) call this to put the site in a known state.
function applyShot(name) {
  var routes = { overview: "#/overview", planner: "#/planner", transactions: "#/transactions", phone: "#/overview" };
  state = freshState();
  if (routes[name]) window.location.hash = routes[name];
  render();
}
