/* ==========================================================================
   Tune2This — docked player
   ---------------------------------------------------------------------------
   The brief calls for a jukebox that stays with you as you move around the
   site. On a multi-page static site the honest version of that is this: the
   transport docks to the bottom of every page and restores its exact state
   from sessionStorage on the next page load, so the queue and the playhead
   survive navigation.

   True gapless audio across a page load is not possible without a single-page
   shell — see README.md, "The jukebox problem". This component is written so
   that swapping in an SPA shell later means replacing the persistence layer
   and nothing else.

   When a track has an `audio` URL it streams it through a real <audio>
   element. When it does not (the case in this demo, where we hold no
   licensed masters) it runs the same transport on a timer against the known
   duration, and the "Listen in full" button hands off to Spotify or YouTube.
   ========================================================================== */

window.T2TPlayer = (function () {
  'use strict';

  var KEY = 't2t-player-state';
  var catalog = window.TUNE2THIS;
  if (!catalog) return null;

  var el = {};
  var queue = [];
  var index = 0;
  var playing = false;
  var elapsed = 0;
  var ticker = null;
  var audio = null;

  /* ------------------------------------------------------------- state --- */

  function save() {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        queue: queue.map(function (t) { return t.id; }),
        index: index,
        elapsed: elapsed,
        playing: playing
      }));
    } catch (e) { /* private mode — the player just won't survive navigation */ }
  }

  function restore() {
    var raw;
    try { raw = sessionStorage.getItem(KEY); } catch (e) { return false; }
    if (!raw) return false;

    var s;
    try { s = JSON.parse(raw); } catch (e) { return false; }
    if (!s || !s.queue || !s.queue.length) return false;

    queue = s.queue.map(function (id) { return catalog.trackById(id); }).filter(Boolean);
    if (!queue.length) return false;

    index = Math.min(s.index || 0, queue.length - 1);
    elapsed = s.elapsed || 0;
    show();
    render();
    if (s.playing) start();
    return true;
  }

  /* --------------------------------------------------------------- ui ---- */

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function current() { return queue[index] || null; }

  function show() {
    el.root.hidden = false;
    document.body.classList.add('has-player');
  }

  function hide() {
    stop();
    el.root.hidden = true;
    document.body.classList.remove('has-player');
    queue = [];
    try { sessionStorage.removeItem(KEY); } catch (e) {}
  }

  function render() {
    var t = current();
    if (!t) return;

    el.title.textContent = t.title;
    el.artist.textContent = t.artist;
    el.art.src = t.art;
    el.art.alt = t.title + ' — ' + t.artist;
    el.duration.textContent = fmt(t.seconds);
    el.elapsed.textContent = fmt(elapsed);

    var pct = t.seconds ? Math.min(100, (elapsed / t.seconds) * 100) : 0;
    el.fill.style.width = pct + '%';
    el.bar.setAttribute('aria-valuenow', Math.round(pct));

    var out = t.spotify || t.youtube || t.apple;
    if (out) {
      el.out.href = out;
      el.out.hidden = false;
      el.out.textContent = t.spotify ? 'Play on Spotify' : 'Watch on YouTube';
    } else {
      el.out.hidden = true;
    }

    el.root.classList.toggle('is-playing', playing);
    el.toggle.setAttribute('aria-pressed', String(playing));
    el.toggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');

    markTrackRows();
  }

  function markTrackRows() {
    var t = current();
    var rows = document.querySelectorAll('[data-track-row]');
    for (var i = 0; i < rows.length; i++) {
      var isThis = t && rows[i].getAttribute('data-track-row') === t.id;
      rows[i].classList.toggle('is-playing', !!(isThis && playing));
      var btn = rows[i].querySelector('[data-track-play]');
      if (btn) btn.setAttribute('aria-label', (isThis && playing ? 'Pause ' : 'Play ') + (t ? t.title : 'track'));
    }
  }

  /* ---------------------------------------------------------- transport -- */

  function tick() {
    var t = current();
    if (!t) return;
    elapsed += 0.25;
    if (elapsed >= t.seconds) { next(); return; }
    render();
    if (Math.floor(elapsed * 4) % 8 === 0) save();
  }

  function start() {
    var t = current();
    if (!t) return;
    playing = true;

    if (t.audio) {
      if (!audio) { audio = new Audio(); audio.addEventListener('ended', next); }
      if (audio.src !== t.audio) audio.src = t.audio;
      audio.currentTime = elapsed;
      var p = audio.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked; transport still runs */ });
    }

    clearInterval(ticker);
    ticker = setInterval(tick, 250);
    render();
    save();
  }

  function stop() {
    playing = false;
    clearInterval(ticker);
    ticker = null;
    if (audio) audio.pause();
    render();
    save();
  }

  function toggle() { playing ? stop() : start(); }

  function next() {
    if (!queue.length) return;
    index = (index + 1) % queue.length;
    elapsed = 0;
    if (audio) audio.currentTime = 0;
    playing ? start() : render();
    save();
  }

  function prev() {
    if (!queue.length) return;
    /* Standard behaviour: restart the track first, then step back. */
    if (elapsed > 3) { elapsed = 0; playing ? start() : render(); save(); return; }
    index = (index - 1 + queue.length) % queue.length;
    elapsed = 0;
    playing ? start() : render();
    save();
  }

  function seekTo(ratio) {
    var t = current();
    if (!t) return;
    elapsed = Math.max(0, Math.min(t.seconds, ratio * t.seconds));
    if (audio && t.audio) audio.currentTime = elapsed;
    render();
    save();
  }

  /* ------------------------------------------------------------- public -- */

  function load(trackIds, startAt) {
    var list = (trackIds || []).map(function (id) { return catalog.trackById(id); }).filter(Boolean);
    if (!list.length) return;
    queue = list;
    index = Math.max(0, list.findIndex(function (t) { return t.id === startAt; }));
    elapsed = 0;
    show();
    start();
  }

  function playTrack(id, queueIds) {
    var t = current();
    if (t && t.id === id && !el.root.hidden) { toggle(); return; }
    load(queueIds && queueIds.length ? queueIds : [id], id);
  }

  /* --------------------------------------------------------------- init -- */

  function init() {
    el.root = document.getElementById('player');
    if (!el.root) return;

    el.title = document.getElementById('player-title');
    el.artist = document.getElementById('player-artist');
    el.art = document.getElementById('player-art');
    el.elapsed = document.getElementById('player-elapsed');
    el.duration = document.getElementById('player-duration');
    el.fill = document.getElementById('player-fill');
    el.out = document.getElementById('player-out');
    el.bar = el.root.querySelector('.player__bar');
    el.toggle = el.root.querySelector('[data-player-toggle]');

    el.toggle.addEventListener('click', toggle);
    el.root.querySelector('[data-player-next]').addEventListener('click', next);
    el.root.querySelector('[data-player-prev]').addEventListener('click', prev);
    el.root.querySelector('[data-player-close]').addEventListener('click', hide);

    el.root.querySelector('[data-player-open]').addEventListener('click', function () {
      var t = current();
      if (!t) return;
      var a = catalog.artists[t.artistSlug];
      if (a && a.page) window.location.href = a.page;
    });

    el.bar.addEventListener('click', function (e) {
      var r = el.bar.getBoundingClientRect();
      seekTo((e.clientX - r.left) / r.width);
    });

    /* Any element on any page can drive the player:
       <button data-track-play="track-id" data-track-queue="id-a,id-b"> */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-track-play]') : null;
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute('data-track-play');
      var q = btn.getAttribute('data-track-queue');
      playTrack(id, q ? q.split(',') : null);
    });

    /* Space toggles playback unless the user is typing. */
    document.addEventListener('keydown', function (e) {
      if (e.code !== 'Space' || el.root.hidden) return;
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      if (e.target.closest && e.target.closest('button, a')) return;
      e.preventDefault();
      toggle();
    });

    window.addEventListener('pagehide', save);
    restore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { load: load, playTrack: playTrack, toggle: toggle, next: next, prev: prev };
})();
