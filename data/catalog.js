/* ==========================================================================
   Tune2This — demo catalog
   ---------------------------------------------------------------------------
   This is the single place the demo gets its music from. Swap the objects
   here and the home page, radio, artist pages and the docked player all
   follow. In a real build this comes from an API instead.

   `audio` is intentionally null on every track. We do not have licensed
   masters on hand for this demo, so the docked player runs a real transport
   against the known track duration and hands off to the official Spotify or
   YouTube player for actual listening. Drop an MP3 URL into `audio` and the
   docked player will stream it instead — no other change needed.
   ========================================================================== */

window.TUNE2THIS = (function () {
  'use strict';

  var artists = {
    gdvo: {
      slug: 'gdvo',
      name: 'The GDVO',
      full: 'The Guy Daniel Vastola Organization',
      line: 'R&B / Soul · Farmingdale, NJ',
      art: 'img/city-lights-recording-studio-owner-at-neve-console-768w.webp',
      page: 'artist-gdvo.html',
      status: 'signed'
    },
    radio: {
      slug: 'radio',
      name: 'Tune2This Radio',
      full: 'Tune2This Radio',
      line: 'Curated rotation',
      art: 'img/city-lights-recording-studio-neve-vr60-console-with-daw-480w.webp',
      page: 'radio.html',
      status: 'house'
    }
  };

  /* Verified releases. Everything below was confirmed against Apple Music,
     Spotify and the 2021 press for the original single. */
  var tracks = [
    {
      id: 'gdvo-peace-philly-funk',
      title: 'Peace (The Instant Philly Funk Mix)',
      artist: 'The GDVO',
      artistSlug: 'gdvo',
      art: 'img/city-lights-recording-studio-owner-at-neve-console-480w.webp',
      seconds: 180,
      released: '2025-08-22',
      genre: 'R&B / Soul',
      copyright: '℗ 2025 Dance Plant Records Inc.',
      price: 0.99,
      audio: null,
      spotify: 'https://open.spotify.com/track/1NGjZodgtpC6llZiiLQTZ5',
      spotifyEmbed: 'https://open.spotify.com/embed/track/1NGjZodgtpC6llZiiLQTZ5?utm_source=generator&theme=0',
      youtube: 'https://www.youtube.com/watch?v=p9ZGvty5-Ro',
      apple: 'https://music.apple.com/us/album/peace-the-instant-philly-funk-mix-single/1838361342',
      note: 'The funk remix of the debut single. Cut at City Lights.'
    },
    {
      id: 'gdvo-peace-original',
      title: 'Peace (feat. The Chi-Lites & Denroy Morgan)',
      artist: 'The GDVO',
      artistSlug: 'gdvo',
      art: 'img/city-lights-recording-studio-control-room-wide-neve-vr60-480w.webp',
      seconds: 231,
      released: '2021-01-20',
      genre: 'R&B / Soul',
      copyright: 'Written by Guy Daniel',
      price: 0.99,
      audio: null,
      spotify: 'https://open.spotify.com/track/2PxIuf3raBnR2DBbSeHOiR',
      spotifyEmbed: 'https://open.spotify.com/embed/track/2PxIuf3raBnR2DBbSeHOiR?utm_source=generator&theme=0',
      youtube: 'https://www.youtube.com/watch?v=eRzjMJw3BNo',
      apple: null,
      note: 'The original. Recorded between City Lights in New Jersey and Chicago.'
    }
  ];

  /* Rotation slots with no master yet. Rendered visibly empty on purpose —
     this is the list Guy needs to fill, not filler to hide behind. */
  var openSlots = [
    { label: 'Rotation slot 03', need: 'Roster artist · master + artwork + splits' },
    { label: 'Rotation slot 04', need: 'Roster artist · master + artwork + splits' },
    { label: 'Rotation slot 05', need: 'City Lights session cut · clearance needed' },
    { label: 'Rotation slot 06', need: 'Roster artist · master + artwork + splits' }
  ];

  var bundles = [
    { id: 'gdvo-peace-pair', title: 'Peace — both mixes', artist: 'The GDVO', price: 2.99, count: 2 }
  ];

  return {
    artists: artists,
    tracks: tracks,
    openSlots: openSlots,
    bundles: bundles,
    trackById: function (id) {
      for (var i = 0; i < tracks.length; i++) { if (tracks[i].id === id) return tracks[i]; }
      return null;
    },
    tracksByArtist: function (slug) {
      return tracks.filter(function (t) { return t.artistSlug === slug; });
    }
  };
})();
