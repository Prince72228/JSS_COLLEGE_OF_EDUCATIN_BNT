// Public expense page controller
/* global FM, FMExpensesUI */

(function () {
  async function boot() {
    await FM.ensureInitialized();

    let expenses = [];

    const tbody = document.querySelector("#expenseTbody");
    const totalEl = document.querySelector("#totalExpenses");

    const unsub = FM.listenExpenses((rows) => {
      expenses = rows;
      FMExpensesUI.renderExpensesTable(tbody, expenses);
      const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
      if (totalEl) totalEl.textContent = FMExpensesUI.formatINR(total);
    });

    document.querySelector("#downloadPdf")?.addEventListener("click", () => {
      FMExpensesUI.exportExpensesPDF(expenses);
    });

    window.addEventListener("beforeunload", () => unsub && unsub());
  }

  boot().catch((err) => {
    console.error(err);
    const el = document.querySelector("#fatalError");
    if (el) el.textContent = err?.message || String(err);
  });
})();
