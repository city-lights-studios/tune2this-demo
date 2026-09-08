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

  /* ---- demo forms have no backend ---- */
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
})();
