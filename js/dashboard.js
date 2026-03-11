// Public dashboard + member preview + progress + mini chart
/* global FM, FMAnim, FMMembersUI, FMExpensesUI */

(function () {
  const TOTAL_MEMBERS_FOR_PROGRESS = 97;

  function safeEl(id) {
    return document.getElementById(id);
  }

  function sum(nums) {
    return nums.reduce((a, b) => a + (Number(b) || 0), 0);
  }

  function computeTotals(members, expenses) {
    const paidMembers = members.filter((m) => m.status === "YES").length;
    const pendingMembers = members.filter((m) => m.status === "NO").length;

    const totalCollected = sum(members.map((m) => m.amount)); // per spec
    const totalExpenses = sum(expenses.map((e) => e.amount));
    const balance = totalCollected - totalExpenses;

    return { paidMembers, pendingMembers, totalCollected, totalExpenses, balance };
  }

  function updateMiniChart(paid) {
    if (!window.Chart) return;
    const canvas = document.getElementById("miniChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const pending = Math.max(0, TOTAL_MEMBERS_FOR_PROGRESS - paid);

    if (!window.__miniChart) {
      window.__miniChart = new window.Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Paid", "Pending"],
          datasets: [{
            data: [paid, pending],
            backgroundColor: ["rgba(250,204,21,.95)", "rgba(255,255,255,.14)"],
            borderWidth: 0,
          }],
        },
        options: { responsive: true, plugins: { legend: { display: false } }, cutout: "70%" },
      });
    } else {
      window.__miniChart.data.datasets[0].data = [paid, pending];
      window.__miniChart.update();
    }
  }

  function showSkeletons(show) {
    document.querySelectorAll("[data-skeleton]").forEach((el) => {
      el.style.display = show ? "block" : "none";
    });
  }

  // Some pages accidentally contain duplicate IDs for these stats.
  // Use querySelectorAll so both the progress section and Quick Stats panel stay in sync.
  function updateQuickStats(members) {
    const paid = members.filter((m) => m.status === "YES").length;
    const pending = members.filter((m) => m.status === "NO").length;

    document.querySelectorAll("#paidMembers").forEach((el) => (el.textContent = String(paid)));
    document.querySelectorAll("#pendingMembers").forEach((el) => (el.textContent = String(pending)));
  }

  async function boot() {
    showSkeletons(true);

    await FM.ensureInitialized();

    let members = [];
    let expenses = [];
    let settings = { collectionAmount: 0 };
    let lastPaid = 0;

    function redraw() {
      const totals = computeTotals(members, expenses);

      const odo = safeEl("balanceOdometer");
      const balText = safeEl("balanceText");
      if (odo) odo.innerHTML = String(Math.round(totals.balance));
      if (balText) balText.textContent = FMMembersUI.formatINR(totals.balance);

      // Cards
      const map = {
        totalMembers: members.length,
        paidMembers: totals.paidMembers,
        pendingMembers: totals.pendingMembers,
        collectionAmount: settings.collectionAmount ?? 0,
        totalCollected: totals.totalCollected,
        totalExpenses: totals.totalExpenses,
      };

      Object.entries(map).forEach(([id, val]) => {
        const el = safeEl(id);
        if (!el) return;
        if (["collectionAmount", "totalCollected", "totalExpenses"].includes(id)) {
          el.textContent = String(Number(val || 0));
        } else {
          el.textContent = String(val);
        }
      });

      // Progress
      const percent = (totals.paidMembers / TOTAL_MEMBERS_FOR_PROGRESS) * 100;
      FMAnim.setProgressFill(percent);

      updateMiniChart(totals.paidMembers);

      // Preview tables
      const memberTbody = document.querySelector("#memberTbody");
      if (memberTbody) {
        FMMembersUI.renderPublicMemberTable(memberTbody, members.slice(0, 12), settings.collectionAmount);
      }

      const expenseTbody = document.querySelector("#expenseTbody");
      if (expenseTbody) {
        FMExpensesUI.renderExpensesTable(expenseTbody, expenses.slice(0, 6));
      }

      showSkeletons(false);
    }

    const unsubMembers = FM.listenMembers((rows) => {
      const paid = rows.filter((m) => m.status === "YES").length;
      if (paid > lastPaid) FMAnim.dropCoin();
      lastPaid = paid;

      members = rows;
      updateQuickStats(members);
      redraw();
    });

    const unsubExpenses = FM.listenExpenses((rows) => {
      expenses = rows;
      redraw();
    });

    const unsubSettings = FM.listenSettings((s) => {
      settings = s;
      redraw();
    });

    window.addEventListener("beforeunload", () => {
      unsubMembers && unsubMembers();
      unsubExpenses && unsubExpenses();
      unsubSettings && unsubSettings();
    });
  }

  boot().catch((err) => {
    console.error(err);
    const el = document.querySelector("#fatalError");
    if (el) el.textContent = err?.message || String(err);
    showSkeletons(false);
  });
})();
