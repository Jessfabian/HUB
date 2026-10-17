/*
 * Wireframe shell: injects the review toolbar and the app chrome around <main>.
 * Decisions so far: left sidebar (collapsible), profile/settings menu top-right,
 * case timer in the top bar. Pages declare <body data-page="...">.
 */
(function () {
  "use strict";

  const PAGES = [
    { id: "home", label: "Home", href: "home.html", group: "Work", icon: "home" },
    { id: "workstation", label: "MMSD case workstation", group: "Work", icon: "workstation" },
    { id: "workbench", label: "IR workbench", href: "ir-workbench.html", group: "Work", optionOnly: "side", icon: "workstation" },
    { id: "queue", label: "My cases", href: "case-queue.html", group: "Work", icon: "queue" },
    { id: "wins", label: "My wins", href: "my-wins.html", group: "Work", icon: "trophy" },
    { id: "tools", label: "Tools hub", href: "tools-hub.html", group: "Tools", icon: "tools" },
    { id: "verbiage", label: "Requirement verbiage", href: "tool-verbiage.html", group: "Tools", icon: "verbiage" },
    { id: "amend", label: "Amendment builder", href: "tool-amendment.html", group: "Tools", icon: "amend" },
    { id: "email", label: "Email builder", href: "tool-email.html", group: "Tools", icon: "email" },
    { id: "illus", label: "Illustration validator", href: "tool-illustration.html", group: "Tools", icon: "illus" },
    { id: "saveage", label: "Save Age", href: "tool-save-age.html", group: "Tools", icon: "saveage" },
    { id: "stateforms", label: "State forms", href: "tool-state-forms.html", group: "Tools", icon: "stateforms" },
    { id: "reissue", label: "Reissue / change after approval", href: "tool-reissue.html", group: "Tools", icon: "reissue" },
    { id: "forms", label: "Forms library", href: "ref-forms-library.html", group: "Reference", icon: "forms" },
    { id: "uw", label: "Underwriting", href: "ref-underwriting.html", group: "Reference", icon: "uw" },
    { id: "firms", label: "Firm directory", href: "ref-firm-directory.html", group: "Reference", icon: "handshake" },
    { id: "mgmt", label: "Team insights", href: "mgmt-insights.html", group: "Management", icon: "metrics" },
    { id: "users", label: "User accounts", href: "admin-users.html", group: "Management", icon: "team" },
    { id: "admin", label: "Admin console", href: "admin-console.html", group: "Management", icon: "settings", adminOnly: true },
  ];

  const store = {
    get(k, d) { try { return localStorage.getItem("wf-" + k) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("wf-" + k, v); } catch (e) { /* file:// in some browsers */ } },
  };

  const body = document.body;
  const current = body.dataset.page;
  // Each workstation page is pinned to its own option so a direct link always shows what it says.
  const merge = body.dataset.option || store.get("merge", "merge");
  if (store.get("extras", "hide") === "hide") body.classList.add("hide-notes");
  if (store.get("condhl", "hide") === "hide") body.classList.add("plain-cond");
  if (store.get("collapsed", "no") === "yes") body.classList.add("nav-collapsed");
  if (store.get("role", "cm") === "mgr") body.classList.add("is-manager");

  const visible = (p) => !p.optionOnly || p.optionOnly === merge;
  const href = (p) => (p.id === "workstation" ? (merge === "merge" ? "workstation-merge.html" : "workstation-side.html") : p.href);
  const ico = (name) => `<img class="ico" src="icons/${name}.png" alt="" />`;

  // Sidebar is personal: pin pages to "My shortcuts" and hide the ones you never use.
  const list = (k) => store.get(k, "").split(",").filter(Boolean);
  const pinned = list("navpin");
  const hiddenNav = new Set(list("navhide"));
  const navLink = (p, inMine) => `<a href="${href(p)}" class="${p.id === current ? "on" : ""} ${p.adminOnly ? "admin-only" : ""} ${!inMine && hiddenNav.has(p.id) ? "nav-hidden" : ""}" title="${p.label}">${ico(p.icon)}<span>${p.label}</span>`
    + `<i class="ned ${pinned.includes(p.id) ? "on" : ""}" data-pin="${p.id}" title="Pin to My shortcuts">★</i>`
    + (inMine ? "" : `<i class="ned" data-hide="${p.id}" title="${hiddenNav.has(p.id) ? "Show" : "Hide"}">${hiddenNav.has(p.id) ? "+" : "✕"}</i>`) + `</a>`;
  const mine = pinned.map((id) => PAGES.find((p) => p.id === id)).filter((p) => p && visible(p) && p.id !== "home");
  const homeP = PAGES.find((p) => p.id === "home");
  const groups = `<div class="grp grp-home"><h6>Work</h6><a href="home.html" class="${current === "home" ? "on" : ""}" title="Home">${ico("home")}<span>Home</span><i class="lock" title="Home always stays first">🔒</i></a></div>`
    + (mine.length ? `<div class="grp grp-mine"><h6 tabindex="0">★ My shortcuts</h6><div class="dd">${mine.map((p) => navLink(p, true)).join("")}</div></div>` : "")
    + ["Work", "Tools", "Reference", "Management"].map((g) => {
      const links = PAGES.filter((p) => p.group === g && visible(p) && p !== homeP).map((p) => navLink(p, false)).join("");
      return `<div class="grp grp-${g.toLowerCase()}">${g === "Work" ? "" : `<h6 tabindex="0">${g}${g === "Management" ? " 🔒" : ""}</h6>`}<div class="dd">${links}</div></div>`;
    }).join("");

  const seg = (key, opts, val) => `<span class="seg" data-key="${key}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === val}">${l}</button>`).join("")}</span>`;

  const review = document.createElement("div");
  review.className = "wf-review";
  review.innerHTML = `
    <strong>WIREFRAME REVIEW</strong>
    <span>Workstation: ${seg("merge", [["merge", "1 · Merged"], ["side", "2 · Side-by-side"]], merge)}</span>
    <span title="Design notes, numbered markers, and wireframe-only placeholders">Notes &amp; extras: ${seg("extras", [["show", "Show"], ["hide", "Hide"]], store.get("extras", "hide"))}</span>
    <span title="Gold-edged steps and fields that only appear for certain case types">Conditional steps: ${seg("condhl", [["show", "Show"], ["hide", "Hide"]], store.get("condhl", "hide"))}</span>
    <span>View as: ${seg("role", [["cm", "CM"], ["mgr", "Manager"]], store.get("role", "cm"))}</span>
    <span class="spacer"></span>
    <a href="login.html">Sign-in page</a> · <a href="index.html">All screens</a>`;

  // Timer is only "running" on case pages; elsewhere it shows the last case.
  const onCase = current === "workstation" || current === "workbench";
  const timer = `
    <span class="timer ${onCase ? "running" : ""}" title="Time on this case (auto-starts when a case is opened)">
      ${ico("timer")}<b>${onCase ? "00:12:47" : "Case A · paused"}</b>
      <button type="button" class="tbtn" data-timer>${onCase ? "❚❚" : "▶"}</button>
    </span>`;

  const main = document.querySelector("main");
  const app = document.createElement("div");
  app.className = "app";
  app.innerHTML = `
    <header class="topbar">
      <button type="button" class="hamb" data-collapse title="Collapse / expand menu">☰</button>
       <a class="logo" href="home.html"><span class="mm"><img src="icons/mmsd-logo.svg" /></span><span <span class="sep"></span>Case Manager Workstation</a>
      <span class="search">⌕ Search tools, steps, forms…</span>
      <span class="util">
        ${timer}
        <span class="streak" title="Days in a row with a completed IR">🔥 4-day streak</span>
        <span class="me" data-menu>
          <img class="avatar" src="icons/profile.png" alt="" />
          <span><b>CM name</b><small>Team 2 · Eastern</small></span> ▾
          <span class="menu" hidden>
            <a href="cm-profile.html">${ico("settings")} My profile &amp; settings</a>
            <label class="sw">${ico("team")} Demo: sign in as <span data-switch>(roster not loaded)</span></label>
            <a href="my-wins.html">${ico("trophy")} My wins</a>
            <a data-cust>🎨 Customize: look, accessibility, layout, Questy</a>
            <a>${ico("timer")} Timer: auto-start on case open ✔</a>
            <a>${ico("bell")} Notifications</a>
            <a data-tour-replay>🎓 Replay the Questy tour</a>
            <a href="login.html#password">🔑 Change password</a>
            <a href="login.html">↪ Sign out</a>
          </span>
        </span>
      </span>
    </header>
    <div class="body"><nav class="sidenav">${groups}
      <p class="navhint">★ pin to My shortcuts · ✕ hide · + show again</p>
      <button type="button" class="navedit" data-navedit title="Customize sidebar"><span class="e1">✎ <span>Customize sidebar</span></span><span class="e2">✔ <span>Done customizing</span></span></button></nav></div>`;
  app.querySelector(".body").appendChild(main);
  body.prepend(app);
  body.prepend(review);

  review.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-v]");
    if (!b) return;
    const key = b.parentElement.dataset.key;
    store.set(key, b.dataset.v);
    if (key === "merge" && (current === "workstation" || current === "workbench")) {
      location.href = b.dataset.v === "merge" ? "workstation-merge.html" : "workstation-side.html";
      return;
    }
    if (key === "extras") { body.classList.toggle("hide-notes", b.dataset.v === "hide"); }
    if (key === "condhl") { body.classList.toggle("plain-cond", b.dataset.v === "hide"); }
    if (key === "role") { body.classList.toggle("is-manager", b.dataset.v === "mgr"); }
    b.parentElement.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    if (key === "merge") location.reload();
  });

  document.querySelectorAll("[data-collapse]").forEach((b) => b.addEventListener("click", () => {
    const c = body.classList.toggle("nav-collapsed");
    store.set("collapsed", c ? "yes" : "no");
  }));

  const me = document.querySelector("[data-menu]");
  me.addEventListener("click", (e) => {
    if (e.target.closest(".menu a[href], .menu select, .menu label")) return;
    const m = me.querySelector(".menu"); m.hidden = !m.hidden;
  });
  document.addEventListener("click", (e) => { if (!me.contains(e.target)) me.querySelector(".menu").hidden = true; });

  // Private roster (gitignored roster.local.js). Without it the wireframe falls back to placeholders.
  const applyRoster = () => {
    const people = window.CM_ROSTER || [];
    const cms = people.filter((p) => p.kind === "CM" || p.kind === "GCC" || p.isAdmin);
    if (!cms.length) return;
    const meName = store.get("me", cms.find((p) => p.kind === "CM" && !p.isManager).name);
    const me = people.find((p) => p.name === meName) || cms[0];
    const first = me.name.split(", ")[1] || me.name;
    document.querySelector(".me b").textContent = me.name;
    document.querySelector(".me small").textContent = me.team + (me.isDev ? " · Admin · Dev" : me.isAdmin ? " · Admin" : me.isManager ? " · Manager" : "");
    document.querySelectorAll("[data-me-first]").forEach((el) => { el.textContent = first; });
    document.querySelectorAll("[data-me-name]").forEach((el) => { el.textContent = me.name; });
    document.querySelectorAll("[data-me-team]").forEach((el) => { el.textContent = me.team; });
    document.querySelectorAll("[data-me-email]").forEach((el) => { el.textContent = me.email || "(email not on roster yet)"; });
    body.dataset.meEmail = me.email || "";
    body.classList.toggle("is-manager", store.get("role", "cm") === "mgr" || !!me.isManager);
    body.classList.toggle("is-admin", !!me.isAdmin);
    body.classList.toggle("is-dev", !!me.isDev);
    const teams = [...new Set(cms.map((p) => p.team))];
    const opts = teams.map((t) => `<optgroup label="${t}">${cms.filter((p) => p.team === t)
      .map((p) => `<option ${p.name === me.name ? "selected" : ""}>${p.name}</option>`).join("")}</optgroup>`).join("");
    document.querySelectorAll("select[data-roster]").forEach((s) => { s.innerHTML = opts; });
    const sel = document.createElement("select");
    sel.dataset.roster = ""; sel.innerHTML = opts; sel.title = "Switch who is working (until SSO)";
    const slot = document.querySelector(".menu [data-switch]");
    slot.replaceWith(sel);
  };
  document.addEventListener("change", (e) => {
    if (e.target.matches("select[data-roster]")) { store.set("me", e.target.value); location.reload(); }
  });
  const rs = document.createElement("script");
  rs.src = "roster.local.js"; rs.onload = applyRoster;
  document.head.appendChild(rs);

  document.querySelectorAll("[data-timer]").forEach((b) => b.addEventListener("click", () => {
    const t = b.closest(".timer"); const run = t.classList.toggle("running");
    b.textContent = run ? "❚❚" : "▶";
  }));

  // Guided / Expert demo toggle on workstation pages
  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      body.classList.toggle("expert", btn.dataset.mode === "expert");
      document.querySelectorAll("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.mode === btn.dataset.mode)));
    });
  });

  // Simple show/hide demos: <button data-toggle="#id">
  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(btn.dataset.toggle).forEach((el) => { el.hidden = !el.hidden; });
    });
  });

  /* ---------- Round 5: personal sidebar ---------- */
  document.querySelectorAll("[data-navedit]").forEach((nb) => nb.addEventListener("click", () => {
    if (body.classList.contains("nav-collapsed")) { body.classList.remove("nav-collapsed"); store.set("collapsed", "no"); }
    body.classList.toggle("nav-edit");
  }));
  document.querySelector(".sidenav").addEventListener("click", (e) => {
    const pin = e.target.closest("[data-pin]"); const hide = e.target.closest("[data-hide]");
    if (!pin && !hide) return;
    e.preventDefault();
    if (pin) { const id = pin.dataset.pin; const l = list("navpin"); store.set("navpin", (l.includes(id) ? l.filter((x) => x !== id) : l.concat(id)).join(",")); }
    if (hide) { const id = hide.dataset.hide; const l = list("navhide"); store.set("navhide", (l.includes(id) ? l.filter((x) => x !== id) : l.concat(id)).join(",")); }
    store.set("navedit", "yes"); location.reload();
  });
  if (store.get("navedit", "no") === "yes") { body.classList.add("nav-edit"); store.set("navedit", "no"); }

  /* ---------- Round 5: appearance, accessibility, page layout ---------- */
  const ACCENTS = { navy: ["#002F6C", "#0b3d7e"], teal: ["#00606B", "#00757F"], plum: ["#4B2A7B", "#5d3893"], slate: ["#33475B", "#41586f"] };
  const FLAGS = [["compact", "Compact spacing"], ["reduce-motion", "Reduce motion"], ["ul-links", "Always underline links"], ["focus-strong", "Strong keyboard focus outline"], ["readable", "Easier-to-read font & spacing"], ["no-celebrate", "Turn off celebrations & streak"]];
  const QFLAGS = [["no-questy", "Hide the Ask Questy chat button"], ["no-tinyquesty", "Hide teeny Questy on tips & \"why\" notes"]];
  const applyLook = () => {
    body.classList.toggle("topnav", store.get("nav", "side") === "top");
    ["theme-dark", "theme-hc"].forEach((c) => body.classList.remove(c));
    const th = store.get("theme", "light"); if (th !== "light") body.classList.add("theme-" + th);
    const a = ACCENTS[store.get("accent", "navy")] || ACCENTS.navy;
    body.style.setProperty("--navy", a[0]); body.style.setProperty("--navy-2", a[1]);
    main.style.zoom = store.get("zoom", "1");
    FLAGS.concat(QFLAGS).forEach(([k]) => body.classList.toggle(k, store.get("a11y-" + k, "no") === "yes"));
  };
  applyLook();

  // Every box on a page is a "widget" the CM can hide or reorder; saved per page.
  const widgets = [...main.querySelectorAll("section.box, main > .grid.g4")].filter((w) => !w.closest(".notes"));
  widgets.forEach((w, i) => { w.dataset.widget = "w" + i; });
  const wName = (w) => (w.querySelector("h3") ? w.querySelector("h3").textContent.replace(/\d+\s*$/, "").trim() : "Summary cards");
  const layoutKey = "layout-" + current + (body.dataset.option || "");
  const getLayout = () => { try { return JSON.parse(store.get(layoutKey, "{}")); } catch (e) { return {}; } };
  const applyLayout = () => {
    const L = getLayout();
    (L.order || []).forEach((id) => { const w = main.querySelector(`[data-widget="${id}"]`); if (w) w.parentElement.appendChild(w); });
    widgets.forEach((w) => w.classList.toggle("w-hidden", (L.hidden || []).includes(w.dataset.widget)));
  };
  applyLayout();

  const cust = document.createElement("aside");
  cust.className = "cust"; cust.hidden = true;
  const segc = (key, opts, val) => `<span class="segc" data-ck="${key}">${opts.map(([v, l]) => `<button type="button" data-cv="${v}" aria-pressed="${v === val}">${l}</button>`).join("")}</span>`;
  const renderCust = () => {
    const L = getLayout();
    const ordered = [...main.querySelectorAll("[data-widget]")];
    cust.innerHTML = `
      <header class="row" style="justify-content:space-between"><h3>🎨 Customize</h3><button type="button" class="btn sm" data-cclose>Done</button></header>
      <p class="muted">Saved to your profile, so it follows you to any computer.</p>
      <h4>Theme</h4>
      <div class="opt">Mode ${segc("theme", [["light", "☀ Light"], ["dark", "🌙 Dark"], ["hc", "◐ High contrast"]], store.get("theme", "light"))}</div>
      <div class="opt">Accent color <span>${Object.keys(ACCENTS).map((k) => `<button type="button" class="swatch" title="${k}" data-accent="${k}" aria-pressed="${store.get("accent", "navy") === k}" style="background:${ACCENTS[k][0]}"></button>`).join(" ")}</span></div>
      <div class="opt">Text size ${segc("zoom", [["0.9", "A-"], ["1", "A"], ["1.15", "A+"], ["1.3", "A++"]], store.get("zoom", "1"))}</div>
      <h4>Accessibility</h4>
      ${FLAGS.map(([k, l]) => `<label class="opt">${l}<input type="checkbox" data-flag="${k}" ${store.get("a11y-" + k, "no") === "yes" ? "checked" : ""}></label>`).join("")}
      <h4>Layout</h4>
      <div class="opt">Menu ${segc("nav", [["side", "◧ Side"], ["top", "▭ Top"]], store.get("nav", "side"))}</div>
      <div class="opt">Case workstation ${segc("merge", [["merge", "Merged"], ["side", "Side-by-side"]], store.get("merge", "merge"))}</div>
      <p class="muted fine"><b>Merged</b>: one checklist page per case. <b>Side-by-side</b>: the IR workbench on the left, the guide on the right.</p>
      <h4>Questy</h4>
      ${QFLAGS.map(([k, l]) => `<label class="opt">${l}<input type="checkbox" data-flag="${k}" ${store.get("a11y-" + k, "no") === "yes" ? "checked" : ""}></label>`).join("")}
      <p><button type="button" class="btn sm" data-tour-replay>🎓 Replay the Questy tour</button></p>
      <h4>This page's layout</h4>
      <p class="muted">Show, hide, or move sections on <b>${document.title.replace("WF · ", "")}</b>. Each page remembers its own layout.</p>
      ${ordered.map((w) => `<div class="wrow"><label><input type="checkbox" data-wshow="${w.dataset.widget}" ${(L.hidden || []).includes(w.dataset.widget) ? "" : "checked"}>${wName(w)}</label>
        <button type="button" data-wmove="${w.dataset.widget}" data-dir="-1" title="Move up">↑</button><button type="button" data-wmove="${w.dataset.widget}" data-dir="1" title="Move down">↓</button></div>`).join("")}
      <p class="row" style="margin-top:12px"><button type="button" class="btn sm" data-wreset>Reset this page</button><button type="button" class="btn sm" data-areset>Reset all appearance</button></p>`;
  };
  document.body.appendChild(cust);
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cust]")) { e.preventDefault(); renderCust(); cust.hidden = !cust.hidden; body.classList.toggle("layout-edit", !cust.hidden); return; }
    if (!cust.contains(e.target)) return;
    const t = e.target;
    if (t.closest("[data-cclose]")) { cust.hidden = true; body.classList.remove("layout-edit"); return; }
    const cv = t.closest("[data-cv]"); if (cv) store.set(cv.parentElement.dataset.ck, cv.dataset.cv);
    if (cv && cv.parentElement.dataset.ck === "merge") {
      const f = location.pathname.split("/").pop();
      if (f === "workstation-merge.html" || f === "workstation-side.html") { location.href = cv.dataset.cv === "merge" ? "workstation-merge.html" : "workstation-side.html"; return; }
      location.reload(); return;
    }
    const ac = t.closest("[data-accent]"); if (ac) store.set("accent", ac.dataset.accent);
    const mv = t.closest("[data-wmove]");
    if (mv) {
      const w = main.querySelector(`[data-widget="${mv.dataset.wmove}"]`);
      const sibs = [...w.parentElement.children].filter((x) => x.dataset.widget);
      const i = sibs.indexOf(w); const j = i + Number(mv.dataset.dir);
      if (j >= 0 && j < sibs.length) {
        if (mv.dataset.dir === "-1") w.parentElement.insertBefore(w, sibs[j]); else w.parentElement.insertBefore(sibs[j], w);
        const L = getLayout(); L.order = [...main.querySelectorAll("[data-widget]")].map((x) => x.dataset.widget); store.set(layoutKey, JSON.stringify(L));
      }
    }
    if (t.closest("[data-wreset]")) store.set(layoutKey, "{}");
    if (t.closest("[data-areset]")) ["theme", "accent", "zoom"].concat(FLAGS.concat(QFLAGS).map(([k]) => "a11y-" + k)).forEach((k) => store.set(k, ""));
    if (t.closest("[data-wreset], [data-areset]")) { location.reload(); return; }
    applyLook(); renderCust();
  });
  cust.addEventListener("change", (e) => {
    const f = e.target.dataset.flag; if (f) store.set("a11y-" + f, e.target.checked ? "yes" : "no");
    const s = e.target.dataset.wshow;
    if (s) { const L = getLayout(); L.hidden = (L.hidden || []).filter((x) => x !== s); if (!e.target.checked) L.hidden.push(s); store.set(layoutKey, JSON.stringify(L)); applyLayout(); }
    applyLook();
  });

  /* ---------- Round 5: Ask Quest chatbot ---------- */
  // Wireframe demo: a few real answers condensed from Quest. The real bot searches all Quest topics on the server.
  const Q = "https://quest-prod/CM/Content/";
  const KB = [
    { k: ["contract state", "situs", "which state", "fr2133"], a: "Contract state = the owner's <b>residential</b> state (all products). Exceptions: <b>trust</b> → trust situs state; <b>entity</b> → entity's legal address; <b>multiple owners</b> → first owner listed; <b>qualified plan</b> → employer's address; US citizen abroad → where the app was signed; military base → base state. A different state needs the <b>FR2133 Situs form</b> (not for entity/trust owners; not amendable). WinRisk won't auto-order it, so add an Issue requirement.", q: "LNBS/Case_Manager/Initial/LNBS_Determining_Contract_State.htm", t: "Determining Contract State" },
    { k: ["trust", "f6734", "trustee"], a: "Trust-owned: check the <b>F6734 Trust Certificate</b> is complete and signed by every trustee, trustees sign in trustee capacity, and the trust name matches everywhere. The trust situs = contract state, so use that state's forms. Don't issue until the F6734 and trustee signatures are IGO.", q: "LNBS/Case_Manager/Owner_bene/Handling%20Trust%20Owned%20Policies.htm", t: "Handling Trust Owned Policies" },
    { k: ["companion", "same insured", "family policies", "linked"], a: "Companions (spouses, family, business partners) are reviewed <b>together</b> and take priority. Look for WinRisk Issue Requirement #2 / TPP QA Audit Action Required, but they aren't always listed, so check TreX cover letters, MISC requirements, and emails, and run a client search. If one companion needs a special skill, the CM with that skill takes all of them. 💡 In the workstation, link them with 🔗 so same-insured cases share one IR email.", q: "LNBS/Case_Manager/Initial/Best%20Practices%20for%20Handling%20Companions.htm", t: "Best Practices for Handling Companions" },
    { k: ["1035 with loan", "loan carryover", "f7010", "loan"], a: "1035 with loan carryover qualifies when Part 1 shows the loan, the <b>F7010</b> is signed, the illustration shows the carryover, the rollover is ≥ $10,000, and the new policy is WL or Apex VUL. Don't hold issue for funds. The loan applies after delivery and free look.", q: "LNBS/Replacements/1035_Processing/LNBS_Determining_if_a_1035_Exchange_Qualifies_for_Loan_Carryover.htm", t: "Does a 1035 qualify for loan carryover?" },
    { k: ["save age", "backdate", "backdating"], a: "Save Age: the age changes 183 days after the birthday. The backdate limit is <b>6 months</b> (<b>4 months for a 1035</b>), and future dates aren't allowed. Day 29–31 → the 28th. Apex VUL weekend dates move to the prior business day. 🧮 Open the Save Age tool and it does the math for you.", q: "LNBS/Case_Manager/Initial/lnbs_initial_review.htm", t: "Initial Review (policy dating)", tool: "tool-save-age.html" },
    { k: ["joint", "survivorship", "second insured", "swl"], a: "Survivorship/joint: <b>each insured</b> signs their own insured-signed forms, both insureds' details must match the illustration, and Save Age can apply to either insured. Check that the 2nd insured's images are indexed in TreX.", q: "LNBS/Case_Manager/Initial/LNBS_Survivorship_Whole_Life_Legacy_Initial_Review.htm", t: "Survivorship WL Legacy Initial Review" },
    { k: ["vul", "variable", "mmlis", "california"], a: "VUL: suitability review applies (MMLIS). <b>California owner age 60+ → VUL not available</b> (manual check). NY needs F3669NY allocations, N201-NY399, and MI1323NY.", q: "LNBS/Variable/LNBS%20Initial%20Review%20and%20Suitability%20Review%20of%20VUL%20Policies.htm", t: "IR & Suitability Review of VUL" },
    { k: ["bot", "campir", "esign"], a: "eSigned MMSD cases may have been pre-reviewed by the <b>CaMPIR BOT</b>. Act on its Action Required note instead of repeating the full sweep, but still verify anything the note flags.", q: "LNBS/Case_Manager/MMSD/IR%20Process/LNBS_MMSD_WinRisk_Initial_Review_eSigned_Process.htm", t: "MMSD WinRisk IR – eSigned" },
    { k: ["amendment", "amend"], a: "Amendments correct or clarify the application without new forms. Follow the facts & guidelines (what can be amended, wording, order). ✍️ The Amendment builder writes the wording for you.", q: "LNBS/Case_Manager/Amendments/lnbs_amendment_facts_and_guidelines.htm", t: "Amendment facts & guidelines", tool: "tool-amendment.html" },
  ];
  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "qbot-fab"; fab.innerHTML = `<img src="icons/questy-speaking-custom.svg" alt="" /> Ask Questy`;
  const bot = document.createElement("section");
  bot.className = "qbot"; bot.hidden = true;
  bot.innerHTML = `<header><img src="icons/questy-speaking-custom.svg" alt="" /><span><b>Questy 👋</b><small>Ask me anything in Quest</small></span><button type="button" data-qclose title="Close">×</button></header>
    <div class="log"></div>
    <div class="chips">${["How do I tell the contract state?", "Trust checklist?", "Companion cases?", "Does a 1035 loan carry over?", "Save Age rules"].map((c) => `<button type="button">${c}</button>`).join("")}</div>
    <form><input placeholder="e.g. how do I know if…" aria-label="Ask a question" /><button class="btn sm pri">Ask</button></form>
    <p class="fine">Answers are short summaries. Always confirm on the linked Quest page (Quest is the source of record).</p>`;
  document.body.append(bot, fab);
  if (document.querySelector(".drawer")) body.classList.add("has-drawer");
  const log = bot.querySelector(".log");
  const say = (html, me) => { const d = document.createElement("div"); d.className = "msg" + (me ? " me" : ""); d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; };
  const first = () => (document.querySelector(".me b").textContent.split(", ")[1] || "there");
  const ask = (txt) => {
    if (!txt.trim()) return;
    say(txt.replace(/</g, "&lt;"), true);
    const s = txt.toLowerCase();
    const hit = KB.map((e) => ({ e, n: e.k.filter((k) => s.includes(k)).length })).sort((a, b) => b.n - a.n)[0];
    setTimeout(() => {
      if (hit && hit.n) {
        say(`${hit.e.a}<br><a class="q" href="${Q}${hit.e.q}" target="_blank" rel="noopener">📘 Quest: ${hit.e.t} ↗</a>${hit.e.tool ? ` · <a class="q" href="${hit.e.tool}">Open tool →</a>` : ""}`);
      } else {
        say(`Hmm, I couldn't find that one 🤔 Try other words, or <a class="q" href="${Q}LNBS/CM%20Home%20Page.htm" target="_blank" rel="noopener">search Quest directly ↗</a>. Was this helpful? 👍 👎`);
      }
    }, 350);
  };
  fab.addEventListener("click", () => {
    bot.hidden = !bot.hidden;
    if (!bot.hidden && !log.children.length) say(`Hi ${first()}! 🎉 I'm Questy. Ask me how to handle anything (contract state, trusts, 1035s…) and I'll give you the short answer plus the Quest page.`);
  });
  bot.querySelector("[data-qclose]").addEventListener("click", () => { bot.hidden = true; });
  bot.querySelector(".chips").addEventListener("click", (e) => { if (e.target.matches("button")) ask(e.target.textContent); });
  bot.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); const i = bot.querySelector("input"); ask(i.value); i.value = ""; });

  /* ---------- Round 6: send email from the case (Salesforce-style composer) ---------- */
  // Any element with [data-compose] opens it. data-compose="ir" | "followup" | "cap-uw" | "cap-nouw" | "delivery" picks the template.
  const SHARED_FROM = "MassMutual MMSD Underwriting & New Business Case Updates <MassMutualMMSDUnderwriting&NewBusinessCase@massmutual.com>";
  const TPL = {
    ir: {
      n: "Initial Review - No Requirements",
      s: "Last Name Policy - MMSD Initial Review - No Contractual Requirements",
      f: ["F6734 Trust Certificate (state).pdf", "F7010 Loan Carryover.pdf"],
      b: `************This email is being sent by the MMSD Case Management Team***************

Financial Professional Name:

Thank you for submitting the above referenced life application. The Case Manager initial review has been completed and at this time, there are no contractual requirements outstanding.

Please note, a separate email referencing any underwriting requirements will be sent upon completion of the initial underwriting review.

Account Manager: {am}
Underwriter:

Kindly forward all documents, forms, exams, authorizations, etc. to MMSD_Requirements@MassMutual.com and copy your Account Manager.

Questions or Next Steps? Contact your Account Manager, cc'd on this email.
MMSD New Business Team: (800) 601-9983 - Option 4`,
    },
    followup: {
      n: "Interim - Requirements",
      s: "Last Name Policy - MMSD Interim - Contractual Requirements",
      f: [],
      b: `This email is being sent by the MMSD Case Management Team

Insured: {ins}
Financial Professional:

After review of the information provided, the following is needed to continue our review:

{reqs}

Account Manager: {am}
Underwriter:
Product applied for:

Questions on Next Steps? Contact your Account Manager, cc'd on this email.`,
    },
    "cap-uw": {
      n: "Approval - Outstanding Requirement",
      s: "Last Name Policy - MMSD Approval - Outstanding Requirement",
      f: ["Policy design before-after.pdf"],
      b: `Underwriting team,

The field requested a change after approval. Before / after design attached. Referral reason: face increase > 10%.

{me}`,
    },
    "cap-nouw": {
      n: "Change after approval - no UW needed",
      s: "Change after approval - {pol} - {ins}",
      f: ["Policy design before-after.pdf"],
      b: `The requested change does not need underwriting approval. Updated illustration and amendments to follow.

{me}`,
    },
    delivery: {
      n: "Issued - DocuSign",
      s: "Last Name Policy - MMSD Policy Issued",
      f: ["NEW PAC INSTRUCTIONS.pdf", "DocuSign instructions 2026.pdf"],
      b: `This email is being sent by the MMSD Case Management Team

Insured: {ins}

Congratulations, this policy has been issued. Premiums are due from the policy effective date.

You will receive the policy package via DocuSign for electronic signature. IMPORTANT: Please see attached instructions for passcodes and signing order.

Frequency change requests: Please email your Account Manager.

Account Manager: {am}

Questions or Next Steps? Contact your Account Manager, cc'd on this email.`,
    },
  };
  const meName = () => { const n = (document.querySelector(".me b").textContent || "CM name").split(", "); return n.length > 1 ? `${n[1]} ${n[0]}` : n[0]; };
  const fill = (t) => t
    .replace(/\{pol\}/g, (body.dataset.pol || "77 000 001"))
    .replace(/\{ins\}/g, (body.dataset.ins || "Tyrion Lannister"))
    .replace(/\{contact\}/g, (body.dataset.contact || body.dataset.prod || "Firm contact"))
    .replace(/\{prod\}/g, (body.dataset.contact || body.dataset.prod || "Firm contact"))
    .replace(/\{reqs\}/g, (body.dataset.reqs || "  1. F6734 Trust Certificate, signed by all trustees (attached)|  2. F7010 1035 loan carryover form (attached)").split("|").join("\\n"))
    .replace(/\{am\}/g, (body.dataset.am || "Fabian, Jessie").replace(/<.*$/, ""))
    .replace(/\{me\}/g, meName())
    .replace(/\{team\}/g, (document.querySelector(".me small") || {}).textContent || "CM Team");

  const comp = document.createElement("section");
  comp.className = "composer"; comp.hidden = true; comp.setAttribute("role", "dialog"); comp.setAttribute("aria-label", "Send email");
  document.body.appendChild(comp);

  const renderComp = (key) => {
    const T = TPL[key] || TPL.ir;
    const mode = store.get("from-mode", "cm");
    const files = body.dataset.forms !== undefined ? (body.dataset.forms ? body.dataset.forms.split("|") : []) : T.f;
    comp.innerHTML = `
      <header><b>Send email</b><span class="muted">- ${body.dataset.ins || "Tyrion Lannister"} - Policy ${body.dataset.pol || "77 000 001"}</span><button type="button" data-xclose title="Close">x</button></header>
      <div class="cbody">
        <label class="crow"><span>Template</span><select data-tpl>${Object.keys(TPL).map((k) => `<option value="${k}" ${k === key ? "selected" : ""}>${TPL[k].n}</option>`).join("")}</select></label>
        <div class="crow"><span>Send from</span><span class="seg"><button type="button" class="btn sm ${mode === "cm" ? "pri" : ""}" data-from="cm">Current CM</button><button type="button" class="btn sm ${mode === "shared" ? "pri" : ""}" data-from="shared">Shared inbox</button></span></div>
        <div class="crow"><span>From</span><span class="chip me-chip">${mode === "shared" ? SHARED_FROM : `${meName()} &lt;${body.dataset.meEmail || "you@massmutual.com"}&gt;`}</span><small class="muted">${mode === "shared" ? "shared mailbox pilot mode" : "sends from your own mailbox - replies come to you"}</small></div>
        <div class="crow"><span>To</span>${(body.dataset.to || "Varys, NB desk <littlebirds@edwardjones.com>").split("|").map((x) => `<span class="chip">${x.replace(/</g, "&lt;")} x</span>`).join("")}<span class="addr">+ add</span></div>
        <div class="crow"><span>CC</span><span class="chip">${key.startsWith("cap") ? "UW team &lt;lnb-uw@massmutual.com&gt; x" : `${body.dataset.am || "Account manager (from Firm directory)"} x`}</span><span class="addr">+ add</span></div>
        <label class="crow"><span>Subject</span><input value="${fill(T.s)}" /></label>
        <div class="crow"><span>Flags</span><label><input type="checkbox" ${key.startsWith("cap") ? "checked" : ""}> High importance</label><label><input type="checkbox" checked> Save to case activity</label><label><input type="checkbox"> Request read receipt</label></div>
        <textarea rows="11">${fill(T.b)}</textarea>
        <div class="crow att"><span>Attach</span>${(key === "ir" ? files : T.f).map((x) => `<span class="chip">Attachment: ${x} x</span>`).join("") || '<span class="muted">No forms for this template</span>'}
          <span class="addr">+ From forms library</span><span class="addr">+ Case documents</span><span class="addr">+ Upload</span></div>
        <p class="muted fine">Forms attach automatically from the case requirements (correct state version). Total 1.2 MB of 25 MB.</p>
      </div>
      <footer><button type="button" class="btn sm pri" data-xsend>Send</button><button type="button" class="btn sm">Save draft</button><button type="button" class="btn sm">Open in Outlook instead</button><span class="muted">Ctrl+Enter to send</span></footer>`;
  };

  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-compose]");
    if (o) { e.preventDefault(); renderComp(o.dataset.compose || "ir"); comp.hidden = false; return; }
    if (!comp.contains(e.target)) return;
    if (e.target.closest("[data-xclose]")) comp.hidden = true;
    if (e.target.closest("[data-from]")) {
      store.set("from-mode", e.target.closest("[data-from]").dataset.from);
      renderComp((comp.querySelector("[data-tpl]") || { value: "ir" }).value);
      return;
    }
    if (e.target.closest("[data-xsend]")) {
      const subj = (comp.querySelector(".crow input:not([type])") || {}).value || "Email";
      comp.innerHTML = `<div class="sent"><img src="icons/questy-sent-custom.svg" alt="" /><div><b>Sent!</b><p>Saved to case activity and to your Outlook Sent Items. Requirements marked Requested today.</p>
        <button type="button" class="btn sm" data-xclose>Close</button></div></div>`;
      const act = document.querySelector("#activity .acts");
      if (act) act.insertAdjacentHTML("afterbegin", `<div class="act new"><b>Email sent</b> - just now - ${store.get("from-mode", "cm") === "shared" ? "Shared inbox" : meName()}<br><span class="muted">${subj.replace(/</g, "&lt;")} - with attachments</span></div>`);
    }
  });
  comp.addEventListener("change", (e) => { if (e.target.matches("[data-tpl]")) renderComp(e.target.value); });

  /* ---------- Round 6: home hero widgets (pick 1 of 4; all animated + interactive) ---------- */
  const slot = document.querySelector("[data-hero-widget]");
  if (slot) {
    slot.closest(".hero").classList.add("has-widget");
    const WIDGETS = [["weather", "☀", "Weather"], ["pet", "💙", "Questy"], ["breathe", "🌬", "Breathe"], ["bubbles", "🫧", "Pop"]];
    const pick = (k) => `<div class="hw-pick">${WIDGETS.map(([id, i, l]) => `<button type="button" data-hw="${id}" title="${l}" aria-pressed="${id === k}">${i}</button>`).join("")}</div>`;
    let timers = [];
    const clear = () => { timers.forEach(clearInterval); timers = []; };
    const fmtDate = (d) => d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    const fmtTime = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const SCENES = {
      sunny: { l: "Sunny", s: `<div class="sun"><div class="rays"></div><div class="face"><i></i><i></i><b></b></div></div>` },
      rain: { l: "Rain", s: `<div class="cloud c1"></div><div class="cloud c2"></div><div class="drops">${Array.from({ length: 16 }, (_, i) => `<i style="left:${6 + i * 6}%;animation-delay:${(i * 0.13) % 1}s"></i>`).join("")}</div>` },
      cloudy: { l: "Cloudy", s: `<div class="sun small"><div class="rays"></div><div class="face"><i></i><i></i><b></b></div></div><div class="cloud c1"></div><div class="cloud c3"></div>` },
      snow: { l: "Snow", s: `<div class="cloud c1"></div><div class="flakes">${Array.from({ length: 14 }, (_, i) => `<i style="left:${5 + i * 7}%;animation-delay:${(i * 0.37) % 3}s">❄</i>`).join("")}</div>` },
      clear: { l: "Clear", s: `<div class="stars">${Array.from({ length: 14 }, (_, i) => `<i style="left:${(i * 37) % 95}%;top:${(i * 53) % 80}%;animation-delay:${(i * 0.29) % 2}s">✦</i>`).join("")}</div><div class="moon"><div class="face"><i></i><i></i><b></b></div></div>` },
      cloudyn: { l: "Cloudy", s: `<div class="stars">${Array.from({ length: 8 }, (_, i) => `<i style="left:${(i * 41) % 95}%;top:${(i * 29) % 60}%;animation-delay:${(i * 0.31) % 2}s">✦</i>`).join("")}</div><div class="moon small"><div class="face"><i></i><i></i><b></b></div></div><div class="cloud c1"></div><div class="cloud c3"></div>` },
      storm: { l: "Thunderstorm", s: `<div class="cloud c1 dark"></div><div class="cloud c2 dark"></div><div class="bolt">⚡</div><div class="drops">${Array.from({ length: 16 }, (_, i) => `<i style="left:${6 + i * 6}%;animation-delay:${(i * 0.11) % 1}s"></i>`).join("")}</div>` },
    };
    const codeToCond = (c) => (c <= 1 ? "sunny" : c <= 48 ? "cloudy" : c <= 67 || (c >= 80 && c <= 82) ? "rain" : c <= 86 ? "snow" : "storm");
    const render = (k) => {
      clear(); store.set("hero-widget", k);
      if (k === "weather") {
        let cond = store.get("wx-preview", "") || "sunny"; let temp = "72°";
        let night = (() => { const h = new Date().getHours(); return h < 6 || h >= 19; })();
        const loc = wxLoc();
        const draw = () => {
          const sk = night && cond === "sunny" ? "clear" : night && cond === "cloudy" ? "cloudyn" : cond;
          slot.innerHTML = `<div class="hw hw-weather wx-${sk} ${night ? "night" : ""}" title="Click the sky to preview other weather">
            <div class="scene" data-wx>${SCENES[sk].s}</div>
            <div class="wxinfo"><b class="wtime">${fmtTime(new Date())}</b><span>${fmtDate(new Date())}</span><span class="wtemp">${temp} · ${SCENES[sk].l}</span><button type="button" class="wloc" data-wloc title="Change location">📍 ${loc.n} ✎</button></div>${pick(k)}</div>`;
        };
        draw();
        timers.push(setInterval(() => { const el = slot.querySelector(".wtime"); if (el) el.textContent = fmtTime(new Date()); }, 1000));
        // Real weather (no key needed). On the private server this goes through our API so the browser never calls outside.
        if (window.fetch && !store.get("wx-preview", "")) {
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit&timezone=auto`)
            .then((r) => r.json()).then((j) => { cond = codeToCond(j.current.weather_code); night = j.current.is_day === 0; temp = Math.round(j.current.temperature_2m) + "°"; if (store.get("hero-widget") === "weather" && !slot.querySelector(".wlocf")) draw(); })
            .catch(() => {});
        }
        slot.onclick = (e) => {
          if (e.target.closest("[data-hw]") || e.target.closest(".wlocf")) return;
          if (e.target.closest("[data-wloc]")) { locForm(slot.querySelector(".hw"), () => render("weather")); return; }
          if (e.target.closest(".sun, .moon")) { const s = e.target.closest(".sun, .moon"); s.classList.remove("boop"); void s.offsetWidth; s.classList.add("boop"); return; }
          if (e.target.closest("[data-wx]")) { const ks = Object.keys(SCENES); cond = ks[(ks.indexOf(cond) + 1) % ks.length]; draw(); if (cond === "storm") setTimeout(() => slot.querySelector(".hw").classList.add("flash"), 50); }
        };
      }
      if (k === "pet") {
        const LINES = ["You're doing great! 💙", "NIGO? More like NI-GO-AWAY. 😎", "Hydrate, you magnificent CM! 💧", "Every IGO case is a tiny victory dance. 💃", "Fun fact: you've been awesome all day.", "Trust certs fear you. 📜", "Boop received. Productivity +10. ✨", "You're un-BOT-lievably good at this. 🤖", "Whole Life? More like Whole LOVELY. 💛", "You put the 'pro' in processing. 🏆", "I'd 1035-exchange anything for you. 🔄", "You're the beneficiary of my heart. 💘", "Free look? I can't stop looking at your work. 👀", "Your IRs are in good order. So is your hair. 💁", "Requirement received: one (1) high five. ✋", "You're approved at Preferred Plus Awesome. 🌟", "Term-ifically talented, that's you. ⏳", "Rider of the day: WP (Wonderful Person). 🦄", "Don't let anyone UL-timately bring you down. 🎈", "You VUL-ue every case, and it shows. 📈", "Save Age? I'd save a seat for you anywhere. 🪑", "Even your amendments are a-MEND-able. 🩹", "Snack break is a contractual requirement. 🍪", "Underwriters wish they were as sharp as you. ✏️", "You're the reason the queue smiles. 😊", "Questy fact: you are 100% IGO. ✅", "Delivery receipt: one big hug. 🤗", "You're the IGO-est person I know. 🌈", "Your attention to detail is policy-perfect. 🔍", "Plot twist: the requirement was received. 🎬", "You make Quest look easy. 📘", "High five for that HIPAA! ✋", "You're a case-closing machine. 🚂", "I'm not lion, you're roaring today. 🦁", "Keep calm and carry on underwriting. ☕", "You've got this in the bag (and the TreX folder). 🎒", "Fact: coffee works better when you're this awesome. ☕", "You're a premium human with zero lapses. 💎", "Your IRs are so clean they squeak. 🧼", "Even the BOT is impressed. 🤖💙", "That was a wholesome Whole Life move. 🌻", "You're riding high. No rider needed. 🏇", "Your follow-through is legendary. 🐉", "You're my favorite beneficiary of good vibes. 🎁", "Policy issued: one big smile. 😁", "You could underwrite a rainbow. 🌈", "Stay pawsitive, you're doing grrreat. 🐯", "You've got a 100% approval rating from me. 👍", "Every case you touch turns to IGO-ld. 🥇", "You're the face amount of fabulous. 💵", "Breathe in: confidence. Breathe out: NIGOs. 🌬️", "Your brain deserves a raise. Mine says so. 🧠", "You make complex cases look simple-ish. 🧩", "One step at a time. You're already ahead. 👣", "Trusts trust you. 🤝", "You're the queen/king of the queue. 👑", "Gold star for that gold-edged step! ⭐", "This case is lucky to have you. 🍀", "Look at you, crushing contract states. 🗺️", "Situs? More like Situ-YES. ✔️", "You turn 'pending' into 'done'. ⚡", "You've got more drive than a delivery deadline. 🚚", "Owl always be proud of you. 🦉", "You're un-bee-lievably helpful. 🐝", "Don't worry, be happy (and IGO). 🎶", "You're the bright side of new business. ☀️", "Stamp of approval: officially awesome. 📮", "You're doing better than you think. Really. 💙", "Nice! That was a smooth-ie operation. 🥤", "You're a 1-in-a-million (face amount). 🎯", "You bring the 'mutual' to MassMutual. 🤗", "Your checklist game is strong. 💪", "Hold the phone, you're amazing. 📞", "Interim email? Nailed it. 📨", "You know Quest better than I do. Shh. 🤫", "Water you waiting for? Hydrate! 💧", "Let's taco 'bout how great you are. 🌮", "You're one smart cookie. 🍪", "Whale done, you! 🐳", "You're making the field feel cared for. 🌷", "You're the CM everyone wants on their case. 🙌", "A little progress each day adds up. 📈", "Your kindness is the best rider. 💗", "You're sharper than a Save Age calculation. 🧮", "Out of NIGOs? Just out of this world. 🚀", "That was un-fur-gettable work. 🐱", "You're a peach. A very efficient peach. 🍑", "Look who's on fire today. 🔥", "I'd sign your Part 1 any day. ✍️", "Every policy you issue protects a family. 🏡", "You're the reason someone sleeps easier tonight. 🌙", "You make Mondays feel like Fridays. 🎉", "Proud of you, from my bow to my boots. 🎀", "Mission IGO: accomplished. 🕶️", "You're simply un-term-ditional-ly great. 💞", "Stretch break! Your spine says thanks. 🧘", "Ready to issue? You were born ready. 🏁", "You're the best part of my day. Boop! 💫", "You're writing the success story, one case at a time. 📖", "Somebody give this CM a parade. 🎊"];
        let pets = Number(store.get("pets", "0"));
        slot.innerHTML = `<div class="hw hw-pet"><div class="bubble">Hi <span data-me-first>${(document.querySelector(".me b").textContent.split(", ")[1] || "there")}</span>! Pet me for a pep talk.</div>
          <img class="pet" src="icons/questy-success-custom.svg" alt="Questy" /><div class="hearts"></div><small class="count">Pep talks today: <b>${pets}</b></small>${pick(k)}</div>`;
        const img = slot.querySelector(".pet");
        slot.onmousemove = (e) => { const r = img.getBoundingClientRect(); const dx = (e.clientX - (r.left + r.width / 2)) / 25; img.style.setProperty("--tilt", Math.max(-14, Math.min(14, dx)) + "deg"); };
        slot.onclick = (e) => {
          if (!e.target.closest(".pet")) return;
          pets += 1; store.set("pets", String(pets));
          slot.querySelector(".count b").textContent = pets;
          slot.querySelector(".bubble").textContent = LINES[Math.floor(Math.random() * LINES.length)];
          img.classList.remove("hop"); void img.offsetWidth; img.classList.add("hop");
          const h = document.createElement("i"); h.textContent = ["💙", "💖", "⭐", "✨"][pets % 4]; h.style.left = 40 + Math.random() * 30 + "%";
          slot.querySelector(".hearts").appendChild(h); setTimeout(() => h.remove(), 1600);
        };
      }
      if (k === "breathe") {
        let on = false; let rounds = 0;
        slot.innerHTML = `<div class="hw hw-breathe"><div class="orb"><span>Tap to start</span></div><div class="binfo"><b>1-minute reset</b><span>Breathe with the circle: in 4 · hold 4 · out 4.</span><small>Rounds: <b>0</b></small></div>${pick(k)}</div>`;
        const orb = slot.querySelector(".orb"); const lab = orb.querySelector("span");
        const PH = [["Breathe in…", "in"], ["Hold…", "hold"], ["Breathe out…", "out"]]; let p = 0;
        const step = () => { const [txt, cls] = PH[p % 3]; lab.textContent = txt; orb.className = "orb " + cls; if (p % 3 === 2) { rounds += 1; slot.querySelector(".binfo small b").textContent = rounds; } p += 1; if (rounds >= 5 && p % 3 === 0) { stop(); lab.textContent = "Nice. Back to it! 🌟"; } };
        const stop = () => { on = false; clear(); orb.className = "orb"; };
        slot.onclick = (e) => { if (!e.target.closest(".orb")) return; if (on) { stop(); lab.textContent = "Paused · tap"; return; } on = true; p = 0; step(); timers.push(setInterval(step, 4000)); };
      }
      if (k === "bubbles") {
        const WORDS = ["NIGO", "IGO", "1035X", "PAC", "HIPAA", "BOT", "Reg 60", "Reg 74", "Save Age", "Stress", "Monday", "Missing Lunch", "Mornings", "Redo", "Repair", "Reissue", "Dropped Call", "Declined", "Follow Up", "Another Follow Up", "Missing Sig", "Wrong Form", "Old Form", "Bad Scan", "Blurry PDF", "Escalation", "Backlog", "Pending", "Outstanding", "Queue", "Deadline", "Need ASAP", "Need by Noon", "Need by Yesterday", "Client Waiting", "Advisor Waiting", "Need Correction", "Case Note", "Voicemail", "Callback", "Transfer", "Hold Please", "Another Repair", "Not In Good Order", "IGO... SIKE", "Still NIGO", "Need Amendment", "Missing Trust", "No Beneficiary", "Wrong State", "Wrong Rider", "Mismatch", "Illustration", "Need Funding", "No Premium", "Need Signature", "Missing Page", "Page 7 Missing", "Page 12 Missing", "Page Upside Down", "Can't Read Scan", "Duplicate Upload", "Wrong Client", "Wrong Product", "Need Suitability", "LTC Missing", "Need Reg60", "Need Explanation", "Needs Review", "Needs Another Review", "Audit", "QA", "Manager Review", "Repair Again", "More Paperwork", "Need One More Thing", "Quick Question", "Got a Minute?", "Friendly Reminder", "Second Reminder", "Third Reminder", "Final Reminder", "Hot Case", "Rush Case", "Priority Case", "Super Priority", "Highest Priority", "Everything Priority", "System Down", "Loading...", "Still Loading...", "Teams Issue", "Outlook Issue", "PDF Error", "Attachment Missing", "Wrong Attachment", "See Previous Email", "See Other Email", "Forgot Date", "No Date", "No Initials", "No BOT", "No PAC", "No HIPAA", "No Lunch", "Coffee First", "Another NIGO", "One More Repair", "Please Advise", "Per My Last Email", "Urgent Request", "Field Follow-Up", "Need Wet Sig", "Missing Initials", "Wrong Version", "Expired Form", "Form Update", "Missing Rider", "Needs Rework", "Case Returned", "Back From Field", "Returned Again", "Waiting on Client", "Waiting on Advisor", "Waiting on Carrier", "Friday at 4PM", "Monday Morning", "Lunch Cancelled", "What?", "Missing Again", "Repaired Yesterday", "QA", "Almost IGO", "Not Quite IGO", "Surprise NIGO", "NIGO Season", "Stress Level 99", "Escalated Again", "Open Requirement", "More Signatures", "Signature Hunt", "Need One More Form", "One More Thing"];
        let popped = Number(store.get("popped", "0"));
        slot.innerHTML = `<div class="hw hw-bubbles"><div class="tank"></div><div class="binfo"><b>Pop the NIGOs</b><small>Popped: <b>${popped}</b></small></div>${pick(k)}</div>`;
        const tank = slot.querySelector(".tank");
        const spawn = () => {
          if (tank.children.length > 9) return;
          const b = document.createElement("button"); b.type = "button"; b.className = "bub"; const w = WORDS[Math.floor(Math.random() * WORDS.length)];
          b.textContent = w; const sz = 44 + Math.random() * 26; b.style.cssText = `left:${Math.random() * 78}%;width:${sz}px;height:${sz}px;animation-duration:${5 + Math.random() * 4}s`;
          b.addEventListener("animationend", () => b.remove()); tank.appendChild(b);
        };
        spawn(); spawn(); timers.push(setInterval(spawn, 900));
        slot.onclick = (e) => {
          const b = e.target.closest(".bub"); if (!b) return;
          popped += 1; store.set("popped", String(popped)); slot.querySelector(".binfo small b").textContent = popped;
          b.classList.add("pop"); b.textContent = b.textContent === "NIGO" ? "Bye NIGO!" : "pop!"; setTimeout(() => b.remove(), 350);
        };
      }
    };
    slot.addEventListener("click", (e) => { const b = e.target.closest("[data-hw]"); if (b) { e.stopPropagation(); if (b.dataset.hw === "weather") store.set("wx-preview", ""); render(b.dataset.hw); } }, true);
    render(store.get("hero-widget", "weather"));
  }

  /* ---------- Round 6c: lock completed sections (no accidental edits) ---------- */
  if (current === "workstation") {
    const caseKey = "lock-" + location.pathname.split("/").pop();
    const getL = () => { try { return JSON.parse(store.get(caseKey, "{}")); } catch (e) { return {}; } };
    const setL = (L) => store.set(caseKey, JSON.stringify(L));
    const secs = [...main.querySelectorAll("aside.box, .step")];
    const stamp = () => `${new Date().toLocaleDateString([], { month: "numeric", day: "numeric" })} ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${meName()}`;
    secs.forEach((s, i) => {
      s.dataset.sec = "s" + i;
      const bar = document.createElement("div"); bar.className = "secbar";
      bar.innerHTML = `<span class="lockinfo muted"></span><button type="button" class="btn sm" data-secsave>💾 Save</button><button type="button" class="btn sm pri" data-secdone>✔ Done</button>`;
      s.appendChild(bar);
      const pen = document.createElement("button"); pen.type = "button"; pen.className = "pencil"; pen.title = "Edit this section"; pen.dataset.secedit = ""; pen.textContent = "✎";
      (s.querySelector("h3, h4") || s).appendChild(pen);
    });
    const paint = () => {
      const L = getL();
      secs.forEach((s) => { const v = L[s.dataset.sec]; s.classList.toggle("locked", !!v || !!L.__ir); s.querySelector(".lockinfo").textContent = v ? `✔ Done ${v}` : ""; });
      body.classList.toggle("case-locked", !!L.__ir);
      const banner = document.querySelector(".irlock");
      if (L.__ir && !banner) main.insertAdjacentHTML("afterbegin", `<div class="irlock">🔒 <b>IR complete</b> · ${L.__ir}. The case is read-only so nothing changes by accident. <button type="button" class="btn sm" data-caseedit>✎ Edit case</button></div>`);
      if (!L.__ir && banner) banner.remove();
    };
    paint();
    main.addEventListener("click", (e) => {
      const s = e.target.closest("[data-sec]"); const L = getL();
      if (e.target.closest("[data-secdone]")) { L[s.dataset.sec] = stamp(); setL(L); paint(); }
      else if (e.target.closest("[data-secsave]")) { const b = e.target.closest("[data-secsave]"); b.textContent = "✔ Saved"; setTimeout(() => { b.textContent = "💾 Save"; }, 1400); }
      else if (e.target.closest("[data-secedit]")) {
        if (L.__ir && !confirm("This case's IR is complete. Edit it anyway? The change is logged in the case history.")) return;
        delete L[s.dataset.sec]; if (L.__ir) delete L.__ir; setL(L); paint(); s.classList.add("editing"); setTimeout(() => s.classList.remove("editing"), 1500);
      } else if (e.target.closest("[data-caseedit]")) {
        if (!confirm("Unlock the whole case for editing? The change is logged in the case history.")) return;
        delete L.__ir; setL(L); paint();
      } else if (s && s.classList.contains("locked") && !e.target.closest("a")) { e.preventDefault(); s.classList.add("nudge"); setTimeout(() => s.classList.remove("nudge"), 600); }
    }, true);
    document.querySelectorAll('[data-toggle="#celebrate"]').forEach((b) => b.addEventListener("click", () => { const L = getL(); L.__ir = stamp(); setL(L); paint(); setTimeout(() => setVM("view"), 900); }));

    /* ---------- Work mode vs View mode ---------- */
    const cv = main.querySelector(".caseview");
    const vmKey = "vm-" + location.pathname.split("/").pop();
    function setVM(m) {
      if (!cv) return;
      store.set(vmKey, m);
      body.classList.toggle("view-mode", m === "view");
      document.querySelectorAll("[data-vm]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.vm === m)));
      window.scrollTo(0, 0);
    }
    if (cv) {
      const row = main.querySelector(".pagehead > .row") || main.querySelector(".pagehead");
      row.insertAdjacentHTML("afterbegin", `<span class="modesw" role="group" aria-label="Case mode"><button type="button" data-vm="work">✎ Work mode</button><button type="button" data-vm="view">👁 View mode</button></span>`);
      document.addEventListener("click", (e) => { const b = e.target.closest("[data-vm]"); if (b) { e.preventDefault(); setVM(b.dataset.vm); } });
      const q = new URLSearchParams(location.search).get("view");
      const def = q === "1" ? "view" : q === "0" ? "work" : store.get(vmKey, getL().__ir ? "view" : (body.dataset.defaultMode || "work"));
      setVM(def);
    }
  }

  /* ---------- Round 7: greeting, weather location, photo, Questy tour ---------- */
  const hr = new Date().getHours();
  document.querySelectorAll("[data-greet]").forEach((el) => { el.textContent = hr < 5 ? "Burning the midnight oil" : hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening"; });

  function wxLoc() { try { return JSON.parse(store.get("wx-loc", "")) ; } catch (e) { return { n: "Springfield, MA", lat: 42.1, lon: -72.59 }; } }
  const ST = { Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC" };
  function geoLookup(q) {
    const [city, st] = q.split(",").map((x) => x.trim());
    return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json&countryCode=US`)
      .then((r) => r.json()).then((j) => {
        let r = (j.results || []);
        if (st) r = r.filter((x) => (ST[x.admin1] || "").toLowerCase() === st.toLowerCase() || (x.admin1 || "").toLowerCase() === st.toLowerCase());
        if (!r.length) throw new Error("not found");
        const x = r[0]; return { n: `${x.name}, ${ST[x.admin1] || x.admin1 || ""}`, lat: x.latitude, lon: x.longitude };
      });
  }
  function locForm(host, done) {
    if (host.querySelector(".wlocf")) return;
    host.insertAdjacentHTML("beforeend", `<form class="wlocf"><b>📍 Where are you working today?</b><input placeholder="City, state (e.g. Austin, TX) or ZIP" aria-label="City or ZIP" />
      <span class="row"><button class="btn sm pri">Set</button><button type="button" class="btn sm" data-wgeo>Use my location</button><button type="button" class="btn sm" data-wcancel>Cancel</button></span><small class="err"></small></form>`);
    const f = host.querySelector(".wlocf"); const err = f.querySelector(".err"); f.querySelector("input").focus();
    const save = (L) => { store.set("wx-loc", JSON.stringify(L)); done(); };
    f.addEventListener("submit", (e) => { e.preventDefault(); err.textContent = "Looking…"; geoLookup(f.querySelector("input").value).then(save).catch(() => { err.textContent = "Couldn't find that. Try \"City, ST\"."; }); });
    f.querySelector("[data-wcancel]").addEventListener("click", () => f.remove());
    f.querySelector("[data-wgeo]").addEventListener("click", () => {
      if (!navigator.geolocation) { err.textContent = "Location isn't available in this browser."; return; }
      err.textContent = "Asking your browser…";
      navigator.geolocation.getCurrentPosition((pos) => save({ n: "My location", lat: +pos.coords.latitude.toFixed(2), lon: +pos.coords.longitude.toFixed(2) }), () => { err.textContent = "Location blocked. Type a city instead."; });
    });
  }
  document.querySelectorAll("[data-loc-show]").forEach((el) => { el.textContent = wxLoc().n; });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-loc-edit]"); if (!b) return;
    locForm(b.closest(".box") || b.parentElement, () => { document.querySelectorAll("[data-loc-show]").forEach((el) => { el.textContent = wxLoc().n; }); const f = document.querySelector(".box .wlocf"); if (f) f.remove(); });
  });

  // Profile photo: resized in the browser, saved with your profile (server in production).
  const photoKey = "photo-" + store.get("me", "anon");
  const paintPhoto = () => { const src = store.get(photoKey, ""); document.querySelectorAll(".avatar, [data-my-photo]").forEach((im) => { im.src = src || "icons/profile.png"; im.classList.toggle("has-photo", !!src); }); };
  paintPhoto();
  document.addEventListener("change", (e) => {
    if (!e.target.matches("[data-photo-up]")) return;
    const file = e.target.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => { const im = new Image(); im.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = 160; const s = Math.min(im.width, im.height);
      c.getContext("2d").drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, 160, 160);
      try { store.set(photoKey, c.toDataURL("image/jpeg", 0.85)); } catch (x) { alert("That photo is too big. Try a smaller one."); }
      paintPhoto();
    }; im.src = rd.result; };
    rd.readAsDataURL(file);
  });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-photo-rm]")) { store.set(photoKey, ""); paintPhoto(); } });

  // Questy walkthrough: runs once per page, can be skipped, replay from settings or the name menu.
  const tourPage = current;
  const tourIntro = {
    home: "Hi, I'm <b>Questy</b>! Welcome to your home dashboard. I'll walk every feature on this page once.",
    workstation: "Welcome to the <b>case workstation</b>! I'll walk each feature without duplicates.",
    queue: "Welcome to <b>My cases</b>. I'll show each table area and action.",
    tools: "Welcome to <b>Tools hub</b>. I'll walk each tool area quickly.",
    profile: "Welcome to <b>Profile & settings</b>. I'll show every section once.",
  };
  const cap = (x) => x.replace(/\s+/g, " ").trim();
  const visibleEl = (el) => el && el.getClientRects && el.getClientRects().length && getComputedStyle(el).visibility !== "hidden";
  const featureLabel = (el) => {
    if (el.matches(".hero")) return "Hero dashboard";
    if (el.matches(".caseview")) return "View mode summary";
    if (el.matches(".drawer")) return "Case output drawer";
    if (el.matches(".tabs")) return "Stage tabs";
    if (el.matches("nav.subnav")) return "Workbench tabs";
    if (el.matches("table.wf")) return cap((el.closest("section,div,aside")?.querySelector("h3,h2")?.textContent || "Data table"));
    const h = el.querySelector(":scope > header > h3, :scope > h3, :scope > h2, :scope > h1");
    if (h) return cap(h.textContent.replace(/\d+$/,""));
    if (el.matches(".pagehead")) return "Page header";
    if (el.matches(".tool-layout")) return "Tool workspace";
    if (el.matches(".box.kpi")) return cap(el.textContent.split("\n").slice(0,2).join(" "));
    return "";
  };
  const buildTour = () => {
    const steps = [[null, tourIntro[tourPage] || `Welcome to <b>${cap(document.title.replace(/^WF\s*·\s*/,""))}</b>. I'll walk each feature on this page once.`]];
    const add = (sel, txt, key, seen) => { const el = document.querySelector(sel); if (!visibleEl(el) || seen.has(key)) return; seen.add(key); steps.push([sel, txt]); };
    const seen = new Set();
    add(".sidenav", "This is your <b>navigation</b>. You can keep side nav or switch to top nav in Customize.", "nav", seen);
    add(".search", "Use <b>Search</b> to find tools, steps, forms, and references fast.", "search", seen);
    add(".timer", "This <b>timer</b> tracks case work time by stage.", "timer", seen);
    add(".modesw", "Switch between <b>Work mode</b> and <b>View mode</b> here.", "mode", seen);
    add("[data-hero-widget]", "Your <b>widget area</b>: weather, Questy pep talks, breathing, and pop-the-NIGO.", "widget", seen);

    const feats = [...main.querySelectorAll(".hero, .caseview, .tabs, .drawer, .tool-layout, nav.subnav, section.box, aside.box, table.wf, .box.kpi")]
      .filter((el) => visibleEl(el) && !el.closest(".notes") && !el.classList.contains("wf-extra"));
    feats.forEach((el) => {
      const label = featureLabel(el);
      if (!label) return;
      const key = label.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const sel = `[data-tour-id="${seen.size}"]`;
      el.setAttribute("data-tour-id", String(seen.size));
      steps.push([sel, `<b>${label}</b>: this is part of your workflow on this page.`]);
    });

    add(".me", "Open your <b>profile menu</b> for settings, photo, and replay tour.", "profilemenu", seen);
    add(".qbot-fab", "Click <b>Ask Questy</b> anytime for quick guidance and Quest links.", "qbot", seen);
    steps.push([null, "Tour done! Use <b>Replay the Questy tour</b> anytime from your profile menu or settings."]);
    return steps;
  };
  const runTour = () => {
    const steps = buildTour(); let i = 0;
    const veil = document.createElement("div"); veil.className = "tour-veil";
    const card = document.createElement("div"); card.className = "tour-card"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", "Questy tour");
    document.body.append(veil, card);
    let hi = null;
    const end = (skip) => { if (hi) hi.classList.remove("tour-hi", "tour-rel"); veil.remove(); card.remove(); store.set("tour-" + tourPage, "done"); if (skip) store.set("tour-off", "yes"); document.querySelectorAll("[data-tour-id]").forEach((x) => x.removeAttribute("data-tour-id")); };
    const show = () => {
      if (hi) hi.classList.remove("tour-hi", "tour-rel");
      const [sel, txt] = steps[i]; hi = sel ? document.querySelector(sel) : null;
      card.innerHTML = `<img src="icons/questy-headset-custom.svg" alt="" /><div><p>${txt}</p><div class="row"><small class="muted">${i + 1} of ${steps.length}</small><span style="flex:1"></span>
        ${i < steps.length - 1 ? `<button type="button" class="btn sm" data-tskip>Skip tutorial</button>` : ""}${i ? `<button type="button" class="btn sm" data-tback>Back</button>` : ""}
        <button type="button" class="btn sm pri" data-tnext>${i === 0 ? "Let's go!" : i === steps.length - 1 ? "Finish" : "Next ?"}</button></div></div>`;
      veil.classList.toggle("solid", !hi);
      if (hi) {
        if (getComputedStyle(hi).position === "static") hi.classList.add("tour-rel");
        hi.classList.add("tour-hi"); hi.scrollIntoView({ block: "center", behavior: "instant" });
        const r = hi.getBoundingClientRect(); const below = r.bottom + 220 < innerHeight;
        card.style.top = Math.max(10, below ? r.bottom + 12 : r.top - card.offsetHeight - 12) + "px";
        card.style.left = Math.min(innerWidth - 400, Math.max(10, r.left)) + "px"; card.classList.remove("center");
      } else { card.style.top = ""; card.style.left = ""; card.classList.add("center"); }
      card.querySelector("[data-tnext]").focus();
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-tskip]")) end(true);
      else if (e.target.closest("[data-tback]")) { i -= 1; show(); }
      else if (e.target.closest("[data-tnext]")) { if (i === steps.length - 1) end(false); else { i += 1; show(); } }
    });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape" && card.isConnected) { end(true); document.removeEventListener("keydown", k); } });
    show();
  };
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-tour-replay]")) return;
    e.preventDefault(); store.set("tour-off", ""); store.set("tour-" + tourPage, ""); runTour();
  });
  const forceTour = new URLSearchParams(location.search).get("tour") === "1";
  if (tourPage && (forceTour || (store.get("tour-off", "") !== "yes" && store.get("tour-" + tourPage, "") !== "done"))) setTimeout(runTour, 600);
})();