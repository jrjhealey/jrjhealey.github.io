/* ============================================================
   Zephyr Venturecraft — interactions
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     NAV — scroll state + mobile toggle
  ---------------------------------------------------------- */
  var nav = document.querySelector(".nav");
  var navIsDark = nav && nav.classList.contains("nav--dark"); // about page = always dark
  function onScrollNav() {
    if (!nav || navIsDark) return;
    if (window.scrollY > 40) nav.classList.add("is-solid");
    else nav.classList.remove("is-solid");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  var toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
    });
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  /* ----------------------------------------------------------
     REVEAL on scroll
  ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----------------------------------------------------------
     COUNT-UP stats
  ---------------------------------------------------------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count"));
        var dur = 1500, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0) ? Math.round(val) : val.toFixed(0);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ----------------------------------------------------------
     TIMELINE progress + dot activation (about page)
  ---------------------------------------------------------- */
  var timeline = document.querySelector(".timeline");
  if (timeline) {
    var progress = timeline.querySelector(".timeline__progress");
    var items = timeline.querySelectorAll(".tl-item");
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.4 });
    items.forEach(function (it) { tio.observe(it); });
    function tlProgress() {
      if (!progress) return;
      var r = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = r.height;
      var seen = Math.min(Math.max(vh * 0.55 - r.top, 0), total);
      progress.style.height = seen + "px";
    }
    window.addEventListener("scroll", tlProgress, { passive: true });
    tlProgress();
  }

  /* ----------------------------------------------------------
     PARALLAX image band
  ---------------------------------------------------------- */
  var bandMedia = document.querySelectorAll("[data-parallax]");
  if (bandMedia.length && !reduceMotion) {
    function parallax() {
      bandMedia.forEach(function (m) {
        var r = m.parentElement.getBoundingClientRect();
        var vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        var prog = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5-ish
        m.style.transform = "translateY(" + (prog * -34) + "px)";
      });
    }
    window.addEventListener("scroll", parallax, { passive: true });
    parallax();
  }

  /* ----------------------------------------------------------
     TILT cards (service / credential)
  ---------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover:hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var max = 6;
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = "translateY(-6px) perspective(900px) rotateY(" + (px * max) + "deg) rotateX(" + (-py * max) + "deg)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ----------------------------------------------------------
     WHATSAPP — obfuscated number, deferred reveal
  ---------------------------------------------------------- */
  var wa = document.querySelector(".wa");
  if (wa) {
    // Dummy number — char codes for "447700900123" (UK placeholder). Replace before launch.
    var code = [52,52,55,55,48,48,57,48,48,49,50,51];
    var num = code.map(function (c) { return String.fromCharCode(c); }).join("");
    var msg = encodeURIComponent("Hi Joe — I came across Zephyr Venturecraft and would love to chat.");
    wa.setAttribute("href", "https://wa.me/" + num + "?text=" + msg);
    wa.setAttribute("target", "_blank");
    wa.setAttribute("rel", "noopener");
    setTimeout(function () { wa.classList.add("in"); }, 1100);
  }

  /* ----------------------------------------------------------
     Year stamp
  ---------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----------------------------------------------------------
     MAGNETIC buttons — gentle pull toward the cursor
  ---------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover:hover)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 0.28, R = 90;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = e.clientX - cx, dy = e.clientY - cy;
        if (Math.hypot(dx, dy) < r.width / 2 + R) {
          el.style.transform = "translate(" + (dx * strength) + "px," + (dy * strength) + "px)";
        }
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ============================================================
     WIND PARTICLE FIELD — hero canvas (cursor-deflected flow)
  ============================================================ */
  function initWind(canvas) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [], t = 0;
    var pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var target = Math.max(180, Math.min(400, Math.round(W / 7)));
      buildParticles(target);
      ctx.fillStyle = "#f8f3ea";
      ctx.fillRect(0, 0, W, H);
    }
    function buildParticles(n) { particles = []; for (var i = 0; i < n; i++) particles.push(makeParticle()); }
    function makeParticle() {
      return { x: Math.random() * W, y: Math.random() * H, speed: 0.5 + Math.random() * 1.3,
        life: Math.random() * 240, maxLife: 180 + Math.random() * 220, hue: Math.random() };
    }
    function smooth(e0, e1, x) { var v = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return v * v * (3 - 2 * v); }
    function flowAngle(x, y) {
      var s1 = 0.0016, s2 = 0.0039;
      var a = Math.sin(x * s1 + t * 0.00022) * Math.cos(y * s1 * 1.3 - t * 0.00017);
      var b = Math.sin((x + y) * s2 - t * 0.0003) * 0.5;
      return (a + b) * 0.9 + 0.12;
    }
    function step() {
      t += 16;
      ctx.fillStyle = "rgba(248,243,234,0.38)";
      ctx.fillRect(0, 0, W, H);
      pointer.vx *= 0.9; pointer.vy *= 0.9;
      var pSpeed = Math.hypot(pointer.vx, pointer.vy);
      var travelAngle = Math.atan2(pointer.vy, pointer.vx);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var ang = flowAngle(p.x, p.y);
        if (pointer.active) {
          var dx = p.x - pointer.x, dy = p.y - pointer.y, dist = Math.hypot(dx, dy), R = 230;
          if (dist < R) {
            var fall = 1 - smooth(0, R, dist);
            if (pSpeed > 0.4) {
              var diff = Math.atan2(Math.sin(travelAngle - ang), Math.cos(travelAngle - ang));
              ang += diff * fall * 0.6;
            }
            var inner = 1 - smooth(0, R * 0.5, dist);
            if (inner > 0 && dist > 0.001) { p.x += (dx / dist) * inner * 1.6; p.y += (dy / dist) * inner * 1.6; }
          }
        }
        var nx = p.x + Math.cos(ang) * p.speed, ny = p.y + Math.sin(ang) * p.speed;
        var alpha = 0.5 * smooth(0, 40, p.life) * smooth(p.maxLife, p.maxLife - 60, p.life);
        var col;
        if (p.hue > 0.82) col = "rgba(160,98,42," + (alpha * 0.9).toFixed(3) + ")";
        else if (p.hue > 0.5) col = "rgba(36,80,56," + (alpha * 0.8).toFixed(3) + ")";
        else col = "rgba(14,34,24," + (alpha * 0.55).toFixed(3) + ")";
        ctx.strokeStyle = col;
        ctx.lineWidth = p.hue > 0.82 ? 1.4 : 1.0;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        ctx.fillStyle = col; ctx.fillRect(nx, ny, 1.1, 1.1);
        p.x = nx; p.y = ny; p.life++;
        if (p.life > p.maxLife || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
          Object.assign(p, makeParticle()); p.life = 0;
          if (Math.random() < 0.5) { p.x = -10; p.y = Math.random() * H; }
        }
      }
      requestAnimationFrame(step);
    }
    function moveFromEvent(cx, cy) {
      var rect = canvas.getBoundingClientRect();
      var x = cx - rect.left, y = cy - rect.top;
      if (pointer.x < -9000) { pointer.x = x; pointer.y = y; }
      var newx = pointer.x * 0.82 + x * 0.18, newy = pointer.y * 0.82 + y * 0.18;
      pointer.vx = pointer.vx * 0.82 + (newx - pointer.x) * 0.18 * 8;
      pointer.vy = pointer.vy * 0.82 + (newy - pointer.y) * 0.18 * 8;
      pointer.x = newx; pointer.y = newy; pointer.active = true;
    }
    window.addEventListener("mousemove", function (e) { moveFromEvent(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener("mouseout", function () { pointer.active = false; });
    canvas.addEventListener("touchmove", function (e) { if (e.touches[0]) moveFromEvent(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(step);
  }

  /* ============================================================
     VERTICAL DNA HELIX — slow idle revolution, cursor-reactive.
     Renders one or more upright double helices that revolve about
     their vertical axis; cursor nudges spin speed/direction and
     bends nearby strands. For <canvas data-helix> in dark sections.
  ============================================================ */
  function initHelixCol(cv) {
    var ctx = cv.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, running = false, raf = null;
    var rot = 0, rotVel = 0.004;
    var BASE = 0.004;                 // slow idle revolution (rad / frame)
    var ptr = { x: -9999, y: -9999, active: false };

    function size() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    // centreline snakes from top-right to bottom-left in a soft S
    function center(u) {
      return [
        (0.82 - 0.64 * u) * W + Math.sin(u * Math.PI * 2) * (W * 0.13),
        -30 + (H + 60) * u
      ];
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      // slow idle spin; cursor nudges it only slightly (background element)
      var target = BASE;
      if (ptr.active) target = BASE + ((ptr.x - W / 2) / (W / 2)) * 0.012;
      rotVel += (target - rotVel) * 0.04;
      rot += rotVel;

      var N = 180, r = Math.min(40, Math.max(20, W * 0.032)), twists = 8;
      var A = [], B = [], i, u, c, c2, tx, ty, tl, nx, ny, cx, cy, phi, g, d;
      for (i = 0; i <= N; i++) {
        u = i / N;
        c = center(u); c2 = center(u + 0.001);
        tx = c2[0] - c[0]; ty = c2[1] - c[1];
        tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        nx = -ty; ny = tx;                              // unit normal to path
        cx = c[0]; cy = c[1];
        if (ptr.active) {                               // gentle local bend toward cursor
          d = Math.hypot(cx - ptr.x, cy - ptr.y);
          g = Math.exp(-(d * d) / (2 * 180 * 180));
          cx += (ptr.x - cx) * 0.06 * g; cy += (ptr.y - cy) * 0.06 * g;
        }
        phi = u * twists * Math.PI * 2 + rot;
        A.push([cx + nx * Math.cos(phi) * r, cy + ny * Math.cos(phi) * r, Math.sin(phi)]);
        B.push([cx + nx * Math.cos(phi + Math.PI) * r, cy + ny * Math.cos(phi + Math.PI) * r, Math.sin(phi + Math.PI)]);
      }
      strokeBackbone(A); strokeBackbone(B);
      for (i = 0; i < A.length; i += 5) {               // sparse base pairs
        var a = A[i], b = B[i];
        var zavg = (a[2] + b[2]) / 2;
        var da = 0.16 + ((zavg + 1) / 2) * 0.40;
        var copper = (i % 15 === 0);
        ctx.strokeStyle = copper
          ? "rgba(192,124,62," + (da * 0.95).toFixed(3) + ")"
          : "rgba(143,183,161," + (da * 0.6).toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        atom(a, copper); atom(b, copper);
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    function strokeBackbone(pts) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(143,183,161,0.18)";
      ctx.beginPath();
      for (var i = 0; i < pts.length; i++) { i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); }
      ctx.stroke();
    }
    function atom(pt, copper) {
      var z = pt[2];
      var rr = 1.2 + ((z + 1) / 2) * 2.2;               // nearer atoms larger
      var alpha = Math.min(1, 0.22 + ((z + 1) / 2) * 0.5);
      ctx.fillStyle = copper ? "rgba(224,201,168," + alpha.toFixed(3) + ")"
        : "rgba(234,245,237," + (alpha * 0.85).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(pt[0], pt[1], rr, 0, Math.PI * 2); ctx.fill();
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    var hostEl = cv.closest("section") || cv.parentElement || cv;
    hostEl.addEventListener("mousemove", function (e) {
      var r = cv.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.active = true;
    }, { passive: true });
    hostEl.addEventListener("mouseleave", function () { ptr.active = false; });
    window.addEventListener("resize", size);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: 0.02 }).observe(cv);
    } else { start(); }
    size();
  }

  /* ============================================================
     CONTINUOUS DNA STRAND — one canvas per lower section, each
     drawn behind its own content. All canvases share a global
     coordinate space + clock, so the helix reads as a single strand
     snaking down the page along an S curve that oscillates back and
     forth; colour/contrast flips to suit each section's theme.
  ============================================================ */
  function initStrandSeg(cv) {
    var ctx = cv.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    var sec = cv.parentElement;
    var dark = sec.getAttribute("data-theme") === "dark";
    var W = 0, Hs = 0, docTop = 0, gTop = 0, gH = 1, running = false, raf = null;

    function metrics() {
      W = sec.clientWidth; Hs = sec.offsetHeight;
      cv.width = Math.round(W * DPR); cv.height = Math.round(Hs * DPR);
      cv.style.width = W + "px"; cv.style.height = Hs + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // global extent across all themed sections (document coords)
      var secs = document.querySelectorAll("section[data-theme]");
      var minT = Infinity, maxB = -Infinity;
      for (var i = 0; i < secs.length; i++) {
        var r = secs[i].getBoundingClientRect();
        var top = r.top + window.scrollY, bot = top + r.height;
        if (top < minT) minT = top;
        if (bot > maxB) maxB = bot;
      }
      gTop = minT; gH = Math.max(1, maxB - minT);
      docTop = sec.getBoundingClientRect().top + window.scrollY;
    }
    // static weaving path (no time-based sway)
    function centerX(gYN) { return W * 0.5 + Math.sin(gYN * Math.PI * 2.6) * (W * 0.24); }
    // taper the strand in over the first ~260px so it fades in rather than starting bluntly
    function fadeAt(gY) { var v = Math.max(0, Math.min(1, gY / 260)); return v * v * (3 - 2 * v); }

    function frame() {
      ctx.clearRect(0, 0, W, Hs);
      var rot = performance.now() * 0.0012;     // helix twist (rotation only)
      var step = 9, baseRad = Math.min(40, Math.max(18, W * 0.03)), twist = 0.032;
      var prevA = null, prevB = null;
      for (var y = -10; y <= Hs + 10; y += step) {
        var gY = (docTop - gTop) + y;            // position along the whole strand
        var gYN = gY / gH;
        var fade = fadeAt(gY);
        var rad = baseRad * (0.2 + 0.8 * fade);  // narrows toward the tapered tip
        var cx = centerX(gYN), cx2 = centerX((gY + 1) / gH);
        var tx = cx2 - cx, ty = 1, tl = Math.hypot(tx, ty); tx /= tl; ty /= tl;
        var nx = -ty, ny = tx;
        var phi = gY * twist + rot;
        var ax = cx + nx * Math.cos(phi) * rad, ay = y + ny * Math.cos(phi) * rad, az = Math.sin(phi);
        var bx = cx + nx * Math.cos(phi + Math.PI) * rad, by = y + ny * Math.cos(phi + Math.PI) * rad, bz = Math.sin(phi + Math.PI);
        if (prevA && fade > 0.002) {
          var ba = (dark ? 0.22 : 0.20) * fade;
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = dark ? "rgba(143,183,161," + ba.toFixed(3) + ")" : "rgba(36,80,56," + ba.toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(prevA[0], prevA[1]); ctx.lineTo(ax, ay); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(prevB[0], prevB[1]); ctx.lineTo(bx, by); ctx.stroke();
        }
        var gi = Math.round(gY / step);
        if (gi % 4 === 0 && fade > 0.002) {       // sparse base pairs (continuous across sections)
          var zavg = (az + bz) / 2, da = (0.16 + ((zavg + 1) / 2) * 0.4) * fade;
          var copper = (gi % 16 === 0);
          if (copper) ctx.strokeStyle = "rgba(" + (dark ? "192,124,62" : "160,98,42") + "," + da.toFixed(3) + ")";
          else ctx.strokeStyle = dark ? "rgba(143,183,161," + (da * 0.6).toFixed(3) + ")" : "rgba(53,107,76," + (da * 0.55).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          atom(ax, ay, az, copper, fade); atom(bx, by, bz, copper, fade);
        }
        prevA = [ax, ay]; prevB = [bx, by];
      }
      if (running) raf = requestAnimationFrame(frame);
    }
    function atom(x, y, z, copper, fade) {
      var rr = (1.2 + ((z + 1) / 2) * 2.0) * (0.4 + 0.6 * fade);
      var alpha = Math.min(1, (0.22 + ((z + 1) / 2) * 0.5) * fade);
      if (copper) ctx.fillStyle = "rgba(" + (dark ? "224,201,168" : "160,98,42") + "," + alpha.toFixed(3) + ")";
      else ctx.fillStyle = dark ? "rgba(234,245,237," + (alpha * 0.85).toFixed(3) + ")" : "rgba(36,80,56," + (alpha * 0.75).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    window.addEventListener("resize", metrics);
    window.addEventListener("load", metrics);
    if ("ResizeObserver" in window) new ResizeObserver(metrics).observe(sec);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: 0 }).observe(sec);
    } else { start(); }
    metrics();
  }

  /* ---------- boot canvases ---------- */
  if (!reduceMotion) {
    var heroCv = document.getElementById("wind");
    if (heroCv) initWind(heroCv);
    document.querySelectorAll("canvas[data-helix]").forEach(initHelixCol);
    document.querySelectorAll("canvas[data-strand]").forEach(initStrandSeg);
  } else {
    var hCv = document.getElementById("wind");
    if (hCv) hCv.style.display = "none";
    document.querySelectorAll("canvas[data-helix], canvas[data-strand]").forEach(function (cv) { cv.style.display = "none"; });
  }
})();

