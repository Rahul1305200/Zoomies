/* =====================================================================
   Zoomies — element-level fade-in
   ---------------------------------------------------------------------
   Sections never animate. They render in place, at full opacity, on first
   paint (responsive.css neutralises `.reveal`). What animates is the
   CONTENT inside each section, staggered, as the section comes into view.

   Deliberate constraints:
   - Only elements whose computed transform is `none` are tagged. Several
     things on this site carry their own transform (the tilted stickers,
     the blob heroes, the scaled "best value" card, the bobbing footer
     dog). Animating `transform` on those would wipe out the rotation, so
     they are skipped and simply stay put.
   - Nested candidates are collapsed to a single flat layer, so a card and
     the paragraph inside it never both animate.
   - Header/nav is excluded; it is chrome, not content.
   - `.fade-in` elements already have a load animation of their own.
   ===================================================================== */
(function () {
  var STAGGER = 0.07;   /* seconds between siblings */
  var MAX_STEPS = 8;    /* stop compounding after this many in one section */

  var SEL = [
    ".eyebrow", "h1", "h2", "h3", "h4", "p", "ul", "ol",
    ".btn", "img",
    "[class*='-card']", "[class*='-item']", "[class*='-cell']", "[class*='-row']",
    ".wavy-photo", ".hero-media", ".map-frame", ".reach-map",
    ".vs-side", ".faq-item", ".contact-hero-art", ".book-sticker"
  ].join(",");

  function run() {
    var groups = document.querySelectorAll("section, footer");
    if (!groups.length) return;

    var all = [];

    groups.forEach(function (group) {
      if (group.closest("header")) return;

      var found = Array.prototype.slice.call(group.querySelectorAll(SEL));

      /* collapse to one flat layer: drop anything that sits inside
         another candidate, so a card and its own text don't both fire */
      var flat = found.filter(function (el) {
        return !found.some(function (other) {
          return other !== el && other.contains(el);
        });
      });

      var step = 0;
      flat.forEach(function (el) {
        if (el.closest("header")) return;
        if (el.classList.contains("fade-in")) return;      /* has its own load anim */
        if (el.classList.contains("zr")) return;           /* already tagged */
        /* never clobber an element's own transform */
        var t = getComputedStyle(el).transform;
        if (t && t !== "none") return;
        /* skip things with no box to animate */
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;

        el.classList.add("zr");
        el.style.setProperty("--zr-delay", (Math.min(step, MAX_STEPS) * STAGGER).toFixed(2) + "s");
        step++;
        all.push(el);
      });
    });

    if (!all.length) return;

    /* Everything is now hidden with no transition attached. Force a reflow so
       that state is committed, then arm the transition — otherwise the browser
       coalesces both changes and animates the hide as well as the reveal. */
    void document.documentElement.offsetHeight;
    document.documentElement.classList.add("zr-armed");

    if (!("IntersectionObserver" in window)) {
      all.forEach(function (el) { el.classList.add("zr-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("zr-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    all.forEach(function (el) { io.observe(el); });

    /* Fallback sweep.
       IntersectionObserver callbacks are not delivered while a page is not
       being painted — a background tab, a restored session, or this preview
       runtime scrolling inside a nested container. Relying on the observer
       alone can therefore leave whole sections permanently invisible, which
       is far worse than losing the animation. A cheap throttled scroll
       listener guarantees content always appears; it detaches itself once
       everything has been revealed. */
    function sweep() {
      var pending = false;
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.classList.contains("zr-in")) continue;
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight - 40 && r.bottom > 0) el.classList.add("zr-in");
        else pending = true;
      }
      if (!pending) {
        removeEventListener("scroll", onScroll);
        removeEventListener("resize", onScroll);
      }
    }
    var last = 0, timer = null;
    function onScroll() {
      var now = Date.now();
      if (now - last > 100) { last = now; sweep(); }
      else if (!timer) { timer = setTimeout(function () { timer = null; last = Date.now(); sweep(); }, 100); }
    }
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    setTimeout(sweep, 90);
  }

  /* =====================================================================
     Back to top — reveal once the reader passes 70% of the page
     ---------------------------------------------------------------------
     Site-wide, so it lives here rather than in each page's own script.
     responsive.css floats the button and starts it hidden; this only
     toggles `.is-visible`. Short pages that cannot scroll 70% never show
     it, which is correct — there is nothing to go back up to.
     ===================================================================== */
  var TOP_AT = 0.7;

  function wireToTop() {
    var btn = document.getElementById("to-top");
    if (!btn || btn.dataset.topWired) return;
    btn.dataset.topWired = "1";

    function update() {
      var doc = document.documentElement;
      var max = (doc.scrollHeight || 0) - (window.innerHeight || 0);
      /* guard against a page too short to scroll: max <= 0 would make the
         ratio Infinity/NaN and flash the button on load */
      var past = max > 0 && (window.pageYOffset || doc.scrollTop || 0) / max >= TOP_AT;
      btn.classList.toggle("is-visible", past);
    }

    /* same time-based throttle the sweep above uses — rAF is paused in a
       hidden or background tab, which would strand the button mid-state */
    var lastTop = 0, topTimer = null;
    function onScroll() {
      var now = Date.now();
      if (now - lastTop > 80) { lastTop = now; update(); }
      else if (!topTimer) {
        topTimer = setTimeout(function () { topTimer = null; lastTop = Date.now(); update(); }, 80);
      }
    }
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    update();
  }

  /* the page is rendered by the dc runtime, so wait for it to paint */
  function boot() { setTimeout(run, 60); setTimeout(wireToTop, 80); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  /* re-run once more in case the runtime swapped content in late */
  window.addEventListener("load", function () { setTimeout(run, 120); setTimeout(wireToTop, 140); });
})();
