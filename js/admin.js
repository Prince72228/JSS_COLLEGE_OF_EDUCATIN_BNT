// Admin dashboard controller
/* global FM, FMAuth, FMMembersUI, FMExpensesUI, FMCharts */

(function () {
  function toast(msg, type = "info") {
    const host = document.getElementById("toastHost");
    if (!host) return;
    const el = document.createElement("div");
    el.className = `glass border border-white/10 rounded-2xl px-4 py-3 text-sm ${type === "error" ? "text-red-200" : "text-white"}`;
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function sum(nums) {
    return nums.reduce((a, b) => a + (Number(b) || 0), 0);
  }

  function computeTotals(members, expenses) {
    const paid = members.filter((m) => m.status === "YES").length;
    const pending = Math.max(0, members.length - paid);
    const collected = sum(members.map((m) => m.amount));
    const exp = sum(expenses.map((e) => e.amount));
    const balance = collected - exp;
    return { paid, pending, collected, exp, balance };
  }

  function renderMemberAdminTable(members, collectionAmount) {
    const tbody = document.querySelector("#adminMemberTbody");
    if (!tbody) return;

    tbody.innerHTML = members
      .map((m) => {
        const isPaid = m.status === "YES";
        const amount = isPaid ? Number(collectionAmount) || 0 : 0;
        return `
          <tr>
            <td class="font-medium">${m.id}</td>
            <td>
              <input class="input" data-member-field="name" data-id="${m.docId}" value="${String(m.name || "").replaceAll('"', '&quot;')}" />
            </td>
            <td class="mono">${FMExpensesUI.formatINR(amount)}</td>
            <td>
              <button class="btn ${isPaid ? "gold" : "primary"}" data-action="toggle" data-id="${m.docId}">
                ${isPaid ? "Mark NO" : "Mark YES"}
              </button>
            </td>
            <td>
              <button class="btn ghost" data-action="delete" data-id="${m.docId}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function renderExpensesAdminTable(expenses) {
    const tbody = document.querySelector("#adminExpenseTbody");
    if (!tbody) return;

    tbody.innerHTML = expenses
      .map((e) => {
        return `
          <tr>
            <td>
              <input class="input" value="${String(e.reason ?? "").replaceAll('"', '&quot;')}" data-expense-field="reason" data-id="${e.docId}" />
            </td>
            <td style="width:220px">
              <input class="input mono" value="${Number(e.amount) || 0}" data-expense-field="amount" data-id="${e.docId}" />
            </td>
            <td style="width:160px" class="mono">${FMExpensesUI.formatDate(e.timestamp)}</td>
            <td style="width:140px">
              <button class="btn ghost" data-action="exp-delete" data-id="${e.docId}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  async function boot() {
    FMAuth.requireAdmin();
    await FM.ensureInitialized();

    let members = [];
    let expenses = [];
    let settings = { collectionAmount: 0 };

    const amountInput = document.querySelector("#collectionAmountInput");
    const amountBtn = document.querySelector("#collectionAmountBtn");

    amountBtn?.addEventListener("click", async () => {
      try {
        await FM.setCollectionAmount(amountInput?.value);
        toast("Collection amount updated (synced realtime)");
      } catch (e) {
        toast(e?.message || "Failed to update amount", "error");
      }
    });

    document.querySelector("#logoutBtn")?.addEventListener("click", () => {
      FMAuth.logout();
      window.location.href = "index.html";
    });

    document.querySelector("#eraseBtn")?.addEventListener("click", async () => {
      const ok = confirm(
        "Erase data? This will reset ALL members to NO/0 and delete ALL expenses."
      );
      if (!ok) return;
      try {
        await FM.eraseAllData();
        toast("Data reset completed");
      } catch (e) {
        toast(e?.message || "Reset failed", "error");
      }
    });

    document.querySelector("#addMemberForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.querySelector("#newMemberName")?.value;
      try {
        await FM.addMember(name);
        document.querySelector("#newMemberName").value = "";
        toast("Member added");
      } catch (err) {
        toast(err?.message || "Failed to add member", "error");
      }
    });

    document.querySelector("#addExpenseForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const reason = document.querySelector("#newExpenseReason")?.value;
      const amount = document.querySelector("#newExpenseAmount")?.value;
      try {
        await FM.addExpense(reason, amount);
        document.querySelector("#newExpenseReason").value = "";
        document.querySelector("#newExpenseAmount").value = "";
        toast("Expense added");
      } catch (err) {
        toast(err?.message || "Failed to add expense", "error");
      }
    });

    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      try {
        if (action === "toggle") {
          const member = members.find((m) => m.docId === id);
          if (!member) return;
          const makePaid = member.status !== "YES";
          await FM.toggleMemberPaid(id, makePaid, settings?.collectionAmount ?? 0);
          toast(makePaid ? "Marked as PAID" : "Marked as NOT PAID");
        }

        if (action === "delete") {
          const ok = confirm("Delete this member?");
          if (!ok) return;
          await FM.deleteMember(id);
          toast("Member deleted");
        }

        if (action === "exp-delete") {
          const ok = confirm("Delete this expense?");
          if (!ok) return;
          await FM.deleteExpense(id);
          toast("Expense deleted");
        }
      } catch (err) {
        toast(err?.message || "Action failed", "error");
      }
    });

    // Inline edit saves on blur
    document.addEventListener(
      "blur",
      async (e) => {
        const expenseInput = e.target.closest("input[data-expense-field]");
        const memberInput = e.target.closest("input[data-member-field]");

        try {
          if (expenseInput) {
            const id = expenseInput.dataset.id;
            const field = expenseInput.dataset.expenseField;
            const value = expenseInput.value;

            if (field === "reason") await FM.updateExpense(id, { reason: String(value || "").trim() });
            if (field === "amount") {
              const num = Number(value);
              if (!Number.isFinite(num) || num < 0) return;
              await FM.updateExpense(id, { amount: num });
            }
            toast("Expense updated");
          }

          if (memberInput) {
            const id = memberInput.dataset.id;
            const value = memberInput.value;
            await FM.updateMemberName(id, value);
            toast("Member updated");
          }
        } catch (err) {
          toast(err?.message || "Update failed", "error");
        }
      },
      true
    );

    function updateAdminStatsUI() {
      const t = computeTotals(members, expenses);
      document.querySelector("#totalMembersAdmin").textContent = String(members.length);
      document.querySelector("#paidMembersAdmin").textContent = String(t.paid);
      document.querySelector("#pendingMembersAdmin").textContent = String(t.pending);
      document.querySelector("#totalCollectedAdmin").textContent = FMExpensesUI.formatINR(t.collected);
      document.querySelector("#totalExpensesAdmin").textContent = FMExpensesUI.formatINR(t.exp);
      document.querySelector("#balanceAdmin").textContent = FMExpensesUI.formatINR(t.balance);

      FMCharts.upsertAdminCharts({
        paid: t.paid,
        pending: t.pending,
        collected: t.collected,
        expenses: t.exp,
      });
    }

    const unsubMembers = FM.listenMembers((rows) => {
      members = rows;
      renderMemberAdminTable(members, settings.collectionAmount);
      updateAdminStatsUI();
    });

    const unsubExpenses = FM.listenExpenses((rows) => {
      expenses = rows;
      renderExpensesAdminTable(expenses);
      updateAdminStatsUI();
    });

    const unsubSettings = FM.listenSettings((s) => {
      settings = s;
      if (amountInput) amountInput.value = String(settings.collectionAmount ?? 0);
      renderMemberAdminTable(members, settings.collectionAmount);
      updateAdminStatsUI();
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
  });
})();