/* ============================================================
   COOKIE CONSENT + GOOGLE ANALYTICS (GA4) — Consent Mode v2
   The tag loads on every page but analytics storage defaults to
   "denied": no cookies or identifiers until the visitor accepts.
   ============================================================ */
(function () {
  "use strict";
  var GA_ID = "G-QTPLVTTCT8";
  var KEY = "zvc-consent";
  var banner = null;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  /* Consent Mode v2 — everything denied by default until a choice is made */
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  /* Load the Google tag (present but suppressed until consent is granted) */
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", GA_ID);

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function apply(v) {
    gtag("consent", "update", { analytics_storage: v === "granted" ? "granted" : "denied" });
  }

  function decide(v) {
    store(v);
    apply(v);
    if (banner) banner.classList.remove("in");
  }

  function showBanner() {
    if (banner) { banner.classList.add("in"); return; }
    banner = document.createElement("div");
    banner.className = "cc";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie notice");
    banner.innerHTML =
      '<p class="cc__text">This site uses cookies to measure traffic with Google Analytics. They’re only set if you accept. See our <a href="privacy.html">privacy &amp; cookie notice</a>.</p>' +
      '<div class="cc__actions">' +
        '<button class="cc__btn cc__btn--ghost" type="button" data-cc="denied">Decline</button>' +
        '<button class="cc__btn cc__btn--accept" type="button" data-cc="granted">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.addEventListener("click", function (e) {
      var t = e.target.closest("[data-cc]");
      if (t) decide(t.getAttribute("data-cc"));
    });
    requestAnimationFrame(function () { banner.classList.add("in"); });
  }

  /* footer link to review / change the choice later */
  function addFooterLink() {
    var nav = document.querySelector(".footer__links");
    if (!nav) return;
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = "Cookie settings";
    a.addEventListener("click", function (e) { e.preventDefault(); showBanner(); });
    nav.appendChild(a);
  }

  var choice = read();
  if (choice === "granted") apply("granted");
  else if (choice !== "denied") showBanner();
  addFooterLink();
})();
