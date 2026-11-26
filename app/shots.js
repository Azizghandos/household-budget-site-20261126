// RumahBudget — deterministic screenshot scenes. Each shot is one exact view
// of the real site, reached by driving the site's own code: ?shot=<name>
// (overview | planner | transactions | phone) plus &seed=<n> for the record.
// The scene resets state to the seed figures, navigates to the page and
// renders it, so the same URL always produces the same screenshot.
(function () {
  var params = new URLSearchParams(window.location.search);
  var shot = params.get("shot");
  if (!shot) return;
  function show() {
    if (typeof applyShot === "function") applyShot(shot);
    document.documentElement.setAttribute("data-shot", shot);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", show);
  } else {
    show();
  }
})();
