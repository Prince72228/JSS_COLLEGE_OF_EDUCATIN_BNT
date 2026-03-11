// Chart.js helpers
(function () {
  function upsertAdminCharts({ paid, pending, collected, expenses }) {
    if (!window.Chart) return;

    // Paid vs Pending
    const el1 = document.getElementById("chartPaidPending");
    if (el1) {
      const ctx1 = el1.getContext("2d");
      if (!window.__chartPaidPending) {
        window.__chartPaidPending = new window.Chart(ctx1, {
          type: "doughnut",
          data: {
            labels: ["Paid", "Pending"],
            datasets: [
              {
                data: [paid, pending],
                backgroundColor: ["rgba(250,204,21,.95)", "rgba(255,255,255,.14)"],
                borderWidth: 0,
              },
            ],
          },
          options: { plugins: { legend: { display: true, labels: { color: "#fff" } } }, cutout: "70%" },
        });
      } else {
        window.__chartPaidPending.data.datasets[0].data = [paid, pending];
        window.__chartPaidPending.update();
      }
    }

    // Collection vs Expenses
    const el2 = document.getElementById("chartCollectionExpenses");
    if (el2) {
      const ctx2 = el2.getContext("2d");
      if (!window.__chartCollectionExpenses) {
        window.__chartCollectionExpenses = new window.Chart(ctx2, {
          type: "bar",
          data: {
            labels: ["Collection", "Expenses"],
            datasets: [
              {
                data: [collected, expenses],
                backgroundColor: ["rgba(79,70,229,.9)", "rgba(239,68,68,.7)"],
                borderRadius: 10,
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: "rgba(255,255,255,.85)" }, grid: { color: "rgba(255,255,255,.08)" } },
              y: { ticks: { color: "rgba(255,255,255,.85)" }, grid: { color: "rgba(255,255,255,.08)" } },
            },
          },
        });
      } else {
        window.__chartCollectionExpenses.data.datasets[0].data = [collected, expenses];
        window.__chartCollectionExpenses.update();
      }
    }
  }

  window.FMCharts = { upsertAdminCharts };
})();
