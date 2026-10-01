/* Svetainės skriptai: meniu, kopijavimas, registracijos žinutė. Jokių išorinių bibliotekų. */
(function () {
  "use strict";

  var EMAIL = "emilijajankauskai@gmail.com";

  /* ---------- Mobilus meniu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var mobileNav = document.getElementById("mobile-nav");
  function setMenu(open) {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Uždaryti" : "Meniu";
    mobileNav.hidden = !open;
  }
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileNav.hidden) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---------- Kopijavimas ---------- */
  function fallbackSelect(el) {
    if (!el) return;
    if (el.select) { el.focus(); el.select(); return; }
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function copyText(text, sourceEl, statusEl) {
    function done(msg) { if (statusEl) statusEl.textContent = msg; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { done("Nukopijuota"); },
        function () { fallbackSelect(sourceEl); done("Pažymėta – paspauskite Ctrl+C"); }
      );
    } else {
      fallbackSelect(sourceEl); done("Pažymėta – paspauskite Ctrl+C");
    }
  }
  var copyEmailBtn = document.getElementById("copy-email");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", function () {
      copyText(EMAIL, document.getElementById("email-text"), document.getElementById("copy-status"));
    });
  }

  /* ---------- Registracijos žinutė (tik vardas, telefonas, laikas) ---------- */
  var form = document.getElementById("booking-form");
  if (form) {
    var result = document.getElementById("result");
    var out = document.getElementById("message-out");
    var mailLink = document.getElementById("mail-link");
    var resultStatus = document.getElementById("result-status");

    function showError(id, msg) {
      var el = document.getElementById(id);
      if (el) el.textContent = msg;
      return !!msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["name"].value.trim();
      var phone = form.elements["phone"].value.trim();
      var time = form.elements["time"].value;
      var bad = false;
      bad = showError("name-error", name ? "" : "Įrašykite, kaip jus vadinti.") || bad;
      bad = showError("phone-error", /\d{6,}/.test(phone.replace(/[\s()+-]/g, "")) ? "" : "Įrašykite telefono numerį, kuriuo galime su jumis susisiekti.") || bad;
      if (bad) return;

      var body = "Sveiki,\n\nnoriu užsiregistruoti kineziterapijos konsultacijai.\n\n" +
        "Vardas: " + name + "\nTelefonas: " + phone + "\nPatogiausias laikas: " + time + "\n\nAčiū.";
      out.value = body;
      mailLink.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Registracija kineziterapijos konsultacijai") +
        "&body=" + encodeURIComponent(body);
      result.hidden = false;
      resultStatus.textContent = "Žinutė paruošta. Atidarykite ją el. paštu arba nukopijuokite.";
      result.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    var copyMsg = document.getElementById("copy-message");
    if (copyMsg) {
      copyMsg.addEventListener("click", function () { copyText(out.value, out, resultStatus); });
    }
  }

  /* ---------- Metai poraštėje ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
