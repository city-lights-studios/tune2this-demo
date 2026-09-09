/* Tune2This — page behaviour. No dependencies. */
(function () {
  'use strict';

  /* ---- mobile navigation ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  function isMobile() { return window.matchMedia('(max-width: 1060px)').matches; }

  function syncNav() {
    if (!nav || !toggle) return;
    if (isMobile()) {
      nav.hidden = toggle.getAttribute('aria-expanded') !== 'true';
    } else {
      nav.hidden = false;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = !open ? 'Close' : 'Menu';
      syncNav();
    });
    window.addEventListener('resize', syncNav);
    syncNav();
  }

  /* ---- header dropdowns: only one open at a time, close on outside click ---- */
  var drops = Array.prototype.slice.call(document.querySelectorAll('.nav .drop'));
  if (drops.length) {
    drops.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        drops.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.nav .drop')) return;
      if (window.matchMedia('(max-width: 1160px)').matches) return; // mobile: leave expanded
      drops.forEach(function (d) { d.open = false; });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') drops.forEach(function (d) { d.open = false; });
    });
  }

  /* ---- reveal on scroll ---- */
  var targets = document.querySelectorAll('.reveal');
  if (targets.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
  }

  /* ---- hero video: a blocked autoplay must fall back to the poster ---- */
  var heroVideo = document.querySelector('.hero__media video');
  if (heroVideo) {
    var p = heroVideo.play();
    if (p && typeof p.catch === 'function') { p.catch(function () {}); }
  }

  /* ---- tip amount picker (demo only, nothing is charged) ---- */
  var tipbox = document.querySelector('[data-tip]');
  if (tipbox) {
    var buttons = tipbox.querySelectorAll('.tip-amounts button');
    var readout = tipbox.querySelector('[data-tip-readout]');
    var TIERS = [
      { at: 0,   name: 'Listener' },
      { at: 5,   name: 'Roadie' },
      { at: 25,  name: 'Session Player' },
      { at: 100, name: 'Headliner' },
      { at: 500, name: 'Big Spender' }
    ];
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(buttons, function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var amount = parseFloat(btn.getAttribute('data-amount')) || 0;
        var tier = TIERS[0];
        TIERS.forEach(function (t) { if (amount >= t.at) tier = t; });
        if (readout) {
          readout.innerHTML = '$' + amount.toFixed(2) + ' puts you at <strong class="hl">' +
            tier.name + '</strong> on this artist’s board.';
        }
      });
    });
  }

  /* ---- intake forms: real delivery (Phase 0) ----
     Uses T2T_CONFIG.formEndpoint when set; otherwise falls back to mailto so
     the form still does something today. Login forms (data-demo-form) stay
     inert — we never email a password. */
  var cfg = window.T2T_CONFIG || {};
  function t2tSerialize(form) {
    var o = {}; new FormData(form).forEach(function (v, k) { o[k] = v; }); return o;
  }
  function t2tMsg(form, text) {
    var out = form.querySelector('[data-demo-form-message]');
    if (!out) return;
    out.textContent = text; out.hidden = false;
    out.setAttribute('tabindex', '-1'); out.focus();
  }
  Array.prototype.forEach.call(document.querySelectorAll('form[data-lead-form]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var label = form.getAttribute('data-lead-form') || 'Website form';
      var data = t2tSerialize(form);
      if (cfg.formEndpoint) {
        var payload = Object.assign({ _subject: 'Tune2This — ' + label, form: label }, data);
        if (cfg.formService === 'web3forms') payload.access_key = cfg.web3formsKey;
        t2tMsg(form, 'Sending…');
        fetch(cfg.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (r) {
          if (r.ok) { t2tMsg(form, 'Thanks — your message was sent. We’ll be in touch.'); form.reset(); }
          else { t2tMsg(form, 'Sorry, that didn’t go through. Please email ' + (cfg.contactEmail || '') + '.'); }
        }).catch(function () {
          t2tMsg(form, 'Sorry, that didn’t go through. Please email ' + (cfg.contactEmail || '') + '.');
        });
      } else {
        var to = cfg.contactEmail || '';
        var body = Object.keys(data).map(function (k) { return k + ': ' + data[k]; }).join('\n');
        window.location.href = 'mailto:' + to + '?subject=' +
          encodeURIComponent('Tune2This — ' + label) + '&body=' + encodeURIComponent(body);
        t2tMsg(form, 'Your email app should open with the message ready to send.');
      }
    });
  });

  /* ---- login forms stay inert until real accounts exist (Phase 1) ---- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-demo-form]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = form.querySelector('[data-demo-form-message]');
      if (out) { out.hidden = false; out.setAttribute('tabindex', '-1'); out.focus(); }
    });
  });

  /* ---- footer year ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- charts: current week label ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-week]'), function (el) {
    el.textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  });
})();
