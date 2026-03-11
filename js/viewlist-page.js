// Member list page controller (search + filter + realtime)
/* global FM, FMMembersUI */

(function () {
  async function boot() {
    await FM.ensureInitialized();

    const tbody = document.querySelector("#memberTbody");
    const search = document.querySelector("#memberSearch");
    const filter = document.querySelector("#memberFilter");

    let members = [];
    let settings = { collectionAmount: 0 };

    function redraw() {
      const filtered = FMMembersUI.applyMemberFilters(members, {
        query: search?.value,
        filter: filter?.value,
      });
      FMMembersUI.renderPublicMemberTable(tbody, filtered, settings.collectionAmount);
      const countEl = document.querySelector("#memberCount");
      if (countEl) countEl.textContent = String(filtered.length);
    }

    const showErr = (err) => {
      const el = document.querySelector("#fatalError");
      const msg = err?.message || String(err);
      if (el) el.textContent = msg;
    };

    if (window.FM_INIT_ERROR) showErr(window.FM_INIT_ERROR);

    const unsubMembers = FM.listenMembers(
      (rows) => {
        members = rows;
        redraw();
      },
      showErr
    );

    const unsubSettings = FM.listenSettings(
      (s) => {
        settings = s;
        redraw();
      },
      showErr
    );

    search?.addEventListener("input", redraw);
    filter?.addEventListener("change", redraw);

    window.addEventListener("beforeunload", () => {
      unsubMembers && unsubMembers();
      unsubSettings && unsubSettings();
    });
  }

  boot().catch((err) => {
    console.error(err);
    const el = document.querySelector("#fatalError");
    if (el) el.textContent = err?.message || String(err);
  });
})();
