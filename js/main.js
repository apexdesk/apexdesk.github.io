// ApexDesk website: fills in the measured figures from figures.js, counts
// the big numbers up, grows the comparison bars and fades sections in as they
// come into view, and tilts the hero's windows slightly with the pointer.
// Without JavaScript the pages show the same figures, written into the HTML
// by sync-figures.py.
(function () {
    "use strict";
    var root = document.documentElement;
    root.classList.add("js");
    var F = window.FIGURES || {};
    var lang = root.lang || "en";
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasIO = "IntersectionObserver" in window;

    function format(v, d) {
        // Like sync-figures.py: no grouping below 10 000.
        return new Intl.NumberFormat(lang, { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: v >= 10000 }).format(v);
    }
    function num(key) { var f = F[key]; return Array.isArray(f) ? f : null; }

    var counters = [];
    document.querySelectorAll("[data-fig]").forEach(function (el) {
        var key = el.getAttribute("data-fig");
        var f = num(key);
        if (f) {
            el.textContent = format(f[0], f[1]);
            if (el.classList.contains("count") && !still && hasIO) counters.push({ el: el, v: f[0], d: f[1] });
        } else {
            var s = F[key + "_" + lang] || F[key];
            if (typeof s === "string") el.textContent = s;
        }
    });
    document.querySelectorAll("[data-bar]").forEach(function (el) {
        var v = num(el.getAttribute("data-bar")), max = num(el.getAttribute("data-max"));
        if (!v || !max) return;
        var w = 100 * v[0] / max[0];
        el.style.setProperty("--w", w.toFixed(1) + "%");
        el.classList.toggle("out", w < 22); // same threshold as sync-figures.py
    });

    function count(c) {
        var t0 = null, dur = 1400;
        function step(t) {
            if (t0 === null) t0 = t;
            var p = Math.min(1, (t - t0) / dur);
            c.el.textContent = format(c.v * (1 - Math.pow(1 - p, 4)), c.d);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var collage = document.querySelector(".collage");
    var watched = document.querySelectorAll(".reveal, .compare, .big-figs");
    if (still || !hasIO) {
        if (collage) collage.classList.add("in");
        watched.forEach(function (el) { el.classList.add("in"); });
        return;
    }

    if (collage) {
        // Two frames so the start state is painted before the transition.
        requestAnimationFrame(function () { requestAnimationFrame(function () { collage.classList.add("in"); }); });
        var queued = false, tx = 0;
        window.addEventListener("pointermove", function (e) {
            tx = (e.clientY / window.innerHeight - 0.5) * -4;
            if (!queued) {
                queued = true;
                requestAnimationFrame(function () {
                    queued = false;
                    collage.style.setProperty("--tilt", tx.toFixed(2) + "deg");
                });
            }
        }, { passive: true });
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            e.target.classList.add("in");
            counters.forEach(function (c) {
                if (e.target.contains(c.el)) { c.el.textContent = format(0, c.d); count(c); }
            });
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    watched.forEach(function (el) { io.observe(el); });
})();
