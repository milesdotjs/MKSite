/* ==========================================================
   KC TERMINAL — personal utility deck
   Modules: dice / memo / checklist / oracle
   All motion is GSAP-driven; all state persists locally.
   ========================================================== */
(function () {
  "use strict";

  gsap.registerPlugin(ScrambleTextPlugin, Physics2DPlugin, Observer, CustomEase, SplitText);

  CustomEase.create("kc", "M0,0 C0.16,1 0.3,1 1,1");
  CustomEase.create("kcSnap", "M0,0 C0.2,0 0.1,1.12 0.42,1.04 0.66,0.98 0.8,1 1,1");
  gsap.defaults({ ease: "kc" });

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS = "01<>[]/\\#*+=▓▒░";

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };

  /* ==========================================================
     Storage
     Uses localStorage so the deck survives an app relaunch — in an
     iOS home-screen app, sessionStorage is wiped every cold start.
     Swap to window.sessionStorage here if you ever want it amnesiac.
     ========================================================== */
  var BACKING = window.localStorage;
  var KEY = "kc.terminal.v1";

  var state = {
    tab: "dice",
    dice: { sides: 6, count: 2, mod: 0, log: [] },
    memos: [],
    todos: [],
    asks: []
  };

  function load() {
    try {
      var raw = BACKING.getItem(KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        state.tab = saved.tab || state.tab;
        if (saved.dice) Object.assign(state.dice, saved.dice);
        state.memos = Array.isArray(saved.memos) ? saved.memos : [];
        state.todos = Array.isArray(saved.todos) ? saved.todos : [];
        state.asks = Array.isArray(saved.asks) ? saved.asks : [];
      }
    } catch (e) {
      /* corrupt or unavailable storage — start clean rather than break */
    }
  }

  var saveQueued = false;
  function save() {
    if (saveQueued) return;
    saveQueued = true;
    /* batch writes so rapid interactions don't thrash storage */
    requestAnimationFrame(function () {
      saveQueued = false;
      try {
        BACKING.setItem(KEY, JSON.stringify(state));
      } catch (e) {}
    });
  }

  var uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  /* ==========================================================
     Shared feedback: toast + haptics
     ========================================================== */
  var toastEl = $("#toast");
  var toastTl;

  function toast(msg) {
    toastEl.textContent = msg;
    if (toastTl) toastTl.kill();
    toastTl = gsap
      .timeline()
      .set(toastEl, { className: "toast is-on" })
      .fromTo(
        toastEl,
        { yPercent: 40, opacity: 0, scaleX: 0.9 },
        { yPercent: 0, opacity: 1, scaleX: 1, duration: 0.3, ease: "kcSnap" }
      )
      .to(toastEl, { opacity: 0, yPercent: 20, duration: 0.3, delay: 1.5 })
      .set(toastEl, { className: "toast" });
  }

  function buzz(ms) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms || 8);
      } catch (e) {}
    }
  }

  /* Cyan sparks from a point — used on rolls, completions, reveals */
  function burst(x, y, count, color) {
    if (RM) return;
    var frag = document.createDocumentFragment();
    var dots = [];
    for (var i = 0; i < (count || 14); i++) {
      var d = document.createElement("i");
      d.style.cssText =
        "position:fixed;left:" + x + "px;top:" + y + "px;width:4px;height:4px;" +
        "border-radius:50%;pointer-events:none;z-index:80;background:" +
        (color || "#46e6ff") + ";box-shadow:0 0 8px " + (color || "#46e6ff");
      frag.appendChild(d);
      dots.push(d);
    }
    document.body.appendChild(frag);
    gsap.to(dots, {
      duration: 0.9,
      physics2D: { velocity: "random(140, 320)", angle: "random(0, 360)", gravity: 420 },
      opacity: 0,
      scale: 0.3,
      ease: "power1.out",
      onComplete: function () {
        dots.forEach(function (d) {
          d.remove();
        });
      }
    });
  }

  /* Reusable entrance for freshly rendered rows */
  function stagger(nodes, opts) {
    if (RM || !nodes.length) return;
    gsap.from(nodes, Object.assign({
      opacity: 0,
      x: -18,
      duration: 0.4,
      stagger: 0.045,
      clearProps: "opacity,transform"
    }, opts || {}));
  }

  /* ==========================================================
     Boot
     ========================================================== */
  function runBoot() {
    var boot = $("#boot");
    var tl = gsap.timeline();

    if (!RM) {
      tl.from(".boot-mark", { scale: 0.5, opacity: 0, duration: 0.5, ease: "kcSnap" })
        .to(".boot-text", {
          duration: 0.7,
          scrambleText: { text: "KAIBA CORP // SYSTEM ONLINE", chars: GLYPHS, speed: 0.7 }
        }, "-=0.2")
        .to({}, { duration: 0.25 });
    }

    tl.call(function () {
      boot.classList.add("is-done");
      gsap.delayedCall(0.5, function () {
        boot.remove();
      });
      playEntrance();
    });
  }

  function playEntrance() {
    if (RM) return;
    gsap
      .timeline()
      .from(".topbar", { yPercent: -100, opacity: 0, duration: 0.5 })
      .from(".topbar-mark", { rotate: -120, scale: 0, duration: 0.6, ease: "kcSnap" }, "-=0.3")
      .from(".tabbar", { yPercent: 100, duration: 0.5 }, "-=0.5")
      .from(".tab", { opacity: 0, y: 12, stagger: 0.06, duration: 0.35 }, "-=0.25")
      .from(".view.is-active > *", { opacity: 0, y: 26, stagger: 0.08, duration: 0.5 }, "-=0.35");
  }

  /* ==========================================================
     Ambient particle field
     ========================================================== */
  function initParticles() {
    var cv = $("#particles");
    if (!cv || RM) return;
    var ctx = cv.getContext("2d");
    var dots = [];
    var w = 0;
    var h = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    for (var i = 0; i < 34; i++) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.6 + 0.5,
        s: Math.random() * 0.00035 + 0.00012,
        a: Math.random() * 0.5 + 0.2
      });
    }

    /* driven by GSAP's ticker so it pauses with the rest of the timeline */
    gsap.ticker.add(function () {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y -= d.s * 16;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, 6.284);
        ctx.fillStyle = "rgba(120, 226, 255," + d.a + ")";
        ctx.fill();
      }
    });
  }

  /* ==========================================================
     Navigation — tabs, swipe, animated header
     ========================================================== */
  var VIEWS = [
    { id: "dice", title: "DICE ENGINE", sub: "RANDOMIZER MODULE" },
    { id: "memo", title: "MEMO BANK", sub: "DATA ARCHIVE" },
    { id: "list", title: "OBJECTIVES", sub: "TASK PROTOCOL" },
    { id: "ask", title: "ORACLE", sub: "PROBABILITY ENGINE" }
  ];

  var titleEl = $("#view-title");
  var subEl = $("#view-sub");
  var switching = false;

  function showView(id, dir) {
    var meta = VIEWS.filter(function (v) {
      return v.id === id;
    })[0];
    if (!meta || switching) return;

    var current = $(".view.is-active");
    var next = $("#view-" + id);
    if (!next || next === current) return;

    switching = true;
    state.tab = id;
    save();

    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.toggle("is-active", t.dataset.view === id);
    });

    var d = dir || 1;

    if (RM) {
      current.classList.remove("is-active");
      next.classList.add("is-active");
      titleEl.textContent = meta.title;
      subEl.textContent = meta.sub;
      switching = false;
      return;
    }

    gsap
      .timeline({
        onComplete: function () {
          switching = false;
        }
      })
      .to(current, {
        opacity: 0,
        x: -34 * d,
        duration: 0.18,
        onComplete: function () {
          current.classList.remove("is-active");
          gsap.set(current, { clearProps: "all" });
          next.classList.add("is-active");
          next.scrollTop = 0;
        }
      })
      .fromTo(
        next,
        { opacity: 0, x: 34 * d },
        { opacity: 1, x: 0, duration: 0.32 }
      )
      .fromTo(
        next.children,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.06, clearProps: "opacity,transform" },
        "-=0.24"
      )
      .to(titleEl, {
        duration: 0.45,
        scrambleText: { text: meta.title, chars: GLYPHS, speed: 1.4 }
      }, 0)
      .to(subEl, {
        duration: 0.4,
        scrambleText: { text: meta.sub, chars: GLYPHS, speed: 1.4 }
      }, 0.06);
  }

  function initNav() {
    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var from = VIEWS.findIndex(function (v) {
          return v.id === state.tab;
        });
        var to = VIEWS.findIndex(function (v) {
          return v.id === tab.dataset.view;
        });
        buzz(6);
        if (!RM) {
          gsap.fromTo(tab, { scale: 0.86 }, { scale: 1, duration: 0.4, ease: "kcSnap" });
        }
        showView(tab.dataset.view, to > from ? 1 : -1);
      });
    });

    /* horizontal swipe between modules, like a native pager */
    if (!RM) {
      Observer.create({
        target: ".views",
        type: "touch,pointer",
        tolerance: 60,
        preventDefault: false,
        onLeft: function () {
          step(1);
        },
        onRight: function () {
          step(-1);
        }
      });
    }

    function step(delta) {
      var i = VIEWS.findIndex(function (v) {
        return v.id === state.tab;
      });
      var n = i + delta;
      if (n < 0 || n >= VIEWS.length) return;
      buzz(6);
      showView(VIEWS[n].id, delta);
    }
  }

  /* Header clock */
  function initClock() {
    var el = $("#clock");
    function tick() {
      var d = new Date();
      el.textContent =
        String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    }
    tick();
    setInterval(tick, 20000);
  }

  /* ==========================================================
     MODULE 1 — Dice
     ========================================================== */
  var DIE_TYPES = [4, 6, 8, 10, 12, 20, 100];

  function initDice() {
    var segWrap = $("#dice-sides");
    var totalEl = $("#dice-total");
    var formulaEl = $("#dice-formula");
    var facesEl = $("#dice-faces");
    var countEl = $("#dice-count");
    var modEl = $("#dice-mod");
    var rollBtn = $("#dice-roll");

    DIE_TYPES.forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "seg";
      b.textContent = "d" + n;
      b.dataset.sides = String(n);
      b.addEventListener("click", function () {
        state.dice.sides = n;
        syncConfig();
        save();
        buzz(6);
        gsap.fromTo(b, { scale: 0.8 }, { scale: 1, duration: 0.45, ease: "kcSnap" });
      });
      segWrap.appendChild(b);
    });

    function syncConfig() {
      segWrap.querySelectorAll(".seg").forEach(function (b) {
        b.classList.toggle("is-on", Number(b.dataset.sides) === state.dice.sides);
      });
      countEl.textContent = String(state.dice.count);
      modEl.textContent = (state.dice.mod >= 0 ? "+" : "") + state.dice.mod;
      formulaEl.textContent = formula();
    }

    function formula() {
      var f = state.dice.count + "d" + state.dice.sides;
      if (state.dice.mod) f += (state.dice.mod > 0 ? " + " : " − ") + Math.abs(state.dice.mod);
      return f;
    }

    document.querySelectorAll(".step").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var delta = Number(btn.dataset.delta);
        if (btn.dataset.step === "count") {
          state.dice.count = Math.min(12, Math.max(1, state.dice.count + delta));
        } else {
          state.dice.mod = Math.min(50, Math.max(-50, state.dice.mod + delta));
        }
        syncConfig();
        save();
        buzz(5);
        gsap.fromTo(
          btn.dataset.step === "count" ? countEl : modEl,
          { scale: 1.35, color: "#46e6ff" },
          { scale: 1, color: "#eaf7ff", duration: 0.4, ease: "kcSnap" }
        );
      });
    });

    function roll() {
      if (rollBtn.disabled) return;
      rollBtn.disabled = true;
      buzz(18);

      var rolls = [];
      for (var i = 0; i < state.dice.count; i++) {
        rolls.push(1 + Math.floor(Math.random() * state.dice.sides));
      }
      var sum = rolls.reduce(function (a, b) {
        return a + b;
      }, 0) + state.dice.mod;

      facesEl.innerHTML = "";
      formulaEl.textContent = formula();
      totalEl.classList.remove("is-idle");

      if (RM) {
        totalEl.textContent = String(sum);
        renderFaces(rolls);
        commit(rolls, sum);
        rollBtn.disabled = false;
        return;
      }

      /* spin-up: flicker random values, then land on the real total */
      var spin = { v: 0 };
      totalEl.classList.add("is-rolling");

      gsap
        .timeline({
          onComplete: function () {
            rollBtn.disabled = false;
          }
        })
        .to(spin, {
          v: 1,
          duration: 0.62,
          ease: "none",
          onUpdate: function () {
            var lo = state.dice.count + state.dice.mod;
            var hi = state.dice.count * state.dice.sides + state.dice.mod;
            totalEl.textContent = String(lo + Math.floor(Math.random() * (hi - lo + 1)));
          }
        })
        .call(function () {
          totalEl.classList.remove("is-rolling");
          totalEl.textContent = String(sum);
          renderFaces(rolls);
          commit(rolls, sum);
          var r = totalEl.getBoundingClientRect();
          var crit = rolls.some(function (v) {
            return v === state.dice.sides;
          });
          burst(
            r.left + r.width / 2,
            r.top + r.height / 2,
            crit ? 26 : 14,
            crit ? "#ffcb5c" : "#46e6ff"
          );
          buzz(crit ? 40 : 12);
        })
        .fromTo(
          totalEl,
          { scale: 1.5, filter: "blur(8px)" },
          { scale: 1, filter: "blur(0px)", duration: 0.55, ease: "kcSnap" }
        );
    }

    function renderFaces(rolls) {
      facesEl.innerHTML = "";
      rolls.forEach(function (v) {
        var s = document.createElement("span");
        s.className =
          "face" +
          (v === state.dice.sides ? " is-max" : "") +
          (v === 1 && state.dice.sides > 1 ? " is-min" : "");
        s.textContent = String(v);
        facesEl.appendChild(s);
      });
      if (!RM) {
        gsap.from(facesEl.children, {
          scale: 0,
          rotate: -140,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "kcSnap"
        });
      }
    }

    function commit(rolls, sum) {
      state.dice.log.unshift({ f: formula(), r: rolls.join(" · "), v: sum });
      state.dice.log = state.dice.log.slice(0, 24);
      save();
      renderLog();
    }

    function renderLog() {
      var ul = $("#dice-log");
      ul.innerHTML = "";
      state.dice.log.forEach(function (e) {
        var li = document.createElement("li");
        var left = document.createElement("span");
        left.textContent = e.f + "  →  " + e.r;
        var right = document.createElement("span");
        right.className = "log-value";
        right.textContent = String(e.v);
        li.append(left, right);
        ul.appendChild(li);
      });
      stagger(ul.children, { x: 0, y: -10, duration: 0.3 });
    }

    rollBtn.addEventListener("click", roll);
    $("#dice-clear").addEventListener("click", function () {
      if (!state.dice.log.length) return;
      var ul = $("#dice-log");
      gsap.to(ul.children, {
        opacity: 0,
        x: 40,
        duration: 0.24,
        stagger: 0.03,
        onComplete: function () {
          state.dice.log = [];
          save();
          renderLog();
        }
      });
      toast("LOG PURGED");
    });

    syncConfig();
    renderLog();
  }

  /* ==========================================================
     MODULE 2 — Memos
     ========================================================== */
  function initMemo() {
    var titleIn = $("#memo-title");
    var bodyIn = $("#memo-body");
    var saveBtn = $("#memo-save");
    var cancelBtn = $("#memo-cancel");
    var listEl = $("#memo-list");
    var emptyEl = $("#memo-empty");
    var countEl = $("#memo-count");
    var editing = null;

    function render() {
      listEl.innerHTML = "";
      countEl.textContent = "(" + state.memos.length + ")";
      emptyEl.hidden = state.memos.length > 0;

      state.memos.forEach(function (m) {
        var li = document.createElement("li");
        li.className = "memo";
        li.dataset.id = m.id;

        var h = document.createElement("h3");
        h.textContent = m.title || "UNTITLED";
        var p = document.createElement("p");
        p.textContent = m.body;
        var t = document.createElement("time");
        t.textContent = new Date(m.at).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        var acts = document.createElement("div");
        acts.className = "memo-actions";
        var edit = document.createElement("button");
        edit.type = "button";
        edit.className = "icon-btn";
        edit.setAttribute("aria-label", "Edit memo");
        edit.textContent = "✎";
        edit.addEventListener("click", function () {
          beginEdit(m);
        });
        var del = document.createElement("button");
        del.type = "button";
        del.className = "icon-btn danger";
        del.setAttribute("aria-label", "Delete memo");
        del.textContent = "✕";
        del.addEventListener("click", function () {
          remove(m.id, li);
        });
        acts.append(edit, del);

        li.append(acts, h, p, t);
        listEl.appendChild(li);
      });

      stagger(listEl.children);
    }

    function beginEdit(m) {
      editing = m.id;
      titleIn.value = m.title;
      bodyIn.value = m.body;
      saveBtn.textContent = "UPDATE";
      cancelBtn.hidden = false;
      var panel = titleIn.closest(".panel");
      panel.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" });
      if (!RM) {
        gsap.fromTo(
          panel,
          { boxShadow: "0 0 0 0 rgba(70,230,255,0)" },
          {
            boxShadow: "0 0 26px 2px rgba(70,230,255,0.45)",
            duration: 0.35,
            yoyo: true,
            repeat: 1
          }
        );
      }
      titleIn.focus();
    }

    function endEdit() {
      editing = null;
      titleIn.value = "";
      bodyIn.value = "";
      saveBtn.textContent = "SAVE";
      cancelBtn.hidden = true;
    }

    function remove(id, node) {
      buzz(14);
      var done = function () {
        state.memos = state.memos.filter(function (m) {
          return m.id !== id;
        });
        if (editing === id) endEdit();
        save();
        render();
        toast("ENTRY DELETED");
      };
      if (RM) return done();
      gsap.to(node, {
        opacity: 0,
        x: 60,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.32,
        onComplete: done
      });
    }

    saveBtn.addEventListener("click", function () {
      var title = titleIn.value.trim();
      var body = bodyIn.value.trim();
      if (!title && !body) {
        gsap.fromTo(
          titleIn,
          { x: -8 },
          { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
        );
        toast("NOTHING TO RECORD");
        return;
      }

      if (editing) {
        state.memos.forEach(function (m) {
          if (m.id === editing) {
            m.title = title;
            m.body = body;
            m.at = Date.now();
          }
        });
        toast("ENTRY UPDATED");
      } else {
        state.memos.unshift({ id: uid(), title: title, body: body, at: Date.now() });
        toast("ENTRY RECORDED");
      }

      buzz(12);
      var r = saveBtn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 12);
      endEdit();
      save();
      render();
    });

    cancelBtn.addEventListener("click", function () {
      endEdit();
      toast("EDIT CANCELLED");
    });

    render();
  }

  /* ==========================================================
     MODULE 3 — Checklist
     ========================================================== */
  function initTodo() {
    var form = $("#todo-form");
    var input = $("#todo-input");
    var listEl = $("#todo-list");
    var emptyEl = $("#todo-empty");
    var progEl = $("#todo-progress");
    var barEl = $("#todo-bar");
    var clearBtn = $("#todo-clear");

    function render() {
      listEl.innerHTML = "";
      state.todos.forEach(function (t) {
        var li = document.createElement("li");
        li.className = "todo" + (t.done ? " is-done" : "");

        var check = document.createElement("button");
        check.type = "button";
        check.className = "todo-check";
        check.setAttribute("aria-pressed", String(!!t.done));
        check.setAttribute("aria-label", "Toggle " + t.text);
        check.textContent = t.done ? "✓" : "";
        check.addEventListener("click", function (ev) {
          toggle(t, li, check, ev);
        });

        var span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = t.text;

        var del = document.createElement("button");
        del.type = "button";
        del.className = "icon-btn danger";
        del.setAttribute("aria-label", "Delete " + t.text);
        del.textContent = "✕";
        del.addEventListener("click", function () {
          remove(t.id, li);
        });

        li.append(check, span, del);
        listEl.appendChild(li);
      });

      syncMeta();
      stagger(listEl.children);
    }

    function syncMeta() {
      var total = state.todos.length;
      var done = state.todos.filter(function (t) {
        return t.done;
      }).length;
      progEl.textContent = done + " / " + total;
      gsap.to(barEl, {
        width: total ? (done / total) * 100 + "%" : "0%",
        duration: RM ? 0 : 0.45
      });
      emptyEl.hidden = total > 0;
      clearBtn.hidden = done === 0;
    }

    function toggle(t, li, check, ev) {
      t.done = !t.done;
      li.classList.toggle("is-done", t.done);
      check.textContent = t.done ? "✓" : "";
      check.setAttribute("aria-pressed", String(t.done));
      save();
      syncMeta();
      buzz(t.done ? 16 : 6);

      if (RM) return;
      gsap.fromTo(check, { scale: 0.6 }, { scale: 1, duration: 0.45, ease: "kcSnap" });
      if (t.done) {
        burst(ev.clientX || 40, ev.clientY || 40, 10);
        gsap.fromTo(
          li.querySelector(".todo-text"),
          { x: 0 },
          { x: 6, duration: 0.18, yoyo: true, repeat: 1 }
        );
      }
    }

    function remove(id, node) {
      buzz(12);
      var done = function () {
        state.todos = state.todos.filter(function (t) {
          return t.id !== id;
        });
        save();
        render();
      };
      if (RM) return done();
      gsap.to(node, {
        opacity: 0,
        x: 60,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        onComplete: done
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) {
        gsap.fromTo(input, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        return;
      }
      state.todos.push({ id: uid(), text: text, done: false });
      input.value = "";
      save();
      render();
      buzz(10);
      /* keep the keyboard up for rapid entry */
      input.focus();
    });

    clearBtn.addEventListener("click", function () {
      var doomed = Array.prototype.filter.call(listEl.children, function (li) {
        return li.classList.contains("is-done");
      });
      var done = function () {
        state.todos = state.todos.filter(function (t) {
          return !t.done;
        });
        save();
        render();
        toast("COMPLETED CLEARED");
      };
      if (RM || !doomed.length) return done();
      gsap.to(doomed, {
        opacity: 0,
        x: 60,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        stagger: 0.05,
        onComplete: done
      });
    });

    render();
  }

  /* ==========================================================
     MODULE 4 — Oracle
     Deliberately says nothing useful, with total conviction.
     ========================================================== */
  var ANSWERS = [
    "SIGNS POINT TO MAYBE",
    "THE DATA IS INCONCLUSIVE",
    "ALL OUTCOMES REMAIN POSSIBLE",
    "PROBABLY. EVENTUALLY.",
    "THAT DEPENDS ENTIRELY",
    "YES, IN A SENSE",
    "NO, BUT ALSO YES",
    "ASK AGAIN AFTER LUNCH",
    "THE HEART OF THE CARDS IS SILENT",
    "STATISTICALLY SPEAKING, SURE",
    "OUTLOOK: BROADLY FINE",
    "THIS ONE IS ON YOU",
    "CONSULT A LARGER SAMPLE",
    "REPLY HAZY BY DESIGN",
    "TECHNICALLY CORRECT EITHER WAY",
    "THE SIMULATION DECLINES TO COMMENT",
    "CONFIDENCE: HIGH. BASIS: NONE.",
    "SURE, WHY NOT",
    "NOT TODAY. POSSIBLY TOMORROW.",
    "THE ANSWER WAS INSIDE YOU ALL ALONG",
    "MY SOURCES ARE VAGUE",
    "ROUND DOWN AND PROCEED",
    "IT IS WRITTEN. ILLEGIBLY.",
    "ERROR 0X4C55434B — TRY AGAIN"
  ];

  function initAsk() {
    var form = $("#ask-form");
    var input = $("#ask-input");
    var orb = $("#orb");
    var answerEl = $("#orb-answer");
    var logEl = $("#ask-log");
    var busy = false;

    function render() {
      logEl.innerHTML = "";
      state.asks.forEach(function (a) {
        var li = document.createElement("li");
        var q = document.createElement("span");
        q.className = "log-q";
        q.textContent = "› " + a.q;
        var ans = document.createElement("span");
        ans.className = "log-a";
        ans.textContent = a.a;
        li.append(q, ans);
        logEl.appendChild(li);
      });
      stagger(logEl.children, { x: 0, y: -10, duration: 0.3 });
    }

    function consult(question) {
      if (busy) return;
      busy = true;
      buzz(20);

      var answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];

      if (RM) {
        answerEl.textContent = answer;
        commit(question, answer);
        busy = false;
        return;
      }

      orb.classList.add("is-thinking");

      gsap
        .timeline({
          onComplete: function () {
            busy = false;
          }
        })
        /* shake the orb like a real 8-ball */
        .to(orb, {
          keyframes: [
            { x: -9, rotate: -4, duration: 0.07 },
            { x: 9, rotate: 4, duration: 0.07 },
            { x: -7, rotate: -3, duration: 0.07 },
            { x: 7, rotate: 3, duration: 0.07 },
            { x: 0, rotate: 0, duration: 0.1 }
          ]
        })
        .to(answerEl, {
          duration: 0.5,
          scrambleText: { text: "CONSULTING", chars: GLYPHS, speed: 1.6 }
        }, 0)
        .to(orb.querySelector(".orb-core"), { scale: 0.9, duration: 0.2 }, 0)
        .to(orb.querySelector(".orb-core"), { scale: 1, duration: 0.5, ease: "kcSnap" })
        .call(function () {
          orb.classList.remove("is-thinking");
          orb.classList.add("is-revealing");
          var r = orb.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2, 18);
          buzz(30);
        })
        .to(answerEl, {
          duration: 0.85,
          scrambleText: { text: answer, chars: GLYPHS, speed: 0.9 }
        })
        .call(function () {
          orb.classList.remove("is-revealing");
          commit(question, answer);
        });
    }

    function commit(q, a) {
      state.asks.unshift({ q: q, a: a });
      state.asks = state.asks.slice(0, 20);
      save();
      render();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) {
        gsap.fromTo(input, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        return;
      }
      input.value = "";
      input.blur();
      consult(q);
    });

    /* tapping the orb re-rolls the last question */
    orb.addEventListener("click", function () {
      if (busy) return;
      var last = state.asks[0];
      consult(last ? last.q : "…");
    });

    render();
  }

  /* ==========================================================
     Idle ambience — occasional glitch on the header mark
     ========================================================== */
  function initAmbient() {
    if (RM) return;
    var mark = $(".topbar-mark");
    function glitch() {
      gsap
        .timeline({
          onComplete: function () {
            gsap.delayedCall(6 + Math.random() * 10, glitch);
          }
        })
        .to(mark, { opacity: 0.25, x: -2, duration: 0.05 })
        .to(mark, { opacity: 1, x: 2, duration: 0.05 })
        .to(mark, { x: 0, duration: 0.08 });
    }
    gsap.delayedCall(4, glitch);
  }

  /* ==========================================================
     Init
     ========================================================== */
  load();
  initParticles();
  initClock();
  initNav();
  initDice();
  initMemo();
  initTodo();
  initAsk();
  initAmbient();

  /* restore the last module without animating into it */
  if (state.tab !== "dice") {
    var restore = VIEWS.filter(function (v) {
      return v.id === state.tab;
    })[0];
    if (restore) {
      $(".view.is-active").classList.remove("is-active");
      $("#view-" + restore.id).classList.add("is-active");
      document.querySelectorAll(".tab").forEach(function (t) {
        t.classList.toggle("is-active", t.dataset.view === restore.id);
      });
      titleEl.textContent = restore.title;
      subEl.textContent = restore.sub;
    }
  }

  runBoot();

  /* Offline support so the home-screen app opens without a connection */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
