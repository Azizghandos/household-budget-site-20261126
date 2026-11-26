// RumahBudget — hand-drawn inline SVG charts, built from data.js.
// No chart library and no network: every chart is plain SVG that this file
// generates from the numbers it is given.

function svgOpen(width, height, label) {
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" role="img" aria-label="' + label + '">';
}

// Donut chart of spending by category. slices: [{name, value, color}].
function donutChart(slices, size) {
  var total = slices.reduce(function (sum, s) { return sum + s.value; }, 0);
  var cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r - 34;
  var start = -Math.PI / 2, parts = [];
  slices.forEach(function (s) {
    var frac = s.value / total;
    var end = start + frac * Math.PI * 2;
    var large = frac > 0.5 ? 1 : 0;
    var x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    var x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    var xi1 = cx + inner * Math.cos(end), yi1 = cy + inner * Math.sin(end);
    var xi2 = cx + inner * Math.cos(start), yi2 = cy + inner * Math.sin(start);
    parts.push('<path d="M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
      ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) +
      ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi2.toFixed(1) + ' ' + yi2.toFixed(1) +
      ' Z" fill="' + s.color + '"><title>' + s.name + ': ' + formatRupiah(s.value) + '</title></path>');
    start = end;
  });
  var legend = slices.map(function (s) {
    var pct = Math.round((s.value / total) * 100);
    return '<div class="legend-row"><span class="swatch" style="background:' + s.color + '"></span>' +
      '<span class="legend-name">' + s.name + '</span>' +
      '<span class="legend-value">' + formatRupiah(s.value) + ' · ' + pct + '%</span></div>';
  }).join("");
  return '<div class="donut-wrap">' + svgOpen(size, size, "Spending by category, November 2026") +
    parts.join("") +
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" class="donut-centre-big">' + formatShort(total) + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" class="donut-centre-small">spent in Nov</text>' +
    '</svg><div class="legend">' + legend + '</div></div>';
}

// Grouped bar chart: income vs spending per month.
// months: [{month, income, spending}]
function incomeSpendingBars(months) {
  var w = 640, h = 300, padL = 64, padB = 34, padT = 18;
  var max = 0;
  months.forEach(function (m) { max = Math.max(max, m.income, m.spending); });
  max = Math.ceil(max / 2000000) * 2000000;
  var plotW = w - padL - 16, plotH = h - padT - padB;
  var slot = plotW / months.length, barW = 26;
  var y = function (v) { return padT + plotH - (v / max) * plotH; };
  var grid = "";
  for (var g = 0; g <= 4; g++) {
    var gv = (max / 4) * g, gy = y(gv);
    grid += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - 16) + '" y2="' + gy + '" class="grid-line"/>' +
      '<text x="' + (padL - 8) + '" y="' + (gy + 4) + '" text-anchor="end" class="axis-label">' + formatShort(gv) + '</text>';
  }
  var bars = "";
  months.forEach(function (m, i) {
    var x = padL + i * slot + slot / 2;
    bars += '<rect x="' + (x - barW - 4) + '" y="' + y(m.income) + '" width="' + barW + '" height="' + (y(0) - y(m.income)) + '" rx="3" fill="#1d5c3f"><title>' + m.month + ' income: ' + formatRupiah(m.income) + '</title></rect>' +
      '<rect x="' + (x + 4) + '" y="' + y(m.spending) + '" width="' + barW + '" height="' + (y(0) - y(m.spending)) + '" rx="3" fill="#d97706"><title>' + m.month + ' spending: ' + formatRupiah(m.spending) + '</title></rect>' +
      '<text x="' + x + '" y="' + (h - 12) + '" text-anchor="middle" class="axis-label">' + m.month + '</text>';
  });
  return svgOpen(w, h, "Income versus spending, June to November 2026") + grid + bars +
    '<text x="' + (padL + 4) + '" y="14" class="chart-key"><tspan fill="#1d5c3f">■</tspan> Income &nbsp; <tspan fill="#d97706">■</tspan> Spending</text>' +
    '</svg>';
}

// Line chart of the monthly savings rate (saved ÷ income), Jun–Nov 2026.
function savingsRateLine(months) {
  var w = 640, h = 240, padL = 48, padB = 34, padT = 22;
  var rates = months.map(function (m) { return (m.income - m.spending) / m.income; });
  var max = 0.3;
  var plotW = w - padL - 16, plotH = h - padT - padB;
  var x = function (i) { return padL + (i / (months.length - 1)) * plotW; };
  var y = function (r) { return padT + plotH - (r / max) * plotH; };
  var grid = "";
  [0, 0.1, 0.2, 0.3].forEach(function (gv) {
    grid += '<line x1="' + padL + '" y1="' + y(gv) + '" x2="' + (w - 16) + '" y2="' + y(gv) + '" class="grid-line"/>' +
      '<text x="' + (padL - 8) + '" y="' + (y(gv) + 4) + '" text-anchor="end" class="axis-label">' + Math.round(gv * 100) + '%</text>';
  });
  var points = rates.map(function (r, i) { return x(i).toFixed(1) + "," + y(r).toFixed(1); }).join(" ");
  var dots = rates.map(function (r, i) {
    return '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(r).toFixed(1) + '" r="5" fill="#1d5c3f" stroke="#fff" stroke-width="2"><title>' +
      months[i].month + ': saved ' + Math.round(r * 100) + '% of income</title></circle>' +
      '<text x="' + x(i).toFixed(1) + '" y="' + (y(r) - 10).toFixed(1) + '" text-anchor="middle" class="axis-label strong">' + Math.round(r * 100) + '%</text>';
  }).join("");
  var labels = months.map(function (m, i) {
    return '<text x="' + x(i).toFixed(1) + '" y="' + (h - 12) + '" text-anchor="middle" class="axis-label">' + m.month + '</text>';
  }).join("");
  return svgOpen(w, h, "Savings rate by month, June to November 2026") + grid +
    '<polyline points="' + points + '" fill="none" stroke="#1d5c3f" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
    dots + labels + '</svg>';
}

// A single horizontal progress bar (0–100%).
function progressBar(pct, color) {
  var safe = Math.max(0, Math.min(100, pct));
  return '<div class="progress-track"><div class="progress-fill" style="width:' + safe + '%;background:' + (color || "#1d5c3f") + '"></div></div>';
}

// Planned-vs-actual bar for one budget category (planner page).
function budgetBars(planned, actual) {
  var max = Math.max(planned, actual, 1);
  var plannedPct = Math.round((planned / max) * 100);
  var actualPct = Math.round((actual / max) * 100);
  var over = actual > planned;
  return '<div class="budget-bars">' +
    '<div class="budget-bar-row"><span>Planned</span><div class="progress-track slim"><div class="progress-fill" style="width:' + plannedPct + '%;background:#94a3b8"></div></div><b>' + formatRupiah(planned) + '</b></div>' +
    '<div class="budget-bar-row"><span>Spent</span><div class="progress-track slim"><div class="progress-fill" style="width:' + actualPct + '%;background:' + (over ? "#b91c1c" : "#1d5c3f") + '"></div></div><b>' + formatRupiah(actual) + '</b></div>' +
    '</div>';
}
